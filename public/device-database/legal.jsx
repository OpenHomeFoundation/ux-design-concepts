/* Privacy hub + Impressum — native legal pages.

   The Privacy hub (#/privacy) gives privacy primary footer placement and a
   Settings-style navigation rail (reusing the .ce-account-* shell + sliding
   accent rail) to move between:
     • Overview            — the privacy commitment, principles, and document index
     • Data Use Statement  — canonical copy of the device database's data-use notice
     • Privacy Policy       — placeholder, in preparation (foundation-wide doc)
     • Terms of Use         — placeholder, in preparation

   Impressum stays a standalone page (#/impressum), reachable from the small
   footer legal cluster, since the imprint is an entity record rather than a
   privacy document.

   Authored in plain createElement (no JSX), so legal.jsx and legal.js are
   identical. A tiny block renderer keeps the long-form content easy to edit:
   each document is an array of content blocks.

   Block shapes:
     { lead }       intro paragraph (uses .lede)
     { h2 } / { h3 } headings
     { p }          body paragraph
     { ul: [..] }   bullet list
     { addr: [..] } address lines (no bullets)
     { code }       monospace code block (preformatted)
     { note }       small muted aside
   Inline content is a string, or an array whose members are strings,
   { a, c, ext } links, { b } bold, or { code } inline. */

