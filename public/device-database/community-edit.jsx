/* Community-edit increment, shared components.

   All the additive UI for increment 02 lives here so detail.jsx, browse.jsx,
   shared.jsx etc. can pull pieces without each one growing. The pieces:

   - useIncrement(key)  , reactive "is this increment on?" by watching
                           <html data-inc-…>. Updates live when the canvas
                           sidebar toggles increments via postMessage.
   - useCurrentUser()   , the demo's signed-in user (window.CURRENT_USER).
   - Avatar             , initials avatar bubble; falls back to "?" if no user.
   - PhotoPlaceholder   , styled SVG "studio photo" used in lieu of real
                           images while we wait for sourced photos.
   - PhotoGallery       , main image + thumb strip; handles both real
                           URLs (rendered as <img>) and placeholder keys.
   - EditAttribution    , small "Last edited X ago by @user" line.
   - EditHistoryPanel   , expandable list of past edits with what changed.
   - relTime / formatDate, date helpers (relative for the lede, absolute
                           for the panel).
*/

// ─────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────

function useIncrement(key) {
  // Reactive read of <html data-inc-<key>>. Re-renders when the
  // canvas sidebar broadcasts a state change via postMessage (which
  // mutates the attribute through the index.html boot script).
  const attr = 'data-inc-' + key;
  const [on, setOn] = React.useState(
    () => document.documentElement.getAttribute(attr) === 'on'
  );
  React.useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setOn(el.getAttribute(attr) === 'on');
    });
    obs.observe(el, { attributes: true, attributeFilter: [attr] });
    return () => obs.disconnect();
  }, [attr]);
  return on;
}

// ─────────────────────────────────────────────────────────────────
// Auth store (demo). Source of truth is window.CURRENT_USER, persisted
// to localStorage so sign-in / sign-out survive reloads. A tiny pub/sub
// lets useCurrentUser() re-render every consumer when auth changes.
// ─────────────────────────────────────────────────────────────────
const AUTH_KEY = 'devicedb.currentUser';
const _authListeners = new Set();

function readAuth() {
  const fallback = (typeof window !== 'undefined' && window.CURRENT_USER) || null;
  try {
    const v = localStorage.getItem(AUTH_KEY);
    if (v === null) return fallback;
    if (v === '') return null; // explicitly signed out
    // Guard against a stale id from a previous demo build (e.g. renamed keys).
    const users = (typeof window !== 'undefined' && window.USERS) || {};
    return users[v] ? v : fallback;
  } catch (e) {
    return fallback;
  }
}

function setCurrentUser(id) {
  window.CURRENT_USER = id || null;
  try { localStorage.setItem(AUTH_KEY, id || ''); } catch (e) {}
  _authListeners.forEach((fn) => fn());
}

// Demo sign-in defaults to the canonical demo account; sign-out clears it.
// Resolve to a real account so a bad/renamed id can't sign you into a
// nonexistent user (which silently reads back as signed-out).
function signIn(id) {
  const users = (typeof window !== 'undefined' && window.USERS) || {};
  const fallback = users['robinhass'] ? 'robinhass' : (Object.keys(users)[0] || null);
  setCurrentUser(id && users[id] ? id : fallback);
}
function signOut() { setCurrentUser(null); }

// ─────────────────────────────────────────────────────────────────
// Account creation + onboarding (demo).
//
// window.USERS (from data.js) is in-memory only; the auth store persists
// just the current-user id. So a freshly created account would vanish on
// reload. We keep a small map of demo-created accounts in localStorage and
// merge it back into window.USERS at load, so signing up survives refresh.
//
// A new account carries __needsOnboarding until the contributor finishes
// the onboarding step (display name, how-we-reach-you, visibility). Seeded
// accounts never carry the flag, so signing in as the demo account never
// re-triggers onboarding.
// ─────────────────────────────────────────────────────────────────
const ACCOUNTS_KEY = 'devicedb.accounts.v1';
function loadStoredAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; }
  catch (e) { return {}; }
}
function persistStoredAccount(id, account) {
  try {
    const map = loadStoredAccounts();
    map[id] = account;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(map));
  } catch (e) { /* private mode — in-memory account still works this session */ }
}
// Merge any previously created accounts into USERS before auth resolves.
if (typeof window !== 'undefined' && window.USERS) {
  const stored = loadStoredAccounts();
  Object.keys(stored).forEach((id) => { if (!window.USERS[id]) window.USERS[id] = stored[id]; });
}

const _today = () => new Date().toISOString().slice(0, 10);
function _slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
// Simulated identities a provider hands back. Email/passkey carry no
// pre-filled identity (the contributor supplies it during onboarding).
function providerIdentity(method, fields) {
  fields = fields || {};
  if (method === 'github') {
    return { name: 'Sam Rivera', gh: 'samriv', email: 'samriv@users.noreply.github.com' };
  }
  if (method === 'email') {
    return { email: (fields.email || '').trim(), hasPassword: true };
  }
  // passkey: nothing identifying yet
  return {};
}

