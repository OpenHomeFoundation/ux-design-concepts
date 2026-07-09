/* =========================================================================
   Contributor Wiki — shared site shell.

   One chrome for the whole hidden documentation site: the Contributor Wiki
   home page and every "… - plan.html" subpage load this file and get the
   same frame:

     · a quiet top bar that carries only the wordmark (links home),
     · a left page-navigation rail (Home, then the roadmap tree of stages
       and increments, then other plans, then a link out to the live Canvas),
     · a right "On this page" rail built from the page's own sections, and
     · a mobile drawer for the left rail.

   The page tree mirrors the EXPERIMENTS registry in shared.jsx and the
   INCREMENTS list in canvas.html — keep them in sync when a stage or
   increment is added. All shell styles are injected here so the frame is
   identical whether a doc links plan.css, links wiki.css, or inlines its own.
   ========================================================================= */
(function () {
  if (window.__siteNavLoaded) return;
  window.__siteNavLoaded = true;

  var HOME   = "Contributor%20Wiki.html";
  var CANVAS = "canvas.html";

  // Page tree. Stage `children` are the increments that build on the stage.
  var STAGES = [
    { num: "01", label: "Foundation", href: "Foundation%20-%20plan.html", flag: "Base" },
    {
      num: "02", label: "Richer device pages", href: "Richer%20device%20pages%20-%20plan.html",
      children: [
        { label: "Browse grid view", href: "Browse%20grid%20view%20-%20plan.html" },
        { label: "Photos and gallery", href: "Photos%20and%20gallery%20-%20plan.html" },
        { label: "Connects with", href: "Connects%20with%20-%20plan.html" }
      ]
    },
    {
      num: "03", label: "Accounts and editing", href: "Accounts%20and%20editing%20-%20plan.html",
      children: [
        { label: "Contributor profiles and directory", href: "Contributor%20profiles%20and%20directory%20-%20plan.html" },
        { label: "Notifications", href: "Notifications%20-%20plan.html" },
        { label: "Your edits", href: "Your%20edits%20-%20plan.html" },
        { label: "Appearance", href: "Appearance%20-%20plan.html", flag: "Planned" },
        { label: "Trusted reference sources", href: "Trusted%20reference%20sources%20-%20plan.html", flag: "Planned" }
      ]
    },
    { num: "04", label: "Variants and families", href: "Device%20variants%20and%20families%20-%20plan.html", flag: "Planned" },
    { num: "05", label: "Goal-based discovery", href: "Quick-filter%20recipes%20-%20plan.html", flag: "Planned" }
  ];

  var OTHERS = [
    { label: "Pricing", href: "Pricing%20-%20plan.html" }
  ];

  /* ---- Current-page detection -------------------------------------- */
  function basename(path) {
    try { path = decodeURIComponent(path); } catch (e) {}
    var clean = path.split("?")[0].split("#")[0];
    var parts = clean.split("/");
    return (parts[parts.length - 1] || "").toLowerCase();
  }
  var here = basename(location.pathname);
  if (here === "") here = basename(HOME); // directory root → treat as home
  function isHere(href) { return basename(href) === here; }
  var isHome = isHere(HOME);

  /* ---- Styles ------------------------------------------------------- */
  var TOPH = 64; // top bar height
  var css = [
    /* page canvas */
    "html{scroll-behavior:smooth;}",
    "body{margin:0;background:var(--surface-sunken);}",
    "@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto;}}",

    /* top bar — wordmark only */
    ".site-top{position:sticky;top:0;z-index:60;display:flex;align-items:center;gap:var(--space-3);height:" + TOPH + "px;padding:0 var(--space-6);background:var(--surface);border-bottom:1px solid var(--border);}",
    ".site-mark{display:inline-flex;align-items:baseline;gap:10px;text-decoration:none;color:var(--fg);font-family:var(--font-display);font-weight:600;font-size:var(--fs-20);letter-spacing:var(--ls-tight);white-space:nowrap;}",
    ".site-mark .sub{font-family:var(--font-sans);font-size:var(--fs-12);font-weight:600;letter-spacing:var(--ls-caps);text-transform:uppercase;color:var(--fg-muted);}",
    ".site-burger{display:none;width:38px;height:38px;margin-left:calc(var(--space-2) * -1);border:0;background:transparent;border-radius:var(--radius-2);cursor:pointer;align-items:center;justify-content:center;color:var(--fg);}",
    ".site-burger:hover{background:var(--surface-tint-soft);}",
    ".site-burger span,.site-burger span::before,.site-burger span::after{content:'';display:block;width:18px;height:1.6px;background:currentColor;border-radius:2px;position:relative;}",
    ".site-burger span::before{position:absolute;top:-5px;}",
    ".site-burger span::after{position:absolute;top:5px;}",

    /* shell grid */
    ".site-shell{display:grid;grid-template-columns:264px minmax(0,792px) 216px;justify-content:center;gap:0 var(--space-8);max-width:1380px;margin:0 auto;padding:0 var(--space-6);align-items:start;}",
    "@media (max-width:1200px){.site-shell{grid-template-columns:264px minmax(0,792px);}}",
    "@media (max-width:900px){.site-shell{grid-template-columns:minmax(0,1fr);padding:0 var(--space-5);}}",

    /* left rail */
    ".site-sidebar{position:sticky;top:" + TOPH + "px;align-self:start;height:calc(100vh - " + TOPH + "px);overflow-y:auto;overflow-x:hidden;padding:var(--space-6) var(--space-5) var(--space-7) 0;border-right:1px solid var(--border);}",
    ".site-nav{display:flex;flex-direction:column;gap:2px;}",
    ".site-group{font-size:var(--fs-13);font-weight:var(--fw-semibold);color:var(--fg-muted);padding:var(--space-5) var(--space-3) var(--space-2);}",
    ".site-group:first-child{padding-top:0;}",
    ".site-row{display:flex;align-items:baseline;gap:var(--space-3);text-decoration:none;padding:7px var(--space-3);border-radius:var(--radius-2);border-left:2px solid transparent;color:var(--fg);line-height:var(--lh-snug);}",
    ".site-row:hover{background:var(--surface-tint-soft);color:var(--fg);}",
    ".site-row .num{font-family:var(--font-mono);font-size:var(--fs-13);color:var(--fg-subtle);min-width:18px;}",
    ".site-row .lbl{font-size:var(--fs-14);flex:1;text-transform:none;letter-spacing:normal;font-weight:var(--fw-regular);color:var(--fg);}",
    ".site-row .site-flag{font-family:var(--font-mono);font-size:var(--fs-12);color:var(--fg-subtle);align-self:center;}",
    ".site-row[aria-current='page']{background:var(--accent-soft);border-left-color:var(--accent);}",
    ".site-row[aria-current='page'] .num{color:var(--accent-hover);}",
    ".site-row[aria-current='page'] .lbl{font-weight:var(--fw-semibold);}",
    ".site-row--home .lbl{font-family:var(--font-display);font-weight:600;font-size:var(--fs-16);}",
    ".site-kids{display:flex;flex-direction:column;gap:2px;margin:2px 0 var(--space-2) calc(18px + var(--space-3));border-left:1px solid var(--border);}",
    ".site-kids .site-row{padding-left:var(--space-4);margin-left:-1px;}",
    ".site-kids .site-row .lbl{font-size:var(--fs-13);color:var(--fg-muted);}",
    ".site-kids .site-row:hover .lbl,.site-kids .site-row[aria-current='page'] .lbl{color:var(--fg);}",
    ".site-navfoot{margin-top:var(--space-6);padding-top:var(--space-5);border-top:1px solid var(--border);}",
    ".site-canvas{display:flex;align-items:center;gap:var(--space-3);text-decoration:none;padding:var(--space-3) var(--space-3) var(--space-3) var(--space-4);border-radius:var(--radius-2);color:var(--fg);background:var(--surface-tint-soft);border:1px solid var(--border);}",
    ".site-canvas:hover{background:var(--surface-tint-mid);}",
    ".site-canvas .glyph{font-family:var(--font-mono);font-size:var(--fs-16);color:var(--accent);}",
    ".site-canvas .t{flex:1;}",
    ".site-canvas .t b{display:block;font-size:var(--fs-13);font-weight:var(--fw-semibold);}",
    ".site-canvas .t span{font-size:var(--fs-12);color:var(--fg-muted);}",
    ".site-canvas .arr{font-family:var(--font-mono);font-size:var(--fs-13);color:var(--fg-subtle);}",

    /* main column — neutralize each doc's own page framing */
    ".site-shell > .doc{max-width:none;width:auto;margin:0;padding:var(--space-9) 0 var(--space-11);min-width:0;}",
    ".site-shell > .doc section{scroll-margin-top:" + (TOPH + 20) + "px;}",
    ".site-shell > .doc .wrap,.site-shell > .doc .wrap-narrow{max-width:none;width:auto;margin:0;padding:0;}",

    /* right rail — on this page */
    ".site-toc{position:sticky;top:" + TOPH + "px;align-self:start;max-height:calc(100vh - " + TOPH + "px);overflow-y:auto;padding:var(--space-9) 0;}",
    ".site-toc__label{font-size:var(--fs-13);font-weight:var(--fw-semibold);color:var(--fg-muted);padding:0 var(--space-3) var(--space-3);}",
    ".site-toc__list{display:flex;flex-direction:column;border-left:1px solid var(--border);}",
    ".site-toc__link{display:block;padding:6px var(--space-4);margin-left:-1px;border-left:2px solid transparent;color:var(--fg-muted);text-decoration:none;font-size:var(--fs-13);line-height:var(--lh-snug);}",
    ".site-toc__link:hover{color:var(--fg);}",
    ".site-toc__link.active{color:var(--fg);border-left-color:var(--accent);font-weight:var(--fw-medium);}",
    "@media (max-width:1200px){.site-toc{display:none;}}",

    /* hide the repeating per-plan header boilerplate (eyebrow + ref line) */
    ".doc-head > .eyebrow-row,.doc-head > .ref{display:none;}",
    ".doc-head{margin-bottom:var(--space-7);}",

    /* mobile drawer */
    ".site-scrim{position:fixed;inset:0;background:rgba(20,19,17,0.38);opacity:0;pointer-events:none;transition:opacity var(--transition-fast);z-index:55;}",
    "@media (max-width:900px){",
      ".site-burger{display:inline-flex;}",
      ".site-sidebar{position:fixed;top:0;left:0;height:100vh;width:300px;max-width:86vw;z-index:70;background:var(--surface);border-right:1px solid var(--border);padding:var(--space-6) var(--space-5);transform:translateX(-104%);transition:transform var(--transition);box-shadow:var(--shadow-2);}",
      "body.site-drawer-open .site-sidebar{transform:none;}",
      "body.site-drawer-open .site-scrim{opacity:1;pointer-events:auto;}",
    "}",
    "@media (max-width:900px) and (prefers-reduced-motion:reduce){.site-sidebar{transition:none;}}"
  ].join("\n");
  var styleEl = document.createElement("style");
  styleEl.id = "site-nav-styles";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---- Markup helpers ---------------------------------------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function row(item, opts) {
    opts = opts || {};
    var a = el("a", "site-row" + (opts.home ? " site-row--home" : ""));
    a.href = item.href;
    if (isHere(item.href)) a.setAttribute("aria-current", "page");
    if (opts.num) a.appendChild(el("span", "num", opts.num));
    a.appendChild(el("span", "lbl", item.label));
    if (item.flag) a.appendChild(el("span", "site-flag", item.flag));
    return a;
  }

  /* ---- Top bar ------------------------------------------------------ */
  var top = el("header", "site-top");
  var burger = el("button", "site-burger");
  burger.type = "button";
  burger.setAttribute("aria-label", "Open navigation");
  burger.setAttribute("aria-expanded", "false");
  burger.innerHTML = "<span></span>";
  top.appendChild(burger);
  var mark = el("a", "site-mark");
  mark.href = HOME;
  mark.innerHTML = 'Device Database';
  top.appendChild(mark);

  /* ---- Left rail ---------------------------------------------------- */
  var sidebar = el("aside", "site-sidebar");
  sidebar.setAttribute("aria-label", "Wiki pages");
  var nav = el("nav", "site-nav");

  nav.appendChild(row({ label: "Wiki", href: HOME }, { home: true }));

  nav.appendChild(el("div", "site-group", "Roadmap"));
  STAGES.forEach(function (s) {
    nav.appendChild(row(s, { num: s.num }));
    if (s.children && s.children.length) {
      var kids = el("div", "site-kids");
      s.children.forEach(function (c) { kids.appendChild(row(c, {})); });
      nav.appendChild(kids);
    }
  });

  if (OTHERS.length) {
    nav.appendChild(el("div", "site-group", "Other plans"));
    OTHERS.forEach(function (o) { nav.appendChild(row(o, {})); });
  }

  var foot = el("div", "site-navfoot");
  var canvas = el("a", "site-canvas");
  canvas.href = CANVAS;
  canvas.innerHTML =
    '<span class="glyph" aria-hidden="true">&#9633;</span>' +
    '<span class="t"><b>Live preview</b><span>The roadmap Canvas</span></span>' +
    '<span class="arr" aria-hidden="true">&#8599;</span>';
  foot.appendChild(canvas);
  nav.appendChild(foot);
  sidebar.appendChild(nav);

  /* ---- Right rail: on-page anchors --------------------------------- */
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  var main = document.querySelector("main.doc");
  var tocLinks = [];
  var toc = el("aside", "site-toc");
  toc.setAttribute("aria-label", "On this page");
  if (main) {
    var list = el("nav", "site-toc__list");
    var secs = main.querySelectorAll("section");
    secs.forEach(function (sec, idx) {
      var label = sec.getAttribute("data-toc") || "";
      if (!label) {
        var kicker = sec.querySelector(".sec-kicker");
        if (kicker) label = kicker.textContent.split("·")[0].trim();
      }
      if (!label) {
        var h2 = sec.querySelector("h2");
        if (h2) label = h2.textContent.trim();
      }
      if (!label) return; // skip headless sections (e.g. thesis card)
      if (!sec.id) sec.id = "sec-" + slug(label) + "-" + idx;
      var a = el("a", "site-toc__link", label);
      a.href = "#" + sec.id;
      list.appendChild(a);
      tocLinks.push({ a: a, sec: sec });
    });
    if (tocLinks.length) {
      toc.appendChild(el("div", "site-toc__label", "On this page"));
      toc.appendChild(list);
    }
  }

  /* ---- Assemble the shell ------------------------------------------ */
  document.body.insertBefore(top, document.body.firstChild);
  if (main) {
    var shell = el("div", "site-shell");
    main.parentNode.insertBefore(shell, main);
    shell.appendChild(sidebar);
    shell.appendChild(main);
    if (tocLinks.length) shell.appendChild(toc);
  } else {
    document.body.insertBefore(sidebar, top.nextSibling);
  }
  var scrim = el("div", "site-scrim");
  document.body.appendChild(scrim);

  /* ---- Scroll-spy for the TOC -------------------------------------- */
  if (tocLinks.length) {
    var spy = function () {
      var cur = 0;
      for (var i = 0; i < tocLinks.length; i++) {
        if (tocLinks[i].sec.getBoundingClientRect().top - (TOPH + 32) <= 0) cur = i; else break;
      }
      tocLinks.forEach(function (t, i) { t.a.classList.toggle("active", i === cur); });
    };
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy, { passive: true });
    spy();
  }

  /* ---- Mobile drawer ------------------------------------------------ */
  function openDrawer() { document.body.classList.add("site-drawer-open"); burger.setAttribute("aria-expanded", "true"); }
  function closeDrawer() { document.body.classList.remove("site-drawer-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    if (document.body.classList.contains("site-drawer-open")) closeDrawer(); else openDrawer();
  });
  scrim.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
  sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) closeDrawer(); });
})();
