/* Pending edits store, community-edit increment.

   When a contributor submits an edit it does NOT change the live record.
   It goes into a pending state, keyed by deviceId → fieldKey, and waits to
   be reviewed on GitHub before going live. The detail page in READ mode
   always renders the approved record (window.DEVICES); only EDIT mode shows
   pending values, locked, with a "waiting for review" treatment.

   Source of truth is localStorage ('devicedb.pendingEdits.v1'), hydrated
   from window.PENDING_SEED (data.js) the first time. A tiny pub/sub lets
   usePending() re-render consumers when a submission lands.

   Field-key vocabulary (one identity per editable thing):
     name · summary · photos · description · instructions
     spec:<categoryKey> · ecosystems · protocols · dimensions
     identifiers · references
   These keys are shared by the pending store, the diff, and the editors.
*/

// ─────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────
const PENDING_KEY = 'devicedb.pendingEdits.v1';
const _pendingListeners = new Set();

function _seedClone() {
  const seed = (typeof window !== 'undefined' && window.PENDING_SEED) || {};
  try { return JSON.parse(JSON.stringify(seed)); } catch (e) { return {}; }
}
function _readPendingStore() {
  try {
    const v = localStorage.getItem(PENDING_KEY);
    if (v === null) return _seedClone();
    return JSON.parse(v) || {};
  } catch (e) {
    return _seedClone();
  }
}
let _pendingCache = _readPendingStore();

function _writePendingStore(next) {
  _pendingCache = next;
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(next)); } catch (e) {}
  _pendingListeners.forEach((fn) => fn());
}

function getPending(deviceId) {
  return (_pendingCache && _pendingCache[deviceId]) || {};
}
function pendingCount(deviceId) {
  return Object.keys(getPending(deviceId)).length;
}
function isFieldPending(deviceId, fieldKey) {
  return Object.prototype.hasOwnProperty.call(getPending(deviceId), fieldKey);
}
function getPendingField(deviceId, fieldKey) {
  return getPending(deviceId)[fieldKey] || null;
}

// Add a batch of pending entries.
//   entries: { [fieldKey]: { value, source? } }
//   meta:    { by?, at? }   (defaults to current user / now)
function addPendingEdit(deviceId, entries, meta) {
  const by = (meta && meta.by) || (typeof window !== 'undefined' && window.CURRENT_USER) || null;
  const at = (meta && meta.at) || new Date().toISOString();
  const next = { ..._pendingCache };
  const cur = { ...(next[deviceId] || {}) };
  Object.keys(entries).forEach((k) => {
    const e = entries[k] || {};
    cur[k] = { value: e.value, by, at };
    if (e.source) cur[k].source = e.source;
  });
  next[deviceId] = cur;
  _writePendingStore(next);
}

// Used only by the (intentionally hidden) reset path, clears a device's
// pending edits. Reject-to-revert in the real product would call this per
// field; the demo treats pending as terminal so nothing surfaces it.
function clearPending(deviceId, fieldKey) {
  const next = { ..._pendingCache };
  if (!next[deviceId]) return;
  if (fieldKey) {
    const cur = { ...next[deviceId] };
    delete cur[fieldKey];
    if (Object.keys(cur).length) next[deviceId] = cur; else delete next[deviceId];
  } else {
    delete next[deviceId];
  }
  _writePendingStore(next);
}

function usePending(deviceId) {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    _pendingListeners.add(force);
    return () => { _pendingListeners.delete(force); };
  }, []);
  return getPending(deviceId);
}

// ─────────────────────────────────────────────────────────────────────
// Field-key vocabulary + accessors over a device / draft object
// ─────────────────────────────────────────────────────────────────────
function contributorFieldKeys(device) {
  const cat = (window.CATEGORY_SPECS && window.CATEGORY_SPECS[device.category]) || [];
  return [
    'name', 'summary', 'photos', 'description', 'instructions',
    ...cat.map((f) => 'spec:' + f.key),
    'ecosystems', 'connectivity', 'protocols', 'bridge', 'connectsWith', 'dimensions', 'customFields', 'identifiers', 'references', 'msrp'
  ];
}

