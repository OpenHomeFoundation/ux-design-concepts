// household.js — Janssen household demo data for the HA Concept Car prototype.
// Demo scaffolding only: this is prototype infrastructure, not a spec for how
// the real product stores data. All pages read from this object.

export const household = {
  name: "Abbey Road",

  // ---- Personas (demo scaffolding) -------------------------------------
  // bookmarks are route ids; the dock renders up to 6 (the last is always More).
  personas: {
    daan: {
      id: "daan", name: "Daan", role: "maintainer", initials: "Da",
      avatar: "ds/assets/daan.png",
      spaces: ["shared", "personal", "admin"],
      bookmarks: ["home", "automations", "devices"],
      favorites: ["living_room_ceiling", "kitchen_ceiling", "main_bed_lamp", "hallway_ceiling", "garden_string", "garage_ceiling"],
      presence: "home",
      note: "All access. The maintainer doing the invisible labor.",
    },
    sofie: {
      id: "sofie", name: "Sofie", role: "resident", initials: "So",
      avatar: "ds/assets/sofie.png",
      spaces: ["shared", "personal"],
      bookmarks: ["home", "my-dashboard", "my-data", "activity"],
      favorites: ["living_room_lamp", "main_bed_lamp", "kitchen_ceiling"],
      presence: "home",
      note: "Never configured anything. Has her own dashboard and private data.",
    },
    tess: {
      id: "tess", name: "Tess", role: "resident", initials: "Te",
      spaces: ["shared", "personal"], calibrated: "teen",
      bookmarks: ["home", "my-dashboard", "activity"],
      favorites: ["tess_ceiling", "tess_lamp", "living_room_lamp"],
      presence: "away",
      note: "Calibrated teen. Access expands over time.",
    },
    lars: {
      id: "lars", name: "Lars", role: "resident", initials: "La", calibrated: "child",
      spaces: ["shared", "personal"],
      bookmarks: ["home", "my-stuff"],
      favorites: ["lars_lamp"],
      presence: "home",
      note: "Calibrated child. Limited controls, still has a Personal space.",
    },
    greet: {
      id: "greet", name: "Greet", role: "resident", initials: "Gr", calibrated: "accessibility",
      spaces: ["shared", "personal"], homeArea: "annex",
      bookmarks: ["home", "my-dashboard", "activity"],
      favorites: ["greet_ceiling", "greet_lamp"],
      presence: "home",
      note: "Calibrated for accessibility, larger type. Lives in the annex.",
    },
    nour: {
      id: "nour", name: "Nour", role: "non-resident", initials: "No", calibrated: "scoped",
      spaces: ["shared"], scoped: ["ground", "front_door"], expiresAt: "18:00",
      bookmarks: ["home", "front-door"],
      favorites: ["hallway_ceiling", "kitchen_ceiling"],
      presence: "away",
      note: "Nanny. Scoped, time-limited access to the ground floor and front door.",
    },
  },

  // ---- Structure -------------------------------------------------------
  floors: [
    { id: "ground", name: "Ground floor", icon: "home-floor-g", areas: ["living-room", "kitchen", "hallway", "garage"] },
    { id: "first", name: "First floor", icon: "home-floor-1", areas: ["main-bedroom", "tess-room", "lars-room", "bathroom"] },
    { id: "annex", name: "Annex", icon: "home-floor-a", areas: ["greet-room", "greet-ensuite"] },
    { id: "outside", name: "Outside", icon: "tree", areas: ["garden", "driveway"] },
  ],

  areas: {
    "living-room":  { id: "living-room", name: "Living room", floor: "ground", icon: "sofa", temp: 21.4, humidity: 52, lights: 3, lightsOn: 2 },
    "kitchen":      { id: "kitchen", name: "Kitchen", floor: "ground", icon: "fridge", temp: 22.1, humidity: 48, lights: 4, lightsOn: 0 },
    "hallway":      { id: "hallway", name: "Hallway", floor: "ground", icon: "coat-rack", temp: 20.8, humidity: 50, lights: 2, lightsOn: 1 },
    "garage":       { id: "garage", name: "Garage", floor: "ground", icon: "garage", temp: 16.2, humidity: 61, lights: 2, lightsOn: 1 },
    "main-bedroom": { id: "main-bedroom", name: "Main bedroom", floor: "first", icon: "bed-king", temp: 19.6, humidity: 49, lights: 3, lightsOn: 1 },
    "tess-room":    { id: "tess-room", name: "Tess's room", floor: "first", icon: "bed", temp: 20.2, humidity: 47, lights: 2, lightsOn: 0 },
    "lars-room":    { id: "lars-room", name: "Lars's room", floor: "first", icon: "teddy-bear", temp: 20.5, humidity: 48, lights: 1, lightsOn: 1 },
    "bathroom":     { id: "bathroom", name: "Bathroom", floor: "first", icon: "shower", temp: 21.0, humidity: 64, lights: 2, lightsOn: 0 },
    "greet-room":   { id: "greet-room", name: "Greet's room", floor: "annex", icon: "bed", temp: 22.6, humidity: 45, lights: 2, lightsOn: 1 },
    "greet-ensuite":{ id: "greet-ensuite", name: "Greet's ensuite", floor: "annex", icon: "toilet", temp: 22.0, humidity: 58, lights: 1, lightsOn: 0 },
    "garden":       { id: "garden", name: "Garden", floor: "outside", icon: "tree", lights: 1, lightsOn: 0 },
    "driveway":     { id: "driveway", name: "Driveway", floor: "outside", icon: "car", lights: 1, lightsOn: 0 },
  },

  // ---- Entities (flat; filtered per area/type by the views) ------------
  // type: light | climate | lock | camera | sensor | media | voice
  entities: [
    // Living room
    { id: "living_room_ceiling", name: "Ceiling", type: "light", area: "living-room", icon: "ceiling-light", on: true },
    { id: "living_room_lamp", name: "Floor lamp", type: "light", area: "living-room", icon: "floor-lamp", on: true },
    { id: "living_room_tv_backlight", name: "TV backlight", type: "light", area: "living-room", icon: "television-ambient-light", on: false },
    { id: "living_room_thermostat", name: "Thermostat", type: "climate", area: "living-room", icon: "thermostat", mode: "Automatic", current: 21.4, target: 21.0 },
    { id: "living_room_speaker", name: "Speaker", type: "media", area: "living-room", icon: "speaker", state: "Playing", playing: true, track: "Abbey Road, The Beatles" },
    { id: "living_room_cam", name: "Living room", type: "camera", area: "living-room", icon: "cctv", live: true },
    { id: "living_room_co", name: "Smoke alarm", type: "sensor", area: "living-room", icon: "smoke-detector", state: "Not detected", devType: "CO", battery: 84 },
    { id: "living_room_voice", name: "Voice assistant", type: "voice", area: "living-room", icon: "microphone-message", state: "Unknown", devType: "Button press", battery: 47 },
    // Kitchen
    { id: "kitchen_ceiling", name: "Ceiling", type: "light", area: "kitchen", icon: "ceiling-light", on: false },
    { id: "kitchen_counter", name: "Counter", type: "light", area: "kitchen", icon: "led-strip", on: false },
    { id: "kitchen_island", name: "Island", type: "light", area: "kitchen", icon: "ceiling-light", on: false },
    { id: "kitchen_pantry", name: "Pantry", type: "light", area: "kitchen", icon: "ceiling-light", on: false },
    { id: "kitchen_thermostat", name: "Thermostat", type: "climate", area: "kitchen", icon: "thermostat", mode: "Automatic", current: 22.1, target: 21.0 },
    { id: "kitchen_motion", name: "Motion", type: "sensor", area: "kitchen", icon: "motion-sensor", state: "Clear", devType: "Motion", battery: 12 },
    // Hallway
    { id: "hallway_ceiling", name: "Ceiling", type: "light", area: "hallway", icon: "ceiling-light", on: true },
    { id: "hallway_accent", name: "Accent", type: "light", area: "hallway", icon: "wall-sconce", on: false },
    { id: "front_door", name: "Front door", type: "lock", area: "hallway", icon: "lock", state: "Locked", locked: true, battery: 63 },
    { id: "front_door_cam", name: "Front door", type: "camera", area: "hallway", icon: "doorbell-video", live: true, battery: 38 },
    { id: "hallway_motion", name: "Motion", type: "sensor", area: "hallway", icon: "motion-sensor", state: "Detected", devType: "Motion", battery: 91 },
    // Garage
    { id: "garage_ceiling", name: "Ceiling", type: "light", area: "garage", icon: "ceiling-light", on: true },
    { id: "garage_workbench", name: "Workbench", type: "light", area: "garage", icon: "desk-lamp", on: false },
    { id: "garage_door", name: "Garage door", type: "lock", area: "garage", icon: "garage", state: "Closed", locked: true, battery: 9 },
    { id: "garage_cam", name: "Garage", type: "camera", area: "garage", icon: "cctv", live: false },
    // Main bedroom
    { id: "main_bed_ceiling", name: "Ceiling", type: "light", area: "main-bedroom", icon: "ceiling-light", on: false },
    { id: "main_bed_lamp", name: "Bedside lamp", type: "light", area: "main-bedroom", icon: "lamp", on: true },
    { id: "main_bed_reading", name: "Reading light", type: "light", area: "main-bedroom", icon: "lamp", on: false },
    { id: "main_bed_thermostat", name: "Thermostat", type: "climate", area: "main-bedroom", icon: "thermostat", mode: "Heat", current: 19.6, target: 20.0 },
    // Tess's room
    { id: "tess_ceiling", name: "Ceiling", type: "light", area: "tess-room", icon: "ceiling-light", on: false },
    { id: "tess_lamp", name: "Desk lamp", type: "light", area: "tess-room", icon: "desk-lamp", on: false },
    { id: "tess_speaker", name: "Speaker", type: "media", area: "tess-room", icon: "speaker", state: "Idle", playing: false },
    // Lars's room
    { id: "lars_lamp", name: "Lars's lamp", type: "light", area: "lars-room", icon: "lamp", on: true },
    // Bathroom
    { id: "bathroom_ceiling", name: "Ceiling", type: "light", area: "bathroom", icon: "ceiling-light", on: false },
    { id: "bathroom_mirror", name: "Mirror", type: "light", area: "bathroom", icon: "mirror", on: false },
    { id: "bathroom_humidity", name: "Humidity", type: "sensor", area: "bathroom", icon: "water-percent", state: "64%", devType: "Humidity", mono: true, battery: 55 },
    // Annex (Greet)
    { id: "greet_ceiling", name: "Ceiling", type: "light", area: "greet-room", icon: "ceiling-light", on: true },
    { id: "greet_lamp", name: "Bedside lamp", type: "light", area: "greet-room", icon: "lamp", on: false },
    { id: "greet_thermostat", name: "Thermostat", type: "climate", area: "greet-room", icon: "thermostat", mode: "Heat", current: 22.6, target: 22.5 },
    { id: "greet_ensuite_ceiling", name: "Ceiling", type: "light", area: "greet-ensuite", icon: "ceiling-light", on: false },
    { id: "annex_lock", name: "Annex door", type: "lock", area: "greet-room", icon: "lock", state: "Locked", locked: true, battery: 72 },
    // Outside
    { id: "garden_string", name: "String lights", type: "light", area: "garden", icon: "string-lights", on: false },
    { id: "garden_cam", name: "Garden", type: "camera", area: "garden", icon: "cctv", live: true },
    { id: "driveway_flood", name: "Floodlight", type: "light", area: "driveway", icon: "track-light", on: false },
    { id: "driveway_cam", name: "Driveway", type: "camera", area: "driveway", icon: "cctv", live: true },
  ],

  // ---- Home routines ---------------------------------------------------
  automations: [
    { id: "morning-routine", name: "Weekday morning routine", description: "Turns on the hallway lights and heating at 6:30 on weekdays when someone is home", space: "shared", enabled: true, lastTriggered: "today 6:32", creator: "Daan", area: "hallway", affects: ["greet", "all"], category: "Routines" },
    { id: "hallway-motion", name: "Turn hallway lights on when there is motion", description: "Switches the hallway lights on when motion is detected, on weekdays between 6:00 and 23:00", space: "shared", enabled: true, lastTriggered: "today 7:48", creator: "Home Assistant", area: "hallway", category: "Lighting" },
    { id: "unoccupied-off", name: "Turn lights off when the home is unoccupied", description: "Switches every light off once the last person leaves", space: "shared", enabled: false, lastTriggered: "yesterday 9:10", creator: "Daan", category: "Lighting" },
    { id: "heating-occupied", name: "Turn heating on when the home is occupied", description: "Brings the heating to the target temperature when anyone is home", space: "shared", enabled: true, lastTriggered: "today 7:02", creator: "Home Assistant", category: "Climate" },
    { id: "boost-ac", name: "Boost AC when the panic button is pressed", description: "Runs the living room AC at full for ten minutes when the panic button is pressed", space: "shared", enabled: false, lastTriggered: "never", creator: "Daan", area: "living-room", category: "Climate" },
    { id: "sunset-lights", name: "Sunset lights", description: "Fades the garden and living room lights on at sunset", space: "shared", enabled: true, lastTriggered: "yesterday 20:14", creator: "Daan", category: "Lighting" },
    { id: "away-lock", name: "Lock the doors when everyone leaves", description: "Locks the front door, garage and annex once the home is empty", space: "shared", enabled: true, lastTriggered: "today 8:20", creator: "Daan", category: "Security" },
    { id: "lars-bedtime", name: "Lars's bedtime lamp", description: "Dims Lars's lamp to warm at 19:30 and off at 20:00", space: "shared", enabled: true, lastTriggered: "yesterday 20:00", creator: "Daan", area: "lars-room", affects: ["lars"], category: "Lighting" },
    { id: "annex-night", name: "Annex night light", description: "Keeps Greet's hallway softly lit between 22:00 and 6:00", space: "shared", enabled: true, lastTriggered: "today 6:00", creator: "Daan", area: "greet-room", affects: ["greet"], category: "Lighting" },
    { id: "annex-heating", name: "Annex comfort heating", description: "Holds the annex at 22.5 degrees through the day", space: "shared", enabled: true, lastTriggered: "today 7:05", creator: "Daan", area: "greet-room", affects: ["greet"], category: "Climate" },
    { id: "annex-morning", name: "Annex morning routine", description: "Opens Greet's blinds and warms the room at 7:30", space: "shared", enabled: true, lastTriggered: "today 7:30", creator: "Daan", area: "greet-room", affects: ["greet"], category: "Routines" },
  ],

  scenes: [
    { id: "movie-night", name: "Movie night", description: "Dims the living room, lowers the blinds, warms the lights", space: "shared", enabled: true, creator: "Daan", area: "living-room", category: "Climate" },
    { id: "dinner", name: "Dinner", description: "Kitchen and dining lights to a warm 60 percent", space: "shared", enabled: true, creator: "Sofie", area: "kitchen" },
    { id: "good-morning", name: "Good morning", description: "Bright cool light through the ground floor", space: "shared", enabled: true, creator: "Daan" },
    { id: "bedtime", name: "Bedtime", description: "Everything off except the hallway night light", space: "shared", enabled: true, creator: "Daan" },
    { id: "away", name: "Away", description: "All lights off, doors locked, heating to eco", space: "shared", enabled: true, creator: "Daan" },
  ],

  scripts: [
    { id: "goodnight", name: "Goodnight", description: "Locks up, turns off the downstairs lights, sets night heating", space: "shared", enabled: true, creator: "Daan" },
    { id: "arrive-home", name: "Arrive home", description: "Unlocks the front door, lights the hallway, resumes music", space: "shared", enabled: true, creator: "Daan" },
    { id: "leaving-home", name: "Leaving home", description: "A single tap to lock up and switch to away", space: "shared", enabled: true, creator: "Sofie" },
    { id: "wake-up", name: "Wake up", description: "Gradually raises the bedroom lights over ten minutes", space: "shared", enabled: false, creator: "Daan" },
  ],

  // ---- Analytics -------------------------------------------------------
  // Activity: framed for residents, plain language with a why.
  activity: [
    { id: "a1", action: "The heating turned on", actor: "Home Assistant", automated: true, time: "today 7:02", icon: "radiator", area: "main-bedroom", what: "The heating turned on at 7:02", why: "This was triggered by the Weekday morning routine, which runs on weekdays between 6:30 and 9:00 when anyone is home", automationId: "morning-routine" },
    { id: "a2", action: "The hallway lights turned on", actor: "Home Assistant", automated: true, time: "today 7:48", icon: "lightbulb", area: "hallway", what: "The hallway lights turned on at 7:48", why: "Motion was detected in the hallway and the Turn hallway lights on automation is active", automationId: "hallway-motion" },
    { id: "a3", action: "Sofie unlocked the front door", actor: "Sofie", automated: false, time: "today 8:14", icon: "lock-open-variant", area: "hallway", what: "The front door was unlocked at 8:14", why: "Sofie unlocked it from her phone", automationId: null },
    { id: "a4", action: "Lars turned his lamp on", actor: "Lars", automated: false, time: "today 16:40", icon: "lamp", area: "lars-room", what: "Lars's lamp turned on at 16:40", why: "Lars turned it on himself", automationId: null },
    { id: "a5", action: "The living room speaker started playing", actor: "Daan", automated: false, time: "today 18:05", icon: "speaker", area: "living-room", what: "The living room speaker started playing at 18:05", why: "Daan started it from the home overview", automationId: null },
    { id: "a6", action: "Target temperature set to 22.5 degrees", actor: "Home Assistant", automated: true, time: "today 7:05", icon: "thermostat", area: "greet-room", what: "The annex target temperature was set to 22.5 degrees at 7:05", why: "The Annex comfort heating automation holds the annex at 22.5 degrees through the day", automationId: "annex-heating" },
    { id: "a7", action: "The doors locked", actor: "Home Assistant", automated: true, time: "today 8:20", icon: "lock", area: "hallway", what: "The front door, garage and annex locked at 8:20", why: "The home became empty and the Lock the doors automation ran", automationId: "away-lock" },
  ],

  // History: rawer log for the maintainer.
  history: [
    { id: "h1", entity: "light.hallway_ceiling", event: "Turned on", time: "today 7:48", actor: "Home Assistant" },
    { id: "h2", entity: "climate.main_bedroom", event: "Set to 20.0 degrees", time: "today 7:02", actor: "Home Assistant" },
    { id: "h3", entity: "lock.front_door", event: "Unlocked", time: "today 8:14", actor: "Sofie" },
    { id: "h4", entity: "lock.front_door", event: "Locked", time: "today 8:20", actor: "Home Assistant" },
    { id: "h5", entity: "light.lars_lamp", event: "Turned on", time: "today 16:40", actor: "Lars" },
    { id: "h6", entity: "media_player.living_room", event: "Playing Abbey Road", time: "today 18:05", actor: "Daan" },
    { id: "h7", entity: "binary_sensor.kitchen_motion", event: "Cleared", time: "today 18:22", actor: "Home Assistant" },
    { id: "h8", entity: "climate.annex", event: "Set to 22.5 degrees", time: "today 7:05", actor: "Home Assistant" },
  ],

  // ---- People & services ----------------------------------------------
  people: [
    { id: "daan", name: "Daan", role: "Maintainer", presence: "home", initials: "Da", avatar: "ds/assets/daan.png" },
    { id: "sofie", name: "Sofie", role: "Resident", presence: "home", initials: "So", avatar: "ds/assets/sofie.png" },
    { id: "tess", name: "Tess", role: "Resident", presence: "away", initials: "Te" },
    { id: "lars", name: "Lars", role: "Resident", presence: "home", initials: "La" },
    { id: "greet", name: "Greet", role: "Resident", presence: "home", initials: "Gr" },
    { id: "nour", name: "Nour", role: "Non-resident", presence: "away", initials: "No", scoped: true },
  ],

  services: [
    { id: "weather", name: "Weather", icon: "weather-rainy", state: "Rain, 15 degrees" },
    { id: "music", name: "Music", icon: "music", state: "Spotify connected" },
    { id: "traffic", name: "Traffic", icon: "map-marker-path", state: "22 minutes to work" },
    { id: "calendar", name: "Family calendar", icon: "calendar", state: "3 events today" },
    { id: "todo", name: "Family to-do", icon: "format-list-checks", state: "4 open tasks" },
  ],

  // ---- Home overview "For you" widgets ---------------------------------
  forYou: [
    { id: "update", type: "alert", title: "Home Assistant 2025.11.0", label: "Update available", dismissable: true, adminOnly: true },
    { id: "lights-on", type: "summary", label: "Light", title: "3 areas have lights on", action: "Turn off" },
    { id: "climate", type: "data-point", label: "Climate", title: "Heating to 22.5", value: "extra" },
    { id: "security", type: "summary", label: "Security", title: "1 door unlocked", action: "Lock" },
    { id: "media", type: "media", label: "Media playing", title: "Abbey Road, The Beatles" },
    { id: "energy", type: "data-point", label: "Energy", title: "High consumption today", data: "4.3 kWh" },
    { id: "weather", type: "data-point", label: "Weather of today", title: "Rain", data: "15°" },
    { id: "people", type: "people", label: "People", title: "Daan just arrived home", people: ["Daan", "Sofie"] },
  ],

  // ---- Personal data (Sofie's data autonomy view) ----------------------
  personalData: [
    { id: "presence", name: "Presence", icon: "home-account", access: "shared", description: "Whether you are home or away", usedBy: "Lights and heating routines respond to who is home" },
    { id: "health", name: "Health", icon: "heart-pulse", access: "private", description: "Activity and sleep from your connected watch", usedBy: "Not shared with anyone" },
    { id: "calendar", name: "Calendar", icon: "calendar", access: "shared", description: "Your events on the family calendar", usedBy: "Shown on the shared family calendar" },
  ],

  // ---- Settings IA (admin submenu, from the IA map) --------------------
  // Each item is a main settings page. Items with a `links` array surface those
  // IA sub-destinations as links on the main page (Remote access children,
  // protocol settings, account/guest, etc.), rather than as separate nav rows.
  settingsNav: [
    { title: "Connectivity and accounts", items: [
      { id: "ha-cloud", label: "Home Assistant Cloud", icon: "cloud", links: [
        { label: "Remote UI access", icon: "remote-desktop" },
        { label: "Cloud backup", icon: "cloud-upload" },
        { label: "Cloud webhooks", icon: "webhook" },
        { label: "Account and subscription", icon: "card-account-details" },
      ]},
      { id: "remote-access", label: "Remote access", icon: "web", links: [
        { label: "Voice assistant STT and TTS", icon: "text-to-speech" },
        { label: "Google Assistant", icon: "google-assistant" },
        { label: "Amazon Alexa", icon: "microphone" },
        { label: "AI agent", icon: "robot-happy" },
        { label: "Backup location", icon: "cloud-upload" },
      ]},
      { id: "integrations", label: "Integrations", icon: "power-plug" },
      { id: "apps", label: "Apps", icon: "puzzle" },
      { id: "protocols", label: "Protocols", icon: "lan", links: [
        { label: "Bluetooth", icon: "bluetooth" },
        { label: "Matter", icon: "lan" },
        { label: "Thread", icon: "vector-triangle" },
        { label: "Zigbee", icon: "z-wave" },
        { label: "Z-Wave", icon: "z-wave" },
        { label: "KNX", icon: "lan-connect" },
        { label: "Insteon", icon: "lan-connect" },
      ]},
      { id: "credentials", label: "Credential management", icon: "key", links: [
        { label: "Account", icon: "account" },
        { label: "Guest", icon: "account-clock" },
      ]},
      { id: "ai-tasks", label: "AI tasks", icon: "robot-happy" },
    ]},
    { title: "Home information", items: [
      { id: "floors-areas", label: "Floors and areas", icon: "floor-plan" },
      { id: "general", label: "Home information", icon: "home" },
      { id: "appearance", label: "Appearance", icon: "palette" },
      { id: "labels", label: "Labels", icon: "label" },
      { id: "analytics", label: "Analytics", icon: "chart-box" },
      { id: "labs", label: "Labs", icon: "flask" },
    ]},
    { title: "System", items: [
      { id: "updates", label: "Updates", icon: "update" },
      { id: "repairs", label: "Repairs", icon: "wrench" },
      { id: "statistics", label: "Statistics", icon: "chart-line" },
      { id: "yaml", label: "YAML", icon: "code-braces" },
      { id: "backups", label: "Backups", icon: "backup-restore" },
      { id: "network", label: "Network", icon: "wifi" },
      { id: "storage", label: "Storage", icon: "harddisk" },
      { id: "hardware", label: "Hardware", icon: "chip" },
    ]},
  ],

  // Personal settings nav (from the IA personal space)
  personalSettingsNav: [
    { title: "Personal", items: [
      { id: "p-appearance", label: "Appearance", icon: "palette" },
      { id: "p-accessibility", label: "Accessibility", icon: "human" },
      { id: "p-notifications", label: "Notifications", icon: "bell" },
      { id: "p-security", label: "Security", icon: "shield-account" },
    ]},
  ],

  // ---- Home Assistant Cloud (Nabu Casa) demo data ----------------------
  cloud: {
    subscription: { price: "$65", period: "per year", renews: "August 4, 2026" },
    remoteUrl: "https://hjk29slx83ndk2q8f4.ui.nabu.casa",
    backup: { last: "10 hours ago", size: "788.82 MB", next: "in 14 hours", encrypted: true, certRenewal: "March 26, 2026" },
    voice: {
      languages: [
        { value: "nl-NL", label: "Dutch (Netherlands)" },
        { value: "en-GB", label: "English (United Kingdom)" },
        { value: "en-US", label: "English (United States)" },
        { value: "de-DE", label: "German (Germany)" },
        { value: "fr-FR", label: "French (France)" },
      ],
      voices: [
        { value: "colette", label: "Colette" },
        { value: "fenna", label: "Fenna" },
        { value: "lars", label: "Lars" },
        { value: "ruben", label: "Ruben" },
      ],
      voiceCount: 3,
    },
    webhooks: [
      { id: "wh_doorbell", name: "Doorbell pressed", target: "Notify everyone home", target_kind: "automation" },
      { id: "wh_delivery", name: "Parcel delivered", target: "Hallway light pulse", target_kind: "automation" },
      { id: "wh_ifttt_away", name: "IFTTT set away", target: "Away mode", target_kind: "scene" },
      { id: "wh_solar", name: "Solar surplus", target: "Charge the car", target_kind: "script" },
      { id: "wh_calendar", name: "Calendar sync", target: "Greet's agenda", target_kind: "automation" },
      { id: "wh_garden", name: "Rain forecast", target: "Skip irrigation", target_kind: "automation" },
      { id: "wh_presence", name: "Phone presence", target: "Front door unlock", target_kind: "automation" },
    ],
  },

  // ---- System logs (demo) ----------------------------------------------
  systemLogs: [
    { time: "16:42:08", level: "info", source: "homeassistant.core", message: "Starting Home Assistant" },
    { time: "16:42:11", level: "info", source: "homeassistant.setup", message: "Setting up cloud" },
    { time: "16:42:12", level: "warning", source: "homeassistant.components.zwave_js", message: "Node 14 (garage motion) is unavailable" },
    { time: "16:43:01", level: "info", source: "homeassistant.components.automation", message: "Sunset lights triggered" },
    { time: "16:51:33", level: "error", source: "homeassistant.components.camera", message: "Timeout fetching front_door snapshot" },
    { time: "17:02:19", level: "info", source: "homeassistant.components.hassio", message: "Cloud backup completed (788.82 MB)" },
    { time: "17:14:55", level: "warning", source: "homeassistant.helpers.template", message: "Template loop detected for sensor.daily_energy" },
  ],
};

