/* Public contributor profiles + the contributors directory.
   Community-edit increment.

   Routes (wired in app.jsx):
     · #/contributors            → <ContributorsIndex />   (directory)
     · #/contributors/:handle    → <ContributorProfile />  (one person)

   A profile is identity (avatar, name, bio, links) plus a contributions
   timeline. The SAME component renders your own profile and everyone
   else's; your own adds Settings / Sign out and is reached by clicking the
   nav avatar. Pending ("awaiting review") edits are public here, by product
   decision, so they show on every profile alongside live edits.

   The timeline is derived, not stored: live edits come from each device's
   editHistory filtered by author, pending edits from the pending store.

   Privacy: window.USERS[id].private hides the whole profile from others;
   .hideActivity keeps the header but hides stats + timeline. You always see
   your own in full.
*/

// ─────────────────────────────────────────────────────────────────────
// Field-key → human label (for pending edits, which are keyed by field).
// ─────────────────────────────────────────────────────────────────────
const PROFILE_FIELD_LABELS = {
  name: 'Name', summary: 'Summary', photos: 'Photos', description: 'Description',
  instructions: 'Setup instructions', ecosystems: 'Ecosystems and apps',
  connectivity: 'Connectivity', protocols: 'Protocols', bridge: 'Bridge',
  dimensions: 'Dimensions', identifiers: 'Identifiers', references: 'References',
  connectsWith: 'Connects with'
};
function _prettifyKey(k) {
  return String(k).replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();
}
function profileFieldLabel(key) {
  if (!key) return 'Field';
  if (key.indexOf('spec:') === 0) {
    const k = key.slice(5);
    const specs = (typeof window !== 'undefined' && window.CATEGORY_SPECS) || {};
    for (const cat in specs) {
      const hit = (specs[cat] || []).find((f) => f.key === k);
      if (hit && hit.label) return hit.label;
    }
    return _prettifyKey(k);
  }
  return PROFILE_FIELD_LABELS[key] || _prettifyKey(key);
}

// The auto "device created" provenance row is not a human edit, mirror the
// rule used by the detail page so the timeline only shows real edits.
function _isCreationEntry(e) {
  if (!e) return false;
  if (e.summary === 'Initial entry') return true;
  return Array.isArray(e.changes) && e.changes.length === 1 &&
    e.changes[0] && e.changes[0].verb === 'created';
}

// Gather one contributor's edits across the whole database.
function gatherContributions(handle) {
  const devices = (typeof window !== 'undefined' && window.DEVICES) || [];
  const live = [];
  devices.forEach((d) => {
    (d.editHistory || []).forEach((e) => {
      if (e.by !== handle || _isCreationEntry(e)) return;
      live.push({ kind: 'live', deviceId: d.id, device: d, at: e.at, pr: e.pr, summary: e.summary, changes: e.changes || [] });
    });
  });

  const pending = [];
  devices.forEach((d) => {
    const p = (window.getPending && window.getPending(d.id)) || {};
    const mine = Object.keys(p).filter((k) => p[k] && p[k].by === handle);
    if (mine.length === 0) return;
    const at = mine.map((k) => p[k].at).filter(Boolean).sort().reverse()[0];
    const pr = p[mine[0]].pr;
    pending.push({
      kind: 'pending', deviceId: d.id, device: d, at, pr,
      changes: mine.map((k) => ({ field: k, verb: 'edited' }))
    });
  });

  const all = [...live, ...pending].sort((a, b) => new Date(b.at) - new Date(a.at));
  // Contributions are submissions (pull requests): each merged edit-event and
  // each in-review device is one PR. Counting fields on the in-review side
  // would mix units with the merged side, so we count PRs consistently.
  const contributions = live.length + pending.length;
  const deviceIds = new Set(all.map((c) => c.deviceId));
  const since = all.length
    ? all.map((c) => c.at).filter(Boolean).sort()[0]
    : null;
  return { live, pending, all, contributions, deviceCount: deviceIds.size, since };
}

