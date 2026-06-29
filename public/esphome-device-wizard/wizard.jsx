// wizard.jsx — shared Connect Proxy wizard pieces (entry card, dialog, status logic).
// Used by BOTH the standalone wizard (app.jsx) and the Connect Proxy device page (device.jsx).
// Exported to window — no auto-render here.

const { Icon, ICONS, Btn, FLOWS, ACCENT, BrandIcon } = window;

/* ---------------- checklist item metadata ---------------- */
const ITEMS = [
{
  key: "bluetooth",
  icon: ICONS.bluetooth,
  accent: ACCENT.bluetooth,
  toggle: true,
  title: "Bluetooth proxy",
  short: "Extend Bluetooth range",
  desc: "Relay nearby Bluetooth devices to Home Assistant, extending coverage into this part of your home.",
  long: "Your Proxy listens for nearby Bluetooth advertisements and forwards them to Home Assistant over your network, with no extra dongle on your server, and no cables to run. Place the Proxy wherever coverage is thin and it fills the gap.",
  features: [
  { icon: ICONS.accessPoint, title: "Reach further into your home", desc: "Pick up thermometers, plant sensors and trackers that sit too far from your main hub." },
  { icon: ICONS.bluetooth, title: "Automatic discovery", desc: "Supported devices within range of the Proxy appear in Home Assistant on their own." }]

},
{
  key: "audio",
  icon: ICONS.music,
  accent: ACCENT.audio,
  title: "Stream audio",
  short: "Multi-room sound, recommended with Music Assistant",
  desc: "The speaker on your Proxy works as a Home Assistant media player out of the box. Music Assistant turns it into a synchronized, multi-room system: lossless, with album art.",
  long: "Music Assistant is a free media library manager that turns the speaker on your Proxy into part of a synchronized, multi-room sound system inside Home Assistant, keeping built-in playback while adding lossless audio and rich controls.",
  features: [
  { icon: ICONS.accessPoint, title: "Synchronized multi-room", desc: "Play one song across every speaker in your home, locked to the same beat." },
  { icon: ICONS.music, title: "Lossless, high-resolution audio", desc: "Stream Spotify, your local library and dozens of other sources in full quality." },
  { icon: ICONS.open, title: "Album art on every screen", desc: "Cover art and playback controls show up on your dashboards and displays." }]

},
{
  key: "connectivity",
  icon: ICONS.accessPoint,
  accent: ACCENT.connectivity,
  title: "Extend connectivity",
  short: "Zigbee & Z-Wave via Connect Line",
  desc: "Plug a Connect ZBT-2 or ZWA-2 into your Proxy to add Zigbee, Thread and Z-Wave radios to Home Assistant.",
  long: "Plug a Home Assistant Connect ZBT-2 or ZWA-2 into your Proxy's USB port to add wireless radios, with no separate coordinator and no need to run anything near your server. The Proxy becomes the coordinator for that network.",
  features: [
  { icon: ICONS.accessPoint, title: "Zigbee & Thread", desc: "Connect ZBT-2 adds both radios in a single adapter." },
  { icon: ICONS.usb, title: "Z-Wave", desc: "Connect ZWA-2 brings a dedicated Z-Wave coordinator." }]

},
{
  key: "serial",
  icon: ICONS.swap,
  accent: ACCENT.serial,
  title: "Control a device over serial",
  short: "AV receivers, amplifiers and more",
  desc: "Proxy a serial connection so Home Assistant can control devices like A/V receivers and multi-zone amplifiers.",
  long: "Bridge an RS-232 serial connection over your network so Home Assistant can control gear like A/V receivers and multi-zone amplifiers; the serial link lives at the Proxy, right next to your equipment.",
  features: [
  { icon: ICONS.swap, title: "No server-side cabling", desc: "The serial connection stays at the Proxy, wherever your hardware sits." },
  { icon: ICONS.open, title: "Dozens of integrations", desc: "Anthem, Monoprice, Russound, Pioneer and many more A/V brands." }]

}];


const STATUS_META = {
  completed: { label: "Done", tone: "success" },
  detected: null,
  active: null,
  "in-progress": { label: "In progress", tone: "warning" },
  dismissed: { label: "Ignored", tone: "neutral" },
  "not-started": null
};

function StatusBadge({ status, plain }) {
  if (status === "completed") {
    return <span className="done-check"><Icon path={ICONS.check} size={16} color="#fff"></Icon></span>;
  }
  if (status === "active") {
    return <span className="done-check done-check--warn"><Icon path={ICONS.check} size={16} color="#fff"></Icon></span>;
  }
  const m = STATUS_META[status];
  if (!m) return null;
  if (plain) return <span className="status-text">{m.label}</span>;
  return <span className={"chip chip--" + m.tone}>{m.label}</span>;
}