// ---- Route directory (for the More page, grouped by space) -------------
// Each: id, label, icon, space, route. Filtered per persona's spaces + scope.
export const directory = [
  // Shared, home perspective. Note: Lights / Climate / Security / Media are not
  // listed here. They are perspectives within Home, reached through the home
  // tab bar, not standalone destinations in the dock or the More directory.
  { id: "home", label: "Home", icon: "home-variant", space: "shared", route: "/home" },
  // Shared, discovery
  { id: "devices", label: "Devices", icon: "devices", space: "shared", route: "/devices" },
  { id: "people", label: "People", icon: "account-group", space: "shared", route: "/people" },
  // Shared, home routines
  { id: "automations", label: "Automations", icon: "robot", space: "shared", route: "/automations" },
  { id: "scenes", label: "Scenes", icon: "palette", space: "shared", route: "/scenes" },
  { id: "scripts", label: "Scripts", icon: "script-text", space: "shared", route: "/scripts" },
  // Shared, analytics
  { id: "history", label: "History", icon: "history", space: "shared", route: "/history" },
  { id: "activity", label: "Activity", icon: "timeline-text", space: "shared", route: "/activity" },
  // Personal
  { id: "my-dashboard", label: "My dashboard", icon: "view-dashboard", space: "personal", route: "/my/dashboard" },
  { id: "my-stuff", label: "My stuff", icon: "star", space: "personal", route: "/my/dashboard" },
  { id: "my-data", label: "My data", icon: "shield-lock", space: "personal", route: "/my/data" },
  { id: "my-settings", label: "My settings", icon: "cog-outline", space: "personal", route: "/my/settings" },
  // Admin
  { id: "settings", label: "Settings", icon: "cog", space: "admin", route: "/settings" },
  { id: "logs", label: "Logs", icon: "text-box", space: "admin", route: "/logs" },
  { id: "extensions", label: "Home extensions", icon: "store", space: "admin", route: "/extensions" },
];