// Your own unsubmitted drafts (Stage 3 "A"). These belong to your account
// and are never attributed to anyone publicly, so they show only on your own
// profile, and never count toward the public contribution totals.
function gatherDrafts() {
  const devices = (typeof window !== 'undefined' && window.DEVICES) || [];
  const drafts = (window.allDrafts && window.allDrafts()) || {};
  const items = [];
  Object.keys(drafts).forEach((id) => {
    const d = devices.find((x) => x.id === id);
    const fields = (drafts[id] && drafts[id].fields) || {};
    const keys = Object.keys(fields);
    if (!d || keys.length === 0) return;
    items.push({
      kind: 'draft', deviceId: id, device: d, at: drafts[id].at,
      changes: keys.map((k) => ({ field: k, verb: 'edited' }))
    });
  });
  return items;
}

function _monthYear(input) {
  if (!input) return '-';
  const d = new Date(input);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}
function _hostname(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch (e) { return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, ''); }
}
function _faviconUrl(url) {
  const host = _hostname(url);
  return host ? `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}` : '';
}

// ─────────────────────────────────────────────────────────────────────
// One contribution row in the timeline. Device-forward (avatar is the
// device glyph, not the person, since the whole list is one person).
// ─────────────────────────────────────────────────────────────────────
function ContributionRow({ item }) {
  const Glyph = window.CategoryGlyph;
  const d = item.device;
  const when = window.formatDateShort ? window.formatDateShort(item.at) : item.at;
  const full = window.formatDateTime ? window.formatDateTime(item.at) : when;
  // Mirror the Browse card: prefer the device's first product photo, then a
  // styled placeholder, then the category glyph.
  const photos = (d && d.photos) || [];
  const firstPhoto = photos.length ? photos[0] : null;
  const isUrl = typeof firstPhoto === 'string' && !firstPhoto.startsWith('placeholder:');
  // Whole row is clickable. Use a JS handler rather than a stretched-link
  // overlay so the row's children stay individually selectable (design
  // markup tool, etc). Inner anchors handle their own clicks, and an active
  // text selection is left alone.
  const goToDevice = (e) => {
    if (e.target.closest('a')) return;
    if (window.getSelection && String(window.getSelection())) return;
    window.location.hash = `#/device/${item.deviceId}`;
  };
  return (
    <li className="ce-contrib-row" onClick={goToDevice}>
      <a className={'ce-contrib-tile' + (firstPhoto && isUrl ? ' has-photo' : '')} href={`#/device/${item.deviceId}`} aria-hidden="true" tabIndex={-1}>
        {firstPhoto && isUrl ?
          <img src={firstPhoto} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /> :
        firstPhoto && window.PhotoPlaceholder ?
          <window.PhotoPlaceholder id={firstPhoto + ':' + d.id + ':0'} category={d.category} alt="" /> :
        Glyph ? <Glyph category={d.category} size={26} /> : null}
      </a>
      <div className="ce-contrib-body">
        <div className="ce-contrib-meta">
          <time className="ce-contrib-when" dateTime={item.at} title={full}>{when}</time>
          {item.kind === 'pending' ? (
            <span className="ce-contrib-badge ce-contrib-badge-pending">
              <span className="ce-pending-dot" aria-hidden="true" /> Awaiting review
            </span>
          ) : item.kind === 'draft' ? (
            <span className="ce-contrib-badge ce-contrib-badge-draft">
              <span className="ce-pending-dot ce-draft-dot" aria-hidden="true" /> Draft
            </span>
          ) : null}
        </div>
        <div className="ce-contrib-top">
          <a className="ce-contrib-device" href={`#/device/${item.deviceId}`}>
            <span className="ce-contrib-name">{d.name}</span>
            <span className="ce-contrib-mfr">{d.manufacturer}</span>
          </a>
        </div>
        {item.summary ? <div className="ce-contrib-summary">{item.summary}</div> : null}
        {item.changes && item.changes.length > 0 && window.EditChangeLine ?
          <ul className="ce-change-list ce-contrib-changes">
            {item.changes.map((c, i) => <window.EditChangeLine key={i} change={c} />)}
          </ul> : null}
      </div>
    </li>);
}

