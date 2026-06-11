/* Unified search experience.
   Used in:
     - the global header (compact)
     - the landing page hero (large)
   Both render the same input + suggestions dropdown. The dropdown has
   up to four sections (categories, devices, manufacturers, words), each
   with its own character threshold before it appears. */

const STOPWORDS = new Set([
  "the","and","for","with","via","not","but","only","can","may","over","this","that",
  "into","when","also","does","has","have","its","they","them","from","than","then",
  "use","used","uses","one","two","one","plus","gen","pro","ultra","mini","new",
  "are","was","were","will","you","your","any","all","each","both","such","other",
  "out","off","yes","required","optional","still","every","most","more","less",
  "between","across","without","under","like","just","very",
]);

/* Build a word-frequency map from the device dataset. Foundation-only:
   reads reported fields (device names, manufacturers, models, and category
   labels) and never the Stage 2 summary, so search stays self-contained and
   does not depend on a later stage's enrichment. */
const WORD_CORPUS = (() => {
  const counts = {};
  const bump = (text) => {
    for (const word of (text || "").toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) || []) {
      if (STOPWORDS.has(word)) continue;
      counts[word] = (counts[word] || 0) + 1;
    }
  };
  for (const d of window.DEVICES) {
    bump(d.name);
    bump(d.manufacturer);
    bump(d.model);
  }
  for (const c of window.DEVICE_CATEGORIES) bump(c.label);
  return counts;
})();

const SECTION_LABEL = {
  categories:    "Categories",
  devices:       "Devices",
  manufacturers: "Manufacturers",
  words:         "Suggestions",
  quick:         "Quick filters",
};

/* Pre-built filter combinations shown in the empty-state overlay (no query
   typed yet). Each recipe is a small object whose `filters` field maps 1:1
   to the Browse page's URL parameter dimensions, so clicking a row simply
   navigates to `#/browse?…` with those params pre-filled, no new filter
   code path. Recipes are intent-driven and grounded in real filterable
   dimensions; `breadcrumb` reads as a human-language summary of the URL
   that will get applied. */
const QUICK_FILTERS = [
  {
    id: "sensors-local",
    title: "Sensors with local connection",
    icon: "sensors",
    breadcrumb: "Sensors · Occupancy and motion · Local connection",
    filters: { category: ["sensors", "presence"], localOnly: true },
  },
  {
    id: "lighting-local",
    title: "Lighting with local connection",
    icon: "lighting",
    breadcrumb: "Lighting · Local connection",
    filters: { category: ["lighting"], localOnly: true },
  },
  {
    id: "cameras-local",
    title: "Cameras with local connection",
    icon: "cameras",
    breadcrumb: "Cameras and NVRs · Local connection",
    filters: { category: ["cameras"], localOnly: true },
  },
  {
    id: "switches-local",
    title: "Switches with local connection",
    icon: "controls",
    breadcrumb: "Buttons, switches and controls · Local connection",
    filters: { category: ["controls"], localOnly: true },
  },
  {
    id: "hubs",
    title: "Hubs and bridges",
    icon: "hubs",
    breadcrumb: "Hubs, routers and bridges",
    filters: { category: ["hubs"] },
  },
  {
    id: "energy",
    title: "Energy monitoring",
    icon: "power",
    breadcrumb: "Power and energy",
    filters: { category: ["power"] },
  },
];

/* Count devices that satisfy a recipe's filter object. Mirrors browse.jsx's
   `matches`/`requiresInternetVal` exactly so the displayed count is the
   number the user will actually land on in Browse. Inlined here because
   `window.matches` may not be defined yet at module load (script order). */
const countMatchingQuickFilter = (filters) => {
  const cats  = new Set(filters.category     || []);
  const manus = new Set(filters.manufacturer || []);
  const localOnly = !!filters.localOnly;
  let n = 0;
  for (const d of window.DEVICES) {
    if (cats.size  && !cats.has(d.category))      continue;
    if (manus.size && !manus.has(d.manufacturer)) continue;
    if (localOnly) {
      const requiresInternet = !(d.local === "always" && d.cloud !== "required");
      if (requiresInternet) continue;
    }
    n++;
  }
  return n;
};

/* Build suggestion sections from the current input.
   Returns null when there's nothing to show. */
