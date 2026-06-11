/* Browse page, searchable, filterable device list with pagination. */

const PAGE_SIZE = 12;

/* "Requires internet" predicate, used by the Local-only filter.
   A device needs internet unless it can be controlled fully locally AND
   doesn't require a manufacturer cloud account. */
const requiresInternetVal = (d) =>
!(d.local === "always" && d.cloud !== "required");

/* Read filter state from URL params */
const readFilters = (params) => ({
  q: params.get("q") || "",
  category: new Set(params.getAll("category")),
  manufacturer: new Set(params.getAll("manufacturer")),
  /* Single boolean: when true, hide devices that need an internet
     connection. URL: `?local=1`. Replaces the old `internet` Set, which
     was a mutually-exclusive pair of checkboxes that could be checked
     together (a contradiction equivalent to "show all"). */
  localOnly: params.get("local") === "1",
  // Mode per multi-select dimension: "include" (default) or "exclude".
  // Stored compactly as `<dim>Mode=exclude` in the URL; absent = include.
  categoryMode: params.get("categoryMode") === "exclude" ? "exclude" : "include",
  manufacturerMode: params.get("manufacturerMode") === "exclude" ? "exclude" : "include",
  page: parseInt(params.get("page") || "1", 10),
  view: params.get("view") || "list"
});

const writeFilters = (f) => {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  for (const v of f.category) p.append("category", v);
  for (const v of f.manufacturer) p.append("manufacturer", v);
  if (f.localOnly) p.set("local", "1");
  if (f.categoryMode === "exclude") p.set("categoryMode", "exclude");
  if (f.manufacturerMode === "exclude") p.set("manufacturerMode", "exclude");
  if (f.page > 1) p.set("page", String(f.page));
  if (f.view !== "list") p.set("view", f.view);
  const qs = p.toString();
  const newHash = "#/browse" + (qs ? "?" + qs : "");
  // Use replace for filter changes so back-button history isn't polluted by each toggle
  history.replaceState(null, "", newHash);
};

/* Apply filters to a device. dim=optional dimension to skip for facet counts.
   Each multi-select dimension can be in "include" or "exclude" mode. In
   include mode (default), the set whitelists matching values; in exclude
   mode, it blacklists them. `localOnly` is a binary filter that hides
   cloud-dependent devices when on. */
const matches = (d, filters, skipDim = null) => {
  if (filters.q) {
    // Foundation-only: match reported fields, never the Stage 2 summary, so a
    // committed search can't surface a device on enrichment text the rest of
    // the baseline doesn't show.
    const hay = (d.name + " " + d.manufacturer + " " + d.model).toLowerCase();
    if (!hay.includes(filters.q.toLowerCase())) return false;
  }
  for (const dim of ["category", "manufacturer"]) {
    if (dim === skipDim) continue;
    const set = filters[dim];
    if (set.size === 0) continue;
    const has = set.has(d[dim]);
    const mode = filters[dim + "Mode"] || "include";
    if (mode === "exclude") {
      if (has) return false;
    } else {
      if (!has) return false;
    }
  }
  if (filters.localOnly && skipDim !== "localOnly" && requiresInternetVal(d)) return false;
  return true;
};

const facetCounts = (devices, filters, dim, values) => {
  const counts = {};
  for (const v of values) counts[v] = 0;
  for (const d of devices) {
    if (!matches(d, filters, dim)) continue;
    const v = d[dim];
    if (counts[v] !== undefined) counts[v] += 1;
  }
  return counts;
};

const FilterGroup = ({ label, options, selected, counts, onToggle, scrollable = false, children }) =>
<div className="filter-group">
    <div className="filter-group-label">{label}</div>
    {options &&
  <div className={scrollable ? "filter-options scrollable" : "filter-options"}>
        {options.map((opt) =>
    <label key={opt.id} className="filter-row">
            <input type="checkbox"
      checked={selected.has(opt.id)}
      onChange={() => onToggle(opt.id)} />
            <span className="filter-row-text">{opt.label}</span>
            <span className="count">{counts[opt.id] ?? 0}</span>
          </label>
    )}
      </div>
  }
    {children}
  </div>;


/* ---------- Overflow filter group ----------
   Shows the top-N most frequent options inline plus any currently-selected
   ones, with a "More" link that opens a modal listing every option (with
   live filtering). Used for dimensions with too many values to show flat. */
const TOP_N = 5;

