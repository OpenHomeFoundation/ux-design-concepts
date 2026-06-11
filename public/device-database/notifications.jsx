/* Notifications increment (builds on Accounts and editing / community-edit).

   One event model, surfaced in two places. The standalone on-site inbox
   widget was retired when the Your changes page shipped, so what remains is:
     · Settings → Notifications — channel (email / GitHub / off) and cadence.
     · Your changes             — reads the notification records directly to
                                  show what is in review, went live, or was
                                  declined.

   Events (three): a submitted edit opens a pull request on GitHub ("pr"),
   then is merged and goes live ("live") or is declined ("declined"). Review
   conversation lives on the PR.

   Channel choice lives in Settings → Notifications. When a contributor with a
   connected GitHub account picks GitHub as their channel, we lean entirely on
   GitHub and send no emails. Otherwise email is the channel.

   Stores are tiny pub/sub singletons (same shape as the auth store in
   community-edit.jsx) so the settings panel and Your changes stay in sync.
   Source of truth is localStorage; seeds come from window.NOTIF_SEED. */

// GitHub repo the device data lives in; PR links are built from it.
const PR_BASE = 'https://github.com/OpenHomeFoundation/device-database/pull/';

// Demo clock. Seed timestamps are authored against this fixed "now" so the
// relative labels ("2h ago", "yesterday") read correctly regardless of the
// machine clock.
const DEMO_NOW = new Date('2026-06-05T10:00:00').getTime();

function relTime(ts) {
  const t = new Date(ts).getTime();
  const s = Math.max(0, Math.round((DEMO_NOW - t) / 1000));
  const m = Math.round(s / 60), h = Math.round(m / 60), d = Math.round(h / 24);
  if (s < 60) return 'just now';
  if (m < 60) return m + 'm ago';
  if (h < 24) return h + 'h ago';
  if (d === 1) return 'yesterday';
  if (d < 7) return d + 'd ago';
  try { return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  catch (e) { return ts; }
}

// ─────────────────────────────────────────────────────────────────────
// Notification store
// ─────────────────────────────────────────────────────────────────────
const NOTIF_KEY = 'devicedb.notifications.v2';
let _notifs = null;
const _notifListeners = new Set();

function loadNotifs() {
  if (_notifs) return _notifs;
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) { _notifs = JSON.parse(raw); return _notifs; }
  } catch (e) { /* fall through to seed */ }
  _notifs = ((typeof window !== 'undefined' && window.NOTIF_SEED) || []).map((n) => ({ ...n }));
  return _notifs;
}
function persistNotifs() {
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(_notifs)); } catch (e) { /* private mode */ }
  _notifListeners.forEach((fn) => fn());
}
function useNotifs() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => { _notifListeners.add(force); return () => { _notifListeners.delete(force); }; }, []);
  return loadNotifs();
}

// Record that a submitted edit opened a pull request for one device. This is
// the "one PR per device" backend action: the per-device submit and the
// changes tray's submit-all both call it (the tray once per drafted device).
// Accepts a device object or id. Writes a fresh 'pr' notification to the top
// of the inbox; display is gated by the notifications increment, but the
// record is kept either way.
function openPullRequest(device) {
  loadNotifs();
  const deviceId = typeof device === 'string' ? device : (device && device.id);
  if (!deviceId) return null;
  const dev = (typeof window !== 'undefined' && window.DEVICES || []).find((d) => d.id === deviceId);
  const name = (device && device.name) || (dev && dev.name) || deviceId;
  const maxPr = _notifs.reduce((m, n) => Math.max(m, n.pr || 0), 1280);
  const pr = maxPr + 1;
  _notifs = [{
    id: 'n-' + pr,
    type: 'pr',
    deviceId,
    device: name,
    pr,
    ts: new Date().toISOString(),
    read: false
  }, ..._notifs];
  persistNotifs();
  return pr;
}

// ─────────────────────────────────────────────────────────────────────
// Channel + cadence preferences
// ─────────────────────────────────────────────────────────────────────
const NOTIF_PREF_KEY = 'devicedb.notifPrefs.v1';
const DEFAULT_PREFS = { channel: 'email', cadence: 'immediate' }; // channel: 'email'|'github'|'off'; cadence: 'immediate'|'daily'
let _prefs = null;
const _prefListeners = new Set();

