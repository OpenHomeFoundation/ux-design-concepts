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
      avatar: "ds/assets/tess.png",
      spaces: ["shared", "personal"], calibrated: "teen",
      bookmarks: ["home", "my-dashboard", "activity"],
      favorites: ["tess_ceiling", "tess_lamp", "living_room_lamp"],
      presence: "away",
      note: "Calibrated teen. Access expands over time.",
    },
    lars: {
      id: "lars", name: "Lars", role: "resident", initials: "La", calibrated: "child",
      avatar: "ds/assets/lars.png",
      spaces: ["shared", "personal"],
      bookmarks: ["home", "my-stuff"],
      favorites: ["lars_lamp"],
      presence: "home",
      note: "Calibrated child. Limited controls, still has a Personal space.",
    },
    greet: {
      id: "greet", name: "Elizabeth", role: "resident", initials: "El", calibrated: "accessibility",
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
    "greet-room":   { id: "greet-room", name: "Elizabeth's room", floor: "annex", icon: "bed", temp: 22.6, humidity: 45, lights: 2, lightsOn: 1 },
    "greet-ensuite":{ id: "greet-ensuite", name: "Elizabeth's ensuite", floor: "annex", icon: "toilet", temp: 22.0, humidity: 58, lights: 1, lightsOn: 0 },
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
    // Annex (Elizabeth)
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
    { id: "morning-routine", name: "Weekday morning routine", description: "Turns on the hallway lights and heating at 6:30 on weekdays when someone is home", space: "shared", enabled: true, lastTriggered: "today 6:32", creator: "Daan", area: "hallway", affects: ["greet", "all"], category: "Routines", presencePeople: ["anyone"] },
    { id: "hallway-motion", name: "Turn hallway lights on when there is motion", description: "Switches the hallway lights on when motion is detected, on weekdays between 6:00 and 23:00", space: "shared", enabled: true, lastTriggered: "today 7:48", creator: "Home Assistant", area: "hallway", category: "Lighting" },
    { id: "unoccupied-off", name: "Turn lights off when the home is unoccupied", description: "Switches every light off once the last person leaves", space: "shared", enabled: false, lastTriggered: "yesterday 9:10", creator: "Daan", category: "Lighting", presencePeople: ["anyone"] },
    { id: "heating-occupied", name: "Turn heating on when the home is occupied", description: "Brings the heating to the target temperature when anyone is home", space: "shared", enabled: true, lastTriggered: "today 7:02", creator: "Home Assistant", category: "Climate", presencePeople: ["anyone"] },
    { id: "boost-ac", name: "Boost AC when the panic button is pressed", description: "Runs the living room AC at full for ten minutes when the panic button is pressed", space: "shared", enabled: false, lastTriggered: "never", creator: "Daan", area: "living-room", category: "Climate" },
    { id: "sunset-lights", name: "Sunset lights", description: "Fades the garden and living room lights on at sunset", space: "shared", enabled: true, lastTriggered: "yesterday 20:14", creator: "Daan", category: "Lighting" },
    { id: "away-lock", name: "Lock the doors when everyone leaves", description: "Locks the front door, garage and annex once the home is empty", space: "shared", enabled: true, lastTriggered: "today 8:20", creator: "Daan", category: "Security", presencePeople: ["anyone"] },
    { id: "lars-bedtime", name: "Lars's bedtime lamp", description: "Dims Lars's lamp to warm at 19:30 and off at 20:00", space: "shared", enabled: true, lastTriggered: "yesterday 20:00", creator: "Daan", area: "lars-room", affects: ["lars"], category: "Lighting" },
    { id: "annex-night", name: "Annex night light", description: "Keeps Elizabeth's hallway softly lit between 22:00 and 6:00", space: "shared", enabled: true, lastTriggered: "today 6:00", creator: "Daan", area: "greet-room", affects: ["greet"], category: "Lighting" },
    { id: "annex-heating", name: "Annex comfort heating", description: "Holds the annex at 22.5 degrees through the day", space: "shared", enabled: true, lastTriggered: "today 7:05", creator: "Daan", area: "greet-room", affects: ["greet"], category: "Climate" },
    { id: "annex-morning", name: "Annex morning routine", description: "Opens Elizabeth's blinds and warms the room at 7:30", space: "shared", enabled: true, lastTriggered: "today 7:30", creator: "Daan", area: "greet-room", affects: ["greet"], category: "Routines" },
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
    { id: "tess", name: "Tess", role: "Resident", presence: "away", initials: "Te", avatar: "ds/assets/tess.png" },
    { id: "lars", name: "Lars", role: "Resident", presence: "home", initials: "La", avatar: "ds/assets/lars.png" },
    { id: "greet", name: "Elizabeth", role: "Resident", presence: "home", initials: "El" },
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
    { id: "presence", name: "Location", icon: "map-marker", access: "shared", description: "Whether you are home or away", usedBy: "Lights and heating routines respond to who is home" },
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
      { id: "wh_calendar", name: "Calendar sync", target: "Elizabeth's agenda", target_kind: "automation" },
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
  { id: "map", label: "Map", icon: "map", space: "shared", route: "/map" },
  // Shared, home routines
  { id: "automations", label: "Automations", icon: "robot", space: "shared", route: "/automations" },
  { id: "scenes", label: "Scenes", icon: "palette", space: "shared", route: "/scenes" },
  { id: "scripts", label: "Scripts", icon: "script-text", space: "shared", route: "/scripts" },
  // Shared, analytics
  { id: "energy", label: "Energy", icon: "lightning-bolt", space: "shared", route: "/energy" },
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

// ---- World map (person + zone locations, for the /map page) ------------
// Home sits in Utrecht (matching the Home information map). People are placed
// at home (clustered with small offsets so pins stay legible) or at the zone
// they are currently in. Presence comes from `people` above.
export const mapData = {
  center: { lat: 52.0825, lon: 5.1437 },
  zoom: 14,
  zones: [
    { id: "zone-home", name: "Home", kind: "zone", icon: "home-variant", color: "#2e9e5b", lat: 52.0825, lon: 5.1437, radius: 55 },
    { id: "zone-school", name: "School", kind: "zone", icon: "school", color: "#e0a32e", lat: 52.0982, lon: 5.1402, radius: 90 },
    { id: "zone-work", name: "Daan's office", kind: "zone", icon: "briefcase-variant", color: "#2aa6b3", lat: 52.0836, lon: 5.1486, radius: 90 },
    { id: "zone-sofie-work", name: "Sofie's work", kind: "zone", icon: "briefcase-variant", color: "#a855f7", lat: 52.3146, lon: 4.9533, radius: 90 },
    { id: "zone-park", name: "Wilhelminapark", kind: "zone", icon: "tree", color: "#1f6e42", lat: 52.0882, lon: 5.1404, polygon: [
      [52.0908, 5.1401], [52.0893, 5.1423], [52.0875, 5.1428], [52.0863, 5.1416],
      [52.0856, 5.1398], [52.0865, 5.1385], [52.0885, 5.1383], [52.0900, 5.1388],
    ] },
    { id: "zone-cartesius", name: "Hof van Cartesius", kind: "zone", icon: "sprout", color: "#d6492f", lat: 52.1011, lon: 5.0934, polygon: [
      [52.1022, 5.0921], [52.1025, 5.0946], [52.1011, 5.0953], [52.0998, 5.0945],
      [52.0997, 5.0924], [52.1008, 5.0914],
    ] },
  ],
  people: [
    { id: "daan", name: "Daan", initials: "Da", avatar: "ds/assets/daan.png", presence: "away", at: "Utrecht city center", updated: "2 min ago", zone: null, lat: 52.09083, lon: 5.12142, visibility: "everyone" },
    { id: "sofie", name: "Sofie", initials: "So", avatar: "ds/assets/sofie.png", presence: "away", at: "Sofie's work", updated: "6 min ago", zone: "zone-sofie-work", lat: 52.31460, lon: 4.95330, visibility: "everyone" },
    { id: "lars", name: "Lars", initials: "La", avatar: "ds/assets/lars.png", presence: "home", at: "Home", updated: "11 min ago", zone: "zone-home", lat: 52.08252, lon: 5.14378, visibility: "everyone" },
    { id: "greet", name: "Elizabeth", initials: "El", presence: "home", at: "Home", updated: "3 min ago", zone: "zone-home", lat: 52.08243, lon: 5.14357, visibility: "everyone" },
    { id: "tess", name: "Tess", initials: "Te", avatar: "ds/assets/tess.png", presence: "away", at: "School", updated: "24 min ago", zone: "zone-school", lat: 52.0982, lon: 5.1402, visibility: "zones" },
    { id: "nour", name: "Nour", initials: "No", presence: "away", at: "Away", updated: "1 hr ago", zone: null, lat: 52.0762, lon: 5.1012, visibility: "private" },
  ],
};

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

// Which floors a persona can see (Elizabeth collapses to annex first; Nour scoped).
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

// ---- Energy data --------------------------------------------------------
// Deterministic pseudo-data for the Energy page. energyFor(period, offset)
// returns the meters and series for a period ("now" | "day" | "week" |
// "month" | "year"), offset 0 = current, negative = earlier. Rates are flat
// NL-ish tariffs; numbers are demo data, stated as raw strings in the UI.
const RATE = { import: 0.28, feedIn: 0.09, gas: 1.18 }; // EUR per kWh / m3

function _seed(s) { let x = Math.sin(s) * 10000; return x - Math.floor(x); }
function _series(n, base, spread, seed, floor) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = _seed(seed * 97 + i * 13.7);
    const r2 = _seed(seed * 53 + i * 7.3);
    let v = base + (r - 0.5) * spread + (r2 - 0.5) * spread * 0.5;
    if (floor != null) v = Math.max(floor, v);
    out.push(v);
  }
  return out;
}
const _mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const _dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function _round(v, d) { const m = Math.pow(10, d || 0); return Math.round(v * m) / m; }
function _sum(a) { return a.reduce((x, y) => x + y, 0); }

