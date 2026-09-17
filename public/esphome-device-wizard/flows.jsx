// flows.jsx — the four config sub-flows (data) + presentational helpers.
// Navigation (step index, back/next) is driven by the WizardDialog in app.jsx;
// these are declarative step definitions plus small shared UI bits.

const { Icon, ICONS, Btn, BrandIcon } = window;

/* ---------- shared field bits ---------- */
function RadioList({ items, value, onChange }) {
  return (
    <div className="radio-list">
      {items.map((it) => {
        const active = value === it.id;
        return (
          <button
            key={it.id}
            className={"radio-item" + (active ? " is-active" : "") + (it.disabled ? " is-disabled" : "")}
            onClick={() => !it.disabled && onChange(it.id)}
            disabled={it.disabled}
          >
            <span className={"radio-dot" + (active ? " is-active" : "")}></span>
            {it.icon ? <span className="radio-icon">{it.icon}</span> : null}
            <span className="radio-text">
              <span className="radio-label">{it.label}</span>
              {it.meta ? <span className="radio-meta">{it.meta}</span> : null}
            </span>
            {it.tag ? <span className={"chip chip--" + (it.tagTone || "neutral")}>{it.tag}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono, readOnly, hint }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className={"field__input" + (mono ? " field__input--mono" : "") + (readOnly ? " is-readonly" : "")}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <div className="select-wrap">
        <select className="field__input" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon path={ICONS.chevronDown} size={20} color="#5a5a5a" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}></Icon>
      </div>
    </label>
  );
}

function FlowIntro({ accent, icon, kicker, title, children }) {
  return (
    <div className="flow-intro">
      <div className="flow-hero-chip" style={{ background: accent + "1f" }}>
        <Icon path={icon} size={30} color={accent}></Icon>
      </div>
      {kicker ? <div className="chip chip--info" style={{ marginBottom: 4 }}>{kicker}</div> : null}
      <h3 className="flow-title">{title}</h3>
      <div className="flow-copy">{children}</div>
    </div>
  );
}

function Working({ accent, label }) {
  return (
    <div className="flow-working">
      <div className="spinner" style={{ borderTopColor: "var(--primary-color)" }}></div>
      <div className="flow-working__label">{label}</div>
    </div>
  );
}

function SuccessStep({ title, children }) {
  return (
    <div className="flow-intro flow-success">
      <div className="success-mark">
        <Icon path={ICONS.check} size={34} color="#fff"></Icon>
      </div>
      <h3 className="flow-title">{title}</h3>
      <div className="flow-copy">{children}</div>
    </div>
  );
}

/* ---------- the four flows ---------- */
// accent colors per use case
const ACCENT = {
  audio: "#53c22b",
  connectivity: "#00acc1",
  serial: "#8353d1",
  bluetooth: "#2962ff",
};

const FLOWS = {
  /* 1 · SENDSPIN AUDIO STREAMING ------------------------------------------- */
  // One CTA opens this stepped flow. It first ensures Music Assistant is
  // installed (Sendspin builds on it), enables the Sendspin entity, then offers
  // guest mode. Enabling toggles the matching entities on the device page.
  audio: {
    title: "Sendspin",
    accent: ACCENT.audio,
    icon: ICONS.music,
    initial: {},
    // Install Music Assistant first when it isn't set up. Only jump straight to
    // the PIN step when everything's already configured (MA installed + Sendspin on).
    startStep: (d) => (d.speaker === "none" || !d.maSetup ? 0 : d.sendspin ? 3 : 2),
    steps: [
      // 0 — Music Assistant explainer + install (skipped when already installed)
      {
        title: "Enhance your music experience",
        body: (d) => {
          if (d.speaker === "none") {
            return (
              <FlowIntro accent={ACCENT.audio} icon={ICONS.music} title="Connect a speaker first">
                <p>Plug a speaker or amplifier into your Proxy's audio output. Once it's connected, you can enable Sendspin to stream to it.</p>
                <p className="flow-copy--sm" style={{ color: "#727272" }}>No speaker detected yet. Connect one and it'll appear here.</p>
              </FlowIntro>
            );
          }
          const benefits = [
            "Synchronized multi-room playback",
            "Lossless, high-resolution audio",
            "Album art on every screen",
          ];
          return (
            <div className="flow-form">
              <div className="ma-flat__head">
                <span className="audio-player__icon">
                  <BrandIcon domain="music_assistant" size={32} fallbackPath={ICONS.music} tint={ACCENT.audio}></BrandIcon>
                </span>
                <span className="ma-upsell__text">
                  <span className="ma-upsell__name">Music Assistant</span>
                  <span className="ma-upsell__by">By the Open Home Foundation</span>
                </span>
              </div>
              <p className="flow-copy--sm" style={{ margin: 0, color: "#727272" }}>Music&nbsp;Assistant is a free media library manager that turns the speaker on your Proxy into a synchronized, multi-room player. Sendspin streams through it.</p>
              <div className="ma-upsell__benefits">
                {benefits.map((b) => (
                  <div className="ma-benefit" key={b}>
                    <Icon path={ICONS.check} size={16} color={ACCENT.audio}></Icon>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        },
        primary: "Install Music Assistant",
        canContinue: (d) => d.speaker !== "none",
        skip: (d) => (d.speaker === "none" ? null : { label: "Skip for now", to: 2 }),
      },
      // 1 — installing Music Assistant
      { auto: true, body: () => <Working accent={ACCENT.audio} label="Installing Music Assistant" /> },
      // 2 — enabling Sendspin (runs after Music Assistant is ready)
      { auto: true, onEnter: (d, c) => c.setSendspin(true), body: () => <Working accent={ACCENT.audio} label="Enabling Sendspin" /> },
      // 3 — access protection: require a PIN to play (final)
      {
        title: "Protect this speaker",
        body: (d, set) => (
          <div className="flow-form">
            <FlowIntro accent={ACCENT.audio} icon={ICONS.shield} title="Require a PIN to play audio">
              <p>Anyone on your network can stream to this speaker. Require a PIN so only people you share it with can play audio here.</p>
            </FlowIntro>
            <button className="flow-toggle" onClick={() => set({ pin: !d.pin })} role="switch" aria-checked={!!d.pin}>
              <span className="flow-toggle__text">
                <span className="flow-toggle__label">Require a PIN to play</span>
                <span className="flow-toggle__meta">Guests enter a code before they can stream</span>
              </span>
              <span className={"ha-toggle" + (d.pin ? " is-on" : "")}><span className="ha-toggle__thumb"></span></span>
            </button>
          </div>
        ),
        primary: "Finish",
        // Requiring a PIN means guest mode (open access) is off.
        onNext: (d, c) => { c.setGuest(!d.pin); },
        final: true,
      },
    ],
  },

  /* 2 · EXTEND CONNECTIVITY (Connect Line: ZBT-2 / ZWA-2) ------------------- */
  connectivity: {
    title: "Connect a Zigbee or Z-Wave adapter",
    accent: ACCENT.connectivity,
    icon: ICONS.accessPoint,
    initial: { network: "new" },
    // When an adapter is already detected, skip the intro and go straight to network setup.
    startStep: (d) => (d.adapter === "none" ? 0 : 1),
    steps: [
      {
        title: "Add Zigbee, Thread or Z-Wave",
        hideFooter: true,
        body: (d) => {
          const opts = [
            { name: "Connect ZBT-2", desc: "Adds Zigbee and Thread radios.", url: "https://www.home-assistant.io/connectzbt1/" },
            { name: "Connect ZWA-2", desc: "Adds a Z-Wave radio.", url: "https://www.home-assistant.io/connectzwa2/" },
          ];
          return (
            <div className="flow-form">
              <div className="flow-copy">
                <p>Plug a Home Assistant Connect adapter into your Proxy's USB port to add wireless radios:</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {opts.map((o) => (
                  <div key={o.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span className="icon-chip" style={{ background: ACCENT.connectivity + "1f" }}>
                      <Icon path={ICONS.accessPoint} size={22} color={ACCENT.connectivity}></Icon>
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 15, fontWeight: 500, color: "var(--primary-text-color)" }}>{o.name}</span>
                      <span className="flow-copy--sm" style={{ color: "#727272" }}>{o.desc}</span>
                    </span>
                    <span style={{ marginLeft: "auto", flex: "none" }}>
                      <Btn variant="text" onClick={() => window.open(o.url, "_blank", "noopener")}>Learn more</Btn>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },
      {
        title: (d) => (d.adapter === "zwa" ? "Set up Z-Wave" : "Set up Zigbee"),
        body: (d, set) => {
          const zwave = d.adapter === "zwa";
          return (
            <div className="flow-form">
              <RadioList
                value={d.network}
                onChange={(v) => set({ network: v })}
                items={[
                  { id: "new", label: "Create a new network", meta: "Recommended", tag: "Recommended", tagTone: "success" },
                  { id: "migrate", label: "Migrate an existing radio", meta: "Not available yet", disabled: true },
                ]}
              />
              <div className="flow-note">
                <Icon path={ICONS.info} size={18} color="#5a5a5a"></Icon>
                <span>Migrating an existing {zwave ? "Z-Wave" : "Zigbee"} radio onto the Proxy isn't supported yet. You'll set up a fresh network and re-add devices.</span>
              </div>
            </div>
          );
        },
        primary: "Create network",
      },
      { auto: true, autoDelay: 2000, body: (d) => <Working accent={ACCENT.connectivity} label={(d.adapter === "zwa" ? "Forming Z-Wave network" : "Forming Zigbee network")} /> },
      {
        body: (d) => {
          const zwave = d.adapter === "zwa";
          return (
            <SuccessStep title={zwave ? "Z-Wave is ready" : "Zigbee is ready"}>
              <p>Your Proxy is now acting as the {zwave ? "Z-Wave" : "Zigbee"} coordinator. Add devices from Settings → Devices &amp; services whenever you're ready.</p>
            </SuccessStep>
          );
        },
        primary: "Done",
        final: true,
      },
    ],
  },

  /* 3 · CONTROL DEVICES OVER SERIAL ---------------------------------------- */
  serial: {
    title: "Control a device over serial",
    accent: ACCENT.serial,
    icon: ICONS.swap,
    initial: { query: "", integration: null, baud: "9600" },
    steps: [
      {
        hideFooter: true,
        title: "Choose an integration",
        body: (d, set, next) => {
          const all = [
            { id: "anthemav", name: "Anthem A/V Receivers", domain: "anthemav" },
            { id: "monoprice", name: "Monoprice 6-Zone Amplifier", domain: "monoprice" },
            { id: "russound", name: "Russound", domain: "russound_rio" },
            { id: "pioneer", name: "Pioneer AVR", domain: "pioneer" },
            { id: "acer", name: "Acer / generic projector", domain: "acer_projector" },
            { id: "elkm1", name: "Elk-M1 Control", domain: "elkm1" },
          ];
          const q = d.query.trim().toLowerCase();
          const list = q ? all.filter((i) => i.name.toLowerCase().includes(q)) : all;
          const choose = (i) => { set({ integration: i.id, integrationName: i.name, domain: i.domain }); next(); };
          return (
            <div className="flow-form">
              <div className="search-field">
                <Icon path={ICONS.magnify} size={22} color="#5a5a5a"></Icon>
                <input className="search-field__input" value={d.query} placeholder="Search for a brand name" onChange={(e) => set({ query: e.target.value })} />
              </div>
              <div className="picker-list">
                {list.map((i) => (
                  <button key={i.id} className="picker-item" onClick={() => choose(i)}>
                    <span className="picker-icon"><BrandIcon domain={i.domain} size={40} fallbackPath={ICONS.swap} tint={ACCENT.serial} /></span>
                    <span className="picker-name">{i.name}</span>
                    <Icon path={ICONS.chevronRight} size={22} color="#bdbdbd"></Icon>
                  </button>
                ))}
                {list.length === 0 ? <div className="picker-empty">No matching integrations.</div> : null}
              </div>
            </div>
          );
        },
      },
      {
        body: (d, set) => (
          <div className="flow-form">
            <div className="flow-config-head">
              <BrandIcon domain={d.domain} size={40} fallbackPath={ICONS.swap} tint={ACCENT.serial} />
              <div>
                <h3 className="flow-title flow-title--sm" style={{ margin: 0 }}>Configure {d.integrationName}</h3>
                <p className="flow-copy flow-copy--sm" style={{ margin: 0 }}>Connecting over your Proxy's serial bridge.</p>
              </div>
            </div>
            <Field label="Serial connection" value="socket://connect-proxy.local:6638" readOnly mono hint="Provided by your Connect Proxy, no cable address needed." />
            <SelectField
              label="Baud rate"
              value={d.baud}
              onChange={(v) => set({ baud: v })}
              options={[
                { value: "9600", label: "9600" },
                { value: "19200", label: "19200" },
                { value: "38400", label: "38400" },
                { value: "115200", label: "115200" },
              ]}
            />
          </div>
        ),
        primary: "Submit",
      },
      { auto: true, body: () => <Working accent={ACCENT.serial} label="Connecting over serial" /> },
      {
        body: (d) => (
          <SuccessStep title={`${d.integrationName} added`}>
            <p>Home Assistant now controls {d.integrationName} over your Proxy. Its entities are available on the device page.</p>
          </SuccessStep>
        ),
        primary: "Done",
        final: true,
      },
    ],
  },

  /* 4 · BLUETOOTH PROXY ----------------------------------------------------- */
  bluetooth: {
    title: "Use as a Bluetooth proxy",
    accent: ACCENT.bluetooth,
    icon: ICONS.bluetooth,
    initial: {},
    steps: [
      {
        body: () => (
          <FlowIntro accent={ACCENT.bluetooth} icon={ICONS.bluetooth} title="Use your Proxy as a Bluetooth proxy">
            <p>Relay nearby Bluetooth devices to Home Assistant, extending Bluetooth range into this part of your home.</p>
            <p className="flow-copy--sm" style={{ color: "#727272" }}>Devices like thermometers, plant sensors and trackers within range of the Proxy become available automatically.</p>
          </FlowIntro>
        ),
        primary: "Enable",
      },
      { auto: true, body: () => <Working accent={ACCENT.bluetooth} label="Enabling Bluetooth proxy" /> },
      {
        body: () => (
          <SuccessStep title="Bluetooth proxy enabled">
            <p>Your Proxy will now relay nearby Bluetooth devices. New devices may appear in Home Assistant shortly.</p>
          </SuccessStep>
        ),
        primary: "Done",
        final: true,
      },
    ],
  },
};

Object.assign(window, { FLOWS, ACCENT, RadioList, Field, SelectField, FlowIntro, Working, SuccessStep });
