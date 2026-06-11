/* Contributor hovercards — part of the Contributor-profiles increment.

   Hovering (with a mouse) or keyboard-focusing any contributor avatar or
   name anywhere their edits are attributed pops a small mini-profile:
   avatar, name, location, the same three activity stats as the profile
   page, and the full bio. It's the same identity surface as a GitHub-style
   hovercard, drawn in this site's paper-toned popover language (hairline
   border, gentle elevation).

   It is a pure tooltip: the card has pointer-events:none, so only the
   trigger is hoverable, you cannot move onto the card itself. Leaving the
   trigger dismisses it. To open the full profile, click the trigger.

   Gating: a card only opens when contributorDisplay(handle).href is
   non-null, which is true exactly when the Contributor-profiles increment
   is ON and the contributor is not a private (anonymised) account. So the
   feature rides the profiles increment with no separate toggle, and never
   leaks a private contributor's identity.

   Touch: pointer handlers are mouse-only, so on touch devices a tap just
   follows the link to the full profile, no card.

   Architecture: ONE shared popover (this host, mounted once at app root)
   driven by a tiny pub/sub store. Triggers publish "show card for handle,
   anchored to this element"; the host positions and renders it. A short
   open-intent delay and close delay keep it from flickering when the
   cursor crosses between adjacent triggers (e.g. an avatar and its name).
*/

// ─────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────
const HC_OPEN_DELAY = 140;   // hover-intent before opening
const HC_REOPEN_DELAY = 60;  // faster when swapping between adjacent triggers
const HC_CLOSE_DELAY = 160;  // brief close delay so avatar<->name swaps don't flicker

let _hc = { handle: null, el: null, open: false, seq: 0 };
const _hcSubs = new Set();
let _hcOpenT = null;
let _hcCloseT = null;

function _hcEmit() { _hcSubs.forEach((f) => f()); }

// Open a card only when there's a real, non-private, profile-linked
// contributor to show (mirrors the byline's own link gating).
function hoverCardEnabled(handle) {
  if (!handle) return false;
  const cd = window.contributorDisplay ? window.contributorDisplay(handle) : null;
  return !!(cd && cd.href);
}

function hoverCardShow(handle, el) {
  if (!hoverCardEnabled(handle)) return;
  clearTimeout(_hcCloseT); _hcCloseT = null;
  // Already showing this person: just retarget the anchor, no re-animate.
  if (_hc.open && _hc.handle === handle) { _hc = { ..._hc, el }; return; }
  clearTimeout(_hcOpenT);
  const delay = _hc.open ? HC_REOPEN_DELAY : HC_OPEN_DELAY;
  _hcOpenT = setTimeout(() => {
    _hc = { handle, el, open: true, seq: _hc.seq + 1 };
    _hcEmit();
  }, delay);
}

function hoverCardHide() {
  clearTimeout(_hcOpenT); _hcOpenT = null;
  clearTimeout(_hcCloseT);
  _hcCloseT = setTimeout(() => { _hc = { ..._hc, open: false }; _hcEmit(); }, HC_CLOSE_DELAY);
}

// Cursor entered the card itself, cancel the pending close.
function hoverCardCancelHide() { clearTimeout(_hcCloseT); _hcCloseT = null; }

// Close immediately (e.g. a link inside the card was clicked / navigated).
function hoverCardHideNow() {
  clearTimeout(_hcOpenT); clearTimeout(_hcCloseT);
  _hcOpenT = _hcCloseT = null;
  if (_hc.open) { _hc = { ..._hc, open: false }; _hcEmit(); }
}

function useHoverCard() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => { _hcSubs.add(force); return () => { _hcSubs.delete(force); }; }, []);
  return _hc;
}

// ─────────────────────────────────────────────────────────────────────
// Trigger props. Spread onto any avatar / name element that should open
// the card. Mouse-only on pointer (touch falls through to the link);
// keyboard focus opens it too. Returns {} when disabled, so call sites
// can spread unconditionally.
// ─────────────────────────────────────────────────────────────────────
function contributorHoverProps(handle) {
  if (!hoverCardEnabled(handle)) return {};
  return {
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') hoverCardShow(handle, e.currentTarget); },
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') hoverCardHide(); },
    onFocus: (e) => hoverCardShow(handle, e.currentTarget),
    onBlur: () => hoverCardHide()
  };
}