function loadPrefs() {
  if (_prefs) return _prefs;
  try {
    const raw = localStorage.getItem(NOTIF_PREF_KEY);
    if (raw) { _prefs = { ...DEFAULT_PREFS, ...JSON.parse(raw) }; return _prefs; }
  } catch (e) { /* fall through */ }
  _prefs = { ...DEFAULT_PREFS };
  return _prefs;
}
function setPrefs(patch) {
  loadPrefs();
  _prefs = { ..._prefs, ...patch };
  try { localStorage.setItem(NOTIF_PREF_KEY, JSON.stringify(_prefs)); } catch (e) { /* private mode */ }
  _prefListeners.forEach((fn) => fn());
}
function useNotifPrefs() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => { _prefListeners.add(force); return () => { _prefListeners.delete(force); }; }, []);
  return loadPrefs();
}

// Resolve the channel actually in effect. Picking GitHub only takes effect
// when a GitHub account is connected; otherwise we fall back to email.
function effectiveChannel(prefs, user) {
  if (prefs.channel === 'off') return 'off';
  return (prefs.channel === 'github' && user && user.gh) ? 'github' : 'email';
}
window.notifEffectiveChannel = effectiveChannel;

// A GitHub noreply address can't actually receive mail, so it never counts as
// a usable notification destination.
function isNoreply(addr) {
  return /@users\.noreply\.github\.com$/i.test(String(addr || '').trim());
}

// Where would an email notification actually land for this account?
//   source: 'override' — a separate notification address the user added
//           'account'  — the account / sign-in email, used by default
//           'none'     — no usable address yet (e.g. passkey-only)
// 'verified' gates real delivery: account emails are verified by the
// security flow; an override must be confirmed before we send to it.
function notifyDestination(user) {
  const override = (user && user.notifyEmail || '').trim();
  if (override) {
    return { address: override, verified: !!(user && user.notifyEmailVerified), source: 'override' };
  }
  const acct = (user && user.email || '').trim();
  if (acct && !isNoreply(acct)) {
    return { address: acct, verified: true, source: 'account' };
  }
  return { address: '', verified: false, source: 'none' };
}
window.notifyDestination = notifyDestination;

// Patch the current account in place, persist it, and ping the auth store so
// every subscriber (this page included) re-renders. Mirrors the discrete,
// commit-on-action pattern the security page uses for email / passkeys.
function patchCurrentUser(patch) {
  const id = typeof window !== 'undefined' && window.CURRENT_USER;
  if (!id || !window.USERS || !window.USERS[id]) return;
  const next = { ...window.USERS[id] };
  Object.keys(patch).forEach((k) => {
    if (patch[k] === undefined) delete next[k]; else next[k] = patch[k];
  });
  window.USERS[id] = next;
  if (window.persistStoredAccount) window.persistStoredAccount(id, next);
  if (window.setCurrentUser) window.setCurrentUser(id); // re-renders subscribers
}