const groupOptionsByLetter = (options) => {
  const groups = {};
  for (const o of options) {
    const head = (o.label[0] || "#").toUpperCase();
    const key = /[A-Z]/.test(head) ? head : "#";
    (groups[key] = groups[key] || []).push(o);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
};

const OverflowFilterModal = ({ title, options, selected, counts, onToggle, onClose, useLetterGroups, onClear, mode, onModeChange }) => {
  const [q, setQ] = React.useState("");
  const inputRef = React.useRef(null);

  // Esc to close + body scroll lock + autofocus search + body class so
  // CSS can dim the sticky header behind the modal scrim.
  React.useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  const term = q.trim().toLowerCase();
  const matched = term ?
  options.filter((o) => o.label.toLowerCase().includes(term)) :
  options;
  const selectedCount = selected.size;

  const renderRow = (opt) =>
  <label key={opt.id} className="filter-row">
      <input type="checkbox"
    checked={selected.has(opt.id)}
    onChange={() => onToggle(opt.id)} />
      <span className="filter-row-text">{opt.label}</span>
      <span className="count">{counts[opt.id] ?? 0}</span>
    </label>;


  const lower = title.toLowerCase();

  // Portal the modal to document.body so its stacking context is never
  // trapped beneath an ancestor with z-index (e.g. the sticky header).
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-dialog modal-tall"
      role="dialog" aria-modal="true"
      onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div className="modal-head-row">
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
            <h2>{title}</h2>
            {onModeChange &&
            <div className="filter-mode" role="group" aria-label={`${title} filter mode`}>
                <button type="button"
              className={"filter-mode-btn" + (mode === "include" ? " is-active" : "")}
              onClick={() => onModeChange("include")}
              aria-pressed={mode === "include"}
              data-label="is"><span>is</span></button>
                <button type="button"
              className={"filter-mode-btn" + (mode === "exclude" ? " is-active" : "")}
              onClick={() => onModeChange("exclude")}
              aria-pressed={mode === "exclude"}
              data-label="is not"><span>is not</span></button>
              </div>
            }
          </div>
          <div className="modal-head-search">
            <div className="modal-search-input">
              <Icon name="search" size={18} />
              <input ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${lower}`}
              aria-label={`Search ${lower}`} />
              {q &&
              <button onClick={() => setQ("")}
              className="modal-search-clear"
              aria-label="Clear">
                  Clear
                </button>
              }
            </div>
          </div>
        </header>

        <div className="modal-body">
          {matched.length === 0 ?
          <div className="modal-empty">No matches for "{q}".</div> :
          useLetterGroups ?
          groupOptionsByLetter(matched).map(([letter, opts]) =>
          <section key={letter} className="modal-group">
                <div className="modal-group-head">{letter}</div>
                <div className="modal-group-rows">{opts.map(renderRow)}</div>
              </section>
          ) :

          <div className="modal-group-rows">{matched.map(renderRow)}</div>
          }
        </div>

        <footer className="modal-foot">
          {selectedCount === 0 ?
          <span className="modal-foot-meta">No {lower} selected</span> :

          <button type="button"
          className="modal-foot-clear"
          onClick={() => onClear?.()}>
              Clear {selectedCount} selected
            </button>
          }
          <button className="btn btn-primary" onClick={onClose}>View results</button>
        </footer>
      </div>
    </div>,
    document.body);
};

const OverflowFilterGroup = ({ label, options, frequencies, selected, counts, onToggle, useLetterGroups = false, mode = "include", onModeChange, onClear }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const optById = React.useMemo(() => {
    const m = {};
    for (const o of options) m[o.id] = o;
    return m;
  }, [options]);

  // Top-N by overall frequency (NOT facet counts, we want the inline rows
  // to stay stable as other filters change).
  const topIds = React.useMemo(() =>
  [...options].
  sort((a, b) => (frequencies[b.id] || 0) - (frequencies[a.id] || 0) ||
  a.label.localeCompare(b.label)).
  slice(0, TOP_N).
  map((o) => o.id),
  [options, frequencies]);

  // Visible inline rows: top-N ∪ anything the user has selected (so a pick
  // from the modal is always visible / uncheckable from the sidebar).
  const visibleIds = React.useMemo(() => {
    const set = new Set(topIds);
    for (const s of selected) set.add(s);
    return [...set].sort((a, b) =>
    (frequencies[b] || 0) - (frequencies[a] || 0) ||
    (optById[a]?.label || "").localeCompare(optById[b]?.label || "")
    );
  }, [topIds, selected, frequencies, optById]);

  return (
    <div className="filter-group">
      <div className="filter-group-head">
        <div className="filter-group-label">{label}</div>
        {onModeChange &&
        <div className="filter-mode" role="group" aria-label={`${label} filter mode`}>
            <button type="button"
          className={"filter-mode-btn" + (mode === "include" ? " is-active" : "")}
          onClick={() => onModeChange("include")}
          aria-pressed={mode === "include"}
          data-label="is"><span>is</span></button>
            <button type="button"
          className={"filter-mode-btn" + (mode === "exclude" ? " is-active" : "")}
          onClick={() => onModeChange("exclude")}
          aria-pressed={mode === "exclude"}
          data-label="is not"><span>is not</span></button>
          </div>
        }
      </div>
      <div className="filter-options">
        {visibleIds.map((id) =>
        <label key={id} className="filter-row">
            <input type="checkbox"
          checked={selected.has(id)}
          onChange={() => onToggle(id)} />
            <span className="filter-row-text">{optById[id]?.label || id}</span>
            <span className="count">{counts[id] ?? 0}</span>
          </label>
        )}
        {options.length > visibleIds.length &&
        <button type="button"
        className="filter-more"
        onClick={() => setModalOpen(true)}>
            <Icon name="search" size={16} />
            <span>More</span>
          </button>
        }
      </div>
      {modalOpen &&
      <OverflowFilterModal title={label}
      options={options}
      selected={selected}
      counts={counts}
      onToggle={onToggle}
      onClear={onClear}
      mode={mode}
      onModeChange={onModeChange}
      useLetterGroups={useLetterGroups}
      onClose={() => setModalOpen(false)} />
      }
    </div>);

};

const ActiveFilterChips = ({ filters, onRemove, setFilters, onOpenSubView }) => {
  const [modalDim, setModalDim] = React.useState(null);

  // Iterative dim-collapse: render all chips individually, then if the strip
  // wraps to a second row, collapse the noisiest dimension into a summary
  // chip and re-measure. Repeat until it fits (or nothing's left to collapse).
  const stripRef = React.useRef(null);
  const [collapsed, setCollapsed] = React.useState(() => new Set());

  // Reset collapse state whenever the active filters change, we always
  // try to show every chip individually first.
  const filterKey = `${filters.q || ""}__` +
  `${[...filters.category].sort().join("|")}__` +
  `${[...filters.manufacturer].sort().join("|")}__` +
  `${filters.localOnly ? "L" : ""}__` +
  `${filters.categoryMode || ""}__${filters.manufacturerMode || ""}`;
  const lastFilterKey = React.useRef(filterKey);
  if (lastFilterKey.current !== filterKey) {
    lastFilterKey.current = filterKey;
    if (collapsed.size > 0) setCollapsed(new Set());
  }

  // Manufacturer + category options (memoised); needed for the modal.
  const manufacturerOptions = React.useMemo(() => {
    const names = [...new Set(window.DEVICES.map((d) => d.manufacturer))];
    names.sort((a, b) => a.localeCompare(b));
    return names.map((n) => ({ id: n, label: n }));
  }, []);
  const categoryOptions = window.DEVICE_CATEGORIES;

  // Modal data, computed up front so React's hook order stays stable
  // across renders (we have an early return below for empty chips).
  const modalOptions = modalDim === "manufacturer" ? manufacturerOptions :
  modalDim === "category" ? categoryOptions :
  [];
  const modalCounts = React.useMemo(() => {
    if (!modalDim) return {};
    return facetCounts(window.DEVICES, filters, modalDim, modalOptions.map((o) => o.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalDim, filters]);

  const toggleSet = (dim, id) => setFilters((f) => {
    const next = new Set(f[dim]);
    if (next.has(id)) next.delete(id);else next.add(id);
    return { ...f, [dim]: next, page: 1 };
  });

  // Build the chip list, collapsing any dimension with >= COLLAPSE_AT.
  const chips = [];

  const renderDim = (dim, ids, makeLabel, dimLabel, dimLabelPlural) => {
    if (ids.size === 0) return;
    const mode = filters[dim + "Mode"] || "include";
    const not = mode === "exclude";
    if (collapsed.has(dim)) {
      chips.push({
        key: dim + "-summary",
        label: `${not ? "Not " : ""}${ids.size} ${ids.size === 1 ? dimLabel : dimLabelPlural}`,
        onClick: () => {
          // On mobile/tablet, hand off to the bottom-sheet's dimension view
          // so summary chips open the same surface as the FAB row.
          if (onOpenSubView && window.matchMedia("(max-width: 1023px)").matches) {
            onOpenSubView(dim);
          } else {
            setModalDim(dim);
          }
        },
        summary: true,
        dim
      });
    } else {
      for (const id of ids) {
        const raw = makeLabel(id);
        // Category labels read as common nouns when negated, drop the
        // capital. Manufacturer names are proper nouns, keep them.
        const display = not && dim === "category" ?
        raw.charAt(0).toLowerCase() + raw.slice(1) :
        raw;
        chips.push({
          key: dim + "-" + id,
          label: (not ? "Not " : "") + display,
          onRemove: () => onRemove(dim, id),
          dim
        });
      }
    }
  };

  // Free-text search shows as the first chip (its own "q" dimension), kept
  // out of the search bar. Removing it clears the committed query. It's a
  // single chip, so the collapse logic below (category/manufacturer only)
  // never touches it.
  if (filters.q) {
    chips.push({
      key: "q",
      label: filters.q,
      onRemove: () => onRemove("q"),
      dim: "q"
    });
  }

  renderDim("category", filters.category,
  (id) => window.CATEGORY_LABEL[id],
  "category", "categories");
  renderDim("manufacturer", filters.manufacturer,
  (id) => id,
  "manufacturer", "manufacturers");
  // Local-only is binary; emit a single chip when active. Removing it
  // flips the boolean off via removeFilter("localOnly").
  if (filters.localOnly) {
    chips.push({
      key: "localOnly",
      label: "Local control only",
      onRemove: () => onRemove("localOnly"),
      dim: "localOnly"
    });
  }

  // Snapshot of dimension data, used by the layout effect to pick which
  // dim to collapse when the strip overflows.
  const dimensionsForCollapse = [
  { dim: "category", ids: filters.category },
  { dim: "manufacturer", ids: filters.manufacturer }];


  // After render, check if the chip strip wraps to a second row. If yes,
  // collapse the dimension whose individual chips occupy the most width
  // (greatest savings). Re-runs on container resize and after each
  // collapse, the loop terminates once the row fits or there's nothing
  // left to collapse.
  React.useLayoutEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const check = () => {
      const chipEls = [...el.querySelectorAll(".chip")];
      if (chipEls.length < 2) return;
      const firstTop = chipEls[0].offsetTop;
      const overflows = chipEls.some((n) => n.offsetTop !== firstTop);
      if (!overflows) return;

      let best = null,bestWidth = -1;
      for (const { dim, ids } of dimensionsForCollapse) {
        if (collapsed.has(dim)) continue;
        if (ids.size < 2) continue;
        const dimEls = chipEls.filter((n) => n.dataset.dim === dim);
        const total = dimEls.reduce((a, c) => a + c.offsetWidth, 0);
        if (total > bestWidth) {best = dim;bestWidth = total;}
      }
      if (best) setCollapsed((prev) => new Set([...prev, best]));
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, filterKey]);

  if (chips.length === 0) {
    // Keep the strip mounted so the ResizeObserver stays alive, even when
    // there are no active filters yet.
    return <div ref={stripRef} className="active-filters active-filters-empty" />;
  }

  const modalSelected = modalDim ? filters[modalDim] : new Set();
  const modalTitle = modalDim === "manufacturer" ? "Manufacturer" : "Category";

  return (
    <div ref={stripRef} className="active-filters">
      {chips.map((c) =>
      <button key={c.key}
      data-dim={c.dim}
      className={"chip" + (c.summary ? " chip-summary" : "")}
      onClick={c.onClick || c.onRemove}>
          {c.label}
          {c.summary ?
        <Icon name="pencil" size={12} /> :
        <Icon name="x" size={12} />}
        </button>
      )}
      {modalDim &&
      <OverflowFilterModal title={modalTitle}
      options={modalOptions}
      selected={modalSelected}
      counts={modalCounts}
      onToggle={(id) => toggleSet(modalDim, id)}
      onClear={() => setFilters((f) => ({ ...f, [modalDim]: new Set(), page: 1 }))}
      mode={filters[modalDim + "Mode"] || "include"}
      onModeChange={(m) => setFilters((f) => ({ ...f, [modalDim + "Mode"]: m, page: 1 }))}
      onClose={() => setModalDim(null)}
      useLetterGroups={modalDim === "manufacturer"} />
      }
    </div>);

};

const Pagination = ({ page, totalPages, total, onChange }) => {
  if (totalPages <= 1) return null;
  const pages = [];
  const push = (n) => pages.push(n);
  // Always show first, last, current ±1, with ellipses
  const around = new Set([1, totalPages, page, page - 1, page + 1, page - 2, page + 2]);
  for (let i = 1; i <= totalPages; i++) {
    if (around.has(i) && i >= 1 && i <= totalPages) push(i);
  }
  const unique = [...new Set(pages)].sort((a, b) => a - b);

  const rendered = [];
  let prev = 0;
  for (const n of unique) {
    if (n - prev > 1) rendered.push(<span className="ellipsis" key={"e" + n}>…</span>);
    rendered.push(
      <button key={n}
      className={page === n ? "active" : ""}
      onClick={() => onChange(n)}>{n}</button>
    );
    prev = n;
  }

  return (
    <div className="pagination">
      <button disabled={page === 1}
      aria-label="Previous page"
      onClick={() => onChange(page - 1)}>
        <Icon name="arrowL" size={16} />
      </button>
      {rendered}
      <button disabled={page === totalPages}
      aria-label="Next page"
      onClick={() => onChange(page + 1)}>
        <Icon name="arrow" size={16} />
      </button>
    </div>);

};

/* Local-only toggle, a single binary filter promoted above the multi-
   select groups. Replaces a Connectivity checkbox pair whose two options
   were mutually exclusive (you couldn't be both local and cloud-required),
   making the dual-checkbox form prone to a "check both = check none" trap.
   The labelled switch communicates "this is a setting" rather than "this
   is one of several values you can pick." */
const LocalOnlyToggle = ({ on, onChange }) =>
<div className="local-only-toggle">
    <label className="local-only-toggle-row">
      <span className="local-only-toggle-text">
        <span className="local-only-toggle-label">Local control only</span>
        <span className="local-only-toggle-hint">Hide devices that need an internet connection
</span>
      </span>
      <span className={"switch" + (on ? " is-on" : "")}>
        <input type="checkbox" checked={on}
        onChange={(e) => onChange(e.target.checked)}
        aria-label="Local control only" />
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb"></span>
        </span>
      </span>
    </label>
  </div>;


/* Filter sidebar, extracted so it can be mounted standalone. */
const FilterSidebar = ({ filters, setFilters }) => {
  const toggleSet = (dim, id) => setFilters((f) => {
    const next = new Set(f[dim]);
    if (next.has(id)) next.delete(id);else next.add(id);
    return { ...f, [dim]: next, page: 1 };
  });
  const clearAll = () => setFilters((f) => ({
    q: "", category: new Set(), manufacturer: new Set(),
    localOnly: false,
    categoryMode: "include", manufacturerMode: "include",
    page: 1, view: f.view ?? "list"
  }));

  const manufacturerOptions = React.useMemo(() => {
    const names = [...new Set(window.DEVICES.map((d) => d.manufacturer))];
    names.sort((a, b) => a.localeCompare(b));
    return names.map((n) => ({ id: n, label: n }));
  }, []);

  // Overall frequencies (NOT facet-filtered), used to pick the top-N
  // entries shown inline by OverflowFilterGroup. Stable across filter changes.
  const categoryFreq = React.useMemo(() => {
    const c = {};
    for (const d of window.DEVICES) c[d.category] = (c[d.category] || 0) + 1;
    return c;
  }, []);
  const manufacturerFreq = React.useMemo(() => {
    const c = {};
    for (const d of window.DEVICES) c[d.manufacturer] = (c[d.manufacturer] || 0) + 1;
    return c;
  }, []);

  const catCounts = facetCounts(window.DEVICES, filters, "category", window.DEVICE_CATEGORIES.map((c) => c.id));
  const manuCounts = facetCounts(window.DEVICES, filters, "manufacturer", manufacturerOptions.map((m) => m.id));

  return (
    <aside className="filters" aria-label="Filters">
      <LocalOnlyToggle on={filters.localOnly}
      onChange={(v) => setFilters((f) => ({ ...f, localOnly: v, page: 1 }))} />
      <OverflowFilterGroup label="Category"
      options={window.DEVICE_CATEGORIES}
      frequencies={categoryFreq}
      selected={filters.category}
      counts={catCounts}
      mode={filters.categoryMode}
      onModeChange={(m) => setFilters((f) => ({ ...f, categoryMode: m, page: 1 }))}
      onClear={() => setFilters((f) => ({ ...f, category: new Set(), page: 1 }))}
      onToggle={(id) => toggleSet("category", id)} />

      <OverflowFilterGroup label="Manufacturer"
      options={manufacturerOptions}
      frequencies={manufacturerFreq}
      selected={filters.manufacturer}
      counts={manuCounts}
      mode={filters.manufacturerMode}
      onModeChange={(m) => setFilters((f) => ({ ...f, manufacturerMode: m, page: 1 }))}
      onClear={() => setFilters((f) => ({ ...f, manufacturer: new Set(), page: 1 }))}
      onToggle={(id) => toggleSet("manufacturer", id)}
      useLetterGroups />
    </aside>);

};

/* Sticky bottom "Filters" bar, mobile/tablet only.
   Wrapped in a viewport-wide container so the bar's white bg + top border
   span edge-to-edge while the button itself stays inside the page container. */
const FiltersFab = ({ filters, onOpen }) => {
  const count = filters.category.size + filters.manufacturer.size + (filters.localOnly ? 1 : 0);
  return (
    <div className="filters-fab-wrap">
      <div className="container">
        <button type="button"
        className="filters-fab"
        onClick={onOpen}
        aria-label={count ? `Filters, ${count} active` : "Filters"}>
          <Icon name="filter" size={16} />
          <span>Filters{count > 0 && <span className="filters-fab-count">· {count}</span>}</span>
        </button>
      </div>
    </div>);

};

/* Bottom sheet, portals a panel to <body> that slides up from the bottom.
   Has two views: a root list of filter dimensions, and a per-dimension
   detail view (with search) reached by tapping a row. */
const FiltersBottomSheet = ({ onClose, filters, setFilters, clearAll, matchCount, initialSubView = null }) => {
  // null = root list; otherwise the dimension we're drilled into.
  const [subView, setSubView] = React.useState(initialSubView);
  // Search query, lifted up from SheetDimensionView so the input can live
  // in the sheet header. Reset whenever we leave a sub-view.
  const [searchQ, setSearchQ] = React.useState("");
  React.useEffect(() => {if (!subView) setSearchQ("");}, [subView]);

  // Drag-to-dismiss state.
  // The drag is engaged from anywhere on the panel, including over the
  // scrollable body. We only start the drag when the body is scrolled to
  // the top AND the user is pulling downward; otherwise we let native
  // scrolling handle the gesture.
  const panelRef = React.useRef(null);
  const dragState = React.useRef(null);
  const [dragY, setDragY] = React.useState(0);
  const [closing, setClosing] = React.useState(false);
  // Track header-pointer drag state for the transition logic below.
  const [headerDragging, setHeaderDragging] = React.useState(false);

  // Trigger the slide-out animation and call onClose once it finishes.
  // Used by the backdrop tap, the header X, the "Show N devices" CTA, and
  // the Escape key, matching the visual close from drag-to-dismiss.
  const closeAnimated = React.useCallback(() => {
    const h = panelRef.current?.offsetHeight ?? 600;
    setClosing(true);
    setDragY(h);
    setTimeout(onClose, 200);
  }, [onClose]);

  // --- Header pointer drag (mouse-friendly desktop fallback) ---
  const onHeaderPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    // Don't hijack clicks on interactive controls inside the header (close X,
    // back arrow). Pointer capture would otherwise swallow their click event.
    if (e.target.closest("button, a, input, select, textarea")) return;
    dragState.current = { src: "header", startY: e.clientY, lastY: e.clientY };
    setHeaderDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onHeaderPointerMove = (e) => {
    if (!dragState.current || dragState.current.src !== "header") return;
    const dy = Math.max(0, e.clientY - dragState.current.startY);
    dragState.current.lastY = e.clientY;
    setDragY(dy);
  };
  const onHeaderPointerUp = (e) => {
    if (!dragState.current || dragState.current.src !== "header") return;
    const dy = dragState.current.lastY - dragState.current.startY;
    dragState.current = null;
    setHeaderDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const h = panelRef.current?.offsetHeight ?? 600;
    if (dy > Math.min(120, h * 0.25)) {
      setClosing(true);
      setDragY(h);
      setTimeout(onClose, 200);
    } else {
      setDragY(0);
    }
  };

  // --- Panel-wide touch drag (works over the scrollable body too) ---
  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const scrollable = () => panel.querySelector(".sheet-body");

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      dragState.current = {
        src: "panel",
        intent: "pending",
        startY: e.touches[0].clientY,
        startScrollTop: scrollable()?.scrollTop ?? 0,
        lastDy: 0
      };
    };
    const onTouchMove = (e) => {
      const s = dragState.current;
      if (!s || s.src !== "panel") return;
      const dy = e.touches[0].clientY - s.startY;

      // Decide whether the gesture is a drag-to-dismiss or a native scroll.
      if (s.intent === "pending") {
        if (Math.abs(dy) < 5) return;
        const atTop = (scrollable()?.scrollTop ?? 0) <= 0;
        s.intent = dy > 0 && atTop && s.startScrollTop === 0 ? "drag" : "scroll";
      }

      if (s.intent === "drag") {
        // preventDefault requires a non-passive listener, that's why this
        // hook attaches native listeners instead of using React's onTouch*.
        e.preventDefault();
        s.lastDy = Math.max(0, dy);
        setDragY(s.lastDy);
      }
    };
    const onTouchEnd = () => {
      const s = dragState.current;
      if (!s || s.src !== "panel") return;
      if (s.intent === "drag") {
        const h = panelRef.current?.offsetHeight ?? 600;
        if (s.lastDy > Math.min(120, h * 0.25)) {
          setClosing(true);
          setDragY(h);
          setTimeout(onClose, 200);
        } else {
          setDragY(0);
        }
      }
      dragState.current = null;
    };

    panel.addEventListener("touchstart", onTouchStart, { passive: true });
    panel.addEventListener("touchmove", onTouchMove, { passive: false });
    panel.addEventListener("touchend", onTouchEnd);
    panel.addEventListener("touchcancel", onTouchEnd);
    return () => {
      panel.removeEventListener("touchstart", onTouchStart);
      panel.removeEventListener("touchmove", onTouchMove);
      panel.removeEventListener("touchend", onTouchEnd);
      panel.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [onClose]);

  React.useEffect(() => {
    document.body.classList.add("modal-open");
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (subView) setSubView(null);else
      closeAnimated();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [closeAnimated, subView]);

  const activeCount = filters.category.size + filters.manufacturer.size + (filters.localOnly ? 1 : 0);

  // ----- Data shared by both views -----
  const manufacturerOptions = React.useMemo(() => {
    const names = [...new Set(window.DEVICES.map((d) => d.manufacturer))];
    names.sort((a, b) => a.localeCompare(b));
    return names.map((n) => ({ id: n, label: n }));
  }, []);

  const DIMENSIONS = [
  {
    id: "category",
    label: "Category",
    options: window.DEVICE_CATEGORIES,
    searchable: true,
    letterGroups: false
  },
  {
    id: "manufacturer",
    label: "Manufacturer",
    options: manufacturerOptions,
    searchable: true,
    letterGroups: true
  }];


  const counts = {
    category: facetCounts(window.DEVICES, filters, "category", window.DEVICE_CATEGORIES.map((c) => c.id)),
    manufacturer: facetCounts(window.DEVICES, filters, "manufacturer", manufacturerOptions.map((m) => m.id))
  };

  const toggleSet = (dim, id) => setFilters((f) => {
    const next = new Set(f[dim]);
    if (next.has(id)) next.delete(id);else next.add(id);
    return { ...f, [dim]: next, page: 1 };
  });

  const currentDim = subView ? DIMENSIONS.find((d) => d.id === subView) : null;

  // ----- Render -----
  return ReactDOM.createPortal(
    <div className={"sheet-backdrop" + (closing ? " is-closing" : "")}
    onClick={closeAnimated} role="presentation">
      <div className="sheet-panel"
      ref={panelRef}
      role="dialog" aria-modal="true" aria-label="Filters"
      onClick={(e) => e.stopPropagation()}
      style={{
        transform: dragY ? `translateY(${dragY}px)` : undefined,
        transition: closing ?
        "transform 200ms cubic-bezier(.2,.0,.2,1)" :
        headerDragging || dragState.current?.src === "panel" ?
        "none" :
        "transform 200ms cubic-bezier(.2,.0,.2,1)"
      }}>
        <header className="sheet-head"
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        onPointerCancel={onHeaderPointerUp}
        style={{ touchAction: "none", cursor: "grab" }}>
          <div className="sheet-head-row">
          {subView ?
            <button type="button"
            className="sheet-back"
            onClick={() => setSubView(null)}
            aria-label="Back to filters">
              <Icon name="arrowL" size={18} />
            </button> :

            <button type="button"
            className="sheet-back"
            onClick={closeAnimated}
            aria-label="Close filters">
              <Icon name="x" size={18} />
            </button>
            }
          <h2 className="sheet-title">
            {currentDim ? currentDim.label : "Filters"}
          </h2>
          {subView && currentDim &&
            <div className="filter-mode sheet-head-mode" role="group"
            aria-label={`${currentDim.label} filter mode`}
            onPointerDown={(e) => e.stopPropagation()}>
              <button type="button"
              className={"filter-mode-btn" + ((filters[subView + "Mode"] || "include") === "include" ? " is-active" : "")}
              onClick={() => setFilters((f) => ({ ...f, [subView + "Mode"]: "include", page: 1 }))}
              aria-pressed={(filters[subView + "Mode"] || "include") === "include"}
              data-label="is"><span>is</span></button>
              <button type="button"
              className={"filter-mode-btn" + ((filters[subView + "Mode"] || "include") === "exclude" ? " is-active" : "")}
              onClick={() => setFilters((f) => ({ ...f, [subView + "Mode"]: "exclude", page: 1 }))}
              aria-pressed={(filters[subView + "Mode"] || "include") === "exclude"}
              data-label="is not"><span>is not</span></button>
            </div>
            }
          {!subView && activeCount > 0 &&
            <button className="clear" onClick={clearAll}>Clear all</button>
            }
          </div>
          {subView && currentDim?.searchable &&
          <div className="sheet-head-search"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
          style={{ cursor: "auto" }}>
              <div className="modal-search-input">
                <Icon name="search" size={18} />
                <input type="search"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder={`Search ${currentDim.label.toLowerCase()}`}
              aria-label={`Search ${currentDim.label.toLowerCase()}`} />
                {searchQ &&
              <button onClick={() => setSearchQ("")}
              className="modal-search-clear"
              aria-label="Clear">
                    Clear
                  </button>
              }
              </div>
            </div>
          }
        </header>

        {subView ?
        <SheetDimensionView dim={currentDim}
        q={searchQ}
        selected={filters[subView]}
        counts={counts[subView]}
        onToggle={(id) => toggleSet(subView, id)} /> :
        <SheetRootView dimensions={DIMENSIONS}
        filters={filters}
        onLocalToggle={(v) => setFilters((f) => ({ ...f, localOnly: v, page: 1 }))}
        onPick={setSubView} />}

        <footer className="sheet-foot">
          {subView ?
          <>
              {filters[subView].size > 0 ?
            <button type="button"
            className="modal-foot-clear"
            onClick={() => setFilters((f) => ({ ...f, [subView]: new Set(), page: 1 }))}>
                  Clear {filters[subView].size} selected
                </button> :

            <span className="modal-foot-meta">No {currentDim?.label.toLowerCase()} selected</span>
            }
              <button className="btn btn-primary sheet-cta sheet-cta-inline"
            onClick={() => setSubView(null)}>
                Save
              </button>
            </> :

          <button className="btn btn-primary sheet-cta" onClick={closeAnimated}>
              Show {matchCount.toLocaleString()} {matchCount === 1 ? "device" : "devices"}
            </button>
          }
        </footer>
      </div>
    </div>,
    document.body);
};

/* Root view, list of dimension rows, with a top-level Local-only toggle
   row above them. The toggle row sits at the top because it's a single
   binary decision and the most likely first interaction. Tapping anywhere
   on the row flips the switch, large hit area for a small target. */
const SheetRootView = ({ dimensions, filters, onLocalToggle, onPick }) =>
<div className="sheet-body sheet-list">
    <label className="sheet-row sheet-row-toggle">
      <span className="sheet-row-main">
        <span className="sheet-row-label">Local control only</span>
        <span className="sheet-row-value">Hide devices that need internet</span>
      </span>
      <span className={"switch" + (filters.localOnly ? " is-on" : "")}>
        <input type="checkbox"
      checked={filters.localOnly}
      onChange={(e) => onLocalToggle(e.target.checked)}
      aria-label="Local control only" />
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb"></span>
        </span>
      </span>
    </label>
    {dimensions.map((dim) => {
    const sel = filters[dim.id];
    const count = sel.size;
    const mode = filters[dim.id + "Mode"] || "include";
    const not = mode === "exclude";
    const summary = count === 0 ?
    null :
    count <= 2 ?
    (not ? "Not " : "") + [...sel].map((id) => {
      const label = dim.options.find((o) => o.id === id)?.label || id;
      // Category labels read as common nouns when negated, drop
      // the capital. Manufacturer names are proper nouns, keep
      // them as-is.
      return not && dim.id === "category" ?
      label.charAt(0).toLowerCase() + label.slice(1) :
      label;
    }).join(", ") :
    `${not ? "Not " : ""}${count} selected`;
    return (
      <button key={dim.id}
      type="button"
      className="sheet-row"
      onClick={() => onPick(dim.id)}>
          <span className="sheet-row-main">
            <span className="sheet-row-label">{dim.label}</span>
            {summary && <span className="sheet-row-value">{summary}</span>}
          </span>
          <Icon name="arrow" size={16} />
        </button>);

  })}
  </div>;


/* Dimension detail view, full options list, letter-grouped where
   applicable. Search input lives in the sheet header, so `q` is passed in. */
const SheetDimensionView = ({ dim, q, selected, counts, onToggle }) => {
  const term = (q || "").trim().toLowerCase();
  const matched = term ?
  dim.options.filter((o) => o.label.toLowerCase().includes(term)) :
  dim.options;

  const renderRow = (opt) => {
    const isSelected = selected.has(opt.id);
    return (
      <button key={opt.id}
      type="button"
      className={"filter-tap-row" + (isSelected ? " is-selected" : "")}
      onClick={() => onToggle(opt.id)}
      aria-pressed={isSelected}>
        {isSelected && <Icon name="check" size={18} className="filter-tap-row-check icon" />}
        <span className="filter-tap-row-text">{opt.label}</span>
        <span className="filter-tap-row-count">{counts[opt.id] ?? 0}</span>
      </button>);

  };

  return (
    <div className="sheet-body">
      {matched.length === 0 ?
      <div className="modal-empty">No matches for "{q}".</div> :
      dim.letterGroups ?
      groupOptionsByLetter(matched).map(([letter, opts]) =>
      <section key={letter} className="modal-group">
            <div className="modal-group-head">{letter}</div>
            <div className="modal-group-rows">{opts.map(renderRow)}</div>
          </section>
      ) :

      <div className="modal-group-rows">{matched.map(renderRow)}</div>
      }
    </div>);

};

const Browse = ({ route }) => {
  // Filter state lives in URL hash params; we mirror to local state for snappy updates.
  const initial = readFilters(route.params);
  // Browse grid view is a Stage 2 increment (independent of the others).
  // When it's off, force list view and hide the list/grid toggle.
  const gridOn = window.useIncrement ? window.useIncrement('grid-view') : false;
  const [filters, setFilters] = React.useState(initial);

  // Mobile/tablet only: bottom-sheet for filters, opened by the floating FAB.
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  // When opened via a summary chip we drill straight into a dimension.
  const [pendingSubView, setPendingSubView] = React.useState(null);
  const openFilters = (subView = null) => {
    setPendingSubView(subView);
    setFiltersOpen(true);
  };

  // When route changes externally (link from another page), reset.
  React.useEffect(() => {setFilters(readFilters(route.params)); /* eslint-disable-next-line */}, [route.params.toString()]);

  // Persist filter state back to URL whenever it changes.
  React.useEffect(() => {writeFilters(filters);}, [filters]);

  // Remember the browse URL (with active filters) so the device detail
  // page's back arrow can return here with the same filters applied.
  React.useEffect(() => {
    try {sessionStorage.setItem("browseReturn", window.location.hash);} catch (e) {}
  });

  const update = (patch) => setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));

  const toggleSet = (dim, id) => setFilters((f) => {
    const next = new Set(f[dim]);
    if (next.has(id)) next.delete(id);else next.add(id);
    return { ...f, [dim]: next, page: 1 };
  });

  const clearAll = () => setFilters({
    q: "", category: new Set(), manufacturer: new Set(),
    localOnly: false,
    categoryMode: "include", manufacturerMode: "include",
    page: 1, view: filters.view
  });

  const removeFilter = (dim, id) => {
    if (dim === "q") return update({ q: "" });
    if (dim === "localOnly") return update({ localOnly: false });
    setFilters((f) => {
      const next = new Set(f[dim]);
      next.delete(id);
      return { ...f, [dim]: next, page: 1 };
    });
  };

  const filtered = window.DEVICES.filter((d) => matches(d, filters));
  // Sort by name for predictable ordering
  filtered.sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageNum = Math.min(filters.page, totalPages);
  const pageStart = (pageNum - 1) * PAGE_SIZE;
  const pageDevices = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // The header search input holds the user's *typing* state via useGlobalQuery,
  // but the Browse page's filter.q is only updated when the user commits a
  // search (Enter / "See all results" / direct URL with ?q=...). So we only
  // pull q from the URL params, not from the typing state.
  React.useEffect(() => {
    const urlQ = route.params.get("q") || "";
    setFilters((f) => f.q === urlQ ? f : { ...f, q: urlQ, page: 1 });
    // The committed query is surfaced as a chip, NOT in the search bar, so
    // keep the global typing state empty while on Browse.
    if (window.__q) {
      window.__q = "";
      window.dispatchEvent(new CustomEvent("global-q-change", { detail: "" }));
    }
  }, [route.params.toString()]);

  return (
    <div data-screen-label="02 Browse">
      <div className="container browse-layout">
        {/* Unified top toolbar, left half sits over the filter sidebar
             (Filters title + Clear all), right half sits over the results
             (active chips, match count, view toggle). */}
        <div className="browse-toolbar">
          <div className="browse-toolbar-filters">
            <h3 className="browse-toolbar-title">Filters</h3>
            {filters.category.size + filters.manufacturer.size + (filters.localOnly ? 1 : 0) > 0 &&
            <button className="clear" onClick={clearAll}>Clear all</button>
            }
          </div>
          <div className="browse-toolbar-main">
            <div className="toolbar-chips">
              <ActiveFilterChips filters={filters}
              onRemove={removeFilter}
              setFilters={setFilters}
              onOpenSubView={(dim) => openFilters(dim)} />
            </div>
            <span className="count">
              <b style={{ color: "var(--fg)", fontVariantNumeric: "tabular-nums" }}>{filtered.length.toLocaleString()}</b>
              {" "}device{filtered.length === 1 ? "" : "s"} match
            </span>
            <span className="spacer"></span>
            <div className="view-toggle" role="group" aria-label="View mode" data-inc-target="grid-view">
              <button className={filters.view === "list" ? "active" : ""}
              onClick={() => update({ view: "list" })}>
                <Icon name="list" size={14} /> List
              </button>
              <button className={filters.view === "grid" ? "active" : ""}
              onClick={() => update({ view: "grid" })}>
                <Icon name="grid" size={14} /> Grid
              </button>
            </div>
          </div>
        </div>

        {/* Filters sidebar, desktop only; on tablet/mobile it lives in
             the bottom sheet below. */}
        <div className="filters-inline">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* Bottom sheet, only mounted when open. Renders the same
             FilterSidebar content. */}
        {filtersOpen &&
        <FiltersBottomSheet onClose={() => {setFiltersOpen(false);setPendingSubView(null);}}
        filters={filters}
        setFilters={setFilters}
        clearAll={clearAll}
        initialSubView={pendingSubView}
        matchCount={filtered.length} />
        }

        {/* Results */}
        <main>
          {pageDevices.length === 0 ?
          <div className="empty" style={{ marginTop: 32 }}>
              <h3>No devices match these filters.</h3>
              <p style={{ marginTop: 8, marginBottom: 16 }}>Try loosening a filter or clearing the search.</p>
              <button className="btn btn-secondary" onClick={clearAll}>Clear all filters</button>
            </div> :

          <>
              <div className={"results-grid " + ((!gridOn || filters.view === "list") ? "list" : "")}>
                {pageDevices.map((d) => <DeviceCard key={d.id} device={d} />)}
              </div>
              <Pagination page={pageNum}
            totalPages={totalPages}
            total={filtered.length}
            onChange={(n) => update({ page: n })} />
            </>
          }
        </main>
      </div>

      {/* Sticky "Filters" bar, mobile/tablet only. Sits outside the
           .container so the bar background spans the full viewport width;
           unsticks naturally once the user scrolls into the footer. */}
      <FiltersFab filters={filters} onOpen={() => openFilters(null)} />
    </div>);

};

window.Browse = Browse;
window.FilterSidebar = FilterSidebar;
window.facetCounts = facetCounts;
window.matches = matches;