// Does the identity a provider just handed back already map to an account?
// This is what separates a returning contributor from a brand-new one: a
// matching GitHub handle or email means "sign them in", not "create another".
// (A passkey resolves to its own credential in a real system; the demo has no
// identifying info for it, so it always reads as new.)
function findAccountByIdentity(method, fields) {
  const users = (typeof window !== 'undefined' && window.USERS) || {};
  const id = providerIdentity(method, fields);
  if (id.gh) {
    const h = Object.keys(users).find((k) => users[k].gh === id.gh);
    if (h) return h;
  }
  if (id.email) {
    const want = id.email.toLowerCase();
    const h = Object.keys(users).find((k) => (users[k].email || '').toLowerCase() === want);
    if (h) return h;
  }
  return null;
}

// Create a brand-new contributor account for the chosen sign-up method,
// sign in as it, and flag it for onboarding. Returns the new account id.
function createAccount(method, fields) {
  const users = (typeof window !== 'undefined' && window.USERS) || {};
  const id = providerIdentity(method, fields);
  // Derive a stable handle from whatever identifying info we have.
  let base = _slugify(id.gh || (id.email ? id.email.split('@')[0] : (fields && fields.name)) || 'contributor') || 'contributor';
  let handle = base, n = 2;
  while (users[handle]) { handle = base + '-' + n; n++; }
  const account = {
    name: id.name || (fields && fields.name) || '',
    ...(id.gh ? { gh: id.gh } : {}),
    ...(id.email ? { email: id.email } : {}),
    ...(id.hasPassword ? { hasPassword: true } : {}),
    ...(method === 'passkey' ? { passkeys: [{ id: 'pk' + Date.now(), label: 'This device', added: _today() }] } : {}),
    __method: method,
    __needsOnboarding: true
  };
  users[handle] = account;
  persistStoredAccount(handle, account);
  setCurrentUser(handle);
  return handle;
}

// Apply the onboarding answers to the current account and clear the flag.
function completeOnboarding(patch) {
  const id = (typeof window !== 'undefined' && window.CURRENT_USER) || null;
  const users = (typeof window !== 'undefined' && window.USERS) || {};
  const u = id && users[id];
  if (!u) return;
  Object.assign(u, patch || {});
  delete u.__needsOnboarding;
  persistStoredAccount(id, u);
  _authListeners.forEach((fn) => fn());
}

function needsOnboarding(user) { return !!(user && user.__needsOnboarding); }

// Resolve the persisted auth state at load (overrides data.js's default).
if (typeof window !== 'undefined') window.CURRENT_USER = readAuth();

function useCurrentUser() {
  // Subscribe to the auth store so sign-in / sign-out re-render us.
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    _authListeners.add(force);
    return () => { _authListeners.delete(force); };
  }, []);
  const id = (typeof window !== 'undefined' && window.CURRENT_USER) || null;
  const users = (typeof window !== 'undefined' && window.USERS) || {};
  return id ? users[id] : null;
}

function getUser(handleOrId) {
  const users = (typeof window !== 'undefined' && window.USERS) || {};
  return users[handleOrId] || null;
}

// ─────────────────────────────────────────────────────────────────
// Resolve how a contributor should be shown anywhere their edits are
// attributed. A private contributor is anonymised to a single generic
// "Private contributor" identity (no name, no avatar, no profile link)
// for everyone EXCEPT themselves — you always see your own edits in full.
// Profile links also require the Contributor-profiles increment: with it
// off there are no public profiles, so attribution shows as plain text.
// Returns { user, isSelf, hidden, name, href }. When href is null, render
// the name as plain text and pass anon to <Avatar> when hidden.
// ─────────────────────────────────────────────────────────────────
function contributorDisplay(handleOrId) {
  const user = getUser(handleOrId);
  const isSelf = handleOrId === (typeof window !== 'undefined' && window.CURRENT_USER);
  const hidden = !!(user && user.private) && !isSelf;
  const profilesOn = typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-inc-contributor-profiles') === 'on';
  return {
    user: hidden ? null : user,
    isSelf,
    hidden,
    name: hidden ? 'Private contributor' : (user ? user.name : handleOrId),
    href: (hidden || !profilesOn) ? null : ('#/contributors/' + handleOrId)
  };
}