/* ---------------- shared bits used by both the accordion and the detail page ---------------- */
function ctaLabelFor(item, status, adapter) {
  if (item.key === "audio") {
    if (status === "completed") return "Configure";
    if (status === "active") return "Install Music Assistant";
    return "Set up";
  }
  if (status === "completed") return "Configure";
  if (status === "in-progress") return "Continue setup";
  if (status === "detected") return adapter === "zwa" ? "Set up Z-Wave" : "Set up Zigbee";
  if (status === "dismissed") return "Set up anyway";
  return "Set up";
}

function AudioPlayers({ status, onAction, compact }) {
  const installed = status === "completed";
  const benefits = [
  "Synchronized multi-room playback",
  "Lossless, high-resolution audio",
  "Album art on every screen"];

  return (
    <div className="audio-players">
      <div className="audio-player">
        <span className="audio-player__icon">
          <img src="ds/assets/home-assistant-logomark-color-on-light.svg" width="28" height="28" alt="" style={{ display: "block" }}></img>
        </span>
        <span className="audio-player__text">
          <span className="audio-player__name">Home Assistant</span>
          <span className="audio-player__meta">Built-in playback</span>
        </span>
        <span className="audio-player__end">
          <span className="chip chip--neutral">Active</span>
        </span>
      </div>

      {installed ?
      <div className="audio-player">
          <span className="audio-player__icon">
            <BrandIcon domain="music_assistant" size={28} fallbackPath={ICONS.music} tint={ACCENT.audio}></BrandIcon>
          </span>
          <span className="audio-player__text">
            <span className="audio-player__name">Music Assistant</span>
            <span className="audio-player__meta">Synchronized multi-room audio</span>
          </span>
          <span className="audio-player__end">
            <span className="chip chip--neutral">Active</span>
          </span>
        </div> :

      <div className="ma-upsell">
          <div className="ma-upsell__head">
            <span className="audio-player__icon">
              <BrandIcon domain="music_assistant" size={28} fallbackPath={ICONS.music} tint={ACCENT.audio}></BrandIcon>
            </span>
            <span className="ma-upsell__title-wrap">
              <span className="ma-upsell__name">Music Assistant</span>
              <span className="audio-player__meta">The better way to stream with a free app</span>
            </span>
            <span className="audio-player__end"><span className="chip chip--recommend">Recommended</span></span>
          </div>
          {compact ? null :
        <div className="ma-upsell__benefits">
              {benefits.map((b) =>
          <div className="ma-benefit" key={b}>
                  <Icon path={ICONS.check} size={16} color={ACCENT.audio}></Icon>
                  <span>{b}</span>
                </div>
          )}
            </div>
        }
          <Btn variant="filled" onClick={() => onAction("flow")}>Install Music Assistant</Btn>
        </div>
      }
    </div>);

}

function ItemActions({ item, status, adapter, blocked, dismissed, onAction }) {
  if (blocked) {
    return (
      <Btn variant="text" onClick={() => onAction("flow")}>
        {item.key === "connectivity" ? "What are these adapters?" : "Learn more"}
      </Btn>);

  }
  if (dismissed) {
    return <Btn variant="outlined" onClick={() => onAction("undismiss")}>Stop ignoring</Btn>;
  }
  if (item.toggle) {
    return status === "completed" ?
    <Btn variant="text" onClick={() => onAction("turnoff")}>Turn off</Btn> :
    <Btn variant="filled" onClick={() => onAction("turnon")}>Turn on</Btn>;
  }
  return (
    <Btn variant={status === "completed" ? "outlined" : "filled"} onClick={() => onAction("flow")}>
      {ctaLabelFor(item, status, adapter)}
    </Btn>);

}

function FeatureList({ item }) {
  if (!item.features) return null;
  return (
    <div className="flow-feature-list">
      {item.features.map((f) =>
      <div className="flow-feature" key={f.title}>
          <span className="flow-feature__icon" style={{ background: item.accent + "1f" }}>
            <Icon path={f.icon} size={20} color={item.accent}></Icon>
          </span>
          <span>
            <div className="flow-feature__title">{f.title}</div>
            <div className="flow-feature__desc">{f.desc}</div>
          </span>
        </div>
      )}
    </div>);

}