const buildSuggestions = (q) => {
  const term = q.trim().toLowerCase();
  if (!term) return null;

  const out = {};

  // Categories, after 2 characters
  if (term.length >= 2) {
    out.categories = window.DEVICE_CATEGORIES
      .filter(c => c.label.toLowerCase().includes(term))
      .slice(0, 5);
  }

  // Devices, after 2 characters. Cap at 5, track total for "see more" row.
  if (term.length >= 2) {
    const allDevices = window.DEVICES.filter(d =>
      (d.name + " " + d.manufacturer + " " + d.model)
        .toLowerCase().includes(term)
    );
    out.devices = allDevices.slice(0, 5);
    out.deviceMore = allDevices.length > 5 ? allDevices.length : 0;
  }

  // Manufacturers, after 2 characters
  if (term.length >= 2) {
    const seen = new Set();
    const manus = [];
    for (const d of window.DEVICES) {
      if (seen.has(d.manufacturer)) continue;
      if (!d.manufacturer.toLowerCase().includes(term)) continue;
      seen.add(d.manufacturer);
      manus.push(d.manufacturer);
      if (manus.length >= 5) break;
    }
    out.manufacturers = manus;
  }

  // Word suggestions, after 1 character. Words that START with the term,
  // sorted by overall frequency in the dataset.
  if (term.length >= 1) {
    out.words = Object.entries(WORD_CORPUS)
      .filter(([w]) => w.startsWith(term) && w !== term)
      .sort((a, b) => b[1] - a[1])
      .map(([w]) => w)
      .slice(0, 5);
  }

  // Drop any empty sections.
  for (const key of Object.keys(out)) {
    if (!out[key] || out[key].length === 0) delete out[key];
  }

  return Object.keys(out).length === 0 ? null : out;
};

/* Highlight the matched portion of a label, case-insensitive. */
const Highlight = ({ text, term }) => {
  if (!term) return <>{text}</>;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>{text.slice(0, i)}<mark>{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}</>
  );
};