// ─────────────────────────────────────────────────────────────────────
// Nav primary-action store. The device detail / edit pages publish their
// primary action (Edit, or Submit for review) here once their in-page
// button scrolls out of view, so the top nav can surface it beside the
// avatar. Same tiny pub/sub shape as the auth store.
// ─────────────────────────────────────────────────────────────────────
let _navAction = null;
const _navActionSubs = new Set();
function setNavAction(a) {
  _navAction = a;
  _navActionSubs.forEach((f) => f());
}
// Clear only if the current action belongs to this owner, so a parent
// (Detail) disabling its anchor can't wipe a child (EditMode)'s action.
function clearNavAction(owner) {
  if (_navAction && _navAction._owner === owner) setNavAction(null);
}
function useNavAction() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    _navActionSubs.add(force);
    return () => { _navActionSubs.delete(force); };
  }, []);
  return _navAction;
}
// Attach the returned ref to the in-page action element. While that element
// is scrolled out of view (above the viewport / under the sticky nav), the
// given action is published to the nav; otherwise the nav slot is cleared.
// Pass null to disable (e.g. when signed out).
function useNavActionAnchor(action) {
  const ref = React.useRef(null);
  const actionRef = React.useRef(action);
  actionRef.current = action;
  const ownerRef = React.useRef({});
  const [pinned, setPinned] = React.useState(false);
  const enabled = !!action;
  const label = action ? action.label : null;
  React.useEffect(() => {
    if (!enabled) { setPinned(false); return; }
    const el = ref.current;
    if (!el) return;
    // Pin once the in-page action reaches the sticky nav (72px) with a small
    // head start, so the nav copy appears promptly rather than only after the
    // button has fully scrolled away.
    const update = () => {
      const r = el.getBoundingClientRect();
      setPinned(r.bottom <= 96);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [enabled]);
  React.useEffect(() => {
    const owner = ownerRef.current;
    if (enabled && pinned) {
      const a = actionRef.current;
      setNavAction({
        _owner: owner,
        label: a.label,
        variant: a.variant,
        onClick: () => { const x = actionRef.current; if (x && x.onClick) x.onClick(); },
      });
    } else {
      clearNavAction(owner);
    }
    return () => clearNavAction(owner);
  }, [enabled, pinned, label]);
  return ref;
}

// ─────────────────────────────────────────────────────────────────────
// useStuckBar — drives the "stuck" state of a bottom-sticky action bar.
// Returns [barRef, sentinelRef, stuck]. Render the sentinel element
// immediately AFTER the bar in the DOM. `stuck` is true only while the bar
// is floating over scrollable content (a hairline/divider should show), and
// flips to false once the bar settles at the end of its container (the
// sentinel scrolls into view), so the bar reads as part of the page.
function useStuckBar() {
  const barRef = React.useRef(null);
  const sentinelRef = React.useRef(null);
  const [stuck, setStuck] = React.useState(false);
  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => setStuck(!entries[0].isIntersecting),
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);
  return [barRef, sentinelRef, stuck];
}

// ─────────────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────────────

function relTime(input) {
  if (!input) return null;
  const then = new Date(input);
  if (isNaN(then)) return null;
  const diff = Date.now() - then.getTime();
  const day = 24 * 3600 * 1000;
  const hours = Math.round(diff / (3600 * 1000));
  const days = Math.round(diff / day);
  if (hours < 1) return 'just now';
  if (hours < 24) return hours + 'h ago';
  if (days < 14) return days + ' day' + (days === 1 ? '' : 's') + ' ago';
  if (days < 60) return Math.round(days / 7) + ' weeks ago';
  if (days < 365) return Math.round(days / 30) + ' months ago';
  return Math.round(days / 365) + ' years ago';
}

function formatDate(input) {
  if (!input) return '';
  const d = new Date(input);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Absolute date + time of day, for the detailed edit-history dialog. Falls
// back to date-only if the value carries no clock component.
function formatDateTime(input) {
  if (!input) return '';
  const d = new Date(input);
  if (isNaN(d)) return '';
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const hasTime = typeof input === 'string' && input.indexOf('T') !== -1;
  if (!hasTime) return datePart;
  const timePart = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return datePart + ' · ' + timePart;
}

// Smart inline date: month + day, and the year ONLY when it isn't the current
// year (an older edit is the "extra detail" that warrants showing the year).
// No time — that lives in the detail panel and the hover tooltip.
function formatDateShort(input) {
  if (!input) return '';
  const d = new Date(input);
  if (isNaN(d)) return '';
  const opts = { month: 'short', day: 'numeric' };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString('en-US', opts);
}

// ─────────────────────────────────────────────────────────────────────
// Avatar, initials bubble
// ─────────────────────────────────────────────────────────────────────

function Avatar({ user, size = 24, anon = false, ...rest }) {
  // Anonymised stand-in for a private contributor: a neutral locked bubble.
  if (anon) {
    return (
      <span
        className="ce-avatar ce-avatar-anon"
        style={{ width: size, height: size }}
        aria-label="Private contributor"
        title="Private contributor"
        {...rest}>
        <Icon name="lock" size={Math.round(size * 0.42)} strokeWidth={2.25} />
      </span>
    );
  }
  if (!user) {
    return (
      <span className="ce-avatar ce-avatar-empty" style={{ width: size, height: size }} aria-hidden="true" {...rest}>?</span>
    );
  }
  // A real profile picture (data URL or path) takes precedence over initials.
  if (user.photo) {
    return (
      <span
        className="ce-avatar ce-avatar-photo"
        style={{ width: size, height: size }}
        aria-label={user.name}
        title={user.name}
        {...rest}>

        <img src={user.photo} alt="" />
      </span>);

  }
  const initials = (user.name || '?')
    .trim()
    .charAt(0)
    .toUpperCase() || '?';
  return (
    <span
      className="ce-avatar"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      aria-label={user.name}
      title={user.name}
      {...rest}>

      {initials}
    </span>);

}

// ─────────────────────────────────────────────────────────────────────
// Photo placeholder + gallery
// ─────────────────────────────────────────────────────────────────────

// Deterministic "studio photo" SVG. Soft tinted background that varies
// by the placeholder key so the same device renders consistent photos.
// The device's CategoryGlyph sits centered with a soft drop shadow so
// the result reads as a posed product shot, not "missing image."
function PhotoPlaceholder({ id, category, alt }) {
  // Hash the id to pick a stable variant per photo.
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const v = Math.abs(hash);
  // 3 background tints (warm paper variations) keyed off the hash.
  const tints = [
    { from: 'var(--surface-tint-soft)', to: 'var(--surface-tint-mid)' },
    { from: 'var(--surface-tint-mid)', to: 'var(--surface-tint-strong)' },
    { from: 'var(--surface-tint-soft)', to: 'var(--surface-tint-strong)' }];

  const tint = tints[v % tints.length];
  // Slight glyph offset to suggest a different angle per shot.
  const xOff = ((v >> 4) % 3 - 1) * 18; // -18 / 0 / +18 px
  const yOff = ((v >> 6) % 3 - 1) * 12;
  const rot = ((v >> 8) % 3 - 1) * 4; // -4 / 0 / +4 deg
  const gradId = 'ce-ph-grad-' + Math.abs(hash);

  // We render the glyph at ~46% of the box size. The category glyph is
  // available from icons.jsx via <CategoryGlyph>; if it's not loaded
  // we fall back to a generic "cube" outline.
  const Glyph = window.CategoryGlyph;

  return (
    <div className="ce-photo-placeholder" role="img" aria-label={alt || 'Device photo'}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}>

        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tint.from} />
            <stop offset="100%" stopColor={tint.to} />
          </linearGradient>
          <radialGradient id={gradId + '-vig'} cx="50%" cy="55%" r="65%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#${gradId})`} />
        <rect width="200" height="200" fill={`url(#${gradId}-vig)`} />
        {/* faint surface line, suggests the photo was taken on a tabletop */}
        <line
          x1="0" y1={150 + yOff / 2}
          x2="200" y2={150 + yOff / 2}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1" />

        <g
          transform={`translate(${100 + xOff} ${100 + yOff}) rotate(${rot}) translate(-46 -46)`}
          style={{ color: 'var(--fg-muted)', opacity: 0.85 }}>

          {Glyph ?
          <g transform="scale(3.83)">{/* 24px viewBox × 3.83 ≈ 92px */}
              <Glyph category={category} size={24} />
            </g> :

          <rect width="92" height="92" rx="6" fill="currentColor" opacity="0.15" />
          }
        </g>
      </svg>
    </div>);

}