// ─────────────────────────────────────────────────────────────────────
// Card body
// ─────────────────────────────────────────────────────────────────────
function _hcMonthYear(input) {
  if (!input) return '-';
  const d = new Date(input);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function ContributorHoverCardBody({ handle }) {
  const Icon = window.Icon;
  const Avatar = window.Avatar;
  const user = window.getUser ? window.getUser(handle) : null;
  if (!user) return null;

  const isSelf = handle === window.CURRENT_USER;
  const activityHidden = !!user.hideActivity && !isSelf;
  const stats = window.gatherContributions
    ? window.gatherContributions(handle)
    : { contributions: 0, deviceCount: 0, since: null };

  return (
    <React.Fragment>
      <div className="ce-hc-head">
        <span className="ce-hc-avatar" aria-hidden="true">
          {Avatar ? <Avatar user={user} size={44} /> : null}
        </span>
        <div className="ce-hc-id">
          <span className="ce-hc-name">{user.name}</span>
          {user.pronouns ? <span className="ce-hc-pronouns">{user.pronouns}</span> : null}
          {user.location ? (
            <span className="ce-hc-loc">
              {Icon ? <Icon name="pin" size={13} /> : null}{user.location}
            </span>
          ) : null}
        </div>
      </div>

      {user.bio ? <p className="ce-hc-bio">{user.bio}</p> : null}

      {!activityHidden ? (
        <dl className="ce-hc-stats">
          <div className="ce-hc-stat">
            <dt>Contributions</dt>
            <dd>{stats.contributions}</dd>
          </div>
          <div className="ce-hc-stat">
            <dt>Devices</dt>
            <dd>{stats.deviceCount}</dd>
          </div>
          <div className="ce-hc-stat ce-hc-stat-since">
            <dt>Since</dt>
            <dd>{_hcMonthYear(stats.since)}</dd>
          </div>
        </dl>
      ) : (
        <p className="ce-hc-activity-hidden">
          {Icon ? <Icon name="lock" size={13} /> : null}
          Activity hidden
        </p>
      )}
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Host: one fixed-positioned popover, positioned against the trigger's
// rect, flipping above when there isn't room below, clamped to the
// viewport. Repositions on scroll/resize while open.
// ─────────────────────────────────────────────────────────────────────
function ContributorHoverHost() {
  const st = useHoverCard();
  const cardRef = React.useRef(null);
  const [pos, setPos] = React.useState(null);

  const live = st.open && st.handle && hoverCardEnabled(st.handle);

  React.useLayoutEffect(() => {
    if (!live || !st.el) { setPos(null); return; }
    const place = () => {
      const card = cardRef.current;
      const el = st.el;
      if (!card || !el || !el.isConnected) { hoverCardHideNow(); return; }
      const r = el.getBoundingClientRect();
      const cw = card.offsetWidth;
      const ch = card.offsetHeight;
      const margin = 8;
      const gap = 8;
      let left = r.left + r.width / 2 - cw / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - cw - margin));
      const roomAbove = r.top;
      let placement = 'top';
      let top = r.top - gap - ch;
      if (roomAbove < ch + gap + margin && window.innerHeight - r.bottom - gap - ch > margin) {
        placement = 'bottom';
        top = r.bottom + gap;
      }
      top = Math.max(margin, Math.min(top, window.innerHeight - ch - margin));
      setPos({ left, top, placement });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [live, st.el, st.seq, st.handle]);

  if (!live) return null;

  return (
    <div
      ref={cardRef}
      className={'ce-hovercard' + (pos ? ' ce-hovercard-' + pos.placement : '')}
      style={{
        left: pos ? pos.left : -9999,
        top: pos ? pos.top : -9999,
        visibility: pos ? 'visible' : 'hidden'
      }}
      role="tooltip"
      aria-hidden="true">
      <ContributorHoverCardBody handle={st.handle} />
    </div>
  );
}

Object.assign(window, {
  contributorHoverProps,
  hoverCardShow,
  hoverCardHide,
  hoverCardHideNow,
  ContributorHoverHost
});