const SearchBox = ({ size = "header", autoFocus = false, placeholder }) => {
  const [q, setQ] = useGlobalQuery();
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  // The header-variant search renders a second input inside the fullscreen
  // overlay; keep a ref so we can focus it on mount and blur it on close.
  const fsInputRef = React.useRef(null);
  // The fullscreen dropdown is its own scroll container. We only show the
  // hairline divider under the search bar once the user has scrolled, at
  // scrollTop 0 the divider is hidden so the bar reads as connected to the
  // list below it; once content slides under the bar, the divider appears.
  const fsDropdownRef = React.useRef(null);
  const [fsScrolled, setFsScrolled] = React.useState(false);

  /* ---------- Fullscreen overlay (mobile + tablet, all variants) ----------
     On ≤1023px, focusing the search input opens a full-viewport overlay.
     The overlay snaps open/closed, no morph animation, no fade. This now
     applies to BOTH the header search (compact) and the landing hero search
     (large), so the landing page on mobile/tablet hands off to the same
     focused-search surface as every other page. */
  const fullscreenEnabled = true;
  const [fullscreen, setFullscreen] = React.useState(false);
  const pushedHistoryRef = React.useRef(false);

  const matchesFsBreakpoint = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches;

  const openFullscreen = () => {
    if (!fullscreenEnabled || fullscreen || !matchesFsBreakpoint()) return;
    setFullscreen(true);
    document.body.classList.add("search-fullscreen-open");
    document.body.classList.add("search-fullscreen-fab-hide");
    try {
      window.history.pushState({ __searchFs: true }, "");
      pushedHistoryRef.current = true;
    } catch (e) { /* noop */ }
  };

  const closeFullscreen = (opts = {}) => {
    if (!fullscreen) return;
    setFullscreen(false);
    setOpen(false);
    fsInputRef.current?.blur();
    document.body.classList.remove("search-fullscreen-open");
    document.body.classList.remove("search-fullscreen-fab-hide");
    if (!opts.fromPopState && pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      try { window.history.back(); } catch (e) { /* noop */ }
    } else {
      pushedHistoryRef.current = false;
    }
  };

  // Auto-focus the overlay input the moment it mounts.
  React.useEffect(() => {
    if (fullscreen) fsInputRef.current?.focus();
  }, [fullscreen]);

  // Browser back closes the overlay instead of leaving the page.
  React.useEffect(() => {
    if (!fullscreen) return;
    const onPop = () => {
      pushedHistoryRef.current = false;
      closeFullscreen({ fromPopState: true });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [fullscreen]);

  // If the viewport grows past the breakpoint mid-session, drop the overlay.
  React.useEffect(() => {
    if (!fullscreen) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => { if (e.matches) closeFullscreen(); };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [fullscreen]);

  const suggestions = React.useMemo(() => buildSuggestions(q), [q]);

  // When the input is empty, the dropdown switches into "quick filters" mode
  //, a curated set of pre-built intent-driven Browse queries. Live counts
  // are computed from the same predicate Browse uses, so the number a user
  // sees in the row is the number they'll land on.
  const isEmptyQuery = q.trim().length === 0;
  const quickFilters = React.useMemo(() => {
    if (!isEmptyQuery) return [];
    return QUICK_FILTERS.map((qf) => ({ ...qf, count: countMatchingQuickFilter(qf.filters) }));
  }, [isEmptyQuery]);

  // Flatten sections into a single list (for keyboard nav). Order is fixed:
  // categories → devices → manufacturers → words. In empty-query mode, the
  // list is a single "Quick filters" section.
  const { rows, selectable } = React.useMemo(() => {
    const rows = [];
    const selectable = [];
    if (isEmptyQuery) {
      if (quickFilters.length) {
        rows.push({ header: true, section: "quick" });
        for (const qf of quickFilters) {
          const item = { kind: "quick-filter", value: qf };
          rows.push(item);
          selectable.push(item);
        }
      }
      return { rows, selectable };
    }
    const push = (key, items, kind) => {
      if (!items || items.length === 0) return;
      rows.push({ header: true, section: key });
      for (const v of items) {
        const item = { kind, value: v };
        rows.push(item);
        selectable.push(item);
      }
    };
    if (suggestions) {
      push("categories",    suggestions.categories,    "category");
      push("devices",       suggestions.devices,       "device");
      // "See all N results for ..." row inside the Devices section.
      if (suggestions.devices && suggestions.devices.length && suggestions.deviceMore) {
        const item = { kind: "device-more", value: { count: suggestions.deviceMore, term: q.trim() } };
        rows.push(item);
        selectable.push(item);
      }
      push("manufacturers", suggestions.manufacturers, "manufacturer");
      push("words",         suggestions.words,         "word");
    }
    // Always offer an explicit text-search action when the query yields no
    // tappable suggestions, so a no-match query is still submittable from the
    // overlay and lands on Browse as a search chip, same as the home page.
    if (selectable.length === 0) {
      const item = { kind: "search-all", value: { term: q.trim() } };
      rows.push(item);
      selectable.push(item);
    }
    return { rows, selectable };
  }, [suggestions, isEmptyQuery, quickFilters]);

  // Auto-highlight an exact category/manufacturer match so pressing Enter
  // applies it as a filter chip rather than a free-text search. Makes it
  // clear which suggestion Enter will pick. No exact match -> nothing
  // highlighted, and Enter commits the typed text as a search chip.
  React.useEffect(() => {
    const t = q.trim().toLowerCase();
    if (!t) { setActiveIdx(-1); return; }
    const idx = selectable.findIndex((it) =>
      (it.kind === "category" && it.value.label.toLowerCase() === t) ||
      (it.kind === "manufacturer" && String(it.value).toLowerCase() === t)
    );
    setActiveIdx(idx);
  }, [q, selectable]);

  // Reset the scrolled-divider state when the query changes (the dropdown
  // may have shrunk to fewer rows, sitting at scrollTop 0 again) or when
  // the overlay opens/closes, so the next open starts clean.
  React.useEffect(() => { setFsScrolled(false); }, [q, fullscreen]);

  // Close on click outside, only when NOT in fullscreen mode (in fullscreen
  // the overlay covers the viewport, so taps below the dropdown shouldn't
  // dismiss the suggestions).
  React.useEffect(() => {
    if (!open || fullscreen) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, fullscreen]);

  // Navigate to a destination hash from within the search UI. When the
  // fullscreen overlay is open it pushed a history entry; we must NOT close
  // it with history.back() here, because that popstate fires asynchronously
  // AFTER the synchronous hash change and bounces the user back to the page
  // they searched from (the reported "tapping a result does nothing" bug).
  // Instead we replace the overlay's pushed entry with the destination, so a
  // single Back still returns to the originating page.
  const navigateFromSearch = (hash) => {
    setOpen(false);
    if (fullscreen && pushedHistoryRef.current) {
      setFullscreen(false);
      pushedHistoryRef.current = false;
      document.body.classList.remove("search-fullscreen-open");
      document.body.classList.remove("search-fullscreen-fab-hide");
      fsInputRef.current?.blur();
      try {
        window.history.replaceState(null, "", hash);
        window.dispatchEvent(new Event("hashchange"));
        return;
      } catch (e) { /* fall through to a plain navigation */ }
    }
    if (fullscreen) closeFullscreen();
    navigate(hash);
  };

  const goBrowse = (params) => {
    const qs = new URLSearchParams(params).toString();
    navigateFromSearch(`#/browse${qs ? "?" + qs : ""}`);
  };

  // Quick-filter recipes carry multi-value dimensions; build a URLSearchParams
  // with append() so e.g. `category=sensors&category=presence` round-trips
  // correctly through Browse's `params.getAll(...)` reads.
  const goBrowseWithFilters = (filters) => {
    const p = new URLSearchParams();
    for (const v of (filters.category     || [])) p.append("category",     v);
    for (const v of (filters.manufacturer || [])) p.append("manufacturer", v);
    if (filters.localOnly) p.set("local", "1");
    const qs = p.toString();
    navigateFromSearch(`#/browse${qs ? "?" + qs : ""}`);
  };

  const select = (item) => {
    if (!item) return;
    switch (item.kind) {
      case "category":
        setQ("");
        goBrowse({ category: item.value.id });
        break;
      case "device":
        setQ("");
        navigateFromSearch(`#/device/${item.value.id}`);
        break;
      case "device-more":
        // Keep the typed term as the search and jump to browse. Clear the
        // bar, the term lives in the chip strip on Browse.
        setQ("");
        goBrowse({ q: item.value.term });
        break;
      case "manufacturer":
        setQ("");
        goBrowse({ manufacturer: item.value });
        break;
      case "word":
        // Apply the suggested word as a committed text search on Browse.
        // It shows as a search chip, so clear the input rather than echo it.
        setQ("");
        goBrowse({ q: item.value });
        break;
      case "search-all":
        // Explicit "Search for ..." fallback row, commit the typed text.
        setQ("");
        goBrowse({ q: item.value.term });
        break;
      case "quick-filter":
        setQ("");
        goBrowseWithFilters(item.value.filters);
        break;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (activeIdx >= 0 && activeIdx < selectable.length) {
      select(selectable[activeIdx]);
      return;
    }
    const t = q.trim();
    if (!t) return;
    // Commit the typed query as a Browse-page text search. It surfaces as a
    // chip on Browse, so clear the input instead of leaving the term in it.
    setQ("");
    navigateFromSearch(`#/browse?q=${encodeURIComponent(t)}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIdx(i => Math.min(selectable.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(-1, i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      if (fullscreen) closeFullscreen();
    }
  };

  const onChange = (e) => {
    setQ(e.target.value);
    setOpen(true);
  };

  const showDropdown = open && (isEmptyQuery ? selectable.length > 0 : (q.trim().length > 0 && selectable.length > 0));
  const term = q.trim();

  // Dynamic max-height: keep the dropdown above the footer so users can
  // always see both. Measures the dropdown's top, the footer's top, and
  // sets max-height to fit between them with a small safety margin.
  const dropdownRef = React.useRef(null);
  const [dropdownMaxH, setDropdownMaxH] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!showDropdown || fullscreen) return;
    const compute = () => {
      const el = dropdownRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const footer = document.querySelector(".appfoot");
      const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight;
      const MARGIN = 0;
      const max = Math.max(160, footerTop - top - MARGIN);
      setDropdownMaxH(max);
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [showDropdown, rows.length, fullscreen]);

  // Map flat row index → selectable index for active styling
  let selIdx = -1;

  // Suggestion rows shared by both the inline dropdown and the fullscreen one.
  const dropdownRows = rows.map((row, i) => {
    if (row.header) {
      return <div key={"h-" + row.section} className="searchbox-section">{SECTION_LABEL[row.section]}</div>;
    }
    selIdx += 1;
    const localSel = selIdx;
    const isActive = localSel === activeIdx;

    let content;
    let key;
    if (row.kind === "category") {
      key = "c-" + row.value.id;
      content = <>
        <CategoryGlyph category={row.value.id} size={18} />
        <span className="searchbox-row-main"><Highlight text={row.value.label} term={term} /></span>
        <span className="searchbox-row-meta">Category</span>
      </>;
    } else if (row.kind === "device") {
      key = "d-" + row.value.id;
      content = <>
        <CategoryGlyph category={row.value.category} size={18} />
        <span className="searchbox-row-main"><Highlight text={row.value.name} term={term} /></span>
        <span className="searchbox-row-meta">{row.value.manufacturer}</span>
      </>;
    } else if (row.kind === "device-more") {
      key = "d-more";
      content = <>
        <Icon name="arrow" size={16} />
        <span className="searchbox-row-main searchbox-more-text">
          See all {row.value.count} results for “{row.value.term}”
        </span>
      </>;
    } else if (row.kind === "manufacturer") {
      key = "m-" + row.value;
      content = <>
        <Icon name="users" size={16} />
        <span className="searchbox-row-main"><Highlight text={row.value} term={term} /></span>
        <span className="searchbox-row-meta">Manufacturer</span>
      </>;
    } else if (row.kind === "quick-filter") {
      key = "q-" + row.value.id;
      content = <>
        <CategoryGlyph category={row.value.icon} size={18} />
        <span className="searchbox-row-main">{row.value.title}</span>
        <span className="searchbox-row-meta">{row.value.count} {row.value.count === 1 ? "device" : "devices"}</span>
      </>;
    } else if (row.kind === "search-all") {
      key = "search-all";
      content = <>
        <Icon name="search" size={16} />
        <span className="searchbox-row-main searchbox-more-text">Search for “{row.value.term}”</span>
      </>;
    } else {
      key = "w-" + row.value;
      content = <>
        <Icon name="search" size={16} />
        <span className="searchbox-row-main"><Highlight text={row.value} term={term} /></span>
      </>;
    }

    return (
      <button key={key}
              type="button"
              className={"searchbox-row " + (isActive ? "active" : "")}
              onMouseEnter={() => setActiveIdx(localSel)}
              onMouseDown={(e) => { e.preventDefault(); select(row); }}
              role="option"
              aria-selected={isActive}>
        {content}
      </button>
    );
  });

  // Helper: render the search form. Used twice, once in the in-flow appnav
  // search and once inside the fullscreen overlay. Both inputs are driven by
  // the same React state (`q`), so editing either updates both.
  const renderForm = (refInput, isFs) => (
    <form className="searchbox-input" onSubmit={onSubmit} role="search"
          onClick={(e) => {
            // Forward bare-form clicks (i.e. not on the input or Clear
            // button) to focus the input.
            if (e.target === e.currentTarget) refInput.current?.focus();
          }}>
      <Icon name="search" size={size === "hero" ? 22 : 18} />
      <input
        ref={refInput}
        autoFocus={isFs ? false : autoFocus}
        type="search"
        value={q}
        onChange={onChange}
        onFocus={() => { setOpen(true); if (!isFs) openFullscreen(); }}
        onKeyDown={onKeyDown}
        placeholder={placeholder || "Search"}
        aria-label="Search devices"
        aria-autocomplete="list"
        aria-expanded={showDropdown} />
      {q && (
        <button type="button"
                onClick={() => {
                  setQ("");
                  setOpen(false);
                  // If we're on Browse with a committed q in the URL, also
                  // clear the filter so results expand back out.
                  const h = window.location.hash;
                  if (h.startsWith("#/browse") && /[?&]q=/.test(h)) {
                    const params = new URLSearchParams(h.split("?")[1] || "");
                    params.delete("q");
                    const qs = params.toString();
                    navigate("#/browse" + (qs ? "?" + qs : ""));
                  }
                  refInput.current?.focus();
                }}
                className="appnav-search-clear"
                aria-label="Clear search">
          Clear
        </button>
      )}
    </form>
  );

  return (
    <>
      {/* Original, always-in-flow search. Stays in its place in the appnav
          grid the entire time, even while the fullscreen overlay is open -
          so the page below never reflows. */}
      <div className={"searchbox searchbox-" + size} ref={wrapRef}>
        {renderForm(inputRef, false)}

        {showDropdown && !fullscreen && (
          <div className="searchbox-dropdown" role="listbox"
               ref={dropdownRef}
               style={dropdownMaxH ? { maxHeight: dropdownMaxH + "px" } : undefined}>
            {dropdownRows}
          </div>
        )}
      </div>

      {/* Fullscreen overlay (mobile + tablet). Position-fixed sibling of the
          original, it's not inside the appnav grid, so the grid never
          loses or gains an item when this mounts/unmounts. */}
      {fullscreen && (
        <div className="searchbox-fs">
          <div className="searchbox-fs-bg" aria-hidden="true"></div>
          <button type="button"
                  className="searchbox-fs-back"
                  onMouseDown={(e) => { e.preventDefault(); closeFullscreen(); }}
                  aria-label="Close search">
            <Icon name="arrowL" size={20} />
          </button>
          {renderForm(fsInputRef, true)}
          {showDropdown && (
            <div className={"searchbox-dropdown" + (fsScrolled ? " is-scrolled" : "")}
                 role="listbox"
                 ref={fsDropdownRef}
                 onScroll={(e) => {
                   const next = e.currentTarget.scrollTop > 0;
                   if (next !== fsScrolled) setFsScrolled(next);
                 }}>
              {dropdownRows}
            </div>
          )}
        </div>
      )}
    </>
  );
};

window.SearchBox = SearchBox;
