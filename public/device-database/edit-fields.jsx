/* Edit-fields, community-edit increment.

   Shared renderers for the contributor-maintained fields, used by BOTH the
   read view (detail.jsx) and edit mode (edit-mode.jsx):

   Read side:
     hasDescription / hasInstructions / hasReferences  , section predicates
     DescriptionRead · InstructionsRead · ReferencesRead
     SpecsReadRows                                      , extra <dl> rows

   Edit side:
     EditFieldsCtx helpers come from the caller as a `ctx` object:
       { device, getVal, setVal, pending, suggestionsFor, applySuggestion }
     DescriptionEditor · InstructionsEditor · CategorySpecsEditor
     EcosystemsEditor · ProtocolsEditor · DimensionsEditor
     IdentifiersEditor · ReferencesEditor

   A field that is pending review renders <PendingLock> instead of its
   control, locked, with the submitted value shown and an "awaiting review"
   pill. The suggestion plumbing (SuggestionRow / ctx.suggestionsFor) is
   dormant until increment 03 passes a `suggest` function in.
*/

// ─────────────────────────────────────────────────────────────────────
// Value formatting (read side)
// ─────────────────────────────────────────────────────────────────────
function fmtSpecValue(field, value) {
  if (field.control === 'bool') return value ? 'Yes' : 'No';
  if (field.control === 'multi') return (value || []).join(', ');
  if (field.control === 'number') return field.unit ? value + ' ' + field.unit : String(value);
  return String(value);
}
function hasSpecValue(field, value) {
  if (field.control === 'bool') return typeof value === 'boolean';
  if (field.control === 'multi') return Array.isArray(value) && value.length > 0;
  return value != null && value !== '';
}

function Paragraphs({ text }) {
  if (!text) return null;
  return String(text).split(/\n\s*\n/).map((para, i) =>
  <p key={i}>{para.split('\n').map((line, j, arr) =>
    <React.Fragment key={j}>{line}{j < arr.length - 1 ? <br /> : null}</React.Fragment>)}</p>);
}

// ─────────────────────────────────────────────────────────────────────
// Read renderers + section predicates
// ─────────────────────────────────────────────────────────────────────
function hasDescription(d) {return !!(d && d.description && String(d.description).trim());}
function hasInstructions(d) {return !!(d && d.instructions && d.instructions.text && String(d.instructions.text).trim());}
function hasReferences(d) {return !!(d && d.specs && Array.isArray(d.specs.references) && d.specs.references.length > 0);}

// A device is "populated" once a contributor has added rich content
// (description / instructions / structured specs). Used to gate increment-2
// additive UI, the header summary line and the requirements figure, so
// they appear only on devices that have been filled in, not every device.
function isPopulated(d) {
  if (!d) return false;
  if (d.description || d.instructions && d.instructions.text) return true;
  const s = d.specs;
  if (s && (s.cat && Object.keys(s.cat).length || s.protocols && Object.keys(s.protocols).length || s.dimensions || s.identifiers || s.references && s.references.length)) return true;
  return false;
}

function DescriptionRead({ device }) {
  if (!hasDescription(device)) return null;
  return <div className="article-prose"><Paragraphs text={device.description} /></div>;
}

function InstructionsRead({ device }) {
  if (!hasInstructions(device)) return null;
  const url = device.instructions.manualUrl;
  return (
    <div className="article-prose">
      <Paragraphs text={device.instructions.text} />
      {url ?
      <p className="instructions-manual">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Icon name="book" size={14} /> Manufacturer manual <Icon name="open" size={12} />
          </a>
        </p> : null}
    </div>);
}

function ReferencesRead({ device }) {
  if (!hasReferences(device)) return null;
  return (
    <ul className="reference-list">
      {device.specs.references.map((r, i) =>
      <li key={i}>
          <a href={r.url} target="_blank" rel="noopener noreferrer">
            {r.label || r.url} <Icon name="open" size={12} />
          </a>
        </li>)}
    </ul>);
}

// Small "i" affordance: a tooltip explaining why something can't be edited.
// Shows on hover and on tap/focus (toggles). Safe inside a <button> (it's a
// span, and stops propagation so it doesn't trigger the group toggle).
function InfoHint({ text }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="ce-infohint" tabIndex={0} role="button" aria-label={text}
    onClick={(e) => {e.preventDefault();e.stopPropagation();setOpen((o) => !o);}}
    onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
    onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
    onKeyDown={(e) => {if (e.key === 'Escape') setOpen(false);}}>
      <Icon name="info" size={13} />
      {open ? <span className="ce-infohint-pop" role="tooltip">{text}</span> : null}
    </span>);
}

// Collapsible spec group for the read view: a clickable subheader that
// toggles its body. With no title it degrades to a plain (non-collapsible)
// .spec-group wrapper, so the increment-1 table stays untouched.
function SpecGroup({ title, defaultOpen = true, hint, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  if (!title) return <div className="spec-group">{children}</div>;
  return (
    <div className={'spec-group' + (open ? ' is-open' : ' is-collapsed')}>
      <button type="button" className="spec-group-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="spec-group-titlewrap">
          <span className="ce-subhead spec-group-title">{title}</span>
          {hint ? <InfoHint text={hint} /> : null}
        </span>
        <span className="spec-group-chev" aria-hidden="true"><Icon name="chevR" size={14} /></span>
      </button>
      {open ? children : null}
    </div>);
}

// Read-view marker for a boolean ecosystem row: check when supported, cross
// when not. Replaces the older "Yes" text label.
function EcoMark({ on }) {
  return on ?
  <span className="eco-mark eco-mark-on" title="Works" aria-label="Works"><window.Icon name="check" size={15} strokeWidth={2.5} /></span> :
  <span className="eco-mark eco-mark-off" title="Not supported" aria-label="Not supported"><window.Icon name="x" size={15} strokeWidth={2.5} /></span>;
}

// Derive a human store name from a download URL's host, so app links read
// as "Huawei AppGallery" rather than a generic "Other store". Falls back to
// the bare hostname for stores we don't recognise.
const APP_STORE_NAMES = [
  [/(^|\.)apps\.apple\.com$|(^|\.)itunes\.apple\.com$/, 'App Store'],
  [/(^|\.)play\.google\.com$/, 'Google Play'],
  [/(^|\.)appgallery\.huawei\.com$|(^|\.)huawei\.com$/, 'Huawei AppGallery'],
  [/(^|\.)galaxystore\.samsung\.com$|(^|\.)galaxy\.store$/, 'Galaxy Store'],
  [/(^|\.)f-droid\.org$/, 'F-Droid'],
  [/(^|\.)amazon\./, 'Amazon Appstore'],
  [/(^|\.)apps\.microsoft\.com$|(^|\.)microsoft\.com$/, 'Microsoft Store'],
  [/(^|\.)aptoide\.com$/, 'Aptoide'],
];
function storeNameFromUrl(url) {
  let host = '';
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
  for (const [re, name] of APP_STORE_NAMES) if (re.test(host)) return name;
  return host;
}

// Format a manufacturer reference price (MSRP) for the read view. The shape
// follows the pricing plan's reference-price object: { amount, currency,
// source, sourceUrl, asOf }. Amount + currency render through Intl so the
// symbol and grouping match the currency.
function fmtMoney(amount, currency) {
  if (amount == null || amount === '') return '-';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  } catch (e) {
    return (currency ? currency + ' ' : '') + amount;
  }
}
// "YYYY-MM" reads as "March 2026"; anything else passes through unchanged.
function fmtAsOf(asOf) {
  if (!asOf) return '';
  const m = /^(\d{4})-(\d{2})$/.exec(asOf);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return asOf;
}

// Read-view list of proprietary-bridge names, each linked to its hub device
// when one is on record. Renders one line per bridge.
function BridgeNamesRead({ names }) {
  return (names || []).map((nm, i) => {
    const bd = window.deviceForBridgeName ? window.deviceForBridgeName(nm) : null;
    return <div key={i}>{bd ? <a className="ce-link-ink" href={'#/device/' + bd.id}>{nm}</a> : nm}</div>;
  });
}

