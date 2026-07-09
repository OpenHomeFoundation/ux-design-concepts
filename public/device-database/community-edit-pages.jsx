/* Community-edit increment, Sign-in & Account pages, and the nav UserMenu.

   Routes added by app.jsx:
     · #/signin  → <SignIn />
     · #/settings → <Settings />

   Demo defaults to signed-in (window.CURRENT_USER). Neither the GitHub
   button nor the email form actually authenticate, they're affordances
   for the increment.
*/

// ─────────────────────────────────────────────────────────────────────
// GitHub mark, small inline SVG. Reuses currentColor so the button's
// label colour drives the glyph.
// ─────────────────────────────────────────────────────────────────────
const GitHubMark = ({ size = 18 }) =>
<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true">

    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>;


// ─────────────────────────────────────────────────────────────────────
// Sign-in page
// ─────────────────────────────────────────────────────────────────────
function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [err, setErr] = React.useState('');
  // Email is now a provider button like GitHub / passkey; clicking it reveals
  // the credentials form below the button group.
  const [showEmail, setShowEmail] = React.useState(false);
  const emailRef = React.useRef(null);
  React.useEffect(() => {
    if (showEmail) emailRef.current?.focus();
  }, [showEmail]);
  const fakeAction = (label) => alert(label + ', non-functional in this demo.');
  // Demo sign-in: any submit signs you in as the default account, then
  // returns you to the home page where the nav shows you're signed in.
  const doSignIn = () => {
    if (window.signIn) window.signIn();
    window.location.hash = '#/';
  };
  // Email credentials submit: validate inline (no native browser bubble),
  // then run the same demo sign-in.
  const submitEmail = () => {
    const e = email.trim();
    if (!e) {setErr('Enter your email address.');emailRef.current?.focus();return;}
    if (!/^\S+@\S+\.\S+$/.test(e)) {setErr('Enter a valid email address, like you@example.com.');emailRef.current?.focus();return;}
    if (!password) {setErr('Enter your password.');return;}
    setErr('');
    doSignIn();
  };
  // GitHub / passkey run a short simulated handoff so the mock reads like a
  // real provider flow rather than an instant redirect. The clicked button
  // shows a spinner, the rest disable, then sign-in completes.
  const [pending, setPending] = React.useState(null);
  const pendingTimer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(pendingTimer.current), []);
  const startProvider = (key) => {
    if (pending) return;
    setPending(key);
    pendingTimer.current = setTimeout(doSignIn, 1100);
  };

  return (
    <div className="ce-auth-page" data-screen-label="04 Sign in">
      <div className="ce-auth-card">
        <div className="ce-auth-head">
          <h1 className="ce-auth-title">Sign in to suggest edits</h1>
        </div>

        <div className="ce-auth-providers">
          <button
            type="button"
            className={'ce-auth-github' + (pending === 'github' ? ' is-busy' : '')}
            onClick={() => startProvider('github')}
            disabled={!!pending}
            aria-busy={pending === 'github'}>

            {pending === 'github' ?
            <span className="ce-auth-spinner" aria-hidden="true" /> :
            <GitHubMark size={18} />}
            <span>{pending === 'github' ? 'Connecting to GitHub…' : 'Sign in with GitHub'}</span>
          </button>

          <button
            type="button"
            className={'ce-auth-github' + (pending === 'passkey' ? ' is-busy' : '')}
            onClick={() => startProvider('passkey')}
            disabled={!!pending}
            aria-busy={pending === 'passkey'}>

            {pending === 'passkey' ?
            <span className="ce-auth-spinner" aria-hidden="true" /> :
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="8" r="4" />
              <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
              <circle cx="18" cy="9" r="2.5" />
              <path d="M18 11.5V18l-1.5 1.5L18 21" />
            </svg>}
            <span>{pending === 'passkey' ? 'Waiting for your passkey…' : 'Sign in with a passkey'}</span>
          </button>

          <button
            type="button"
            className="ce-auth-github"
            onClick={() => setShowEmail((s) => !s)}
            disabled={!!pending}
            aria-expanded={showEmail}
            aria-controls="ce-auth-form">

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <span>Sign in with email</span>
          </button>
        </div>

        {showEmail &&
        <form
          id="ce-auth-form"
          className="ce-auth-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submitEmail();
          }}>

          <label className="ce-field" htmlFor="ce-auth-email">
            <span className="ce-field-label">Email</span>
            <input
              id="ce-auth-email"
              type="email"
              className={'ce-input' + (err ? ' is-invalid' : '')}
              ref={emailRef}
              value={email}
              onChange={(e) => {setEmail(e.target.value);if (err) setErr('');}}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={err ? 'true' : undefined} />

          </label>
          <label className="ce-field" htmlFor="ce-auth-password">
            <span className="ce-field-label-row">
              <span className="ce-field-label">Password</span>
              <a
                href="#/signin"
                className="ce-auth-link"
                onClick={(e) => {e.preventDefault();fakeAction('Forgot password');}}>

                Forgot?
              </a>
            </span>
            <div className="ce-input-wrap">
              <input
                id="ce-auth-password"
                type={showPw ? 'text' : 'password'}
                className={'ce-input ce-input-has-action' + (err ? ' is-invalid' : '')}
                value={password}
                onChange={(e) => {setPassword(e.target.value);if (err) setErr('');}}
                autoComplete="current-password"
                aria-invalid={err ? 'true' : undefined} />

              <button
                type="button"
                className="ce-input-action"
                onClick={() => setShowPw((s) => !s)}
                aria-pressed={showPw}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          {err &&
          <p className="ce-field-error" role="alert"><Icon name="alert" size={16} />{err}</p>
          }
          <button type="submit" className="btn btn-primary ce-auth-submit">
            Sign in
          </button>
        </form>
        }

        <p className="ce-auth-foot">
          New here?{' '}
          <a
            href="#/signup"
            className="ce-auth-link"
            onClick={(e) => {e.preventDefault();window.location.hash = '#/signup';}}>

            Create an account
          </a>
          .
        </p>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Create-account page. The method chooser (GitHub / passkey / email) is the