/* ---------------- checklist accordion row ---------------- */
function ChecklistRow({ item, status, open, onToggle, onAction, adapter, blocked, blockedHint }) {
  const dismissed = status === "dismissed";
  return (
    <div className={"checkitem" + (open ? " is-open" : "") + (dismissed ? " is-dismissed" : "")}>
      <button className="checkitem__head" onClick={onToggle}>
        <span className="icon-chip" style={{ background: item.accent + "1f" }}>
          <Icon path={item.icon} size={22} color={item.accent}></Icon>
        </span>
        <span className="checkitem__text">
          <span className="checkitem__title">{item.title}</span>
          <span className="checkitem__short">{item.short}</span>
        </span>
        <span className="checkitem__right">
          <StatusBadge status={status} plain></StatusBadge>
          <Icon path={ICONS.chevronDown} size={22} color="#727272" style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }}></Icon>
        </span>
      </button>
      <div className="checkitem__body" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="checkitem__body-inner">
          <p className="checkitem__desc">{item.desc}</p>
          {item.key === "audio" && !blocked ?
          <AudioPlayers status={status} onAction={onAction}></AudioPlayers> :

          <div className="checkitem__actions">
              <ItemActions item={item} status={status} adapter={adapter} blocked={blocked} dismissed={dismissed} onAction={onAction}></ItemActions>
            </div>
          }
        </div>
      </div>
    </div>);

}

/* ---------------- wizard dialog ---------------- */
function WizardDialog({ statuses, adapter, speaker, maSetup, onClose, onComplete, onDismiss, onUndismiss }) {
  const [openKey, setOpenKey] = React.useState(null);
  const [flowKey, setFlowKey] = React.useState(null);
  const [stepIdx, setStepIdx] = React.useState(0);
  const [flowData, setFlowData] = React.useState({});

  const flow = flowKey ? FLOWS[flowKey] : null;
  const step = flow ? flow.steps[stepIdx] : null;

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {document.body.style.overflow = prev;};
  }, []);

  React.useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  React.useEffect(() => {
    if (step && step.auto) {
      const t = setTimeout(() => setStepIdx((i) => i + 1), step.autoDelay || 1500);
      return () => clearTimeout(t);
    }
  }, [flowKey, stepIdx]);

  function startFlow(key) {
    const init = { ...(FLOWS[key].initial || {}) };
    if (key === "connectivity") init.adapter = adapter;
    if (key === "audio") {init.maSetup = maSetup;init.speaker = speaker;init.path = "ma";}
    setFlowData(init);
    setFlowKey(key);
    setStepIdx(FLOWS[key].startStep ? FLOWS[key].startStep(init) : 0);
  }
  function setData(patch) {setFlowData((d) => ({ ...d, ...patch }));}
  function exitFlow() {setFlowKey(null);setStepIdx(0);}
  function next() {
    if (step.final) {
      if (!(step.skipComplete && step.skipComplete(flowData))) onComplete(flowKey);
      exitFlow();return;
    }
    setStepIdx((i) => i + 1);
  }

  function rowAction(key, action) {
    if (action === "flow") startFlow(key);else
    if (action === "turnon") onComplete(key);else
    if (action === "turnoff") onUndismiss(key);else
    if (action === "dismiss") onDismiss(key);else
    if (action === "undismiss") onUndismiss(key);else
    if (action === "learn") window.open("https://www.home-assistant.io/", "_blank");
  }

  const inFlow = !!flow;

  const blockInfo = (item) => {
    const blocked = item.key === "audio" && speaker === "none" || item.key === "connectivity" && adapter === "none";
    const blockedHint = item.key === "audio" ?
    "Plug a speaker into your Proxy's audio output before you can set this up." :
    "Plug a Connect ZBT-2 or ZWA-2 into your Proxy's USB port before you can set this up.";
    return { blocked, blockedHint };
  };

  const onBack = inFlow ? exitFlow : onClose;
  const backIsClose = !inFlow;
  const headerTitle = inFlow ?
  (typeof step.title === "function" ? step.title(flowData) : step.title) || flow.title :
  "Set up your ESPHome proxy";

  return (
    <div className="scrim" onMouseDown={(e) => {if (e.target === e.currentTarget) onClose();}}>
      <div className="dialog" role="dialog" aria-modal="true">
        <header className="dialog__head">
          <button className="icon-btn" onClick={onBack} aria-label={backIsClose ? "Close" : "Back"}>
            <Icon path={backIsClose ? ICONS.close : ICONS.arrowLeft} size={24} color="#212121"></Icon>
          </button>
          <h2 className="dialog__title">{headerTitle}</h2>
        </header>

        <div className="dialog__body">
          {inFlow ?
          <div className="flow-body" key={flowKey + ":" + stepIdx}>
              {step.body(flowData, setData, next)}
            </div> :

          <React.Fragment>
              <p className="dialog__intro">Your Proxy can do four things. Set them up whenever you like, at your own pace, and come back here any time. Your progress is saved.</p>
              <div className="checklist">
                {ITEMS.map((item) => {
                const { blocked, blockedHint } = blockInfo(item);
                return (
                  <ChecklistRow
                    key={item.key}
                    item={item}
                    status={statuses[item.key]}
                    adapter={adapter}
                    blocked={blocked}
                    blockedHint={blockedHint}
                    open={openKey === item.key}
                    onToggle={() => setOpenKey(openKey === item.key ? null : item.key)}
                    onAction={(a) => rowAction(item.key, a)}>
                  </ChecklistRow>);

              })}
              </div>
            </React.Fragment>
          }
        </div>

        {inFlow ?
        step.auto || (typeof step.hideFooter === "function" ? step.hideFooter(flowData) : step.hideFooter) ? null :
        <footer className="dialog__foot">
              <Btn variant="filled" onClick={next} disabled={step.canContinue ? !step.canContinue(flowData) : false}>
                {typeof step.primary === "function" ? step.primary(flowData) : step.primary}
              </Btn>
            </footer> :

        null}
      </div>
    </div>);

}