// Render a single gallery photo: a real <img> when the entry is a
// path/URL, otherwise the generated studio-shot placeholder SVG.
// `fit` controls object-fit ('contain' inline, 'contain' in the lightbox too
// but sized by the wrapper). Shared by the gallery and the lightbox so both
// resolve photo sources identically.
function GalleryPhoto({ device, src, index, className, draggable }) {
  const isUrl = typeof src === 'string' && !src.startsWith('placeholder:');
  return isUrl ?
  <img
    src={src}
    alt={`${device.name} photo ${index + 1}`}
    loading="lazy"
    draggable={draggable === undefined ? true : draggable}
    className={className}
    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /> :


  <PhotoPlaceholder
    id={src + ':' + device.id + ':' + index}
    category={device.category}
    alt={`${device.name} photo ${index + 1}`} />;


}

function PhotoGallery({ device, onEnterEdit }) {
  const photos = device.photos || [];
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  // Reset active index whenever the photo list changes (e.g. user adds/removes in edit mode)
  React.useEffect(() => { setActive(0); }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className="ce-gallery">
      <button
        type="button"
        className="ce-gallery-main ce-gallery-open"
        aria-label="View photo larger"
        title="Click to enlarge"
        onClick={() => setLightbox(true)}>
        <GalleryPhoto device={device} src={photos[active]} index={active} draggable={false} />
        <span className="ce-gallery-zoom-hint" aria-hidden="true">
          <Icon name="plus" size={16} />
        </span>
      </button>
      {photos.length > 1 ?
      <div className="ce-gallery-thumbs" role="tablist" aria-label="Device photos">
          {photos.map((src, i) =>
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`Show photo ${i + 1}`}
          className={`ce-thumb${i === active ? ' is-active' : ''}`}
          onClick={() => setActive(i)}>

              <GalleryPhoto device={device} src={src} index={i} />
            </button>
        )}
        </div> :
      null}
      {lightbox ?
      <Lightbox
        device={device}
        photos={photos}
        index={active}
        setIndex={setActive}
        onClose={() => setLightbox(false)} /> :
      null}
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Lightbox — a modal dialog that opens ON TOP of the page (portaled to
// <body>). Zoom/pan live entirely inside the overlay; the inline gallery
// photo is never transformed. Navigation by arrow buttons, keyboard, and
// swipe (no thumbnail strip); a counter shows position in the set.
// ─────────────────────────────────────────────────────────────────────
const LB_MIN = 1;        // fit-to-screen
const LB_MAX = 5;        // hard zoom ceiling

function Lightbox({ device, photos, index, setIndex, onClose }) {
  const total = photos.length;
  const stageRef = React.useRef(null);
  const [view, setView] = React.useState({ s: 1, x: 0, y: 0 });
  // Refs that pointer handlers read/write without forcing re-renders.
  const pointers = React.useRef(new Map());
  const gesture = React.useRef(null); // active drag / pinch bookkeeping
  const viewRef = React.useRef(view);
  viewRef.current = view;

  const reset = React.useCallback(() => setView({ s: 1, x: 0, y: 0 }), []);

  // Reset zoom whenever the shown photo changes.
  React.useEffect(() => { reset(); }, [index, reset]);

  // Body scroll-lock + keyboard (Esc to close, arrows to navigate).
  React.useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowRight' && total > 1) { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft' && total > 1) { e.preventDefault(); go(-1); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomBy(1.4); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomBy(1 / 1.4); }
      else if (e.key === '0') { e.preventDefault(); reset(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, onClose, reset]);

  const go = React.useCallback((dir) => {
    if (total < 2) return;
    setIndex((index + dir + total) % total);
  }, [index, total, setIndex]);

  // Clamp pan so the scaled image can't drift entirely off the stage.
  const clamp = React.useCallback((s, x, y) => {
    const el = stageRef.current;
    if (!el) return { s, x, y };
    const maxX = ((s - 1) * el.clientWidth) / 2;
    const maxY = ((s - 1) * el.clientHeight) / 2;
    return {
      s,
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y))
    };
  }, []);

  // Zoom around a focal point (cx,cy measured from stage center). Keeps the
  // pixel under the focal point fixed as scale changes. `zoomTo` sets an
  // absolute scale (used by pinch + double-tap, which capture their own
  // baseline). `zoomRel` multiplies the *current* scale inside the functional
  // updater, so rapid button/wheel events accumulate instead of clobbering
  // each other from a stale ref.
  const zoomTo = React.useCallback((ns, cx = 0, cy = 0) => {
    setView((v) => {
      const s = Math.max(LB_MIN, Math.min(LB_MAX, ns));
      const k = s / v.s;
      const x = cx - (cx - v.x) * k;
      const y = cy - (cy - v.y) * k;
      return clamp(s, x, y);
    });
  }, [clamp]);

  const zoomRel = React.useCallback((f, cx = 0, cy = 0) => {
    setView((v) => {
      const s = Math.max(LB_MIN, Math.min(LB_MAX, v.s * f));
      const k = s / v.s;
      const x = cx - (cx - v.x) * k;
      const y = cy - (cy - v.y) * k;
      return clamp(s, x, y);
    });
  }, [clamp]);

  const zoomBy = React.useCallback((f) => { zoomRel(f, 0, 0); }, [zoomRel]);

  // Pointer-based pan + pinch. One pointer pans (when zoomed) or arms a
  // horizontal swipe (when at fit). Two pointers pinch-zoom.
  const onPointerDown = (e) => {
    const el = stageRef.current;
    el.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      gesture.current = {
        mode: 'drag',
        startX: e.clientX, startY: e.clientY,
        origX: viewRef.current.x, origY: viewRef.current.y,
        moved: false
      };
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      gesture.current = { mode: 'pinch', startDist: dist, startScale: viewRef.current.s };
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;

    if (g.mode === 'pinch' && pointers.current.size >= 2) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const el = stageRef.current;
      const rect = el.getBoundingClientRect();
      const midX = (pts[0].x + pts[1].x) / 2 - (rect.left + rect.width / 2);
      const midY = (pts[0].y + pts[1].y) / 2 - (rect.top + rect.height / 2);
      zoomTo(g.startScale * (dist / g.startDist), midX, midY);
      return;
    }

    if (g.mode === 'drag') {
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) g.moved = true;
      if (viewRef.current.s > 1.01) {
        // Pan the zoomed image.
        setView((v) => clamp(v.s, g.origX + dx, g.origY + dy));
      } else {
        // At fit: track horizontal drag for a swipe-to-navigate gesture.
        g.swipeDX = dx;
      }
    }
  };

  const endPointer = (e) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (g && g.mode === 'drag' && viewRef.current.s <= 1.01 && total > 1) {
      const dx = g.swipeDX || 0;
      if (dx <= -50) go(1);
      else if (dx >= 50) go(-1);
    }
    if (pointers.current.size === 0) gesture.current = null;
    else if (pointers.current.size === 1) {
      // Dropped from pinch to single finger: re-arm drag from current point.
      const [p] = [...pointers.current.values()];
      gesture.current = {
        mode: 'drag', startX: p.x, startY: p.y,
        origX: viewRef.current.x, origY: viewRef.current.y, moved: true
      };
    }
  };

  // Wheel / trackpad-pinch zoom toward the cursor.
  const onWheel = (e) => {
    e.preventDefault();
    const el = stageRef.current;
    const rect = el.getBoundingClientRect();
    const cx = e.clientX - (rect.left + rect.width / 2);
    const cy = e.clientY - (rect.top + rect.height / 2);
    const f = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    zoomRel(f, cx, cy);
  };

  const zoomed = view.s > 1.01;

  return ReactDOM.createPortal(
    <div
      className="ce-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${device.name} photo ${index + 1} of ${total}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="ce-lb-bar">
        {total > 1 ?
        <span className="ce-lb-count" aria-live="polite">{index + 1} / {total}</span> :
        <span />}
        <button type="button" className="ce-lb-icon ce-lb-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={20} />
        </button>
      </div>

      <div
        className={`ce-lb-stage${zoomed ? ' is-zoomed' : ''}`}
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onWheel={onWheel}>
        <div
          className="ce-lb-img"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
            transition: gesture.current ? 'none' : 'transform 160ms cubic-bezier(.2,.7,.3,1)'
          }}>
          <GalleryPhoto device={device} src={photos[index]} index={index} draggable={false} />
        </div>
      </div>

      {total > 1 ?
      <React.Fragment>
        <button type="button" className="ce-lb-nav ce-lb-prev" onClick={() => go(-1)} aria-label="Previous photo">
          <Icon name="arrowL" size={22} />
        </button>
        <button type="button" className="ce-lb-nav ce-lb-next" onClick={() => go(1)} aria-label="Next photo">
          <Icon name="arrow" size={22} />
        </button>
      </React.Fragment> :
      null}

      <div className="ce-lb-zoom" role="group" aria-label="Zoom controls">
        <button type="button" className="ce-lb-icon" onClick={() => zoomBy(1 / 1.4)} disabled={view.s <= LB_MIN + 0.001} aria-label="Zoom out">
          <Icon name="minus" size={18} />
        </button>
        <button type="button" className="ce-lb-icon" onClick={() => zoomBy(1.4)} disabled={view.s >= LB_MAX - 0.001} aria-label="Zoom in">
          <Icon name="plus" size={18} />
        </button>
      </div>
    </div>,
    document.body);
}