// shared <AuthProviders>; picking one creates the account and routes to the
// adaptive onboarding at #/welcome.
// ─────────────────────────────────────────────────────────────────────
function CreateAccount() {
  const onAuthed = (method, fields) => {
    if (window.createAccount) window.createAccount(method, fields);
    window.location.hash = '#/welcome';
  };
  return (
    <div className="ce-auth-page" data-screen-label="06 Create account">
      <div className="ce-auth-card">
        <div className="ce-auth-head">
          <h1 className="ce-auth-title">Create your account</h1>
          <p className="ce-auth-sub">Join the contributors keeping the database accurate. It takes about a minute.</p>
        </div>

        {window.AuthProviders ?
        <window.AuthProviders verb="Sign up" onAuthed={onAuthed} /> :
        null}

        <p className="ce-auth-foot">
          Already have an account?{' '}
          <a
            href="#/signin"
            className="ce-auth-link"
            onClick={(e) => {e.preventDefault();window.location.hash = '#/signin';}}>

            Sign in
          </a>
          .
        </p>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// ConfirmDialog, our own confirmation modal (replaces window.confirm).
// Centered on every breakpoint (mobile/tablet included). Reuses the app's
// .modal-backdrop for the scrim, scroll-lock, and nav dimming.
// ─────────────────────────────────────────────────────────────────────
function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm, onCancel }) {
  const cancelRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    // Default focus to Cancel, the safe choice for a destructive prompt.
    cancelRef.current?.focus();
    const onKey = (e) => {if (e.key === 'Escape') {e.preventDefault();onCancel && onCancel();}};
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  if (!open) return null;
  return ReactDOM.createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {if (e.target === e.currentTarget) onCancel && onCancel();}}>

      <div className="ce-confirm" role="alertdialog" aria-modal="true" aria-labelledby="ce-confirm-title">
        <h2 className="ce-confirm-title" id="ce-confirm-title">{title}</h2>
        {message && <p className="ce-confirm-msg">{message}</p>}
        <div className="ce-confirm-actions">
          <button type="button" className="btn btn-secondary" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button type="button" ref={cancelRef} className="ce-confirm-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body);

}

