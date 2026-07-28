// map-data.js — demo data for the vector map prototype.
// Trimmed from the whole-household prototype: only the personas, people and
// world-map data (zones + person locations) the map reads.

export const household = {
  name: "Abbey Road",

  // ---- Personas (demo scaffolding) -------------------------------------
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

  // ---- People ----------------------------------------------------------
  people: [
    { id: "daan", name: "Daan", role: "Maintainer", presence: "home", initials: "Da", avatar: "ds/assets/daan.png" },
    { id: "sofie", name: "Sofie", role: "Resident", presence: "home", initials: "So", avatar: "ds/assets/sofie.png" },
    { id: "tess", name: "Tess", role: "Resident", presence: "away", initials: "Te", avatar: "ds/assets/tess.png" },
    { id: "lars", name: "Lars", role: "Resident", presence: "home", initials: "La", avatar: "ds/assets/lars.png" },
    { id: "greet", name: "Elizabeth", role: "Resident", presence: "home", initials: "El" },
    { id: "nour", name: "Nour", role: "Non-resident", presence: "away", initials: "No", scoped: true },
  ],
};

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

export function getPersona(id) {
  return household.personas[id] || household.personas.daan;
}

// Expose on window so a single-file bundle can read the data without a dynamic
// relative import.
if (typeof window !== "undefined") {
  window.__HH_MOD = { household, mapData, getPersona };
}
