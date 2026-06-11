/* Device database, placeholder data.
   Manufacturer + model strings are realistic smart-home references.
   Numbers (reports, installations) are simulated. */

window.DEVICE_CATEGORIES = [
  { id: "hubs",          label: "Hubs, routers and bridges" },
  { id: "controls",      label: "Buttons, switches and controls" },
  { id: "cameras",       label: "Cameras and NVRs" },
  { id: "cleaning",      label: "Cleaning" },
  { id: "climate",       label: "Climate control" },
  { id: "irrigation",    label: "Irrigation" },
  { id: "kitchen",       label: "Kitchen and household" },
  { id: "lighting",      label: "Lighting" },
  { id: "presence",      label: "Occupancy, presence and motion" },
  { id: "pool",          label: "Pool and spa" },
  { id: "pets",          label: "Pets" },
  { id: "power",         label: "Power and energy" },
  { id: "security",      label: "Security and access control" },
  { id: "sensors",       label: "Sensors" },
  { id: "entertainment", label: "Entertainment" },
  { id: "vehicles",      label: "Vehicles and mobility" },
  { id: "wearables",     label: "Wearables" },
  { id: "shading",       label: "Window treatments and shading" },
];

// Local control levels: "always" | "sometimes" | "never"
// Cloud dependency:     "none"   | "optional"  | "required"
// HA support:           "official" | "community" | "partial" | "none"


// Community contributor accounts. CURRENT_USER is who you are signed in as
// for the demo. Avatars are inline SVG initials rendered by the page.
window.USERS = {
  "northlight":  { name: "northlight",  gh: "northlight", photo: "assets/avatars/northlight.png",
                      pronouns: "she/her", location: "Tromsø, Norway",
                      bio: "Zigbee and Thread tinkerer. I verify lighting and climate gear against real installs before I touch a field.",
                      url: "https://northlight.example", socials: [{ label: "Mastodon", url: "https://fosstodon.org/@northlight" }] },
  "localwatt":   { name: "localwatt",   gh: "local-watt", photo: "assets/avatars/localwatt.png",
                      pronouns: "he/him", location: "The basement, watching the meter spin",
                      bio: "Energy monitoring and local-control die-hard. If it needs a cloud to turn on, I want it documented." },
  "meshowl":     { name: "meshowl",     gh: "meshowl", private: true, photo: "assets/avatars/meshowl.png",
                      location: "Türkiye",
                      bio: "Mesh networks and presence sensing. Mostly here for the setup instructions nobody else writes down." },
  "relaynode":   { name: "relaynode",   gh: "relaynode" },
  "zigbit":      { name: "zigbit",      gh: "zigbit99", photo: "assets/avatars/zigbit.png",
                      pronouns: "she/her", location: "Behind the softbox, chasing the perfect shot",
                      bio: "Photographer by day. I shoot the product photos and packaging shots you see across the database." },
  "robinhass":   { name: "robinhass",   gh: "robinhass",
                      email: "robin@example.com", hasPassword: true,
                      location: "Berlin, Germany",
                      bio: "Home Assistant user since 2021. I keep the bulbs and plugs in my own setup documented so the next person doesn't have to guess.",
                      url: "https://robin.example",
                      socials: [{ label: "Mastodon", url: "https://mastodon.social/@robinhass" }, { label: "Home Assistant Community", url: "https://community.home-assistant.io/u/robinhass" }],
                      passkeys: [{ id: "pk1", label: "MacBook Pro of Robin", added: "2026-04-12" }] }
};
window.CURRENT_USER = "robinhass";

/* PR comment counts — the seam the GitHub API would later fill. Keyed by PR
   number. `unanswered: true` means the latest comment is a reviewer's, after
   the contributor's last activity, so the change "needs you". See the wiki,
   section 07, "When a change needs you". */
window.PR_COMMENTS = {
  1259: { count: 2, unanswered: true },   // Yale lock, reviewer asked a question
  1281: { count: 0, unanswered: false },  // Shelly, quiet
  1209: { count: 3, unanswered: false },  // Hue, declined edit discussion
};