// ──────────────────────────────────────────────────────────────────
// NotifyDestination — the "Sent to" control inside the Email channel.
// Holds every state of the delivery address:
//   · account email used by default (with "use a different address")
//   · empty (passkey / GitHub-only) → add an address
//   · override pending verification → enter the code
//   · override verified → change / remove / revert to account email
// A passkey-only account that verifies a fresh address is offered the
// chance to also use it for recovery (its only way back in if the
// passkey is lost). Delivery-only otherwise.
// ──────────────────────────────────────────────────────────────────
function NotifyDestination({ user }) {
  const acctEmail = (user && user.email || '').trim();
  const acctUsable = !!acctEmail && !isNoreply(acctEmail);
  const dest = notifyDestination(user);
  const hasOverride = dest.source === 'override';
  // Passkey-only (no account email, no GitHub) has no recovery path at all.
  const noRecoveryPath = !acctEmail && !(user && user.gh);

  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [err, setErr] = React.useState('');
  // Verification panel: { address } while open, null otherwise.
  const [verifyFor, setVerifyFor] = React.useState(null);
  const [code, setCode] = React.useState('');
  const [codeErr, setCodeErr] = React.useState('');
  const [offerRecovery, setOfferRecovery] = React.useState(false);

  const openAdd = (initial) => { setDraft(initial || ''); setErr(''); setAdding(true); };
  const cancelAdd = () => { setAdding(false); setDraft(''); setErr(''); };

  // Save the typed address as an unverified override and jump straight to the
  // code step — we never flip email delivery on until it's confirmed.
  const sendCode = () => {
    const v = draft.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)) { setErr('Enter a valid email address, like you@example.com.'); return; }
    if (acctUsable && v.toLowerCase() === acctEmail.toLowerCase()) {
      setErr('That is already your account email. Leave this blank to use it.'); return;
    }
    setErr('');
    patchCurrentUser({ notifyEmail: v, notifyEmailVerified: false });
    setAdding(false); setDraft('');
    setVerifyFor(v); setCode(''); setCodeErr('');
  };

  const confirmCode = () => {
    if (!/^\d{6}$/.test(code.trim())) { setCodeErr('Enter the 6-digit code we sent.'); return; }
    setCodeErr('');
    patchCurrentUser({ notifyEmailVerified: true });
    setVerifyFor(null); setCode('');
    // Offer recovery only when this address is the account's sole way back in.
    if (noRecoveryPath && !(user && user.notifyRecoveryOffered)) setOfferRecovery(true);
  };

  const removeOverride = () => {
    patchCurrentUser({ notifyEmail: undefined, notifyEmailVerified: undefined });
    setVerifyFor(null); setOfferRecovery(false);
  };

  // Recovery promotion: the verified address becomes the account email, so it
  // can sign you back in. The override field is no longer needed.
  const acceptRecovery = () => {
    patchCurrentUser({
      email: dest.address,
      recoveryEmail: true,
      notifyEmail: undefined,
      notifyEmailVerified: undefined,
      notifyRecoveryOffered: true
    });
    setOfferRecovery(false);
  };
  const declineRecovery = () => {
    patchCurrentUser({ notifyRecoveryOffered: true });
    setOfferRecovery(false);
  };

  // The code-entry panel, shared by add-then-verify and the "Verify" action.
  const verifyPanel = verifyFor &&
    <div className="ce-verify">
      <p className="ce-verify-lead">
        Enter the 6-digit code we sent to <b>{verifyFor}</b> to confirm it.
      </p>
      <div className="ce-sec-form">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          className={'ce-input ce-verify-code' + (codeErr ? ' is-invalid' : '')}
          value={code}
          maxLength={6}
          onChange={(e) => { setCode(e.target.value.replace(/[^\d]/g, '')); if (codeErr) setCodeErr(''); }}
          placeholder="000000"
          aria-label="Verification code"
          aria-invalid={codeErr ? 'true' : undefined} />
        {codeErr &&
          <p className="ce-field-error" role="alert"><Icon name="alert" size={16} />{codeErr}</p>}
        <div className="ce-sec-form-actions">
          <button type="button" className="btn btn-primary ce-sec-btn" onClick={confirmCode}>Verify address</button>
          <button type="button" className="ce-acct-quiet" onClick={() => { setVerifyFor(null); setCode(''); setCodeErr(''); }}>Cancel</button>
        </div>
        <p className="ce-acct-hint">Demo: any 6 digits will do.</p>
      </div>
    </div>;

  const recoveryPrompt = offerRecovery &&
    <div className="ce-recovery" role="note">
      <span className="ce-recovery-ico" aria-hidden="true"><Icon name="shield" size={18} /></span>
      <div className="ce-recovery-body">
        <b className="ce-recovery-title">Use this email to recover your account too?</b>
        <p className="ce-recovery-text">You sign in with a passkey only. Adding a recovery email is your way back in if you ever lose it. Decline and this address just receives notifications.</p>
        <div className="ce-recovery-actions">
          <button type="button" className="btn btn-primary ce-sec-btn" onClick={acceptRecovery}>Use for recovery</button>
          <button type="button" className="ce-acct-quiet" onClick={declineRecovery}>No thanks</button>
        </div>
      </div>
    </div>;

  // --- Render the right top-level state ---------------------------------

  if (adding) {
    return (
      <div className="ce-sec-form">
        <input
          type="email"
          className={'ce-input' + (err ? ' is-invalid' : '')}
          value={draft}
          onChange={(e) => { setDraft(e.target.value); if (err) setErr(''); }}
          placeholder="you@example.com"
          autoComplete="email"
          aria-label="Notification email address"
          aria-invalid={err ? 'true' : undefined} />
        {err &&
          <p className="ce-field-error" role="alert"><Icon name="alert" size={16} />{err}</p>}
        <div className="ce-sec-form-actions">
          <button type="button" className="btn btn-primary ce-sec-btn" onClick={sendCode}>Send code</button>
          <button type="button" className="ce-acct-quiet" onClick={cancelAdd}>Cancel</button>
        </div>
        <p className="ce-acct-hint">We send a code to confirm the address before any notifications go out.</p>
      </div>
    );
  }

  if (hasOverride) {
    return (
      <React.Fragment>
        <div className="ce-sec-line">
          <span className="ce-dest">
            <span className="ce-sec-status">{dest.address}</span>
            <span className={'ce-pill' + (dest.verified ? ' is-verified' : ' is-pending')}>
              {dest.verified ? 'Verified' : 'Unverified'}
            </span>
          </span>
          <div className="ce-sec-actions">
            {!dest.verified && !verifyFor &&
              <button type="button" className="ce-acct-quiet ce-acct-quiet-accent" onClick={() => { setVerifyFor(dest.address); setCode(''); setCodeErr(''); }}>Verify</button>}
            <button type="button" className="ce-acct-quiet" onClick={() => openAdd(dest.address)}>Change</button>
            <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={removeOverride}>Remove</button>
          </div>
        </div>
        {verifyPanel}
        {recoveryPrompt}
        {acctUsable && !verifyFor &&
          <p className="ce-acct-hint">Or <button type="button" className="ce-acct-link-inline" onClick={removeOverride}>send to your account email</button> ({acctEmail}) instead.</p>}
        {!acctUsable && !verifyFor && dest.verified &&
          <p className="ce-acct-hint">This address only receives notifications. It does not sign you in.</p>}
      </React.Fragment>
    );
  }

  if (acctUsable) {
    return (
      <React.Fragment>
        <div className="ce-sec-line">
          <span className="ce-dest">
            <span className="ce-sec-status">{acctEmail}</span>
            <span className="ce-dest-note">your account email</span>
          </span>
          <div className="ce-sec-actions">
            <button type="button" className="ce-acct-quiet" onClick={() => openAdd('')}>Use a different address</button>
          </div>
        </div>
        <p className="ce-acct-hint">Managed in Sign-in and security. Add a separate address to receive notifications somewhere else.</p>
      </React.Fragment>
    );
  }

  // No usable address yet — passkey-only, or GitHub with only a noreply email.
  return (
    <React.Fragment>
      <window.Banner icon="info" title="Add an address to get email notifications">
        Until then, updates show on the Your edits page only.
      </window.Banner>
      <button type="button" className="btn btn-secondary ce-sec-btn ce-sec-add ce-notify-add-btn" onClick={() => openAdd('')}>
        Add an address
      </button>
      {user && user.gh &&
        <p className="ce-acct-hint">Or switch the channel to GitHub above to be notified there.</p>}
    </React.Fragment>
  );
}

