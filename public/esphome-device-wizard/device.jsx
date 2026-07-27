// device.jsx — Home Assistant "device" config page for the Connect Proxy (Nabu Casa).
// Recreates the responsive HA device-page shell (sidebar + app bar + masonry of cards)
// and embeds the "Your Connect Proxy is ready" banner, which opens the shared WizardDialog.

const { Icon, Btn, BrandIcon, ICONS, ITEMS, WizardDialog, CapabilityPip, useProxyWizard } = window;

/* extra MDI glyphs used only by the shell */
const D = {
  home:    "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
  map:     "M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M12,4A3,3 0 0,0 9,7A3,3 0 0,0 12,10A3,3 0 0,0 15,7A3,3 0 0,0 12,4M12,11.5C10,11.5 6,12.5 6,14.5V16H18V14.5C18,12.5 14,11.5 12,11.5Z",
  flash:   "M11,15H6L13,1V9H18L11,23V15Z",
  media:   "M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H5M10,8L15,12L10,16V8Z",
  bell:    "M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21H14Z",
  menuOpen:"M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z",
  pencil:  "M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z",
  dots:    "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
  wifi:    "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",
  clock:   "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",
  lan:     "M16,11V9H14V11H10V9H8V11A2,2 0 0,0 6,13V15H18V13A2,2 0 0,0 16,11M4,17V19A2,2 0 0,0 6,21H10V19H6V17H4M20,17H18V19H14V21H18A2,2 0 0,0 20,19V17M6,3A2,2 0 0,0 4,5V7H6V5H10V3H6M18,3H14V5H18V7H20V5A2,2 0 0,0 18,3Z",
  button:  "M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5Z",
  led:     "M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z",
  lockReset:"M12,3A4,4 0 0,1 16,7V8H17A2,2 0 0,1 19,10V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V10A2,2 0 0,1 7,8H8V7A4,4 0 0,1 12,3M12,5A2,2 0 0,0 10,7V8H14V7A2,2 0 0,0 12,5M12,12A2,2 0 0,0 10,14A2,2 0 0,0 12,16A2,2 0 0,0 14,14A2,2 0 0,0 12,12Z",
};