// ─────────────────────────────────────────────────────────────────────
// Edit attribution + history panel
// ─────────────────────────────────────────────────────────────────────

function EditAttribution({ device, onEnterEdit }) {
  useIncrement('contributor-profiles'); // re-render bylines when profiles toggles
  const last = device.lastEdited;
  if (!last) return null;
  const who = contributorDisplay(last.by);
  const hp = window.contributorHoverProps ? window.contributorHoverProps(last.by) : {};

  return (
    <div className="ce-attribution">
      <Avatar user={who.user} anon={who.hidden} size={20} {...hp} />
      <span className="ce-attribution-text">
        Last edited{' '}
        <span className="ce-attribution-when" title={formatDateTime(last.at)}>
          {formatDateShort(last.at)}
        </span>{' '}
        by {who.href
          ? <a className="ce-byline-link" href={who.href} {...hp}>{who.name}</a>
          : <span className="ce-byline-private">{who.name}</span>}
      </span>
      <button type="button" className="ce-edit-btn" onClick={onEnterEdit}>
        <Icon name="pencil" size={13} />
        Suggest an edit
      </button>
    </div>);

}

// Renders a small diff-line per change inside a history entry. We keep
// the format quiet: field name + verb + optional detail ("3 photos",
// "v8 → v9"). No actual diff UI yet, this is a placeholder until the
// real edit flow lands. Plenty of space to grow.
function EditChangeLine({ change }) {
  const p = window.changeLineParts ? window.changeLineParts(change) :
    { text: (change.verb || 'updated') + ' ' + change.field, hasVals: false };
  return (
    <li className="ce-change">
      <span className="ce-change-text">{p.text}</span>
      {p.hasVals ?
      <span className="ce-change-detail">
          <span className="ce-change-from">{p.from}</span>
          <span className="ce-change-arrow">→</span>
          <span className="ce-change-to">{p.to}</span>
        </span> :
      null}
    </li>);

}