// ──────────────────────────────────────────────────────────────────
// NotificationsSettings — the Settings → Notifications sub-page body.
// Channel chooser, then either email cadence/destination or a GitHub note.
// Changes are buffered locally; committed only when the user hits Save.
// ──────────────────────────────────────────────────────────────────
function NotificationsSettings() {
  const user = (window.useCurrentUser && window.useCurrentUser()) ||
    (window.USERS && window.USERS[window.CURRENT_USER]) || null;
  const prefs = useNotifPrefs();
  const ghConnected = !!(user && user.gh);
  // Resolve where email actually lands, and whether it's confirmed. Cadence
  // and real delivery stay gated until there is a verified destination.
  const dest = notifyDestination(user);
  const destReady = !!(dest.address && dest.verified);

  // Buffered draft state: the channel choice + email cadence stay local
  // until saved.
  const [draftChannel, setDraftChannel] = React.useState(() => prefs.channel || 'email');
  const [draftCadence, setDraftCadence] = React.useState(() => prefs.cadence || 'immediate');
  React.useEffect(() => { setDraftChannel(prefs.channel || 'email'); }, [prefs.channel]);
  React.useEffect(() => { setDraftCadence(prefs.cadence || 'immediate'); }, [prefs.cadence]);

  const dirty = draftChannel !== (prefs.channel || 'email') || draftCadence !== (prefs.cadence || 'immediate');
  const save = () => { setPrefs({ channel: draftChannel, cadence: draftCadence }); };
  // Save bar "stuck" hairline, matching Profile + device edit.
  const [saveBarRef, saveBarSentinelRef, saveBarStuck] = window.useStuckBar
    ? window.useStuckBar()
    : [null, null, false];

  // Connect GitHub right here (demo): set a handle on the current user and
  // notify auth subscribers so this view re-renders as connected.
  const connectGithub = () => {
    const id = window.CURRENT_USER;
    if (window.USERS && window.USERS[id]) {
      window.USERS[id] = { ...window.USERS[id], gh: window.USERS[id].gh || 'yourhandle' };
      if (window.setCurrentUser) window.setCurrentUser(id);
    }
  };

  const channels = [
    { id: 'email', icon: <Icon name="mail" size={18} />, label: 'Email',
      sub: 'We email you when an edit you submitted is reviewed.' },
    { id: 'github', icon: <GitHubMark size={18} />, label: 'GitHub',
      sub: 'Get notified on GitHub, where edits are reviewed. We send no email.' },
    { id: 'off', icon: <Icon name="cloudoff" size={18} />, label: 'Off',
      sub: 'No email or GitHub alerts. We will not notify you when an edit is reviewed.' },
  ];

  return (
    <React.Fragment>
      <h1 className="ce-account-h1">Notifications</h1>
      <p className="ce-account-sub">We let you know when a submitted edit is sent for review, goes live, or is declined. Either way, every update also shows on the Your edits page.</p>

      <div className="ce-account-form">
        <section className="ce-account-section">
          <h2 className="ce-account-section-head">How we reach you</h2>
          <div className="ce-acct-rows">
            <div className="ce-notif-channels ce-chan-iconlead" role="radiogroup" aria-label="Notification channel">
              {channels.map((c) =>
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={draftChannel === c.id}
                  className={'ce-notif-channel' + (draftChannel === c.id ? ' is-active' : '')}
                  onClick={() => setDraftChannel(c.id)}>
                  <span className="ce-notif-radio" aria-hidden="true" />
                  <span className="ce-notif-channel-ico" aria-hidden="true">{c.icon}</span>
                  <span className="ce-notif-channel-main">
                    <span className="ce-notif-channel-label">{c.label}</span>
                    <span className="ce-notif-channel-sub">{c.sub}</span>
                  </span>
                </button>)}
            </div>
          </div>
        </section>

        {draftChannel === 'email' &&
        <section className="ce-account-section">
          <h2 className="ce-account-section-head">Email</h2>
          <div className="ce-acct-rows">
            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">Sent to</div>
              <div className="ce-acct-control">
                <NotifyDestination user={user} />
              </div>
            </div>
            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">How often</div>
              <div className="ce-acct-control">
                <div className="ce-notif-cadence" role="radiogroup" aria-label="Email frequency">
                  {[
                    { id: 'immediate', label: 'Immediately', sub: 'Email me as each one happens.' },
                    { id: 'daily', label: 'Daily summary', sub: 'One email a day, only if there is something new.' },
                  ].map((opt) => {
                    const on = draftCadence === opt.id;
                    const dim = !destReady;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        className={'ce-notif-cadence-opt' + (on ? ' is-active' : '') + (dim ? ' is-disabled' : '')}
                        onClick={() => !dim && setDraftCadence(opt.id)}
                        disabled={dim}>
                        <span className="ce-notif-radio" aria-hidden="true" />
                        <span className="ce-notif-cadence-main">
                          <span className="ce-notif-cadence-label">{opt.label}</span>
                          <span className="ce-notif-cadence-sub">{opt.sub}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        }

        {draftChannel === 'github' &&
        <section className="ce-account-section">
          <h2 className="ce-account-section-head">GitHub</h2>
          {ghConnected ?
            <p style={{ margin: 0, fontSize: 'var(--fs-14)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              We will not email you. Choose what GitHub sends you from your watching and notification settings on GitHub.
            </p> :
            <React.Fragment>
              <p style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--fs-14)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                Connect your GitHub account to route notifications there. Until then we keep using email.
              </p>
              <button type="button" className="btn btn-secondary ce-sec-btn ce-sec-add ce-sec-add-gh" onClick={connectGithub}>
                <GitHubMark size={16} />
                <span>Connect GitHub</span>
              </button>
            </React.Fragment>
          }
        </section>
        }

        <div className={'ce-account-savebar' + (saveBarStuck ? ' is-stuck' : '')} ref={saveBarRef} aria-live="polite">
          <button type="button" className="btn btn-primary" disabled={!dirty} onClick={save}>
            {dirty ? 'Save changes' : 'Saved'}
          </button>
        </div>
        <div ref={saveBarSentinelRef} aria-hidden="true" style={{ height: 1, marginTop: 'calc(var(--space-7) * -1)' }} />
      </div>
    </React.Fragment>
  );
}

Object.assign(window, {
  NotificationsSettings,
  useNotifPrefs,
  notifEffectiveChannel: effectiveChannel,
  getNotifPrefs: loadPrefs,
  setNotifPrefs: setPrefs,
  openPullRequest,
  // The "Your changes" dashboard reads notification records directly (declined
  // edits live only here) and subscribes for re-render.
  useNotifs,
  loadNotifs,
});