// Additional specs for the read view, grouped under subheaders that mirror
// the edit view (category specs, Protocols, Ecosystems and apps, Dimensions,
// Product identifiers). Each group and row only renders when it has data.
function SpecsReadGroups({ device, onShowVersions }) {
  const specs = device.specs || {};
  const catFields = window.CATEGORY_SPECS && window.CATEGORY_SPECS[device.category] || [];
  const cat = specs.cat || {};
  const eco = specs.ecosystems || null;
  const protos = specs.protocols || {};
  const dims = specs.dimensions || null;
  const ids = specs.identifiers || null;
  const custom = Array.isArray(specs.customFields) ? specs.customFields.filter((r) => r && r.label && hasCustomValue(r)) : [];
  const catLabel = window.CATEGORY_LABEL && window.CATEGORY_LABEL[device.category] || device.category;

  const Group = ({ title, children }) =>
  <SpecGroup title={title}>
      <dl style={{ margin: 0 }}>{children}</dl>
    </SpecGroup>;

  const out = [];

  const catRows = catFields.filter((f) => hasSpecValue(f, cat[f.key]));
  if (catRows.length > 0 || custom.length > 0) {
    out.push(
      <Group title={catLabel} key="cat">
        {catRows.map((f) =>
        <div className="trait-row" key={f.key}><dt>{f.label}</dt><dd>{fmtSpecValue(f, cat[f.key])}</dd></div>)}
        {custom.map((r, i) =>
        <div className="trait-row" key={'custom' + i}>
          <dt><span className="trait-custom-label">{r.label}<span className="trait-community-tag">Community</span></span></dt>
          <dd>{fmtCustomValue(r)}</dd>
        </div>)}
      </Group>);
  }

  // Reference price (MSRP). A manufacturer-set fact, one row per currency,
  // shown only when present, rendered like every other figure on the page.
  {
    const prices = (Array.isArray(device.msrp) ? device.msrp
      : (device.msrp && device.msrp.amount != null ? [device.msrp] : []))
      .filter((p) => p && p.amount != null);
    if (prices.length > 0) {
      out.push(
        <Group title="Pricing" key="price">
          <div className="trait-row">
            <dt>Reference price</dt>
            <dd>{prices.map((p, i) => <div key={i}>{fmtMoney(p.amount, p.currency)}</div>)}</dd>
          </div>
        </Group>);
    }
  }

  if (eco) {
    const ecoRows = [];
    (window.ECOSYSTEM_OPTIONS || []).forEach((o) => {if (typeof eco[o.key] === 'boolean') ecoRows.push({ key: o.key, label: o.label, on: eco[o.key] });});
    (eco.others || []).forEach((o) => ecoRows.push({ key: null, label: o, on: true }));
    const onRows = ecoRows.filter((r) => r.on);
    const offRows = ecoRows.filter((r) => !r.on);
    const ecoList = (rows, off) =>
    <ul className="eco-read-list">
        {rows.map((r) =>
      <li key={r.label} className={off ? 'is-off' : 'is-on'}>
            <span className="eco-name"><window.EcoGlyph name={r.key} label={r.label} on={!off} />{r.label}</span>
          </li>)}
      </ul>;
    if (ecoRows.length > 0) {
      out.push(
        <SpecGroup title="Ecosystems" key="eco">
          <dl style={{ margin: 0 }}>
            {onRows.length > 0 &&
            <div className="trait-row">
                <dt>Connects with</dt>
                <dd>{ecoList(onRows, false)}</dd>
              </div>}
            {offRows.length > 0 &&
            <div className="trait-row">
                <dt>Not supported</dt>
                <dd>{ecoList(offRows, true)}</dd>
              </div>}
          </dl>
        </SpecGroup>);
    }
  }

  {
    const protoRows = (window.PROTOCOL_OPTIONS || []).
    filter((p) => protos[p.key] === true).
    map((p) => ({ key: p.key, label: p.label }));
    const reqs = bridgeRequirements(protos, device.category);
    const bridge = specs.bridge || {};
    const bridgeNames = Array.isArray(bridge.proprietary) ? bridge.proprietary.filter(Boolean) : (bridge.proprietary ? [bridge.proprietary] : []);
    if (protoRows.length > 0) {
      out.push(
        <SpecGroup title="Connectivity" key="proto">
          <dl style={{ margin: 0 }}>
            <div className="trait-row">
              <dt>Supported</dt>
              <dd>
                <ul className="proto-read-list">
                  {protoRows.map((p) =>
                  <li key={p.key}>
                      <span className="proto-name"><window.ProtocolGlyph name={p.key} />{p.label}</span>
                    </li>)}
                </ul>
              </dd>
            </div>
            {reqs.length > 0 &&
            <div className="trait-row">
                <dt>Bridge</dt>
                <dd>
                  <div className="ce-bridge-reqs">
                    {reqs.map((r) =>
                    <React.Fragment key={r.key}>
                        <span>{r.need}</span>
                        <a className="ce-hub-link" href={BRIDGE_LINK}>{r.linkLabel}</a>
                      </React.Fragment>)}
                  </div>
                </dd>
              </div>}
            {(protos.zigbee || protos.zwave) && device.category !== 'hubs' && bridgeNames.length > 0 &&
            <div className="trait-row">
                <dt>Proprietary bridge</dt>
                <dd><BridgeNamesRead names={bridgeNames} /></dd>
              </div>}
          </dl>
        </SpecGroup>);
    }
  }

  if (eco) {
    const appsub = [];
    if (eco.proprietaryApp === 'Optional' || eco.proprietaryApp === 'Required') {
      appsub.push(<div className="trait-row" key="proprietaryApp"><dt>Proprietary app</dt><dd>{eco.proprietaryApp}</dd></div>);
      // Where to download the first-party app, any of App Store, Google Play,
      // or other stores. Other stores are named from their URL host. Compact
      // external links, matching the references and HA docs link style.
      const appLinks = eco.appLinks || {};
      const otherList = Array.isArray(appLinks.others) ? appLinks.others : (appLinks.other ? [appLinks.other] : []);
      const storeLinks = [
        { key: 'ios', label: 'App Store', url: appLinks.ios },
        { key: 'android', label: 'Google Play', url: appLinks.android }
      ].concat(otherList.map(function (u, i) { return { key: 'other' + i, label: storeNameFromUrl(u) || 'Other store', url: u }; }))
        .filter(function (s) { return s.url && String(s.url).trim(); });
      if (storeLinks.length > 0) {
        appsub.push(
          <div className="trait-row" key="appLinks">
            <dt>Download</dt>
            <dd>
              <ul className="app-store-links">
                {storeLinks.map((s) => {
                  let host = '';
                  try { host = new URL(s.url).hostname; } catch (e) { host = ''; }
                  return (
                    <li key={s.key}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {host ?
                          <img className="app-store-favicon"
                            src={'https://www.google.com/s2/favicons?sz=64&domain=' + host}
                            alt="" width="18" height="18" loading="lazy"
                            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} /> :
                          <span className="app-store-favicon app-store-favicon-empty" aria-hidden="true"></span>}
                        <span className="app-store-label">{s.label}</span>
                        <Icon name="open" size={12} />
                      </a>
                    </li>);
                })}
              </ul>
            </dd>
          </div>);
      }
    }
    (window.MANUFACTURER_FLAGS || []).forEach((f) => {
      if (eco[f.key]) {
        const val = f.key === 'subscriptionFeatures' && eco.subscriptionNote ? eco.subscriptionNote : 'Yes';
        appsub.push(<div className="trait-row" key={f.key}><dt>{f.label}</dt><dd>{val}</dd></div>);
      }
    });
    if (appsub.length > 0) {
      out.push(<Group title="App and subscription" key="appsub">{appsub}</Group>);
    }
  }

  out.push(
    <Group title="Software version" key="sw">
      <div className="trait-row"><dt>Current</dt><dd>{device.softwareVersion || '-'}{device.versionHistory && device.versionHistory.length > 0 && onShowVersions && <button type="button" className="trait-version-link" style={{ marginLeft: 14 }} onClick={onShowVersions}>Show version history</button>}</dd></div>
    </Group>);

  if (Array.isArray(dims) && dims.length > 0) {
    const rows = dims.map((e, i) => {
      if (!(e.height || e.width || e.depth)) return null;
      const v = [e.height, e.width, e.depth].map((x) => x || x === 0 ? x : '-').join(' × ');
      return <div className="trait-row" key={i}><dt>{e.name || 'Dimensions'}</dt><dd><span className="mono">{v} mm</span></dd></div>;
    }).filter(Boolean);
    if (rows.length > 0) out.push(<Group title="Dimensions" key="dims">{rows}</Group>);
  }

  out.push(
    <Group title="Product identifiers" key="ids">
      <div className="trait-row"><dt>Model number</dt><dd><span className="mono">{device.model}</span></dd></div>
      {ids && ids.ean ? <div className="trait-row"><dt>EAN</dt><dd><span className="mono">{ids.ean}</span></dd></div> : null}
      {ids && ids.sku ? <div className="trait-row"><dt>SKU</dt><dd><span className="mono">{ids.sku}</span></dd></div> : null}
    </Group>);

  // Group order: what it is (category) → how it connects (Connectivity) →
  // what it connects with (Ecosystems) → vendor app → physical (Dimensions) →
  // firmware (Software version) → identity (Product identifiers). Built out of
  // order above; sorted here by stable key so read + edit views match.
  const groupOrder = ['cat', 'price', 'proto', 'eco', 'appsub', 'dims', 'sw', 'ids'];
  out.sort((a, b) => groupOrder.indexOf(a.key) - groupOrder.indexOf(b.key));
  return out.length ? <React.Fragment>{out}</React.Fragment> : null;
}

