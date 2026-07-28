/* Home Assistant for the whole household — vector map custom elements (MapLibre GL + OpenFreeMap).
   <ha-carto-map>  static, non-interactive preview with a single marker.
   <ha-world-map>  interactive people/zones map with clustering and focus.
   Both switch between purpose-built light/dark vector styles (window.HA_MAP_STYLE)
   via a `theme` attribute — no CSS invert/hue-rotate filter. */
(function () {
  "use strict";

  // ---- shared helpers ----------------------------------------------------
  function circleGeoJSON(lat, lon, radiusM) {
    var pts = [], n = 64, R = 6378137;
    var latR = lat * Math.PI / 180;
    for (var i = 0; i <= n; i++) {
      var a = (i / n) * 2 * Math.PI;
      var dx = radiusM * Math.cos(a), dy = radiusM * Math.sin(a);
      var dLon = (dx / (R * Math.cos(latR))) * 180 / Math.PI;
      var dLat = (dy / R) * 180 / Math.PI;
      pts.push([lon + dLon, lat + dLat]);
    }
    return { type: "Feature", geometry: { type: "Polygon", coordinates: [pts] } };
  }
  var DEG = Math.PI / 180, EARTH = 6378137;
  function metersBetween(aLat, aLon, bLat, bLon) {
    var dLat = (bLat - aLat) * DEG, dLon = (bLon - aLon) * DEG;
    var x = dLon * Math.cos(((aLat + bLat) / 2) * DEG), y = dLat;
    return Math.sqrt(x * x + y * y) * EARTH;
  }
  function destPoint(lat, lon, distM, bearingRad) {
    var dLat = (distM * Math.cos(bearingRad)) / EARTH / DEG;
    var dLon = (distM * Math.sin(bearingRad)) / (EARTH * Math.cos(lat * DEG)) / DEG;
    return [lat + dLat, lon + dLon];
  }
  function polyCentroidLatLon(poly) {
    var la = 0, lo = 0; poly.forEach(function (p) { la += p[0]; lo += p[1]; });
    return [la / poly.length, lo / poly.length];
  }
  function circleToPoly(lat, lon, radius, n) {
    var out = []; for (var i = 0; i < n; i++) { out.push(destPoint(lat, lon, radius, (i / n) * 2 * Math.PI)); } return out;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function personHtml(p) {
    var inner = p.avatar
      ? '<img src="' + esc(p.avatar) + '" alt="" />'
      : '<span>' + esc((p.initials || (p.name || "?").slice(0, 2)).toUpperCase()) + '</span>';
    return '<div class="cc-pin__av"' + (p.ghost ? ' style="opacity:0.45"' : '') + '>' + inner + '</div>';
  }
  function fgFor(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return "#fff";
    var n = parseInt(m[1], 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.62 ? "#1a1a1a" : "#ffffff";
  }
  function zoneHtml(z) {
    var col = z.color || "#1C6FD6";
    if (z.ghost) {
      // Suggested-but-not-approved zone: dashed, translucent, muted fill so it
      // reads as provisional against the live zones.
      var ico = z.icon ? '<span class="mdi mdi-' + esc(z.icon) + ' cc-zone__ico"></span>' : esc(z.name);
      return '<span class="cc-zone__label cc-zone__label--ghost' + (z.icon ? ' cc-zone__label--icon' : '') + '" title="' + esc(z.name) + '" style="background:transparent;color:' + col + ';border:1.5px dashed ' + col + '">' + ico + '</span>';
    }
    if (z.icon) return '<span class="cc-zone__label cc-zone__label--icon" title="' + esc(z.name) + '" style="background:' + col + ';color:' + fgFor(col) + ';border-color:rgba(0,0,0,0.28)"><span class="mdi mdi-' + esc(z.icon) + ' cc-zone__ico"></span></span>';
    return '<span class="cc-zone__label" style="background:' + col + ';color:' + fgFor(col) + ';border-color:rgba(0,0,0,0.28)">' + esc(z.name) + '</span>';
  }
  function clusterHtml(members) {
    var shown = members.slice(0, 2);
    var overflow = members.length - shown.length;
    var avs = shown.map(function (p) {
      var inner = p.avatar
        ? '<img src="' + esc(p.avatar) + '" alt="" />'
        : '<span>' + esc((p.initials || (p.name || "?").slice(0, 2)).toUpperCase()) + '</span>';
      return '<button type="button" class="cc-cl__av" data-person="' + esc(p.id) + '" title="' + esc(p.name) + '"' + (p.ghost ? ' style="opacity:0.45"' : '') + '>' + inner + '</button>';
    }).join("");
    var over = overflow > 0 ? '<span class="cc-cl__more">+' + overflow + '</span>' : "";
    return '<div class="cc-cluster__wrap"><div class="cc-cluster__pill">' + avs + over + '</div><div class="cc-cluster__tail"></div></div>';
  }

  // ---- static preview ----------------------------------------------------
  if (!(window.customElements && customElements.get("ha-carto-map"))) {
    class HaCartoMap extends HTMLElement {
      static get observedAttributes() { return ["theme"]; }
      connectedCallback() {
        if (this._booted) return;
        this._booted = true;
        var self = this;
        var lat = parseFloat(this.getAttribute("lat"));
        var lon = parseFloat(this.getAttribute("lon"));
        var zoom = parseInt(this.getAttribute("zoom"), 10) || 15;
        (function boot() {
          if (!window.maplibregl || !window.HA_MAP_BASE) { setTimeout(boot, 60); return; }
          if (!self.isConnected) { self._booted = false; return; }
          self._theme = self.getAttribute("theme") || "dark";
          var map = new maplibregl.Map({
            container: self, style: window.HA_MAP_BASE,
            center: [lon, lat], zoom: zoom, interactive: false, attributionControl: false
          });
          self._map = map;
          map.on("style.load", function () { window.HA_MAP_RECOLOR(map, self._theme); window.HA_MAP_HIDE_POI(map); });
          var el = document.createElement("div");
          var mIcon = self.getAttribute("marker-icon");
          if (mIcon) {
            el.className = "cc-zone";
            el.innerHTML = zoneHtml({ icon: mIcon, color: self.getAttribute("marker-color") || "#1C6FD6", name: self.getAttribute("marker-label") || "" });
          } else {
            el.className = "cc-dot";
          }
          new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([lon, lat]).addTo(map);
          setTimeout(function () { map.resize(); }, 80);
        })();
      }
      attributeChangedCallback(name, o, n) {
        if (name === "theme" && this._map && n && n !== this._theme) { this._theme = n; window.HA_MAP_RECOLOR(this._map, n); }
      }
      disconnectedCallback() { if (this._map) { this._map.remove(); this._map = null; } this._booted = false; }
    }
    customElements.define("ha-carto-map", HaCartoMap);
  }

  // ---- interactive world map --------------------------------------------
  if (!(window.customElements && customElements.get("ha-world-map"))) {
    class HaWorldMap extends HTMLElement {
      static get observedAttributes() { return ["focus-id", "show-zones", "focus-pad-bottom", "theme", "markers", "edit-zone"]; }
      connectedCallback() {
        if (this._booted) return;
        this._booted = true;
        var self = this;
        (function boot() {
          if (!window.maplibregl || !window.HA_MAP_BASE) { setTimeout(boot, 60); return; }
          if (!self.isConnected) { self._booted = false; return; }
          self._init();
        })();
      }
      _data() { try { return JSON.parse(this.getAttribute("markers") || "{}"); } catch (e) { return {}; } }
      _isMobile() { return (this.clientWidth || (this._map && this._map.getContainer().offsetWidth) || 0) < 768; }
      _init() {
        var self = this;
        var data = this._data();
        var c = data.center || { lat: 52.0907, lon: 5.1214 };
        this._theme = this.getAttribute("theme") || "dark";
        var stat = this.hasAttribute("static");
        this._static = stat;
        var map = new maplibregl.Map({
          container: this, style: window.HA_MAP_BASE,
          center: [c.lon, c.lat], zoom: data.zoom || 14, attributionControl: false,
          dragRotate: false, pitchWithRotate: false, interactive: !stat
        });
        if (map.touchZoomRotate) map.touchZoomRotate.disableRotation();
        this._map = map;
        this._markers = {};
        this._activeId = null;
        this._zoneIds = [];
        if (!stat) map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: true }), "bottom-right");
        map.on("style.load", function () { window.HA_MAP_RECOLOR(map, self._theme); window.HA_MAP_HIDE_POI(map); self._ready(); });
        map.on("load", function () { self._ready(); });
        map.on("zoomend", function () { self._addPeople(); });
        if (window.ResizeObserver) { this._ro = new ResizeObserver(function () { if (self._map) self._map.resize(); }); this._ro.observe(this); }
      }
      _ready() {
        if (this._loaded || !this._map) return;
        this._loaded = true;
        var self = this;
        this._addZoneLabels();
        this._addZones();
        this._applyZoneVis();
        this._addPeople();
        this._fitAll(false);
        var f = this.getAttribute("focus-id");
        if (f) setTimeout(function () { self._focus(f); }, 120);
        else setTimeout(function () { if (self._map && !self._focusId && !self._activeId) { self._addPeople(); self._fitAll(false); self._loadView = { center: self._map.getCenter(), zoom: self._map.getZoom() }; } }, 360);
        if (this._pendingEdit) { var pe = this._pendingEdit; this._pendingEdit = null; this._startZoneEdit(pe); }
      }
      // zone label markers are HTML (persist across setStyle) — create once
      _addZoneLabels() {
        var map = this._map; var self = this;
        this._zoneLabelMarkers = this._zoneLabelMarkers || [];
        (this._data().zones || []).forEach(function (z) {
          var anchor = (z.polygon && z.polygon.length) ? (function () { var c = polyCentroidLatLon(z.polygon); return [c[1], c[0]]; })() : [z.lon, z.lat];
          var el = document.createElement("div");
          el.className = "cc-zone"; el.innerHTML = zoneHtml(z);
          var m = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(anchor).addTo(map);
          self._markers[z.id] = { marker: m, lnglat: anchor };
          self._zoneLabelMarkers.push(m);
          el.addEventListener("click", function () { self.dispatchEvent(new CustomEvent("marker-select", { detail: { id: z.id } })); });
        });
      }
      // Live update zone geometry + label styling when the markers attribute
      // changes (a zone is moved, resized, recolored, or reshaped in the editor).
      _refreshZones() {
        if (!this._map || !this._loaded) return;
        var map = this._map;
        (this._data().zones || []).forEach(function (z, i) {
          var src = "zone-" + i; if (!map.getSource(src)) return;
          var feat;
          if (z.polygon && z.polygon.length) {
            var ring = z.polygon.map(function (pt) { return [pt[1], pt[0]]; });
            var a = ring[0], b = ring[ring.length - 1];
            if (a[0] !== b[0] || a[1] !== b[1]) ring.push([a[0], a[1]]);
            feat = { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] } };
          } else { feat = circleGeoJSON(z.lat, z.lon, z.radius || 100); }
          map.getSource(src).setData(feat);
          var col = z.color || "#1C6FD6";
          if (map.getLayer(src + "-fill")) map.setPaintProperty(src + "-fill", "fill-color", col);
          if (map.getLayer(src + "-line")) map.setPaintProperty(src + "-line", "line-color", col);
        });
        (this._zoneLabelMarkers || []).forEach(function (m) { m.remove(); });
        this._zoneLabelMarkers = [];
        this._addZoneLabels();
        this._reapplyEditHidden();
      }
      // Zone styling, tuned per theme. Dark needs a stronger fill + brighter,
      // thicker outline to read against the deep navy base and green parks.
      _zoneVals(active) {
        var dark = this._theme !== "light";
        return {
          fill: active ? (dark ? 0.32 : 0.20) : (dark ? 0.20 : 0.10),
          width: active ? (dark ? 5 : 4) : (dark ? 3.5 : 3),
          lineOp: dark ? 1 : 0.85
        };
      }
      _applyZoneTheme() {
        if (!this._map || !this._zoneIds) return;
        var self = this; var map = this._map;
        this._zoneIds.forEach(function (z) {
          var v = self._zoneVals(self._activeId === z.id);
          if (map.getLayer(z.fill)) map.setPaintProperty(z.fill, "fill-opacity", v.fill);
          if (map.getLayer(z.line)) { map.setPaintProperty(z.line, "line-width", v.width); map.setPaintProperty(z.line, "line-opacity", v.lineOp); }
        });
      }
      // GeoJSON fill + outline layers; dropped by setStyle, so (re)created on load and after a theme switch
      _addZones() {
        var map = this._map; var self = this;
        this._zoneIds = [];
        var rest = this._zoneVals(false);
        (this._data().zones || []).forEach(function (z, i) {
          var col = z.color || "#1C6FD6";
          var src = "zone-" + i;
          var feat;
          if (z.polygon && z.polygon.length) {
            var ring = z.polygon.map(function (pt) { return [pt[1], pt[0]]; });
            // Close the ring so the outline (line layer) doesn't show an open gap.
            var a = ring[0], b = ring[ring.length - 1];
            if (a[0] !== b[0] || a[1] !== b[1]) ring.push([a[0], a[1]]);
            feat = { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] } };
          } else {
            feat = circleGeoJSON(z.lat, z.lon, z.radius || 100);
          }
          if (map.getSource(src)) { map.getSource(src).setData(feat); }
          else { map.addSource(src, { type: "geojson", data: feat }); }
          if (!map.getLayer(src + "-fill")) {
            map.addLayer({ id: src + "-fill", type: "fill", source: src, paint: { "fill-color": col, "fill-opacity": z.ghost ? rest.fill * 0.5 : rest.fill } });
          }
          if (!map.getLayer(src + "-line")) {
            var linePaint = { "line-color": col, "line-width": rest.width, "line-opacity": rest.lineOp };
            if (z.ghost) linePaint["line-dasharray"] = [2, 2];
            map.addLayer({ id: src + "-line", type: "line", source: src, layout: { "line-join": "round" }, paint: linePaint });
          }
          self._zoneIds.push({ id: z.id, fill: src + "-fill", line: src + "-line" });
        });
      }
      _fitAll(animate) {
        var pts = (this._data().people || []).map(function (p) { return [p.lon, p.lat]; });
        if (!pts.length) return;
        var b = new maplibregl.LngLatBounds(pts[0], pts[0]);
        pts.forEach(function (p) { b.extend(p); });
        var ht = this.clientHeight || 600;
        // Marker pills/pins extend well above their geo point (cluster pill floats
        // ~70px up), so top needs generous padding or the topmost marker clips.
        // On mobile the bottom sheet (detent 0.4) covers ~40% — keep points above it.
        var pad = this._static
          ? { top: 36, left: 36, right: 36, bottom: 36 }
          : this._isMobile()
          ? { top: 84, left: 44, right: 44, bottom: Math.min(Math.round(ht * 0.40), Math.max(ht - 220, 160)) }
          : { top: 110, left: 80, right: 440, bottom: 90 };
        try { this._map.fitBounds(b, { padding: pad, maxZoom: 16, duration: animate ? 600 : 0 }); } catch (e) {}
      }
      _addPeople() {
        var self = this; var map = this._map;
        if (!map) return;
        var people = (this._data().people || []);
        (this._peopleLayers || []).forEach(function (m) { m.remove(); });
        this._peopleLayers = [];
        // When a person is focused, render them AND everyone sharing their zone
        // individually (never grouped); only the rest get clustered.
        var focused = people.find(function (p) { return p.id === self._focusId; });
        var sharedZone = focused ? focused.zone : null;
        var solo = people.filter(function (p) { return self._focusId && (p.id === self._focusId || (sharedZone != null && p.zone === sharedZone)); });
        var soloMap = {}; solo.forEach(function (p) { soloMap[p.id] = true; });
        var pts = people.filter(function (p) { return !soloMap[p.id]; }).map(function (p) { return { p: p, pt: map.project([p.lon, p.lat]) }; });
        function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
        var used = [], groups = [], THRESH = 46;
        for (var i = 0; i < pts.length; i++) {
          if (used[i]) continue;
          var g = [pts[i]]; used[i] = true;
          for (var j = i + 1; j < pts.length; j++) {
            if (used[j]) continue;
            if (dist(pts[i].pt, pts[j].pt) < THRESH) { g.push(pts[j]); used[j] = true; }
          }
          groups.push(g);
        }
        // Zone label anchor points, so a lone person on top of a zone icon is
        // promoted to a cluster pill (floats above) and the icon stays visible.
        var zonePts = (this._data().zones || []).map(function (z) { return map.project([z.lon, z.lat]); });
        var ZTHRESH = 34;
        function overlapsZone(grp) {
          return grp.some(function (x) { return zonePts.some(function (zp) { return dist(x.pt, zp) < ZTHRESH; }); });
        }
        groups.forEach(function (g) {
          if (g.length === 1 && !overlapsZone(g)) {
            var p = g[0].p;
            var mk = self._mk("cc-pin", personHtml(p), [p.lon, p.lat], 1000);
            self._peopleLayers.push(mk);
            self._bind(p.id, mk, [p.lon, p.lat]);
            return;
          }
          var clat = 0, clon = 0; g.forEach(function (x) { clat += x.p.lat; clon += x.p.lon; });
          clat /= g.length; clon /= g.length;
          var members = g.map(function (x) { return x.p; });
          var cm = self._mk("cc-cluster", clusterHtml(members), [clon, clat], 1200);
          self._peopleLayers.push(cm);
          members.forEach(function (p) { self._markers[p.id] = { marker: cm, lnglat: [clon, clat] }; });
          cm.getElement().addEventListener("click", function (ev) {
            var av = ev.target.closest(".cc-cl__av");
            if (av && av.getAttribute("data-person")) {
              self.dispatchEvent(new CustomEvent("marker-select", { detail: { id: av.getAttribute("data-person") } }));
              ev.stopPropagation(); return;
            }
            self._map.flyTo({ center: [clon, clat], zoom: Math.min(self._map.getZoom() + 2, 18), duration: 500 });
          });
        });
        solo.forEach(function (fp) {
          var fm = self._mk("cc-pin", personHtml(fp), [fp.lon, fp.lat], fp.id === self._focusId ? 1400 : 1300);
          self._peopleLayers.push(fm);
          self._bind(fp.id, fm, [fp.lon, fp.lat]);
          if (fp.id === self._focusId) self._setActive(fp.id, true);
        });
      }
      _mk(className, html, lnglat, zindex) {
        var el = document.createElement("div");
        el.className = className; el.innerHTML = html;
        if (zindex) el.style.zIndex = zindex;
        return new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(lnglat).addTo(this._map);
      }
      _bind(id, marker, lnglat) {
        var self = this;
        this._markers[id] = { marker: marker, lnglat: lnglat };
        marker.getElement().addEventListener("click", function () { self.dispatchEvent(new CustomEvent("marker-select", { detail: { id: id } })); });
      }
      _setActive(id, on) {
        var rec = this._markers[id]; if (!rec) return;
        var el = rec.marker.getElement();
        if (el) el.classList.toggle("cc-pin--active", on);
        var zi = this._zoneIds && this._zoneIds.find(function (z) { return z.id === id; });
        if (zi && this._map.getLayer(zi.fill)) {
          var v = this._zoneVals(on);
          this._map.setPaintProperty(zi.fill, "fill-opacity", v.fill);
          this._map.setPaintProperty(zi.line, "line-width", v.width);
          this._map.setPaintProperty(zi.line, "line-opacity", v.lineOp);
        }
      }
      _focus(id) {
        if (!this._map || !this._markers) return;
        if (this._activeId && this._activeId !== id) this._setActive(this._activeId, false);
        this._activeId = id;
        var pad = parseInt(this.getAttribute("focus-pad-bottom") || "0", 10) || 0;
        // Only pass padding when there's a real inset; flyTo throws on padding:undefined.
        function opts(center, zoom) {
          var o = { center: center, zoom: zoom, duration: 600 };
          if (pad) o.padding = { top: 0, right: 0, left: 0, bottom: pad };
          return o;
        }
        var people = (this._data().people || []);
        var p = people.find(function (x) { return x.id === id; });
        if (p) {
          this._focusId = id;
          this._addPeople();
          var z = Math.max(this._map.getZoom(), 16);
          this._map.flyTo(opts([p.lon, p.lat], z));
          return;
        }
        var rec = this._markers[id]; if (!rec) return;
        this._setActive(id, true);
        var zr = Math.max(this._map.getZoom(), 16);
        this._map.flyTo(opts(rec.lnglat, zr));
      }
      _unfocus() {
        if (!this._map) return;
        if (this._activeId) this._setActive(this._activeId, false);
        this._activeId = null;
        this._focusId = null;
        this._addPeople();
        // Return to the exact view captured on load, so back always matches the
        // initial overview rather than recomputing against a changed viewport.
        if (this._loadView) this._map.flyTo({ center: this._loadView.center, zoom: this._loadView.zoom, duration: 600 });
        else this._fitAll(true);
      }
      _setTheme(mode) {
        if (!this._map) return;
        this._theme = mode;
        // Recolor in place: keeps tiles, GeoJSON zone layers, and HTML markers intact.
        window.HA_MAP_RECOLOR(this._map, mode);
        window.HA_MAP_HIDE_POI(this._map);
        this._applyZoneTheme();
      }
      attributeChangedCallback(name, o, n) {
        if (!this._map) return;
        if (name === "focus-id") { if (n) this._focus(n); else this._unfocus(); }
        else if (name === "show-zones") { this._applyZoneVis(); }
        else if (name === "focus-pad-bottom" && this._activeId) { this._focus(this._activeId); }
        else if (name === "theme" && n && n !== this._theme) { this._setTheme(n); }
        else if (name === "markers") { this._refreshZones(); }
        else if (name === "edit-zone") { if (n) { try { this._startZoneEdit(JSON.parse(n)); } catch (e) {} } else { this._endZoneEdit(); } }
      }
      _applyZoneVis() {
        if (!this._map || !this._zoneIds) return;
        var show = !!this.getAttribute("show-zones");
        var map = this._map;
        this._zoneIds.forEach(function (z) {
          if (map.getLayer(z.fill)) map.setLayoutProperty(z.fill, "visibility", show ? "visible" : "none");
          if (map.getLayer(z.line)) map.setLayoutProperty(z.line, "visibility", show ? "visible" : "none");
        });
      }
      _reapplyEditHidden() {
        if (!this._edit || !this._map) return;
        var zi = this._zoneIds && this._zoneIds.find((z) => z.id === this._edit.id);
        if (zi) { if (this._map.getLayer(zi.fill)) this._map.setLayoutProperty(zi.fill, "visibility", "none"); if (this._map.getLayer(zi.line)) this._map.setLayoutProperty(zi.line, "visibility", "none"); }
        var lbl = this._markers[this._edit.id]; if (lbl && lbl.marker) lbl.marker.getElement().style.display = "none";
      }
      // ---- zone editing on the world map (handles + live shape) ----
      _zoneEditFeature() {
        var e = this._edit;
        if (e.mode === "polygon" && e.polygon && e.polygon.length >= 3) {
          var ring = e.polygon.map(function (p) { return [p[1], p[0]]; });
          var a = ring[0], b = ring[ring.length - 1];
          if (a[0] !== b[0] || a[1] !== b[1]) ring = ring.concat([[a[0], a[1]]]);
          return { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] } };
        }
        return circleGeoJSON(e.lat, e.lon, e.radius);
      }
      _zoneEditCenterEl() {
        var e = this._edit; var el = document.createElement("div");
        el.className = "cc-zone cc-zedit__center";
        el.innerHTML = zoneHtml({ icon: e.icon || "map-marker-radius", color: e.color || "#1C6FD6", name: "", ghost: e.dashed });
        el.style.cursor = "grab"; return el;
      }
      _zoneEditBuildHandles() {
        var self = this, map = this._map, e = this._edit;
        (this._editHandles || []).forEach(function (m) { m.remove(); });
        this._editHandles = []; this._editVtx = []; this._editMid = [];
        var cLL = (e.mode === "polygon" && e.polygon) ? polyCentroidLatLon(e.polygon) : [e.lat, e.lon];
        var cEl = this._zoneEditCenterEl();
        var cM = new maplibregl.Marker({ element: cEl, anchor: "center" }).setLngLat([cLL[1], cLL[0]]).addTo(map);
        this._editHandles.push(cM); this._editCenter = cM;
        this._zoneEditAttachDrag(cEl, function (ll, dLng, dLat) {
          if (e.mode === "polygon" && e.polygon) { e.polygon = e.polygon.map(function (p) { return [p[0] + dLat, p[1] + dLng]; }); }
          else { e.lat = ll.lat; e.lon = ll.lng; }
          self._zoneEditRedraw();
        });
        if (e.mode !== "polygon") {
          var rp = destPoint(e.lat, e.lon, e.radius, e.rAngle);
          var rEl = document.createElement("div"); rEl.className = "cc-zedit__handle"; rEl.title = "Drag to resize";
          var rM = new maplibregl.Marker({ element: rEl, anchor: "center" }).setLngLat([rp[1], rp[0]]).addTo(map);
          this._editHandles.push(rM); this._editRadius = rM;
          this._zoneEditAttachDrag(rEl, function (ll) {
            e.radius = Math.max(20, Math.min(3000, metersBetween(e.lat, e.lon, ll.lat, ll.lng)));
            e.rAngle = Math.atan2((ll.lng - e.lon) * Math.cos(e.lat * DEG), (ll.lat - e.lat));
            self._zoneEditRedraw();
          });
        } else if (e.polygon) {
          e.polygon.forEach(function (p, i) {
            var vEl = document.createElement("div"); vEl.className = "cc-zedit__vtx"; vEl.title = "Drag to reshape, tap to remove";
            var vM = new maplibregl.Marker({ element: vEl, anchor: "center" }).setLngLat([p[1], p[0]]).addTo(map);
            self._editHandles.push(vM); self._editVtx[i] = vM;
            self._zoneEditAttachDrag(vEl, function (ll) { e.polygon[i] = [ll.lat, ll.lng]; self._zoneEditRedraw(); },
              function () { if (e.polygon.length > 3) { e.polygon.splice(i, 1); self._zoneEditRedraw(); self._zoneEditBuildHandles(); self._emitZoneEdit(); } });
          });
          e.polygon.forEach(function (p, i) {
            var q = e.polygon[(i + 1) % e.polygon.length];
            var mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
            var mEl = document.createElement("div"); mEl.className = "cc-zedit__mid"; mEl.title = "Tap to add a point";
            mEl.innerHTML = '<span class="mdi mdi-plus"></span>';
            var mM = new maplibregl.Marker({ element: mEl, anchor: "center" }).setLngLat([mid[1], mid[0]]).addTo(map);
            self._editHandles.push(mM); self._editMid[i] = mM;
            self._zoneEditAttachDrag(mEl, null, function () { e.polygon.splice(i + 1, 0, mid); self._zoneEditRedraw(); self._zoneEditBuildHandles(); self._emitZoneEdit(); });
          });
        }
      }
      _zoneEditRedraw() {
        var self = this, e = this._edit;
        if (this._map.getSource("zedit-live")) this._map.getSource("zedit-live").setData(this._zoneEditFeature());
        var cLL = (e.mode === "polygon" && e.polygon) ? polyCentroidLatLon(e.polygon) : [e.lat, e.lon];
        if (this._editCenter) this._editCenter.setLngLat([cLL[1], cLL[0]]);
        if (e.mode !== "polygon") { if (this._editRadius) { var rp = destPoint(e.lat, e.lon, e.radius, e.rAngle); this._editRadius.setLngLat([rp[1], rp[0]]); } }
        else if (e.polygon) {
          e.polygon.forEach(function (p, i) { if (self._editVtx[i]) self._editVtx[i].setLngLat([p[1], p[0]]); });
          e.polygon.forEach(function (p, i) { var q = e.polygon[(i + 1) % e.polygon.length]; if (self._editMid[i]) self._editMid[i].setLngLat([(p[1] + q[1]) / 2, (p[0] + q[0]) / 2]); });
        }
      }
      _zoneEditAttachDrag(el, onMove, onTap) {
        var self = this;
        el.style.touchAction = "none";
        el.addEventListener("pointerdown", function (ev) {
          ev.preventDefault(); ev.stopPropagation();
          try { el.setPointerCapture(ev.pointerId); } catch (er) {}
          self._map.dragPan.disable();
          var rect = self._map.getContainer().getBoundingClientRect();
          var prev = self._map.unproject([ev.clientX - rect.left, ev.clientY - rect.top]);
          var moved = 0, lastX = ev.clientX, lastY = ev.clientY;
          function mv(e2) {
            var cur = self._map.unproject([e2.clientX - rect.left, e2.clientY - rect.top]);
            moved += Math.hypot(e2.clientX - lastX, e2.clientY - lastY); lastX = e2.clientX; lastY = e2.clientY;
            if (onMove) onMove(cur, cur.lng - prev.lng, cur.lat - prev.lat); prev = cur;
          }
          function up(e2) {
            el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
            try { el.releasePointerCapture(ev.pointerId); } catch (er) {}
            self._map.dragPan.enable();
            if (moved < 6 && onTap) onTap(); else self._emitZoneEdit();
          }
          el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
        });
      }
      // Current viewport centre, so a new zone can be created where the user is looking.
      getCenter() {
        if (!this._map) return null;
        var c = this._map.getCenter();
        return { lat: c.lat, lon: c.lng };
      }
      moveZoneEditTo(lat, lon) {
        var e = this._edit; if (!e) return;
        if (e.mode === "polygon" && e.polygon) {
          var ct = polyCentroidLatLon(e.polygon), dLat = lat - ct[0], dLon = lon - ct[1];
          e.polygon = e.polygon.map(function (p) { return [p[0] + dLat, p[1] + dLon]; });
        } else { e.lat = lat; e.lon = lon; }
        this._zoneEditRedraw(); this._zoneEditBuildHandles(); this._zoneEditFrame(); this._emitZoneEdit();
      }
      setZoneMode(mode) {
        var e = this._edit; if (!e || mode === e.mode) return;
        if (mode === "polygon") { e.polygon = (e.polygon && e.polygon.length >= 3) ? e.polygon : circleToPoly(e.lat, e.lon, e.radius || 80, 6); e.mode = "polygon"; }
        else {
          if (e.polygon && e.polygon.length) { var ct = polyCentroidLatLon(e.polygon); e.lat = ct[0]; e.lon = ct[1]; var sum = 0; e.polygon.forEach(function (p) { sum += metersBetween(ct[0], ct[1], p[0], p[1]); }); e.radius = Math.max(30, sum / e.polygon.length); }
          e.mode = "circle";
        }
        this._zoneEditRedraw(); this._zoneEditBuildHandles(); this._zoneEditFrame(); this._emitZoneEdit();
      }
      _emitZoneEdit() {
        var e = this._edit; if (!e) return;
        this.dispatchEvent(new CustomEvent("zone-change", { detail: { id: e.id, mode: e.mode, lat: e.lat, lon: e.lon, radius: Math.round(e.radius), polygon: e.polygon } }));
      }
      _zoneEditFrame() {
        var e = this._edit, map = this._map; if (!e || !map) return;
        var b;
        if (e.mode === "polygon" && e.polygon && e.polygon.length) { b = new maplibregl.LngLatBounds([e.polygon[0][1], e.polygon[0][0]], [e.polygon[0][1], e.polygon[0][0]]); e.polygon.forEach(function (p) { b.extend([p[1], p[0]]); }); }
        else { var c = circleGeoJSON(e.lat, e.lon, e.radius).geometry.coordinates[0]; b = new maplibregl.LngLatBounds(c[0], c[0]); c.forEach(function (pt) { b.extend(pt); }); }
        var mob = this._isMobile();
        var pad = mob ? { top: 90, left: 56, right: 56, bottom: (parseInt(this.getAttribute("focus-pad-bottom") || "0", 10) || 0) + 90 } : { top: 110, left: 90, right: 440, bottom: 110 };
        try { map.fitBounds(b, { padding: pad, maxZoom: 17, duration: 500 }); } catch (err) {}
      }
      _startZoneEdit(spec) {
        if (this._edit && this._edit.id === spec.id) {
          // same zone already in edit: only sync style (color / icon); geometry is owned by the handles
          var changed = false;
          if (spec.color && spec.color !== this._edit.color) { this._edit.color = spec.color; if (this._map.getLayer("zedit-live-fill")) this._map.setPaintProperty("zedit-live-fill", "fill-color", spec.color); if (this._map.getLayer("zedit-live-line")) this._map.setPaintProperty("zedit-live-line", "line-color", spec.color); changed = true; }
          if (spec.icon && spec.icon !== this._edit.icon) { this._edit.icon = spec.icon; changed = true; }
          if (changed && this._editCenter) this._editCenter.getElement().innerHTML = zoneHtml({ icon: this._edit.icon || "map-marker-radius", color: this._edit.color || "#1C6FD6", name: "", ghost: this._edit.dashed });
          return;
        }
        if (this._edit) this._endZoneEdit();
        if (!this._map || !this._loaded) { this._pendingEdit = spec; return; }
        this._edit = Object.assign({ rAngle: Math.PI / 2 }, spec);
        if (typeof this._edit.polygon === "string") { try { this._edit.polygon = JSON.parse(this._edit.polygon); } catch (e) { this._edit.polygon = null; } }
        if (this._edit.mode === "polygon" && !(this._edit.polygon && this._edit.polygon.length)) this._edit.mode = "circle";
        var col = this._edit.color || "#1C6FD6", dark = this._theme !== "light";
        if (!this._map.getSource("zedit-live")) this._map.addSource("zedit-live", { type: "geojson", data: this._zoneEditFeature() });
        else this._map.getSource("zedit-live").setData(this._zoneEditFeature());
        if (!this._map.getLayer("zedit-live-fill")) this._map.addLayer({ id: "zedit-live-fill", type: "fill", source: "zedit-live", paint: { "fill-color": col, "fill-opacity": dark ? 0.30 : 0.18 } });
        else this._map.setPaintProperty("zedit-live-fill", "fill-color", col);
        if (!this._map.getLayer("zedit-live-line")) { var lp = { "line-color": col, "line-width": 4, "line-opacity": 1 }; if (this._edit.dashed) lp["line-dasharray"] = [2, 2]; this._map.addLayer({ id: "zedit-live-line", type: "line", source: "zedit-live", layout: { "line-join": "round" }, paint: lp }); }
        else { this._map.setPaintProperty("zedit-live-line", "line-color", col); this._map.setPaintProperty("zedit-live-line", "line-dasharray", this._edit.dashed ? [2, 2] : undefined); }
        this._reapplyEditHidden();
        this._zoneEditBuildHandles();
        this._zoneEditFrame();
      }
      _endZoneEdit() {
        var edit = this._edit;
        (this._editHandles || []).forEach(function (m) { m.remove(); });
        this._editHandles = []; this._editVtx = []; this._editMid = []; this._editCenter = null; this._editRadius = null;
        if (this._map) {
          if (this._map.getLayer("zedit-live-fill")) this._map.removeLayer("zedit-live-fill");
          if (this._map.getLayer("zedit-live-line")) this._map.removeLayer("zedit-live-line");
          if (this._map.getSource("zedit-live")) this._map.removeSource("zedit-live");
          if (edit) {
            var zi = this._zoneIds && this._zoneIds.find((z) => z.id === edit.id);
            if (zi) { if (this._map.getLayer(zi.fill)) this._map.setLayoutProperty(zi.fill, "visibility", "visible"); if (this._map.getLayer(zi.line)) this._map.setLayoutProperty(zi.line, "visibility", "visible"); }
            var lbl = this._markers[edit.id]; if (lbl && lbl.marker) lbl.marker.getElement().style.display = "";
          }
        }
        this._edit = null;
      }
      disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } if (this._map) { this._map.remove(); this._map = null; } this._booted = false; }
    }
    customElements.define("ha-world-map", HaWorldMap);
  }

  // ---- interactive zone shape editor ------------------------------------
  // A small map with draggable handles. Circle mode: drag the center to move,
  // drag the ring handle to resize. Custom-shape (polygon) mode: drag the
  // center to move the whole shape, drag a point to reshape, tap a midpoint to
  // add a point, tap a point to remove it. Emits "zone-change" with the live
  // geometry. `readonly` renders a non-interactive preview of the shape.
  if (!(window.customElements && customElements.get("ha-zone-editor"))) {
    class HaZoneEditor extends HTMLElement {
      static get observedAttributes() { return ["theme", "color", "icon"]; }
      connectedCallback() {
        if (this._booted) return; this._booted = true;
        var self = this;
        this._mode = this.getAttribute("mode") || "circle";
        this._lat = parseFloat(this.getAttribute("lat"));
        this._lon = parseFloat(this.getAttribute("lon"));
        this._radius = parseFloat(this.getAttribute("radius")) || 80;
        this._color = this.getAttribute("color") || "#1C6FD6";
        this._readonly = this.hasAttribute("readonly");
        this._rAngle = Math.PI / 2;
        try { var p = JSON.parse(this.getAttribute("polygon") || "null"); this._poly = (p && p.length) ? p : null; } catch (e) { this._poly = null; }
        if (this._mode === "polygon" && !this._poly) this._mode = "circle";
        var zoom = parseFloat(this.getAttribute("zoom")) || 15;
        (function boot() {
          if (!window.maplibregl || !window.HA_MAP_BASE) { setTimeout(boot, 60); return; }
          if (!self.isConnected) { self._booted = false; return; }
          self._init(zoom);
        })();
      }
      _init(zoom) {
        var self = this;
        this._src = "zedit";
        this._theme = this.getAttribute("theme") || "dark";
        var ctr = (this._mode === "polygon" && this._poly) ? polyCentroidLatLon(this._poly) : [this._lat, this._lon];
        var map = new maplibregl.Map({
          container: this, style: window.HA_MAP_BASE,
          center: [ctr[1], ctr[0]], zoom: zoom, attributionControl: false,
          dragRotate: false, pitchWithRotate: false, interactive: !this._readonly
        });
        if (map.touchZoomRotate) map.touchZoomRotate.disableRotation();
        this._map = map;
        if (!this._readonly) map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: true }), "bottom-right");
        map.on("style.load", function () { window.HA_MAP_RECOLOR(map, self._theme); window.HA_MAP_HIDE_POI(map); self._ready(); });
        map.on("load", function () { self._ready(); });
        if (window.ResizeObserver) { this._ro = new ResizeObserver(function () { if (!self._map) return; self._map.resize(); if (self._loaded && (self._readonly || !self._touched)) self._fit(); }); this._ro.observe(this); }
      }
      _ready() {
        if (this._loaded || !this._map) return;
        this._loaded = true;
        this._addShape();
        this._buildHandles();
        this._fit();
        var self = this;
        setTimeout(function () { if (self._map) { self._map.resize(); if (!self._touched) self._fit(); } }, 320);
      }
      _feature() {
        if (this._mode === "polygon" && this._poly && this._poly.length >= 3) {
          var ring = this._poly.map(function (p) { return [p[1], p[0]]; });
          var a = ring[0], b = ring[ring.length - 1];
          if (a[0] !== b[0] || a[1] !== b[1]) ring = ring.concat([[a[0], a[1]]]);
          return { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] } };
        }
        return circleGeoJSON(this._lat, this._lon, this._radius);
      }
      _addShape() {
        var map = this._map, src = this._src, col = this._color;
        var dark = this._theme !== "light";
        if (!map.getSource(src)) map.addSource(src, { type: "geojson", data: this._feature() });
        if (!map.getLayer(src + "-fill")) map.addLayer({ id: src + "-fill", type: "fill", source: src, paint: { "fill-color": col, "fill-opacity": dark ? 0.28 : 0.18 } });
        if (!map.getLayer(src + "-line")) map.addLayer({ id: src + "-line", type: "line", source: src, layout: { "line-join": "round" }, paint: { "line-color": col, "line-width": 4, "line-opacity": 1 } });
      }
      _centerEl() {
        var el = document.createElement("div");
        el.className = "cc-zone cc-zedit__center";
        el.innerHTML = zoneHtml({ icon: this.getAttribute("icon") || "map-marker-radius", color: this._color, name: "" });
        if (!this._readonly) el.style.cursor = "grab";
        return el;
      }
      _buildHandles() {
        var self = this, map = this._map;
        (this._handles || []).forEach(function (m) { m.remove(); });
        this._handles = []; this._vtxMarkers = []; this._midMarkers = [];
        var cLL = (this._mode === "polygon" && this._poly) ? polyCentroidLatLon(this._poly) : [this._lat, this._lon];
        var cEl = this._centerEl();
        var cM = new maplibregl.Marker({ element: cEl, anchor: "center" }).setLngLat([cLL[1], cLL[0]]).addTo(map);
        this._handles.push(cM); this._centerM = cM;
        if (!this._readonly) {
          this._attachDrag(cEl, function (ll, dLng, dLat) {
            if (self._mode === "polygon" && self._poly) { self._poly = self._poly.map(function (p) { return [p[0] + dLat, p[1] + dLng]; }); }
            else { self._lat = ll.lat; self._lon = ll.lng; }
            self._redraw();
          });
        }
        if (this._mode !== "polygon") {
          if (this._readonly) return;
          var rp = destPoint(this._lat, this._lon, this._radius, this._rAngle);
          var rEl = document.createElement("div"); rEl.className = "cc-zedit__handle"; rEl.title = "Drag to resize";
          var rM = new maplibregl.Marker({ element: rEl, anchor: "center" }).setLngLat([rp[1], rp[0]]).addTo(map);
          this._handles.push(rM); this._radiusM = rM;
          this._attachDrag(rEl, function (ll) {
            self._radius = Math.max(20, Math.min(3000, metersBetween(self._lat, self._lon, ll.lat, ll.lng)));
            self._rAngle = Math.atan2((ll.lng - self._lon) * Math.cos(self._lat * DEG), (ll.lat - self._lat));
            self._redraw();
          });
        } else if (this._poly) {
          if (this._readonly) return;
          this._poly.forEach(function (p, i) {
            var vEl = document.createElement("div"); vEl.className = "cc-zedit__vtx"; vEl.title = "Drag to reshape, tap to remove";
            var vM = new maplibregl.Marker({ element: vEl, anchor: "center" }).setLngLat([p[1], p[0]]).addTo(map);
            self._handles.push(vM); self._vtxMarkers[i] = vM;
            self._attachDrag(vEl,
              function (ll) { self._poly[i] = [ll.lat, ll.lng]; self._redraw(); },
              function () { if (self._poly.length > 3) { self._poly.splice(i, 1); self._redraw(); self._buildHandles(); } });
          });
          this._poly.forEach(function (p, i) {
            var q = self._poly[(i + 1) % self._poly.length];
            var mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
            var mEl = document.createElement("div"); mEl.className = "cc-zedit__mid"; mEl.title = "Tap to add a point";
            mEl.innerHTML = '<span class="mdi mdi-plus"></span>';
            var mM = new maplibregl.Marker({ element: mEl, anchor: "center" }).setLngLat([mid[1], mid[0]]).addTo(map);
            self._handles.push(mM); self._midMarkers[i] = mM;
            self._attachDrag(mEl, null, function () { self._poly.splice(i + 1, 0, mid); self._redraw(); self._buildHandles(); });
          });
        }
      }
      _redraw() {
        var self = this;
        if (this._map.getSource(this._src)) this._map.getSource(this._src).setData(this._feature());
        var cLL = (this._mode === "polygon" && this._poly) ? polyCentroidLatLon(this._poly) : [this._lat, this._lon];
        if (this._centerM) this._centerM.setLngLat([cLL[1], cLL[0]]);
        if (this._mode !== "polygon") {
          if (this._radiusM) { var rp = destPoint(this._lat, this._lon, this._radius, this._rAngle); this._radiusM.setLngLat([rp[1], rp[0]]); }
        } else if (this._poly) {
          this._poly.forEach(function (p, i) { if (self._vtxMarkers[i]) self._vtxMarkers[i].setLngLat([p[1], p[0]]); });
          this._poly.forEach(function (p, i) { var q = self._poly[(i + 1) % self._poly.length]; if (self._midMarkers[i]) self._midMarkers[i].setLngLat([(p[1] + q[1]) / 2, (p[0] + q[0]) / 2]); });
        }
        this._emit();
      }
      _fit() {
        var b;
        if (this._mode === "polygon" && this._poly && this._poly.length) {
          b = new maplibregl.LngLatBounds([this._poly[0][1], this._poly[0][0]], [this._poly[0][1], this._poly[0][0]]);
          this._poly.forEach(function (p) { b.extend([p[1], p[0]]); });
        } else {
          var c = circleGeoJSON(this._lat, this._lon, this._radius).geometry.coordinates[0];
          b = new maplibregl.LngLatBounds(c[0], c[0]); c.forEach(function (pt) { b.extend(pt); });
        }
        try { this._map.fitBounds(b, { padding: this._readonly ? 36 : 64, duration: 0, maxZoom: 17 }); } catch (e) {}
      }
      _attachDrag(el, onMove, onTap) {
        var self = this;
        el.style.touchAction = "none";
        el.addEventListener("pointerdown", function (e) {
          e.preventDefault(); e.stopPropagation();
          self._touched = true;
          try { el.setPointerCapture(e.pointerId); } catch (er) {}
          self._map.dragPan.disable();
          var rect = self._map.getContainer().getBoundingClientRect();
          var prev = self._map.unproject([e.clientX - rect.left, e.clientY - rect.top]);
          var moved = 0;
          function mv(ev) {
            var cur = self._map.unproject([ev.clientX - rect.left, ev.clientY - rect.top]);
            moved += Math.hypot(ev.clientX - (self._lastX || ev.clientX), ev.clientY - (self._lastY || ev.clientY));
            self._lastX = ev.clientX; self._lastY = ev.clientY;
            if (onMove) onMove(cur, cur.lng - prev.lng, cur.lat - prev.lat);
            prev = cur;
          }
          self._lastX = e.clientX; self._lastY = e.clientY; moved = 0;
          function up(ev) {
            el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
            try { el.releasePointerCapture(e.pointerId); } catch (er) {}
            self._map.dragPan.enable();
            if (moved < 6 && onTap) onTap();
          }
          el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
        });
      }
      setMode(mode) {
        if (!this._loaded || mode === this._mode) return;
        if (mode === "polygon") {
          this._poly = (this._poly && this._poly.length >= 3) ? this._poly : circleToPoly(this._lat, this._lon, this._radius || 80, 6);
          this._mode = "polygon";
        } else {
          if (this._poly && this._poly.length) {
            var ct = polyCentroidLatLon(this._poly); this._lat = ct[0]; this._lon = ct[1];
            var sum = 0; this._poly.forEach(function (p) { sum += metersBetween(ct[0], ct[1], p[0], p[1]); });
            this._radius = Math.max(30, sum / this._poly.length);
          }
          this._mode = "circle";
        }
        if (this._map.getSource(this._src)) this._map.getSource(this._src).setData(this._feature());
        this._buildHandles(); this._fit(); this._emit();
      }
      moveTo(lat, lon) {
        if (!this._loaded) return;
        if (this._mode === "polygon" && this._poly) {
          var ct = polyCentroidLatLon(this._poly), dLat = lat - ct[0], dLon = lon - ct[1];
          this._poly = this._poly.map(function (p) { return [p[0] + dLat, p[1] + dLon]; });
        } else { this._lat = lat; this._lon = lon; }
        if (this._map.getSource(this._src)) this._map.getSource(this._src).setData(this._feature());
        this._buildHandles(); this._fit(); this._emit();
      }
      _emit() {
        this.dispatchEvent(new CustomEvent("zone-change", { detail: { mode: this._mode, lat: this._lat, lon: this._lon, radius: Math.round(this._radius), polygon: this._poly } }));
      }
      attributeChangedCallback(name, o, n) {
        if (!this._map) return;
        if (name === "theme" && n && n !== this._theme) { this._theme = n; window.HA_MAP_RECOLOR(this._map, n); window.HA_MAP_HIDE_POI(this._map); }
        else if (name === "color" && n && n !== this._color) {
          this._color = n;
          if (this._map.getLayer(this._src + "-fill")) this._map.setPaintProperty(this._src + "-fill", "fill-color", n);
          if (this._map.getLayer(this._src + "-line")) this._map.setPaintProperty(this._src + "-line", "line-color", n);
          if (this._centerM) this._centerM.getElement().innerHTML = zoneHtml({ icon: this.getAttribute("icon") || "map-marker-radius", color: n, name: "" });
        } else if (name === "icon" && this._centerM) {
          this._centerM.getElement().innerHTML = zoneHtml({ icon: n || "map-marker-radius", color: this._color, name: "" });
        }
      }
      disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } if (this._map) { this._map.remove(); this._map = null; } this._booted = false; }
    }
    customElements.define("ha-zone-editor", HaZoneEditor);
  }
})();