function EditHistoryPanel({ device }) {
  const history = device.editHistory || [];
  const [open, setOpen] = React.useState(false);
  if (history.length === 0) return null;

  // Default: show the most recent entry inline; the rest behind a toggle.
  const [first, ...rest] = history;

  return (
    <section className="detail-section ce-history-section" aria-labelledby="ce-history-head">
      <div className="ce-history-head">
        <h2 id="ce-history-head">Edit history</h2>
        <span className="ce-history-count">
          {history.length} edit{history.length === 1 ? '' : 's'}
        </span>
      </div>

      <ol className="ce-history-list">
        <EditEntry entry={first} />
        {open ? rest.map((e, i) => <EditEntry key={i} entry={e} />) : null}
      </ol>

      {rest.length > 0 ?
      <button
        type="button"
        className="ce-history-toggle"
        onClick={() => setOpen((o) => !o)}>

          {open ?
        <>Hide earlier edits</> :

        <>Show {rest.length} earlier edit{rest.length === 1 ? '' : 's'}</>}
        </button> :
      null}
    </section>);

}

function EditEntry({ entry }) {
  useIncrement('contributor-profiles'); // re-render byline when profiles toggles
  const who = contributorDisplay(entry.by);
  const hp = window.contributorHoverProps ? window.contributorHoverProps(entry.by) : {};
  return (
    <li className="ce-history-entry">
      <div className="ce-history-byline">
        <Avatar user={who.user} anon={who.hidden} size={24} {...hp} />
        <div>
          <div className="ce-history-when">
            {who.href
              ? <a className="ce-byline-link ce-byline-strong" href={who.href} {...hp}>{who.name}</a>
              : <span className="ce-byline-strong ce-byline-private">{who.name}</span>}
            <span className="ce-history-sep">·</span>
            <time dateTime={entry.at} title={formatDateTime(entry.at)}>{formatDateTime(entry.at)}</time>
            {entry.pending ?
              <span className="ce-history-pending"><span className="ce-pending-dot" aria-hidden="true" /> Awaiting review</span> :
              null}
          </div>
          {entry.summary ? <div className="ce-history-summary">{entry.summary}</div> : null}
        </div>
      </div>
      {entry.changes && entry.changes.length > 0 ?
      <ul className="ce-change-list">
          {entry.changes.map((c, i) => <EditChangeLine key={i} change={c} />)}
        </ul> :
      null}
    </li>);

}

