/* Onboarding increment (builds on Accounts and editing / community-edit).

   Three shared pieces, used by two flows:

     · AuthProviders  — the GitHub / passkey / email method chooser, with the
                        simulated provider handoff. Reused by the Create-account
                        page (community-edit-pages.jsx) and the guest submit
                        sheet (edit-mode.jsx) so both read identically.
     · Onboarding     — the adaptive "finish setting up" step. It only asks for
                        what the chosen method didn't already give us:
                          GitHub  → confirm (name + visibility); already notifiable
                          Email   → name + visibility; already notifiable
                          Passkey → name + how-we-reach-you + visibility
                        Rendered routed (flow A, after nav sign-up) and inline
                        inside the submit sheet (flow B, after a guest edits).
     · Welcome        — the routed #/welcome page for flow A: Onboarding, then a
                        short "you're all set" screen that nudges the first edit.

   Onboarding is a property of the account, asked exactly once (the
   __needsOnboarding flag in community-edit.jsx). Whichever flow a contributor
   hits first runs it; the other detects it's done and skips straight through.
*/

// Provider glyphs. Each <script type="text/babel"> shares the global lexical
// scope, but we keep these local so this file has no cross-file dependency.
const OnbGitHubMark = ({ size = 18 }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>;

const OnbPasskeyMark = ({ size = 18 }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="4" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <circle cx="18" cy="9" r="2.5" />
    <path d="M18 11.5V18l-1.5 1.5L18 21" />
  </svg>;

const OnbMailMark = ({ size = 18 }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>;

// ─────────────────────────────────────────────────────────────────────
// AuthProviders — GitHub / passkey / email chooser with a simulated handoff.
// On success it calls onAuthed(method, fields). The caller decides what that
// means (create an account, then route or advance a step).
// ─────────────────────────────────────────────────────────────────────
function AuthProviders({ verb = 'Sign up', onAuthed }) {
  const [pending, setPending] = React.useState(null);
  const [showEmail, setShowEmail] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [err, setErr] = React.useState('');
  const emailRef = React.useRef(null);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  React.useEffect(() => { if (showEmail) emailRef.current?.focus(); }, [showEmail]);

  const startProvider = (key) => {
    if (pending) return;
    setPending(key);
    timer.current = setTimeout(() => onAuthed(key, {}), 1100);
  };
  const submitEmail = (e) => {
    e.preventDefault();
    if (pending) return;
    const v = email.trim();
    if (!v) { setErr('Enter your email address.'); emailRef.current?.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(v)) { setErr('Enter a valid email address, like you@example.com.'); emailRef.current?.focus(); return; }
    if (password.length < 8) { setErr('Use at least 8 characters for your password.'); return; }
    setErr('');
    onAuthed('email', { email: v });
  };

  return (
    <React.Fragment>
      <div className="ce-auth-providers">
        <button
          type="button"
          className={'ce-auth-github' + (pending === 'github' ? ' is-busy' : '')}
          onClick={() => startProvider('github')}
          disabled={!!pending}
          aria-busy={pending === 'github'}>
          {pending === 'github'
            ? <span className="ce-auth-spinner" aria-hidden="true" />
            : <OnbGitHubMark size={18} />}
          <span>{pending === 'github' ? 'Connecting to GitHub…' : verb + ' with GitHub'}</span>
        </button>

        <button
          type="button"
          className={'ce-auth-github' + (pending === 'passkey' ? ' is-busy' : '')}
          onClick={() => startProvider('passkey')}
          disabled={!!pending}
          aria-busy={pending === 'passkey'}>
          {pending === 'passkey'
            ? <span className="ce-auth-spinner" aria-hidden="true" />
            : <OnbPasskeyMark size={18} />}
          <span>{pending === 'passkey' ? 'Waiting for your passkey…' : verb + ' with a passkey'}</span>
        </button>

        <button
          type="button"
          className="ce-auth-github"
          onClick={() => setShowEmail((s) => !s)}
          disabled={!!pending}
          aria-expanded={showEmail}
          aria-controls="ce-onb-email-form">
          <OnbMailMark size={18} />
          <span>{verb} with email</span>
        </button>
      </div>

      {showEmail &&
        <form id="ce-onb-email-form" className="ce-auth-form" noValidate onSubmit={submitEmail}>
          <label className="ce-field" htmlFor="ce-onb-email">
            <span className="ce-field-label">Email</span>
            <input
              id="ce-onb-email" type="email" className={'ce-input' + (err ? ' is-invalid' : '')} ref={emailRef}
              value={email} onChange={(e) => {setEmail(e.target.value); if (err) setErr('');}}
              placeholder="you@example.com" autoComplete="email" aria-invalid={err ? 'true' : undefined} />
          </label>
          <label className="ce-field" htmlFor="ce-onb-password">
            <span className="ce-field-label">Password</span>
            <div className="ce-input-wrap">
              <input
                id="ce-onb-password" type={showPw ? 'text' : 'password'}
                className={'ce-input ce-input-has-action' + (err ? ' is-invalid' : '')}
                value={password} onChange={(e) => {setPassword(e.target.value); if (err) setErr('');}}
                placeholder="At least 8 characters" autoComplete="new-password" aria-invalid={err ? 'true' : undefined} />
              <button type="button" className="ce-input-action" onClick={() => setShowPw((s) => !s)} aria-pressed={showPw}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          {err &&
            <p className="ce-field-error" role="alert"><Icon name="alert" size={16} />{err}</p>
          }
          <button type="submit" className="btn btn-primary ce-auth-submit">Continue</button>
        </form>}
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Onboarding — the adaptive "finish setting up" step.
//   props: user, onComplete(patch), variant ('page' | 'inline'), submitLabel
// ─────────────────────────────────────────────────────────────────────
function Onboarding({ user, onComplete, variant = 'page', submitLabel }) {
  user = user || {};
  const method = user.__method || (user.gh ? 'github' : user.email ? 'email' : 'passkey');
  const hasNotify = window.hasNotificationMethod
    ? window.hasNotificationMethod(user)
    : !!(user.gh || user.email);

  const prefillName = user.name
    || user.gh
    || (user.email ? user.email.split('@')[0] : '')
    || '';

  const [name, setName] = React.useState(prefillName);
  const [visibility, setVisibility] = React.useState(user.private ? 'private' : 'public');
  // Only used when the account has no notification method yet (passkey).
  const [notifyChoice, setNotifyChoice] = React.useState('email');
  const [notifyEmail, setNotifyEmail] = React.useState('');
  // For accounts that already have an email: keep email on, or turn it off
  // and rely on the Your changes page. 'email' | 'off'.
  const [emailChannel, setEmailChannel] = React.useState(
    (window.getNotifPrefs && window.getNotifPrefs().channel) || 'email');
  const [ghConnecting, setGhConnecting] = React.useState(false);
  const [ghConnected, setGhConnected] = React.useState(false);
  const [error, setError] = React.useState('');
  const nameRef = React.useRef(null);
  React.useEffect(() => { nameRef.current?.focus(); }, []);

  const connectGithub = () => {
    if (ghConnecting || ghConnected) return;
    setGhConnecting(true);
    setTimeout(() => { setGhConnecting(false); setGhConnected(true); }, 1100);
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Please add a display name.'); nameRef.current?.focus(); return; }
    const patch = { name: trimmed, private: visibility === 'private' };
    if (!hasNotify) {
      if (notifyChoice === 'email') {
        const e = notifyEmail.trim();
        if (!/^\S+@\S+\.\S+$/.test(e)) { setError('Please enter a valid email, or choose another option.'); return; }
        // Onboarding email is a delivery address, not a sign-in credential, so
        // it lands in notifyEmail and leaves the account passkey-only. Entered
        // here as part of setup, we treat it as confirmed.
        patch.notifyEmail = e;
        patch.notifyEmailVerified = true;
        if (window.setNotifPrefs) window.setNotifPrefs({ channel: 'email' });
      } else if (notifyChoice === 'github') {
        if (!ghConnected) { setError('Connect GitHub, or choose another option.'); return; }
        patch.gh = 'samriv';
        if (window.setNotifPrefs) window.setNotifPrefs({ channel: 'github' });
      } else {
        // 'off' → no contact added; updates live on the Your changes page.
        if (window.setNotifPrefs) window.setNotifPrefs({ channel: 'off' });
      }
    } else if (user.gh) {
      if (window.setNotifPrefs) window.setNotifPrefs({ channel: 'github' });
    } else if (window.setNotifPrefs) {
      // Already have an email: persist whether email stays on or is off.
      window.setNotifPrefs({ channel: emailChannel });
    }
    setError('');
    onComplete(patch);
  };

  const label = submitLabel || 'Continue';

  // "How we reach you" — a read-only confirmation for GitHub, an email
  // cadence chooser when the account already has an email, otherwise the
  // full channel chooser.
  const reachBlock = hasNotify ? (
    user.gh ? (
    <div className="ce-onboard-reach" role="note">
      <span className="ce-onboard-reach-ico" aria-hidden="true">
        <OnbGitHubMark size={18} />
      </span>
      <div>
        <b>We reach you on GitHub</b>
        <span>Get notified on GitHub, where edits are reviewed. We send no email.</span>
      </div>
    </div>
    ) : (
    <div className="ce-onboard-field">
      <div className="ce-onboard-field-head">
        <span className="ce-field-label">How we reach you</span>
        <span className="ce-onboard-hint">We email you at {user.email} when an edit you submit is reviewed.</span>
      </div>
      <div className="ce-notif-cadence" role="radiogroup" aria-label="Email notifications">
        {[
          { id: 'email', label: 'Email me', sub: 'Get an email as each edit you submit is reviewed.' },
          { id: 'off', label: 'Off', sub: 'No email. We will not notify you when an edit is reviewed.' },
        ].map((opt) => {
          const on = emailChannel === opt.id;
          return (
            <button key={opt.id} type="button" role="radio" aria-checked={on}
              className={'ce-notif-cadence-opt' + (on ? ' is-active' : '')}
              onClick={() => setEmailChannel(opt.id)}>
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
    )
  ) : (
    <div className="ce-onboard-field">
      <div className="ce-onboard-field-head">
        <span className="ce-field-label">How should we reach you?</span>
      </div>
      <div className="ce-notif-channels ce-chan-iconlead" role="radiogroup" aria-label="How should we reach you">
        <button type="button" role="radio" aria-checked={notifyChoice === 'email'}
          className={'ce-notif-channel' + (notifyChoice === 'email' ? ' is-active' : '')}
          onClick={() => setNotifyChoice('email')}>
          <span className="ce-notif-radio" aria-hidden="true" />
          <span className="ce-notif-channel-ico" aria-hidden="true"><OnbMailMark size={18} /></span>
          <span className="ce-notif-channel-main">
            <span className="ce-notif-channel-label">Email</span>
            <span className="ce-notif-channel-sub">We email you when an edit you submit is reviewed.</span>
          </span>
        </button>

        <button type="button" role="radio" aria-checked={notifyChoice === 'github'}
          className={'ce-notif-channel' + (notifyChoice === 'github' ? ' is-active' : '')}
          onClick={() => setNotifyChoice('github')}>
          <span className="ce-notif-radio" aria-hidden="true" />
          <span className="ce-notif-channel-ico" aria-hidden="true"><OnbGitHubMark size={18} /></span>
          <span className="ce-notif-channel-main">
            <span className="ce-notif-channel-label">Connect GitHub</span>
            <span className="ce-notif-channel-sub">Get notified on GitHub, where edits are reviewed.</span>
          </span>
        </button>

        <button type="button" role="radio" aria-checked={notifyChoice === 'off'}
          className={'ce-notif-channel' + (notifyChoice === 'off' ? ' is-active' : '')}
          onClick={() => setNotifyChoice('off')}>
          <span className="ce-notif-radio" aria-hidden="true" />
          <span className="ce-notif-channel-ico" aria-hidden="true"><Icon name="cloudoff" size={18} /></span>
          <span className="ce-notif-channel-main">
            <span className="ce-notif-channel-label">Off</span>
            <span className="ce-notif-channel-sub">No email or GitHub alerts. We will not notify you when an edit is reviewed.</span>
          </span>
        </button>
      </div>

      {notifyChoice === 'email' &&
        <label className="ce-field ce-onboard-subfield" htmlFor="ce-onb-notify-email">
          <span className="ce-field-label">Email address</span>
          <input id="ce-onb-notify-email" type="email" className="ce-input"
            value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email" />
        </label>}

      {notifyChoice === 'github' &&
        <div className="ce-onboard-subfield">
          <button type="button"
            className={'ce-auth-github ce-onboard-ghbtn' + (ghConnecting ? ' is-busy' : '')}
            onClick={connectGithub} disabled={ghConnecting || ghConnected} aria-busy={ghConnecting}>
            {ghConnecting
              ? <span className="ce-auth-spinner" aria-hidden="true" />
              : ghConnected
                ? <Icon name="check" size={18} />
                : <OnbGitHubMark size={18} />}
            <span>{ghConnecting ? 'Connecting to GitHub…' : ghConnected ? 'Connected as samriv' : 'Connect GitHub'}</span>
          </button>
        </div>}
    </div>
  );

  const fields = (
    <div className="ce-onboard">
      <div className="ce-onboard-field">
        <label className="ce-field" htmlFor="ce-onb-name">
          <div className="ce-onboard-field-head">
            <span className="ce-field-label">Display name</span>
          </div>
          <input id="ce-onb-name" type="text" className="ce-input" ref={nameRef}
            value={name} onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
            placeholder="Your name" autoComplete="nickname" />
        </label>
      </div>

      {reachBlock}

      <div className="ce-toggle-row ce-onboard-toggle">
        <div className="ce-toggle-text">
          <div className="ce-toggle-title">Public profile</div>
          <p className="ce-acct-hint">
            Your display name and contributions are shown on your public profile. Turn this off to stay private: your edits are still attributed to you for reviewers, but your profile page is hidden.
          </p>
        </div>
        <button type="button"
          className={'ce-switch' + (visibility === 'public' ? ' is-on' : '')}
          role="switch" aria-checked={visibility === 'public'}
          aria-label="Public profile"
          onClick={() => setVisibility((v) => (v === 'public' ? 'private' : 'public'))}>
          <span className="ce-switch-knob" aria-hidden="true" />
        </button>
      </div>

      {error && <p className="ce-onboard-error" role="alert">{error}</p>}

      <button type="button" className="btn btn-primary ce-auth-submit ce-onboard-submit" onClick={submit}>
        {label}
      </button>
    </div>
  );

  if (variant === 'inline') return fields;

  return (
    <div className="ce-auth-page" data-screen-label="07 Finish setting up">
      <div className="ce-auth-card ce-onboard-card">
        <div className="ce-auth-head">
          <h1 className="ce-auth-title">Finish setting up</h1>
          <p className="ce-auth-sub">
            A couple of quick things so your contributions are attributed and you hear back when they’re reviewed.
          </p>
        </div>
        {fields}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Welcome — routed #/welcome page (flow A). Onboarding, then a done screen.
// ─────────────────────────────────────────────────────────────────────
function Welcome() {
  const user = window.useCurrentUser ? window.useCurrentUser() : null;
  const [done, setDone] = React.useState(false);

  // Signed out (e.g. visited directly): send them to sign-up.
  React.useEffect(() => {
    if (!user) window.location.hash = '#/signup';
  }, [user]);
  if (!user) return null;

  const stillNeeds = window.needsOnboarding ? window.needsOnboarding(user) : false;

  if (stillNeeds && !done) {
    return (
      <Onboarding
        user={user}
        variant="page"
        onComplete={(patch) => {
          if (window.completeOnboarding) window.completeOnboarding(patch);
          setDone(true);
        }} />
    );
  }

  // Done screen.
  const firstName = (user.name || user.gh || 'there').split(' ')[0];
  return (
    <div className="ce-auth-page" data-screen-label="08 Welcome">
      <div className="ce-auth-card ce-welcome-card">
        <div className="ce-welcome-check" aria-hidden="true"><Icon name="check" size={24} /></div>
        <h1 className="ce-auth-title">You’re all set, {firstName}.</h1>
        <div className="ce-welcome-actions">
          <a className="btn btn-primary" href="#/browse">Browse devices</a>
          <a className="btn btn-ghost" href="#/settings">View your account</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuthProviders, Onboarding, Welcome });