window.DEVICES = [
  // ----- Lights -----
  {
    id: "philips-hue-white-a19",
    description: "A standard soft-white A19 bulb and the most affordable entry into the Hue line. It carries no colour or tunable-white capability (it is a single warm white), but it dims smoothly and behaves like any other Zigbee 3.0 light once paired.\n\nMost people pair it to a Hue Bridge, which then exposes it to Home Assistant over the local network. It can also be paired directly to a generic Zigbee coordinator (ZHA or Zigbee2MQTT) without the bridge at all, in which case the Bluetooth radio is used only for the initial out-of-box setup.",
    instructions: {
      text: "Screw the bulb into a powered fixture. To use a Hue Bridge, open the Hue app, go to Settings → Add light, and let it search. Once the bridge has the bulb, add or refresh the Philips Hue integration in Home Assistant and the light appears automatically.\n\nTo skip the bridge, put the bulb into pairing mode (power-cycle three times) and add it directly from ZHA or Zigbee2MQTT. No Hue account is required for the bridge-free path."
    },
    specs: {
      cat: { luminousFlux: 806, colorTemp: "2700 K", colorCapability: "White", base: "E26", dimmable: true },
      connectivity: { initialSetup: "Local", dayToDay: "Local", offline: "Keeps working" },
      ecosystems: { homeAssistant: true, amazonAlexa: true, appleHome: true, googleHome: true, homey: true, others: [], proprietaryApp: true, appRequired: false, subscriptionFeatures: false, appLinks: { android: "https://play.google.com/store/apps/details?id=com.philips.lighting.hue2" } },
      protocols: { matter: false, thread: false, wifi: false, zigbee: true, zwave: false },
      bridge: { proprietary: "Philips Hue Bridge" },
      dimensions: [{ name: "Device", height: 110, width: 60, depth: 60 }],
      identifiers: { modelId: "LCA001", ean: "8719514291218", sku: "046677562779" },
      references: [{ label: "Philips Hue, White A19 product page", url: "https://www.philips-hue.com/" }, { label: "Philips Hue support and manuals", url: "https://www.philips-hue.com/en-us/support" }],
      connectsWith: {
        amazonAlexa: {
          limitations: "Alexa needs the Philips Hue Bridge and the Hue skill enabled. A bulb paired directly over Bluetooth, or to a third-party Zigbee coordinator like ZHA or Zigbee2MQTT, will not appear in Alexa.\n\nAlexa exposes only on, off, and brightness for this bulb. Scenes and routines built in the Hue app are not mirrored into Alexa and have to be recreated on the Alexa side.\n\nGroup commands sent through Alexa can lag the Hue app by a second or two, because they fan out through the Hue cloud rather than running locally on the bridge."
        }
      }
    },
    name: "Hue White A19",
    manufacturer: "Philips Hue",
    model: "9290011998",
    category: "lighting",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "Philips Hue",
    reports: 4218, installs: 2914,
    summary: "Standard A19 white bulb. Pairs to a Hue Bridge over Zigbee. Bluetooth used only for setup and direct control without a bridge.",
    entityTypes: ["light"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2026-01-31" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-22",
    photos: ["assets/hue-white-a19-packaging.jpeg","assets/hue-white-a19-bulb.jpeg"],
    lastEdited: {"at": "2026-06-01T20:14:00","by":"robinhass"},
    editHistory: [
      {
        "at": "2026-06-01T20:14:00",
        "by": "robinhass",
        "summary": "Confirmed the revised low-end dimming on a second unit",
        "pr": 1244,
        "changes": [
          { "field": "description", "verb": "updated", "detail": "noted the improved dimming curve below 5%" }
        ]
      },
      {
        "at": "2026-04-18T09:32:00",
        "by": "robinhass",
        "summary": "Verified bridge-free pairing on Zigbee2MQTT",
        "pr": 1102,
        "changes": [
          { "field": "instructions", "verb": "updated", "detail": "added the power-cycle pairing steps" }
        ]
      },
      {
        "at": "2026-05-08T08:25:00",
        "by": "relaynode",
        "summary": "Added photos",
        "changes": [
          {
            "field": "photos",
            "verb": "added",
            "detail": "2 photos"
          }
        ]
      },
      {
        "at": "2025-12-23T09:44:00",
        "by": "zigbit",
        "summary": "Initial entry",
        "changes": [
          {
            "field": "device",
            "verb": "created"
          }
        ]
      }
    ],
  },
  {
    id: "ikea-tradfri-led1836g9",
    name: "TRÅDFRI LED bulb E26 800lm",
    manufacturer: "IKEA",
    model: "LED1836G9",
    category: "lighting",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "Zigbee Home Automation (ZHA), Zigbee2MQTT",
    reports: 2104, installs: 1488,
    summary: "Inexpensive dimmable warm-white bulb. Works with any Zigbee 3.0 coordinator. Does not require the IKEA Trådfri gateway.",
    entityTypes: ["light"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-23" }, { version: "2.3.7", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-03-18",
  },
  {
    id: "inovelli-blue-lzw31",
    description: "An enthusiast favourite: a Zigbee 3.0 smart dimmer with a configurable RGB notification LED bar down one side. The bar can be driven independently of the load, so you can use it for doorbell alerts, laundry timers, or any other automation signal.\n\nEverything runs locally over Zigbee. Binding, multi-tap scenes, and the LED bar are all available without any manufacturer cloud. It supports both neutral and no-neutral wiring, though dimming performance is best with a neutral present.",
    instructions: {
      text: "Switch off power at the breaker before wiring. The Blue Series supports line, load, neutral (optional) and traveller connections. Follow the included wiring card for your configuration. Restore power, then put the switch into pairing mode with three quick taps of the config button and add it from ZHA or Zigbee2MQTT.\n\nMany advanced behaviours (LED bar, multi-tap scenes) are exposed as Zigbee cluster parameters, Zigbee2MQTT ships an extensive device page for tuning them."
    },
    specs: {
      cat: { gangs: 1, neutralRequired: false, maxLoad: "300 W LED / 600 W incandescent", dimming: true },
      connectivity: { initialSetup: "Local", dayToDay: "Local", offline: "Keeps working" },
      ecosystems: { homeAssistant: true, appleHome: false, homey: true, smartThings: true, others: [], proprietaryApp: false, appRequired: false, subscriptionFeatures: false },
      protocols: { matter: false, thread: false, wifi: false, zigbee: true, zwave: false },
      dimensions: [{ name: "Device", height: 43, width: 43, depth: 35 }],
      identifiers: { modelId: "VZM31-SN", ean: "850005188", sku: "VZM31-SN" },
      references: [{ label: "Inovelli, Blue Series 2-1", url: "https://inovelli.com/" }, { label: "Inovelli help center", url: "https://help.inovelli.com/" }]
    },
    name: "Blue Series 2-1 Dimmer",
    manufacturer: "Inovelli",
    model: "VZM31-SN",
    category: "controls",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT",
    reports: 1186, installs: 942,
    summary: "Smart dimmer with notification LED bar. Operates fully local over Zigbee. Supports binding and scene control without a hub manufacturer cloud.",
    entityTypes: ["light", "switch", "sensor", "event"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-31" }, { version: "2.3.7", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-05-02",
  },
  {
    id: "lifx-color-a19",
    name: "Color A19",
    manufacturer: "LIFX",
    model: "LHA19E26UC10",
    category: "lighting",
    local: "sometimes",
    cloud: "optional",
    ha: "official",
    haIntegration: "LIFX",
    reports: 1502, installs: 1108,
    summary: "Wi-Fi color bulb. Home Assistant controls it on the LAN via LIFX's UDP protocol. The manufacturer app uses the cloud, but local-only operation works.",
    entityTypes: ["light"],
    softwareVersion: "2.4.1",
    firstSeen: "2025-12-23", lastVerified: "2026-02-11",
  },
  {
    id: "sengled-element-classic",
    name: "Element Classic A19",
    manufacturer: "Sengled",
    model: "Z01-A19NAE26",
    category: "lighting",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT",
    reports: 612, installs: 487,
    summary: "Soft-white A19 bulb. Acts as an end device only, does not route Zigbee mesh traffic. Pair directly to your coordinator.",
    entityTypes: ["light"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2026-02-28" }, { version: "2.3.7", lastSeen: "2025-12-23" }, { version: "2.3.5", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-01-30",
  },

  // ----- Switches -----
  {
    id: "lutron-caseta-pd-6wcl",
    name: "Caséta Wireless In-Wall Dimmer",
    manufacturer: "Lutron",
    model: "PD-6WCL",
    category: "controls",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "Lutron Caséta (via Smart Bridge Pro)",
    reports: 1810, installs: 1402,
    summary: "Wall dimmer that talks Lutron's proprietary Clear Connect RF to a Caséta bridge. Home Assistant integrates via the LEAP protocol over LAN. No cloud required after bridge setup.",
    entityTypes: ["light"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-31" }, { version: "2.3.7", lastSeen: "2025-12-23" }, { version: "2.3.5", lastSeen: "2025-12-23" }, { version: "2.3.2", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-09",
  },
  {
    id: "aqara-wall-switch-h1",
    name: "Wall Switch H1 (No Neutral)",
    manufacturer: "Aqara",
    model: "WS-EUK01",
    category: "controls",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT",
    reports: 988, installs: 712,
    summary: "Single-gang Zigbee wall switch designed for installations without a neutral wire. Reports power consumption alongside switch state.",
    entityTypes: ["switch", "sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-03-22",
  },
  {
    id: "shelly-plus-1",
    name: "Plus 1",
    manufacturer: "Shelly",
    model: "SNSW-001X16EU",
    category: "controls",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "Shelly",
    reports: 2841, installs: 2014,
    summary: "Single-channel relay. Exposes a local HTTP API and MQTT. Bluetooth is used for initial provisioning. Cloud is opt-in.",
    entityTypes: ["switch", "sensor"],
    softwareVersion: "2.4.1",
    firstSeen: "2025-12-23", lastVerified: "2026-05-12",
    photos: ["assets/shelly-plus1-device.jpeg","assets/shelly-plus1-packaging.jpeg"],
    lastEdited: {"at": "2026-05-10T18:22:00","by":"robinhass"},
    editHistory: [
      {
        "at": "2026-05-10T18:22:00",
        "by": "robinhass",
        "summary": "Documented the local HTTP API endpoints for the relay",
        "pr": 1156,
        "changes": [
          { "field": "instructions", "verb": "updated", "detail": "added the RPC and MQTT control examples" }
        ]
      },
      {
        "at": "2026-05-03T19:06:00",
        "by": "relaynode",
        "summary": "Added photos and clarified that MQTT works without the Shelly cloud",
        "changes": [
          {
            "field": "photos",
            "verb": "added",
            "detail": "2 photos"
          },
          {
            "field": "summary",
            "verb": "updated"
          }
        ]
      },
      {
        "at": "2025-12-23T12:05:00",
        "by": "northlight",
        "summary": "Initial entry",
        "changes": [
          {
            "field": "device",
            "verb": "created"
          }
        ]
      }
    ],
  },
  {
    id: "sonoff-zbmini-l2",
    name: "ZBMINI-L2",
    manufacturer: "SONOFF",
    model: "ZBMINIL2",
    category: "controls",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT",
    reports: 1342, installs: 1051,
    summary: "Compact in-wall relay. The L2 revision works without a neutral wire. Reports as a non-routing Zigbee end device.",
    entityTypes: ["switch"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-02-28",
  },

  // ----- Sensors -----
  {
    id: "aqara-fp2",
    description: "A mmWave presence sensor that detects whether a room is occupied even when nobody is moving, a meaningful step up from PIR motion sensors, which go dark the moment you sit still. It can divide a single room into up to 30 zones and report each independently.\n\nThe trade-off is setup: the FP2 provisions through the Aqara cloud over Wi-Fi, so it is not a fully local device out of the box. Once running it can be controlled locally via HomeKit, but the initial registration and zone drawing happen in Aqara's app.",
    specs: {
      cat: { sensingTech: "mmWave radar", range: 5, zones: 30, luxSensor: true },
      connectivity: { initialSetup: "Manufacturer account", dayToDay: "Mixed", offline: "Limited" },
      ecosystems: { homeAssistant: true, amazonAlexa: true, appleHome: true, homey: false, others: [], proprietaryApp: true, appRequired: true, subscriptionFeatures: false, appLinks: { ios: "https://apps.apple.com/app/aqara-home/id1474063238", android: "https://play.google.com/store/apps/details?id=com.lumiunited.aqarahome.play", others: ["https://appgallery.huawei.com/app/C101160785"] } },
      protocols: { matter: false, thread: false, wifi: true, zigbee: false, zwave: false },
      dimensions: [{ name: "Device", height: 55, width: 55, depth: 32 }],
      identifiers: { modelId: "PS-S02D", ean: "6970504218291", sku: "PS-S02D" },
      references: [{ label: "Aqara, Presence Sensor FP2", url: "https://www.aqara.com/en/product/presence-sensor-fp2/" }]
    },
    name: "Presence Sensor FP2",
    manufacturer: "Aqara",
    model: "PS-S02D",
    category: "presence",
    local: "sometimes",
    cloud: "required",
    ha: "official",
    haIntegration: "Aqara or HomeKit Controller",
    reports: 1684, installs: 1112,
    summary: "mmWave presence sensor that maps a room into zones. The Aqara cloud is required for setup. Ongoing operation can be local via HomeKit pairing.",
    entityTypes: ["binary_sensor", "sensor"],
    softwareVersion: "v9",
    firstSeen: "2025-12-23", lastVerified: "2026-05-10",
    photos: ["assets/fp2-device-background.jpeg","assets/fp2-device.jpg","assets/fp2-packaging.jpeg"],
    lastEdited: {"at": "2026-05-12T08:25:00","by":"northlight"},
    editHistory: [
      {
        "at": "2026-05-12T08:25:00",
        "by": "northlight",
        "summary": "Added photos and clarified setup requirement",
        "changes": [
          {
            "field": "photos",
            "verb": "added",
            "detail": "3 photos"
          },
          {
            "field": "summary",
            "verb": "updated"
          }
        ]
      },
      {
        "at": "2026-03-28T11:22:00",
        "by": "localwatt",
        "summary": "Marked local operation as \"sometimes\", needs Aqara cloud for initial setup",
        "changes": [
          {
            "field": "connectivity",
            "verb": "updated"
          }
        ]
      },
      {
        "at": "2025-12-23T19:42:00",
        "by": "meshowl",
        "summary": "Initial entry",
        "changes": [
          {
            "field": "device",
            "verb": "created"
          }
        ]
      }
    ],
  },
  {
    id: "aqara-temperature-t1",
    description: "A compact, inexpensive Zigbee sensor reporting temperature, humidity and barometric pressure. It sleeps between reports to stretch the coin-cell battery across a year or more, which means it is not suited to sub-minute logging but is ideal for room comfort and HVAC automations.",
    specs: {
      cat: { measurements: ["Temperature", "Humidity", "Pressure"], battery: "CR2032", reportingInterval: "~10 min or on change" },
      connectivity: { initialSetup: "Local", dayToDay: "Local", offline: "Keeps working" },
      protocols: { matter: false, thread: false, wifi: false, zigbee: true, zwave: false }
    },
    name: "Temperature and Humidity Sensor T1",
    manufacturer: "Aqara",
    model: "WSDCGQ12LM",
    category: "sensors",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT",
    reports: 3214, installs: 2461,
    summary: "Small battery-powered sensor reporting temperature, humidity and pressure. Sleeps between reports to conserve battery.",
    entityTypes: ["sensor"],
    softwareVersion: "v9",
    firstSeen: "2025-12-23", lastVerified: "2026-04-18",
  },
  {
    id: "sonoff-snzb-02",
    name: "SNZB-02 Temperature Sensor",
    manufacturer: "SONOFF",
    model: "SNZB-02",
    category: "sensors",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT",
    reports: 2618, installs: 1908,
    summary: "Inexpensive temperature and humidity sensor. Reports roughly every five minutes or on a one-degree threshold change.",
    entityTypes: ["sensor"],
    softwareVersion: "v9",
    versionHistory: [{ version: "v8", lastSeen: "2025-12-31" }],
    firstSeen: "2025-12-23", lastVerified: "2026-03-14",
  },
  {
    id: "philips-hue-motion",
    name: "Hue Motion Sensor (indoor)",
    manufacturer: "Philips Hue",
    model: "9290012607",
    category: "presence",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "Philips Hue",
    reports: 1492, installs: 1208,
    summary: "Battery PIR with built-in lux. Pairs to a Hue Bridge or directly to any Zigbee 3.0 coordinator.",
    entityTypes: ["binary_sensor", "sensor"],
    softwareVersion: "v9",
    versionHistory: [{ version: "v8", lastSeen: "2025-12-23" }, { version: "v7", lastSeen: "2025-12-23" }, { version: "v6", lastSeen: "2025-12-23" }, { version: "v5", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-02-04",
  },
  {
    id: "ecobee-smartsensor",
    name: "SmartSensor",
    manufacturer: "Ecobee",
    model: "EB-RSHM2PK-01",
    category: "presence",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Ecobee",
    reports: 614, installs: 502,
    summary: "Room sensor paired to an Ecobee thermostat. Sensor state is read by Home Assistant from the Ecobee cloud, the local thermostat does not expose it.",
    entityTypes: ["binary_sensor", "sensor"],
    softwareVersion: "v9",
    versionHistory: [{ version: "v8", lastSeen: "2025-12-23" }, { version: "v7", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-01-09",
  },

  // ----- Locks -----
  {
    id: "yale-assure-lock-2",
    description: "A touchscreen deadbolt sold in several radio variants. This is the Z-Wave 700-series module, which is the one to choose for a fully local Home Assistant setup. It reports lock and unlock events along with which user code triggered them, so you can build automations around individual household members.\n\nThe module is swappable: the same lock body can take a Matter, Wi-Fi, or Z-Wave card, so confirm the installed radio before buying second-hand.",
    specs: {
      cat: { boltType: "Deadbolt", keypad: true, power: "Battery" },
      connectivity: { initialSetup: "Local", dayToDay: "Local", offline: "Keeps working" },
      protocols: { matter: false, thread: false, wifi: false, zigbee: false, zwave: true },
      dimensions: [
        { name: "Keypad", height: 130, width: 66, depth: 19 },
        { name: "Lock", height: 124, width: 70, depth: 51 }
      ]
    },
    name: "Assure Lock 2 (Z-Wave)",
    manufacturer: "Yale",
    model: "YRD420-ZW2",
    category: "security",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "Z-Wave JS",
    reports: 904, installs: 712,
    summary: "Touchscreen deadbolt with a Z-Wave 700-series module. Reports lock and unlock events with the user code that triggered them.",
    entityTypes: ["lock", "sensor", "event"],
    softwareVersion: "1.83.12",
    versionHistory: [{ version: "1.83.10", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-01",
    photos: ["assets/yale-al2-full.jpg","assets/yale-al2-device.webp","assets/yale-al2-door.jpeg","assets/yale-al2-used.jpeg"],
    lastEdited: {"at": "2026-05-15T15:02:00","by":"localwatt"},
    editHistory: [
      {
        "at": "2026-05-15T15:02:00",
        "by": "localwatt",
        "summary": "Added photos",
        "changes": [
          {
            "field": "photos",
            "verb": "added",
            "detail": "4 photos"
          }
        ]
      },
      {
        "at": "2025-12-23T15:02:00",
        "by": "relaynode",
        "summary": "Initial entry",
        "changes": [
          {
            "field": "device",
            "verb": "created"
          }
        ]
      }
    ],
  },
  {
    id: "august-wifi-smart-lock",
    name: "Wi-Fi Smart Lock (4th gen)",
    manufacturer: "August",
    model: "AUG-SL05-M02-G02",
    category: "security",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "August",
    reports: 542, installs: 411,
    summary: "Connects directly to Wi-Fi. Home Assistant uses the August cloud API. Lock state may lag by several seconds.",
    entityTypes: ["lock", "binary_sensor"],
    softwareVersion: "1.83.12",
    firstSeen: "2025-12-23", lastVerified: "2026-02-14",
  },
  {
    id: "schlage-encode",
    name: "Encode Wi-Fi Deadbolt",
    manufacturer: "Schlage",
    model: "BE489WB",
    category: "security",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Schlage",
    reports: 318, installs: 247,
    summary: "Built-in Wi-Fi deadbolt. The official Home Assistant integration depends on the Schlage cloud. The Encode Plus (Matter) variant works locally.",
    entityTypes: ["lock", "sensor"],
    softwareVersion: "1.83.12",
    firstSeen: "2025-12-23", lastVerified: "2026-03-26",
  },
  {
    id: "aqara-u100",
    name: "Smart Lock U100",
    manufacturer: "Aqara",
    model: "ZNMS02LM",
    category: "security",
    local: "sometimes",
    cloud: "optional",
    ha: "official",
    haIntegration: "Aqara or HomeKit Controller",
    reports: 412, installs: 318,
    summary: "Fingerprint and keypad deadbolt. Local control is available when paired via HomeKit. The Aqara mobile app uses the cloud.",
    specs: {
      protocols: { wifi: false, ethernet: false, thread: true, matterThread: true, bluetooth: true, zigbee: false, zwave: false }
    },
    entityTypes: ["lock", "binary_sensor", "sensor"],
    softwareVersion: "1.83.12",
    firstSeen: "2025-12-23", lastVerified: "2026-04-15",
  },

  // ----- Vacuums -----
  {
    id: "roborock-s8-pro-ultra",
    description: "A high-end robot vacuum and mop with a self-emptying, self-washing dock. Strong suction and a dual-roller brush make it capable on both carpet and hard floors, and the dock handles dust collection and mop cleaning between runs.\n\nFor Home Assistant the catch is cloud dependency: the official integration talks to Roborock's servers. A Valetudo install replaces the cloud firmware and enables fully local control, but it voids the app experience and isn't possible on every hardware revision.",
    specs: {
      cat: { suction: 6000, mopping: true, selfEmptying: true },
      connectivity: { initialSetup: "Manufacturer account", dayToDay: "Mixed", offline: "Limited" },
      ecosystems: { homeAssistant: true, appleHome: false, homey: false, others: [], proprietaryApp: true, appRequired: true, subscriptionFeatures: false, appLinks: { ios: "https://apps.apple.com/app/roborock/id1393152255", android: "https://play.google.com/store/apps/details?id=com.roborock.smart", other: "" } },
      protocols: { matter: false, thread: false, wifi: true, zigbee: false, zwave: false }
    },
    name: "S8 Pro Ultra",
    manufacturer: "Roborock",
    model: "S8PU",
    category: "cleaning",
    local: "sometimes",
    cloud: "required",
    ha: "official",
    haIntegration: "Roborock",
    reports: 712, installs: 588,
    summary: "Robot vacuum and mop. The official integration uses the Roborock cloud. A Valetudo install enables fully local control on supported firmware.",
    entityTypes: ["vacuum", "sensor", "binary_sensor", "camera"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-23" }, { version: "2.3.7", lastSeen: "2025-12-23" }, { version: "2.3.5", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-05-04",
    photos: ["assets/roborock-s8-pro.jpeg","assets/roborock-s8-pro-background.jpeg","assets/roborock-s8-pro-bottom.jpg"],
    lastEdited: {"at": "2026-05-21T13:09:00","by":"robinhass"},
    editHistory: [
      {
        "at": "2026-05-21T13:09:00",
        "by": "robinhass",
        "summary": "Added a note about Valetudo for fully local control",
        "pr": 1178,
        "changes": [
          { "field": "description", "verb": "updated", "detail": "covered the local-control firmware path" }
        ]
      },
      {
        "at": "2026-05-19T11:46:00",
        "by": "meshowl",
        "summary": "Added photos",
        "changes": [
          {
            "field": "photos",
            "verb": "added",
            "detail": "3 photos"
          }
        ]
      },
      {
        "at": "2026-02-02T16:45:00",
        "by": "localwatt",
        "summary": "Confirmed cloud requirement, manufacturer blocks LAN API",
        "changes": [
          {
            "field": "connectivity",
            "verb": "updated"
          }
        ]
      },
      {
        "at": "2025-12-23T18:59:00",
        "by": "relaynode",
        "summary": "Initial entry",
        "changes": [
          {
            "field": "device",
            "verb": "created"
          }
        ]
      }
    ],
  },
  {
    id: "roomba-j7",
    name: "Roomba j7+",
    manufacturer: "iRobot",
    model: "j7558",
    category: "cleaning",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "iRobot",
    reports: 902, installs: 718,
    summary: "Vacuum cleaner with self-emptying base. Home Assistant talks to the iRobot cloud. Local control is not exposed.",
    entityTypes: ["vacuum", "sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2026-01-31" }, { version: "2.3.7", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-03-09",
  },
  {
    id: "dreame-l10s-ultra",
    name: "L10s Ultra",
    manufacturer: "Dreame",
    model: "L10sU",
    category: "cleaning",
    local: "sometimes",
    cloud: "required",
    ha: "official",
    haIntegration: "Dreame",
    reports: 416, installs: 322,
    summary: "Mop-and-vac with auto-empty dock. Cloud-based by default. Local MQTT control is possible on rooted firmware.",
    entityTypes: ["vacuum", "sensor", "camera"],
    softwareVersion: "2.4.1",
    firstSeen: "2025-12-23", lastVerified: "2026-04-22",
  },

  // ----- Plugs -----
  {
    id: "tplink-kasa-hs103",
    description: "A small, cheap Wi-Fi smart plug that has been a Home Assistant staple for years, but firmware matters. Older firmware exposed an undocumented local protocol that the TP-Link integration uses directly. Some newer firmware locks that down and pushes you toward the Kasa cloud. If local control is the goal, check the firmware version before buying and avoid updating once it works.",
    specs: {
      cat: { maxLoad: "15 A / 1800 W", energyMonitoring: false, formFactor: "Plug" },
      connectivity: { initialSetup: "Manufacturer account", dayToDay: "Local", offline: "Keeps working" },
      protocols: { matter: false, thread: false, wifi: true, zigbee: false, zwave: false }
    },
    name: "Kasa Smart Plug Mini HS103",
    manufacturer: "TP-Link",
    model: "HS103",
    category: "power",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "TP-Link Kasa Smart",
    reports: 2210, installs: 1788,
    summary: "Wi-Fi smart plug. Older firmware exposed a local protocol used by Home Assistant. Recent firmware may require the cloud, pin to firmware before purchase if local matters.",
    entityTypes: ["switch", "sensor"],
    softwareVersion: "2.4.1",
    firstSeen: "2025-12-23", lastVerified: "2026-02-22",
  },
  {
    id: "switchbot-plug-mini",
    name: "Plug Mini (W1901500-GH)",
    manufacturer: "SwitchBot",
    model: "W1901500-GH",
    category: "power",
    local: "sometimes",
    cloud: "required",
    ha: "official",
    haIntegration: "SwitchBot",
    reports: 642, installs: 488,
    summary: "Wi-Fi plug with energy monitoring. The SwitchBot integration uses the cloud API. Local control over Bluetooth works only when in range of a SwitchBot hub.",
    entityTypes: ["switch", "sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-31" }],
    firstSeen: "2025-12-23", lastVerified: "2026-01-28",
  },
  {
    id: "aqara-smart-plug",
    name: "Smart Plug (EU)",
    manufacturer: "Aqara",
    model: "SP-EUC01",
    category: "power",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT",
    reports: 1218, installs: 902,
    summary: "Zigbee plug with power and energy reporting. Also acts as a router for the Zigbee mesh.",
    entityTypes: ["switch", "sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2026-02-28" }, { version: "2.3.7", lastSeen: "2025-12-23" }, { version: "2.3.5", lastSeen: "2025-12-23" }, { version: "2.3.2", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-30",
  },
  {
    id: "shelly-plug-s",
    name: "Plug S Gen3",
    manufacturer: "Shelly",
    model: "S3PL-00112EU",
    category: "power",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "Shelly",
    reports: 1414, installs: 1106,
    summary: "Compact plug with energy metering. Exposes the same local HTTP and MQTT API as the rest of the Shelly Plus/Pro line.",
    entityTypes: ["switch", "sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-23" }, { version: "2.3.7", lastSeen: "2025-12-23" }, { version: "2.3.5", lastSeen: "2025-12-23" }, { version: "2.3.2", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-05-08",
  },

  // ----- Hubs -----
  {
    id: "home-assistant-skyconnect",
    description: "A USB stick that adds Zigbee and Thread radios to any Home Assistant host. It is the Open Home Foundation's own coordinator, designed to be the simplest path to a local Zigbee network with no manufacturer cloud anywhere in the picture.\n\nBecause it carries a Thread radio as well, it can act as a Thread border router for Matter-over-Thread devices, letting a single stick cover both the older Zigbee ecosystem and the newer Matter one.",
    instructions: {
      text: "Plug the stick into a USB port on your Home Assistant host, a short extension cable is recommended to keep the radio away from USB 3.0 interference. Home Assistant detects it automatically and offers to set up ZHA (for Zigbee) and the OpenThread Border Router add-on (for Thread).\n\nIf you are migrating from another coordinator, use ZHA's backup-and-restore flow so your existing Zigbee network and device pairings carry over."
    },
    specs: {
      cat: { radios: ["Zigbee", "Thread"], connection: "USB", poe: false, externalAntenna: false },
      ecosystems: { homeAssistant: true, appleHome: false, homey: false, others: [], proprietaryApp: false, appRequired: false, subscriptionFeatures: false },
      protocols: { matter: true, thread: true, wifi: false, zigbee: true, zwave: false },
      dimensions: [{ name: "Device", height: 18, width: 18, depth: 65 }],
      identifiers: { modelId: "ZBT-1", ean: "0810086780013", sku: "ZBT-1" },
      references: [{ label: "Home Assistant Connect ZBT-1", url: "https://www.home-assistant.io/connectzbt1/" }]
    },
    name: "Home Assistant Connect ZBT-1",
    manufacturer: "Nabu Casa",
    model: "ZBT-1",
    category: "hubs",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, OpenThread Border Router",
    reports: 1908, installs: 1488,
    summary: "USB Zigbee and Thread coordinator. Plugs into a Home Assistant host. No manufacturer cloud is involved.",
    entityTypes: [],
    softwareVersion: "1.83.12",
    firstSeen: "2025-12-23", lastVerified: "2026-05-15",
  },
  {
    id: "home-assistant-yellow",
    name: "Home Assistant Yellow",
    manufacturer: "Nabu Casa",
    model: "HA-YELLOW-CM4",
    category: "hubs",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "Built in",
    reports: 1108, installs: 1108,
    summary: "Purpose-built Home Assistant appliance with onboard Zigbee/Thread radio and Power-over-Ethernet. Ships with Home Assistant OS.",
    entityTypes: [],
    softwareVersion: "1.83.12",
    versionHistory: [{ version: "1.83.10", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-11",
  },
  {
    id: "smlight-slzb-06",
    name: "SLZB-06 Ethernet Zigbee Coordinator",
    manufacturer: "SMLight",
    model: "SLZB-06",
    category: "hubs",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT (via TCP)",
    reports: 818, installs: 712,
    summary: "PoE Zigbee coordinator with optional Wi-Fi. Connects to Home Assistant over the network so the radio doesn't need to live next to the host.",
    entityTypes: [],
    softwareVersion: "1.83.12",
    versionHistory: [{ version: "1.83.10", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-25",
  },
  {
    id: "aqara-hub-m2",
    name: "Hub M2",
    manufacturer: "Aqara",
    model: "ZHWG15LM",
    category: "hubs",
    local: "sometimes",
    cloud: "optional",
    ha: "official",
    haIntegration: "Aqara, HomeKit Controller",
    reports: 1342, installs: 998,
    summary: "Aqara's mainstream gateway. Pairs Aqara Zigbee devices and re-exposes them via HomeKit, which Home Assistant can read locally. LAN protocol changes occasionally between firmware versions.",
    entityTypes: ["alarm_control_panel", "binary_sensor", "sensor"],
    softwareVersion: "1.83.12",
    versionHistory: [{ version: "1.83.10", lastSeen: "2026-01-31" }, { version: "1.83.5", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-03-30",
  },

  // ----- Climate -----
  {
    id: "ecobee-premium",
    name: "Ecobee Premium",
    manufacturer: "Ecobee",
    model: "EB-STATE6-01",
    category: "climate",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Ecobee",
    reports: 1102, installs: 904,
    summary: "Smart thermostat with built-in air quality sensor. Home Assistant control is via the Ecobee cloud. There is no local API.",
    entityTypes: ["climate", "sensor", "binary_sensor"],
    softwareVersion: "1.83.12",
    versionHistory: [{ version: "1.83.10", lastSeen: "2025-12-31" }, { version: "1.83.5", lastSeen: "2025-12-23" }, { version: "1.82.9", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-02-26",
    photos: ["assets/ecobee-prem-device.jpeg","assets/ecobee-prem-wall.jpeg"],
    lastEdited: {"at": "2026-05-17T13:48:00","by":"northlight"},
    editHistory: [
      {
        "at": "2026-05-17T13:48:00",
        "by": "northlight",
        "summary": "Added photos. Noted that HA integration uses the cloud API",
        "changes": [
          {
            "field": "photos",
            "verb": "added",
            "detail": "2 photos"
          },
          {
            "field": "summary",
            "verb": "updated"
          }
        ]
      },
      {
        "at": "2025-12-23T09:44:00",
        "by": "localwatt",
        "summary": "Initial entry",
        "changes": [
          {
            "field": "device",
            "verb": "created"
          }
        ]
      }
    ],
  },
  {
    id: "honeywell-t9",
    name: "T9 Smart Thermostat",
    manufacturer: "Honeywell Home",
    model: "RCHT9610WFSW",
    category: "climate",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Honeywell Home (Resideo)",
    reports: 488, installs: 402,
    summary: "Cloud-only thermostat. The Resideo developer API is rate-limited. Expect occasional unavailability in Home Assistant.",
    entityTypes: ["climate", "sensor"],
    softwareVersion: "1.83.12",
    versionHistory: [{ version: "1.83.10", lastSeen: "2025-12-23" }, { version: "1.83.5", lastSeen: "2025-12-23" }, { version: "1.82.9", lastSeen: "2025-12-23" }, { version: "1.81.3", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-01-19",
  },
  {
    id: "aqara-radiator-e1",
    name: "Radiator Thermostat E1",
    manufacturer: "Aqara",
    model: "SRTS-A01",
    category: "climate",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "ZHA, Zigbee2MQTT",
    reports: 612, installs: 488,
    summary: "Battery-powered TRV head. Reports valve position, setpoint and battery. Supports child-lock and window-open detection.",
    entityTypes: ["climate", "sensor", "binary_sensor"],
    softwareVersion: "1.83.12",
    versionHistory: [{ version: "1.83.10", lastSeen: "2025-12-31" }, { version: "1.83.5", lastSeen: "2025-12-23" }, { version: "1.82.9", lastSeen: "2025-12-23" }, { version: "1.81.3", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-07",
  },

  // ----- Cameras -----
  {
    id: "reolink-e1-pro",
    name: "E1 Pro",
    manufacturer: "Reolink",
    model: "E1 Pro",
    category: "cameras",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "Reolink",
    reports: 514, installs: 412,
    summary: "Indoor pan-tilt camera with RTSP and ONVIF. Streams directly to Home Assistant on the LAN. Cloud features are opt-in.",
    entityTypes: ["camera", "sensor", "binary_sensor", "switch"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-31" }],
    firstSeen: "2025-12-23", lastVerified: "2026-03-04",
  },
  {
    id: "wyze-cam-v3",
    name: "Cam v3",
    manufacturer: "Wyze",
    model: "WYZEC3",
    category: "cameras",
    local: "sometimes",
    cloud: "required",
    ha: "official",
    haIntegration: "Wyze",
    reports: 716, installs: 612,
    summary: "Inexpensive 1080p camera. The official integration is cloud-only. RTSP streaming works locally on supported firmware.",
    entityTypes: ["camera", "binary_sensor", "switch"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-23" }, { version: "2.3.7", lastSeen: "2025-12-23" }, { version: "2.3.5", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-02-18",
  },

  // ----- Media -----
  {
    id: "sonos-one-gen2",
    name: "Sonos One (Gen 2)",
    manufacturer: "Sonos",
    model: "S18",
    category: "entertainment",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "Sonos",
    reports: 1184, installs: 902,
    summary: "Wi-Fi speaker controllable on the LAN via the Sonos SOAP API. Streaming services require their own accounts, but local playback and TTS work without the cloud.",
    entityTypes: ["media_player", "sensor"],
    softwareVersion: "2026.05.1",
    firstSeen: "2025-12-23", lastVerified: "2026-03-21",
    photos: ["assets/sonos-one-device.jpg","assets/sonos-one-background.jpeg"],
    lastEdited: {"at": "2026-04-29T16:21:00","by":"zigbit"},
    editHistory: [
      {
        "at": "2026-04-29T16:21:00",
        "by": "zigbit",
        "summary": "Added photos. Noted local-control caveat after the May 2024 app rewrite",
        "changes": [
          {
            "field": "photos",
            "verb": "added",
            "detail": "2 photos"
          },
          {
            "field": "summary",
            "verb": "updated"
          }
        ]
      },
      {
        "at": "2025-12-23T16:09:00",
        "by": "northlight",
        "summary": "Initial entry",
        "changes": [
          {
            "field": "device",
            "verb": "created"
          }
        ]
      }
    ],
  },
  {
    id: "chromecast-gtv-4k",
    name: "Chromecast with Google TV (4K)",
    manufacturer: "Google",
    model: "GA01919",
    category: "entertainment",
    local: "sometimes",
    cloud: "required",
    ha: "official",
    haIntegration: "Google Cast, Android TV Remote",
    reports: 944, installs: 712,
    summary: "Cast target plus an Android TV remote endpoint. Casting is local. App launching depends on Google services and can break across updates.",
    entityTypes: ["media_player", "remote"],
    softwareVersion: "2026.05.1",
    versionHistory: [{ version: "2026.04.2", lastSeen: "2025-12-23" }, { version: "2026.03.0", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-01-12",
  },

  // ----- Irrigation -----
  {
    id: "rachio-3",
    name: "Smart Sprinkler Controller (3rd Gen)",
    manufacturer: "Rachio",
    model: "8ZULW-C",
    category: "irrigation",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Rachio",
    reports: 1284, installs: 1042,
    summary: "Eight-zone Wi-Fi sprinkler controller with weather-based skip. Home Assistant controls it through the Rachio cloud. There is no documented local API.",
    entityTypes: ["switch", "binary_sensor", "sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-03-04",
  },
  {
    id: "hunter-hydrawise-hc",
    name: "Hydrawise HC Controller",
    manufacturer: "Hunter",
    model: "HC-1200i",
    category: "irrigation",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Hydrawise",
    reports: 412, installs: 318,
    summary: "Twelve-zone Wi-Fi irrigation controller. The official Hydrawise integration polls the manufacturer cloud. No local control path exists on current firmware.",
    entityTypes: ["switch", "sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2026-02-28" }, { version: "2.3.7", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-02-18",
  },

  // ----- Kitchen and household -----
  {
    id: "bosch-series8-oven",
    name: "Series 8 Built-in Oven",
    manufacturer: "Bosch",
    model: "HBG7341B1",
    category: "kitchen",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Home Connect",
    reports: 286, installs: 214,
    summary: "Wi-Fi built-in oven on the Home Connect platform. The official Home Connect integration brings program state, temperature, and remote start into Home Assistant through the Bosch cloud.",
    entityTypes: ["sensor", "binary_sensor", "switch", "select", "number"],
    specs: { protocols: { wifi: true } },
    softwareVersion: "2.4.1",
    firstSeen: "2025-12-23", lastVerified: "2026-04-30",
  },
  {
    id: "ge-opal-2",
    name: "Opal 2.0 Nugget Ice Maker",
    manufacturer: "GE Profile",
    model: "XPIO13BCBT",
    category: "kitchen",
    local: "sometimes",
    cloud: "optional",
    ha: "official",
    haIntegration: "SmartHQ",
    reports: 248, installs: 196,
    summary: "Wi-Fi nugget ice maker. The official SmartHQ integration controls it through GE's cloud. Bluetooth control works without internet but only from a phone nearby.",
    entityTypes: ["switch", "sensor", "binary_sensor"],
    softwareVersion: "2.4.1",
    firstSeen: "2025-12-23", lastVerified: "2026-03-12",
  },

  // ----- Pets -----
  {
    id: "surepetcare-microchip-cat-flap",
    name: "Microchip Cat Flap Connect",
    manufacturer: "Sure Petcare",
    model: "SureFlap MCC",
    category: "pets",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Sure Petcare",
    reports: 562, installs: 438,
    summary: "Microchip-reading cat flap with locking modes. State is read from the Sure Petcare cloud. Locking commands round-trip through their service, so latency can spike when their backend is slow.",
    entityTypes: ["binary_sensor", "lock", "sensor"],
    softwareVersion: "2026.05.1",
    firstSeen: "2025-12-23", lastVerified: "2026-02-26",
  },
  {
    id: "petlibro-granary-camera",
    name: "Granary Camera Feeder",
    manufacturer: "Petlibro",
    model: "PLAF203",
    category: "pets",
    local: "never",
    cloud: "required",
    ha: "community",
    haIntegration: "PetLibro (custom integration)",
    reports: 64, installs: 58,
    summary: "Wi-Fi automatic pet feeder with a built-in camera. A community custom integration brings feeding controls and food-level sensors into Home Assistant through the Petlibro cloud. The manufacturer app stays the primary client.",
    entityTypes: ["sensor", "binary_sensor", "switch", "button"],
    specs: { protocols: { wifi: true } },
    softwareVersion: "2026.05.1",
    versionHistory: [{ version: "2026.04.2", lastSeen: "2025-12-31" }, { version: "2026.03.0", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-08",
  },

  // ----- Pool and spa -----
  {
    id: "pentair-intellicenter",
    name: "IntelliCenter Pool Control System",
    manufacturer: "Pentair",
    model: "522036",
    category: "pool",
    local: "always",
    cloud: "optional",
    ha: "official",
    haIntegration: "ScreenLogic",
    reports: 184, installs: 152,
    summary: "Pool automation panel for Pentair pumps, heaters, and lights. The official ScreenLogic integration speaks to the panel directly over the LAN. Cloud is optional and used only by the mobile app.",
    entityTypes: ["climate", "switch", "sensor", "light"],
    softwareVersion: "2.4.1",
    firstSeen: "2025-12-23", lastVerified: "2026-03-22",
  },

  // ----- Vehicles and mobility -----
  {
    id: "tesla-wall-connector-3",
    name: "Wall Connector (Gen 3)",
    manufacturer: "Tesla",
    model: "1457768-02-J",
    category: "vehicles",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "Tesla Wall Connector",
    reports: 386, installs: 304,
    summary: "Hard-wired Level-2 EV charger with a built-in HTTP API on its commissioning Wi-Fi network. Home Assistant reads charging state and power directly from the unit. No manufacturer cloud is involved.",
    entityTypes: ["sensor", "binary_sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2026-01-31" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-19",
  },

  // ----- Window treatments and shading -----
  {
    id: "ikea-fyrtur-roller",
    name: "FYRTUR Blackout Roller Blind",
    manufacturer: "IKEA",
    model: "E1757",
    category: "shading",
    local: "always",
    cloud: "none",
    ha: "official",
    haIntegration: "Zigbee Home Automation (ZHA), Zigbee2MQTT",
    reports: 1438, installs: 1106,
    summary: "Battery-powered blackout roller blind. Pairs to any Zigbee 3.0 coordinator. Works without the IKEA hub or any cloud service.",
    entityTypes: ["cover", "sensor"],
    softwareVersion: "2.4.1",
    versionHistory: [{ version: "2.4.0", lastSeen: "2025-12-23" }, { version: "2.3.7", lastSeen: "2025-12-23" }, { version: "2.3.5", lastSeen: "2025-12-23" }, { version: "2.3.2", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-04-02",
  },

  // ----- Wearables -----
  {
    id: "withings-body-plus",
    name: "Body+ Smart Scale",
    manufacturer: "Withings",
    model: "WBS05",
    category: "wearables",
    local: "never",
    cloud: "required",
    ha: "official",
    haIntegration: "Withings",
    reports: 348, installs: 274,
    summary: "Wi-Fi body-composition scale. Measurements sync to the Withings cloud and Home Assistant reads them from there, the scale never talks to HA directly.",
    entityTypes: ["sensor"],
    softwareVersion: "2026.05.1",
    versionHistory: [{ version: "2026.04.2", lastSeen: "2026-01-31" }, { version: "2026.03.0", lastSeen: "2025-12-23" }, { version: "2026.02.1", lastSeen: "2025-12-23" }, { version: "2026.01.0", lastSeen: "2025-12-23" }],
    firstSeen: "2025-12-23", lastVerified: "2026-03-08",
  },
];

window.CATEGORY_LABEL = Object.fromEntries(window.DEVICE_CATEGORIES.map(c => [c.id, c.label]));

/* =========================================================================
   COMMUNITY-EDIT (increment 02), additional, contributor-maintained fields.

   The fields above this line are the read-only core dataset collected from
   Home Assistant telemetry. Everything below is editable by signed-in
   contributors: a description, install instructions, and structured specs.

   CATEGORY_SPECS maps each device category to a short list of spec fields
   that make sense for that device type. Edit mode renders each as the right
   control (select / number / checkbox / multi / text); read mode shows only
   the ones that have a value.

   control: "text" | "number" | "select" | "bool" | "multi"
   ========================================================================= */
window.CATEGORY_SPECS = {
  hubs: [
    { key: "radios", label: "Radios", control: "multi", options: ["Zigbee", "Thread", "Z-Wave", "Matter", "Wi-Fi", "Bluetooth"] },
    { key: "connection", label: "Host connection", control: "select", options: ["USB", "Ethernet", "Wi-Fi", "Built-in"] },
    { key: "poe", label: "Power over Ethernet", control: "bool" },
    { key: "externalAntenna", label: "External antenna", control: "bool" },
  ],
  controls: [
    { key: "gangs", label: "Gangs", control: "number" },
    { key: "neutralRequired", label: "Neutral wire required", control: "bool" },
    { key: "maxLoad", label: "Max load", control: "text", placeholder: "e.g. 300 W LED" },
    { key: "dimming", label: "Dimming", control: "bool" },
  ],
  cameras: [
    { key: "resolution", label: "Resolution", control: "select", options: ["720p", "1080p", "2K", "4K"] },
    { key: "fieldOfView", label: "Field of view", control: "number", unit: "°" },
    { key: "nightVision", label: "Night vision", control: "bool" },
    { key: "localRecording", label: "Local recording (SD / NVR)", control: "bool" },
    { key: "rtsp", label: "RTSP / ONVIF stream", control: "bool" },
  ],
  cleaning: [
    { key: "suction", label: "Suction", control: "number", unit: "Pa" },
    { key: "battery", label: "Battery capacity", control: "number", unit: "mAh" },
    { key: "mopping", label: "Mopping", control: "bool" },
    { key: "binCapacity", label: "Dustbin capacity", control: "number", unit: "mL" },
    { key: "selfEmptying", label: "Self-emptying dock", control: "bool" },
  ],
  climate: [
    { key: "deviceType", label: "Type", control: "select", options: ["Thermostat", "Radiator valve (TRV)", "AC controller", "Heat pump"] },
    { key: "sensors", label: "Built-in sensors", control: "multi", options: ["Temperature", "Humidity", "Occupancy", "Air quality"] },
    { key: "power", label: "Power", control: "select", options: ["Battery", "Wired", "C-wire"] },
    { key: "stages", label: "Heating / cooling stages", control: "number" },
  ],
  irrigation: [
    { key: "zones", label: "Zones", control: "number" },
    { key: "flowSensor", label: "Flow sensor", control: "bool" },
    { key: "weatherSkip", label: "Weather-based skip", control: "bool" },
    { key: "placement", label: "Placement", control: "select", options: ["Indoor", "Outdoor"] },
  ],
  kitchen: [
    { key: "powerDraw", label: "Power draw", control: "text", placeholder: "e.g. 1500 W" },
    { key: "capacity", label: "Capacity", control: "text", placeholder: "e.g. 1.1 kg" },
    { key: "builtInCamera", label: "Built-in camera", control: "bool" },
  ],
  lighting: [
    { key: "luminousFlux", label: "Luminous flux", control: "number", unit: "lm" },
    { key: "colorTemp", label: "Colour temperature", control: "text", placeholder: "e.g. 2200–6500 K" },
    { key: "colorCapability", label: "Colour capability", control: "select", options: ["White", "Tunable white", "Full colour (RGB)"] },
    { key: "base", label: "Base / fitting", control: "select", options: ["E26", "E27", "B22", "GU10", "GU5.3", "Integrated"] },
    { key: "dimmable", label: "Dimmable", control: "bool" },
  ],
  presence: [
    { key: "sensingTech", label: "Sensing technology", control: "select", options: ["PIR", "mmWave radar", "Ultrasonic", "PIR + mmWave"] },
    { key: "range", label: "Detection range", control: "number", unit: "m" },
    { key: "zones", label: "Configurable zones", control: "number" },
    { key: "luxSensor", label: "Light (lux) sensor", control: "bool" },
  ],
  pool: [
    { key: "channels", label: "Controlled channels", control: "number" },
    { key: "pumpControl", label: "Pump control", control: "bool" },
    { key: "heaterControl", label: "Heater control", control: "bool" },
    { key: "chemistry", label: "Water-chemistry sensing", control: "bool" },
  ],
  pets: [
    { key: "capacity", label: "Capacity", control: "text", placeholder: "e.g. 5 L hopper" },
    { key: "builtInCamera", label: "Built-in camera", control: "bool" },
    { key: "microchipReader", label: "Microchip reader", control: "bool" },
    { key: "scheduling", label: "Scheduled dispensing", control: "bool" },
  ],
  power: [
    { key: "maxLoad", label: "Max load", control: "text", placeholder: "e.g. 16 A / 3680 W" },
    { key: "energyMonitoring", label: "Energy monitoring", control: "bool" },
    { key: "formFactor", label: "Form factor", control: "select", options: ["Plug", "DIN-rail", "Inline relay", "Outlet"] },
    { key: "perOutlet", label: "Per-outlet control", control: "bool" },
  ],
  security: [
    { key: "boltType", label: "Bolt type", control: "select", options: ["Deadbolt", "Lever", "Mortise", "Rim", "Euro cylinder"] },
    { key: "keypad", label: "Keypad", control: "bool" },
    { key: "fingerprint", label: "Fingerprint reader", control: "bool" },
    { key: "autoLock", label: "Auto-lock", control: "bool" },
    { key: "power", label: "Power", control: "select", options: ["Battery", "Wired"] },
  ],
  sensors: [
    { key: "measurements", label: "Measurements", control: "multi", options: ["Temperature", "Humidity", "Pressure", "Air quality", "Water leak", "Vibration", "Light", "CO₂"] },
    { key: "battery", label: "Battery", control: "select", options: ["CR2032", "CR2450", "AA", "AAA", "Rechargeable", "Wired"] },
    { key: "reportingInterval", label: "Reporting interval", control: "text", placeholder: "e.g. every 5 min" },
    { key: "ipRating", label: "IP rating", control: "text", placeholder: "e.g. IP67" },
  ],
  entertainment: [
    { key: "deviceType", label: "Type", control: "select", options: ["Speaker", "Streaming player", "TV", "AV receiver", "Soundbar"] },
    { key: "audioOutput", label: "Audio output", control: "text", placeholder: "e.g. 2× Class-D drivers" },
    { key: "maxResolution", label: "Max video resolution", control: "select", options: ["None", "1080p", "4K", "8K"] },
    { key: "multiroom", label: "Multi-room audio", control: "bool" },
  ],
  vehicles: [
    { key: "deviceType", label: "Type", control: "select", options: ["EV charger", "Battery / storage", "Telematics"] },
    { key: "maxPower", label: "Max power", control: "text", placeholder: "e.g. 11 kW" },
    { key: "connector", label: "Connector", control: "select", options: ["Type 1", "Type 2", "NACS", "CCS"] },
    { key: "phases", label: "Phases", control: "select", options: ["Single-phase", "Three-phase"] },
  ],
  wearables: [
    { key: "measurements", label: "Measurements", control: "multi", options: ["Weight", "Body composition", "Heart rate", "Sleep", "Steps", "Temperature"] },
    { key: "battery", label: "Battery", control: "text", placeholder: "e.g. rechargeable, 12 mo" },
    { key: "waterResistance", label: "Water resistance", control: "text", placeholder: "e.g. 5 ATM" },
  ],
  shading: [
    { key: "deviceType", label: "Type", control: "select", options: ["Roller blind", "Venetian", "Cellular", "Curtain track", "Roman"] },
    { key: "power", label: "Power", control: "select", options: ["Battery", "Wired", "Solar"] },
    { key: "maxWidth", label: "Max width", control: "text", placeholder: "e.g. 2.4 m" },
    { key: "tilt", label: "Tilt control", control: "bool" },
  ],
};

/* =========================================================================
   Custom fields (contributor-added extras)
   -------------------------------------------------------------------------
   The category spec lists above are the canonical, comparable fields. To give
   contributors room for genuinely device-specific details that aren't on that
   list, each device may carry extra rows: a free label
   plus a short text value, stored on specs.customFields as [{ label, value }].

   To keep the vocabulary from fragmenting, the label input suggests labels
   already used by other contributors in the same category. People can still
   type their own. When a label catches on across many devices, maintainers
   discuss promoting it to a standard category field (handled off-app). The
   seed lists below stand in for "labels already in use" in this category.
   ========================================================================= */
window.CUSTOM_SPEC_SUGGESTIONS = {
  hubs:          ["Max paired devices", "Backup / restore", "Processor", "Onboard storage", "Cooling"],
  controls:      ["Faceplate material", "Replaceable buttons", "Scene buttons", "LED indicator"],
  cameras:       ["Two-way audio", "Onboard AI detection", "Storage type", "Spotlight", "Solar option"],
  cleaning:      ["Obstacle avoidance", "Mapping type", "Noise level", "Climb height", "App-free operation"],
  climate:       ["Display type", "Geofencing", "Open-window detection", "Mounting"],
  irrigation:    ["Valve type", "Rain delay", "Master valve support", "Enclosure rating"],
  kitchen:       ["Water tank", "Descaling alert", "Preset programs", "Voice prompts"],
  lighting:      ["Beam angle", "CRI", "Lifespan", "Flicker-free", "Mounting"],
  presence:      ["Mounting height", "Detection angle", "Fall detection", "False-trigger filtering"],
  pool:          ["Salt-water safe", "Probe type", "Calibration", "Enclosure rating"],
  pets:          ["Portion sizes", "Backup power", "Voice recording", "Cleaning"],
  power:         ["Surge protection", "USB ports", "Standby draw", "Tamper protection"],
  security:      ["Backup keyway", "Auto-unlock", "Tamper alarm", "Finish options", "Weather rating"],
  sensors:       ["Mounting", "Tamper detection", "Operating range", "Accuracy"],
  entertainment: ["HDMI ports", "Voice assistant", "Codec support", "Display"],
  vehicles:      ["Cable length", "Load balancing", "Enclosure rating", "RFID access"],
  wearables:     ["Display", "Companion required", "Charging time", "Strap options"],
  shading:       ["Noise level", "Manual override", "Mounting", "Fabric options"],
};

// Labels already in use for a category: the seed list above unioned with any
// custom labels actually present on devices in that category. Used to power
// the label suggestions in the editor so contributors converge on shared
// wording instead of inventing a new label for the same thing.
window.customSpecSuggestions = function (category) {
  const seed = (window.CUSTOM_SPEC_SUGGESTIONS && window.CUSTOM_SPEC_SUGGESTIONS[category]) || [];
  const seen = new Map(); // lower-cased label -> display label (first wins)
  seed.forEach((l) => { const k = l.trim().toLowerCase(); if (k && !seen.has(k)) seen.set(k, l.trim()); });
  (window.DEVICES || []).forEach((d) => {
    if (d.category !== category) return;
    const cf = d.specs && d.specs.customFields;
    if (!Array.isArray(cf)) return;
    cf.forEach((row) => {
      const l = row && row.label ? String(row.label).trim() : '';
      const k = l.toLowerCase();
      if (k && !seen.has(k)) seen.set(k, l);
    });
  });
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
};

/* Ecosystem certifications shown as their own checkboxes, plus a free list of
   "other" ecosystems. Manufacturer-detail flags sit alongside. */
window.ECOSYSTEM_OPTIONS = [
  { key: "homeAssistant", label: "Home Assistant" },
  { key: "amazonAlexa", label: "Amazon Alexa" },
  { key: "appleHome", label: "Apple Home" },
  { key: "googleHome", label: "Google Home" },
  { key: "homey", label: "Homey" },
  { key: "smartThings", label: "SmartThings" },
];
window.MANUFACTURER_FLAGS = [
  { key: "subscriptionFeatures", label: "Subscription features" },
];
// Proprietary app is a single tri-state: does a first-party app exist, and are
// you forced to use it? "No" = none, "Optional" = exists but you can run the
// device without it, "Required" = needed at least for setup.
window.PROPRIETARY_APP_OPTIONS = ["No", "Optional", "Required"];
window.PROTOCOL_OPTIONS = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "ethernet", label: "Ethernet" },
  { key: "thread", label: "Thread" },
  { key: "matterThread", label: "Matter over Thread" },
  { key: "matterWifi", label: "Matter over Wi-Fi" },
  { key: "zigbee", label: "Zigbee" },
  { key: "zwave", label: "Z-Wave" },
  { key: "bluetooth", label: "Bluetooth" },
];

/* Pending edits seeded into the demo so the "awaiting review" treatment is
   visible in edit mode without first submitting one. The pending store
   (pending-edits.jsx) hydrates from this when localStorage is empty.
   Read mode never shows these, it always renders the approved record. */
window.PENDING_SEED = {
  "philips-hue-white-a19": {
    "name": {
      value: "Philips Hue White A19",
      by: "localwatt", at: "2026-06-03T11:20:00", pr: 1260
    },
    "photos": {
      value: ["assets/hue-white-a19-bulb.jpeg", "placeholder:studio-front"],
      by: "zigbit", at: "2026-06-02T17:10:00", pr: 1262
    },
    "description": {
      value: "The White A19 is the most basic bulb in the Hue range: soft white only, no colour or tunable white. Most owners buy it for lamps and fixtures where colour isn't needed but reliable Zigbee dimming is.\n\nA recent revision quietly improved the dimming curve at the low end, so it no longer flickers below about 5% brightness. Older stock may still exhibit the flicker.",
      by: "northlight", at: "2026-05-28T10:12:00", pr: 1188
    },
    "summary": {
      value: "A reliable soft-white A19 for everyday fixtures. Pairs to a Hue Bridge over Zigbee, or directly to any Zigbee 3.0 coordinator without the bridge. Bluetooth is used only for out-of-box setup.",
      by: "localwatt", at: "2026-06-01T14:30:00", pr: 1242
    },
    "instructions": {
      value: { text: "Screw the bulb into a powered fixture, then add it in the Hue app under Settings, Add light. Once the bridge sees it, refresh the Philips Hue integration in Home Assistant.\n\nTo skip the bridge, power-cycle the bulb three times to enter pairing mode and add it directly from ZHA or Zigbee2MQTT.", manualUrl: "https://www.philips-hue.com/en-us/support" },
      by: "meshowl", at: "2026-05-30T09:15:00", pr: 1231
    },
    "spec:luminousFlux": { value: 1100, by: "northlight", at: "2026-05-28T10:12:00", pr: 1190 },
    "spec:colorTemp": { value: "2200–6500 K", by: "localwatt", at: "2026-06-03T08:05:00", pr: 1256 },
    "spec:colorCapability": { value: "Tunable white", by: "relaynode", at: "2026-06-02T16:48:00", pr: 1250 },
    "spec:dimmable": { value: false, by: "zigbit", at: "2026-05-26T11:20:00", pr: 1198 },
    "spec:base": { value: "E26", by: "relaynode", at: "2026-05-31T14:05:00", pr: 1264 },
    "ecosystems": {
      value: { smartThings: true, proprietaryApp: "Required", appLinks: { ios: "https://apps.apple.com/app/philips-hue/id1055281310", android: "https://play.google.com/store/apps/details?id=com.philips.lighting.hue2" } },
      by: "meshowl", at: "2026-05-29T13:02:00", pr: 1224
    },
    "connectivity": {
      value: { initialSetup: "Manufacturer account", dayToDay: "Local", offline: "Limited" },
      by: "localwatt", at: "2026-06-02T12:15:00", pr: 1252
    },
    "protocols": {
      value: { zigbee: true, matterThread: true, bluetooth: true },
      by: "zigbit", at: "2026-06-01T10:40:00", pr: 1240
    },
    "identifiers": {
      value: { ean: "8719514291201", sku: "046677562779" },
      by: "relaynode", at: "2026-05-27T15:55:00", pr: 1205
    },
    "bridge": {
      value: { proprietary: "Philips Hue Bridge" },
      by: "northlight", at: "2026-06-01T09:50:00", pr: 1266
    },
    "dimensions": {
      value: [{ name: "Bulb", height: 110, width: 62, depth: 62 }],
      by: "meshowl", at: "2026-06-03T08:40:00", pr: 1268
    },
    "references": {
      value: [{ label: "Philips Hue, White A19 product page", url: "https://www.philips-hue.com/" }, { label: "Hue White A19 on Zigbee2MQTT", url: "https://www.zigbee2mqtt.io/devices/9290011998.html" }],
      by: "northlight", at: "2026-06-02T09:30:00", pr: 1248
    },
    "connectsWith": {
      value: {
        smartThings: {
          setup: "In the SmartThings app, tap Add device, then Scan nearby. Put the bulb into pairing mode by power-cycling it three times, and it joins as a Zigbee device.\n\nA SmartThings hub or Station is required, since this bulb has no Matter or Wi-Fi radio of its own.",
          limitations: "SmartThings controls on, off, and brightness only. Scenes and dynamic effects created in the Hue app are not mirrored into SmartThings.\n\nWithout a SmartThings hub the bulb cannot be added at all.",
          docsUrl: "https://www.samsung.com/us/smartthings/"
        }
      },
      by: "meshowl", at: "2026-05-29T13:02:00", pr: 1224
    }
  },
  "aqara-fp2": {
    "instructions": {
      value: { text: "The FP2 must be set up through the Aqara Home app first, it provisions onto your 2.4 GHz Wi-Fi and registers with the Aqara cloud. Once provisioned, enable HomeKit in the app and Home Assistant can pair it locally via the HomeKit Controller integration.\n\nMount it at chest height, angled into the room. Zones are drawn in the Aqara app and surface in Home Assistant as separate occupancy entities.", manualUrl: "https://www.aqara.com/en/product/presence-sensor-fp2/" },
      by: "meshowl", at: "2026-05-30T09:40:00"
    }
  },
  "shelly-plus-1": {
    "references": {
      value: [{ label: "Shelly Plus 1 RPC API", url: "https://shelly-api-docs.shelly.cloud/gen2/" }],
      by: "robinhass", at: "2026-06-04T19:38:00", pr: 1281
    }
  },
  "yale-assure-lock-2": {
    "instructions": {
      value: { text: "Pull the Z-Wave 700 module tab to wake the radio, then start Z-Wave inclusion in Home Assistant and press the lock's interior button twice. Pair within range of the controller for a clean S2 handshake, then move it to the door.", manualUrl: "https://www.yalehome.com/" },
      by: "robinhass", at: "2026-05-29T08:12:00", pr: 1259
    }
  }
};

/* Drafts saved to the signed-in demo account (window.CURRENT_USER), part of
   the mocked backend. A draft is an in-progress, unsubmitted edit that belongs
   to the account, not to one machine, so it follows the contributor to any
   device they sign in on. The draft store (drafts.jsx) hydrates from this when
   localStorage is empty, then persists locally as the prototype's stand-in for
   server storage. Keyed by deviceId. `by` scopes ownership to the account.
   Shape: { [deviceId]: { fields: { [fieldKey]: value }, sources?, at, by } } */
window.DRAFTS_SEED = {
  "wyze-cam-v3": {
    fields: {
      summary: "Budget 2K camera. Home Assistant control is local only after flashing the docker-wyze-bridge, the stock firmware is cloud-only and exposes no documented local API."
    },
    by: "robinhass",
    at: "2026-06-03T18:24:00"
  },
  "ecobee-premium": {
    fields: {
      references: [{ label: "ecobee Developer API documentation", url: "https://www.ecobee.com/home/developer/api/introduction/index.shtml" }]
    },
    by: "robinhass",
    at: "2026-06-04T09:10:00"
  }
};

/* Notifications seeded for the signed-in demo account (window.CURRENT_USER).
   Mirrors the contribution lifecycle: a submitted edit opens a pull request,
   then is either merged (live) or declined. The on-site inbox (notifications
   increment) hydrates from this when localStorage is empty. Newest first.
   `pr` is a number; the inbox builds the GitHub URL from PR_BASE. */
window.NOTIF_SEED = [
  {
    // Real pending edit: Robin added RPC API references for Shelly Plus 1,
    // PR opened during the review queue on 4 Jun.
    id: "n-1281",
    type: "pr",
    deviceId: "shelly-plus-1",
    device: "Plus 1",
    pr: 1281,
    ts: "2026-06-04T19:38:00",
    read: false
  },
  {
    // Real merged edit: Robin confirmed revised low-end dimming on a
    // second Hue White A19 unit; edit approved and went live on 1 Jun.
    id: "n-1266",
    type: "live",
    deviceId: "philips-hue-white-a19",
    device: "Hue White A19",
    pr: 1266,
    ts: "2026-06-01T20:14:00",
    read: false
  },
  {
    // Real pending edit: Robin documented Z-Wave 700 inclusion steps
    // for the Yale lock; PR still in review as of 29 May.
    id: "n-1259",
    type: "pr",
    deviceId: "yale-assure-lock-2",
    device: "Assure Lock 2 (Z-Wave)",
    pr: 1259,
    ts: "2026-05-29T08:12:00",
    read: true
  },
  {
    // Real merged edit: Robin added a Valetudo note to the Roborock
    // S8 Pro Ultra; edit approved and went live on 21 May.
    id: "n-1241",
    type: "live",
    deviceId: "roborock-s8-pro-ultra",
    device: "S8 Pro Ultra",
    pr: 1241,
    ts: "2026-05-21T13:09:00",
    read: true
  },
  {
    // A Hue White A19 dimming-curve suggestion Robin proposed that the
    // reviewers sent back; not in the live record because it was declined.
    id: "n-1209",
    type: "declined",
    deviceId: "philips-hue-white-a19",
    device: "Hue White A19",
    pr: 1209,
    ts: "2026-05-14T11:20:00",
    read: true,
    // What Robin proposed before it was sent back: a claim that the bulb
    // is tunable white, plus a low-end dimming note. Shown on Your changes so
    // a declined edit can be picked back up.
    changes: [
      { field: "spec:colorCapability", verb: "updated", from: "White", to: "Tunable white" },
      { field: "description", verb: "updated", detail: "added a flicker-free dimming-to-1% note" }
    ]
  }
];

// Every device in this database works with Home Assistant — default the
// Home Assistant ecosystem flag to true everywhere. A richer per-device
// ecosystems value can still be edited; this just sets the baseline in code
// so it stays in sync as devices are added.
window.DEVICES.forEach(function (d) {
  d.specs = d.specs || {};
  d.specs.ecosystems = d.specs.ecosystems || { others: [] };
  d.specs.ecosystems.homeAssistant = true;
  // Protocols: normalise the legacy array form (["zigbee"]) into an object
  // map ({ zigbee: true }) so a protocol can carry three states — true (yes),
  // false (no), or absent (not set) — mirroring the ecosystems model.
  if (Array.isArray(d.specs.protocols)) {
    var obj = {};
    d.specs.protocols.forEach(function (k) { obj[k] = true; });
    d.specs.protocols = obj;
  }
  // Migrate the legacy single `matter` flag to the explicit transport-specific
  // options. Matter always runs over Thread or Wi-Fi, so map it onto whichever
  // radio the device carries (defaulting to Thread when ambiguous).
  var p = d.specs.protocols;
  if (p && typeof p === 'object' && p.matter) {
    if (p.wifi && !p.thread) p.matterWifi = true;
    else p.matterThread = true;
    delete p.matter;
  }
  // Merge the legacy proprietaryApp (bool) + appRequired (bool) pair into a
  // single tri-state proprietaryApp string: Required > Optional > No.
  var e = d.specs.ecosystems;
  if (e && typeof e === 'object' && (typeof e.proprietaryApp === 'boolean' || 'appRequired' in e)) {
    if (e.appRequired) e.proprietaryApp = 'Required';
    else if (e.proprietaryApp === true) e.proprietaryApp = 'Optional';
    else e.proprietaryApp = 'No';
    delete e.appRequired;
  }
  // Rename the legacy `hub` field to `bridge`. Open coordinators are now the
  // assumed default rather than a stored choice, so only a proprietary bridge
  // name carries over.
  if (d.specs.hub && !d.specs.bridge) {
    var h = d.specs.hub;
    d.specs.bridge = {};
    if (h.coordinator === 'Proprietary hub' && h.name) d.specs.bridge.proprietary = h.name;
    delete d.specs.hub;
  }
});

/* =========================================================================
   CONNECTS WITH — per-ecosystem setup, driven by default templates
   -------------------------------------------------------------------------
   Stage 2 replaces the standalone "Home Assistant" and "Setup and
   installation" sections with a single "Connects with" section. It shows one
   tab per ecosystem marked compatible in the Ecosystems group
   (specs.ecosystems[key] === true). No tab for "not compatible" (false) or
   "unknown" (absent). Home Assistant is true on every device, so there is
   always at least the Home Assistant tab; with only one tab the read view
   flattens (no tab bar).

   Default setup instructions are PROTOCOL × ECOSYSTEM specific, not
   per-device. They are the starting point: contributors edit, extend, or
   leave them at the device level. Per-device overrides live in
   specs.connectsWith[ecoKey]; anything a contributor has not touched falls
   back to the template at render time, so template improvements reach every
   device that never customised.
   ========================================================================= */

// The six known ecosystems that can earn a tab, in display order. The free
// "others" list does NOT get tabs (decision: stage 2 scope).
window.CONNECTS_WITH_ECOSYSTEMS = ['homeAssistant', 'amazonAlexa', 'appleHome', 'googleHome', 'homey', 'smartThings'];

// Which protocol drives a default. Matter/Thread lead, then the mesh radios,
// then IP transports. Multi-protocol devices get one setup section PER active
// protocol (each under its own subheader), so the order here is also the
// order the subheaders appear in.
window.CONNECTS_WITH_PROTOCOL_ORDER = ['matterThread', 'matterWifi', 'thread', 'zigbee', 'zwave', 'wifi', 'ethernet', 'bluetooth'];

/* Map of Home Assistant integration tokens to their docs URLs. Patterns are
   tested against each token split from a device's `haIntegration` string.
   (Relocated from detail.jsx so the Connects with resolver can reuse it.) */
window.HA_DOC_PATTERNS = [
  { re: /philips hue/i,                 label: "Philips Hue",        href: "https://www.home-assistant.io/integrations/hue/" },
  { re: /zigbee home automation|\bzha\b/i, label: "Zigbee Home Automation (ZHA)", href: "https://www.home-assistant.io/integrations/zha/" },
  { re: /zigbee2mqtt/i,                 label: "Zigbee2MQTT",        href: "https://www.zigbee2mqtt.io/" },
  { re: /\blifx\b/i,                    label: "LIFX",               href: "https://www.home-assistant.io/integrations/lifx/" },
  { re: /lutron cas[eé]ta/i,            label: "Lutron Caséta",      href: "https://www.home-assistant.io/integrations/lutron_caseta/" },
  { re: /\bshelly\b/i,                  label: "Shelly",             href: "https://www.home-assistant.io/integrations/shelly/" },
  { re: /z-?wave js/i,                  label: "Z-Wave JS",          href: "https://www.home-assistant.io/integrations/zwave_js/" },
  { re: /\becobee\b/i,                  label: "Ecobee",             href: "https://www.home-assistant.io/integrations/ecobee/" },
  { re: /homekit controller/i,          label: "HomeKit Controller", href: "https://www.home-assistant.io/integrations/homekit_controller/" },
  { re: /\baugust\b/i,                  label: "August",             href: "https://www.home-assistant.io/integrations/august/" },
  { re: /\broborock\b/i,                label: "Roborock",           href: "https://www.home-assistant.io/integrations/roborock/" },
  { re: /\birobot\b/i,                  label: "iRobot Roomba",      href: "https://www.home-assistant.io/integrations/roomba/" },
  { re: /tp-?link kasa/i,               label: "TP-Link Kasa Smart", href: "https://www.home-assistant.io/integrations/tplink/" },
  { re: /\bswitchbot\b/i,               label: "SwitchBot",          href: "https://www.home-assistant.io/integrations/switchbot/" },
  { re: /openthread border router|\botbr\b/i, label: "OpenThread Border Router", href: "https://www.home-assistant.io/integrations/otbr/" },
  { re: /honeywell home/i,              label: "Honeywell Home (Resideo)", href: "https://www.home-assistant.io/integrations/honeywell/" },
  { re: /\breolink\b/i,                 label: "Reolink",            href: "https://www.home-assistant.io/integrations/reolink/" },
  { re: /\bsonos\b/i,                   label: "Sonos",              href: "https://www.home-assistant.io/integrations/sonos/" },
  { re: /google cast/i,                 label: "Google Cast",        href: "https://www.home-assistant.io/integrations/cast/" },
  { re: /android tv remote/i,           label: "Android TV Remote",  href: "https://www.home-assistant.io/integrations/androidtv_remote/" },
  { re: /\brachio\b/i,                  label: "Rachio",             href: "https://www.home-assistant.io/integrations/rachio/" },
  { re: /sure petcare/i,                label: "Sure Petcare",       href: "https://www.home-assistant.io/integrations/surepetcare/" },
  { re: /\bwithings\b/i,                label: "Withings",           href: "https://www.home-assistant.io/integrations/withings/" },
  { re: /\baqara\b/i,                   label: "Aqara",              href: "https://www.home-assistant.io/integrations/aqara/" },
  { re: /\bschlage\b/i,                 label: "Schlage",            href: "https://www.home-assistant.io/integrations/schlage/" },
  { re: /\bdreame\b/i,                  label: "Dreame",             href: "https://www.home-assistant.io/integrations/dreame/" },
  { re: /\bwyze\b/i,                    label: "Wyze",               href: "https://www.home-assistant.io/integrations/wyze/" },
  { re: /hydrawise/i,                   label: "Hydrawise",          href: "https://www.home-assistant.io/integrations/hydrawise/" },
  { re: /smarthq/i,                     label: "SmartHQ",            href: "https://www.home-assistant.io/integrations/smarthq/" },
  { re: /home ?connect/i,               label: "Home Connect",       href: "https://www.home-assistant.io/integrations/home_connect/" },
  { re: /screenlogic/i,                 label: "ScreenLogic",        href: "https://www.home-assistant.io/integrations/screenlogic/" },
  { re: /tesla wall connector/i,        label: "Tesla Wall Connector", href: "https://www.home-assistant.io/integrations/tesla_wall_connector/" },
];
window.splitIntegrationTokens = function (s) {
  if (!s) return [];
  return s.split(/\s*,\s*|\s+or\s+/i).map(function (t) { return t.trim(); }).filter(Boolean);
};
window.haDocsLinksFor = function (haIntegration) {
  var out = [], seen = {};
  window.splitIntegrationTokens(haIntegration).forEach(function (token) {
    var match = window.HA_DOC_PATTERNS.find(function (p) { return p.re.test(token); });
    if (!match || seen[match.href]) return;
    seen[match.href] = true;
    out.push({ label: match.label, href: match.href, token: token });
  });
  return out;
};

// Default setup instructions. Keyed by ecosystem, then by protocol. `text`
// uses blank lines between paragraphs (rendered by <Paragraphs>). A `fallback`
// covers devices whose protocol has no specific template.
window.CONNECTS_WITH_TEMPLATES = {
  homeAssistant: {
    docsByProtocol: {
      zigbee:       { label: "ZHA documentation", href: "https://www.home-assistant.io/integrations/zha/" },
      zwave:        { label: "Z-Wave JS documentation", href: "https://www.home-assistant.io/integrations/zwave_js/" },
      matterThread: { label: "Matter documentation", href: "https://www.home-assistant.io/integrations/matter/" },
      matterWifi:   { label: "Matter documentation", href: "https://www.home-assistant.io/integrations/matter/" },
      thread:       { label: "Thread documentation", href: "https://www.home-assistant.io/integrations/thread/" },
      bluetooth:    { label: "Bluetooth documentation", href: "https://www.home-assistant.io/integrations/bluetooth/" },
    },
    byProtocol: {
      zigbee: { title: "Pair over Zigbee", text: "Put the device into pairing mode. This is usually a button hold or a power-cycle sequence, check the manufacturer manual for the exact steps.\n\nIn Home Assistant, open your Zigbee integration (ZHA or Zigbee2MQTT) and start a new scan. The device joins the mesh and its entities appear automatically. A Zigbee coordinator is required." },
      zwave: { title: "Include over Z-Wave", text: "In Home Assistant, open the Z-Wave JS integration and choose Add device. Trigger inclusion on the device, which is typically a triple-press of the action button.\n\nFor a device that supports Z-Wave security, enter the DSK PIN printed on the label when prompted. A Z-Wave controller is required." },
      matterThread: { title: "Commission over Matter", text: "In Home Assistant, open the Matter integration and choose Add device, then scan the Matter QR code or enter the 11-digit setup code on the device or its packaging.\n\nA Thread border router on your network is required for Matter over Thread devices. The device can be shared with other ecosystems at the same time using multi-admin." },
      matterWifi: { title: "Commission over Matter", text: "In Home Assistant, open the Matter integration and choose Add device, then scan the Matter QR code or enter the 11-digit setup code.\n\nThe device joins your 2.4 GHz Wi-Fi during commissioning. No Thread border router is needed. The device can be shared with other ecosystems at the same time using multi-admin." },
      thread: { title: "Connect over Thread", text: "Make sure a Thread border router is running on your network. In Home Assistant, the Thread integration shows the device once it has joined a Thread network. Most Thread devices are commissioned as Matter accessories." },
      wifi: { title: "Connect over Wi-Fi", text: "Connect the device to your 2.4 GHz network using the manufacturer app. In Home Assistant, add the matching integration.\n\nSome Wi-Fi devices expose a local API and work without the cloud. Others route through the manufacturer service. The Connectivity panel above notes which applies to this device." },
      ethernet: { title: "Connect over Ethernet", text: "Plug the device into your network. Home Assistant usually discovers it on the LAN. If not, add the matching integration and enter the device IP address." },
      bluetooth: { title: "Connect over Bluetooth", text: "Home Assistant needs a Bluetooth adapter on the host, or a Bluetooth proxy within range of the device. Add the matching integration and the device is discovered when it is nearby." },
    },
    fallback: { title: "Add to Home Assistant", text: "Add the matching integration from Settings, Devices and services, Add integration. Follow the on-screen steps to connect this device." }
  },
  appleHome: {
    docsUrl: "https://support.apple.com/en-us/HT204893",
    byProtocol: {
      matterThread: { title: "Add to Apple Home", text: "Open the Home app and tap Add Accessory, then scan the Matter QR code or enter the setup code.\n\nApple Home acts as the Thread border router on a HomePod or Apple TV. The accessory can stay paired to Home Assistant at the same time using Matter multi-admin." },
      matterWifi: { title: "Add to Apple Home", text: "Open the Home app and tap Add Accessory, then scan the Matter QR code or enter the setup code. The accessory joins your Wi-Fi during setup." },
      zigbee: { title: "Add through a bridge", text: "Zigbee accessories reach Apple Home through a compatible bridge, either the manufacturer hub or a Matter bridge that re-exposes them. Add the bridge in the Home app, then its accessories appear automatically." },
      wifi: { title: "Add to Apple Home", text: "If the device is HomeKit certified, add it in the Home app with the HomeKit code. Otherwise it reaches Apple Home through the manufacturer app or a Matter bridge." },
    },
    fallback: { title: "Add to Apple Home", text: "Add this device in the Home app if it is HomeKit or Matter certified, or through the manufacturer bridge where one is provided." }
  },
  googleHome: {
    docsUrl: "https://support.google.com/googlenest/answer/9159862",
    byProtocol: {
      matterThread: { title: "Add to Google Home", text: "In the Google Home app, tap Add, Set up device, then scan the Matter QR code or enter the setup code. A Google Nest hub with a Thread border router is needed for Matter over Thread devices." },
      matterWifi: { title: "Add to Google Home", text: "In the Google Home app, tap Add, Set up device, then scan the Matter QR code or enter the setup code. The device joins your Wi-Fi during setup." },
      wifi: { title: "Link the manufacturer account", text: "Set the device up in the manufacturer app first. In the Google Home app, tap Add, Works with Google Home, then link the manufacturer account so the device appears." },
    },
    fallback: { title: "Add to Google Home", text: "Add the device in the Google Home app, either as a Matter accessory or by linking the manufacturer account under Works with Google Home." }
  },
  amazonAlexa: {
    docsUrl: "https://www.amazon.com/alexasmarthome",
    byProtocol: {
      matterThread: { title: "Add to Alexa", text: "In the Alexa app, open Devices, tap the plus, Add device, then Matter. Scan the QR code or enter the setup code. An Echo with a Thread border router is needed for Matter over Thread devices." },
      matterWifi: { title: "Add to Alexa", text: "In the Alexa app, open Devices, tap the plus, Add device, then Matter. Scan the QR code or enter the setup code." },
      wifi: { title: "Enable the manufacturer skill", text: "Set the device up in the manufacturer app first. In the Alexa app, search for the manufacturer skill, enable it, and link the account. Then run device discovery." },
    },
    fallback: { title: "Add to Alexa", text: "Add the device in the Alexa app, either as a Matter accessory or by enabling the manufacturer skill and running discovery." }
  },
  homey: {
    docsUrl: "https://homey.app/en-us/connects-with/",
    fallback: { title: "Add to Homey", text: "In the Homey app, add the manufacturer app from the App Store, then add the device from that app. Matter accessories can be added directly under Add device, Matter." }
  },
  smartThings: {
    docsUrl: "https://www.samsung.com/us/smartthings/",
    byProtocol: {
      matterThread: { title: "Add to SmartThings", text: "In the SmartThings app, tap Add device, then scan the Matter QR code. A SmartThings hub or Station with a Thread border router is needed for Matter over Thread devices." },
      zigbee: { title: "Add to SmartThings", text: "A SmartThings hub or Station is required. In the app, tap Add device, then Scan nearby, and put the device into pairing mode." },
      zwave: { title: "Add to SmartThings", text: "A SmartThings hub or Station is required. In the app, tap Add device, Scan nearby, and trigger Z-Wave inclusion on the device." },
    },
    fallback: { title: "Add to SmartThings", text: "Add the device in the SmartThings app under Add device, either as a Matter accessory, by scanning nearby, or via the manufacturer partner integration." }
  }
};

window.connectsWithEcoLabel = function (key) {
  var o = (window.ECOSYSTEM_OPTIONS || []).find(function (x) { return x.key === key; });
  return o ? o.label : key;
};
window.connectsWithActiveProtocols = function (device) {
  var p = (device.specs && device.specs.protocols) || {};
  return (window.CONNECTS_WITH_PROTOCOL_ORDER || []).filter(function (k) { return p[k] === true; });
};
// Ecosystem keys that earn a tab, in display order.
window.connectsWithTabs = function (device) {
  var eco = (device.specs && device.specs.ecosystems) || {};
  return (window.CONNECTS_WITH_ECOSYSTEMS || []).filter(function (k) { return eco[k] === true; });
};
// Build the default (template-derived) setup sections for one ecosystem.
window.connectsWithDefaultSections = function (device, ecoKey) {
  var tpl = (window.CONNECTS_WITH_TEMPLATES || {})[ecoKey] || {};
  // The Home Assistant tab seeds from the device's own legacy setup
  // instructions when present (richer than a generic template).
  if (ecoKey === 'homeAssistant' && device.instructions && device.instructions.text && String(device.instructions.text).trim()) {
    return [{ id: 'setup', title: 'Setup', text: device.instructions.text, manualUrl: device.instructions.manualUrl || '' }];
  }
  var protos = window.connectsWithActiveProtocols(device);
  var by = tpl.byProtocol || {};
  var out = [];
  protos.forEach(function (p) { if (by[p]) out.push({ id: p, title: by[p].title, text: by[p].text }); });
  if (out.length === 0 && tpl.fallback) out.push({ id: 'general', title: tpl.fallback.title, text: tpl.fallback.text });
  return out;
};
// Flatten the template-derived setup sections into a single text block. The
// fixed-field model (stage 2) stores setup as one contributor-editable string,
// so a multi-protocol device's templates are joined with blank-line breaks.
window.connectsWithDefaultSetup = function (device, ecoKey) {
  return window.connectsWithDefaultSections(device, ecoKey)
    .map(function (s) { return (s.text || '').trim(); })
    .filter(Boolean)
    .join('\n\n');
};
// Resolve display-ready Connects with content for one ecosystem.
//
// Fixed-field model (stage 2): every tab has the same three contributor
// fields (setup, limitations, documentation), each a stored override over a
// sensible default. The Home Assistant tab additionally exposes an
// auto-populated, read-only block sourced from the core dataset (integration,
// supported entities, documentation) that contributors cannot edit.
window.connectsWithResolve = function (device, ecoKey) {
  var stored = (device.specs && device.specs.connectsWith && device.specs.connectsWith[ecoKey]) || {};
  var tpl = (window.CONNECTS_WITH_TEMPLATES || {})[ecoKey] || {};
  var protos = window.connectsWithActiveProtocols(device);
  var isHA = ecoKey === 'homeAssistant';

  // Auto-populated, read-only (Home Assistant only).
  var auto = null;
  if (isHA) {
    var haLinks = window.haDocsLinksFor ? window.haDocsLinksFor(device.haIntegration) : [];
    var integrationUrl = haLinks.length ? haLinks[0].href : null;
    var docHref = haLinks.length ? haLinks[0].href : null;
    if (!docHref && tpl.docsByProtocol) {
      for (var i = 0; i < protos.length; i++) {
        if (tpl.docsByProtocol[protos[i]]) { docHref = tpl.docsByProtocol[protos[i]].href; break; }
      }
    }
    auto = {
      integrationName: device.haIntegration || null,
      integrationUrl: integrationUrl,
      entities: (device.entityTypes && device.entityTypes.length) ? device.entityTypes : [],
      docsLink: docHref ? { label: window.connectsWithEcoLabel('homeAssistant') + ' documentation', href: docHref } : null
    };
  }

  // Contributor-editable fields (every tab). An explicit empty string counts
  // as a real override, so a contributor can blank a pre-filled default.
  var setup = stored.setup != null ? stored.setup : window.connectsWithDefaultSetup(device, ecoKey);
  var limitations = stored.limitations != null ? stored.limitations : '';
  var docsUrl = stored.docsUrl != null ? stored.docsUrl : (isHA ? '' : (tpl.docsUrl || ''));
  var docsLink = docsUrl ? { label: 'documentation', href: docsUrl } : null;

  return {
    ecoKey: ecoKey,
    label: window.connectsWithEcoLabel(ecoKey),
    auto: auto,
    setup: setup,
    limitations: limitations,
    docsUrl: docsUrl,
    docsLink: docsLink
  };
};