// ─────────────────────────────────────────────────────────────────────
// Profile page
// ─────────────────────────────────────────────────────────────────────
function ContributorProfile({ handle }) {
  window.useCurrentUser && window.useCurrentUser(); // re-render on sign-out
  window.useDrafts && window.useDrafts(); // re-render when your local drafts change
  const user = window.getUser ? window.getUser(handle) : null;
  const currentId = window.CURRENT_USER;
  const isSelf = handle === currentId;

  if (!user) {
    return (
      <div className="container ce-profile-missing" data-screen-label="Profile not found">
        <h1>Contributor not found.</h1>
        <p className="muted">We couldn't find a contributor with that handle.</p>
        <a className="btn btn-secondary" href="#/contributors">All contributors</a>
      </div>);
  }

  const isPrivate = !!user.private && !isSelf;
  const activityHidden = !!user.hideActivity && !isSelf;

  // Centered empty-state for a fully-private profile.
  if (isPrivate) {
    return (
      <div className="container ce-profile-private" data-screen-label="Profile (private)">
        <div className="ce-private-card">
          <div className="ce-private-avatar">
            <window.Avatar user={user} size={88} />
            <span className="ce-private-lock" aria-hidden="true">
              <window.Icon name="lock" size={18} strokeWidth={2.25} />
            </span>
          </div>
          <h1 className="ce-private-name">{user.name}</h1>
          <p className="ce-private-headline">This profile is private</p>
          <p className="ce-private-sub">{user.name} has chosen to keep their profile and contribution history hidden.</p>
          <a className="btn btn-secondary ce-private-back" href="#/contributors">All contributors</a>
        </div>
      </div>);
  }

  const { all, contributions, deviceCount, since } = gatherContributions(handle);
  // Drafts never appear on the public profile, not even your own, they live
  // only on the private "Your changes" dashboard (#/you).
  const feed = all;

  const socials = Array.isArray(user.socials) ? user.socials.filter((s) => s && s.url) : [];

  return (
    <div className="container ce-profile" data-screen-label={isSelf ? 'Your profile' : 'Contributor profile'}>
      {isSelf && user.private ?
        <window.Banner
          className="ce-banner-at-profile"
          icon="lock"
          title="Your profile is private"
          actions={<a className="btn btn-secondary btn-sm" href="#/settings">Change visibility</a>}>
          Only you can see this page. To everyone else it shows as a locked, hidden profile, and you are left out of the contributors directory.
        </window.Banner> : null}
      <aside className="ce-profile-aside">
        <window.Avatar user={user} size={96} />
        <div className="ce-profile-id">
          <h1 className="ce-profile-name">{user.name}</h1>
          {user.pronouns ? (
            <div className="ce-profile-handle">
              <span className="ce-profile-pronouns">{user.pronouns}</span>
            </div>
          ) : null}
          {user.bio ? <p className="ce-profile-bio">{user.bio}</p> : null}

          <div className="ce-profile-links">
            {user.location ? (
              <div className="ce-profile-link ce-profile-meta">
                <Icon name="pin" size={14} />{user.location}
              </div>
            ) : null}
            {user.url ? (
              <a className="ce-profile-link" href={user.url} target="_blank" rel="noopener noreferrer">
                <Icon name="link" size={14} />{_hostname(user.url)}
              </a>
            ) : null}
            {user.gh ? (
              <a className="ce-profile-link" href={`https://github.com/${user.gh}`} target="_blank" rel="noopener noreferrer">
                <window.GitHubMark size={14} />{user.gh}
              </a>
            ) : null}
            {socials.map((s, i) => (
              <a key={i} className="ce-profile-link" href={s.url} target="_blank" rel="noopener noreferrer">
                <img className="ce-profile-favicon" src={_faviconUrl(s.url)} alt="" width={16} height={16} loading="lazy" />
                {_hostname(s.url)}
              </a>
            ))}
          </div>
        </div>

        {isSelf ? (
          <div className="ce-profile-actions">
            <a className="btn btn-secondary ce-acct-photo-btn" href="#/settings">Edit profile</a>
          </div>
        ) : null}

        {!activityHidden ? (
          <div className="aside-card aside-stats ce-profile-stats-card">
            <h4>Activity</h4>
            <dl className="aside-stat-list">
              <div className="aside-stat">
                <dt>Contributions</dt>
                <dd>{contributions}</dd>
              </div>
              <div className="aside-stat">
                <dt>Devices touched</dt>
                <dd>{deviceCount}</dd>
              </div>
              <div className="aside-stat">
                <dt>Contributing since</dt>
                <dd>{_monthYear(since)}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </aside>

      <main className="ce-profile-main">
      {activityHidden ? (
        <div className="ce-profile-activity-hidden">
          <Icon name="info" size={18} />
          <span>This contributor has hidden their activity.</span>
        </div>
      ) : (
        <React.Fragment>
          <div className="ce-profile-feed">
            {feed.length === 0 ? (
              <div className="ce-contrib-empty">
                {isSelf
                  ? "You haven't contributed yet. Find a device and add what you know."
                  : 'No contributions yet.'}
                {isSelf ? (
                  <a className="btn btn-secondary ce-contrib-empty-cta" href="#/browse">Browse devices</a>
                ) : null}
              </div>
            ) : (
              <ol className="ce-contrib-list">
                {feed.map((item, i) => <ContributionRow key={i} item={item} />)}
              </ol>
            )}
          </div>
        </React.Fragment>
      )}
      </main>
    </div>);
}

// ─────────────────────────────────────────────────────────────────────
// Contributors directory
// ─────────────────────────────────────────────────────────────────────
function ContributorsIndex() {
  window.useCurrentUser && window.useCurrentUser();
  const users = (typeof window !== 'undefined' && window.USERS) || {};
  const rows = Object.keys(users).map((id) => {
    const u = users[id];
    const { contributions, deviceCount } = gatherContributions(id);
    return { id, user: u, contributions, deviceCount, isSelf: id === window.CURRENT_USER };
  })
    // Private contributors are hidden from the directory entirely. You always
    // see your own card (you-proof), marked so you know you're hidden.
    .filter((r) => r.isSelf || !r.user.private)
    // Alphabetical by name so the A–Z grouping reads cleanly.
    .sort((a, b) => (a.user.name || '').localeCompare(b.user.name || '', undefined, { sensitivity: 'base' }));

  // Group into A–Z buckets; anything not starting with a letter falls under "#".
  const groups = [];
  const byLetter = {};
  rows.forEach((r) => {
    const ch = ((r.user.name || '?').trim().charAt(0) || '?').toUpperCase();
    const letter = /[A-Z]/.test(ch) ? ch : '#';
    if (!byLetter[letter]) { byLetter[letter] = { letter, rows: [] }; groups.push(byLetter[letter]); }
    byLetter[letter].rows.push(r);
  });
  // "#" always sorts last, letters otherwise stay in encounter (already A→Z) order.
  groups.sort((a, b) => (a.letter === '#' ? 1 : 0) - (b.letter === '#' ? 1 : 0));

  return (
    <div className="container ce-contributors" data-screen-label="Contributors">
      <header className="ce-contributors-head">
        <h1>Contributors</h1>
        <p className="muted">A heartfelt thank you to the volunteers who keep this database accurate. Every contribution is attributed, and carefully reviewed before it goes live.</p>
      </header>
      <div className="ce-contributors-list">
        {groups.map((g) => (
          <section className="ce-contributor-group" key={g.letter}>
            <h2 className="ce-contributor-letter">{g.letter}</h2>
            <ul className="ce-contributor-rows">
              {g.rows.map((r) => {
                return (
                <li key={r.id}>
                  <a className="ce-contributor-row" href={`#/contributors/${r.id}`}>
                    <window.Avatar user={r.user} size={40} />
                    <div className="ce-contributor-main">
                      <div className="ce-contributor-name">
                        {r.user.name}
                        {r.isSelf ? <span className="ce-contributor-you">You</span> : null}
                      </div>
                      <div className="ce-contributor-handle">{r.user.location || ''}</div>
                    </div>
                    <div className="ce-contributor-count">
                      {r.isSelf && r.user.private
                        ? <span className="ce-contributor-private"><window.Icon name="lock" size={12} /> Private</span>
                        : <React.Fragment><b>{r.contributions}</b> contribution{r.contributions === 1 ? '' : 's'}</React.Fragment>}
                    </div>
                  </a>
                </li>);
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>);
}

Object.assign(window, { ContributorProfile, ContributorsIndex, gatherContributions, gatherDrafts, profileFieldLabel });