function getField(obj, key) {
  if (!obj) return undefined;
  if (key.indexOf('spec:') === 0) {
    const k = key.slice(5);
    return obj.specs && obj.specs.cat ? obj.specs.cat[k] : undefined;
  }
  switch (key) {
    case 'description': return obj.description;
    case 'instructions': return obj.instructions;
    case 'ecosystems': return obj.specs && obj.specs.ecosystems;
    case 'connectsWith': return obj.specs && obj.specs.connectsWith;
    case 'connectivity': return obj.specs && obj.specs.connectivity;
    case 'protocols': return obj.specs && obj.specs.protocols;
    case 'bridge': return obj.specs && obj.specs.bridge;
    case 'dimensions': return obj.specs && obj.specs.dimensions;
    case 'customFields': return obj.specs && obj.specs.customFields;
    case 'identifiers': return obj.specs && obj.specs.identifiers;
    case 'references': return obj.specs && obj.specs.references;
    default: return obj[key];
  }
}

// Write a field value back into a draft object (immutably-ish, mutates a
// shallow-cloned specs subtree). Returns the new draft.
function setField(draft, key, value) {
  const next = { ...draft };
  if (key.indexOf('spec:') === 0) {
    const k = key.slice(5);
    const specs = { ...(next.specs || {}) };
    specs.cat = { ...(specs.cat || {}), [k]: value };
    next.specs = specs;
    return next;
  }
  switch (key) {
    case 'description': next.description = value; return next;
    case 'instructions': next.instructions = value; return next;
    case 'ecosystems': case 'connectsWith': case 'protocols': case 'dimensions':
    case 'identifiers': case 'references': case 'connectivity': case 'bridge': case 'customFields': {
      const specs = { ...(next.specs || {}) };
      specs[key] = value;
      next.specs = specs;
      return next;
    }
    default: next[key] = value; return next;
  }
}

function _normVal(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.length === 0 ? '' : JSON.stringify(v);
  if (typeof v === 'object') { try { return JSON.stringify(v); } catch (e) { return String(v); } }
  return String(v);
}

// Custom fields only count once they carry both a label and a value. Blank or
// half-filled rows (a freshly added row, or a label with no value yet) are
// dropped, so they neither register as an edit nor get saved into a proposal.
function cleanCustomFields(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((r) => {
      const type = r && (r.type === 'number' || r.type === 'bool') ? r.type : 'text';
      const label = r && r.label != null ? String(r.label).trim() : '';
      let value;
      if (type === 'bool') {
        value = r && (r.value === true || r.value === false) ? r.value : undefined;
      } else if (type === 'number') {
        const n = r ? Number(r.value) : NaN;
        value = r && r.value !== '' && r.value != null && !Number.isNaN(n) ? n : undefined;
      } else {
        value = r && r.value != null ? String(r.value).trim() : '';
      }
      return { label, value, type };
    })
    .filter((r) => {
      if (!r.label) return false;
      if (r.type === 'bool') return r.value === true || r.value === false;
      if (r.type === 'number') return typeof r.value === 'number';
      return r.value !== '';
    });
}

// Which contributor fields differ between the approved record and the draft.
function cleanBridge(v) {
  if (!v || typeof v !== 'object') return v;
  const p = v.proprietary;
  const arr = (Array.isArray(p) ? p : (p ? [p] : []))
    .map((x) => (x == null ? '' : String(x)).trim())
    .filter(Boolean);
  const next = { ...v };
  if (arr.length) next.proprietary = arr; else delete next.proprietary;
  return next;
}
function diffContributorFields(device, draft) {
  const changed = [];
  contributorFieldKeys(device).forEach((key) => {
    let a = getField(device, key);
    let b = getField(draft, key);
    if (key === 'customFields') { a = cleanCustomFields(a); b = cleanCustomFields(b); }
    if (key === 'bridge') { a = cleanBridge(a); b = cleanBridge(b); }
    if (_normVal(a) !== _normVal(b)) changed.push(key);
  });
  return changed;
}

// Does this account have any way to be notified when an edit is reviewed?
function hasNotificationMethod(user) {
  if (!user) return false;
  return !!(user.gh || user.email || (user.notifyEmail && user.notifyEmail.trim()));
}

Object.assign(window, {
  getPending, pendingCount, isFieldPending, getPendingField,
  addPendingEdit, clearPending, usePending,
  contributorFieldKeys, getField, setField, diffContributorFields, cleanCustomFields, cleanBridge,
  hasNotificationMethod
});