(function () {
  const e = React.createElement;
  const PRIMARY = { color: "var(--primary)" };
  const EYEBROW_STYLE = { marginBottom: 8, color: "var(--primary)" };

  /* ---------- inline + block rendering ---------- */

  function inline(c, k) {
    if (c == null) return null;
    if (typeof c === "string") return c;
    if (Array.isArray(c)) {
      return c.map(function (n, i) {
        if (typeof n === "string") return n;
        const key = (k || "i") + "-" + i;
        if (n.email) {
          const addr = n.email.u + "@" + n.email.d;
          return e("a", { key: key, href: "mailto:" + addr, style: PRIMARY }, addr);
        }
        if (n.a) {
          return e("a", {
            key: key, href: n.a, style: PRIMARY,
            target: n.ext ? "_blank" : undefined,
            rel: n.ext ? "noopener" : undefined
          }, n.c);
        }
        if (n.b) return e("strong", { key: key }, n.c);
        if (n.code) return e("code", { key: key }, n.code);
        return null;
      });
    }
    return c;
  }

  function renderBlock(b, i) {
    const key = "b" + i;
    if (b.lead != null) return e("p", { key: key, className: "lede legal-lead" }, inline(b.lead, key));
    if (b.h2 != null) return e("h2", { key: key, className: "legal-h2" }, inline(b.h2, key));
    if (b.h3 != null) return e("h3", { key: key, className: "legal-h3" }, inline(b.h3, key));
    if (b.p != null) return e("p", { key: key, className: "legal-p" }, inline(b.p, key));
    if (b.note != null) return e("p", { key: key, className: "legal-note" }, inline(b.note, key));
    if (b.ul) {
      return e("ul", { key: key, className: "legal-ul" },
        b.ul.map(function (it, j) { return e("li", { key: key + "-" + j }, inline(it, key + "-" + j)); }));
    }
    if (b.addr) {
      const lines = [];
      b.addr.forEach(function (ln, j) {
        if (j > 0) lines.push(e("br", { key: key + "-br" + j }));
        lines.push(inline(ln, key + "-a" + j));
      });
      return e("address", { key: key, className: "legal-addr" }, lines);
    }
    if (b.code != null) return e("pre", { key: key, className: "legal-code" }, e("code", null, b.code));
    return null;
  }

  /* A document rendered inside the hub content column (prose, constrained
     measure). header + optional version/lead/placeholder + blocks. */
  function renderDoc(doc) {
    return e("div", { className: "privacy-doc" },
      e("div", { className: "eyebrow section-eyebrow", style: EYEBROW_STYLE }, doc.eyebrow || "Privacy"),
      e("h1", { className: "legal-title" }, doc.title),
      doc.version ? e("p", { className: "legal-version" }, doc.version) : null,
      doc.lead ? e("p", { className: "lede legal-lead" }, inline(doc.lead, "lead")) : null,
      doc.placeholder ? e("div", { className: "legal-placeholder" },
        e("span", { className: "legal-placeholder-tag" }, "In preparation"),
        e("p", { className: "legal-placeholder-text" }, inline(doc.placeholder, "ph"))) : null,
      doc.blocks ? doc.blocks.map(renderBlock) : null
    );
  }

  /* ---------- Data Use Statement content ---------- */

  const HA = { a: "https://www.home-assistant.io", c: "Home Assistant", ext: true };
  const WIKI = { a: "https://github.com/OHF-Device-Database/backlog-items/wiki/Open-Home-Foundation-%E2%80%90-Device-Database", c: "our GitHub page", ext: true };

  const DATA_USE_BLOCKS = [
    { lead: "The Device Database is a real-world, actionable list of smart home devices, focused on the model, manufacturer, features, software, interoperability, and other specs you have told us matter most. The goal is to greatly reduce the time you spend researching future smart home purchases." },
    { p: ["To build the most comprehensive, globally inclusive database of devices, we need your help understanding what devices your smart home uses and how they are integrated. So we created a quick, easy, opt-in way to contribute by automatically uploading smart home device information directly from your ", HA, " instance."] },
    { p: "That said, we refuse to ever compromise on your fundamental right to privacy. At the Open Home Foundation this means more than a checkbox. We want you to feel safe because you know exactly what information we have access to, what we do with it, and how you can opt in and opt out at any time." },
    { p: ["So before you get involved, here is how we protect your privacy, consistent with our ", { a: "https://analytics.home-assistant.io", c: "Home Assistant analytics", ext: true }, " approach:"] },
    { ul: [
      [{ b: "You are in control (opt-in):" }, " This feature is strictly opt-in. You must give explicit permission for your Home Assistant instance to send device information to the database. You can opt out again at any time."],
      [{ b: "We will not use personally identifiable information:" }, " We do not use or further process any personally identifiable data. We only care about information that describes a device, such as the manufacturer, model, and software version."],
      [{ b: "Data is aggregated:" }, " The information sent is aggregated, meaning data from many Home Assistant instances is combined to build the database. No individual submission is added to the database, only aggregated ones, and only once certain thresholds have been reached (for example, a minimum of 10 independent device submissions)."]
    ] },
    { p: "We are building this database as a communal effort, by and for our community, to become a foundational resource for the smart home ecosystem. We are committed to keeping its integrity independent of commercial influence, and to protecting your privacy at every step." },

    { h2: "Example submission" },
    { p: "Below is an example submission, or snapshot: the data your Home Assistant sends to the device database." },
    { p: "The snapshot includes, for each device:" },
    { ul: [
      "Integration domain",
      "Manufacturer, model name, model ID",
      "Hardware and software version",
      "Whether the device has a configuration URL",
      "Device hierarchy information (via_device relationships)"
    ] },
    { p: "And for each entity belonging to a device:" },
    { ul: [
      "Entity domain (light, sensor, switch, and so on)",
      "Entity category (config, diagnostic, or none)",
      "Original device class (temperature, humidity, and so on)",
      "Unit of measurement",
      "Whether it uses has_entity_name",
      "Whether it has an assumed state"
    ] },
    { p: "Snapshots do not include device names, entity names, entity IDs, state values, unique identifiers (MAC addresses, serial numbers), IP addresses, or any personally identifiable information. Device IDs are anonymized using integration-scoped indices." },
    { p: "Custom integrations are not currently included. Snapshots are uploaded every 24 hours." },
    { code: '{\n  "hue": {\n    "devices": [\n      {\n        "entry_type": null,\n        "has_configuration_url": true,\n        "hw_version": "2.1",\n        "manufacturer": "Signify",\n        "model": "Philips Hue Bridge",\n        "model_id": "BSB002",\n        "sw_version": "1.65.1",\n        "via_device": null,\n        "entities": []\n      },\n      {\n        "entry_type": null,\n        "has_configuration_url": false,\n        "hw_version": null,\n        "manufacturer": "Signify",\n        "model": "Hue color lamp",\n        "model_id": "LCT015",\n        "sw_version": "1.104.2",\n        "via_device": ["hue", 0],\n        "entities": [\n          {\n            "assumed_state": false,\n            "domain": "light",\n            "entity_category": null,\n            "has_entity_name": true,\n            "original_device_class": null,\n            "unit_of_measurement": null\n          }\n        ]\n      }\n    ],\n    "entities": []\n  }\n}' },

    { h2: "Why do we need device information?" },
    { p: "We want the device database to accurately reflect real-world smart homes. Its integrity and authenticity depend on data from actual Home Assistant users. By combining many submissions for each device, we can establish an objective, unbiased validation process." },
    { p: "Our guidelines for including submitted data:" },
    { ul: [
      "Generally, no individual submission is added to the database",
      "Instead, the database considers the aggregate, the combined total, of many submissions",
      "A device is included only once this combined data meets certain thresholds, such as a valid number of individual submissions for the same device"
    ] },

    { h2: "Where is the data stored, and for how long?" },
    { p: "The device database is securely hosted in one of Amazon Web Services (AWS) European availability zones." },
    { p: "To ensure the integrity and authenticity of the data we receive, we split the device database into two zones." },
    { h3: "Staging zone" },
    { p: "This is where your submitted device data resides until it passes checks for authenticity and integrity, before being aggregated and moved to the live zone. Here we use two kinds of random identifiers:" },
    { ul: [
      [{ b: "Submission identifier:" }, " unique for each submission"],
      [{ b: "Submitter identifier:" }, " unique for each submitter"]
    ] },
    { p: "Your submission data is stored for a maximum of 60 days since its last update." },
    { h3: "Live zone" },
    { p: "This contains only aggregates of the submitted snapshots, with staging-zone identifiers removed. Data in the live zone is publicly accessible for full transparency." },
    { p: "We do not knowingly collect, and we do not retain, any personal data. Aggregated, non-personal, live-zone data remains available as long as it stays relevant." },

    { h2: "What information do we need?" },
    { p: ["All data points contributed by your Home Assistant are described in more detail on ", WIKI, ". Our aim is to start with a basic set of information. You can opt out at any time."] },

    { h2: "What information do we not collect?" },
    { p: "The following categories are explicitly excluded from submissions:" },
    { ul: [
      [{ b: "No personal identifiers:" }, " we do not collect names, email addresses, or anything else that directly identifies you."],
      [{ b: "No location data:" }, " we do not collect addresses or time zones."],
      [{ b: "No credentials:" }, " we do not collect logins, passwords, API keys, client IDs, or any other secrets used by your devices or services, and we do not access or store IP addresses."],
      [{ b: "No personal media:" }, " the system does not access or upload any images, sounds, or videos."],
      [{ b: "No home configuration:" }, " we do not collect your user-defined structural data, such as the names of your rooms, areas, or groups."]
    ] },

    { h2: "How is my device data sent?" },
    { p: "Once you actively opt in via the Analytics section in your Home Assistant Companion app or web interface (Settings, then Analytics, then Device Analytics), your Home Assistant instance automatically uploads a snapshot of your device information." },
    { p: ["This repeats daily to keep the database up to date. Any changes, including new devices you add, contribute to the quality of the database. Like everything we do, this process is completely transparent and publicly available. You can read the ", { a: "https://github.com/OHF-Device-Database/device-database", c: "full technical documentation on the submission protocol", ext: true }, " we use."] },

    { h2: "What does it mean to opt in?" },
    { p: "Opting in means you give explicit permission for your Home Assistant instance to participate and submit data to the device database. This is not on by default." },

    { h2: "What does it mean to opt out?" },
    { p: "Opting out means you can change your mind and stop contributing device data at any time, for any reason. You are always in control, and you can opt in and out as often as you like via Home Assistant settings." },

    { h2: "What happens if I stop sharing my device data?" },
    { p: "From that moment on, your Home Assistant instance immediately stops sending new device information. The periodic, automatic snapshots are no longer sent." },

    { h2: "Will my previously sent information be deleted?" },
    { p: "This is a key point. We cannot automatically delete your past contributions because we have no way of knowing which data is yours. No individual submission is included in the database, only aggregated information, and a submission is considered for inclusion only after it meets certain thresholds, such as a minimum of 10 individual submissions for the same device." },

    { h2: "What do you know about me and my home?" },
    { p: "At the moment of submission we use a random ID to identify which devices come from a single instance. This information is stripped once we aggregate the data." },
    { p: "We envision a future where everyone can use the device database to gain insights and access its data. For example, your Home Assistant instance could query the database to find compatible or commonly combined devices. If we build such a system, it is your instance that accesses the public database. Neither the Open Home Foundation nor the device database stores or records information from your instance based on such a query." },

    { h2: "How do you make sure my personal info is not sent by accident?" },
    { p: "We understand that integrations can sometimes mix personal data with device information, such as a device named Sharon's iPhone. The submission process is explicitly designed to handle this risk and actively protect your privacy." },
    { p: "First, we attempt to exclude any information that is not device-centric. Submissions are based on unique model IDs, and we do not ask your instance for any field that could contain an email, name, location, or other identifier." },
    { p: "Second, as an extra layer of protection, we actively scan all submissions to find and remove personal information in common formats, such as email addresses that passed the first screening. This ensures sensitive data is scrubbed before it ever enters the database." },
    { p: ["If you ever feel that some personal information may have been exposed, please contact us at ", { email: { u: "devices", d: "openhomefoundation.org" } }, " so we can investigate and address it immediately."] },

    { h2: "What if I change my mind in the future?" },
    { p: "You can opt out at any time, for any reason. The moment you do, the effect is immediate, and your instance stops sending new submissions, unless you decide to opt in again." },

    { h2: "Where can I access the device data collected so far?" },
    { p: ["Transparency is key. We believe in publicly sharing the data we collect, provided it is aggregated and anonymous. We provide a ", { a: "https://openhomefoundation.grafana.net/public-dashboards/1cb22c82e90c4f64afb366c6125a8489", c: "public web interface", ext: true }, " for direct and easy viewing."] },
    { p: "An API will be made publicly available once it reaches a mature state." },

    { h2: "Who can I contact with questions?" },
    { p: ["If you have any questions about this device database notice, please contact us at ", { email: { u: "devices", d: "openhomefoundation.org" } }, "."] }
  ];

  const DATA_USE_DOC = { eyebrow: "Privacy", title: "Data Use Statement", version: "Version January 8, 2026", blocks: DATA_USE_BLOCKS };
  const PRIVACY_POLICY_DOC = { eyebrow: "Privacy", title: "Privacy Policy", placeholder: "This page is in preparation. The Open Home Foundation privacy policy will be published here." };
  const TERMS_DOC = { eyebrow: "Privacy", title: "Terms of Use", placeholder: "This page is in preparation. The terms for using the Device Database will be published here." };

  /* ---------- Overview ---------- */

  function principle(t, d) {
    return e("li", { key: t }, e("strong", null, t + ". "), d);
  }

  function docCard(href, title, desc, status) {
    return e("a", { key: href, className: "privacy-card", href: href },
      e("span", { className: "privacy-card-title" },
        title,
        status ? e("span", { className: "privacy-card-status" }, status) : null),
      e("span", { className: "privacy-card-desc" }, desc),
      e("span", { className: "privacy-card-cta", "aria-hidden": "true" }, "Read \u2192"));
  }

  function renderOverview() {
    return e("div", { className: "privacy-doc" },
      e("div", { className: "eyebrow section-eyebrow", style: EYEBROW_STYLE }, "Privacy"),
      e("h1", { className: "legal-title" }, "Privacy, by design"),
      e("p", { className: "lede legal-lead" }, "Privacy is not something we add at the end. It is the reason this database is built the way it is. You stay in control of your data, and we only ever work with information that cannot identify you or your home."),
      e("p", { className: "legal-p" }, "Everything the Device Database collects is opt-in, stripped of anything personal, and combined across many homes before it is ever shown. The documents below set out exactly how that works, and the rules for using the database."),

      e("h2", { className: "legal-h2" }, "Our principles"),
      e("ul", { className: "privacy-principles" },
        principle("Strictly opt-in", "Nothing is shared unless you turn it on in Home Assistant, and you can turn it off again at any time."),
        principle("No personal data", "We do not collect names, locations, credentials, media, or anything that identifies you or your home."),
        principle("Aggregated, never individual", "Submissions are combined across many homes. No single contribution appears on its own."),
        principle("Transparent and public", "The data we collect is published openly, and the whole process is documented in full.")),

      e("h2", { className: "legal-h2" }, "The documents"),
      e("div", { className: "privacy-cards" },
        docCard("#/privacy/data-use", "Data Use Statement", "Exactly what device data is shared from Home Assistant, and how it is protected.", null),
        docCard("#/privacy/policy", "Privacy Policy", "How the Open Home Foundation handles personal data across its services.", "In preparation"),
        docCard("#/privacy/terms", "Terms of Use", "The rules for using the Device Database and its data.", "In preparation")));
  }

  /* ---------- Privacy hub (rail + content) ---------- */

  const NAV_ITEMS = [
    { id: "overview", label: "Overview", href: "#/privacy" },
    { id: "data-use", label: "Data Use Statement", href: "#/privacy/data-use" },
    { id: "policy", label: "Privacy Policy", href: "#/privacy/policy" },
    { id: "terms", label: "Terms of Use", href: "#/privacy/terms" }
  ];

  function PrivacyHub(props) {
    const path = (props.route && props.route.path) || "";
    let sub = "overview";
    if (path === "data-use" || path === "privacy/data-use") sub = "data-use";
    else if (path === "privacy/policy") sub = "policy";
    else if (path === "privacy/terms") sub = "terms";

    const activeIdx = Math.max(0, NAV_ITEMS.findIndex(function (n) { return n.id === sub; }));
    const navLinkRefs = React.useRef([]);
    const [navHover, setNavHover] = React.useState(null);
    const [rail, setRail] = React.useState({ y: 0, h: 0, ready: false });
    const [railAnimate, setRailAnimate] = React.useState(false);

    const measureRail = React.useCallback(function () {
      const idx = navHover != null ? navHover : activeIdx;
      const el = navLinkRefs.current[idx];
      if (el) setRail({ y: el.offsetTop, h: el.offsetHeight, ready: true });
    }, [navHover, activeIdx]);

    React.useLayoutEffect(function () { measureRail(); }, [measureRail]);
    React.useEffect(function () {
      const id = requestAnimationFrame(function () { setRailAnimate(true); });
      return function () { cancelAnimationFrame(id); };
    }, []);
    React.useEffect(function () {
      window.addEventListener("resize", measureRail);
      return function () { window.removeEventListener("resize", measureRail); };
    }, [measureRail]);
    React.useEffect(function () { try { window.scrollTo(0, 0); } catch (err) {} }, [sub]);

    let content, label;
    if (sub === "data-use") { content = renderDoc(DATA_USE_DOC); label = "Privacy / Data Use Statement"; }
    else if (sub === "policy") { content = renderDoc(PRIVACY_POLICY_DOC); label = "Privacy / Privacy Policy"; }
    else if (sub === "terms") { content = renderDoc(TERMS_DOC); label = "Privacy / Terms of Use"; }
    else { content = renderOverview(); label = "Privacy"; }

    return e("div", { className: "container ce-account-shell", "data-screen-label": label, "data-comment-anchor": "privacy-hub" },
      e("aside", { className: "ce-account-nav", "aria-label": "Privacy" },
        e("nav", { className: "ce-account-nav-list", onMouseLeave: function () { setNavHover(null); } },
          e("div", { className: "ce-account-nav-track" },
            e("span", {
              className: "ce-account-nav-rail", "aria-hidden": "true",
              style: { transform: "translateY(" + rail.y + "px)", height: rail.h + "px", opacity: rail.ready ? 1 : 0, transition: railAnimate ? undefined : "none" }
            }),
            NAV_ITEMS.map(function (it, i) {
              return e("a", {
                key: it.id, href: it.href,
                ref: function (el) { navLinkRefs.current[i] = el; },
                onMouseEnter: function () { setNavHover(i); },
                className: "ce-account-nav-link" + (sub === it.id ? " is-active" : ""),
                "aria-current": sub === it.id ? "page" : undefined
              }, it.label);
            })))),
      e("div", { className: "ce-account-content" }, content));
  }

  /* ---------- Impressum (standalone) ---------- */

  const IMPRESSUM_BLOCKS = [
    { lead: "This site, the Open Home Foundation Device Database, is operated by the Open Home Foundation, the non-profit stewards of Home Assistant, ESPHome, Music Assistant, and friends." },

    { h2: "Operator" },
    { addr: [
      "Open Home Foundation",
      "Grabenstrasse 25",
      "6340 Baar",
      "Switzerland",
      "CHE-416.988.952"
    ] },

    { h2: "Contact" },
    { p: [{ b: "Email: " }, { email: { u: "hello", d: "openhomefoundation.org" } }] },
    { p: [{ b: "Phone: " }, { a: "tel:+41412444123", c: "+41 041 244 41 23" }] }
  ];

  function Impressum() {
    return e("div", { "data-screen-label": "Impressum", "data-comment-anchor": "legal-impressum" },
      e("section", { className: "section", style: { borderTop: "none" } },
        e("div", { className: "container-prose legal-wrap" },
          e("h1", { className: "legal-title" }, "Impressum"),
          IMPRESSUM_BLOCKS.map(renderBlock))));
  }

  window.PrivacyHub = PrivacyHub;
  window.Impressum = Impressum;
})();