// ─────────────────────────────────────────────────────────────────────
// Pending treatment + suggestions (edit side scaffolding)
// ─────────────────────────────────────────────────────────────────────
function PendingValuePreview({ fieldKey, value, device }) {
  if (value == null || value === '') return <span className="ce-pending-empty">-</span>;
  if (fieldKey === 'description') return <div className="ce-pending-text"><Paragraphs text={value} /></div>;
  if (fieldKey === 'instructions') {
    return (
      <div className="ce-pending-text">
        <Paragraphs text={value.text} />
        {value.manualUrl ? <div className="mono ce-pending-sub">{value.manualUrl}</div> : null}
      </div>);
  }
  if (fieldKey === 'protocols') {
    const byKey = Object.fromEntries((window.PROTOCOL_OPTIONS || []).map((p) => [p.key, p.label]));
    const on = Object.keys(value || {}).filter((k) => value[k]);
    return <span>{on.map((k) => byKey[k] || k).join(', ') || '-'}</span>;
  }
  if (fieldKey === 'bridge') {
    const names = value && value.proprietary ? (Array.isArray(value.proprietary) ? value.proprietary.filter(Boolean) : [value.proprietary]) : [];
    if (names.length > 0) return <span>{'Proprietary bridge: ' + names.join(', ')}</span>;
    return <span className="ce-pending-empty">-</span>;
  }
  if (fieldKey === 'msrp') {
    const arr = Array.isArray(value) ? value : (value && value.amount != null ? [value] : []);
    const valid = arr.filter((p) => p && p.amount != null);
    if (valid.length > 0) return <span>{valid.map((p) => fmtMoney(p.amount, p.currency)).join(' \u00b7 ')}</span>;
    return <span className="ce-pending-empty">-</span>;
  }
  if (fieldKey === 'ecosystems') {
    const works = [];
    (window.ECOSYSTEM_OPTIONS || []).forEach((o) => {if (value[o.key]) works.push(o.label);});
    (value.others || []).forEach((o) => works.push(o));
    return <span>{works.join(', ') || '-'}</span>;
  }
  if (fieldKey === 'connectsWith') {
    const labels = Object.keys(value || {}).map((k) => window.connectsWithEcoLabel ? window.connectsWithEcoLabel(k) : k);
    return <span>Setup for {labels.join(', ') || '-'}</span>;
  }
  if (fieldKey === 'dimensions') {
    const u = value.unit || 'mm';
    return <span className="mono">{[value.height, value.width, value.depth].map((v) => v || '-').join(' × ')} {u}</span>;
  }
  if (fieldKey === 'identifiers') {
    return <span className="mono">{[value.modelId, value.ean, value.sku].filter(Boolean).join(' · ') || '-'}</span>;
  }
  if (fieldKey === 'references') {
    return <span>{(value || []).map((r) => r.label || r.url).join(', ') || '-'}</span>;
  }
  if (fieldKey === 'photos') {
    const approved = (device && device.photos) || [];
    const next = value || [];
    const kept = next.filter((p) => approved.indexOf(p) !== -1);
    const added = next.filter((p) => approved.indexOf(p) === -1);
    const removed = approved.filter((p) => next.indexOf(p) === -1);
    const Thumb = ({ src, status, label }) =>
      <div className={'ce-photo-diff-item is-' + status}>
        <div className="ce-photo-diff-thumb">
          {window.GalleryPhoto ? <window.GalleryPhoto device={device} src={src} /> : <img src={src} alt="" />}
        </div>
        <span className="ce-photo-diff-tag">{label}</span>
      </div>;
    if (kept.length + added.length + removed.length === 0) return <span className="ce-pending-empty">-</span>;
    return (
      <div className="ce-photo-diff">
        {kept.map((p, i) => <Thumb key={'k' + i} src={p} status="kept" label="Unchanged" />)}
        {added.map((p, i) => <Thumb key={'a' + i} src={p} status="added" label="Added" />)}
        {removed.map((p, i) => <Thumb key={'r' + i} src={p} status="removed" label="Removed" />)}
      </div>);
  }
  if (fieldKey.indexOf('spec:') === 0) {
    if (Array.isArray(value)) return <span>{value.join(', ')}</span>;
    if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
    return <span>{String(value)}</span>;
  }
  return <span>{String(value)}</span>;
}

// The "Submitted by … Locked until reviewed on GitHub" line shown under a
// locked value. The "GitHub" word links to the pull request carrying the edit.
// Uses an explicit entry.pr when present, else a deterministic number derived
// from the timestamp so every locked field surfaces a stable link.
function PendingMeta({ entry }) {
  const who = window.contributorDisplay ? window.contributorDisplay(entry.by) : null;
  const name = who ? who.name : entry.by;
  const hp = window.contributorHoverProps ? window.contributorHoverProps(entry.by) : {};
  const when = window.formatDateShort ? window.formatDateShort(entry.at) : '';
  const prNumber = entry.pr || (parseInt(String(entry.at || '').replace(/\D/g, '').slice(-4), 10) || 1);
  const prUrl = 'https://github.com/openhomefoundation/device-database/pull/' + prNumber;
  const nameNode = who && who.href
    ? <a className="ce-byline-link" href={who.href} {...hp}>{name}</a>
    : name;
  return (
    <div className="ce-pending-meta">
      Submitted by {nameNode}{when ? ' on ' + when : ''}. Locked until reviewed on{' '}
      <a className="ce-pending-pr" href={prUrl} target="_blank" rel="noopener noreferrer">GitHub <Icon name="open" size={12} /></a>.
    </div>);
}

function PendingLock({ label, fieldKey, entry, device }) {
  // Category-spec fields keep their editable row layout: the locked control
  // sits exactly where its input would, at the same size. Only the chrome
  // changes (dashed border, awaiting-review background).
  const specField = fieldKey.indexOf('spec:') === 0
    ? ((window.CATEGORY_SPECS && window.CATEGORY_SPECS[device.category]) || []).find((x) => 'spec:' + x.key === fieldKey)
    : null;
  if (specField) {
    return (
      <div className="ce-row ce-row-pending" aria-disabled="true">
        <span className="ce-row-label">{label}</span>
        <div className="ce-row-control">
          <div className="ce-pending-controlline">
            <PendingLockedControl f={specField} value={entry.value} />
          </div>
          <PendingMeta entry={entry} />
        </div>
      </div>);
  }

  // Long-text and structured fields keep the boxed block treatment: label,
  // value below, meta below. Structured renderers may place the meta
  // contextually (protocols puts it under the list), so suppress the
  // block-level meta for those.
  const structuredKeys = ['ecosystems', 'protocols', 'connectivity', 'identifiers', 'references', 'dimensions'];
  const isStructured = structuredKeys.indexOf(fieldKey) !== -1;
  const metaInside = fieldKey === 'protocols';
  return (
    <div className="ce-field ce-field-pending" aria-disabled="true">
      <div className="ce-field-label-row">
        <span className="ce-field-label">{label}</span>
      </div>
      {isStructured ?
      <div className="ce-pending-structured">
        <PendingStructured fieldKey={fieldKey} label={label} value={entry.value} device={device} entry={entry} />
      </div> :
      <div className="ce-pending-box">
        <PendingValuePreview fieldKey={fieldKey} value={entry.value} device={device} />
      </div>}
      {!metaInside && <PendingMeta entry={entry} />}
    </div>);
}

// Read-only rendering of a category-spec control in its locked (awaiting
// review) state. Mirrors the editable control's size and shape: single-line
// inputs and dropdowns become a same-size dashed box; the Yes/No segmented
// control and multi-select keep their options with the selection standing out.
function PendingLockedControl({ f, value }) {
  if (f.control === 'bool') return <LockedYesNo value={value} />;
  if (f.control === 'multi') {
    const sel = new Set(Array.isArray(value) ? value : []);
    const opts = (f.options || []).map((o) => typeof o === 'string' ? { value: o, label: o } : o);
    return (
      <span className="ce-multi-lock" role="group" aria-label="Selected options, awaiting review" aria-disabled="true">
        {opts.map((o) =>
        <span className={'ce-check' + (sel.has(o.value) ? '' : ' ce-check-off')} key={o.value}>
          <input type="checkbox" checked={sel.has(o.value)} readOnly disabled />
          <span>{o.label}</span>
        </span>)}
      </span>);
  }
  const empty = value == null || value === '';
  return (
    <span className={'ce-lock-input' + (empty ? ' ce-lock-input-empty' : '')}>
      <span className="ce-lock-input-val">{empty ? '-' : String(value)}</span>
      {f.control === 'number' && f.unit && !empty ? <span className="ce-lock-unit">{f.unit}</span> : null}
      {f.control === 'select' ? <span className="ce-lock-chev" aria-hidden="true" /> : null}
    </span>);
}

// Locked Yes / No / Not set segmented control (reused by spec bools and the
// ecosystems/app structured editors).
function LockedYesNo({ value, onLabel = 'Yes', offLabel = 'No' }) {
  return (
    <span className="ce-yesno ce-yesno-lock" role="radiogroup" aria-label="Selected value, awaiting review" aria-disabled="true">
      <span className={'ce-yesno-btn' + (value === true ? ' is-on' : '')}>{onLabel}</span>
      <span className={'ce-yesno-btn' + (value === false ? ' is-on' : '')}>{offLabel}</span>
      <span className={'ce-yesno-btn ce-yesno-unset' + (value == null ? ' is-on' : '')}>Not set</span>
    </span>);
}

// A single-line read-only box the size of .ce-input, used to mirror text/URL
// inputs inside locked structured editors.
function LockBox({ value, select }) {
  const empty = value == null || value === '';
  return <span className={'ce-lock-input' + (empty ? ' ce-lock-input-empty' : '')}><span className="ce-lock-input-val">{empty ? '-' : String(value)}</span>{select ? <span className="ce-lock-chev" aria-hidden="true" /> : null}</span>;
}