// ---- Bookmark targets ---------------------------------------------------
// Bookmarks are favourite shortcuts, NOT destinations. They never appear on
// the More page. A bookmark can point at a top-level directory entry OR at a
// subpage (e.g. a specific area like the front door). Subpage shortcuts that
// are not themselves More destinations live here; bookmarksFor() resolves a
// persona's bookmark ids against the directory first, then these extras.
export const bookmarkExtras = [
  { id: "front-door", label: "Front door", icon: "door", route: "/home/area/hallway" },
];

// ---- Home extensions store categories ----------------------------------
export const extensionCategories = [
  { label: "Custom dashboards", icon: "view-dashboard-variant" },
  { label: "Apps", icon: "puzzle" },
  { label: "Blueprints", icon: "file-tree" },
  { label: "Custom integrations", icon: "puzzle-plus" },
  { label: "Themes", icon: "palette-swatch" },
];

// ---- Selectors / access helpers ----------------------------------------
export function getPersona(id) {
  return household.personas[id] || household.personas.daan;
}

export function entitiesIn(areaId, type) {
  return household.entities.filter((e) => e.area === areaId && (!type || e.type === type));
}

export function areaList() {
  return Object.values(household.areas);
}

// Which floors a persona can see (Greet collapses to annex first; Nour scoped).
export function visibleFloors(persona) {
  if (persona.scoped) {
    return household.floors.filter((f) => persona.scoped.includes(f.id));
  }
  return household.floors;
}

// Can this persona reach this area?
export function canAccessArea(persona, areaId) {
  if (!persona.scoped) return true;
  const area = household.areas[areaId];
  if (!area) return persona.scoped.includes(areaId);
  return persona.scoped.includes(area.floor) || persona.scoped.includes(areaId);
}

// Directory entries this persona can see (space membership + scope + bookmarks).
export function directoryFor(persona) {
  return directory.filter((d) => {
    if (!persona.spaces.includes(d.space)) return false;
    if (persona.id === "lars" && d.space === "personal" && d.id !== "my-stuff") return false;
    if (persona.id !== "lars" && d.id === "my-stuff") return false;
    return true;
  });
}

// Bookmark items resolved from ids, always trailing More.
// Resolves against the directory first, then bookmarkExtras (subpage shortcuts
// like the front door, which are favourites, not More destinations).
export function bookmarksFor(persona) {
  const byId = Object.fromEntries([...directory, ...bookmarkExtras].map((d) => [d.id, d]));
  const items = persona.bookmarks
    .map((id) => byId[id])
    .filter(Boolean)
    .slice(0, 5)
    .map((d) => ({ id: d.id, label: d.label, icon: d.icon, route: d.route }));
  return items;
}