// ─────────────────────────────────────────────────────────────────────
// Settings page
// ─────────────────────────────────────────────────────────────────────
function Settings({ route }) {
  const user = window.useCurrentUser && window.useCurrentUser() ||
  window.USERS && window.USERS[window.CURRENT_USER];
  const _hash = route && route.path || (window.location.hash || '').replace(/^#\/?/, '');
  // Contributor profiles (and their Settings tab) are a Stage 3 increment.
  const profilesOn = window.useIncrement ? window.useIncrement('contributor-profiles') : false;
  // Notifications (and its Settings tab) are their own Stage 3 increment.
  const notifOn = window.useIncrement ? window.useIncrement('notifications') : false;
  const _rawSub = _hash === 'settings/security' ? 'security' :
  _hash === 'settings/connections' ? 'connections' :
  _hash === 'settings/notifications' ? 'notifications' :
  _hash === 'settings/appearance' ? 'appearance' :
  'profile';
  // With profiles off there is no Profile tab, and with notifications off no
  // Notifications tab; either falls back to security.
  const sub = !profilesOn && _rawSub === 'profile' ? 'security' :
  !notifOn && _rawSub === 'notifications' ? 'security' :
  _rawSub;
  const [displayName, setDisplayName] = React.useState(user && user.name || '');
  // Drives the profile save bar's "stuck" hairline (shown only while it floats
  // over scrollable content).
  const [saveBarRef, saveBarSentinelRef, saveBarStuck] = window.useStuckBar ?
  window.useStuckBar() :
  [null, null, false];
  const [github, setGithub] = React.useState(user && user.gh || '');
  const [ghConnected, setGhConnected] = React.useState(!!(user && user.gh));
  // Keep GitHub connection state in sync if it changes elsewhere — e.g. the
  // inline "Connect GitHub" button on the Notifications page writes to
  // window.USERS and pings the auth store, which re-renders us.
  React.useEffect(() => {
    setGhConnected(!!(user && user.gh));
    if (user && user.gh) setGithub(user.gh);
  }, [user && user.gh]);
  const [photo, setPhoto] = React.useState(user && user.photo || '');
  const [email, setEmail] = React.useState(user && user.email || '');
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [emailDraft, setEmailDraft] = React.useState('');
  const [emailErr, setEmailErr] = React.useState('');
  // Public-profile fields (shown on #/contributors/:handle).
  const PRONOUN_PRESETS = ['they/them', 'she/her', 'he/him'];
  const _initialPronouns = user && user.pronouns || '';
  const [pronouns, setPronouns] = React.useState(_initialPronouns);
  const [pronounChoice, setPronounChoice] = React.useState(
    _initialPronouns === '' ? '' : PRONOUN_PRESETS.includes(_initialPronouns) ? _initialPronouns : 'custom'
  );
  const [location, setLocation] = React.useState(user && user.location || '');
  const [website, setWebsite] = React.useState(user && user.url || '');
  const [websiteErr, setWebsiteErr] = React.useState('');
  const [bio, setBio] = React.useState(user && user.bio || '');
  const [socials, setSocials] = React.useState(user && Array.isArray(user.socials) ? user.socials.map((s) => ({ ...s })) : []);
  const [isPrivate, setIsPrivate] = React.useState(!!(user && user.private));
  const [hasPassword, setHasPassword] = React.useState(!!(user && user.hasPassword));
  const [passkeys, setPasskeys] = React.useState(user && user.passkeys ? [...user.passkeys] : []);
  const [pwOpen, setPwOpen] = React.useState(false);
  const [pw1, setPw1] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [pwErr, setPwErr] = React.useState('');
  const [confirmDialog, setConfirmDialog] = React.useState(null);
  const [dirty, setDirty] = React.useState(false);
  const [reachNudgeDismissed, setReachNudgeDismissed] = React.useState(() => {
    try {return localStorage.getItem('devicedb.reachNudge.dismissed') === '1';} catch (e) {return false;}
  });
  const dismissReachNudge = () => {
    setReachNudgeDismissed(true);
    try {localStorage.setItem('devicedb.reachNudge.dismissed', '1');} catch (e) {/* private mode */}
  };
  const fileRef = React.useRef(null);

  // Sliding accent rail for the settings menu (desktop). The vertical line
  // rests on the active item and animates to whichever item is hovered.
  // Order must match the rendered navItems, so the Profile entry drops out
  // when the Contributor-profiles increment is off (else the rail is offset).
  const NAV_ORDER = [
  ...(profilesOn ? ['profile'] : []),
  'security',
  ...(notifOn ? ['notifications'] : []),
  'connections',
  'appearance'];

  const activeIdx = Math.max(0, NAV_ORDER.indexOf(sub));
  const navListRef = React.useRef(null);
  const navLinkRefs = React.useRef([]);
  const [navHover, setNavHover] = React.useState(null);
  const [rail, setRail] = React.useState({ y: 0, h: 0, ready: false });
  // The rail is placed at its initial position with transitions OFF, so it
  // renders directly instead of sliding/fading in. Transitions are enabled
  // one frame later so hover-follow movement still animates.
  const [railAnimate, setRailAnimate] = React.useState(false);
  const measureRail = React.useCallback(() => {
    const idx = navHover != null ? navHover : activeIdx;
    const el = navLinkRefs.current[idx];
    if (el) setRail({ y: el.offsetTop, h: el.offsetHeight, ready: true });
  }, [navHover, activeIdx]);
  React.useLayoutEffect(() => {measureRail();}, [measureRail]);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setRailAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);
  React.useEffect(() => {
    window.addEventListener('resize', measureRail);
    return () => window.removeEventListener('resize', measureRail);
  }, [measureRail]);

  // A "sign-in method" is a password, a passkey, or a connected GitHub.
  // The account must always keep at least one, the rule that makes the
  // remove buttons go disabled.
  const githubConnected = ghConnected;
  const methodCount = (hasPassword ? 1 : 0) + passkeys.length + (githubConnected ? 1 : 0);
  const isLastMethod = methodCount <= 1;

  // Security actions apply immediately (and persist) rather than waiting for
  // the main Save, they're discrete, not free-text fields.
  const persist = (patch) => {
    const id = window.CURRENT_USER;
    if (window.USERS[id]) window.USERS[id] = { ...window.USERS[id], ...patch };
  };
  const savePassword = () => {
    if (pw1.length < 8) {setPwErr('Use at least 8 characters.');return;}
    if (pw1 !== pw2) {setPwErr("Those passwords don't match.");return;}
    setPwErr('');
    setHasPassword(true);persist({ hasPassword: true });
    setPwOpen(false);setPw1('');setPw2('');
  };
  const removePassword = () => {
    if (isLastMethod) return;
    setConfirmDialog({
      title: 'Remove your password?',
      message: "You'll keep signing in with your other methods, and can set a new password any time.",
      confirmLabel: 'Remove password',
      danger: true,
      onConfirm: () => {setHasPassword(false);persist({ hasPassword: false });}
    });
  };
  const addPasskey = () => {
    const label = prompt('Name this passkey', 'This device');
    if (!label) return;
    const next = [...passkeys, { id: 'pk' + Date.now(), label: label.trim(), added: new Date().toISOString().slice(0, 10) }];
    setPasskeys(next);persist({ passkeys: next });
  };
  const removePasskey = (id) => {
    if (isLastMethod) return;
    const pk = passkeys.find((p) => p.id === id);
    setConfirmDialog({
      title: 'Remove this passkey?',
      message: '“' + (pk ? pk.label : 'This passkey') + '” will no longer be able to sign in to your account.',
      confirmLabel: 'Remove passkey',
      danger: true,
      onConfirm: () => {const next = passkeys.filter((p) => p.id !== id);setPasskeys(next);persist({ passkeys: next });}
    });
  };
  const connectGithub = () => {
    // Demo: real app opens GitHub OAuth and reads the handle back. Here we
    // just flip to connected, reusing the last known handle.
    const handle = github || 'yourhandle';
    setGithub(handle);setGhConnected(true);persist({ gh: handle });
  };
  const disconnectGithub = () => {
    if (isLastMethod) return;
    setConfirmDialog({
      title: 'Disconnect GitHub?',
      message: 'You can reconnect any time. Your edits will stop being attributed to this handle.',
      confirmLabel: 'Disconnect',
      danger: true,
      onConfirm: () => {setGhConnected(false);persist({ gh: undefined });}
    });
  };
  const fmtDate = (d) => {
    try {return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });}
    catch (e) {return d;}
  };

  const onPickPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {setPhoto(reader.result);setDirty(true);};
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 12 }}>You're signed out.</h1>
        <p className="muted">Sign in to view your account.</p>
        <a className="btn btn-primary" href="#/signin">Sign in</a>
      </div>);

  }

  const save = (e) => {
    e.preventDefault();
    // Validate the website inline (no native browser bubble).
    const w = website.trim();
    if (w && !/^https?:\/\/\S+\.\S+/i.test(w)) {
      setWebsiteErr('Enter a full URL, starting with http:// or https://.');
      return;
    }
    setWebsiteErr('');
    // Write back into window.USERS so the rest of the app reflects the change.
    const id = window.CURRENT_USER;
    if (window.USERS[id]) {
      window.USERS[id] = {
        ...window.USERS[id],
        name: displayName, photo: photo || undefined,
        pronouns: pronouns.trim() || undefined,
        location: location.trim() || undefined,
        url: website.trim() || undefined,
        bio: bio.trim() || undefined,
        private: isPrivate || undefined,
        socials: socials.filter((s) => s && (s.url || '').trim())
      };
    }
    setDirty(false);
  };

  // Social-account rows.
  const addSocial = () => {setSocials([...socials, { url: '' }]);setDirty(true);};
  const updateSocial = (i, patch) => {setSocials(socials.map((s, j) => j === i ? { ...s, ...patch } : s));setDirty(true);};
  const removeSocial = (i) => {setSocials(socials.filter((_, j) => j !== i));setDirty(true);};

  // Privacy toggle is now part of the profile form: flipping it marks the
  // form dirty and the value is committed by the main Save button (rather
  // than persisting immediately on click).
  const togglePrivate = () => {setIsPrivate((v) => !v);setDirty(true);};
  // Email is self-contained: its own inline editor that commits on its own,
  // independent of the profile Save button (like passkeys and password).
  const openEmail = () => {setEmailDraft(email);setEmailErr('');setEmailOpen(true);};
  const saveEmail = () => {
    const v = emailDraft.trim();
    if (!v) {setEmailErr('Enter your email address.');return;}
    if (!/^\S+@\S+\.\S+$/.test(v)) {setEmailErr('Enter a valid email address, like you@example.com.');return;}
    setEmailErr('');
    setEmail(v);persist({ email: v || undefined });setEmailOpen(false);
  };
  const removeEmail = () => {setEmail('');persist({ email: undefined });setEmailOpen(false);};

  const handle = window.CURRENT_USER;
  const navItems = [
  ...(profilesOn ? [{ id: 'profile', label: 'Profile', href: '#/settings' }] : []),
  { id: 'security', label: 'Sign-in and security', href: '#/settings/security' },
  ...(notifOn ? [{ id: 'notifications', label: 'Notifications', href: '#/settings/notifications' }] : []),
  { id: 'connections', label: 'Connections', href: '#/settings/connections' },
  { id: 'appearance', label: 'Appearance', href: '#/settings/appearance' }];

  return (
    <div className="container ce-account-shell" data-screen-label="05 Settings">
      <aside className="ce-account-nav" aria-label="Settings">
        <nav className="ce-account-nav-list" ref={navListRef} onMouseLeave={() => setNavHover(null)}>
          <div className="ce-account-nav-track">
            <span
              className="ce-account-nav-rail"
              aria-hidden="true"
              style={{ transform: `translateY(${rail.y}px)`, height: rail.h + 'px', opacity: rail.ready ? 1 : 0, transition: railAnimate ? undefined : 'none' }} />
            {navItems.map((it, i) =>
            <a
              key={it.id}
              href={it.href}
              ref={(el) => {navLinkRefs.current[i] = el;}}
              onMouseEnter={() => setNavHover(i)}
              className={'ce-account-nav-link' + (sub === it.id ? ' is-active' : '')}
              aria-current={sub === it.id ? 'page' : undefined}>
                {it.label}
              </a>
            )}
          </div>
        </nav>
      </aside>

      <div className="ce-account-content">
        {notifOn && !ghConnected && !(email && email.trim()) && !reachNudgeDismissed &&
        <window.Banner
          className="ce-banner-at-account"
          icon="info"
          title="Add a way to reach you when you are away"
          actions={<React.Fragment>
              <a className="btn btn-secondary btn-sm" href="#/settings/notifications">Set up notifications</a>
              <button type="button" className="ce-acct-quiet" onClick={dismissReachNudge}>Dismiss</button>
            </React.Fragment>}>
            Updates always show on the Your edits page. Add an email address, or use a connected GitHub account, so we can also tell you when an edit goes live or is declined.
          </window.Banner>
        }

        {sub === 'profile' &&
        <React.Fragment>
          <div className="ce-account-head">
            <div className="ce-account-head-text">
              <div className="eyebrow section-eyebrow" style={{marginBottom: 8, color: "var(--primary)"}}>Settings</div>
              <h1 className="ce-account-h1">Profile</h1>
              <p className="ce-account-sub">Your contributor details, and how much of your profile is public.</p>
            </div>
          </div>
          <form onSubmit={save} className="ce-account-form" noValidate>
        <section className="ce-account-section">
          <div className="ce-acct-rows">
            <div className="ce-notif-channels ce-chan-iconlead" role="radiogroup" aria-label="Profile visibility">
              <button
                    type="button"
                    role="radio"
                    aria-checked={!isPrivate}
                    className={'ce-notif-channel' + (!isPrivate ? ' is-active' : '')}
                    onClick={() => {setIsPrivate(false);setDirty(true);}}>
                <span className="ce-notif-radio" aria-hidden="true" />
                <span className="ce-notif-channel-ico" aria-hidden="true"><Icon name="eye" size={18} /></span>
                <span className="ce-notif-channel-main">
                  <span className="ce-notif-channel-label">Public profile</span>
                  <span className="ce-notif-channel-sub">Your profile and your edits are visible to everyone.</span>
                </span>
              </button>
              <button
                    type="button"
                    role="radio"
                    aria-checked={isPrivate}
                    className={'ce-notif-channel' + (isPrivate ? ' is-active' : '')}
                    onClick={() => {setIsPrivate(true);setDirty(true);}}>
                <span className="ce-notif-radio" aria-hidden="true" />
                <span className="ce-notif-channel-ico" aria-hidden="true"><Icon name="lock" size={18} /></span>
                <span className="ce-notif-channel-main">
                  <span className="ce-notif-channel-label">Private profile</span>
                  <span className="ce-notif-channel-sub">Your profile is hidden, and your edits show as "Private contributor".</span>
                </span>
              </button>
            </div>
            <a className="btn btn-secondary ce-account-viewpublic" href={`#/contributors/${handle}`}>
              <Icon name="eye" size={14} /> View profile
            </a>
          </div>
        </section>
        <section className="ce-account-section">
          <div className="ce-acct-rows">
            <div className="ce-acct-row">
              <div className="ce-acct-label">Photo</div>
              <div className="ce-acct-control">
                <div className="ce-acct-photo">
                  <window.Avatar user={{ ...user, name: displayName, photo }} size={104} />
                  <div className="ce-acct-photo-actions">
                    <button
                          type="button"
                          className="btn btn-secondary ce-acct-photo-btn"
                          onClick={() => fileRef.current && fileRef.current.click()}>

                      {photo ? 'Change photo' : 'Upload photo'}
                    </button>
                    {photo &&
                        <button
                          type="button"
                          className="ce-acct-quiet"
                          onClick={() => {setPhoto('');setDirty(true);}}>

                      Remove
                    </button>
                        }
                    <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          onChange={onPickPhoto}
                          style={{ display: 'none' }} />

                  </div>
                </div>
              </div>
            </div>
            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">Display name</div>
              <div className="ce-acct-control">
                <input
                      id="ce-account-name"
                      className="ce-input"
                      value={displayName}
                      onChange={(e) => {setDisplayName(e.target.value);setDirty(true);}} />

                <p className="ce-acct-hint">Shown on every edit you contribute.</p>
              </div>
            </div>
            {!isPrivate &&
                <React.Fragment>
            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">Pronouns</div>
              <div className="ce-acct-control">
                <select
                        className="ce-input ce-select"
                        value={pronounChoice}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPronounChoice(v);
                          if (v === 'custom') {setPronouns(PRONOUN_PRESETS.includes(pronouns) ? '' : pronouns);} else
                          {setPronouns(v);}
                          setDirty(true);
                        }}>
                  <option value="">Don't specify</option>
                  <option value="they/them">they/them</option>
                  <option value="she/her">she/her</option>
                  <option value="he/him">he/him</option>
                  <option value="custom">Custom</option>
                </select>
                {pronounChoice === 'custom' ?
                      <input
                        className="ce-input ce-pronoun-custom"
                        value={pronouns}
                        placeholder="Enter your pronouns"
                        aria-label="Custom pronouns"
                        onChange={(e) => {setPronouns(e.target.value);setDirty(true);}} /> :
                      null}
              </div>
            </div>
            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">Bio</div>
              <div className="ce-acct-control">
                <textarea
                        className="ce-input ce-textarea"
                        value={bio}
                        rows={3}
                        maxLength={280}
                        placeholder="A line or two about what you work on."
                        onChange={(e) => {setBio(e.target.value);setDirty(true);}} />
                <p className="ce-acct-hint">Shown at the top of your public profile. Up to 280 characters.</p>
              </div>
            </div>
            <div className="ce-acct-row">
              <div className="ce-acct-label">Location</div>
              <div className="ce-acct-control">
                <input
                        className="ce-input"
                        value={location}
                        placeholder="City, country"
                        onChange={(e) => {setLocation(e.target.value);setDirty(true);}} />
              </div>
            </div>
            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">Website</div>
              <div className="ce-acct-control">
                <input
                        type="url"
                        className={'ce-input' + (websiteErr ? ' is-invalid' : '')}
                        value={website}
                        placeholder="https://"
                        aria-invalid={websiteErr ? 'true' : undefined}
                        onChange={(e) => {setWebsite(e.target.value);setDirty(true);if (websiteErr) setWebsiteErr('');}} />
                {websiteErr &&
                      <p className="ce-field-error" role="alert"><Icon name="alert" size={16} />{websiteErr}</p>
                      }
              </div>
            </div>
            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">Social accounts</div>
              <div className="ce-acct-control">
                {socials.length === 0 ?
                      <p className="ce-sec-status ce-sec-empty">None added.</p> :
                      <ul className="ce-social-list">
                    {socials.map((s, i) =>
                        <li key={i} className="ce-social-row">
                        <input
                            className="ce-input ce-social-url"
                            value={s.url || ''}
                            placeholder="https://"
                            aria-label="Link"
                            onChange={(e) => updateSocial(i, { url: e.target.value })} />
                        <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => removeSocial(i)}>
                          Remove
                        </button>
                      </li>
                        )}
                  </ul>
                      }
                <button type="button" className="btn btn-secondary ce-sec-btn ce-sec-add" onClick={addSocial}>
                  + Add account
                </button>
              </div>
            </div>
            </React.Fragment>
                }
          </div>
        </section>

            <div className={'ce-account-savebar' + (saveBarStuck ? ' is-stuck' : '')} ref={saveBarRef} aria-live="polite">
              <button type="submit" className="btn btn-primary" disabled={!dirty}>
                {dirty ? 'Save changes' : 'Saved'}
              </button>
            </div>
            <div ref={saveBarSentinelRef} aria-hidden="true" style={{ height: 1, marginTop: 'calc(var(--space-7) * -1)' }} />
          </form>
        </React.Fragment>
        }

        {sub === 'connections' &&
        <React.Fragment>
          <div className="eyebrow section-eyebrow" style={{marginBottom: 8, color: "var(--primary)"}}>Settings</div>
          <h1 className="ce-account-h1">Connections</h1>
          <p className="ce-account-sub">Connect external accounts.</p>
          <div className="ce-account-form">
        <section className="ce-account-section">
          <h2 className="ce-account-section-head">GitHub</h2>
          <p style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--fs-14)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            Your GitHub account signs you in and attributes your edits to you. You can also choose to receive <a className="ce-link-ink" href="#/settings/notifications">notifications</a> through GitHub instead of by email.
          </p>
          <div className="ce-acct-rows">
            <div className="ce-acct-row">
              <div className="ce-acct-label">Account</div>
              <div className="ce-acct-control">
                {ghConnected &&
                    <ul className="ce-passkey-list">
                    <li className="ce-passkey">
                      <span className="ce-passkey-icon" aria-hidden="true">
                        <GitHubMark size={18} />
                      </span>
                      <span className="ce-passkey-main">
                        <span className="ce-passkey-label">{github}</span>
                        <span className="ce-passkey-meta">Connected</span>
                      </span>
                      <button
                          type="button"
                          className="ce-acct-quiet ce-acct-quiet-danger"
                          onClick={disconnectGithub}
                          disabled={isLastMethod}
                          title={isLastMethod ? 'Add a password or passkey before disconnecting your only sign-in method' : undefined}>
                        Disconnect
                      </button>
                    </li>
                  </ul>
                    }
                {!ghConnected &&
                    <button type="button" className="btn btn-secondary ce-sec-btn ce-sec-add ce-sec-add-gh" onClick={connectGithub}>
                    <GitHubMark size={16} />
                    <span>Connect GitHub</span>
                  </button>
                    }
              </div>
            </div>
          </div>
        </section>
          </div>
        </React.Fragment>
        }

        {sub === 'security' &&
        <React.Fragment>
          <div className="eyebrow section-eyebrow" style={{marginBottom: 8, color: "var(--primary)"}}>Settings</div>
          <h1 className="ce-account-h1">Sign-in and security</h1>
          <p className="ce-account-sub">Manage how you sign in to your account: your email, a password, and passkeys. Add, change, or remove any of them.
</p>
          <div className="ce-account-form">
        <section className="ce-account-section">
          <div className="ce-acct-rows">

            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">Email</div>
              <div className="ce-acct-control">
                {!emailOpen && <div className="ce-sec-line">
                    <span className="ce-sec-status">{email ? email : 'No email set'}</span>
                    <div className="ce-sec-actions">
                      <button type="button" className="ce-acct-quiet" onClick={openEmail}>
                        {email ? 'Change' : 'Add email'}
                      </button>
                      {email &&
                        <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={removeEmail}>
                          Remove
                        </button>
                        }
                    </div>
                  </div>
                    }
                {emailOpen &&
                    <div className="ce-sec-form">
                    <input
                        type="email"
                        className={'ce-input' + (emailErr ? ' is-invalid' : '')}
                        value={emailDraft}
                        onChange={(e) => {setEmailDraft(e.target.value);if (emailErr) setEmailErr('');}}
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-label="Email address"
                        aria-invalid={emailErr ? 'true' : undefined} />

                    {emailErr &&
                      <p className="ce-field-error" role="alert"><Icon name="alert" size={16} />{emailErr}</p>
                      }
                    <div className="ce-sec-form-actions">
                      <button type="button" className="btn btn-primary ce-sec-btn" onClick={saveEmail}>
                        {email ? 'Update email' : 'Save email'}
                      </button>
                      <button type="button" className="ce-acct-quiet" onClick={() => {setEmailOpen(false);setEmailErr('');}}>
                        Cancel
                      </button>
                    </div>
                  </div>
                    }
                <p className="ce-acct-hint ce-acct-hint-bound">Used to sign in and recover your account. Notifications are sent here by default, change where in Notifications.</p>
              </div>
            </div>

            <div className="ce-acct-row ce-acct-row-firstline">
              <div className="ce-acct-label">Password</div>
              <div className="ce-acct-control">
                {!pwOpen &&
                    <div className="ce-sec-line">
                    <span className="ce-sec-status">
                      {hasPassword ? '••••••••••' : 'No password set'}
                    </span>
                    <div className="ce-sec-actions">
                      <button type="button" className="ce-acct-quiet" onClick={() => setPwOpen(true)}>
                        {hasPassword ? 'Change' : 'Set a password'}
                      </button>
                      {hasPassword &&
                        <button
                          type="button"
                          className="ce-acct-quiet ce-acct-quiet-danger"
                          onClick={removePassword}
                          disabled={isLastMethod}
                          title={isLastMethod ? 'Add a passkey before removing your only sign-in method' : undefined}>
                          Remove
                        </button>
                        }
                    </div>
                  </div>
                    }
                {pwOpen &&
                    <div className="ce-sec-form">
                    <input
                        type="password"
                        className={'ce-input' + (pwErr ? ' is-invalid' : '')}
                        value={pw1}
                        onChange={(e) => {setPw1(e.target.value);if (pwErr) setPwErr('');}}
                        placeholder="New password"
                        autoComplete="new-password"
                        aria-label="New password"
                        aria-invalid={pwErr ? 'true' : undefined} />

                    <input
                        type="password"
                        className={'ce-input' + (pwErr ? ' is-invalid' : '')}
                        value={pw2}
                        onChange={(e) => {setPw2(e.target.value);if (pwErr) setPwErr('');}}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        aria-label="Confirm new password"
                        aria-invalid={pwErr ? 'true' : undefined} />

                    {pwErr &&
                      <p className="ce-field-error" role="alert"><Icon name="alert" size={16} />{pwErr}</p>
                      }
                    <div className="ce-sec-form-actions">
                      <button type="button" className="btn btn-primary ce-sec-btn" onClick={savePassword}>
                        {hasPassword ? 'Update password' : 'Set password'}
                      </button>
                      <button type="button" className="ce-acct-quiet" onClick={() => {setPwOpen(false);setPw1('');setPw2('');setPwErr('');}}>
                        Cancel
                      </button>
                    </div>
                  </div>
                    }
              </div>
            </div>

            <div className="ce-acct-row ce-acct-row-firstline ce-acct-row-firstline-pk">
              <div className="ce-acct-label">Passkeys</div>
              <div className="ce-acct-control">
                {passkeys.length === 0 ?
                    <p className="ce-sec-status ce-sec-empty">No passkeys yet.</p> :

                    <ul className="ce-passkey-list">
                    {passkeys.map((pk) =>
                      <li key={pk.id} className="ce-passkey">
                        <span className="ce-passkey-icon" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="8" r="4" />
                            <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
                            <circle cx="18" cy="9" r="2.5" />
                            <path d="M18 11.5V18l-1.5 1.5L18 21" />
                          </svg>
                        </span>
                        <span className="ce-passkey-main">
                          <span className="ce-passkey-label">{pk.label}</span>
                          <span className="ce-passkey-meta">Added {fmtDate(pk.added)}</span>
                        </span>
                        <button
                          type="button"
                          className="ce-acct-quiet ce-acct-quiet-danger"
                          onClick={() => removePasskey(pk.id)}
                          disabled={isLastMethod}
                          title={isLastMethod ? 'Add a password before removing your only sign-in method' : undefined}>
                          Remove
                        </button>
                      </li>
                      )}
                  </ul>
                    }
                <button type="button" className="btn btn-secondary ce-sec-btn ce-sec-add" onClick={addPasskey}>
                  + Add a passkey
                </button>
              </div>
            </div>

          </div>
        </section>
          </div>
        </React.Fragment>
        }

        {sub === 'notifications' && notifOn && window.NotificationsSettings &&
        <window.NotificationsSettings />
        }

        {sub === 'appearance' && window.AppearanceSettings &&
        <window.AppearanceSettings />
        }

        <ConfirmDialog
          open={!!confirmDialog}
          title={confirmDialog && confirmDialog.title}
          message={confirmDialog && confirmDialog.message}
          confirmLabel={confirmDialog && confirmDialog.confirmLabel}
          danger={confirmDialog && confirmDialog.danger}
          onConfirm={() => {if (confirmDialog && confirmDialog.onConfirm) confirmDialog.onConfirm();setConfirmDialog(null);}}
          onCancel={() => setConfirmDialog(null)} />

      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// UserMenu, avatar in the nav. Clicking it goes straight to the Settings