// Locked rendering of the composite editors (ecosystems, connectivity,
// identifiers, references, dimensions) that mirrors the editable form layout
// rather than collapsing to a one-line summary. `label` disambiguates the two
// editors that share the 'ecosystems' field key.
function PendingStructured({ fieldKey, label, value, device, entry }) {
  const v = value || {};
  if (fieldKey === 'identifiers') {
    return (
      <div className="ce-form-grid">
        <div className="ce-row"><span className="ce-row-label">Model number</span>
          <span className="ce-row-control ce-lockrow-static"><span className="mono">{device.model}</span>
            <InfoHint text="Collected from Home Assistant. Contributors can't edit this." /></span></div>
        <div className="ce-row"><span className="ce-row-label">EAN</span><span className="ce-row-control"><LockBox value={v.ean} /></span></div>
        <div className="ce-row"><span className="ce-row-label">SKU</span><span className="ce-row-control"><LockBox value={v.sku} /></span></div>
      </div>);
  }
  if (fieldKey === 'references') {
    const refs = Array.isArray(value) ? value : [];
    if (refs.length === 0) return <span className="ce-pending-empty">-</span>;
    return (
      <div className="ce-ref-list">
        {refs.map((r, i) =>
        <div className="ce-ref-row ce-ref-row-lock" key={i}>
          <LockBox value={r.label} />
          <LockBox value={r.url} />
        </div>)}
      </div>);
  }
  if (fieldKey === 'protocols') {
    return (
      <div className="ce-form-grid">
        <div className="ce-row ce-row-top">
          <span className="ce-row-label">Supported</span>
          <div className="ce-row-control ce-pending-protocontrol">
            <div className="ce-check-col ce-check-col-lock" role="group" aria-disabled="true">
              {(window.PROTOCOL_OPTIONS || []).map((p) =>
              <span className={'ce-check' + (v[p.key] === true ? '' : ' ce-check-off')} key={p.key}>
                <input type="checkbox" checked={v[p.key] === true} readOnly disabled />
                <span className="proto-name"><window.ProtocolGlyph name={p.key} />{p.label}</span>
              </span>)}
            </div>
            {entry ? <PendingMeta entry={entry} /> : null}
          </div>
        </div>
      </div>);
  }
  if (fieldKey === 'ecosystems') {
    // The "App and subscription" editor shares this field key; show its fields
    // when invoked under that label, otherwise show the ecosystem toggles.
    if (label === 'App and subscription') {
      return (
        <div className="ce-form-grid">
          <div className="ce-row"><span className="ce-row-label">Proprietary app</span><span className="ce-row-control"><LockBox value={v.proprietaryApp} select /></span></div>
          {(window.MANUFACTURER_FLAGS || []).map((o) =>
          <div className="ce-row ce-row-toggle" key={o.key}><span className="ce-row-label">{o.label}</span><LockedYesNo value={v[o.key]} /></div>)}
        </div>);
    }
    const others = Array.isArray(v.others) ? v.others : [];
    return (
      <div className="ce-form-grid">
        {(window.ECOSYSTEM_OPTIONS || []).map((o) =>
        <div className="ce-row ce-row-toggle" key={o.key}><span className="ce-row-label">{o.label}</span><LockedYesNo value={v[o.key]} /></div>)}
        {others.map((name, i) =>
        <div className="ce-row ce-row-toggle" key={'other-' + i}><span className="ce-row-label">{name}</span><LockedYesNo value={true} /></div>)}
      </div>);
  }
  if (fieldKey === 'dimensions') {
    const list = Array.isArray(value) ? value : [];
    if (list.length === 0) return <span className="ce-pending-empty">-</span>;
    return (
      <div className="ce-dim-list">
        {list.map((e, i) =>
        <div className="ce-dim-set ce-dim-set-lock" key={i}>
          <LockBox value={e.name} />
          <span className="ce-lock-input"><span className="ce-lock-input-val">{e.height == null ? '-' : e.height}</span><span className="ce-lock-unit">mm</span></span>
          <span className="ce-lock-input"><span className="ce-lock-input-val">{e.width == null ? '-' : e.width}</span><span className="ce-lock-unit">mm</span></span>
          <span className="ce-lock-input"><span className="ce-lock-input-val">{e.depth == null ? '-' : e.depth}</span><span className="ce-lock-unit">mm</span></span>
        </div>)}
      </div>);
  }
  if (fieldKey === 'connectivity') {
    return (
      <div className="ce-form-grid">
        {CONNECTIVITY_FIELDS.map((f) =>
        <div className="ce-row" key={f.key}>
          <span className="ce-row-label">{f.label}</span>
          <span className="ce-row-control"><LockBox value={v[f.key]} select /></span>
        </div>)}
      </div>);
  }
  // any other structured field: fall back to the summary.
  return <PendingValuePreview fieldKey={fieldKey} value={value} device={device} />;
}

// One or more source suggestions for a field (increment 03). Dormant in 02.
function SuggestionRow({ ctx, fieldKey, suggestions, renderValue }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="ce-suggestions">
      {suggestions.map((s, i) =>
      <div className="ce-suggestion" key={i}>
          <span className="ce-suggestion-src">{s.source}</span>
          <span className="ce-suggestion-val">{renderValue ? renderValue(s.value) : String(s.value)}</span>
          <button type="button" className="ce-suggestion-apply" onClick={() => ctx.applySuggestion(fieldKey, s.value)}>
            <Icon name="check" size={13} /> Apply
          </button>
        </div>)}
    </div>);
}

// Wraps a field: pending → locked; otherwise children + any suggestions.
function FieldShell({ ctx, fieldKey, label, children, renderSuggestionValue, selfLock }) {
  const p = ctx.pending && ctx.pending[fieldKey];
  if (p && !selfLock) return <PendingLock label={label} fieldKey={fieldKey} entry={p} device={ctx.device} />;
  const sugg = ctx.suggestionsFor ? ctx.suggestionsFor(fieldKey) : null;
  return (
    <div className="ce-field-shell">
      {children}
      <SuggestionRow ctx={ctx} fieldKey={fieldKey} suggestions={sugg} renderValue={renderSuggestionValue} />
    </div>);
}

// Per-item locking helpers, used by the composite editors (ecosystems, app and
// subscription, identifiers, references) so a pending change to ONE item locks
// only that item and leaves the rest editable.
function pendNorm(v) { return v == null ? null : v; }
function pendFieldChanged(pendVal, approved, key) {
  if (!pendVal || !Object.prototype.hasOwnProperty.call(pendVal, key)) return false;
  return pendNorm(pendVal[key]) !== pendNorm((approved || {})[key]);
}
// A single locked item rendered in a form row: label left, locked control +
// submitted-by meta in the control column. `toggle` keeps the segmented-control
// alignment used by yes/no rows.
function LockRow({ label, entry, toggle, children }) {
  return (
    <div className={'ce-row ce-row-itemlock' + (toggle ? ' ce-row-toggle' : '')} aria-disabled="true">
      <span className="ce-row-label">{label}</span>
      <div className="ce-itemlock-control">
        {children}
        <PendingMeta entry={entry} />
      </div>
    </div>);
}

// ─────────────────────────────────────────────────────────────────────
// Low-level controls
// ─────────────────────────────────────────────────────────────────────
function CtrlText({ id, value, onChange, placeholder }) {
  return <input id={id} className="ce-input" value={value || ''} placeholder={placeholder}
  onChange={(e) => onChange(e.target.value)} />;
}
function CtrlNumber({ id, value, onChange, unit, placeholder }) {
  return (
    <div className="ce-num-wrap">
      <input id={id} type="number" className="ce-input" value={value == null ? '' : value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
      {unit ? <span className="ce-num-unit">{unit}</span> : null}
    </div>);
}
function CtrlSelect({ id, value, onChange, options }) {
  return (
    <select id={id} className="ce-input ce-select" value={value || ''} onChange={(e) => onChange(e.target.value || undefined)}>
      <option value="">-</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>);
}
function CtrlBool({ label, value, onChange }) {
  return (
    <label className="ce-check">
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>);
}
function CtrlToggle({ label, value, onChange }) {
  return (
    <span className={'switch' + (value ? ' is-on' : '')}>
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span className="switch-track"></span>
      <span className="switch-thumb"></span>
    </span>);
}
// Yes / No segmented control — shows the words explicitly. Undefined = neither
// selected (distinguishes "not set" from "No").
function CtrlYesNo({ label, value, onChange, allowUnset, onLabel = 'Yes', offLabel = 'No' }) {
  return (
    <span className="ce-yesno" role="radiogroup" aria-label={label}>
      <button type="button" role="radio" aria-checked={value === true}
      className={'ce-yesno-btn' + (value === true ? ' is-on' : '')} onClick={() => onChange(true)}>{onLabel}</button>
      <button type="button" role="radio" aria-checked={value === false}
      className={'ce-yesno-btn' + (value === false ? ' is-on' : '')} onClick={() => onChange(false)}>{offLabel}</button>
      {allowUnset ?
      <button type="button" role="radio" aria-checked={value == null}
      className={'ce-yesno-btn ce-yesno-unset' + (value == null ? ' is-on' : '')} onClick={() => onChange(undefined)}>Not set</button> :
      null}
    </span>);
}
function CtrlMulti({ value, onChange, options }) {
  const norm = options.map((o) => typeof o === 'string' ? { value: o, label: o } : o);
  const set = new Set(value || []);
  const toggle = (val) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    onChange([...next]);
  };
  return (
    <div className="ce-check-col" role="group">
      {norm.map((o) =>
      <label className="ce-check" key={o.value}>
          <input type="checkbox" checked={set.has(o.value)} onChange={() => toggle(o.value)} />
          <span>{o.label}</span>
        </label>)}
    </div>);
}

// ─────────────────────────────────────────────────────────────────────
// High-level editors
// ─────────────────────────────────────────────────────────────────────
function DescriptionEditor({ ctx }) {
  return (
    <FieldShell ctx={ctx} fieldKey="description" label="Description">
      <label className="ce-field" htmlFor="ce-field-desc">
        <span className="ce-field-label">Description</span>
        <textarea id="ce-field-desc" className="ce-textarea" rows={6}
        placeholder="A few paragraphs about what this device is, how it connects, and anything a buyer should know. Leave a blank line between paragraphs."
        value={ctx.getVal('description') || ''}
        onChange={(e) => ctx.setVal('description', e.target.value)} />
      </label>
    </FieldShell>);
}