/* ---------------- sidebar ---------------- */
function NavItem({ icon, label, active }) {
  return (
    <div className={"nav__item" + (active ? " is-active" : "")}>
      <Icon path={icon} size={24} color={active ? "#009ac7" : "#21212199"}></Icon>
      <span>{label}</span>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <button className="icon-btn"><Icon path={D.menuOpen} size={24} color="#5a5a5a"></Icon></button>
        <span className="sidebar__brand">Home Assistant</span>
      </div>
      <nav className="sidebar__nav">
        <NavItem icon={D.home} label="Overview"></NavItem>
        <NavItem icon={D.map} label="Kaart"></NavItem>
        <NavItem icon={D.flash} label="Energy"></NavItem>
        <NavItem icon={D.media} label="Media"></NavItem>
      </nav>
      <div className="sidebar__foot">
        <NavItem icon={ICONS.cog} label="Settings" active></NavItem>
        <NavItem icon={D.bell} label="Notifications"></NavItem>
        <div className="nav__item nav__user">
          <span className="avatar">M</span>
          <span>Matthias</span>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- shared card bits ---------------- */
function Card({ title, children, footer, action, className }) {
  return (
    <section className={"ha-card dcard" + (className ? " " + className : "")}>
      <div className="dcard__head">
        <h2 className="dcard__title">{title}</h2>
        {action}
      </div>
      <div className="dcard__body">{children}</div>
      {footer ? <div className="dcard__foot">{footer}</div> : null}
    </section>
  );
}

function DashLink({ label = "Add to dashboard" }) {
  return <a className="linkbtn" href="#" onClick={(e) => e.preventDefault()}>{label}</a>;
}

function EntityRow({ icon, color = "#44739e", name, secondary, value, control, strike }) {
  return (
    <div className="erow">
      <span className="erow__icon"><Icon path={icon} size={24} color={color} strike={strike}></Icon></span>
      <span className="erow__text">
        <span className="erow__name">{name}</span>
        {secondary ? <span className="erow__sec">{secondary}</span> : null}
      </span>
      {value ? <span className="erow__value">{value}</span> : null}
      {control ? <span className="erow__control">{control}</span> : null}
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button className={"ha-toggle" + (on ? " is-on" : "")} onClick={onClick} role="switch" aria-checked={on}>
      <span className="ha-toggle__thumb"></span>
    </button>
  );
}

/* ---------------- individual device cards ---------------- */
function DeviceInfoCard() {
  return (
    <section className="ha-card dcard">
      <div className="dcard__head"><h2 className="dcard__title">Device info</h2></div>
      <div className="dcard__body dinfo">
        <p className="dinfo__model">Home Assistant Connect Proxy<br></br>by Nabu Casa</p>
        <p className="dinfo__line">Firmware: 1.4.2 (ESPHome 2026.3.2)</p>
        <p className="dinfo__line">MAC: <a className="dinfo__mac" href="#" onClick={(e) => e.preventDefault()}>D8:3B:DA:A2:14:7C</a></p>
      </div>
      <div className="dinfo__links">
        <button className="dinfo__row">
          <BrandIcon domain="esphome" size={32} fallbackPath={ICONS.chip} tint="#18bcf2"></BrandIcon>
          <span className="dinfo__row-name">ESPHome</span>
          <Icon path={ICONS.chevronRight} size={22} color="#9b9b9b"></Icon>
        </button>
      </div>
      <div className="dinfo__action">
        <a className="linkbtn linkbtn--icon" href="#" onClick={(e) => e.preventDefault()}>
          <Icon path={ICONS.open} size={18} color="var(--primary-color)"></Icon>Visit device
        </a>
        <button className="icon-btn"><Icon path={D.dots} size={22} color="#5a5a5a"></Icon></button>
      </div>
    </section>
  );
}

function ControlsCard() {
  const [light, setLight] = React.useState(true);
  const [safe, setSafe] = React.useState(false);
  return (
    <Card title="Controls" footer={<DashLink></DashLink>}>
      <EntityRow icon={D.led} color={light ? "#ffc107" : "#44739e"} strike={!light} name="Status light"
        control={<Toggle on={light} onClick={() => setLight(!light)}></Toggle>}></EntityRow>
      <EntityRow icon={D.lockReset} color="#44739e" name="Safe mode"
        control={<Toggle on={safe} onClick={() => setSafe(!safe)}></Toggle>}></EntityRow>
    </Card>
  );
}

function SensorsCard() {
  return (
    <Card
      title="Sensors"
      footer={<DashLink></DashLink>}
    >
      <EntityRow icon={D.wifi} name="Wi-Fi signal" value="-54 dBm"></EntityRow>
      <EntityRow icon={D.clock} name="Uptime" value="3 d 4 h"></EntityRow>
      <a className="linkbtn linkbtn--inline" href="#" onClick={(e) => e.preventDefault()}>+1 disabled entity</a>
    </Card>
  );
}

function DiagnosticCard() {
  return (
    <Card title="Diagnostic" footer={<DashLink></DashLink>}>
      <EntityRow icon={D.lan} color="#44739e" name="Connection" value="Connected"></EntityRow>
      <EntityRow icon={ICONS.accessPoint} name="IP address" value="192.168.1.42"></EntityRow>
    </Card>
  );
}

function EventsCard() {
  return (
    <Card title="Events" footer={<DashLink></DashLink>}>
      <EntityRow icon={D.button} name="Button press" value="Unknown"></EntityRow>
    </Card>
  );
}

function RelatedCard() {
  return (
    <section className="ha-card dcard">
      <div className="dcard__head dcard__head--related">
        <h2 className="dcard__title">Related</h2>
        <button className="related__add"><Icon path={ICONS.plus} size={20} color="var(--primary-color)"></Icon>Add to…</button>
      </div>
      <div className="dcard__body">
        <p className="related__empty">No automations, scripts or scenes have been added using this device yet. You can add one by pressing the + button above.</p>
      </div>
    </section>
  );
}

function ActivityCard() {
  return (
    <section className="ha-card dcard dcard--activity">
      <div className="dcard__head"><h2 className="dcard__title">Activity</h2></div>
      <div className="dcard__body activity__body">
        <span className="activity__empty">No activity found.</span>
      </div>
    </section>
  );
}

/* ---------------- "Connect Proxy is ready" banner ---------------- */
function ProxyBanner({ statuses, onOpen, onDefer, deviceName }) {
  // "started" if any capability has been configured or is mid-flow
  // (beyond the default-ready Bluetooth proxy)
  const started = Object.entries(statuses).some(
    ([key, s]) => s === "in-progress" || (s === "completed" && key !== "bluetooth")
  );
  const title = started
    ? `Continue setup for ${deviceName}`
    : `Set up your ESPHome proxy`;
  return (
    <div className="ha-card proxy-banner">
      <div className="proxy-banner__main">
        <h2 className="proxy-banner__title">{title}</h2>
        <p className="proxy-banner__lead">This adapter unlocks four simultaneous capabilities in Home Assistant. Set them up now, or come back to this checklist any time.</p>
        <div className="entry-hero__actions">
          <Btn variant="filled" onClick={onOpen}>Set up</Btn>
          <Btn variant="text" onClick={onDefer}>Later</Btn>
        </div>
      </div>
      <div className="proxy-banner__pips">
        {ITEMS.map((i) => <CapabilityPip key={i.key} item={i} status={statuses[i.key]}></CapabilityPip>)}
      </div>
    </div>
  );
}

/* ---------------- deferred "finish setup" reminder strip ---------------- */
function ReminderStrip({ statuses, deviceName, onOpen }) {
  const left = ITEMS.filter((i) => statuses[i.key] !== "completed").length;
  const done = ITEMS.length - left;
  return (
    <Card
      title={left === 0 ? "Everything is set up" : `Set up ${left} more ${left === 1 ? "capability" : "capabilities"}`}
      className="review-card"
      footer={
        <a className="linkbtn" href="#" onClick={(e) => { e.preventDefault(); onOpen(); }}>Set up</a>
      }
    >
      <p className="review-card__lead">{left === 0 ? "All four simultaneous capabilities are configured." : "This adapter unlocks four simultaneous capabilities in Home Assistant."}</p>
    </Card>
  );
}

/* ---------------- masonry ---------------- */
// explicit column layouts so the result matches the HA device page at each width
const LAYOUTS = {
  3: [["deviceInfo", "related"], ["controls", "sensors", "events", "diagnostic"], ["activity"]],
  2: [["deviceInfo", "sensors", "diagnostic", "related"], ["controls", "events", "activity"]],
  1: [["deviceInfo", "controls", "sensors", "events", "diagnostic", "related", "activity"]],
};

function Masonry({ cards, forceCols, insertBefore }) {
  const ref = React.useRef(null);
  const [autoCols, setAutoCols] = React.useState(3);
  React.useEffect(() => {
    if (forceCols) return;
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setAutoCols(w >= 900 ? 3 : w >= 600 ? 2 : 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [forceCols]);
  const cols = forceCols || autoCols;
  const layout = LAYOUTS[cols];
  return (
    <div className="masonry" ref={ref} data-cols={cols}>
      {layout.map((colKeys, i) => (
        <div className="masonry__col" key={i}>
          {colKeys.map((k) => <React.Fragment key={k}>{insertBefore && insertBefore[k] ? insertBefore[k] : null}{cards[k]}</React.Fragment>)}
        </div>
      ))}
    </div>
  );
}

/* ---------------- integration header logo ---------------- */
function IntegrationLogo() {
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return (
      <div className="esphome-lockup">
        <BrandIcon domain="esphome" size={34} fallbackPath={ICONS.chip} tint="#18bcf2"></BrandIcon>
        <span className="esphome-lockup__name">ESPHome</span>
      </div>
    );
  }
  return (
    <img className="integration-logo" src="https://brands.home-assistant.io/esphome/logo.png" alt="ESPHome" onError={() => setFailed(true)}></img>
  );
}

/* ---------------- app ---------------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "detection": "zbt",
  "speaker": "plugged",
  "musicAssistant": "not-setup",
  "setupCard": "full",
  "viewport": "fit"
}/*EDITMODE-END*/;

// Device widths used by the "Viewport" tweak to preview the responsive shell.
const VP_SIZES = { desktop: 1280, tablet: 820, mobile: 390 };
const VP_LABELS = { desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" };
// Column counts the masonry should use at each framed width (media queries /
// ResizeObserver key off the real browser window, so we drive these explicitly).
const VP_COLS = { desktop: 3, tablet: 2, mobile: 1 };

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const { statuses, complete, dismiss, undismiss, reset, adapter } = useProxyWizard({
    detection: t.detection,
    speaker: t.speaker,
    maSetup: t.musicAssistant === "setup",
  });
  const [open, setOpen] = React.useState(false);
  const deferred = t.setupCard === "compact";
  const setDefer = (v) => setTweak("setupCard", v ? "compact" : "full");
  const vp = t.viewport || "fit";
  const constrained = vp !== "fit";

  const cards = {
    deviceInfo: <DeviceInfoCard></DeviceInfoCard>,
    controls: <ControlsCard></ControlsCard>,
    sensors: <SensorsCard></SensorsCard>,
    diagnostic: <DiagnosticCard></DiagnosticCard>,
    events: <EventsCard></EventsCard>,
    related: <RelatedCard></RelatedCard>,
    activity: <ActivityCard></ActivityCard>,
  };

  return (
    <React.Fragment>
    <div className={"vp-stage" + (constrained ? " is-constrained" : "")}>
    <div className="ha-app" data-vp={vp} style={constrained ? { width: VP_SIZES[vp] } : undefined}>
      <Sidebar></Sidebar>
      <div className="main">
        <header className="appbar">
          <button className="icon-btn"><Icon path={ICONS.arrowLeft} size={24} color="#212121"></Icon></button>
          <h1 className="appbar__title">Connect Proxy</h1>
          <div className="appbar__spacer"></div>
          <button className="icon-btn"><Icon path={D.pencil} size={22} color="#5a5a5a"></Icon></button>
          <button className="icon-btn"><Icon path={D.dots} size={22} color="#5a5a5a"></Icon></button>
        </header>

        <div className="content">
          <div className="content-inner">
            <div className="content-head">
              <a className="area-link" href="#" onClick={(e) => e.preventDefault()}>In Kantoor</a>
              <IntegrationLogo></IntegrationLogo>
            </div>

            {deferred
              ? null
              : <ProxyBanner statuses={statuses} deviceName="Connect Proxy" onOpen={() => setOpen(true)} onDefer={() => setDefer(true)}></ProxyBanner>}

            <Masonry
              cards={cards}
              forceCols={constrained ? VP_COLS[vp] : undefined}
              insertBefore={deferred ? { controls: <ReminderStrip statuses={statuses} deviceName="Connect Proxy" onOpen={() => setOpen(true)}></ReminderStrip> } : undefined}
            ></Masonry>
          </div>
        </div>
      </div>
    </div>
    {constrained ? <div className="vp-badge">{VP_LABELS[vp]} · {VP_SIZES[vp]}px</div> : null}
    </div>

      {open ? (
        <WizardDialog
          statuses={statuses}
          adapter={adapter}
          speaker={t.speaker}
          maSetup={t.musicAssistant === "setup"}
          onClose={() => setOpen(false)}
          onComplete={complete}
          onDismiss={dismiss}
          onUndismiss={undismiss}
        ></WizardDialog>
      ) : null}

      <window.TweaksPanel>
        <window.TweakSection label="Viewport"></window.TweakSection>
        <window.TweakRadio
          label=""
          value={vp}
          options={[{ value: "fit", label: "Fit" }, { value: "desktop", label: "Desktop" }, { value: "tablet", label: "Tablet" }, { value: "mobile", label: "Mobile" }]}
          onChange={(v) => setTweak("viewport", v)}
        ></window.TweakRadio>
        <window.TweakSection label="Setup card"></window.TweakSection>
        <window.TweakRadio
          label=""
          value={t.setupCard}
          options={[{ value: "full", label: "Full banner" }, { value: "compact", label: "Compact card" }]}
          onChange={(v) => setTweak("setupCard", v)}
        ></window.TweakRadio>
        <window.TweakSection label="Plugged in adapter"></window.TweakSection>
        <window.TweakRadio
          label=""
          value={t.detection}
          options={[{ value: "zbt", label: "ZBT-2" }, { value: "zwa", label: "ZWA-2" }, { value: "none", label: "None" }]}
          onChange={(v) => setTweak("detection", v)}
        ></window.TweakRadio>
        <window.TweakSection label="Speaker"></window.TweakSection>
        <window.TweakRadio
          label=""
          value={t.speaker}
          options={[{ value: "plugged", label: "Plugged in" }, { value: "none", label: "Not plugged in" }]}
          onChange={(v) => setTweak("speaker", v)}
        ></window.TweakRadio>
        <window.TweakSection label="Music Assistant"></window.TweakSection>
        <window.TweakRadio
          label=""
          value={t.musicAssistant}
          options={[{ value: "setup", label: "Set up" }, { value: "not-setup", label: "Not set up" }]}
          onChange={(v) => setTweak("musicAssistant", v)}
        ></window.TweakRadio>
        <window.TweakButton label="Reset progress" onClick={reset}></window.TweakButton>
      </window.TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App></App>);