// page (no dropdown). Sign out lives in the Settings sidebar; the public
// profile is reachable from the Settings Profile tab. Only rendered when
// the community-edit increment is on (Nav handles the gating).
// ─────────────────────────────────────────────────────────────────────
function UserMenu() {
  const user = window.useCurrentUser && window.useCurrentUser() ||
  window.USERS && window.USERS[window.CURRENT_USER];

  if (!user) {
    // Signed-out fallback, show a Sign in link instead.
    return (
      <a className="ce-nav-signin" href="#/signin">
        Sign in
      </a>);

  }

  return (
    <a
      className="ce-usermenu-btn"
      href="#/settings"
      aria-label={`Your account and settings, ${user.name}`}>
      <window.Avatar user={user} size={32} />
    </a>);

}

// ─────────────────────────────────────────────────────────────────────
// NavPrimaryAction, the detail/edit page's primary action (Edit / Submit
// for review) mirrored into the nav, left of the avatar, once the in-page
// button scrolls out of view. Only shown when signed in.
// ─────────────────────────────────────────────────────────────────────
function NavPrimaryAction() {
  const action = window.useNavAction ? window.useNavAction() : null;
  // Mirror the device page's "Edit" affordance into the nav once the in-page
  // button scrolls out of view. Guests can edit too (and sign in at submit
  // time), so this shows whether or not they're signed in. The edit page's
  // submit/discard actions are NOT mirrored here — they live in the
  // persistent bottom save bar at every breakpoint.
  if (!action) return null;
  return (
    <div className="ce-nav-actions">
      <button
        type="button"
        className="btn btn-sm ce-nav-action btn-secondary"
        onClick={action.onClick}>
        <window.Icon name="pencil" size={13} />
        {action.label}
      </button>
    </div>);
}

// ─────────────────────────────────────────────────────────────────────
// NavSignOut, top-right control shown on the account page in place of the
// avatar. Signs out and returns home.
// ─────────────────────────────────────────────────────────────────────
function NavSignOut() {
  return (
    <button
      type="button"
      className="ce-nav-signout"
      onClick={() => {if (window.signOut) window.signOut();window.location.hash = '#/';}}>

      Sign out
    </button>);

}

// Expose to other JSX files.
Object.assign(window, { SignIn, CreateAccount, Settings, UserMenu, NavPrimaryAction, NavSignOut, GitHubMark, ConfirmDialog });