function InstructionsEditor({ ctx }) {
  const ins = ctx.getVal('instructions') || {};
  const update = (patch) => ctx.setVal('instructions', { ...ins, ...patch });
  const [showLink, setShowLink] = React.useState(!!ins.manualUrl);
  const removeLink = () => {update({ manualUrl: '' });setShowLink(false);};
  return (
    <FieldShell ctx={ctx} fieldKey="instructions" label="Instructions">
      <label className="ce-field" htmlFor="ce-field-instr">
        <span className="ce-field-label">Instructions</span>
        <textarea id="ce-field-instr" className="ce-textarea" rows={5}
        placeholder="How to install the device and connect it to Home Assistant."
        value={ins.text || ''}
        onChange={(e) => update({ text: e.target.value })} />
      </label>
      {showLink ?
      <div className="ce-field" style={{ marginTop: 'var(--space-3)' }}>
          <span className="ce-field-label">Manual link</span>
          <div className="ce-manuallink-row">
            <CtrlText id="ce-field-manual" value={ins.manualUrl} placeholder="https://…"
          onChange={(v) => update({ manualUrl: v })} />
            <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={removeLink}>Remove</button>
          </div>
        </div> :
      <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={() => setShowLink(true)}>
          + Add manual link
        </button>}
    </FieldShell>);
}

function CategorySpecsEditor({ ctx }) {
  const fields = window.CATEGORY_SPECS && window.CATEGORY_SPECS[ctx.device.category] || [];
  const catLabel = window.CATEGORY_LABEL && window.CATEGORY_LABEL[ctx.device.category] || ctx.device.category;
  return (
    <SpecGroup title={catLabel}>
      {fields.length > 0 ?
      <div className="ce-form-grid">
        {fields.map((f) => {
          const key = 'spec:' + f.key;
          const value = ctx.getVal(key);
          const set = (v) => ctx.setVal(key, v);
          let control;
          if (f.control === 'bool') control = <CtrlBool label={f.label} value={value} onChange={set} />;else
          if (f.control === 'multi') control = <CtrlMulti value={value} onChange={set} options={f.options} />;else
          if (f.control === 'select') control = <CtrlSelect id={'ce-' + f.key} value={value} onChange={set} options={f.options} />;else
          if (f.control === 'number') control = <CtrlNumber id={'ce-' + f.key} value={value} onChange={set} unit={f.unit} placeholder={f.placeholder} />;else
          control = <CtrlText id={'ce-' + f.key} value={value} onChange={set} placeholder={f.placeholder} />;

          // bool renders its own label inline; others get a field label.
          return (
            <FieldShell ctx={ctx} fieldKey={key} label={f.label} key={f.key}>
              {f.control === 'bool' ?
              <label className="ce-row ce-row-toggle">
                    <span className="ce-row-label">{f.label}</span>
                    <CtrlYesNo value={value} onChange={set} label={f.label} allowUnset />
                  </label> :
              <label className="ce-row">
                    <span className="ce-row-label">{f.label}</span>
                    <span className="ce-row-control">{control}</span>
                  </label>}
            </FieldShell>);
        })}
      </div> : null}
      <CustomSpecsBody ctx={ctx} hasStandard={fields.length > 0} />
    </SpecGroup>);
}

const CONNECTIVITY_FIELDS = [
{ key: 'initialSetup', label: 'Initial setup', options: ['Local', 'Manufacturer account', 'Manufacturer cloud'] },
{ key: 'dayToDay', label: 'Day-to-day control', options: ['Local', 'Manufacturer cloud', 'Mixed'] },
{ key: 'offline', label: 'If the internet drops', options: ['Keeps working', 'Limited', 'Stops working'] }];

function ConnectivityEditor({ ctx }) {
  const c = ctx.getVal('connectivity') || {};
  const update = (patch) => ctx.setVal('connectivity', { ...c, ...patch });
  const pendingEntry = ctx.pending && ctx.pending.connectivity;
  const pendVal = pendingEntry ? (pendingEntry.value || {}) : null;
  const approved = (ctx.device.specs && ctx.device.specs.connectivity) || {};
  return (
    <FieldShell ctx={ctx} fieldKey="connectivity" label="Connectivity details" selfLock>
      <div className="ce-form-grid" style={{ marginTop: 'var(--space-4)' }}>
        {CONNECTIVITY_FIELDS.map((f) =>
        pendFieldChanged(pendVal, approved, f.key) ?
        <LockRow key={f.key} label={f.label} entry={pendingEntry}>
          <LockBox value={pendVal[f.key]} select />
        </LockRow> :
        <label className="ce-row" key={f.key}>
            <span className="ce-row-label">{f.label}</span>
            <span className="ce-row-control"><CtrlSelect value={c[f.key]} onChange={(v) => update({ [f.key]: v })} options={f.options} /></span>
          </label>)}
      </div>
    </FieldShell>);
}

function EcosystemsEditor({ ctx }) {
  const eco = ctx.getVal('ecosystems') || {};
  const update = (patch) => ctx.setVal('ecosystems', { ...eco, ...patch });
  const pendingEntry = ctx.pending && ctx.pending.ecosystems;
  const pendVal = pendingEntry ? (pendingEntry.value || {}) : null;
  const approved = (ctx.device.specs && ctx.device.specs.ecosystems) || {};
  return (
    <FieldShell ctx={ctx} fieldKey="ecosystems" label="Ecosystems" selfLock>
      <SpecGroup title="Ecosystems">
        <div className="ce-form-grid">
          {(window.ECOSYSTEM_OPTIONS || []).map((o) =>
          pendFieldChanged(pendVal, approved, o.key) ?
          <LockRow key={o.key} label={o.label} entry={pendingEntry} toggle>
            <LockedYesNo value={pendVal[o.key]} onLabel="Supported" offLabel="Not supported" />
          </LockRow> :
          <label className="ce-row ce-row-toggle" key={o.key}>
              <span className="ce-row-label">{o.label}</span>
              <CtrlYesNo value={eco[o.key]} onChange={(v) => update({ [o.key]: v })} label={o.label} onLabel="Supported" offLabel="Not supported" allowUnset />
            </label>)}
        </div>
        <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-3)' }}
        onClick={() => {/* Would open a GitHub page to propose a new ecosystem. No-op for now. */}}>
          Suggest a new ecosystem <Icon name="open" size={13} />
        </button>
      </SpecGroup>
    </FieldShell>);
}

function AppSubscriptionEditor({ ctx }) {
  const eco = ctx.getVal('ecosystems') || {};
  const update = (patch) => ctx.setVal('ecosystems', { ...eco, ...patch });
  // App-store links, only meaningful when a first-party app exists. Stored
  // as a nested object on ecosystems so the whole field diffs as one edit.
  // `others` is a list of extra store URLs (named from their host on the
  // read view); the legacy single `other` string is normalised into it.
  const links = eco.appLinks || {};
  const others = Array.isArray(links.others) ? links.others : (links.other ? [links.other] : []);
  const updateLink = (patch) => update({ appLinks: { ...links, ...patch } });
  const writeOthers = (arr) => {
    const next = { ...links, others: arr };
    delete next.other; // supersede the legacy single-value field
    return update({ appLinks: next });
  };
  const setOtherAt = (i, v) => writeOthers(others.map((o, idx) => idx === i ? v : o));
  const removeOtherAt = (i) => writeOthers(others.filter((_, idx) => idx !== i));
  const addOther = () => writeOthers([...others, '']);
  const hasApp = eco.proprietaryApp === 'Optional' || eco.proprietaryApp === 'Required';
  const pendingEntry = ctx.pending && ctx.pending.ecosystems;
  const pendVal = pendingEntry ? (pendingEntry.value || {}) : null;
  const approved = (ctx.device.specs && ctx.device.specs.ecosystems) || {};
  const linksChanged = pendVal && Object.prototype.hasOwnProperty.call(pendVal, 'appLinks') &&
    JSON.stringify(pendVal.appLinks || {}) !== JSON.stringify(approved.appLinks || {});
  const pLinks = (pendVal && pendVal.appLinks) || {};
  const apLinks = approved.appLinks || {};
  const pOthers = Array.isArray(pLinks.others) ? pLinks.others : (pLinks.other ? [pLinks.other] : []);
  const apOthers = Array.isArray(apLinks.others) ? apLinks.others : (apLinks.other ? [apLinks.other] : []);
  // Per-link review: only the specific store link that changed locks; the
  // others stay editable. A store counts as "in review" when the pending edit
  // touched appLinks and that link's value differs from the approved one.
  const linkChanged = (key) => linksChanged &&
    JSON.stringify(pLinks[key] != null ? pLinks[key] : null) !== JSON.stringify(apLinks[key] != null ? apLinks[key] : null);
  // Pending-only "other" store links (added in review, not yet approved).
  const lockedOthers = linksChanged ? pOthers.filter((u) => u && apOthers.indexOf(u) === -1) : [];
  const anyLinkLocked = linkChanged('ios') || linkChanged('android') || lockedOthers.length > 0;
  return (
    <FieldShell ctx={ctx} fieldKey="ecosystems" label="App and subscription" selfLock>
      <SpecGroup title="App and subscription">
        <div className="ce-form-grid">
          {pendFieldChanged(pendVal, approved, 'proprietaryApp') ?
          <LockRow label="Proprietary app" entry={pendingEntry}><LockBox value={pendVal.proprietaryApp} select /></LockRow> :
          <label className="ce-row">
            <span className="ce-row-label">Proprietary app</span>
            <span className="ce-row-control">
              <CtrlSelect value={eco.proprietaryApp} onChange={(v) => update({ proprietaryApp: v })}
              options={window.PROPRIETARY_APP_OPTIONS || ['No', 'Optional', 'Required']} />
            </span>
          </label>}
          {(hasApp || anyLinkLocked) &&
          <div className="ce-row ce-row-top">
            <span className="ce-row-label">Download</span>
            <div className="ce-row-control ce-applinks-set">
              {linkChanged('ios') ?
              <div className="ce-applink-lockitem">
                <div className="ce-applink-row ce-applink-row-lock"><span className="ce-applink-store">App Store</span><LockBox value={pLinks.ios} /></div>
                <PendingMeta entry={pendingEntry} />
              </div> :
              <label className="ce-applink-row">
                  <span className="ce-applink-store">App Store</span>
                  <CtrlText value={links.ios} placeholder="https://apps.apple.com/app/..."
                  onChange={(v) => updateLink({ ios: v })} />
                </label>}
              {linkChanged('android') ?
              <div className="ce-applink-lockitem">
                <div className="ce-applink-row ce-applink-row-lock"><span className="ce-applink-store">Google Play</span><LockBox value={pLinks.android} /></div>
                <PendingMeta entry={pendingEntry} />
              </div> :
              <label className="ce-applink-row">
                  <span className="ce-applink-store">Google Play</span>
                  <CtrlText value={links.android} placeholder="https://play.google.com/store/apps/details?id=..."
                  onChange={(v) => updateLink({ android: v })} />
                </label>}
              {others.map((url, i) =>
                <label className="ce-applink-row" key={i}>
                  <span className="ce-applink-store">{storeNameFromUrl(url) || 'Other store'}</span>
                  <CtrlText value={url} placeholder="Galaxy Store, AppGallery, or a direct download URL"
                  onChange={(v) => setOtherAt(i, v)} />
                  <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => removeOtherAt(i)}>Remove</button>
                </label>
              )}
              {lockedOthers.map((url, i) =>
                <div className="ce-applink-lockitem" key={'lk' + i}>
                  <div className="ce-applink-row ce-applink-row-lock">
                    <span className="ce-applink-store">{storeNameFromUrl(url) || 'Other store'}</span>
                    <LockBox value={url} />
                  </div>
                  <PendingMeta entry={pendingEntry} />
                </div>
              )}
              <span className="ce-bridge-hint">Optional links to where the app can be downloaded.</span>
              <button type="button" className="btn btn-secondary btn-sm ce-applink-add" onClick={addOther}>
                + Add other store
              </button>
            </div>
          </div>}
          {(window.MANUFACTURER_FLAGS || []).map((o) =>
          pendFieldChanged(pendVal, approved, o.key) ?
          <LockRow key={o.key} label={o.label} entry={pendingEntry} toggle><LockedYesNo value={pendVal[o.key]} /></LockRow> :
          <React.Fragment key={o.key}>
              <label className="ce-row ce-row-toggle">
                <span className="ce-row-label">{o.label}</span>
                <CtrlYesNo value={eco[o.key]} onChange={(v) => update({ [o.key]: v })} label={o.label} allowUnset />
              </label>
              {o.key === 'subscriptionFeatures' && eco.subscriptionFeatures === true &&
            <div className="ce-row ce-row-top">
                  <span className="ce-row-label">What is paid for</span>
                  <span className="ce-row-control">
                    <textarea className="ce-textarea" rows={2}
                placeholder="Optional: describe which features need a paid subscription."
                value={eco.subscriptionNote || ''} onChange={(e) => update({ subscriptionNote: e.target.value })} />
                  </span>
                </div>}
            </React.Fragment>)}
        </div>
      </SpecGroup>
    </FieldShell>);
}

