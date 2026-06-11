/* Draft store, community-edit increment (Stage 3, "A").

   A draft is a contributor's in-progress edit to ONE device that has NOT
   been submitted for review yet. A draft belongs to the contributor's account,
   so it follows them to any device they sign in on, and never touches the live
   record until submitted. (In this prototype the account-synced store is
   simulated with localStorage keyed to the signed-in account; a real backend
   would persist it server-side.) It sits one layer *below* the pending store:

     live  (approved record)  →  draft (started, local)  →  pending (in review)

   EditMode autosaves the device's changed contributor fields here on every
   keystroke, and restores them when the contributor re-opens the device.
   Submitting or discarding clears the device's draft. Pending fields are
   locked, so a draft only ever holds fields that are still editable.

   Shape (keyed by deviceId):
     { [deviceId]: { fields: { [fieldKey]: value }, sources?, at, by } }

   `fields` uses the same field-key vocabulary as the pending store
   (pending-edits.jsx), so getField / setField / diffContributorFields all
   apply unchanged.

   The account-synced backend is the source of truth: the store hydrates from
   window.DRAFTS_SEED (data.js) the first time, then persists to localStorage
   ('devicedb.drafts.v1') as this prototype's stand-in for server storage,
   exactly like the pending store. A tiny pub/sub (same shape as the pending +
   auth stores) re-renders consumers when a draft is written or cleared, so the
   resume banner, the contributor profile, and the changes tray all stay in
   sync. */

const DRAFTS_KEY = 'devicedb.drafts.v1';
const _draftListeners = new Set();

// Hydrate from the mocked backend (window.DRAFTS_SEED) the first time, then
// persist locally — mirrors the pending store. Uniquely named so it doesn't
// collide with pending-edits.jsx's own seed-clone in the shared global scope.
function _draftSeedClone() {
  const seed = (typeof window !== 'undefined' && window.DRAFTS_SEED) || {};
  try { return JSON.parse(JSON.stringify(seed)); } catch (e) { return {}; }
}
function _readDraftStore() {
  try {
    const v = localStorage.getItem(DRAFTS_KEY);
    if (v === null) return _draftSeedClone();
    return JSON.parse(v) || {};
  } catch (e) {
    return _draftSeedClone();
  }
}
let _draftCache = _readDraftStore();

function _writeDraftStore(next) {
  _draftCache = next;
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(next)); } catch (e) { /* private mode */ }
  _draftListeners.forEach((fn) => fn());
}

// A draft belongs to the contributor who started it. Reads are scoped to the
// signed-in account so one person's unsubmitted edit never surfaces for
// another (the resume banner, changes tray, profile + Your changes all read
// through here). Legacy drafts saved before authorship was recorded adopt the
// current user. Signed out, nothing is "yours".
function _ownsEntry(entry) {
  const me = (typeof window !== 'undefined' && window.CURRENT_USER) || null;
  if (!me || !entry) return false;
  return !entry.by || entry.by === me;
}

// Every device with a draft authored by the current user → { [deviceId]: entry }.
function allDrafts() {
  const map = _draftCache || {};
  const out = {};
  Object.keys(map).forEach((id) => { if (_ownsEntry(map[id])) out[id] = map[id]; });
  return out;
}
function getDraft(deviceId) {
  const e = (_draftCache && _draftCache[deviceId]) || null;
  return _ownsEntry(e) ? e : null;
}
function getDraftFields(deviceId) {
  const d = getDraft(deviceId);
  return d && d.fields ? d.fields : null;
}
function hasDraft(deviceId) {
  const f = getDraftFields(deviceId);
  return !!(f && Object.keys(f).length);
}
function draftFieldCount(deviceId) {
  const f = getDraftFields(deviceId);
  return f ? Object.keys(f).length : 0;
}
function draftDeviceCount() {
  return Object.keys(allDrafts()).length;
}

// Write (or replace) the draft for a device. `fields` is the map of changed
// contributor fields → their working values. Passing an empty map clears the
// draft (no point persisting "no changes"). `meta.sources` optionally carries
// the trusted-source provenance the contributor applied, so it survives a
// reload alongside the values.
function setDraft(deviceId, fields, meta) {
  const keys = Object.keys(fields || {});
  if (keys.length === 0) { clearDraft(deviceId); return; }
  const by = (meta && meta.by) || (typeof window !== 'undefined' && window.CURRENT_USER) || null;
  const next = { ..._draftCache };
  next[deviceId] = {
    fields: { ...fields },
    at: (meta && meta.at) || new Date().toISOString(),
    by,
    ...(meta && meta.sources ? { sources: meta.sources } : {})
  };
  _writeDraftStore(next);
}

function clearDraft(deviceId) {
  if (!_draftCache[deviceId]) return;
  const next = { ..._draftCache };
  delete next[deviceId];
  _writeDraftStore(next);
}

function useDrafts() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    _draftListeners.add(force);
    return () => { _draftListeners.delete(force); };
  }, []);
  return _draftCache;
}

Object.assign(window, {
  allDrafts, getDraft, getDraftFields, hasDraft,
  draftFieldCount, draftDeviceCount,
  setDraft, clearDraft, useDrafts
});
