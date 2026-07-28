/* Home Assistant for the whole household — MapLibre vector map theming.

   Rather than hand-authoring an OpenMapTiles layer stack (a single mis-typed
   layer can abort tile parsing at high zoom and blank the map), we build on
   OpenFreeMap's battle-tested hosted "bright" style and RECOLOR it to a
   purpose-built light or dark palette. The layer structure / filters / zoom
   curves are OpenFreeMap's proven ones; only colors change, so it renders
   crisply at every zoom in both modes. This is NOT a CSS filter inversion. */
(function () {
  if (window.HA_MAP_BASE) return;

  // Proven-working hosted base (OpenMapTiles schema, OpenFreeMap tiles).
  window.HA_MAP_BASE = "https://tiles.openfreemap.org/styles/bright";

  var P = {
    light: {
      land:        "#f3ece0", // warm cream
      water:       "#bcd9e8", // light blue
      waterway:    "#aacfe2",
      park:        "#cfe1bf", // muted green
      sand:        "#ece2c8",
      residential: "#ece4d6",
      building:    "#e7ddca",
      buildingTop: "#ded2bc",
      motorway:    "#efd2a0",
      primary:     "#f2e9d6",
      minor:       "#efe7d8",
      minorCs:     "#e2d8c5",
      rail:        "#d8cdba",
      boundary:    "#cbb79c",
      label:       "#4a463d",
      labelMinor:  "#8d8676",
      labelHalo:   "#f6f0e6",
      water_label: "#5b86a3",
      roadLabel:   "#6f6856"
    },
    dark: {
      land:        "#191b2c", // deep navy / dark purple
      water:       "#27357A", // deep blue
      waterway:    "#2f3f8c",
      park:        "#1f3e3a", // muted teal
      sand:        "#2a2c3d",
      residential: "#1d2034",
      building:    "#21243c",
      buildingTop: "#2a2e4a",
      motorway:    "#454d7d",
      primary:     "#3a4068",
      minor:       "#2b3052",
      minorCs:     "#343a63",
      rail:        "#2c3150",
      boundary:    "#3b4068",
      label:       "#e7ecf8",
      labelMinor:  "#959dbd",
      labelHalo:   "#12141f",
      water_label: "#9cc0f0",
      roadLabel:   "#aab2d4"
    }
  };

  function pal(mode) { return P[mode === "light" ? "light" : "dark"]; }
  window.HA_MAP_PALETTE = pal;

  // Recolor every layer of a loaded base style to the chosen palette.
  // Color-only overrides can never abort tile parsing, so the map always renders.
  window.HA_MAP_RECOLOR = function (map, mode) {
    var c = pal(mode);
    var layers;
    try { layers = map.getStyle().layers || []; } catch (e) { return; }
    layers.forEach(function (L) {
      var id = (L.id || "").toLowerCase();
      var type = L.type;
      try {
        if (type === "background") { map.setPaintProperty(L.id, "background-color", c.land); return; }

        if (type === "fill") {
          var fc;
          if (/water/.test(id)) fc = c.water;
          else if (/building/.test(id)) fc = c.building;
          else if (/(wood|forest|park|grass|wetland|golf|pitch|cemeter|garden|scrub|green|nature|meadow|farm|orchard|vineyard|recreation)/.test(id)) fc = c.park;
          else if (/(sand|beach|bare|rock|glacier|ice)/.test(id)) fc = c.sand;
          else fc = c.residential; // landuse / generic
          map.setPaintProperty(L.id, "fill-color", fc);
          if (L.paint && "fill-outline-color" in L.paint) map.setPaintProperty(L.id, "fill-outline-color", c.buildingTop);
          return;
        }
        if (type === "fill-extrusion") { map.setPaintProperty(L.id, "fill-extrusion-color", c.building); return; }

        if (type === "line") {
          var lc;
          if (/(waterway|water|river|canal|stream)/.test(id)) lc = c.waterway;
          else if (/(boundary|admin|border)/.test(id)) lc = c.boundary;
          else if (/building/.test(id)) lc = c.buildingTop;
          else if (/(rail|transit|aeroway|runway)/.test(id)) lc = c.rail;
          else if (/(motorway|trunk)/.test(id)) lc = c.motorway;
          else if (/(primary|secondary|tertiary|main|bridge)/.test(id)) lc = c.primary;
          else if (/(casing|outline)/.test(id)) lc = c.minorCs;
          else lc = c.minor; // minor / service / street / path / other
          map.setPaintProperty(L.id, "line-color", lc);
          return;
        }

        if (type === "symbol") {
          // Highway shields are light sprite icons that can't be recolored and
          // clash with the dark theme: hide them. The road name labels remain.
          if (/shield/i.test(id)) { map.setLayoutProperty(L.id, "visibility", "none"); return; }
          var tc;
          if (/water/.test(id)) tc = c.water_label;
          else if (/(road|street|highway|motorway|transport|ref|shield)/.test(id)) tc = c.roadLabel;
          else if (/(poi|housenumber|continent|state|province)/.test(id)) tc = c.labelMinor;
          else tc = c.label;
          // text layers carry text-color; icon-only layers ignore it harmlessly
          map.setPaintProperty(L.id, "text-color", tc);
          map.setPaintProperty(L.id, "text-halo-color", c.labelHalo);
          map.setPaintProperty(L.id, "text-halo-width", 1.3);
          return;
        }
      } catch (e) { /* skip any layer that rejects an override */ }
    });
    // Force a repaint so the recolored background (and any already-parsed layers)
    // paint immediately. Without this, MapLibre keeps showing its stale first
    // frame, the light "bright" base, until tiles stream in, which reads as a
    // cream flash before the dark theme appears.
    try { map.triggerRepaint(); } catch (e) {}
  };

  // Hide POI clutter. This is a presence map, not a places map: the little
  // category icons (transit/OV, parking, fuel & EV charging, sport, cafes,
  // florists, shops, ...) are all noise here, so every POI symbol layer is
  // hidden. Roads, water, parks, place names and street labels stay.
  window.HA_MAP_HIDE_POI = function (map) {
    var layers;
    try { layers = map.getStyle().layers || []; } catch (e) { return; }
    layers.forEach(function (L) {
      if (L.type !== "symbol" || L["source-layer"] !== "poi") return;
      try { map.setLayoutProperty(L.id, "visibility", "none"); } catch (e) {}
    });
  };
})();
