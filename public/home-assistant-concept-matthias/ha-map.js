/* HA Concept Car — vector map custom elements (MapLibre GL + OpenFreeMap).
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
      static get observedAttributes() { return ["focus-id", "show-zones", "focus-pad-bottom", "theme"]; }
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
        var map = new maplibregl.Map({
          container: this, style: window.HA_MAP_BASE,
          center: [c.lon, c.lat], zoom: data.zoom || 14, attributionControl: false,
          dragRotate: false, pitchWithRotate: false
        });
        if (map.touchZoomRotate) map.touchZoomRotate.disableRotation();
        this._map = map;
        this._markers = {};
        this._activeId = null;
        this._zoneIds = [];
        map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: true }), "bottom-right");
        map.on("style.load", function () { window.HA_MAP_RECOLOR(map, self._theme); window.HA_MAP_HIDE_POI(map); });
        map.on("load", function () {
          self._addZoneLabels();
          self._addZones();
          self._applyZoneVis();
          self._addPeople();
          self._fitAll(false);
          var f = self.getAttribute("focus-id");
          if (f) setTimeout(function () { self._focus(f); }, 120);
          // Re-fit once the container has settled its final size (route mount /
          // sheet layout), so the initial framing isn't computed against a
          // stale viewport that clips the edge markers.
          else setTimeout(function () { if (!self._focusId && !self._activeId) { self._addPeople(); self._fitAll(false); self._loadView = { center: self._map.getCenter(), zoom: self._map.getZoom() }; } }, 360);
        });
        map.on("zoomend", function () { self._addPeople(); });
        if (window.ResizeObserver) { this._ro = new ResizeObserver(function () { if (self._map) self._map.resize(); }); this._ro.observe(this); }
      }
      // zone label markers are HTML (persist across setStyle) — create once
      _addZoneLabels() {
        var map = this._map; var self = this;
        (this._data().zones || []).forEach(function (z) {
          var el = document.createElement("div");
          el.className = "cc-zone"; el.innerHTML = zoneHtml(z);
          var m = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([z.lon, z.lat]).addTo(map);
          self._markers[z.id] = { marker: m, lnglat: [z.lon, z.lat] };
          el.addEventListener("click", function () { self.dispatchEvent(new CustomEvent("marker-select", { detail: { id: z.id } })); });
        });
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
            map.addLayer({ id: src + "-fill", type: "fill", source: src, paint: { "fill-color": col, "fill-opacity": rest.fill } });
          }
          if (!map.getLayer(src + "-line")) {
            map.addLayer({ id: src + "-line", type: "line", source: src, layout: { "line-join": "round" }, paint: { "line-color": col, "line-width": rest.width, "line-opacity": rest.lineOp } });
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
        var pad = this._isMobile()
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
      disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } if (this._map) { this._map.remove(); this._map = null; } this._booted = false; }
    }
    customElements.define("ha-world-map", HaWorldMap);
  }
})();