// Bridge requirement is derived from the connectivity protocols. Zigbee,
// Z-Wave and Matter over Thread always need a bridge (a coordinator,
// controller, or Thread border router). Any compatible open coordinator
// works; a manufacturer's proprietary bridge is optional and can add extra
// features, so it is captured as an optional note rather than a requirement.
const BRIDGE_LINK = '#/browse?category=hubs';
function bridgeRequirements(protos, category) {
  protos = protos || {};
  if (category === 'hubs') return [];
  const reqs = [];
  if (protos.zigbee) reqs.push({ key: 'zigbee', need: 'Needs a Zigbee coordinator', linkLabel: 'View coordinators' });
  if (protos.zwave) reqs.push({ key: 'zwave', need: 'Needs a Z-Wave controller', linkLabel: 'View controllers' });
  if (protos.thread || protos.matterThread) reqs.push({ key: 'thread', need: 'Needs a Thread border router', linkLabel: 'View border routers' });
  return reqs;
}

function ProtocolsEditor({ ctx }) {
  const protos = ctx.getVal('protocols') || {};
  const update = (patch) => ctx.setVal('protocols', { ...protos, ...patch });
  const reqs = bridgeRequirements(protos, ctx.device.category);
  const protocolsPending = ctx.pending && ctx.pending.protocols;

  // Proprietary bridge lives inside the Connectivity group (its own 'bridge'
  // field). Shown for Zigbee / Z-Wave devices that are not themselves a hub.
  // A repeatable list with autocomplete against the same manufacturer's hubs.
  const showBridge = (protos.zigbee || protos.zwave) && ctx.device.category !== 'hubs';
  const bridge = ctx.getVal('bridge') || {};
  const bridgeList = Array.isArray(bridge.proprietary) ? bridge.proprietary : (bridge.proprietary ? [bridge.proprietary] : []);
  const writeBridge = (arr) => ctx.setVal('bridge', { ...bridge, proprietary: arr.length ? arr : undefined });
  const setBridgeAt = (i, v) => writeBridge(bridgeList.map((x, idx) => idx === i ? v : x));
  const removeBridgeAt = (i) => writeBridge(bridgeList.filter((_, idx) => idx !== i));
  const addBridge = () => writeBridge([...bridgeList, '']);
  const suggestions = (window.DEVICES || [])
    .filter((d) => d.category === 'hubs' && d.manufacturer === ctx.device.manufacturer)
    .map((d) => d.name);
  const listId = 'ce-bridge-suggest-' + ctx.device.id;
  const bridgePending = ctx.pending && ctx.pending.bridge;
  const pendingBridgeNames = bridgePending && bridgePending.value && bridgePending.value.proprietary
    ? (Array.isArray(bridgePending.value.proprietary) ? bridgePending.value.proprietary : [bridgePending.value.proprietary])
    : [];
  // While a bridge edit is awaiting review the proposed bridges stay locked,
  // but a contributor can still propose adding more. Additions live in the
  // draft on top of the pending names.
  const bridgeAdditions = bridgeList.filter((nm) => pendingBridgeNames.indexOf(nm) === -1);
  const writeAdditions = (arr) => ctx.setVal('bridge', { ...bridge, proprietary: [...pendingBridgeNames, ...arr] });
  const setAdditionAt = (i, v) => writeAdditions(bridgeAdditions.map((x, idx) => idx === i ? v : x));
  const removeAdditionAt = (i) => writeAdditions(bridgeAdditions.filter((_, idx) => idx !== i));
  const addPendingBridge = () => writeAdditions([...bridgeAdditions, '']);

  return (
    <FieldShell ctx={ctx} fieldKey="protocols" label="Connectivity" selfLock>
      <SpecGroup title="Connectivity">
        <div className="ce-form-grid">
          {protocolsPending ?
          <div className="ce-row ce-row-top">
            <span className="ce-row-label">Supported</span>
            <div className="ce-row-control ce-pending-protocontrol">
              <div className="ce-check-col ce-check-col-lock" role="group" aria-disabled="true">
                {(window.PROTOCOL_OPTIONS || []).map((p) =>
                <span className={'ce-check' + ((protocolsPending.value || {})[p.key] === true ? '' : ' ce-check-off')} key={p.key}>
                  <input type="checkbox" checked={(protocolsPending.value || {})[p.key] === true} readOnly disabled />
                  <span className="proto-name"><window.ProtocolGlyph name={p.key} />{p.label}</span>
                </span>)}
              </div>
              <PendingMeta entry={protocolsPending} />
            </div>
          </div> :
          <div className="ce-row ce-row-top">
            <span className="ce-row-label">Supported</span>
            <div className="ce-check-col">
              {(window.PROTOCOL_OPTIONS || []).map((p) =>
              <label className="ce-check" key={p.key}>
                  <input type="checkbox" checked={protos[p.key] === true}
                onChange={(e) => update({ [p.key]: e.target.checked })} />
                  <span className="proto-name"><window.ProtocolGlyph name={p.key} />{p.label}</span>
                </label>)}
            </div>
          </div>}
          {reqs.length > 0 &&
          <div className="ce-row ce-row-top">
              <span className="ce-row-label">Bridge</span>
              <div className="ce-row-control ce-bridge-control">
                <div className="ce-bridge-reqs">
                  {reqs.map((r) =>
                  <React.Fragment key={r.key}>
                      <span>{r.need}</span>
                      <a className="ce-hub-link" href={BRIDGE_LINK}>{r.linkLabel}</a>
                    </React.Fragment>)}
                </div>
              </div>
            </div>}
          {showBridge && (bridgePending ?
          <div className="ce-row ce-row-itemlock">
            <span className="ce-row-label">Proprietary bridge</span>
            <div className="ce-itemlock-control">
              <div className="ce-msrp-set">{pendingBridgeNames.map((nm, i) => <LockedBridgeName key={'p' + i} name={nm} />)}</div>
              <PendingMeta entry={bridgePending} />
              {bridgeAdditions.map((nm, i) =>
              <div className="ce-msrp-row" key={'a' + i}>
                  <BridgeCombo value={nm} options={suggestions} used={[...pendingBridgeNames, ...bridgeAdditions.filter((_, idx) => idx !== i)]} onChange={(v) => setAdditionAt(i, v)} />
                  <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => removeAdditionAt(i)}>Remove</button>
                </div>)}
              <button type="button" className="btn btn-secondary btn-sm ce-msrp-add" onClick={addPendingBridge}>+ Add bridge</button>
            </div>
          </div> :
          <div className="ce-row ce-row-top">
            <span className="ce-row-label">Proprietary bridge</span>
            <div className="ce-row-control ce-msrp-set">
              {bridgeList.map((nm, i) =>
              <div className="ce-msrp-row" key={i}>
                  <BridgeCombo value={nm} options={suggestions} used={bridgeList.filter((_, idx) => idx !== i)} onChange={(v) => setBridgeAt(i, v)} />
                  <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => removeBridgeAt(i)}>Remove</button>
                </div>)}
              <span className="ce-bridge-hint">A manufacturer bridge is optional and can add extra features. Start typing to pick one of this manufacturer's hubs.</span>
              <button type="button" className="btn btn-secondary btn-sm ce-msrp-add" onClick={addBridge}>+ Add bridge</button>
            </div>)}
        </div>
      </SpecGroup>
    </FieldShell>);
}

