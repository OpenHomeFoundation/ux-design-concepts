// Stub replacement for the removed MapLibre map wrapper.
//
// The original file defined the interactive vector-map custom elements
// (ha-carto-map, ha-world-map, ha-zone-editor). It was removed from the
// project. This stub re-registers those tags as inert placeholders so the
// rest of the app loads without a 404 and the /map page renders an empty
// surface instead of throwing. Restore the real ha-map.js to bring the map
// back.
(function () {
  class HaMapPlaceholder extends HTMLElement {
    connectedCallback() {
      if (this._rendered) return;
      this._rendered = true;
      this.style.display = "flex";
      this.style.alignItems = "center";
      this.style.justifyContent = "center";
      this.style.minHeight = "220px";
      this.style.height = "100%";
      this.style.color = "var(--color-text-tertiary, #8a8a8a)";
      this.style.fontFamily = "var(--font-body, system-ui, sans-serif)";
      this.style.fontSize = "14px";
      this.style.textAlign = "center";
      this.style.padding = "24px";
      this.textContent = "Map preview unavailable";
    }
    // Tolerate any imperative calls the app makes on the element.
    setData() {}
    setZones() {}
    setPeople() {}
    setView() {}
    setTheme() {}
    flyTo() {}
    fitBounds() {}
    resize() {}
    update() {}
    focusOn() {}
  }
  ["ha-carto-map", "ha-world-map", "ha-zone-editor"].forEach(function (tag) {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HaMapPlaceholder {});
    }
  });
})();