/* ---------------- capability pip (shared between hero + banner) ---------------- */
function CapabilityPip({ item, status }) {
  return (
    <div className={"pip" + (status === "completed" ? " is-done" : "")}>
      <span className="pip__chip" style={{ background: item.accent + "1f" }}>
        <Icon path={item.icon} size={18} color={item.accent}></Icon>
        {status === "completed" ? <span className="pip__check"><Icon path={ICONS.check} size={11} color="#fff"></Icon></span> : null}
      </span>
      <span className="pip__label">{item.title}</span>
    </div>);

}

/* ---------------- standalone entry card (used by the wizard page) ---------------- */
function EntryCard({ statuses, onOpen }) {
  return (
    <div className="ha-card entry entry--hero">
      <div className="entry-hero__brand">
        <img src="ds/assets/home-assistant-logomark-color-on-light.svg" alt="" width="34" height="34"></img>
        <span className="entry-hero__kicker">Nabu Casa Connect Proxy</span>
      </div>
      <h2 className="entry-hero__title">Your Connect Proxy is ready</h2>
      <p className="entry-hero__lead">This adapter unlocks four capabilities in Home Assistant. Set them up now, or come back to this checklist any time.</p>
      <div className="entry-hero__pips">
        {ITEMS.map((i) => <CapabilityPip key={i.key} item={i} status={statuses[i.key]}></CapabilityPip>)}
      </div>
      <div className="entry-hero__actions">
        <Btn variant="filled" onClick={onOpen}>Start setup</Btn>
        <Btn variant="text" onClick={onOpen}>Review later</Btn>
      </div>
    </div>);

}

/* ---------------- shared status state hook ---------------- */
const audioBase = (speaker, maSetup) => speaker === "none" ? "not-started" : maSetup ? "completed" : "active";
const connBase = (adapter) => adapter === "none" ? "not-started" : "detected";

function useProxyWizard({ detection, speaker, maSetup }) {
  const makeBase = () => ({
    audio: audioBase(speaker, maSetup),
    connectivity: connBase(detection),
    serial: "not-started",
    bluetooth: "completed"
  });
  const [statuses, setStatuses] = React.useState(makeBase);

  React.useEffect(() => {
    setStatuses((s) => {
      const next = { ...s };
      if (s.connectivity !== "completed" && s.connectivity !== "dismissed") next.connectivity = connBase(detection);
      // Speaker presence + Music Assistant drive the audio state; preserve only a user "dismissed".
      if (s.audio !== "dismissed") next.audio = audioBase(speaker, maSetup);
      return next;
    });
  }, [detection, speaker, maSetup]);

  const complete = (key) => setStatuses((s) => ({ ...s, [key]: "completed" }));
  const dismiss = (key) => setStatuses((s) => ({ ...s, [key]: "dismissed" }));
  const undismiss = (key) =>
  setStatuses((s) => ({
    ...s,
    [key]:
    key === "connectivity" ? connBase(detection) :
    key === "audio" ? audioBase(speaker, maSetup) :
    "not-started"
  }));
  const reset = () => setStatuses(makeBase());

  return { statuses, complete, dismiss, undismiss, reset, adapter: detection };
}

Object.assign(window, {
  ITEMS, STATUS_META, StatusBadge, ChecklistRow,
  AudioPlayers, ItemActions, FeatureList, WizardDialog, CapabilityPip, EntryCard, useProxyWizard
});