// Reference price (MSRP) editor. One row per currency, following the app-link
// pattern: no row by default, an "Add price" button appends a row, each row is
// removable. Mirrors the read page's Pricing position (after the category specs).
function PricingEditor({ ctx }) {
  const raw = ctx.getVal('msrp');
  const list = Array.isArray(raw) ? raw
    : (raw && raw.amount != null ? [{ amount: raw.amount, currency: raw.currency }] : []);
  const write = (arr) => ctx.setVal('msrp', arr.length ? arr : undefined);
  const setAt = (i, patch) => write(list.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  const removeAt = (i) => write(list.filter((_, idx) => idx !== i));
  const add = () => write([...list, { amount: undefined, currency: 'USD' }]);
  const pendingEntry = ctx.pending && ctx.pending.msrp;
  const pendingList = pendingEntry
    ? (Array.isArray(pendingEntry.value) ? pendingEntry.value
      : (pendingEntry.value && pendingEntry.value.amount != null ? [pendingEntry.value] : []))
    : [];
  const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'];
  return (
    <FieldShell ctx={ctx} fieldKey="msrp" label="Pricing" selfLock>
      <SpecGroup title="Pricing">
        <div className="ce-form-grid">
          <div className="ce-row ce-row-top">
            <span className="ce-row-label">Reference price</span>
            <div className="ce-row-control ce-msrp-set">
              {pendingEntry ?
              <div className="ce-applink-lockitem">
                {pendingList.filter((p) => p && p.amount != null).map((p, i) =>
                <div className="ce-applink-row ce-applink-row-lock" key={i}>
                    <span className="ce-applink-store">{p.currency || 'USD'}</span>
                    <LockBox value={String(p.amount)} />
                  </div>)}
                <PendingMeta entry={pendingEntry} />
              </div> :
              <React.Fragment>
                {list.map((p, i) =>
                <div className="ce-msrp-row" key={i}>
                    <CtrlNumber value={p.amount} placeholder="e.g. 59.99" onChange={(v) => setAt(i, { amount: v })} />
                    <CtrlSelect value={p.currency || 'USD'} onChange={(v) => setAt(i, { currency: v })} options={CURRENCIES} />
                    <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => removeAt(i)}>Remove</button>
                  </div>)}
                <span className="ce-bridge-hint">Manufacturer list price (MSRP). Optional, add one per currency.</span>
                <button type="button" className="btn btn-secondary btn-sm ce-msrp-add" onClick={add}>
                  + Add price
                </button>
              </React.Fragment>}
            </div>
          </div>
        </div>
      </SpecGroup>
    </FieldShell>);
}

function DimensionsEditor({ ctx }) {
  const list = ctx.getVal('dimensions') || [];
  const setList = (next) => ctx.setVal('dimensions', next);
  const setAt = (i, patch) => setList(list.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  const removeAt = (i) => setList(list.filter((_, idx) => idx !== i));
  const add = () => setList([...list, { name: '', height: undefined, width: undefined, depth: undefined }]);
  const pendingEntry = ctx.pending && ctx.pending.dimensions;
  const pendArr = pendingEntry ? (Array.isArray(pendingEntry.value) ? pendingEntry.value : []) : null;
  const approved = (ctx.device.specs && ctx.device.specs.dimensions) || [];
  const sameDim = (a, b) => !!a && !!b && a.name === b.name &&
    a.height === b.height && a.width === b.width && a.depth === b.depth;
  // The editable list stays fully usable while a proposal is in review: a
  // contributor can edit, remove, and add dimension sets. The pending proposal
  // (sets not already in the approved record) shows locked below it.
  const lockedRows = pendArr ? pendArr.filter((p) => !approved.some((a) => sameDim(a, p))) : [];
  const mm = (v) => (v == null || v === '') ? '' : v + ' mm';
  return (
    <FieldShell ctx={ctx} fieldKey="dimensions" label="Dimensions" selfLock>
      <SpecGroup title="Dimensions">
        <div className="ce-dim-list ce-dim-list-hair">
          {list.map((e, i) =>
          <div className="ce-dim-item" key={i}>
              <div className="ce-dim-set">
                <CtrlText value={e.name} placeholder="e.g. Device, Packaging" onChange={(v) => setAt(i, { name: v })} />
                <div className="ce-dim-measures">
                  <CtrlNumber value={e.height} unit="mm" placeholder="Height" onChange={(v) => setAt(i, { height: v })} />
                  <CtrlNumber value={e.width} unit="mm" placeholder="Width" onChange={(v) => setAt(i, { width: v })} />
                  <CtrlNumber value={e.depth} unit="mm" placeholder="Depth" onChange={(v) => setAt(i, { depth: v })} />
                </div>
                <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => removeAt(i)}>Remove</button>
              </div>
            </div>)}
          {lockedRows.map((e, i) =>
          <div className="ce-dim-item ce-dim-item-lock" key={'lk' + i}>
              <div className="ce-dim-set-lock">
                <LockBox value={e.name} />
                <LockBox value={mm(e.height)} />
                <LockBox value={mm(e.width)} />
                <LockBox value={mm(e.depth)} />
              </div>
              <PendingMeta entry={pendingEntry} />
            </div>)}
        </div>
        <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={add}>+ Add dimensions</button>
      </SpecGroup>
    </FieldShell>);
}

function IdentifiersEditor({ ctx }) {
  const ids = ctx.getVal('identifiers') || {};
  const update = (patch) => ctx.setVal('identifiers', { ...ids, ...patch });
  const pendingEntry = ctx.pending && ctx.pending.identifiers;
  const pendVal = pendingEntry ? (pendingEntry.value || {}) : null;
  const approved = (ctx.device.specs && ctx.device.specs.identifiers) || {};
  const idRow = (key, label, placeholder) =>
    pendFieldChanged(pendVal, approved, key) ?
    <LockRow key={key} label={label} entry={pendingEntry}><LockBox value={pendVal[key]} /></LockRow> :
    <label className="ce-row" key={key}><span className="ce-row-label">{label}</span>
      <span className="ce-row-control"><CtrlText value={ids[key]} placeholder={placeholder} onChange={(v) => update({ [key]: v })} /></span></label>;
  return (
    <FieldShell ctx={ctx} fieldKey="identifiers" label="Product identifiers" selfLock>
      <SpecGroup title="Product identifiers">
        <div className="ce-form-grid">
          <div className="ce-row">
            <span className="ce-row-label">Model number</span>
            <span className="ce-row-control" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="mono">{ctx.device.model}</span>
              <InfoHint text="Collected from Home Assistant. Contributors can't edit this." />
            </span>
          </div>
          {idRow('ean', 'EAN', '13-digit barcode')}
          {idRow('sku', 'SKU', 'Retail SKU')}
        </div>
      </SpecGroup>
    </FieldShell>);
}

function ReferencesEditor({ ctx }) {
  const refs = ctx.getVal('references') || [];
  const update = (next) => ctx.setVal('references', next);
  const setAt = (i, patch) => update(refs.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const removeAt = (i) => update(refs.filter((_, idx) => idx !== i));
  const add = () => update([...refs, { label: '', url: '' }]);
  const pendingEntry = ctx.pending && ctx.pending.references;
  const pendArr = pendingEntry ? (Array.isArray(pendingEntry.value) ? pendingEntry.value : []) : null;
  const approved = (ctx.device.specs && ctx.device.specs.references) || [];
  const sameRef = (a, b) => !!a && !!b && a.label === b.label && a.url === b.url;
  // The editable list stays fully usable while a proposal is in review: a
  // contributor can edit, remove, and add references. The pending proposal
  // (references not already in the approved record) shows locked below it.
  const lockedRows = pendArr ? pendArr.filter((p) => !approved.some((a) => sameRef(a, p))) : [];
  return (
    <FieldShell ctx={ctx} fieldKey="references" label="External references" selfLock>
      <div>
        <p className="ce-field-help" style={{ marginTop: 0 }}>Links to source pages used to verify this device.</p>
        <div className="ce-ref-list ce-ref-list-hair">
          {refs.map((r, i) =>
          <div className="ce-ref-item" key={i}>
              <div className="ce-ref-row">
                <CtrlText value={r.label} placeholder="Source name" onChange={(v) => setAt(i, { label: v })} />
                <CtrlText value={r.url} placeholder="https://…" onChange={(v) => setAt(i, { url: v })} />
                <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => removeAt(i)}>Remove</button>
              </div>
            </div>)}
          {lockedRows.map((r, i) =>
          <div className="ce-ref-item ce-ref-item-lock" key={'lk' + i}>
              <div className="ce-ref-row ce-ref-row-lock">
                <LockBox value={r.label} />
                <LockBox value={r.url} />
                <span className="ce-acct-quiet ce-acct-quiet-danger ce-ref-remove-spacer" aria-hidden="true">Remove</span>
              </div>
              <PendingMeta entry={pendingEntry} />
            </div>)}
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={add} style={{ marginTop: 'var(--space-3)' }}>
          + Add reference
        </button>
      </div>
    </FieldShell>);
}