// ─────────────────────────────────────────────────────────────────────
// Sidebar edit-history, a dense, single-row digest that lives inside the
// merged "Sources & edits" card on the detail page. Shows only the most
// recent edit; the full timeline opens in a modal/sheet via "View all".
// ─────────────────────────────────────────────────────────────────────

// The auto-generated "device created" row is record provenance, not a
// contributor edit, the creation/first-seen date lives in Real-world data.
// Strip it so Edit history only ever shows genuine human edits.
function isCreationEntry(e) {
  if (!e) return false;
  if (e.summary === 'Initial entry') return true;
  return Array.isArray(e.changes) && e.changes.length === 1 &&
    e.changes[0] && e.changes[0].verb === 'created';
}
function realEdits(device) {
  return (device && device.editHistory || []).filter((e) => !isCreationEntry(e));
}

// Build EditEntry-shaped objects from the pending store so awaiting-review
// submissions can sit in the same timeline as approved edits. Pending fields
// are grouped per contributor (one submission = one entry), newest field
// timestamp wins. Field keys are humanised via profileFieldLabel.
function buildPendingEntries(pendingObj) {
  const keys = Object.keys(pendingObj || {});
  if (!keys.length) return [];
  const groups = {};
  keys.forEach((k) => {
    const p = pendingObj[k] || {};
    const by = p.by || (typeof window !== 'undefined' && window.CURRENT_USER) || 'you';
    if (!groups[by]) groups[by] = { by, at: p.at, pending: true, pr: p.pr, changes: [] };
    groups[by].changes.push({ field: k, verb: 'edited' });
    if (p.at && (!groups[by].at || new Date(p.at) > new Date(groups[by].at))) groups[by].at = p.at;
  });
  return Object.values(groups);
}

