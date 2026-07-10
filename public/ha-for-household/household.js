// household.js — Janssen household demo data for the Home Assistant whole-household prototype.
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
      widgets: ["weather", "favorites", "calendar", "energy", "activity", "todo"],
      presence: "home",
      note: "All access. The maintainer doing the invisible labor.",
    },
    sofie: {
      id: "sofie", name: "Sofie", role: "resident", initials: "So",
      avatar: "ds/assets/sofie.png",
      spaces: ["shared", "personal"],
      bookmarks: ["home", "my-data", "activity"],
      favorites: ["living_room_lamp", "main_bed_lamp", "kitchen_ceiling"],
      widgets: ["weather", "favorites", "calendar"],
      presence: "home",
      note: "Never configured anything. Has her own dashboard and private data.",
    },
    tess: {
      id: "tess", name: "Tess", role: "resident", initials: "Te",
      avatar: "ds/assets/tess.png",
      spaces: ["shared", "personal"], calibrated: "teen",
      bookmarks: ["home", "my-dashboard", "activity"],
      favorites: ["tess_ceiling", "tess_lamp", "living_room_lamp"],
      widgets: ["weather", "favorites", "todo"],
      presence: "away",
      note: "Calibrated teen. Access expands over time.",
    },
    lars: {
      id: "lars", name: "Lars", role: "resident", initials: "La", calibrated: "child",
      avatar: "ds/assets/lars.png",
      spaces: ["shared", "personal"],
      bookmarks: ["home", "my-stuff"],
      favorites: ["lars_lamp"],
      widgets: ["weather", "favorites"],
      presence: "home",
      note: "Calibrated child. Limited controls, still has a Personal space.",
    },
    greet: {
      id: "greet", name: "Elizabeth", role: "resident", initials: "El", calibrated: "accessibility",
      spaces: ["shared", "personal"], homeArea: "greet-room",
      bookmarks: ["home", "my-dashboard", "activity"],
      favorites: ["greet_ceiling", "greet_lamp"],
      widgets: ["weather", "favorites", "activity"],
      presence: "home",
      note: "Calibrated for accessibility, larger type. Lives in the annex.",
    },
    nour: {
      id: "nour", name: "Nour", role: "non-resident", initials: "No", calibrated: "scoped",
      spaces: ["shared"], scoped: ["ground", "front_door"], expiresAt: "18:00",
      bookmarks: ["home", "front-door"],
      favorites: ["hallway_ceiling", "kitchen_ceiling"],
      widgets: ["weather", "favorites", "activity"],
      presence: "away",
      note: "Nanny. Scoped, time-limited access to the ground floor and front door.",
    },
  },

  // ---- Structure -------------------------------------------------------
  // The home is one building of floors, plus an "Outside" group of outdoor
  // areas that have no floor (HA models these as floorless areas). A building
  // exists so the 3D view can anchor the stack and, if a home ever has more
  // than one structure, render them separately; with a single building it
  // stays invisible in the UI.
  property: { id: "property", name: "Abbey Road", icon: "home-city-outline" },

  buildings: [
    { id: "main-house", name: "House", icon: "home-outline", floors: ["basement", "ground", "first"] },
  ],

  // Floors carry an `order` (drag to reorder in settings), no numeric storey.
  // One floor is the ground floor (`isGround`): it tells the 3D view where the
  // house meets the ground plane, so homes whose entrance is not at the bottom
  // of the stack (e.g. built on a slope) still sit correctly. Floors above
  // ground render upward, floors below downward.
  // Array order drives content-list display (Ground first, Basement last);
  // each floor's `order` still drives the physical 3D stack and settings.
  floors: [
    { id: "ground", name: "Ground floor", building: "main-house", order: 1, isGround: true, icon: "home-floor-g", areas: ["living-room", "kitchen", "hallway", "garage", "greet-room", "greet-ensuite"] },
    { id: "first", name: "First floor", building: "main-house", order: 2, icon: "home-floor-1", areas: ["main-bedroom", "tess-room", "lars-room", "bathroom", "landing"] },
    { id: "basement", name: "Basement", building: "main-house", order: 0, icon: "home-floor-negative-1", areas: ["utility"] },
  ],

  // Outdoor areas: no floor, placed directly outside. The garage here is an
  // integrated garage (a floor area inside the house); the driveway outside is
  // the outdoor counterpart.
  outdoorAreas: ["garden", "driveway", "patio"],

  areas: {
    "living-room":  { id: "living-room", name: "Living room", floor: "ground", icon: "sofa", temp: 21.4, humidity: 52, lights: 3, lightsOn: 2 },
    "kitchen":      { id: "kitchen", name: "Kitchen", floor: "ground", icon: "fridge", temp: 22.1, humidity: 48, lights: 4, lightsOn: 0 },
    "hallway":      { id: "hallway", name: "Hallway", floor: "ground", icon: "coat-rack", temp: 20.8, humidity: 50, lights: 2, lightsOn: 1 },
    "garage":       { id: "garage", name: "Garage", floor: "ground", icon: "garage", temp: 16.2, humidity: 61, lights: 2, lightsOn: 1 },
    "utility":      { id: "utility", name: "Utility room", floor: "basement", icon: "water-pump", temp: 17.4, humidity: 56, lights: 1, lightsOn: 0 },
    "main-bedroom": { id: "main-bedroom", name: "Main bedroom", floor: "first", icon: "bed-king", temp: 19.6, humidity: 49, lights: 3, lightsOn: 1 },
    "tess-room":    { id: "tess-room", name: "Tess's room", floor: "first", icon: "bed", temp: 20.2, humidity: 47, lights: 2, lightsOn: 0 },
    "lars-room":    { id: "lars-room", name: "Lars's room", floor: "first", icon: "teddy-bear", temp: 20.5, humidity: 48, lights: 1, lightsOn: 1 },
    "bathroom":     { id: "bathroom", name: "Bathroom", floor: "first", icon: "shower", temp: 21.0, humidity: 64, lights: 2, lightsOn: 0 },
    "landing":      { id: "landing", name: "Landing", floor: "first", icon: "stairs", temp: 20.1, humidity: 50, lights: 1, lightsOn: 1 },
    "greet-room":   { id: "greet-room", name: "Elizabeth's room", floor: "ground", icon: "bed", temp: 22.6, humidity: 45, lights: 2, lightsOn: 1 },
    "greet-ensuite":{ id: "greet-ensuite", name: "Elizabeth's ensuite", floor: "ground", icon: "toilet", temp: 22.0, humidity: 58, lights: 1, lightsOn: 0 },
    "garden":       { id: "garden", name: "Garden", outdoor: true, icon: "tree", lights: 1, lightsOn: 0 },
    "driveway":     { id: "driveway", name: "Driveway", outdoor: true, icon: "car", lights: 1, lightsOn: 0 },
    "patio":        { id: "patio", name: "Patio", outdoor: true, icon: "grill-outline", lights: 1, lightsOn: 0 },
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
    // Landing
    { id: "landing_ceiling", name: "Ceiling", type: "light", area: "landing", icon: "ceiling-light", on: true },
    { id: "landing_motion", name: "Motion", type: "sensor", area: "landing", icon: "motion-sensor", state: "Clear", devType: "Motion", battery: 78 },
    { id: "landing_smoke", name: "Smoke detector", type: "sensor", area: "landing", icon: "smoke-detector", state: "Clear", devType: "Smoke", battery: 91 },
    // Annex (Elizabeth)
    { id: "greet_ceiling", name: "Ceiling", type: "light", area: "greet-room", icon: "ceiling-light", on: true },
    { id: "greet_lamp", name: "Bedside lamp", type: "light", area: "greet-room", icon: "lamp", on: false },
    { id: "greet_thermostat", name: "Thermostat", type: "climate", area: "greet-room", icon: "thermostat", mode: "Heat", current: 22.6, target: 22.5 },
    { id: "greet_ensuite_ceiling", name: "Ceiling", type: "light", area: "greet-ensuite", icon: "ceiling-light", on: false },
    { id: "annex_lock", name: "Annex door", type: "lock", area: "greet-room", icon: "lock", state: "Locked", locked: true, battery: 72 },
    // Utility room (basement)
    { id: "utility_light", name: "Ceiling", type: "light", area: "utility", icon: "ceiling-light", on: false },
    { id: "utility_leak", name: "Water leak", type: "sensor", area: "utility", icon: "water-alert-outline", state: "Dry", devType: "Leak", battery: 88 },
    { id: "utility_boiler", name: "Boiler", type: "climate", area: "utility", icon: "water-boiler", mode: "Automatic", current: 17.4, target: 17.0 },
    // Outside
    { id: "garden_string", name: "String lights", type: "light", area: "garden", icon: "string-lights", on: false },
    { id: "garden_cam", name: "Garden", type: "camera", area: "garden", icon: "cctv", live: true },
    { id: "driveway_flood", name: "Floodlight", type: "light", area: "driveway", icon: "track-light", on: false },
    { id: "patio_lights", name: "Patio lights", type: "light", area: "patio", icon: "outdoor-lamp", on: false },
    { id: "patio_temp", name: "Outdoor temperature", type: "sensor", area: "patio", icon: "thermometer", state: "14.2\u00b0C", devType: "Temperature", battery: 76 },
    // Energy: smart plugs (measured switches) and Powercalc virtual power sensors.
    // `meter: true` marks a power-reporting entity; `power` is watts, `integration`
    // names the source. These drive the per-area Energy subview.
    { id: "lr_media_plug", name: "TV and media", type: "sensor", devType: "Power", area: "living-room", icon: "power-socket-eu", state: "142 W", mono: true, meter: true, power: 142, kwhToday: 1.8, integration: "TP-Link Kasa" },
    { id: "lr_lights_power", name: "Living room lights", type: "sensor", devType: "Power", area: "living-room", icon: "lightning-bolt", state: "34 W", mono: true, meter: true, power: 34, kwhToday: 0.4, integration: "Powercalc" },
    { id: "kt_fridge_plug", name: "Fridge", type: "sensor", devType: "Power", area: "kitchen", icon: "fridge-outline", state: "92 W", mono: true, meter: true, power: 92, kwhToday: 1.4, integration: "Shelly" },
    { id: "kt_dishwasher_plug", name: "Dishwasher", type: "sensor", devType: "Power", area: "kitchen", icon: "dishwasher", state: "0 W", mono: true, meter: true, power: 0, kwhToday: 0.9, integration: "Shelly" },
    { id: "mb_media_plug", name: "Bedroom media", type: "sensor", devType: "Power", area: "main-bedroom", icon: "power-socket-eu", state: "6 W", mono: true, meter: true, power: 6, kwhToday: 0.1, integration: "TP-Link Kasa" },
    { id: "gr_ev_charger", name: "EV charger", type: "sensor", devType: "Power", area: "garage", icon: "ev-station", state: "7400 W", mono: true, meter: true, power: 7400, kwhToday: 12.4, integration: "Wallbox" },
    { id: "ut_heatpump_power", name: "Heat pump", type: "sensor", devType: "Power", area: "utility", icon: "heat-pump", state: "1240 W", mono: true, meter: true, power: 1240, kwhToday: 6.2, integration: "Powercalc" },
    { id: "ut_washer_plug", name: "Washing machine", type: "sensor", devType: "Power", area: "utility", icon: "washing-machine", state: "3 W", mono: true, meter: true, power: 3, kwhToday: 0.6, integration: "Shelly" },
  ],

  // ---- Home routines ---------------------------------------------------
  automations: [
    { id: "morning-routine", name: "Weekday morning routine", description: "Turns on the hallway lights and heating at 6:30 on weekdays when someone is home", space: "shared", enabled: true, lastTriggered: "today 6:32", creator: "Daan", area: "hallway", affects: ["greet", "all"], category: "Routines", presencePeople: ["anyone"] },
    { id: "hallway-motion", name: "Turn hallway lights on when there is motion", description: "Switches the hallway lights on when motion is detected, on weekdays between 6:00 and 23:00", space: "shared", enabled: true, lastTriggered: "today 7:48", creator: "Home Assistant", area: "hallway", category: "Lighting" },
    { id: "unoccupied-off", name: "Turn lights off when the home is unoccupied", description: "Switches every light off once the last person leaves", space: "shared", enabled: false, lastTriggered: "yesterday 9:10", creator: "Daan", category: "Lighting", presencePeople: ["anyone"] },
    { id: "heating-occupied", name: "Turn heating on when the home is occupied", description: "Brings the heating to the target temperature when anyone is home", space: "shared", enabled: true, lastTriggered: "today 7:02", creator: "Home Assistant", category: "Climate", presencePeople: ["anyone"] },
    { id: "boost-ac", name: "Boost AC when the panic button is pressed", description: "Runs the living room AC at full for ten minutes when the panic button is pressed", space: "shared", enabled: false, lastTriggered: "never", creator: "Daan", area: "living-room", category: "Climate" },
    { id: "sunset-lights", name: "Sunset lights", description: "Fades the garden and living room lights on at sunset", space: "shared", enabled: true, lastTriggered: "yesterday 20:14", creator: "Daan", createdBy: "daan", contributors: ["daan", "sofie"], editors: ["maintainers", "sofie"], category: "Lighting" },
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

  // ---- Automation / script flows (the node graphs) ---------------------
  // Rendered by the flow pages. Node kinds: trigger, condition, action, wait,
  // choose (with branches). Plain-language labels; technical detail lives in
  // `fields` rows ([label, value, mono?]) shown in the inspector.
  // `met` on a condition is the live "is this true right now" indicator.
  flows: {
    "morning-routine": {
      triggers: [{ id: "t1", icon: "clock-outline", block: "Time", label: "At 6:30", sub: "Every weekday", fields: [["Time", "6:30", true], ["Repeats", "Monday to Friday"]] }],
      conditions: [
        { id: "c1", icon: "calendar-check", block: "Time", label: "It is a weekday", met: true, fields: [["Days", "Monday to Friday"]] },
        { id: "c2", icon: "home-account", block: "Presence", label: "Someone is home", met: true, fields: [["People", "Anyone"], ["Right now", "Sofie, Lars and Tess are home"]] },
      ],
      steps: [
        { id: "a1", icon: "thermostat", block: "Climate set temperature", label: "Set the heating to 21°", targets: "2 thermostats on the ground floor", fields: [["Target", "21.0°C", true], ["Entities", "climate.living_room, climate.hallway", true]] },
        { id: "ch1", type: "choose", icon: "call-split", block: "Choose", label: "Is the sun up yet?", branches: [
          { id: "b1", label: "Not up yet", met: false, conditions: [
            { id: "c1", icon: "weather-night", block: "Sun", label: "The sun is below the horizon", fields: [["State", "Below horizon"], ["Before", "Sunrise"]] },
          ], steps: [
            { id: "a2", icon: "lightbulb-on-outline", block: "Light", label: "Turn on the hallway lights", targets: "2 lights in the Hallway", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "80%"], ["Entities", "light.hallway_ceiling, light.hallway_lamp", true]] },
          ] },
          { id: "b2", label: "Already up", met: true, conditions: [
            { id: "c2", icon: "weather-sunny", block: "Sun", label: "The sun is up", fields: [["State", "Above horizon"], ["After", "Sunrise"]] },
          ], steps: [
            { id: "a3", icon: "blinds-open", block: "Cover open", label: "Open the living room blinds", targets: "1 cover in the Living room", fields: [["Position", "Fully open"], ["Entity", "cover.living_room_blinds", true]] },
          ] },
        ] },
      ],
      notes: { ch1: "Sunrise moves through the year, so the routine checks instead of hardcoding a time." },
    },
    "hallway-motion": {
      triggers: [{ id: "t1", icon: "motion-sensor", block: "Motion", label: "Motion in the hallway", sub: "Any motion sensor there", fields: [["Area", "Hallway"], ["Sensors", "binary_sensor.hallway_motion", true]] }],
      conditions: [{ id: "c1", icon: "clock-outline", block: "Time", label: "Between 6:00 and 23:00", met: true, fields: [["From", "6:00", true], ["To", "23:00", true]] }],
      steps: [
        { id: "a1", icon: "lightbulb-on-outline", block: "Light", label: "Turn on the hallway lights", targets: "2 lights in the Hallway", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "100%"], ["Entities", "light.hallway_ceiling, light.hallway_lamp", true]] },
        { id: "w1", type: "wait", icon: "timer-sand", block: "Wait", label: "Wait until the hallway is clear", sub: "No motion for 2 minutes", fields: [["Condition", "No motion"], ["For", "2 minutes"]] },
        { id: "a2", icon: "lightbulb-off-outline", block: "Light", label: "Turn the hallway lights off", targets: "2 lights in the Hallway", fields: [["State", "Off", false, ["On", "Off"]], ["Entities", "light.hallway_ceiling, light.hallway_lamp", true]] },
      ],
    },
    "unoccupied-off": {
      triggers: [{ id: "t1", icon: "home-export-outline", block: "Person leaves", label: "The last person leaves", sub: "Home becomes unoccupied", fields: [["People", "Everyone"], ["Zone", "Home"]] }],
      conditions: [],
      steps: [{ id: "a1", icon: "lightbulb-group-off-outline", block: "Light", label: "Turn off every light", targets: "17 lights in the whole home", fields: [["State", "Off", false, ["On", "Off"]], ["Target", "All lights"], ["Transition", "3 seconds"]] }],
    },
    "heating-occupied": {
      triggers: [{ id: "t1", icon: "home-import-outline", block: "Person arrives", label: "Anyone arrives home", fields: [["People", "Anyone"], ["Zone", "Home"]] }],
      conditions: [{ id: "c1", icon: "thermostat", block: "State", label: "The heating is off or in eco", met: false, fields: [["Right now", "Heating to 21.0°C"]] }],
      steps: [{ id: "a1", icon: "thermostat", block: "Climate set temperature", label: "Set the heating to 21.5°", targets: "2 thermostats on the ground floor", fields: [["Target", "21.5°C", true], ["Entities", "climate.living_room, climate.hallway", true]] }],
    },
    "boost-ac": {
      triggers: [{ id: "t1", icon: "gesture-double-tap", block: "Button pressed", label: "The panic button is pressed", sub: "Living room panic button", fields: [["Device", "Living room panic button"], ["Entity", "event.panic_button", true]] }],
      conditions: [],
      steps: [
        { id: "a1", icon: "air-conditioner", block: "Climate set mode", label: "Run the AC at full", targets: "1 AC unit in the Living room", fields: [["Mode", "Cool, max fan"], ["Entity", "climate.living_room_ac", true]] },
        { id: "w1", type: "wait", icon: "timer-sand", block: "Wait", label: "Wait 10 minutes", fields: [["For", "10 minutes"]] },
        { id: "a2", icon: "air-conditioner", block: "Climate set mode", label: "Set the AC back to auto", targets: "1 AC unit in the Living room", fields: [["Mode", "Auto"], ["Entity", "climate.living_room_ac", true]] },
      ],
    },
    "sunset-lights": {
      triggers: [{ id: "t1", icon: "weather-sunset", block: "Sun", label: "At sunset", fields: [["Event", "Sun sets"], ["Offset", "None"]] }],
      conditions: [{ id: "c1", icon: "home-account", block: "Presence", label: "Someone is home", met: true, fields: [["People", "Anyone"], ["Right now", "Sofie, Lars and Tess are home"]] }],
      steps: [
        { id: "a1", icon: "lightbulb-on-outline", block: "Light", label: "Fade the garden lights on", targets: "3 lights in the Garden", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "60%"], ["Transition", "2 minutes"]] },
        { id: "a2", icon: "lightbulb-on-outline", block: "Light", label: "Fade the living room lights on", targets: "4 lights in the Living room", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "45%"], ["Transition", "2 minutes"]] },
      ],
      notes: { a1: "Sofie tuned the brightness down from 80 percent, the garden felt like a stadium." },
    },
    "away-lock": {
      triggers: [
        { id: "t1", icon: "home-export-outline", block: "Person leaves", label: "The last person leaves", fields: [["People", "Everyone"], ["Zone", "Home"]] },
        { id: "t2", icon: "clock-outline", block: "Time", label: "At 23:30", sub: "Every night", fields: [["Time", "23:30", true]] },
      ],
      conditions: [{ id: "c1", icon: "door-closed", block: "State", label: "Every door is closed", met: true, fields: [["Doors", "Front, garage, annex"], ["Right now", "All closed"]] }],
      steps: [
        { id: "a1", icon: "lock-outline", block: "Lock", label: "Lock the front door", targets: "1 lock in the Hallway", fields: [["Entity", "lock.front_door", true]] },
        { id: "a2", icon: "lock-outline", block: "Lock", label: "Lock the garage door", targets: "1 lock in the Garage", fields: [["Entity", "lock.garage_door", true]] },
        { id: "a3", icon: "lock-outline", block: "Lock", label: "Lock the annex door", targets: "1 lock in the Annex", fields: [["Entity", "lock.annex_door", true]] },
        { id: "a4", icon: "shield-home-outline", block: "Scene activate", label: "Set the home to away", fields: [["Heating", "Eco"], ["Lights", "Off"]] },
      ],
    },
    "lars-bedtime": {
      triggers: [
        { id: "t1", icon: "clock-outline", block: "Time", label: "At 19:30", fields: [["Time", "19:30", true]] },
        { id: "t2", icon: "clock-outline", block: "Time", label: "At 20:00", fields: [["Time", "20:00", true]] },
      ],
      conditions: [],
      steps: [
        { id: "ch1", type: "choose", icon: "call-split", block: "Choose", label: "Which time is it?", branches: [
          { id: "b1", label: "19:30, wind down", conditions: [
            { id: "c1", icon: "clock-outline", block: "Time", label: "The time is 19:30", fields: [["After", "19:30", true], ["Before", "20:00", true]] },
          ], steps: [
            { id: "a1", icon: "lightbulb-on-50", block: "Light", label: "Dim Lars's lamp to warm", targets: "1 light in Lars's room", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "30%"], ["Color", "Warm white"], ["Entity", "light.lars_lamp", true]] },
          ] },
          { id: "b2", label: "20:00, lights out", conditions: [
            { id: "c2", icon: "clock-outline", block: "Time", label: "The time is 20:00 or later", fields: [["After", "20:00", true]] },
          ], steps: [
            { id: "a2", icon: "lightbulb-off-outline", block: "Light", label: "Turn Lars's lamp off", targets: "1 light in Lars's room", fields: [["State", "Off", false, ["On", "Off"]], ["Entity", "light.lars_lamp", true]] },
          ] },
        ] },
      ],
    },
    "annex-night": {
      triggers: [{ id: "t1", icon: "clock-outline", block: "Time", label: "At 22:00", fields: [["Time", "22:00", true]] }],
      conditions: [],
      steps: [
        { id: "a1", icon: "lightbulb-on-30", block: "Light", label: "Turn on the annex night light", targets: "1 light in the Annex hallway", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "20%"], ["Entity", "light.annex_hallway", true]] },
        { id: "w1", type: "wait", icon: "timer-sand", block: "Wait", label: "Wait until 6:00", fields: [["Until", "6:00", true]] },
        { id: "a2", icon: "lightbulb-off-outline", block: "Light", label: "Turn the night light off", targets: "1 light in the Annex hallway", fields: [["State", "Off", false, ["On", "Off"]], ["Entity", "light.annex_hallway", true]] },
      ],
      notes: { a1: "Kept deliberately dim so it never wakes Elizabeth." },
    },
    "annex-heating": {
      triggers: [{ id: "t1", icon: "clock-outline", block: "Time", label: "At 7:00", fields: [["Time", "7:00", true]] }],
      conditions: [],
      steps: [
        { id: "a1", icon: "thermostat", block: "Climate set temperature", label: "Hold the annex at 22.5°", targets: "1 thermostat in the Annex", fields: [["Target", "22.5°C", true], ["Entity", "climate.annex", true]] },
        { id: "w1", type: "wait", icon: "timer-sand", block: "Wait", label: "Wait until 22:00", fields: [["Until", "22:00", true]] },
        { id: "a2", icon: "thermostat", block: "Climate set temperature", label: "Lower to 18° for the night", targets: "1 thermostat in the Annex", fields: [["Target", "18.0°C", true], ["Entity", "climate.annex", true]] },
      ],
    },
    "annex-morning": {
      triggers: [{ id: "t1", icon: "clock-outline", block: "Time", label: "At 7:30", fields: [["Time", "7:30", true]] }],
      conditions: [{ id: "c1", icon: "home-account", block: "Presence", label: "Elizabeth is home", met: true, fields: [["Person", "Elizabeth"], ["Right now", "Home"]] }],
      steps: [
        { id: "a1", icon: "blinds-open", block: "Cover open", label: "Open Elizabeth's blinds", targets: "1 cover in the Annex", fields: [["Position", "Fully open"], ["Entity", "cover.annex_blinds", true]] },
        { id: "a2", icon: "thermostat", block: "Climate set temperature", label: "Warm the room to 22.5°", targets: "1 thermostat in the Annex", fields: [["Target", "22.5°C", true], ["Entity", "climate.annex", true]] },
      ],
    },
    "goodnight": {
      script: true,
      steps: [
        { id: "a1", icon: "lock-outline", block: "Lock", label: "Lock the front and garage doors", targets: "2 locks", fields: [["Entities", "lock.front_door, lock.garage_door", true]] },
        { id: "a2", icon: "lightbulb-group-off-outline", block: "Light", label: "Turn off the downstairs lights", targets: "9 lights on the ground floor", fields: [["State", "Off", false, ["On", "Off"]], ["Transition", "5 seconds"]] },
        { id: "ch1", type: "choose", icon: "call-split", block: "Choose", label: "Is anyone still downstairs?", branches: [
          { id: "b1", label: "Someone is", met: false, conditions: [
            { id: "c1", icon: "motion-sensor", block: "Presence", label: "Someone is downstairs", fields: [["Area", "Ground floor"], ["State", "Detected"]] },
          ], steps: [
            { id: "a3", icon: "lightbulb-on-30", block: "Light", label: "Keep the hallway light at 20%", targets: "1 light in the Hallway", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "20%"], ["Entity", "light.hallway_lamp", true]] },
          ] },
          { id: "b2", label: "No one", met: true, conditions: [
            { id: "c2", icon: "motion-sensor-off", block: "Presence", label: "No one is downstairs", fields: [["Area", "Ground floor"], ["State", "Clear"]] },
          ], steps: [
            { id: "a4", icon: "thermostat", block: "Climate set temperature", label: "Set the heating to night", targets: "2 thermostats", fields: [["Target", "17.0°C", true]] },
          ] },
        ] },
      ],
    },
    "arrive-home": {
      script: true,
      steps: [
        { id: "a1", icon: "lock-open-variant-outline", block: "Unlock", label: "Unlock the front door", targets: "1 lock in the Hallway", fields: [["Entity", "lock.front_door", true]] },
        { id: "a2", icon: "lightbulb-on-outline", block: "Light", label: "Light the hallway", targets: "2 lights in the Hallway", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "100%"]] },
        { id: "a3", icon: "speaker", block: "Media play", label: "Resume the living room music", targets: "1 speaker in the Living room", fields: [["Entity", "media_player.living_room", true]] },
      ],
    },
    "leaving-home": {
      script: true,
      steps: [
        { id: "a1", icon: "lightbulb-group-off-outline", block: "Light", label: "Turn off every light", targets: "17 lights in the whole home", fields: [["State", "Off", false, ["On", "Off"]], ["Target", "All lights"]] },
        { id: "a2", icon: "lock-outline", block: "Lock", label: "Lock every door", targets: "3 locks", fields: [["Entities", "lock.front_door, lock.garage_door, lock.annex_door", true]] },
        { id: "a3", icon: "shield-home-outline", block: "Scene activate", label: "Set the home to away", fields: [["Heating", "Eco"]] },
      ],
    },
    "wake-up": {
      script: true,
      steps: [
        { id: "a1", icon: "lightbulb-on-10", block: "Light", label: "Bedroom lights to 10%", targets: "2 lights in the Bedroom", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "10%"], ["Color", "Warm white"]] },
        { id: "w1", type: "wait", icon: "timer-sand", block: "Wait", label: "Wait 5 minutes", fields: [["For", "5 minutes"]] },
        { id: "a2", icon: "lightbulb-on-50", block: "Light", label: "Bedroom lights to 50%", targets: "2 lights in the Bedroom", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "50%"]] },
        { id: "w2", type: "wait", icon: "timer-sand", block: "Wait", label: "Wait 5 minutes", fields: [["For", "5 minutes"]] },
        { id: "a3", icon: "lightbulb-on", block: "Light", label: "Bedroom lights to full", targets: "2 lights in the Bedroom", fields: [["State", "On", false, ["On", "Off"]], ["Brightness", "100%"], ["Color", "Cool white"]] },
      ],
    },
  },

  // ---- Recent runs (traces) --------------------------------------------
  // outcome: done | stopped (a condition ended the run) | error.
  // branches: chosen branch per choose node. details: per-node result strings.
  flowRuns: {
    "morning-routine": [
      { id: "r1", when: "today 6:32", trigger: "t1", outcome: "done", duration: "4.1s", branches: { ch1: "b1" }, details: { a1: "Heating set to 21.0°C", a2: "Turned on 2 lights", c2: "Sofie and Lars were home" } },
      { id: "r2", when: "Fri 6:30", trigger: "t1", outcome: "done", duration: "3.8s", branches: { ch1: "b2" }, details: { a1: "Heating set to 21.0°C", a3: "Blinds opened" } },
      { id: "r3", when: "Sat 6:30", trigger: "t1", outcome: "stopped", stopAt: "c1", duration: "0.1s", details: { c1: "Saturday, not a weekday" } },
    ],
    "hallway-motion": [
      { id: "r1", when: "today 7:48", trigger: "t1", outcome: "done", duration: "2m 14s", details: { a1: "Turned on 2 lights", w1: "Clear after 2m 8s", a2: "Turned off 2 lights" } },
      { id: "r2", when: "today 7:12", trigger: "t1", outcome: "done", duration: "3m 02s", details: { a1: "Turned on 2 lights", a2: "Turned off 2 lights" } },
      { id: "r3", when: "yesterday 23:41", trigger: "t1", outcome: "stopped", stopAt: "c1", duration: "0.1s", details: { c1: "23:41 is outside 6:00 to 23:00" } },
      { id: "r4", when: "yesterday 22:19", trigger: "t1", outcome: "done", duration: "2m 40s", details: { a1: "Turned on 2 lights", a2: "Turned off 2 lights" } },
    ],
    "unoccupied-off": [
      { id: "r1", when: "yesterday 9:10", trigger: "t1", outcome: "done", duration: "3.2s", by: "Daan left last", details: { a1: "Turned off 11 lights, 6 were already off" } },
    ],
    "heating-occupied": [
      { id: "r1", when: "today 7:02", trigger: "t1", outcome: "done", duration: "0.6s", by: "Tess arrived home", details: { c1: "Heating was in eco", a1: "Heating set to 21.5°C" } },
      { id: "r2", when: "yesterday 16:48", trigger: "t1", outcome: "stopped", stopAt: "c1", duration: "0.1s", by: "Sofie arrived home", details: { c1: "Heating was already on" } },
    ],
    "boost-ac": [],
    "sunset-lights": [
      { id: "r1", when: "yesterday 20:14", trigger: "t1", outcome: "done", duration: "2m 01s", details: { a1: "3 lights faded to 60%", a2: "4 lights faded to 45%" } },
      { id: "r2", when: "Sat 20:12", trigger: "t1", outcome: "done", duration: "2m 00s", details: { a1: "3 lights faded to 60%", a2: "4 lights faded to 45%" } },
    ],
    "away-lock": [
      { id: "r1", when: "today 8:20", trigger: "t1", outcome: "done", duration: "5.4s", by: "Sofie left last", details: { a1: "Locked", a2: "Locked", a3: "Locked", a4: "Heating to eco, 11 lights off" } },
      { id: "r2", when: "yesterday 23:30", trigger: "t2", outcome: "error", stopAt: "a3", duration: "30.2s", details: { a1: "Locked", a2: "Locked", a3: "The annex door lock did not respond within 30 seconds" } },
      { id: "r3", when: "yesterday 8:05", trigger: "t1", outcome: "done", duration: "4.9s", by: "Daan left last", details: { a1: "Locked", a2: "Locked", a3: "Locked", a4: "Heating to eco" } },
    ],
    "lars-bedtime": [
      { id: "r1", when: "yesterday 20:00", trigger: "t2", outcome: "done", duration: "0.4s", branches: { ch1: "b2" }, details: { a2: "Lamp turned off" } },
      { id: "r2", when: "yesterday 19:30", trigger: "t1", outcome: "done", duration: "0.5s", branches: { ch1: "b1" }, details: { a1: "Lamp dimmed to 30%, warm white" } },
    ],
    "annex-night": [
      { id: "r1", when: "today 6:00", trigger: "t1", outcome: "done", duration: "8h 00m", details: { a1: "Night light on at 20%", w1: "Waited until 6:00", a2: "Night light off" } },
    ],
    "annex-heating": [
      { id: "r1", when: "today 7:05", trigger: "t1", outcome: "done", duration: "15h 00m", details: { a1: "Holding 22.5°C" } },
    ],
    "annex-morning": [
      { id: "r1", when: "today 7:30", trigger: "t1", outcome: "done", duration: "1.9s", details: { c1: "Elizabeth was home", a1: "Blinds opened", a2: "Heating set to 22.5°C" } },
    ],
    "goodnight": [
      { id: "r1", when: "yesterday 23:02", trigger: "start", outcome: "done", duration: "6.0s", by: "Run by Daan", branches: { ch1: "b2" }, details: { a1: "2 doors locked", a2: "9 lights off", a4: "Heating set to 17.0°C" } },
    ],
    "arrive-home": [
      { id: "r1", when: "today 8:14", trigger: "start", outcome: "done", duration: "1.2s", by: "Front door tag, scanned by Sofie", details: { a1: "Unlocked", a2: "2 lights on", a3: "Resumed playing" } },
    ],
    "leaving-home": [
      { id: "r1", when: "today 8:20", trigger: "start", outcome: "done", duration: "4.1s", by: "Front door tag, scanned by Sofie", details: { a1: "11 lights off", a2: "3 doors locked", a3: "Home set to away" } },
    ],
    "wake-up": [],
  },

  // ---- Tags (physical NFC stickers and QR codes) ----------------------
  // A tag is a physical thing you scan. Scanning fires a tag_scanned event you
  // point automations at. Its value is the scans it produces and what they run.
  // `runs` references automations / scenes / scripts by { kind, id }.
  // `lastScannedBy` / scans[].by reference people ids. `scanCount` is total.
  tags: [
    { id: "front-door", name: "Front door", description: "Stuck inside the front door. Scan on your way in or out.", type: "nfc", space: "shared", icon: "door", area: "hallway", creator: "Daan",
      runs: [{ kind: "scripts", id: "arrive-home" }, { kind: "scripts", id: "leaving-home" }], scanCount: 214,
      lastScanned: "today 8:14", lastScannedBy: "sofie",
      scans: [{ by: "sofie", time: "today 8:14" }, { by: "daan", time: "today 7:36" }, { by: "tess", time: "yesterday 16:52" }, { by: "sofie", time: "yesterday 8:07" }] },
    { id: "lars-bedtime", name: "Lars's bedtime", description: "On Lars's nightstand. He scans it to start winding down.", type: "nfc", space: "shared", icon: "sticker-emoji", area: "lars-room", creator: "Daan",
      runs: [{ kind: "scripts", id: "goodnight" }], scanCount: 61,
      lastScanned: "yesterday 19:58", lastScannedBy: "lars",
      scans: [{ by: "lars", time: "yesterday 19:58" }, { by: "lars", time: "2 days ago" }, { by: "lars", time: "3 days ago" }] },
    { id: "coffee-machine", name: "Coffee machine", description: "By the coffee machine. Kicks off the morning.", type: "nfc", space: "shared", icon: "coffee", area: "kitchen", creator: "Sofie",
      runs: [{ kind: "scenes", id: "good-morning" }], scanCount: 138,
      lastScanned: "today 6:41", lastScannedBy: "daan",
      scans: [{ by: "daan", time: "today 6:41" }, { by: "sofie", time: "yesterday 6:58" }, { by: "daan", time: "2 days ago" }] },
    { id: "movie-night", name: "Movie night", description: "On the media console. Sets the room for a film.", type: "qr", space: "shared", icon: "movie-open", area: "living-room", creator: "Daan",
      runs: [{ kind: "scenes", id: "movie-night" }], scanCount: 27,
      lastScanned: "yesterday 20:31", lastScannedBy: "tess",
      scans: [{ by: "tess", time: "yesterday 20:31" }, { by: "sofie", time: "last week" }] },
    { id: "laundry", name: "Laundry", description: "On the washing machine. Scan when you start a load.", type: "nfc", space: "shared", icon: "washing-machine", area: "utility", creator: "Sofie",
      runs: [], scanCount: 44,
      lastScanned: "today 9:12", lastScannedBy: "sofie",
      scans: [{ by: "sofie", time: "today 9:12" }, { by: "daan", time: "3 days ago" }] },
    { id: "guest", name: "Guest", description: "A printed code for visitors. Lets the home know someone has arrived.", type: "qr", space: "shared", icon: "account-arrow-right", area: "hallway", creator: "Daan",
      runs: [{ kind: "scripts", id: "arrive-home" }], scanCount: 9,
      lastScanned: "today 8:02", lastScannedBy: "nour",
      scans: [{ by: "nour", time: "today 8:02" }, { by: "nour", time: "yesterday 8:05" }] },
    { id: "bins", name: "Bins", description: "By the back door. Scan when you take the bins out.", type: "nfc", space: "shared", icon: "trash-can-outline", area: "garage", creator: "Daan",
      runs: [], scanCount: 18,
      lastScanned: "2 days ago", lastScannedBy: "daan",
      scans: [{ by: "daan", time: "2 days ago" }, { by: "daan", time: "last week" }] },
    { id: "plants", name: "Plants", description: "By the garden tap. Logs when the plants were last watered.", type: "nfc", space: "shared", icon: "watering-can-outline", area: "garden", creator: "Sofie",
      runs: [], scanCount: 6,
      lastScanned: "never", lastScannedBy: null, scans: [] },
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

  // ---- Services (use-case pages) --------------------------------------
  // Each service is a top-level destination phrased as the job a resident is
  // doing ("what's the weather", "play music", "what's my commute"). Not a
  // technical "Services" bucket. `installed` lists the integration ids powering
  // it (see serviceIntegrations for the per-category gallery). View data lives
  // here; edit mode reads installed + the gallery + settings.
  services: {
    weather: {
      id: "weather", name: "Weather", icon: "weather-partly-rainy", route: "/weather", space: "shared",
      installed: ["metno"], location: "Utrecht, Netherlands", updated: "just now",
      now: { temp: 15, condition: "Light rain", icon: "weather-pouring", feelsLike: 14, high: 17, low: 10, wind: "14 km/h SW", humidity: 82, pressure: "1008 hPa", visibility: "8 km", uv: "Moderate" },
      hourly: [
        { t: "now", temp: 15, icon: "weather-pouring", pop: 80 },
        { t: "14:00", temp: 16, icon: "weather-rainy", pop: 60 },
        { t: "16:00", temp: 17, icon: "weather-partly-rainy", pop: 40 },
        { t: "18:00", temp: 16, icon: "weather-partly-cloudy", pop: 20 },
        { t: "20:00", temp: 14, icon: "weather-cloudy", pop: 10 },
        { t: "22:00", temp: 12, icon: "weather-night-partly-cloudy", pop: 10 },
        { t: "00:00", temp: 11, icon: "weather-night", pop: 5 },
        { t: "02:00", temp: 10, icon: "weather-night", pop: 5 },
      ],
      daily: [
        { day: "Today", hi: 17, lo: 10, icon: "weather-pouring", pop: 80 },
        { day: "Thu", hi: 19, lo: 11, icon: "weather-partly-cloudy", pop: 30 },
        { day: "Fri", hi: 22, lo: 13, icon: "weather-sunny", pop: 5 },
        { day: "Sat", hi: 24, lo: 14, icon: "weather-sunny", pop: 0 },
        { day: "Sun", hi: 21, lo: 15, icon: "weather-partly-cloudy", pop: 20 },
        { day: "Mon", hi: 18, lo: 12, icon: "weather-rainy", pop: 60 },
        { day: "Tue", hi: 20, lo: 12, icon: "weather-partly-cloudy", pop: 30 },
      ],
      sun: { sunrise: "05:24", sunset: "22:01", daylight: "16h 37m" },
      air: { aqi: 34, label: "Good", pollen: "Moderate", pollenType: "Grass pollen" },
      settings: { unit: "celsius", showOnHome: true, severeAlerts: true },
    },
    music: {
      id: "music", name: "Music", icon: "music", route: "/music", space: "shared",
      installed: ["spotify"],
      nowPlaying: { track: "Come Together", artist: "The Beatles", album: "Abbey Road", room: "Living room", playing: true, position: "1:12", duration: "4:20" },
      rooms: [
        { area: "living-room", name: "Living room", state: "Come Together, The Beatles", playing: true, volume: 42 },
        { area: "kitchen", name: "Kitchen", state: "Idle", playing: false, volume: 20 },
        { area: "tess-room", name: "Tess's room", state: "Idle", playing: false, volume: 30 },
      ],
      sources: [
        { id: "spotify", name: "Spotify", detail: "Daan's Premium account", icon: "spotify", connected: true },
        { id: "radio", name: "Radio", detail: "NPO Radio 2, Sky Radio, 3FM", icon: "radio", connected: true },
        { id: "library", name: "Local library", detail: "1,240 tracks on the home server", icon: "folder-music", connected: true },
      ],
      playlists: [
        { name: "Family favourites", detail: "48 songs", icon: "playlist-music" },
        { name: "Dinner", detail: "62 songs", icon: "silverware-fork-knife" },
        { name: "Focus", detail: "3h 20m", icon: "headphones" },
      ],
      settings: { defaultRoom: "living-room", explicitFilter: true, showArtwork: true },
    },
    commute: {
      id: "commute", name: "Commute", icon: "map-marker-path", route: "/commute", space: "shared",
      installed: ["googlemaps"],
      destinations: [
        { id: "work", name: "Daan's office", icon: "briefcase-variant", drive: "22 min", driveVia: "via A27", transit: "31 min", transitVia: "Bus 28, then a 6 min walk", traffic: "light", leaveBy: "08:40", next: "Bus 28 in 12 min" },
        { id: "school", name: "School", icon: "school", drive: "9 min", driveVia: "via Biltstraat", transit: "18 min", transitVia: "Bus 4", traffic: "moderate", leaveBy: "08:15", next: "Bus 4 in 5 min" },
        { id: "sofie-work", name: "Sofie's work", icon: "briefcase-variant", drive: "38 min", driveVia: "via A2", transit: "52 min", transitVia: "Train from Utrecht Centraal", traffic: "heavy", leaveBy: "07:55", next: "Train in 21 min" },
      ],
      settings: { home: "Abbey Road, Utrecht", mode: "drive", avoidTolls: false },
    },
    calendar: {
      id: "calendar", name: "Calendar", icon: "calendar", route: "/calendar", space: "shared",
      installed: ["google"],
      calendars: [
        { id: "family", name: "Family", color: "#2e9e5b" },
        { id: "daan", name: "Daan", color: "#1C6FD6" },
        { id: "sofie", name: "Sofie", color: "#a855f7" },
        { id: "school", name: "School", color: "#e0a32e" },
      ],
      events: [
        { id: "ev1", day: "Today", date: "Wednesday 1 July", time: "16:00", end: "17:30", title: "Tess football training", where: "Sports park Overvecht", cal: "school", who: ["Tess"], notes: "Bring the away kit and a full water bottle." },
        { id: "ev2", day: "Today", date: "Wednesday 1 July", time: "18:30", end: "20:00", title: "Dinner with Elizabeth", where: "Home", cal: "family", who: ["Daan", "Sofie", "Elizabeth"], notes: "" },
        { id: "ev3", day: "Today", date: "Wednesday 1 July", allDay: true, title: "Bin day, general waste", where: "", cal: "family", who: [], notes: "" },
        { id: "ev4", day: "Tomorrow", date: "Thursday 2 July", time: "09:00", end: "09:30", title: "Sofie, standup", where: "Amsterdam office", cal: "sofie", who: ["Sofie"], notes: "" },
        { id: "ev5", day: "Tomorrow", date: "Thursday 2 July", time: "15:00", end: "16:00", title: "Boiler service", where: "Home, utility room", cal: "family", who: ["Daan"], notes: "Engineer from Feenstra, between 15:00 and 17:00." },
        { id: "ev6", day: "Friday", date: "Friday 3 July", time: "12:30", end: "13:30", title: "Lunch with Mum", where: "Cafe Orloff", cal: "daan", who: ["Daan"], notes: "" },
      ],
      settings: { defaultCal: "family", weekStart: "monday", showDeclined: false },
    },
    todo: {
      id: "todo", name: "To-do", icon: "format-list-checks", route: "/todo", space: "shared",
      installed: ["local"],
      lists: [
        { id: "family", name: "Family to-do", color: "#2e9e5b", tasks: [
          { id: "t1", title: "Book the summer holiday", done: false, due: "This week", notes: "Compare the two campsites in the Ardennes before Friday." },
          { id: "t2", title: "Return the library books", done: false, due: "Today", notes: "" },
          { id: "t3", title: "Fix the garden gate latch", done: false, due: "", notes: "" },
          { id: "t4", title: "Pay the water bill", done: true, due: "", notes: "" },
        ] },
        { id: "shopping", name: "Shopping", color: "#1C6FD6", tasks: [
          { id: "s1", title: "Milk", done: false, due: "", notes: "" },
          { id: "s2", title: "Bread", done: false, due: "", notes: "" },
          { id: "s3", title: "Coffee beans", done: false, due: "", notes: "The dark roast from the market." },
          { id: "s4", title: "Dishwasher tablets", done: true, due: "", notes: "" },
        ] },
        { id: "tess", name: "Tess's list", color: "#e0a32e", tasks: [
          { id: "te1", title: "Maths homework", done: false, due: "Tomorrow", notes: "" },
          { id: "te2", title: "Pack football kit", done: false, due: "Today", notes: "" },
        ] },
      ],
      settings: { defaultList: "family", showCompleted: true },
    },
    waste: {
      id: "waste", name: "Waste", icon: "trash-can", route: "/waste", space: "shared",
      installed: ["afvalwijzer"], address: "Abbey Road, Utrecht",
      collections: [
        { id: "w1", type: "General waste", icon: "trash-can", color: "#6a6974", date: "Thursday 2 July", when: "Tomorrow" },
        { id: "w2", type: "Paper and cardboard", icon: "newspaper-variant-outline", color: "#1C6FD6", date: "Tuesday 7 July", when: "In 6 days" },
        { id: "w3", type: "Organic, garden and food", icon: "leaf", color: "#2e9e5b", date: "Thursday 9 July", when: "In 8 days" },
        { id: "w4", type: "Plastic, metal and cartons", icon: "recycle", color: "#e0a32e", date: "Tuesday 14 July", when: "In 13 days" },
      ],
      settings: { reminder: "evening-before", showInCalendar: true },
    },
  },

  // Per-category integration gallery (edit mode). `installed` marks what is
  // already powering the service; the rest are addable, filtered to the
  // category. Mirrors the real Home Assistant "add integration" flow, but
  // pre-filtered to the service the user is on.
  serviceIntegrations: {
    weather: [
      { id: "metno", name: "Met.no", desc: "Free forecasts from the Norwegian Meteorological Institute", icon: "weather-partly-cloudy", installed: true },
      { id: "buienradar", name: "Buienradar", desc: "Rain radar and forecasts for the Netherlands", icon: "weather-rainy", installed: false },
      { id: "owm", name: "OpenWeatherMap", desc: "Global current conditions and forecasts", icon: "weather-cloudy", installed: false },
      { id: "accuweather", name: "AccuWeather", desc: "Local forecasts, alerts and air quality", icon: "weather-lightning", installed: false },
    ],
    music: [
      { id: "spotify", name: "Spotify", desc: "Stream and control your Spotify library", icon: "spotify", installed: true },
      { id: "sonos", name: "Sonos", desc: "Control Sonos speakers and groups", icon: "speaker", installed: false },
      { id: "applemusic", name: "Apple Music", desc: "Stream from your Apple Music subscription", icon: "apple", installed: false },
      { id: "musicassistant", name: "Music Assistant", desc: "One library across every speaker in the home", icon: "music-box-multiple", installed: false },
    ],
    commute: [
      { id: "googlemaps", name: "Google Maps", desc: "Live drive times with current traffic", icon: "map-marker-path", installed: true },
      { id: "waze", name: "Waze", desc: "Community driven traffic and travel times", icon: "car-traction-control", installed: false },
      { id: "ns", name: "Nederlandse Spoorwegen", desc: "Dutch railway departure times", icon: "train", installed: false },
      { id: "nineduo", name: "9292", desc: "Public transport across the Netherlands", icon: "bus", installed: false },
    ],
    calendar: [
      { id: "google", name: "Google Calendar", desc: "Sync events from your Google account", icon: "calendar", installed: true },
      { id: "local", name: "Local calendar", desc: "A calendar stored on your home, no account needed", icon: "calendar-blank", installed: false },
      { id: "caldav", name: "CalDAV", desc: "Connect any CalDAV calendar, like iCloud or Fastmail", icon: "calendar-sync", installed: false },
      { id: "microsoft", name: "Microsoft 365", desc: "Sync events from Outlook and Microsoft 365", icon: "microsoft-outlook", installed: false },
    ],
    todo: [
      { id: "local", name: "Local to-do", desc: "Lists stored on your home, no account needed", icon: "format-list-checks", installed: true },
      { id: "todoist", name: "Todoist", desc: "Sync your Todoist projects and tasks", icon: "check-circle-outline", installed: false },
      { id: "googletasks", name: "Google Tasks", desc: "Sync tasks from your Google account", icon: "format-list-bulleted", installed: false },
    ],
    waste: [
      { id: "afvalwijzer", name: "Afvalwijzer", desc: "Dutch household waste collection schedules", icon: "trash-can", installed: true },
      { id: "icalwaste", name: "Council calendar (iCal)", desc: "Import a collection calendar from your council", icon: "calendar-import", installed: false },
    ],
  },

  // ---- Home overview: software update (drives the admin "system-update"
  // widget; the widget only shows when available is true) -----------------
  update: { version: "2025.11.0", available: true, current: "2025.10.2" },

  // ---- Home overview: devices found on the network, waiting for a
  // maintainer to set them up (drives the admin "discovered" widget; only
  // shows while the list is non-empty) ------------------------------------
  discovered: [
    { id: "disc-tv", name: "Samsung Frame TV", via: "Network discovery", icon: "television" },
    { id: "disc-hue", name: "Hue motion sensor", via: "Zigbee", icon: "motion-sensor" },
    { id: "disc-plug", name: "TApo smart plug", via: "Network discovery", icon: "power-socket-eu" },
  ],

  // ---- Personal data (Sofie's data autonomy view) ----------------------
  personalData: [
    { id: "presence", name: "Location", icon: "map-marker", access: "shared", description: "Whether you are home or away", usedBy: "Lights and heating routines respond to who is home" },
    { id: "health", name: "Health", icon: "heart-pulse", access: "private", description: "Activity and sleep from your connected watch", usedBy: "Not shared with anyone" },
    { id: "calendar", name: "Calendar", icon: "calendar", access: "shared", description: "Your events on the family calendar", usedBy: "Shown on the shared family calendar" },
    { id: "voice", name: "Voice", icon: "microphone", access: "private", description: "What you have asked the home out loud", usedBy: "Only you can see your own voice history" },
  ],

  // ---- Voice assistants (shared space) ---------------------------------
  // The pipeline directory: what voice assistants the home has, what they can
  // do, which satellites run them and where. This is capability, not content.
  // The transcript of what was said is deliberately NOT here (see the app's
  // transparency copy): shared speakers keep no readable record, and a person's
  // own attributed history lives in their Personal space (My data -> Voice).
  // A satellite carries an `area`, so persona scope (Nour, Lars) filters them
  // the same way the rest of the app does (canAccessArea).
  voiceAssistants: [
    {
      id: "home-voice", name: "Home voice", isDefault: true, space: "shared",
      language: "Dutch (Netherlands)", wakeWord: "Hey Nabu", processing: "local",
      handledOn: "This home",
      agent: { name: "Home Assistant", kind: "local" },
      stt: { name: "Whisper", kind: "local" },
      tts: { name: "Piper", voice: "Fenna", kind: "local" },
      can: [
        { icon: "lightbulb-on-outline", text: "Control lights, climate, locks and media" },
        { icon: "play-circle-outline", text: "Run scenes and scripts" },
        { icon: "home-search-outline", text: "Answer questions about the home" },
      ],
      satellites: [
        { id: "sat-lr", name: "Living room satellite", area: "living-room", status: "listening" },
        { id: "sat-kt", name: "Kitchen satellite", area: "kitchen", status: "listening" },
        { id: "sat-mb", name: "Bedroom satellite", area: "main-bedroom", status: "muted" },
      ],
    },
    {
      id: "ai-assist", name: "Assist with AI", isDefault: false, space: "shared",
      language: "English (United Kingdom)", wakeWord: "Okay Home", processing: "cloud",
      handledOn: "Home Assistant Cloud",
      agent: { name: "Home LLM", kind: "cloud" },
      stt: { name: "Home Assistant Cloud", kind: "cloud" },
      tts: { name: "Home Assistant Cloud", voice: "Colette", kind: "cloud" },
      can: [
        { icon: "message-processing-outline", text: "Understand plain language and follow ups" },
        { icon: "comment-question-outline", text: "Answer open questions beyond the home" },
      ],
      satellites: [
        { id: "sat-hall", name: "Hallway satellite", area: "hallway", status: "idle" },
      ],
    },
  ],

  // A person's own voice history, keyed by persona id. Attributed to them via
  // the companion app or voice match. Shown only in their Personal space
  // (My data -> Voice), never on the shared page. `handled` is where the
  // request was processed (local | cloud). Utterances the home could not
  // attribute to a person are never stored, so this is only ever your own.
  voiceHistory: {
    daan: [
      { id: "vh-d1", text: "Turn off the living room lights", time: "today 22:41", room: "Living room", assistant: "Home voice", response: "Turned off 2 lights", handled: "local" },
      { id: "vh-d2", text: "Is the front door locked?", time: "today 22:40", room: "Main bedroom", assistant: "Home voice", response: "Yes, the front door is locked", handled: "local" },
      { id: "vh-d3", text: "Set the bedroom to 19 degrees", time: "today 22:39", room: "Main bedroom", assistant: "Home voice", response: "Set the heating to 19.0 degrees", handled: "local" },
      { id: "vh-d4", text: "What is the weather tomorrow?", time: "yesterday 7:52", room: "Kitchen", assistant: "Assist with AI", response: "Rain in the afternoon, around 14 degrees", handled: "cloud" },
      { id: "vh-d5", text: "Start the coffee", time: "yesterday 7:04", room: "Kitchen", assistant: "Home voice", response: "Ran Good morning", handled: "local" },
    ],
    sofie: [
      { id: "vh-s1", text: "Play something in the kitchen", time: "today 18:10", room: "Kitchen", assistant: "Home voice", response: "Playing your Discover Weekly", handled: "local" },
      { id: "vh-s2", text: "How long until dinner is done?", time: "today 18:02", room: "Kitchen", assistant: "Assist with AI", response: "The timer has 12 minutes left", handled: "cloud" },
      { id: "vh-s3", text: "Turn on the hallway light", time: "today 7:48", room: "Hallway", assistant: "Home voice", response: "Turned on the hallway ceiling", handled: "local" },
    ],
    tess: [
      { id: "vh-t1", text: "Set an alarm for 7", time: "yesterday 22:15", room: "Living room", assistant: "Home voice", response: "Alarm set for 7:00", handled: "local" },
    ],
    lars: [
      { id: "vh-l1", text: "Goodnight", time: "yesterday 19:58", room: "Living room", assistant: "Home voice", response: "Ran Lars's bedtime lamp", handled: "local" },
    ],
    greet: [
      { id: "vh-g1", text: "Turn on my reading light", time: "today 20:20", room: "Elizabeth's room", assistant: "Home voice", response: "Turned on your lamp", handled: "local" },
    ],
    nour: [],
  },

  // ---- Settings IA (admin submenu, from the IA map) --------------------
  // Each item is a main settings page. Items with a `links` array surface those
  // IA sub-destinations as links on the main page (Remote access children,
  // protocol settings, account/guest, etc.), rather than as separate nav rows.
  settingsNav: [
    { items: [
      { id: "ha-cloud", label: "Home Assistant Cloud", icon: "cloud", links: [
        { label: "Remote UI access", icon: "remote-desktop" },
        { label: "Cloud backup", icon: "cloud-upload" },
        { label: "Cloud webhooks", icon: "webhook" },
        { label: "Account and subscription", icon: "card-account-details" },
      ]},
    ]},
    { items: [
      { id: "integrations", label: "Integrations", icon: "power-plug" },
      { id: "apps", label: "Apps", icon: "puzzle" },
      { id: "protocols", label: "Connectivity", icon: "lan", links: [
        { label: "Bluetooth", icon: "bluetooth" },
        { label: "Matter", icon: "lan" },
        { label: "Thread", icon: "vector-triangle" },
        { label: "Zigbee", icon: "z-wave" },
        { label: "Z-Wave", icon: "z-wave" },
        { label: "KNX", icon: "lan-connect" },
        { label: "Insteon", icon: "lan-connect" },
      ]},
      { id: "ai-tasks", label: "AI tasks", icon: "robot-happy" },
    ]},
    { items: [
      { id: "labs", label: "Labs", icon: "flask" },
    ]},
    { items: [
      { id: "general", label: "Home information", icon: "home" },
      { id: "floors-areas", label: "Floors and areas", icon: "layers-outline" },
      { id: "appearance", label: "Appearance", icon: "palette" },
      { id: "labels", label: "Labels", icon: "label" },
    ]},
    { items: [
      { id: "credentials", label: "Users", icon: "key", links: [
        { label: "Account", icon: "account" },
        { label: "Guest", icon: "account-clock" },
      ]},
      { id: "remote-access", label: "Remote access", icon: "web", links: [
        { label: "Voice assistant STT and TTS", icon: "text-to-speech" },
        { label: "Google Assistant", icon: "google-assistant" },
        { label: "Amazon Alexa", icon: "microphone" },
        { label: "AI agent", icon: "robot-happy" },
        { label: "Backup location", icon: "cloud-upload" },
      ]},
    ]},
    { items: [
      { id: "updates", label: "Updates", icon: "update" },
      { id: "repairs", label: "Repairs", icon: "wrench" },
    ]},
    { items: [
      { id: "hardware", label: "Hardware", icon: "chip" },
      { id: "storage", label: "Storage", icon: "harddisk" },
      { id: "backups", label: "Backups", icon: "backup-restore" },
      { id: "yaml", label: "YAML", icon: "code-braces" },
      { id: "network", label: "Network", icon: "wifi" },
    ]},
    { items: [
      { id: "analytics", label: "Analytics", icon: "chart-box" },
      { id: "statistics", label: "Statistics", icon: "chart-line" },
    ]},
  ],

  // Personal settings nav (from the IA personal space)
  personalSettingsNav: [
    { title: "Security", items: [
      { id: "p-security", label: "Security", icon: "shield-account" },
    ]},
    { title: "Personal", items: [
      { id: "p-appearance", label: "Appearance", icon: "palette" },
      { id: "p-accessibility", label: "Accessibility", icon: "human" },
      { id: "p-notifications", label: "Notifications", icon: "bell" },
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

  // ---- Cameras --------------------------------------------------------
  // The Cameras destination (shared space) reads the camera entities above
  // plus this system status, recorded clips, and detection events. Camera
  // devices carry `area`, so persona scope (Nour, Lars) filters them the same
  // way the rest of the app does (canAccessArea).
  cameraSystem: {
    armed: true,           // whether recording / detection is active
    online: 5, total: 5,   // recomputed against accessible cameras at render
    storageUsed: 412,      // GB
    storageTotal: 1000,    // GB (1 TB local disk)
    oldest: "18 days",     // retention window
    retention: "Keeps 30 days, or until the disk is full",
  },
  // Recorded clips per camera (most recent first). Times are today unless a
  // `day` is given. `kind` drives the glyph (motion / person / vehicle / doorbell).
  cameraClips: [
    { id: "clip_fd_1", cam: "front_door_cam", kind: "doorbell", label: "Doorbell pressed", start: "08:14", end: "08:15", dur: "1m 02s", size: "38 MB" },
    { id: "clip_fd_2", cam: "front_door_cam", kind: "person", label: "Sofie left", start: "07:52", end: "07:53", dur: "0m 44s", size: "26 MB" },
    { id: "clip_fd_3", cam: "front_door_cam", kind: "vehicle", label: "Parcel van stopped", start: "Yesterday 16:03", end: "16:05", dur: "2m 11s", size: "74 MB", day: "yesterday" },
    { id: "clip_gd_1", cam: "garden_cam", kind: "animal", label: "Cat crossed the lawn", start: "13:07", end: "13:08", dur: "0m 28s", size: "16 MB" },
    { id: "clip_gd_2", cam: "garden_cam", kind: "person", label: "Lars playing outside", start: "11:35", end: "11:49", dur: "13m 40s", size: "402 MB" },
    { id: "clip_lr_1", cam: "living_room_cam", kind: "motion", label: "Motion detected", start: "09:18", end: "09:19", dur: "0m 51s", size: "30 MB" },
    { id: "clip_gr_1", cam: "garage_cam", kind: "motion", label: "Garage door opened", start: "Yesterday 22:10", end: "22:11", dur: "1m 04s", size: "36 MB", day: "yesterday" },
  ],
  // Detection events (the Events grid). type: person | vehicle | animal | motion.
  cameraEvents: [
    { id: "ev_1", cam: "front_door_cam", type: "person", label: "Sofie", time: "08:14", ago: "4 hours ago", confidence: 96 },
    { id: "ev_2", cam: "front_door_cam", type: "vehicle", label: "Delivery van", time: "08:02", ago: "4 hours ago", confidence: 91 },
    { id: "ev_5", cam: "garden_cam", type: "animal", label: "Cat", time: "13:07", ago: "5 hours ago", confidence: 79 },
    { id: "ev_6", cam: "garden_cam", type: "person", label: "Lars", time: "11:35", ago: "7 hours ago", confidence: 94 },
    { id: "ev_7", cam: "garden_cam", type: "motion", label: "Motion", time: "10:58", ago: "8 hours ago", confidence: 72 },
    { id: "ev_8", cam: "living_room_cam", type: "person", label: "Person", time: "09:18", ago: "9 hours ago", confidence: 90 },
    { id: "ev_9", cam: "living_room_cam", type: "animal", label: "Cat", time: "07:44", ago: "10 hours ago", confidence: 81 },
    { id: "ev_10", cam: "front_door_cam", type: "person", label: "Postal worker", time: "Yesterday 16:03", ago: "yesterday", confidence: 93, day: "yesterday" },
    { id: "ev_12", cam: "garage_cam", type: "motion", label: "Motion", time: "Yesterday 22:10", ago: "yesterday", confidence: 74, day: "yesterday" },
    { id: "ev_13", cam: "front_door_cam", type: "animal", label: "Dog", time: "Yesterday 09:12", ago: "yesterday", confidence: 83, day: "yesterday" },
    { id: "ev_14", cam: "garden_cam", type: "vehicle", label: "Bicycle", time: "16:29", ago: "3 hours ago", confidence: 77 },
  ],

  // ---- Files (maintainer only) ----------------------------------------
  // The Files destination (admin space) browses everything the instance can
  // reach, on the local disk and in the cloud, and edits YAML in place, so the
  // File editor add-on is no longer needed. A tree of nodes: kind is
  // location | dir | file. Files carry ftype (yaml | text | json | log | image
  // | binary), size, modified, and (for text) content. `protected: true` marks
  // read-only, sensitive files (.storage, secrets) that must not be edited.
  files: [
    {
      id: "instance", name: "On this instance", kind: "location", icon: "harddisk",
      detail: "Local config and media on the Home Assistant Green",
      children: [
        {
          id: "config", name: "config", kind: "dir", icon: "folder-cog", detail: "Configuration",
          children: [
            { id: "configuration.yaml", name: "configuration.yaml", kind: "file", ftype: "yaml", size: "1.2 KB", modified: "3 days ago",
              content: "# Loads default set of integrations. Do not remove.\ndefault_config:\n\n# Load frontend themes from the themes folder\nfrontend:\n  themes: !include_dir_merge_named themes\n\nautomation: !include automations.yaml\nscript: !include scripts.yaml\nscene: !include scenes.yaml\n\nhomeassistant:\n  name: Abbey Road\n  latitude: 52.0825\n  longitude: 5.1437\n  elevation: 13\n  unit_system: metric\n  time_zone: Europe/Amsterdam\n" },
            { id: "automations.yaml", name: "automations.yaml", kind: "file", ftype: "yaml", size: "6.4 KB", modified: "2 hours ago",
              content: "- id: '1699812345'\n  alias: Sunset lights\n  trigger:\n    - platform: sun\n      event: sunset\n      offset: '-00:15:00'\n  action:\n    - service: light.turn_on\n      target:\n        area_id: living_room\n\n- id: '1699898765'\n  alias: Arrive home\n  trigger:\n    - platform: tag\n      tag_id: front_door\n  action:\n    - service: lock.unlock\n      target:\n        entity_id: lock.front_door\n" },
            { id: "scripts.yaml", name: "scripts.yaml", kind: "file", ftype: "yaml", size: "2.1 KB", modified: "5 days ago",
              content: "goodnight:\n  alias: Goodnight\n  sequence:\n    - service: light.turn_off\n      target:\n        entity_id: all\n    - service: lock.lock\n      target:\n        entity_id: lock.front_door\n" },
            { id: "scenes.yaml", name: "scenes.yaml", kind: "file", ftype: "yaml", size: "1.8 KB", modified: "1 week ago",
              content: "- id: '1700000001'\n  name: Movie night\n  entities:\n    light.living_room_ceiling: off\n    light.tv_backlight: on\n    media_player.living_room: playing\n" },
            { id: "secrets.yaml", name: "secrets.yaml", kind: "file", ftype: "yaml", size: "0.4 KB", modified: "2 months ago", protected: true,
              content: "# Secrets are hidden. This file holds tokens and passwords\n# and cannot be edited here.\n" },
            { id: "themes", name: "themes", kind: "dir", icon: "palette-swatch", detail: "3 themes",
              children: [
                { id: "abbey.yaml", name: "abbey.yaml", kind: "file", ftype: "yaml", size: "0.9 KB", modified: "1 month ago",
                  content: "Abbey warm:\n  primary-color: '#1C6FD6'\n  card-background-color: '#222226'\n  primary-background-color: '#18181a'\n" },
              ],
            },
            { id: "www", name: "www", kind: "dir", icon: "folder-network", detail: "Served at /local", children: [
              { id: "floorplan.png", name: "floorplan.png", kind: "file", ftype: "image", size: "248 KB", modified: "3 weeks ago" },
              { id: "welcome.mp3", name: "welcome.mp3", kind: "file", ftype: "binary", size: "1.1 MB", modified: "3 weeks ago" },
            ] },
            { id: "custom_components", name: "custom_components", kind: "dir", icon: "puzzle", detail: "2 custom integrations", children: [
              { id: "hacs", name: "hacs", kind: "dir", icon: "folder", detail: "HACS", children: [] },
              { id: "afvalwijzer", name: "afvalwijzer", kind: "dir", icon: "folder", detail: "Waste collection", children: [] },
            ] },
            { id: "blueprints", name: "blueprints", kind: "dir", icon: "file-tree", detail: "Automation and script blueprints", children: [] },
            { id: ".storage", name: ".storage", kind: "dir", icon: "database-lock", detail: "Internal state, read only", protected: true, children: [
              { id: "core.config_entries", name: "core.config_entries", kind: "file", ftype: "json", size: "84 KB", modified: "2 hours ago", protected: true, content: "{\n  \"version\": 1,\n  \"data\": { \"entries\": [ ... ] }\n}" },
            ] },
            { id: "home-assistant.log", name: "home-assistant.log", kind: "file", ftype: "log", size: "512 KB", modified: "1 minute ago",
              content: "2026-07-01 16:42:08 INFO (MainThread) [homeassistant.core] Starting Home Assistant\n2026-07-01 16:51:33 ERROR (MainThread) [homeassistant.components.camera] Timeout fetching front_door snapshot\n2026-07-01 17:02:19 INFO (MainThread) [homeassistant.components.hassio] Cloud backup completed\n" },
          ],
        },
        {
          id: "media", name: "media", kind: "dir", icon: "folder-play", detail: "Local media library",
          children: [
            { id: "music", name: "music", kind: "dir", icon: "folder-music", detail: "1,240 tracks", children: [] },
            { id: "movies", name: "movies", kind: "dir", icon: "folder", detail: "Home videos", children: [] },
            { id: "photos", name: "photos", kind: "dir", icon: "folder-image", detail: "Shared albums", children: [] },
          ],
        },
        { id: "share", name: "share", kind: "dir", icon: "folder-account", detail: "Shared with add-ons", children: [] },
        { id: "backup", name: "backup", kind: "dir", icon: "backup-restore", detail: "3 local backups", children: [
          { id: "backup-2026-07-01.tar", name: "Full backup 2026-07-01.tar", kind: "file", ftype: "binary", size: "788 MB", modified: "today" },
          { id: "backup-2026-06-24.tar", name: "Full backup 2026-06-24.tar", kind: "file", ftype: "binary", size: "771 MB", modified: "1 week ago" },
        ] },
      ],
    },
    {
      id: "cloud", name: "Home Assistant Cloud", kind: "location", icon: "cloud-outline",
      detail: "Nabu Casa, cloud backup",
      children: [
        { id: "cloud-backups", name: "Cloud backups", kind: "dir", icon: "cloud-lock", detail: "Encrypted, off site", children: [
          { id: "cloud-backup-2026-07-01.tar", name: "Cloud backup 2026-07-01.tar", kind: "file", ftype: "binary", size: "788 MB", modified: "today" },
        ] },
      ],
    },
    {
      id: "nas", name: "Network storage", kind: "location", icon: "nas",
      detail: "Synology NAS, mounted over SMB",
      children: [
        { id: "nas-media", name: "Media", kind: "dir", icon: "folder-play", detail: "Movies and music", children: [] },
        { id: "nas-recordings", name: "Camera recordings", kind: "dir", icon: "folder-play", detail: "Archived clips", children: [] },
      ],
    },
  ],
};

// ---- Route directory (for the More page, grouped by space) -------------
// Each: id, label, icon, space, route. Filtered per persona's spaces + scope.
export const directory = [
  // Shared, home perspective. Note: Lights / Climate / Security / Media are not
  // listed here. They are perspectives within Home, reached through the home
  // tab bar, not standalone destinations in the dock or the More directory.
  { id: "home", label: "Home", icon: "home", space: "shared", route: "/home" },
  // Shared, discovery
  { id: "devices", label: "Devices", icon: "devices", space: "shared", route: "/devices" },
  { id: "people", label: "People", icon: "account-group", space: "shared", route: "/people" },
  { id: "cameras", label: "Cameras", icon: "cctv", space: "shared", route: "/cameras" },
  { id: "map", label: "Map", icon: "map", space: "shared", route: "/map" },
  { id: "explore", label: "Explore", icon: "compass-outline", space: "shared", route: "/explore" },
  // Shared, home routines
  { id: "automations", label: "Automations", icon: "robot", space: "shared", route: "/automations" },
  { id: "scenes", label: "Scenes", icon: "palette", space: "shared", route: "/scenes" },
  { id: "scripts", label: "Scripts", icon: "script-text", space: "shared", route: "/scripts" },
  { id: "tags", label: "Tags", icon: "nfc-variant", space: "shared", route: "/tags" },
  { id: "voice-assistants", label: "Voice assistants", icon: "assistant", space: "shared", route: "/voice-assistants" },
  // Shared, analytics
  { id: "energy", label: "Energy", icon: "lightning-bolt", space: "shared", route: "/energy" },
  { id: "history", label: "History", icon: "history", space: "shared", route: "/history" },
  { id: "activity", label: "Activity", icon: "timeline-text", space: "shared", route: "/activity" },
  // Shared, services (use-case pages). More-page grouping is deferred; these
  // land in the shared group for now so they are reachable.
  { id: "weather", label: "Weather", icon: "weather-partly-rainy", space: "shared", route: "/weather" },
  { id: "music", label: "Music", icon: "music", space: "shared", route: "/music" },
  { id: "commute", label: "Commute", icon: "map-marker-path", space: "shared", route: "/commute" },
  { id: "calendar", label: "Calendar", icon: "calendar", space: "shared", route: "/calendar" },
  { id: "todo", label: "To-do", icon: "format-list-checks", space: "shared", route: "/todo" },
  { id: "waste", label: "Waste", icon: "trash-can", space: "shared", route: "/waste" },
  // Personal
  { id: "my-data", label: "My data", icon: "shield-lock", space: "personal", route: "/my/data" },
  { id: "my-settings", label: "My settings", icon: "cog-outline", space: "personal", route: "/my/settings" },
  // Admin
  { id: "settings", label: "Settings", icon: "cog", space: "admin", route: "/settings" },
  { id: "entities", label: "Entities", icon: "shape-outline", space: "admin", route: "/entities" },
  { id: "files", label: "Files", icon: "folder-cog", space: "admin", route: "/files" },
  { id: "logs", label: "Logs", icon: "text-box", space: "admin", route: "/logs" },
  { id: "extensions", label: "Community store", icon: "store", space: "admin", route: "/extensions" },
];

// ---- Entity registry (admin: entities list + developer tools states) ----
// The granular per-entity layer beneath devices. Real Home Assistant has many
// entities per device; this expands the device list (`household.entities`,
// which this codebase uses as the *devices* array) into a realistic registry
// carrying domain, current state, attributes, integration, status flags and
// category. `deviceId` references a device in `household.entities` (null for
// orphaned / standalone entities). Admin space only. The states side is
// read-only: there is no "set state" here by design.
export const entityRegistry = (() => {
  const reg = [];
  const areaName = (id) => (household.areas[id] || {}).name || "";
  const push = (e) => reg.push(Object.assign(
    { enabled: true, hidden: false, readOnly: false, unavailable: false, restored: false, labels: [], category: null, assistants: [], unit: "" }, e));
  const integ = (d) => {
    if (d.type === "light") return /garden|driveway|patio/.test(d.id) ? "ESPHome" : "Philips Hue";
    if (d.type === "climate") return d.id === "utility_boiler" ? "ESPHome" : "Google Nest";
    if (d.type === "lock") return "Z-Wave";
    if (d.type === "camera") return /front_door/.test(d.id) ? "Google Nest" : "Reolink";
    if (d.type === "media") return "Sonos";
    if (d.type === "sensor") return /patio|garden/.test(d.id) ? "ESPHome" : "Zigbee";
    if (d.type === "voice") return "Assist";
    return "Other";
  };
  const homeA = ["Home Assistant"];
  const cloudA = ["Home Assistant", "Google Assistant", "Amazon Alexa"];
  household.entities.forEach((d, di) => {
    const integration = integ(d);
    const A = areaName(d.area);
    const fn = (suffix) => (A ? A + " " : "") + d.name + (suffix ? " " + suffix : "");
    if (d.type === "light") {
      push({ id: "light." + d.id, name: d.name, domain: "light", deviceId: d.id, integration, area: d.area,
        state: d.on ? "on" : "off",
        attributes: Object.assign({ friendly_name: fn(), supported_color_modes: ["color_temp", "xy"] }, d.on ? { brightness: 180, color_temp_kelvin: 2700 } : {}),
        assistants: cloudA, labels: ["Lighting"] });
    } else if (d.type === "climate") {
      const mode = ({ Automatic: "auto", Heat: "heat", Cool: "cool" })[d.mode] || "auto";
      push({ id: "climate." + d.id, name: d.name, domain: "climate", deviceId: d.id, integration, area: d.area,
        state: mode,
        attributes: { friendly_name: fn(), current_temperature: d.current, temperature: d.target, hvac_modes: ["off", "heat", "auto"], hvac_action: d.current < d.target ? "heating" : "idle", min_temp: 7, max_temp: 35 },
        assistants: cloudA, labels: ["Climate"] });
      push({ id: "sensor." + d.id + "_temperature", name: d.name + " temperature", domain: "sensor", deviceId: d.id, integration, area: d.area,
        state: String(d.current), unit: "\u00b0C",
        attributes: { friendly_name: fn("temperature"), device_class: "temperature", state_class: "measurement", unit_of_measurement: "\u00b0C" } });
    } else if (d.type === "lock") {
      push({ id: "lock." + d.id, name: d.name, domain: "lock", deviceId: d.id, integration, area: d.area,
        state: d.locked ? "locked" : "unlocked",
        attributes: { friendly_name: fn(), supported_features: 1 }, assistants: homeA, labels: ["Security"] });
    } else if (d.type === "camera") {
      const un = d.live === false && /garage/.test(d.id);
      push({ id: "camera." + d.id, name: d.name, domain: "camera", deviceId: d.id, integration, area: d.area,
        state: un ? "unavailable" : (d.live ? "streaming" : "idle"), unavailable: un,
        attributes: { friendly_name: fn(), frontend_stream_type: "hls", supported_features: 2 }, assistants: homeA, labels: ["Security"] });
      push({ id: "binary_sensor." + d.id + "_motion", name: d.name + " motion", domain: "binary_sensor", deviceId: d.id, integration, area: d.area,
        state: "off",
        attributes: { friendly_name: fn("motion"), device_class: "motion" }, labels: ["Security"] });
    } else if (d.type === "media") {
      const parts = (d.track || "").split(",");
      push({ id: "media_player." + d.id, name: d.name, domain: "media_player", deviceId: d.id, integration, area: d.area,
        state: d.playing ? "playing" : "idle",
        attributes: Object.assign({ friendly_name: fn(), volume_level: 0.34, supported_features: 152461 }, d.playing && d.track ? { media_title: parts[0].trim(), media_artist: (parts[1] || "").trim() } : {}),
        assistants: homeA });
    } else if (d.type === "voice") {
      push({ id: "assist_satellite." + d.id, name: d.name, domain: "assist_satellite", deviceId: d.id, integration, area: d.area,
        state: "idle", attributes: { friendly_name: fn(), supported_features: 1 } });
    } else if (d.type === "sensor") {
      const dc = ({ Motion: "motion", Leak: "moisture", CO: "smoke", Humidity: "humidity", Temperature: "temperature" })[d.devType];
      if (["motion", "moisture", "smoke"].includes(dc)) {
        push({ id: "binary_sensor." + d.id, name: d.name, domain: "binary_sensor", deviceId: d.id, integration, area: d.area,
          state: /detect/i.test(d.state) ? "on" : "off",
          attributes: { friendly_name: fn(), device_class: dc } });
      } else {
        const num = parseFloat(d.state);
        const unit = /%/.test(d.state) ? "%" : /\u00b0C/.test(d.state) ? "\u00b0C" : "";
        push({ id: "sensor." + d.id, name: d.name, domain: "sensor", deviceId: d.id, integration, area: d.area,
          state: isNaN(num) ? d.state : String(num), unit,
          attributes: { friendly_name: fn(), device_class: dc || undefined, state_class: "measurement", unit_of_measurement: unit || undefined } });
      }
    }
    if (typeof d.battery === "number") {
      push({ id: "sensor." + d.id + "_battery", name: d.name + " battery", domain: "sensor", deviceId: d.id, integration, area: d.area,
        state: String(d.battery), unit: "%", category: "diagnostic", enabled: di % 4 !== 3,
        attributes: { friendly_name: fn("battery"), device_class: "battery", state_class: "measurement", unit_of_measurement: "%" } });
    }
  });
  // Hidden / config touches for honest Status variety.
  const at = (id) => reg.find((e) => e.id === id);
  if (at("light.living_room_tv_backlight")) at("light.living_room_tv_backlight").hidden = true;
  if (at("sensor.kitchen_motion_battery")) at("sensor.kitchen_motion_battery").hidden = true;
  if (at("binary_sensor.garden_cam_motion")) at("binary_sensor.garden_cam_motion").category = "diagnostic";
  // Orphaned / read-only / disabled standalone entities (the removable ones).
  push({ id: "light.spare_bulb", name: "Spare bulb", domain: "light", deviceId: null, integration: "MQTT", area: null,
    state: "unavailable", unavailable: true, restored: true, attributes: { friendly_name: "Spare bulb", restored: true } });
  push({ id: "sensor.template_daylight", name: "Daylight", domain: "sensor", deviceId: null, integration: "Template", area: null,
    state: "Below horizon", readOnly: true, attributes: { friendly_name: "Daylight" } });
  push({ id: "switch.old_smart_plug", name: "Old smart plug", domain: "switch", deviceId: null, integration: "TP-Link Kasa", area: "garage",
    state: "unavailable", unavailable: true, enabled: false, attributes: { friendly_name: "Old smart plug" } });
  return reg;
})();

// ---- Integrations (the combined connector layer, admin) ----------------
// Computed, not hand-kept: device integrations come from the entity registry
// (grouped by each entity's `integration`), service integrations from the
// installed ids on each Service page, plus a few internal/system connectors.
// This is the honest technical layer powering both Devices and the Service
// pages. See plan.md "Settings -> Integrations (the combined connector layer)".
export const integrations = (() => {
  const docBase = "https://www.home-assistant.io/integrations/";
  // Metadata per device-integration NAME (as assigned by the registry's
  // integ()). `domain` drives the brand logo (brands.home-assistant.io).
  const DEVICE_META = {
    "Philips Hue":  { id: "hue", domain: "hue", author: "Signify", version: "4.2.1", iotClass: "Local push" },
    "ESPHome":      { id: "esphome", domain: "esphome", author: "ESPHome", version: "2025.10.3", iotClass: "Local push" },
    "Google Nest":  { id: "nest", domain: "nest", author: "Google", version: "1.9.0", iotClass: "Cloud push" },
    "Z-Wave":       { id: "zwave_js", domain: "zwave_js", author: "Home Assistant", version: "0.7.2", iotClass: "Local push" },
    "Reolink":      { id: "reolink", domain: "reolink", author: "Reolink", version: "0.5.4", iotClass: "Local push" },
    "Sonos":        { id: "sonos", domain: "sonos", author: "Sonos", version: "1.3.0", iotClass: "Local push" },
    "Zigbee":       { id: "zha", domain: "zha", author: "Home Assistant", version: "0.7.0", iotClass: "Local push" },
    "Assist":       { id: "assist_pipeline", domain: "assist_pipeline", author: "Home Assistant", version: "1.0.0", iotClass: "Local push" },
    "MQTT":         { id: "mqtt", domain: "mqtt", author: "Home Assistant", version: "6.5.0", iotClass: "Local push", category: "system" },
    "Template":     { id: "template", domain: "template", author: "Home Assistant", version: "1.0.0", iotClass: "Local push", category: "system" },
    "TP-Link Kasa": { id: "tplink", domain: "tplink", author: "TP-Link", version: "0.4.1", iotClass: "Local polling" },
  };
  const byName = {};
  entityRegistry.forEach((e) => {
    const n = e.integration; if (!n) return;
    if (!byName[n]) byName[n] = { deviceIds: [], entityIds: [] };
    const g = byName[n];
    if (e.deviceId && g.deviceIds.indexOf(e.deviceId) < 0) g.deviceIds.push(e.deviceId);
    g.entityIds.push(e.id);
  });
  const out = [];
  Object.keys(byName).forEach((name) => {
    const meta = DEVICE_META[name] || { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "_"), domain: null, author: "Home Assistant", version: "1.0.0", iotClass: "Local polling" };
    const g = byName[name];
    const dc = g.deviceIds.length, ec = g.entityIds.length;
    let entries;
    if (meta.id === "hue") {
      const d1 = Math.ceil(dc / 2), e1 = Math.ceil(ec / 2);
      entries = [
        { id: "hue-lr", title: "Living room bridge", status: "loaded", deviceCount: d1, entityCount: e1 },
        { id: "hue-studio", title: "Studio bridge", status: "loaded", deviceCount: dc - d1, entityCount: ec - e1 },
      ];
    } else if (meta.id === "reolink") {
      entries = [{ id: "reolink-1", title: name, status: "error", deviceCount: dc, entityCount: ec,
        issue: { kind: "reauth", text: "Reolink needs you to sign in again. The camera password may have changed." } }];
    } else if (meta.id === "tplink") {
      entries = [{ id: "tplink-1", title: name, status: "disabled", deviceCount: dc, entityCount: ec }];
    } else {
      entries = [{ id: meta.id + "-1", title: name, status: "loaded", deviceCount: dc, entityCount: ec }];
    }
    out.push({ id: meta.id, name, domain: meta.domain, author: meta.author, version: meta.version,
      iotClass: meta.iotClass, category: meta.category || "device", docsUrl: docBase + meta.id + "/",
      deviceIds: g.deviceIds, entityIds: g.entityIds, deviceCount: dc, entityCount: ec, entries });
  });
  // Service integrations: each service's installed ids resolved against the
  // per-category gallery; deduped, a shared connector accumulates the services
  // it powers.
  const SVC_DOMAIN = { metno: "met", spotify: "spotify", googlemaps: "google_maps", google: "google" };
  const svcById = {};
  Object.keys(household.services).forEach((sid) => {
    const svc = household.services[sid];
    const gal = household.serviceIntegrations[sid] || [];
    (svc.installed || []).forEach((iid) => {
      const g = gal.find((x) => x.id === iid) || { id: iid, name: iid, icon: "power-plug" };
      if (!svcById[iid]) svcById[iid] = { key: iid, name: g.name, icon: g.icon, powers: [], powerRoutes: [] };
      svcById[iid].powers.push(svc.name);
      svcById[iid].powerRoutes.push({ name: svc.name, route: svc.route, id: svc.id });
    });
  });
  Object.keys(svcById).forEach((iid) => {
    const s = svcById[iid];
    const local = /^(local|caldav)$/.test(iid) || /local/i.test(s.name);
    out.push({ id: "svc_" + iid, name: s.name, domain: SVC_DOMAIN[iid] || null, icon: s.icon,
      author: "Home Assistant", version: "1.0.0", iotClass: local ? "Local push" : "Cloud polling",
      category: "service", docsUrl: docBase, powers: s.powers, powerRoutes: s.powerRoutes,
      deviceIds: [], entityIds: [], deviceCount: 0, entityCount: 0,
      entries: [{ id: "svc_" + iid + "-1", title: s.name, status: "loaded", deviceCount: 0, entityCount: 0 }] });
  });
  // Internal / system connectors that are neither devices nor feeds.
  const sys = (id, name, domain, icon, iotClass, powers) => out.push({ id, name, domain, icon,
    author: id === "cloud" ? "Nabu Casa" : "Home Assistant", version: "1.0.0", iotClass, category: "system",
    docsUrl: docBase + id + "/", powers: powers || [], powerRoutes: [], deviceIds: [], entityIds: [],
    deviceCount: 0, entityCount: 0, entries: [{ id: id + "-1", title: name, status: "loaded", deviceCount: 0, entityCount: 0 }] });
  sys("cloud", "Home Assistant Cloud", "cloud", "cloud", "Cloud push", ["Remote access", "Voice control", "Google and Alexa"]);
  sys("google_assistant", "Google Assistant", "google_assistant", "google-assistant", "Cloud push", ["Voice control"]);
  sys("alexa", "Amazon Alexa", "alexa", "microphone", "Cloud push", ["Voice control"]);
  // Roll a top-level status + issues onto each integration from its entries.
  out.forEach((it) => {
    const st = it.entries.map((e) => e.status);
    it.status = st.indexOf("error") >= 0 ? "error" : st.every((s) => s === "disabled") ? "disabled" : (st.indexOf("disabled") >= 0 ? "partial" : "loaded");
    it.issues = it.entries.filter((e) => e.issue).map((e) => e.issue);
  });
  const catRank = { device: 0, service: 1, system: 2 };
  out.sort((a, b) => (catRank[a.category] - catRank[b.category]) || a.name.localeCompare(b.name));
  return out;
})();

// ---- Bookmark targets ---------------------------------------------------
// Bookmarks are favourite shortcuts, NOT destinations. They never appear on
// the More page. A bookmark can point at a top-level directory entry OR at a
// subpage (e.g. a specific area like the front door). Subpage shortcuts that
// are not themselves More destinations live here; bookmarksFor() resolves a
// persona's bookmark ids against the directory first, then these extras.
export const bookmarkExtras = [
  { id: "front-door", label: "Front door", icon: "door", route: "/home/area/hallway" },
];

// ---- Dashboards (user-created, access-controlled) ----------------------
// A dashboard is the ONLY thing a person builds. Nothing HA ships is a
// dashboard; the built-in home (Home, areas, Lights/Climate/... ) is the app.
// A dashboard is one FIXED shared object carrying independent view + edit
// grants. Each grant token is a ROLE ("everyone" | "maintainers" | "residents")
// or an individual person id. "Shared vs personal" is emergent from the grant,
// never a stored toggle. Cards are demo layout; add/remove/reorder is local.
//   card types: weather | entities (ids[]) | camera (id) | media (id) | actions (kind/id[])
export const dashboardTemplates = [
  { id: "blank", name: "Blank", icon: "view-dashboard-outline", desc: "Start with an empty canvas.", cards: [] },
  { id: "room", name: "Room control", icon: "sofa-outline", desc: "Lights, climate and media for one room.", cards: [
    { type: "entities", title: "Lights", ids: ["living_room_ceiling", "living_room_lamp"] },
    { type: "entities", title: "Climate", ids: ["living_room_thermostat"] },
    { type: "media", id: "living_room_speaker" },
  ] },
  { id: "media", name: "Media", icon: "play-circle-outline", desc: "Now playing and quick scenes.", cards: [
    { type: "media", id: "living_room_speaker" },
    { type: "actions", title: "Scenes", kind: "scenes", ids: ["movie-night", "dinner"] },
  ] },
  { id: "family", name: "Family board", icon: "account-group-outline", desc: "Weather, a camera and shared lights.", cards: [
    { type: "weather" },
    { type: "camera", id: "living_room_cam" },
    { type: "entities", title: "Shared lights", ids: ["living_room_ceiling", "kitchen_ceiling", "hallway_ceiling"] },
  ] },
];

export const dashboards = [
  {
    id: "family-wall", name: "Family wall", icon: "monitor-dashboard",
    viewers: ["everyone"], editors: ["sofie"], createdBy: "sofie",
    created: "12 Mar 2026", modified: "yesterday 21:04", startedFrom: "family",
    cards: [
      { type: "weather" },
      { type: "actions", title: "Quick actions", kind: "scenes", ids: ["good-morning", "movie-night", "away"] },
      { type: "entities", title: "Downstairs lights", ids: ["living_room_ceiling", "kitchen_ceiling", "hallway_ceiling"] },
      { type: "camera", id: "living_room_cam" },
    ],
  },
  {
    id: "movie-night", name: "Movie night", icon: "movie-open-outline",
    viewers: ["daan", "sofie"], editors: ["daan"], createdBy: "daan",
    created: "4 Feb 2026", modified: "last week", startedFrom: "media",
    cards: [
      { type: "media", id: "living_room_speaker" },
      { type: "entities", title: "Living room", ids: ["living_room_ceiling", "living_room_lamp", "living_room_tv_backlight"] },
      { type: "entities", title: "Climate", ids: ["living_room_thermostat"] },
    ],
  },
  {
    id: "daan-home", name: "Daan's dashboard", icon: "view-dashboard",
    viewers: ["daan"], editors: ["daan"], createdBy: "daan",
    created: "18 Jan 2026", modified: "today 7:41", startedFrom: "blank",
    cards: [
      { type: "entities", title: "Bedroom", ids: ["main_bed_lamp", "main_bed_reading", "main_bed_thermostat"] },
      { type: "actions", title: "Routines", kind: "scenes", ids: ["good-morning", "away"] },
      { type: "weather" },
    ],
  },
  {
    id: "sofie-home", name: "Sofie's dashboard", icon: "view-dashboard",
    viewers: ["sofie"], editors: ["sofie"], createdBy: "sofie",
    created: "20 Jan 2026", modified: "today 8:12", startedFrom: "blank",
    cards: [
      { type: "entities", title: "My lights", ids: ["living_room_lamp", "main_bed_lamp", "kitchen_ceiling"] },
      { type: "weather" },
    ],
  },
  {
    id: "lars-stuff", name: "Lars's stuff", icon: "star-outline",
    viewers: ["lars"], editors: ["lars"], createdBy: "lars",
    created: "8 Feb 2026", modified: "2 weeks ago", startedFrom: "blank",
    cards: [
      { type: "entities", title: "My lamp", ids: ["lars_lamp"] },
      { type: "actions", title: "Bedtime", kind: "scripts", ids: ["goodnight"] },
      { type: "weather" },
    ],
  },
  {
    id: "guest", name: "Guest", icon: "account-clock-outline",
    viewers: ["nour"], editors: ["daan"], createdBy: "daan",
    created: "1 Jul 2026", modified: "today 7:20", startedFrom: "blank",
    cards: [
      { type: "entities", title: "Ground floor", ids: ["hallway_ceiling", "kitchen_ceiling"] },
      { type: "entities", title: "Front door", ids: ["front_door"] },
      { type: "camera", id: "living_room_cam" },
    ],
  },
];

// ---- World map (person + zone locations, for the /map page) ------------
// Home sits in Utrecht (matching the Home information map). People are placed
// at home (clustered with small offsets so pins stay legible) or at the zone
// they are currently in. Presence comes from `people` above.
export const mapData = {
  center: { lat: 52.0825, lon: 5.1437 },
  zoom: 14,
  zones: [
    { id: "zone-home", name: "Abbey Road", kind: "zone", icon: "home-variant", color: "#2e9e5b", lat: 52.08445, lon: 5.14354, radius: 55 },
    { id: "zone-school", name: "School", kind: "zone", icon: "school", color: "#e0a32e", lat: 52.0982, lon: 5.1402, radius: 90 },
    { id: "zone-work", name: "Daan's office", kind: "zone", icon: "briefcase-variant", color: "#2aa6b3", lat: 52.0836, lon: 5.1486, radius: 90 },
    { id: "zone-sofie-work", name: "Sofie's work", kind: "zone", icon: "briefcase-variant", color: "#a855f7", lat: 52.3146, lon: 4.9533, radius: 90 },
    { id: "zone-park", name: "Wilhelminapark", kind: "zone", icon: "tree", color: "#1f6e42", lat: 52.08806, lon: 5.14028, polygon: [
      [52.09084, 5.14119], [52.09053, 5.14141], [52.08934, 5.14205], [52.08844, 5.14234],
      [52.08758, 5.14238], [52.08690, 5.14220], [52.08635, 5.14175], [52.08583, 5.14085],
      [52.08552, 5.13975], [52.08575, 5.13943], [52.08595, 5.13904], [52.08630, 5.13884],
      [52.08664, 5.13901], [52.08719, 5.13898], [52.08788, 5.13866], [52.08827, 5.13869],
      [52.08848, 5.13890], [52.08871, 5.13959], [52.08924, 5.14008], [52.08994, 5.14025],
      [52.09062, 5.14077],
    ] },
    { id: "zone-cartesius", name: "Hof van Cartesius", kind: "zone", icon: "sprout", color: "#d6492f", lat: 52.10102, lon: 5.09338, polygon: [
      [52.10526, 5.08585], [52.10556, 5.08835], [52.10416, 5.08905], [52.10286, 5.08825],
      [52.10276, 5.08615], [52.10386, 5.08515],
    ] },
  ],
  people: [
    { id: "daan", name: "Daan", initials: "Da", avatar: "ds/assets/daan.png", presence: "away", at: "Utrecht city center", updated: "2 min ago", zone: null, lat: 52.09083, lon: 5.12142, visibility: "everyone" },
    { id: "sofie", name: "Sofie", initials: "So", avatar: "ds/assets/sofie.png", presence: "away", at: "Sofie's work", updated: "6 min ago", zone: "zone-sofie-work", lat: 52.31460, lon: 4.95330, visibility: "everyone" },
    { id: "lars", name: "Lars", initials: "La", avatar: "ds/assets/lars.png", presence: "home", at: "Abbey Road", updated: "11 min ago", zone: "zone-home", lat: 52.08456, lon: 5.14374, visibility: "everyone" },
    { id: "greet", name: "Elizabeth", initials: "El", presence: "home", at: "Abbey Road", updated: "3 min ago", zone: "zone-home", lat: 52.08435, lon: 5.14336, visibility: "everyone" },
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

// ---- Structure: property / buildings / floors / outdoor -----------------
// Backward-compatibility migration. Older data had bare floors (one of them a
// pseudo "outside" floor) and no buildings. normalizeStructure() upgrades any
// such object in place: it folds every real floor into a default building,
// derives `order` from array position, marks the first floor of each building
// as the ground floor when none is set, and lifts a legacy "outside" floor's
// areas into `outdoorAreas` (tagging those areas `outdoor: true`). Running it on
// already-migrated data is a no-op.
export function normalizeStructure(hh) {
  if (!hh || !Array.isArray(hh.floors)) return hh;
  if (!hh.property) hh.property = { id: "property", name: hh.name || "Home", icon: "home-city-outline" };
  if (!Array.isArray(hh.outdoorAreas)) hh.outdoorAreas = [];

  // Lift a legacy "outside" floor (or any floor flagged outdoor) into outdoorAreas.
  hh.floors = hh.floors.filter((f) => {
    if (f.id === "outside" || f.outdoor) {
      (f.areas || []).forEach((aid) => {
        if (hh.outdoorAreas.indexOf(aid) < 0) hh.outdoorAreas.push(aid);
        const a = hh.areas[aid];
        if (a) { a.outdoor = true; delete a.floor; }
      });
      return false;
    }
    return true;
  });
  hh.outdoorAreas.forEach((aid) => { const a = hh.areas[aid]; if (a) { a.outdoor = true; delete a.floor; } });

  // Ensure a building set. If none, drop every remaining floor into one default.
  if (!Array.isArray(hh.buildings) || !hh.buildings.length) {
    hh.buildings = [{ id: "main-building", name: "Main building", icon: "home-outline", floors: hh.floors.map((f) => f.id) }];
  }

  // Per-building: attach building id + order; guarantee one ground floor.
  hh.buildings.forEach((b) => {
    const fs = b.floors.map((id) => hh.floors.find((f) => f.id === id)).filter(Boolean);
    fs.forEach((f, i) => { f.building = b.id; if (typeof f.order !== "number") f.order = i; });
    if (!fs.some((f) => f.isGround) && fs.length) {
      // Lowest-ordered floor becomes ground by default.
      fs.slice().sort((a, c) => a.order - c.order)[0].isGround = true;
    }
  });
  return hh;
}
normalizeStructure(household);

// Floors of a building, in stacking order (lowest first).
export function floorsOfBuilding(buildingId) {
  return household.floors.filter((f) => f.building === buildingId).sort((a, b) => a.order - b.order);
}
// The ground floor of a building (where it meets the ground plane), or null.
export function groundFloorOf(buildingId) {
  return household.floors.find((f) => f.building === buildingId && f.isGround) || null;
}
// Outdoor area objects on the property.
export function outdoorAreaList() {
  return (household.outdoorAreas || []).map((id) => household.areas[id]).filter(Boolean);
}

// Buildings a persona can see (those with at least one visible floor).
export function visibleBuildings(persona) {
  const fids = new Set(visibleFloors(persona).map((f) => f.id));
  return household.buildings.filter((b) => b.floors.some((id) => fids.has(id)));
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
  // Outdoor areas have no floor; reach them only by an explicit area scope.
  if (area.outdoor) return persona.scoped.includes(areaId);
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

// ---- Dashboard access -------------------------------------------------
// A grant token matches a persona if it is a role the persona has, or the
// persona's own id. "everyone" means every household member (maintainers +
// residents), NOT scoped non-residents (guests) unless named explicitly.
const DASH_ROLES = ["everyone", "maintainers", "residents"];
export function grantMatches(grant, persona) {
  if (!persona) return false;
  if (grant === "everyone") return persona.role === "maintainer" || persona.role === "resident";
  if (grant === "maintainers") return persona.role === "maintainer";
  if (grant === "residents") return persona.role === "resident";
  return grant === persona.id;
}
export function canEditDashboard(persona, d) {
  if (typeof d === "string") d = dashboards.find((x) => x.id === d);
  return !!d && (d.editors || []).some((g) => grantMatches(g, persona));
}
export function canViewDashboard(persona, d) {
  if (typeof d === "string") d = dashboards.find((x) => x.id === d);
  if (!d) return false;
  return (d.viewers || []).some((g) => grantMatches(g, persona)) || canEditDashboard(persona, d);
}
// Every dashboard this persona can see, in stored order.
export function dashboardsFor(persona) {
  return dashboards.filter((d) => canViewDashboard(persona, d));
}
// Emergent space FOR A GIVEN VIEWER: personal only when this dashboard is
// private to exactly this person (no role grant, no other named viewer);
// otherwise it reads as shared. So Sofie's own dashboard is personal to her,
// but "Lars's stuff" is shared from the maintainer's editing perspective.
export function dashboardSpaceFor(d, persona) {
  const v = d.viewers || [];
  if (v.some((g) => DASH_ROLES.includes(g))) return "shared";
  const persons = v.filter((g) => !DASH_ROLES.includes(g));
  return persons.length === 1 && persons[0] === persona.id ? "personal" : "shared";
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
// ---- AI tasks (Settings -> AI tasks) ---------------------------------------
// HA's AI Tasks registry. Two task types: data generation and image generation.
// The resident "Draft with AI" button on the suggest flow gates on a configured,
// enabled data-generation task (the "draft-routine" one below). Toggle it off in
// Settings -> AI tasks to see the honest fallback.
export const aiTasks = {
  provider: "Assist with AI (Home Assistant Cloud)",
  dataGeneration: [
    { id: "suggest-names", name: "Suggest automation names", desc: "Proposes clear names for new automations.", enabled: true, stock: true },
    { id: "draft-routine", name: "Draft a zone or automation", desc: "Turns a plain-language idea into a draft you can review, tweak, and suggest.", enabled: true },
  ],
  imageGeneration: [
    { id: "gen-images", name: "Generate images", desc: "Creates images for dashboards and notifications.", enabled: true, stock: true },
  ],
};

// ---- Suggestions (resident -> maintainer review) ---------------------------
// Zones and automations are always shared, so a resident's creation arrives as a
// suggestion a maintainer approves, edits, or declines. Pending items drive the
// inline pending state + the Explore open-loop tray; resolved items seed the
// Explore archive. Runtime edits are layered in localStorage by the component.
export const suggestions = [
  {
    id: "sg-football", kind: "zone", title: "Tess's football club",
    body: "Can we add a zone at the sports park? Then the home knows when Tess is at football practice, so I stop texting her to check she got there.",
    status: "pending", suggestedBy: "sofie", suggestedAt: "today 9:12",
    draft: { name: "Football club", icon: "soccer", color: "#2e9e5b", lat: 52.0781, lon: 5.1215, radius: 90 },
  },
  {
    id: "sg-porch", kind: "automation", title: "Porch light at dusk",
    body: "Turn the porch light on at sunset and off again at midnight.",
    status: "pending", suggestedBy: "tess", suggestedAt: "yesterday 20:40",
    draft: { name: "Porch light at dusk", description: "Turns the porch light on at sunset and off at midnight.", space: "shared" },
  },
  {
    id: "sg-laundry", kind: "automation", title: "Tell me when the laundry is done",
    body: "Notify whoever started a wash when the machine finishes.",
    status: "approved", suggestedBy: "sofie", suggestedAt: "3 days ago",
    resolvedBy: "daan", resolvedAt: "2 days ago", edited: false,
    newId: "laundry-done",
  },
  {
    id: "sg-wakeup", kind: "automation", title: "Gentle wake-up light",
    body: "Fade the bedroom light up over ten minutes before the alarm.",
    status: "declined", suggestedBy: "tess", suggestedAt: "last week",
    resolvedBy: "daan", resolvedAt: "last week",
    reviewNote: "The wake-up script already does this. Added you as an editor there instead.",
  },
];

// ---- Explore (Discovery canvas) --------------------------------------------
// Evergreen possibility + guidance (the opposite of the live For-you stack):
// a getting-started checklist and capabilities-by-outcome. The open-loop tray
// and archive are derived at runtime from suggestions + updates + checklist.
export const explore = {
  checklist: [
    { id: "ck-people", label: "Add everyone who lives here", done: true },
    { id: "ck-areas", label: "Set up your floors and areas", done: true },
    { id: "ck-devices", label: "Connect your lights, sensors, and other devices", done: false, doc: "Devices and services" },
    { id: "ck-presence", label: "Turn on presence so the home knows who is in", done: true },
    { id: "ck-first-automation", label: "Create your first automation", done: true },
    { id: "ck-remote", label: "Reach your home securely when you are away", done: false, doc: "Remote access" },
    { id: "ck-backup", label: "Set up an automatic backup", done: false, doc: "Back up your home" },
    { id: "ck-voice", label: "Try talking to the home", done: false, doc: "Assist and voice" },
  ],
  capabilities: [
    { id: "cap-energy", outcome: "Save energy", icon: "leaf", tint: "#2e9e5b",
      recipes: [
        { id: "r-eco-away", name: "Drop the heating when everyone leaves", desc: "Set the thermostat to eco once the home is empty.", kind: "automation" },
        { id: "r-standby", name: "Cut standby power overnight", desc: "Switch off the media wall between 1:00 and 6:00.", kind: "automation" },
      ] },
    { id: "cap-safe", outcome: "Feel safe when away", icon: "shield-home", tint: "#1C6FD6",
      recipes: [
        { id: "r-lock-away", name: "Lock up when the last person leaves", desc: "Lock the doors and arm the home automatically.", kind: "automation" },
        { id: "r-arrive-zone", name: "Know when the kids reach a place", desc: "Add a zone (like school or a club) and get told on arrival.", kind: "zone" },
      ] },
    { id: "cap-wake", outcome: "Wake up gently", icon: "weather-sunset-up", tint: "#e0a32e",
      recipes: [
        { id: "r-sunrise", name: "Fade the bedroom light up before your alarm", desc: "A ten-minute sunrise on weekday mornings.", kind: "automation" },
        { id: "r-coffee", name: "Start the coffee when you get up", desc: "Kick off the morning when the bedroom motion clears.", kind: "automation" },
      ] },
  ],
};

if (typeof window !== "undefined") {
  window.__HH_MOD = {
    household, directory, bookmarkExtras, extensionCategories, mapData, entityRegistry, integrations,
    getPersona, entitiesIn, areaList, visibleFloors, canAccessArea, directoryFor, bookmarksFor, energyFor,
    normalizeStructure, floorsOfBuilding, groundFloorOf, outdoorAreaList, visibleBuildings,
    dashboards, dashboardTemplates, grantMatches, canEditDashboard, canViewDashboard, dashboardsFor, dashboardSpaceFor,
    aiTasks, suggestions, explore,
  };
}