// ─────────────────────────────────────────────────────────────────────
// Custom fields (contributor-added extras)
// ─────────────────────────────────────────────────────────────────────
// Label input that suggests labels already used by other contributors in the
// same category, while still letting the contributor type their own. This is
// the main guard against the same detail being named two different ways.
function LabelCombo({ value, onChange, category, used, placeholder }) {
  const [open, setOpen] = React.useState(false);
  const all = (window.customSpecSuggestions && window.customSpecSuggestions(category)) || [];
  const usedLower = new Set((used || []).map((u) => (u || '').trim().toLowerCase()));
  const q = (value || '').trim().toLowerCase();
  const matches = all.filter((l) => {
    const k = l.toLowerCase();
    if (usedLower.has(k)) return false; // already used on this device
    return q === '' ? true : k.indexOf(q) !== -1;
  });
  const exact = q !== '' && all.some((l) => l.toLowerCase() === q);
  const showNew = q !== '' && !exact;
  return (
    <div className="ce-labelcombo"
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <input className="ce-input" value={value || ''} placeholder={placeholder || 'Field name'}
        role="combobox" aria-expanded={open} aria-autocomplete="list"
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} />
      {open && (matches.length > 0 || showNew) ?
        <div className="ce-labelcombo-pop" role="listbox">
          {matches.map((l) =>
            <button type="button" className="ce-labelcombo-opt" role="option" key={l}
              onMouseDown={(e) => { e.preventDefault(); onChange(l); setOpen(false); }}>
              {l}
            </button>)}
          {showNew ?
            <button type="button" className="ce-labelcombo-opt ce-labelcombo-new" role="option"
              onMouseDown={(e) => { e.preventDefault(); onChange((value || '').trim()); setOpen(false); }}>
              <span>Use “{(value || '').trim()}”</span>
            </button> : null}
        </div> : null}
    </div>);
}

// Read-only locked bridge value (awaiting review). Links to the matching hub
// device when one is on record.
function LockedBridgeName({ name }) {
  const bd = window.deviceForBridgeName ? window.deviceForBridgeName(name) : null;
  return (
    <span className="ce-lock-input">
      <span className="ce-lock-input-val">
        {bd ? <a className="ce-link-ink" href={'#/device/' + bd.id}>{name}</a> : name}
      </span>
    </span>);
}

// Free-text input with a custom suggestion dropdown (same interaction as the
// additional-details LabelCombo): opens on focus, filters as you type, no
// native datalist arrow. Used for proprietary bridge names. `used` lists names
// already added (pending or in other rows) so they're not suggested twice.
function BridgeCombo({ value, onChange, options, used }) {
  const [open, setOpen] = React.useState(false);
  const q = (value || '').trim().toLowerCase();
  const usedLower = new Set((used || []).map((u) => (u || '').trim().toLowerCase()));
  const matches = (options || []).filter((l) => {
    if (usedLower.has(l.toLowerCase())) return false;
    return q === '' ? true : l.toLowerCase().indexOf(q) !== -1;
  });
  return (
    <div className="ce-labelcombo"
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <input className="ce-input" value={value || ''}
        role="combobox" aria-expanded={open} aria-autocomplete="list"
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} />
      {open && matches.length > 0 ?
        <div className="ce-labelcombo-pop" role="listbox">
          {matches.map((l) =>
            <button type="button" className="ce-labelcombo-opt" role="option" key={l}
              onMouseDown={(e) => { e.preventDefault(); onChange(l); setOpen(false); }}>
              {l}
            </button>)}
        </div> : null}
    </div>);
}

// The field types a contributor can pick for an additional detail. Most
// extras are a short free-text value, but some are naturally a number (with no
// fixed unit) or a yes / no / not set fact, so the value control adapts to the
// chosen type.
const CUSTOM_FIELD_TYPES = [
  { v: 'text', label: 'Text' },
  { v: 'number', label: 'Number' },
  { v: 'bool', label: 'Yes / No' }
];
function CustomTypeSelect({ value, onChange }) {
  return (
    <select className="ce-input ce-select ce-custom-typesel" value={value || 'text'}
      aria-label="Field type" onChange={(e) => onChange(e.target.value)}>
      {CUSTOM_FIELD_TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
    </select>);
}
// A blank value appropriate to the type: text starts as an empty string, the
// others as "not set" (undefined) so a freshly switched row reads as unset
// rather than 0 / No.
function customFieldBlank(type) {
  return type === 'text' ? '' : undefined;
}
// Does a custom row carry a real value? Booleans (including false) and numbers
// (including 0) count; text must be non-empty after trimming.
function hasCustomValue(r) {
  if (!r) return false;
  const v = r.value;
  if (v === true || v === false) return true;
  if (typeof v === 'number') return !Number.isNaN(v);
  return v != null && String(v).trim() !== '';
}
// Display form of a custom value for read / locked views.
function fmtCustomValue(r) {
  const v = r ? r.value : undefined;
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  return v;
}

function CustomSpecsBody({ ctx, hasStandard }) {
  const rows = ctx.getVal('customFields') || [];
  const update = (next) => ctx.setVal('customFields', next);
  const setAt = (i, patch) => update(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const removeAt = (i) => update(rows.filter((_, idx) => idx !== i));
  const add = () => update([...rows, { label: '', value: '', type: 'text' }]);
  // Switching type clears the value to a type-appropriate blank so a stale
  // value (e.g. text left over after switching to Yes / No) can't linger.
  const setType = (i, type) => setAt(i, { type, value: customFieldBlank(type) });
  const category = ctx.device.category;
  const usedLabels = rows.map((r) => r.label);

  const pendingEntry = ctx.pending && ctx.pending.customFields;
  const pendArr = pendingEntry ? (Array.isArray(pendingEntry.value) ? pendingEntry.value : []) : null;
  const approved = (ctx.device.specs && ctx.device.specs.customFields) || [];
  const sameRow = (a, b) => !!a && !!b && a.label === b.label && a.value === b.value && (a.type || 'text') === (b.type || 'text');
  // Rows in the pending proposal that aren't already approved show locked below
  // the editable list, mirroring References / App links.
  const lockedRows = pendArr ? pendArr.filter((p) => p && p.label && !approved.some((a) => sameRow(a, p))) : [];

  return (
    <FieldShell ctx={ctx} fieldKey="customFields" label="Additional details" selfLock>
      <div className={'ce-customblock' + (hasStandard ? ' ce-customblock-divided' : '')}>
        <div className="ce-custom-list">
          {rows.map((r, i) => {
            const type = r.type || 'text';
            let control;
            if (type === 'bool')
              control = <CtrlYesNo label={r.label || 'Value'} value={r.value} allowUnset onChange={(v) => setAt(i, { value: v })} />;
            else if (type === 'number')
              control = <CtrlNumber value={r.value} placeholder="Value" onChange={(v) => setAt(i, { value: v })} />;
            else
              control = <CtrlText value={r.value} placeholder="Value" onChange={(v) => setAt(i, { value: v })} />;
            return (
            <div className="ce-custom-item" key={i}>
              <LabelCombo value={r.label} category={category}
                used={usedLabels.filter((_, idx) => idx !== i)}
                onChange={(v) => setAt(i, { label: v })} />
              <CustomTypeSelect value={type} onChange={(t) => setType(i, t)} />
              <span className="ce-custom-value">{control}</span>
              <button type="button" className="ce-acct-quiet ce-acct-quiet-danger" onClick={() => removeAt(i)}>Remove</button>
            </div>);
          })}
          {lockedRows.map((r, i) =>
            <div className="ce-custom-item ce-custom-item-lock" key={'lk' + i}>
              <div className="ce-custom-lockrow">
                <LockBox value={r.label} />
                {(r.type || 'text') === 'bool' ?
                  <span className="ce-custom-value"><LockedYesNo value={r.value} /></span> :
                  <LockBox value={fmtCustomValue(r)} />}
                <span className="ce-acct-quiet ce-acct-quiet-danger ce-ref-remove-spacer" aria-hidden="true">Remove</span>
              </div>
              <PendingMeta entry={pendingEntry} />
            </div>)}
        </div>
        <div className="ce-custom-add-row">
          <button type="button" className="btn btn-secondary btn-sm" onClick={add}>
            + Add additional details
          </button>
          <InfoHint text="Extra details that aren’t on the standard list for this category. Where you can, pick a label other contributors have already used so the same thing isn’t named two ways. These are reviewed like any other edit." />
        </div>
      </div>
    </FieldShell>);
}

Object.assign(window, {
  // read
  hasDescription, hasInstructions, hasReferences, isPopulated,
  DescriptionRead, InstructionsRead, ReferencesRead, SpecsReadGroups, SpecGroup, InfoHint,
  Paragraphs, fmtSpecValue, hasSpecValue, EcoMark, bridgeRequirements,
  // edit
  PendingLock, PendingMeta, FieldShell, SuggestionRow,
  DescriptionEditor, InstructionsEditor, CategorySpecsEditor,
  EcosystemsEditor, ProtocolsEditor, PricingEditor, DimensionsEditor,
  IdentifiersEditor, ReferencesEditor, ConnectivityEditor, AppSubscriptionEditor
});