function SidebarEditHistory({ device }) {
  useIncrement('contributor-profiles'); // re-render byline when profiles toggles
  const edits = realEdits(device);
  const pending = window.usePending ? window.usePending(device.id) : {};
  const pendingItems = buildPendingEntries(pending);
  const pCount = pendingItems.length;
  const total = edits.length + pCount;
  const [open, setOpen] = React.useState(false);

  // Digest row = most recent APPROVED edit (falls back to a pending one only
  // if there are no approved edits yet). Awaiting-review status is conveyed by
  // the "View all" control below, not the digest.
  const digest = edits[0] || pendingItems[0];
  const who = digest ? contributorDisplay(digest.by) : null;
  const hp = digest && window.contributorHoverProps ? window.contributorHoverProps(digest.by) : {};

  return (
    <div className="aside-edits">
      <div className="aside-edits-head">
        <h4>Edit history</h4>
      </div>
      {pCount > 0 ?
        <div className="aside-edits-pending">
          <span className="ce-pending-dot" aria-hidden="true" />
          <span>{pCount} edit{pCount === 1 ? '' : 's'} awaiting review</span>
        </div> : null}
      {total === 0 ?
      <p className="aside-edits-empty">No edits yet.</p> :
      <React.Fragment>
          <ol className="aside-edit-list">
            <li className="aside-edit-row">
              <Avatar user={who.user} anon={who.hidden} size={20} {...hp} />
              <div className="aside-edit-body">
                <div className="aside-edit-line">
                  {who.href
                    ? <a className="aside-edit-name ce-byline-link" href={who.href} {...hp}>{who.name}</a>
                    : <span className="aside-edit-name ce-byline-private">{who.name}</span>}
                  <span className="aside-edit-dot">·</span>
                  <time dateTime={digest.at} title={formatDateTime(digest.at)}>{formatDateShort(digest.at)}</time>
                  {digest.pending ?
                    <span className="aside-edit-pending-tag"><span className="ce-pending-dot" aria-hidden="true" /> Awaiting review</span> :
                    null}
                </div>
                {digest.summary ? <div className="aside-edit-summary">{digest.summary}</div> : null}
              </div>
            </li>
          </ol>
          <button type="button" className="aside-edit-viewall" onClick={() => setOpen(true)}>
            View all {total} edit{total === 1 ? '' : 's'}
          </button>
        </React.Fragment>}
      {open ? <EditHistoryDialog device={device} pendingItems={pendingItems} onClose={() => setOpen(false)} /> : null}
    </div>);

}

// Full edit timeline in a dialog. Desktop = centred modal, mobile/tablet =
// slide-up bottom sheet, mirrors VersionHistoryDialog so the two history
// surfaces feel like siblings. Reuses the airy EditEntry rows verbatim.
function EditHistoryDialog({ device, pendingItems, onClose }) {
  const history = realEdits(device);
  const merged = [...(pendingItems || []), ...history].sort((a, b) => new Date(b.at) - new Date(a.at));
  const [isSheet, setIsSheet] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = (e) => setIsSheet(e.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange);
    };
  }, []);

  const panelRef = React.useRef(null);
  const [closing, setClosing] = React.useState(false);
  const [dragY, setDragY] = React.useState(0);
  const closeAnimated = React.useCallback(() => {
    if (!isSheet) { onClose(); return; }
    const h = panelRef.current?.offsetHeight ?? 600;
    setClosing(true);
    setDragY(h);
    setTimeout(onClose, 200);
  }, [isSheet, onClose]);

  React.useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => { if (e.key === 'Escape') closeAnimated(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [closeAnimated]);

  const content = (
    <ol className="ce-history-list">
      {merged.map((e, i) => <EditEntry key={i} entry={e} />)}
    </ol>);

  if (isSheet) {
    return ReactDOM.createPortal(
      <div className={'sheet-backdrop' + (closing ? ' is-closing' : '')}
        onClick={closeAnimated} role="presentation">
        <div className="sheet-panel"
          ref={panelRef}
          role="dialog" aria-modal="true" aria-label="Edit history"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: dragY ? `translateY(${dragY}px)` : undefined,
            transition: 'transform 200ms cubic-bezier(.2,.0,.2,1)'
          }}>
          <header className="sheet-head">
            <div className="sheet-head-row">
              <button type="button"
                className="sheet-back"
                onClick={closeAnimated}
                aria-label="Close edit history">
                <Icon name="x" size={18} />
              </button>
              <h2 style={{ margin: 0, fontSize: 'var(--fs-18)' }}>Edit history</h2>
            </div>
          </header>
          <div className="sheet-body">{content}</div>
        </div>
      </div>,
      document.body);
  }

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-dialog"
        role="dialog" aria-modal="true"
        onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div className="modal-head-row">
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
            <h2>Edit history</h2>
          </div>
        </header>
        <div className="modal-body">{content}</div>
      </div>
    </div>,
    document.body);
}

// Expose to other JSX files (each <script type="text/babel"> has its
// own scope after transpile, so we attach to window explicitly).
Object.assign(window, {
  useIncrement,
  useCurrentUser,
  signIn,
  signOut,
  setCurrentUser,
  persistStoredAccount,
  createAccount,
  findAccountByIdentity,
  completeOnboarding,
  needsOnboarding,
  getUser,
  contributorDisplay,
  setNavAction,
  useNavAction,
  useNavActionAnchor,
  useStuckBar,
  relTime,
  formatDate,
  formatDateShort,
  formatDateTime,
  Avatar,
  PhotoPlaceholder,
  GalleryPhoto,
  PhotoGallery,
  Lightbox,
  EditAttribution,
  EditChangeLine,
  EditEntry,
  EditHistoryPanel,
  SidebarEditHistory,
  EditHistoryDialog
});