export function energyFor(period, offset) {
  offset = offset || 0;
  const seed = (period.length * 11) + Math.abs(offset) * 3 + 1;
  let label, eLabels, eVals, gVals, sVals, unitNote;

  if (period === "now") {
    // Live: last 60 minutes of power draw in kW.
    eLabels = [];
    for (let i = 60; i >= 0; i -= 10) eLabels.push(i === 0 ? "now" : "-" + i + "m");
    eVals = _series(25, 0.78, 1.4, seed, 0.12).map((v) => _round(v, 2));
    sVals = _series(25, 1.1, 1.6, seed + 4, 0).map((v) => _round(v, 2));
    gVals = _series(25, 0.0, 0.02, seed + 7, 0).map((v) => _round(v, 3));
    label = "Live, last hour";
    unitNote = "kW";
  } else if (period === "day") {
    eLabels = ["00", "03", "06", "09", "12", "15", "18", "21"];
    eVals = _series(24, 0.55, 0.9, seed, 0.05);
    // morning + evening peaks
    eVals = eVals.map((v, i) => v + (i >= 6 && i <= 8 ? 0.7 : 0) + (i >= 17 && i <= 21 ? 1.1 : 0));
    sVals = _series(24, 0, 0, seed + 4, 0).map((_, i) => {
      const sun = Math.max(0, Math.sin(((i - 6) / 12) * Math.PI));
      return _round(sun * (2.6 + _seed(seed + i) * 0.8), 2);
    });
    gVals = _series(24, 0.02, 0.06, seed + 7, 0).map((v, i) => _round(v + (i >= 6 && i <= 8 ? 0.05 : 0), 3));
    label = offset === 0 ? "Today" : (offset === -1 ? "Yesterday" : Math.abs(offset) + " days ago");
    unitNote = "kWh";
  } else if (period === "week") {
    eLabels = _dow;
    eVals = _series(7, 13.4, 6, seed, 4);
    sVals = _series(7, 11, 7, seed + 4, 0.5);
    gVals = _series(7, 1.2, 1.1, seed + 7, 0.1);
    label = offset === 0 ? "This week" : (offset === -1 ? "Last week" : Math.abs(offset) + " weeks ago");
    unitNote = "kWh";
  } else if (period === "month") {
    const days = 30; eLabels = ["1", "5", "10", "15", "20", "25", "30"];
    eVals = _series(days, 13.4, 7, seed, 3);
    sVals = _series(days, 10.5, 8, seed + 4, 0);
    gVals = _series(days, 1.1, 1.0, seed + 7, 0.05);
    label = offset === 0 ? "This month" : (offset === -1 ? "Last month" : Math.abs(offset) + " months ago");
    unitNote = "kWh";
  } else { // year
    eLabels = _mon;
    eVals = _mon.map((_, i) => { const winter = Math.cos((i / 12) * 2 * Math.PI) * 80 + 320; return winter + (_seed(seed + i) - 0.5) * 90; });
    sVals = _mon.map((_, i) => { const summer = Math.max(40, Math.sin(((i - 2) / 12) * Math.PI) * 380 + 90); return summer + (_seed(seed + i + 9) - 0.5) * 60; });
    gVals = _mon.map((_, i) => { const winter = Math.max(2, Math.cos((i / 12) * 2 * Math.PI) * 110 + 130); return winter + (_seed(seed + i + 3) - 0.5) * 30; });
    label = offset === 0 ? "This year" : String(2025 + offset);
    unitNote = "kWh";
  }

  const isPower = period === "now";
  const eTotal = isPower ? eVals[eVals.length - 1] : _sum(eVals);
  const sTotal = isPower ? sVals[sVals.length - 1] : _sum(sVals);
  const gTotal = isPower ? gVals[gVals.length - 1] : _sum(gVals);
  // Returned to grid: surplus solar not used directly (~40% of solar).
  const returned = sTotal * 0.42;
  const fromGrid = eTotal; // grid import (what the electricity meter card shows)
  const selfUse = sTotal - returned;
  const totalConsumed = fromGrid + selfUse;
  const selfSuff = totalConsumed > 0 ? Math.round((selfUse / totalConsumed) * 100) : 0;

  const eCost = fromGrid * RATE.import - returned * RATE.feedIn;
  const gCost = gTotal * RATE.gas;
  const co2 = _round((fromGrid * 0.31) - (returned * 0.31), 0); // kg, grid mix offset by export

  const fmt = (v, d) => _round(v, d == null ? (isPower ? 2 : 1) : d);
  return {
    period, offset, label, unitNote, isPower,
    canForward: offset < 0,
    electricity: { value: fmt(fromGrid), unit: isPower ? "kW" : "kWh", cost: _round(eCost, 2), labels: eLabels, points: eVals.map((v) => fmt(v)) },
    solar: { value: fmt(sTotal), unit: isPower ? "kW" : "kWh", labels: eLabels, points: sVals.map((v) => fmt(v)) },
    returned: { value: fmt(returned), unit: isPower ? "kW" : "kWh", cost: _round(returned * RATE.feedIn, 2) },
    gas: { value: fmt(gTotal, isPower ? 3 : 1), unit: isPower ? "m\u00b3/h" : "m\u00b3", cost: _round(gCost, 2), labels: eLabels, points: gVals.map((v) => _round(v, isPower ? 3 : 1)) },
    selfSufficiency: selfSuff,
    co2: Math.abs(co2),
    co2Sign: co2 <= 0 ? "saved" : "emitted",
    netCost: _round(eCost + gCost, 2),
    peakLabel: isPower ? null : eLabels[Math.floor(eVals.indexOf(Math.max.apply(null, eVals)) / eVals.length * eLabels.length)],
  };
}

// Expose the module's exports on a global so the single-file bundle (which can't
// rewrite the dynamic `import("./household.js")`) can still reach them. When
// served normally as siblings, the dynamic import works too; this is belt-and-braces.
if (typeof window !== "undefined") {
  window.__HH_MOD = {
    household, directory, bookmarkExtras, extensionCategories, mapData,
    getPersona, entitiesIn, areaList, visibleFloors, canAccessArea, directoryFor, bookmarksFor, energyFor,
  };
}
