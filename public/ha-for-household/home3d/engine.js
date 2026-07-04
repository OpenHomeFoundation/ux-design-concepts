// Three.js engine for the 3D home view. Renders the soft abstract home from
// home-geometry.js, drives sun / time-of-day lighting, orbit + touch camera,
// the two views (whole home, focused floor) and the DOM label overlay.
//
// Usage:
//   const engine = await createEngine({ container, geometry, theme, ... });
//   engine.setTime(h); engine.setLatitude(lat); engine.setTheme(t);
//   engine.updateState(state); engine.focusFloor(id); engine.backHome();

let THREE = null;

const EASE = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// Warm-tinted palettes, dark and light, aligned with the design tokens.
const PALETTES = {
  dark: {
    plate: 0x232327, plateSide: 0x1c1c1f, grass: 0x33493a, paving: 0x2d2d33,
    path: 0x35353c, hedge: 0x2e3d2c, treeTrunk: 0x4a4038, treeLeaf: 0x3a4d34,
    body: 0xc9c6bd, bodyMuted: 0x92908a, roof: 0xa5a29a, slab: 0xaeaba3,
    floorPlate: 0xbcb9b1, wallTop: 0xd4d1c8, wall: 0xc9c6bd, room: 0xaba79d,
    edge: 0x6e6c64, neighbor: 0x303036, contact: 0x000000,
    skyDay: [0x39424e, 0x232329], skyDawn: [0x4a3a37, 0x232326], skyNight: [0x15161c, 0x101014],
    hemiSky: 0x8590a3, hemiGround: 0x2e2a26,
    glowWarm: 0xffb45c, glowHeat: 0xff9d4d, glowCool: 0x59a8ff,
    labelBg: "rgba(34,34,38,0.92)", labelText: "#ececf1", labelSub: "#a8a8b4",
  },
  light: {
    plate: 0xe9e5dc, plateSide: 0xd9d4c9, grass: 0xafc79b, paving: 0xd7d2c7,
    path: 0xe0dcd3, hedge: 0x9db386, treeTrunk: 0x8a7660, treeLeaf: 0x84a06b,
    body: 0xffffff, bodyMuted: 0xeceade, roof: 0xdedacf, slab: 0xe4e0d6,
    floorPlate: 0xfbfaf5, wallTop: 0xffffff, wall: 0xffffff, room: 0xf1efe8,
    edge: 0x8a857a, neighbor: 0xdcd8cf, contact: 0x3a3630,
    skyDay: [0xc6d5e0, 0xefece5], skyDawn: [0xe0b898, 0xece5da], skyNight: [0x2b3040, 0x3d4152],
    hemiSky: 0xcdd8e6, hemiGround: 0xb8ac98,
    glowWarm: 0xffa844, glowHeat: 0xff8f33, glowCool: 0x3d8fe8,
    labelBg: "rgba(250,249,246,0.94)", labelText: "#1d1c1a", labelSub: "#6f6a60",
  },
};

// Soft area tints for the zoomed-in room floors (muted, warm-leaning pastels).
const AREA_TINTS = {
  dark: {
    "living-room": 0x9db894, kitchen: 0xc4ae7e, hallway: 0xb3aea3,
    garage: 0xa0a6b0, "greet-room": 0x8fb3a8, "greet-ensuite": 0xa5bfb2,
    "main-bedroom": 0xc09fae, "tess-room": 0xb0a2c2, "lars-room": 0x93a9c6,
    bathroom: 0x8db4bc, utility: 0xa6a29a,
  },
  light: {
    "living-room": 0xbcd9b2, kitchen: 0xe8d29a, hallway: 0xd8d3c8,
    garage: 0xc4c8cf, "greet-room": 0xa9d2c8, "greet-ensuite": 0xc5e0d5,
    "main-bedroom": 0xe4bfcf, "tess-room": 0xd4c4e4, "lars-room": 0xafc8e8,
    bathroom: 0xa8d4dc, utility: 0xc8c5bd,
  },
};

function sunAngles(hours, latDeg, dayOfYear) {
  const decl = (-23.45 * Math.cos((2 * Math.PI * (dayOfYear + 10)) / 365) * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;
  const H = ((hours - 12) * 15 * Math.PI) / 180;
  const elev = Math.asin(Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(H));
  const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat));
  return { elev, az };
}
// World position for angles: south is -z (the street side), east is -x.
function sunVec(elev, az, R) {
  return [-R * Math.cos(elev) * Math.sin(az), R * Math.sin(elev), -R * Math.cos(elev) * Math.cos(az)];
}

function radialTexture(inner, outer) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  grad.addColorStop(0, inner); grad.addColorStop(1, outer);
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); return t;
}

export async function createEngine(opts) {
  THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  const G = opts.geometry;
  const container = opts.container;
  // Ambient (embedded) mode: no full-bleed sky. The horizon is a small soft
  // wash behind the home that fades out into the page background.
  const ambient = !!opts.ambient;
  // Camera zoom multiplier (>1 = closer). Set by the homepage embed on
  // narrow breakpoints.
  let zoomK = opts.zoom > 0 ? opts.zoom : 1;
  // Horizontal screen-space shift (fraction of width, positive moves the
  // scene right) so a host can center the home beside a content column.
  let shiftX = opts.shiftX || 0;
  const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  // ---- Renderer / scene --------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;";
  container.appendChild(renderer.domElement);

  const labelLayer = document.createElement("div");
  labelLayer.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2;";
  container.appendChild(labelLayer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.5, 400);

  // ---- Lights --------------------------------------------------------------
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -26; sun.shadow.camera.right = 26;
  sun.shadow.camera.top = 26; sun.shadow.camera.bottom = -26;
  sun.shadow.camera.near = 4; sun.shadow.camera.far = 110;
  sun.shadow.bias = -0.0015; sun.shadow.radius = 5;
  const sunTargetObj = new THREE.Object3D(); sunTargetObj.position.set(3, 0, 4);
  scene.add(sunTargetObj); sun.target = sunTargetObj;
  const fillAmbient = new THREE.AmbientLight(0xffffff, 0.12);
  scene.add(hemi, sun, fillAmbient);

  // ---- State --------------------------------------------------------------
  let theme = opts.theme === "light" ? "light" : "dark";
  let P = PALETTES[theme];
  let latitude = opts.latitude ?? 52.4;
  let timeHours = opts.timeHours ?? 13;
  const dayOfYear = (() => { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5); })();
  let homeState = opts.state || { areas: {} };
  const tintFor = (id) => (id && AREA_TINTS[theme][id]) || P.room;
  let view = "home";           // 'home' | 'floor'
  let selectedFloor = null;
  let hoverFloor = null;
  const disposables = [];
  const mat = (color, o) => { const m = new THREE.MeshLambertMaterial(Object.assign({ color }, o)); disposables.push(m); return m; };

  // ---- Geometry helpers ----------------------------------------------------
  function planShape(points) {
    const s = new THREE.Shape();
    points.forEach(([x, z], i) => (i ? s.lineTo(x, z) : s.moveTo(x, z)));
    s.closePath(); return s;
  }
  // Extrude a plan polygon to a volume occupying y 0..h
  function extrudePlan(points, h) {
    const geo = new THREE.ExtrudeGeometry(planShape(points), { depth: h, bevelEnabled: false });
    geo.rotateX(Math.PI / 2); geo.translate(0, h, 0);
    return geo;
  }
  function centroid(points) {
    let x = 0, z = 0; points.forEach((p) => { x += p[0]; z += p[1]; });
    return [x / points.length, z / points.length];
  }
  function bbox(points) {
    let x1 = 1e9, z1 = 1e9, x2 = -1e9, z2 = -1e9;
    points.forEach(([x, z]) => { x1 = Math.min(x1, x); z1 = Math.min(z1, z); x2 = Math.max(x2, x); z2 = Math.max(z2, z); });
    return { x1, z1, x2, z2, cx: (x1 + x2) / 2, cz: (z1 + z2) / 2, w: x2 - x1, d: z2 - z1 };
  }
  function pointInPoly(x, z, points) {    let ins = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, zi] = points[i], [xj, zj] = points[j];
      if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) ins = !ins;
    }
    return ins;
  }
  // Inset an axis-aligned outline inward by d (for flush wall rings).
  function insetOutline(points, d) {
    const n = points.length;
    // Shift each edge inward along its normal, then re-intersect neighbors.
    const shifted = [];
    for (let i = 0; i < n; i++) {
      const [ax, az] = points[i], [bx, bz] = points[(i + 1) % n];
      const dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz) || 1;
      let nx = -dz / len, nz = dx / len;
      if (!pointInPoly((ax + bx) / 2 + nx * 0.05, (az + bz) / 2 + nz * 0.05, points)) { nx = -nx; nz = -nz; }
      shifted.push({ ax: ax + nx * d, az: az + nz * d, bx: bx + nx * d, bz: bz + nz * d, vert: Math.abs(dx) < Math.abs(dz) });
    }
    const out = [];
    for (let i = 0; i < n; i++) {
      const prev = shifted[(i - 1 + n) % n], cur = shifted[i];
      // Axis-aligned: the vertical edge fixes x, the horizontal edge fixes z.
      out.push(prev.vert ? [prev.ax, cur.az] : [cur.ax, prev.az]);
    }
    return out;
  }
  function exteriorOverlap(ax, az, bx, bz, outline) {
    const out = [];
    for (let i = 0; i < outline.length; i++) {
      const [ox1, oz1] = outline[i], [ox2, oz2] = outline[(i + 1) % outline.length];
      if (Math.abs(ax - bx) < 0.01 && Math.abs(ox1 - ox2) < 0.01 && Math.abs(ax - ox1) < 0.09) {
        const lo = Math.max(Math.min(az, bz), Math.min(oz1, oz2));
        const hi = Math.min(Math.max(az, bz), Math.max(oz1, oz2));
        if (hi - lo > 0.4) out.push({ ax, az: lo, bx: ax, bz: hi });
      } else if (Math.abs(az - bz) < 0.01 && Math.abs(oz1 - oz2) < 0.01 && Math.abs(az - oz1) < 0.09) {
        const lo = Math.max(Math.min(ax, bx), Math.min(ox1, ox2));
        const hi = Math.min(Math.max(ax, bx), Math.max(ox1, ox2));
        if (hi - lo > 0.4) out.push({ ax: lo, az, bx: hi, bz: az });
      }
    }
    return out;
  }
  function edgeLines(geo, color, opacity) {
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 24),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    return e;
  }
  function wallBox(x1, z1, x2, z2, h, t, material, extend) {
    const len = Math.hypot(x2 - x1, z2 - z1) + (extend == null ? t : extend);
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, h, t), material);
    m.position.set((x1 + x2) / 2, h / 2, (z1 + z2) / 2);
    m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    m.castShadow = false; m.receiveShadow = true;
    return m;
  }
  function outlineSegments(points) {
    const segs = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i + 1) % points.length];
      segs.push([a[0], a[1], b[0], b[1]]);
    }
    return segs;
  }

  const glowTex = radialTexture("rgba(255,255,255,0.85)", "rgba(255,255,255,0)");
  // Wall wash: brightest at the base of the wall, fading upward, with soft
  // horizontal ends. Reads as ambient spill, not a spotlight circle.
  const wallGlowTex = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d");
    const v = g.createLinearGradient(0, 256, 0, 0);
    v.addColorStop(0, "rgba(255,255,255,0.9)");
    v.addColorStop(0.35, "rgba(255,255,255,0.5)");
    v.addColorStop(0.8, "rgba(255,255,255,0.08)");
    v.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = v; g.fillRect(0, 0, 256, 256);
    g.globalCompositeOperation = "destination-in";
    const hz = g.createLinearGradient(0, 0, 256, 0);
    hz.addColorStop(0, "rgba(255,255,255,0)");
    hz.addColorStop(0.18, "rgba(255,255,255,1)");
    hz.addColorStop(0.82, "rgba(255,255,255,1)");
    hz.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = hz; g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  })();
  function glowPlane(w, d, colorHex) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d),
      new THREE.MeshBasicMaterial({ map: glowTex, color: colorHex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.rotation.x = -Math.PI / 2; m.renderOrder = 5;
    return m;
  }

  // ---- Ground: no visible plate at all --------------------------------------
  // The ground IS the background wash. Only shadows (ShadowMaterial catcher),
  // the contact shadow and the light spills paint onto it, so there is no
  // edge to see, ever. The basement reads as translucent volume below grade.
  const world = new THREE.Group(); scene.add(world);
  const hasBasement = Object.values(G.floors).some((f) => f.belowGround);
  const BASEMENT_OP = 0.55;
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 });
  disposables.push(shadowMat);
  const shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), shadowMat);
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.set(3.2, 0.004, 4.5);
  shadowCatcher.receiveShadow = true;
  shadowCatcher.renderOrder = 3;
  world.add(shadowCatcher);
  const outdoorGlows = {};
  // Buildings (multi-building plans): every floor belongs to one.
  const buildingIds = [...new Set(Object.values(G.floors).map((f) => f.building || "main"))];
  const bldOf = (fid) => G.floors[fid].building || "main";
  // Scene bounds: all outlines and outdoor patches, for framing and shadows.
  const scenePts = [];
  Object.values(G.floors).forEach((f) => f.outline.forEach((p) => scenePts.push(p)));
  (G.outdoor || []).forEach((o) => (o.poly || []).forEach((p) => scenePts.push(p)));
  const sb = bbox(scenePts.length ? scenePts : [[0, 0], [8, 9]]);
  shadowCatcher.position.set(sb.cx, 0.004, sb.cz);
  sunTargetObj.position.set(sb.cx, 0, sb.cz);
  const shadowExt = Math.max(26, Math.max(sb.w, sb.d) * 1.1);
  sun.shadow.camera.left = -shadowExt; sun.shadow.camera.right = shadowExt;
  sun.shadow.camera.top = shadowExt; sun.shadow.camera.bottom = -shadowExt;
  // Soft contact shadow under each building
  const contacts = [];
  buildingIds.forEach((bid) => {
    const grade = Object.values(G.floors).filter((f) => (f.building || "main") === bid && !f.belowGround).sort((a, b) => a.slot - b.slot)[0];
    if (!grade) return;
    const gb = bbox(grade.outline);
    const contact = new THREE.Mesh(new THREE.PlaneGeometry(gb.w * 1.45, gb.d * 1.45),
      new THREE.MeshBasicMaterial({ map: glowTex, color: P.contact, transparent: true, opacity: theme === "dark" ? 0.18 : 0.09, depthWrite: false }));
    contact.rotation.x = -Math.PI / 2; contact.position.set(gb.cx, 0.008, gb.cz);
    world.add(contact); contacts.push(contact);
  });

  // ---- The home -------------------------------------------------------------
  // Rest base Y per floor (stacked by slot, basement below ground)
  const floorIds = Object.keys(G.floors).sort((a, b) => G.floors[a].slot - G.floors[b].slot);
  const restBase = {};
  const roofBaseYB = {};   // building id -> roof rest height
  buildingIds.forEach((bid) => {
    let y = 0;
    floorIds.forEach((fid) => {
      const f = G.floors[fid];
      if (bldOf(fid) !== bid) return;
      if (f.belowGround) { restBase[fid] = -f.height; }
      else { restBase[fid] = y; y += f.height; }
    });
    roofBaseYB[bid] = y;
  });

  const home = new THREE.Group(); world.add(home);
  const floorObjs = {};   // fid -> { group, volume, volEdges, slab, slabEdges, glow, detail, ... }
  const pickHome = [];    // meshes pickable in home view
  const pickFloor = [];   // meshes pickable in floor view (rooms + slabs)

  floorIds.forEach((fid) => {
    const f = G.floors[fid];
    const group = new THREE.Group();
    group.position.y = restBase[fid];
    home.add(group);
    const b = bbox(f.outline);

    // Rest volume
    const volMat = mat(P.body, { transparent: true });
    const volume = new THREE.Mesh(extrudePlan(f.outline, f.height - 0.06), volMat);
    volume.castShadow = !f.belowGround; volume.receiveShadow = true;
    volume.userData = { pick: "floor", floor: fid };
    const volEdges = edgeLines(volume.geometry, P.edge, 0.28);
    group.add(volume, volEdges);
    pickHome.push(volume);
    if (f.belowGround) {
      volume.material.opacity = BASEMENT_OP;
      volume.renderOrder = 1;
      volEdges.material.opacity = 0.14;
    }

    // Exterior glow: light spills out of the walls of rooms that have lights
    // on, not out of the floor. For each lit room, a warm wash on its outside
    // wall faces plus (on the ground floor) a soft spill onto the ground.
    const glowGroup = new THREE.Group();
    group.add(glowGroup);
    const roomGlows = {};   // areaId -> materials to drive
    const atGrade = !f.belowGround && restBase[fid] === 0;
    if (!f.belowGround) f.rooms.forEach((room) => {
      if (!room.id) return;
      const mats2 = [];
      room.rects.forEach(([x1, z1, x2, z2]) => {
        const edges = [[x1, z1, x2, z1], [x2, z1, x2, z2], [x2, z2, x1, z2], [x1, z2, x1, z1]];
        edges.forEach(([ax, az, bx, bz]) => {
          exteriorOverlap(ax, az, bx, bz, f.outline).forEach((seg) => {
            const dx = seg.bx - seg.ax, dz = seg.bz - seg.az;
            const len = Math.hypot(dx, dz);
            const mx = (seg.ax + seg.bx) / 2, mz = (seg.az + seg.bz) / 2;
            let nx = -dz / len, nz = dx / len;
            if (pointInPoly(mx + nx * 0.3, mz + nz * 0.3, f.outline)) { nx = -nx; nz = -nz; }
            // Wall wash: a vertical additive quad hugging the facade
            const vMat = new THREE.MeshBasicMaterial({ map: wallGlowTex, color: P.glowWarm, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
            disposables.push(vMat);
            const v = new THREE.Mesh(new THREE.PlaneGeometry(len * 1.02, (f.height - 0.06) * 0.92), vMat);
            v.position.set(mx + nx * 0.12, (f.height - 0.06) * 0.48, mz + nz * 0.12);
            v.rotation.y = Math.atan2(nx, nz);
            v.renderOrder = 5;
            glowGroup.add(v); mats2.push(vMat);
            // Ground spill in front of that wall (ground floor only)
            if (atGrade) {
              const horiz = Math.abs(dx) > Math.abs(dz);
              const s = glowPlane(horiz ? len * 1.5 : 2.8, horiz ? 2.8 : len * 1.5, P.glowWarm);
              s.position.set(mx + nx * 1.0, 0.03, mz + nz * 1.0);
              glowGroup.add(s); mats2.push(s.material);
            }
          });
        });
      });
      if (mats2.length) roomGlows[room.id] = mats2;
    });

    // Outline slab (unfocused representation in floor view)
    const slabMat = mat(P.slab, { transparent: true, opacity: 0 });
    const slab = new THREE.Mesh(extrudePlan(f.outline, 0.22), slabMat);
    slab.visible = false; slab.userData = { pick: "slab", floor: fid };
    const slabEdges = edgeLines(slab.geometry, P.edge, 0); slabEdges.visible = false;
    const slabGlow = glowPlane(b.w * 1.6, b.d * 1.6, P.glowWarm);
    slabGlow.position.set(b.cx, -0.1, b.cz); slabGlow.visible = false;
    group.add(slab, slabEdges, slabGlow);
    pickFloor.push(slab);

    floorObjs[fid] = { id: fid, def: f, group, volume, volEdges, glowGroup, roomGlows, slab, slabEdges, slabGlow, b, detail: null, labels: null, fade: 0, glowGate: 1 };
  });

  // Roofs (rest view), one group per building. A building's main roof follows
  // its top floor in explode.
  const roofGroups = {};
  buildingIds.forEach((bid) => {
    const rg = new THREE.Group();
    rg.position.y = roofBaseYB[bid];
    home.add(rg);
    roofGroups[bid] = rg;
  });
  const roofMat = mat(P.roof, { transparent: true });
  const roofMeshes = [];
  G.roofs.forEach((r) => {
    const f = G.floors[r.over];
    const pts = r.clip || f.outline;
    const y = 0;
    const m = new THREE.Mesh(extrudePlan(pts, 0.16), r.clip ? mat(P.roof, { transparent: true }) : roofMat);
    m.position.y = y;
    m.castShadow = true; m.receiveShadow = true;
    m.userData = { pick: "floor", floor: r.clip ? r.over : topFloorId(bldOf(r.over)) };
    const e = edgeLines(m.geometry, P.edge, 0.28); e.position.y = y;
    if (r.clip) {
      // Wing roofs live with their floor's group so they explode along with it
      floorObjs[r.over].group.add(m, e);
      m.position.y = f.height; e.position.y = f.height;
      floorObjs[r.over].wingRoofs = (floorObjs[r.over].wingRoofs || []).concat([{ mesh: m, edges: e }]);
    } else {
      roofGroups[bldOf(r.over)].add(m, e);
      roofMeshes.push({ mesh: m, edges: e, building: bldOf(r.over) });
    }
    pickHome.push(m);
  });
  function topFloorId(bid) {
    const ids2 = floorIds.filter((id) => !G.floors[id].belowGround && (!bid || bldOf(id) === bid));
    return ids2.slice(-1)[0];
  }

  // ---- Outdoor patches: soft green shapes drawn on the ground -----------------
  // Rounded rectilinear plates (garden, patio, driveway). They read as nature
  // around the buildings, are tappable in the home view, and fade away while a
  // floor is focused.
  function roundedPlanShape(points, radius) {
    const s2 = new THREE.Shape();
    const n = points.length;
    const at2 = (i) => points[(i + n) % n];
    for (let i = 0; i < n; i++) {
      const p = at2(i), prev = at2(i - 1), nxt = at2(i + 1);
      const d1 = Math.hypot(p[0] - prev[0], p[1] - prev[1]) || 1;
      const d2 = Math.hypot(nxt[0] - p[0], nxt[1] - p[1]) || 1;
      const r1 = Math.min(radius, d1 / 2), rB = Math.min(radius, d2 / 2);
      const a = [p[0] + ((prev[0] - p[0]) / d1) * r1, p[1] + ((prev[1] - p[1]) / d1) * r1];
      const b = [p[0] + ((nxt[0] - p[0]) / d2) * rB, p[1] + ((nxt[1] - p[1]) / d2) * rB];
      if (i === 0) s2.moveTo(a[0], a[1]); else s2.lineTo(a[0], a[1]);
      s2.quadraticCurveTo(p[0], p[1], b[0], b[1]);
    }
    s2.closePath();
    return s2;
  }
  const patchObjs = [];
  let patchGate = 1;
  const patchColor = (o) => {
    const c = new THREE.Color(P.grass);
    if (o.color) c.lerp(new THREE.Color(o.color), 0.42);
    return c;
  };
  (G.outdoor || []).forEach((o) => {
    if (!o.poly || o.poly.length < 3) return;
    const geo2 = new THREE.ExtrudeGeometry(roundedPlanShape(o.poly, 0.6), { depth: 0.07, bevelEnabled: false });
    geo2.rotateX(Math.PI / 2); geo2.translate(0, 0.07, 0);
    const m2 = mat(patchColor(o).getHex(), { transparent: true });
    const mesh = new THREE.Mesh(geo2, m2);
    mesh.receiveShadow = true;
    mesh.userData = { pick: "outdoor", area: o.id };
    world.add(mesh);
    pickHome.push(mesh);
    patchObjs.push({ mesh, def: o });
    const bb2 = bbox(o.poly);
    const gp = glowPlane(Math.min(bb2.w, 12) * 1.1, Math.min(bb2.d, 12) * 1.1, P.glowWarm);
    gp.position.set(bb2.cx, 0.16, bb2.cz);
    world.add(gp);
    outdoorGlows[o.id] = gp;
  });
  function applyPatchGate() {
    patchObjs.forEach((p) => { p.mesh.material.opacity = patchGate; p.mesh.visible = patchGate > 0.02; });
    Object.values(outdoorGlows).forEach((gp) => { gp.visible = patchGate > 0.02; });
  }

  // ---- Focused-floor detail (built lazily) -----------------------------------
  function buildDetail(fid) {
    const fo = floorObjs[fid];
    if (fo.detail) return fo.detail;
    const f = fo.def;
    const t = G.wall.thickness, wh = G.wall.roomWallHeight;
    const detail = new THREE.Group();
    detail.visible = false;
    const mats = [];
    // polygonOffset pulls detail surfaces in front of the coplanar fading
    // volume during the crossfade, avoiding z-fighting stripes on the walls.
    const dm = (color, o) => { const m2 = mat(color, Object.assign({ transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }, o)); mats.push(m2); return m2; };
    const b2 = bbox(f.outline);

    // Floor plate
    const plateM = dm(P.floorPlate);
    const plate = new THREE.Mesh(extrudePlan(f.outline, 0.14), plateM);
    plate.receiveShadow = true;
    detail.add(plate);

    // Walls: outer walls sit flush with the plate edge (shifted inward by
    // Outer walls: one extruded ring (outline outside, inset outline inside),
    // so the outer face is flush with the plate edge by construction.
    // Walls are built at unit height inside wallsGroup; scale.y animates them
    // from full storey height down to the dollhouse cut during the explode.
    const wallM = dm(P.wall);
    const wallsGroup = new THREE.Group();
    wallsGroup.position.y = 0.14;
    detail.add(wallsGroup);
    const ringShape = planShape(f.outline);
    ringShape.holes.push(new THREE.Path(insetOutline(f.outline, t).map(([x, z]) => new THREE.Vector2(x, z))));
    const ringGeo = new THREE.ExtrudeGeometry(ringShape, { depth: 1, bevelEnabled: false });
    ringGeo.rotateX(Math.PI / 2); ringGeo.translate(0, 1, 0);
    const ring = new THREE.Mesh(ringGeo, wallM);
    ring.receiveShadow = true;
    wallsGroup.add(ring);
    // Partitions: each end is adjusted explicitly. An end on the outer
    // outline retracts to the ring's inner face (no coplanar overlap with the
    // facade); an interior end extends half a thickness so T-junctions with
    // crossing walls close without notches.
    const onBoundary = (x, z) => outlineSegments(f.outline).some(([ax, az, bx, bz]) => {
      if (Math.abs(ax - bx) < 0.01) return Math.abs(x - ax) < 0.02 && z > Math.min(az, bz) - 0.02 && z < Math.max(az, bz) + 0.02;
      return Math.abs(z - az) < 0.02 && x > Math.min(ax, bx) - 0.02 && x < Math.max(ax, bx) + 0.02;
    });
    f.walls.forEach(([x1, z1, x2, z2]) => {
      const len = Math.hypot(x2 - x1, z2 - z1) || 1;
      const ux = (x2 - x1) / len, uz = (z2 - z1) / len;
      const a = onBoundary(x1, z1) ? t : -t / 2;   // + moves the end inward
      const b = onBoundary(x2, z2) ? t : -t / 2;
      const w = wallBox(x1 + ux * a, z1 + uz * a, x2 - ux * b, z2 - uz * b, 1, t, wallM, 0);
      wallsGroup.add(w);
    });
    wallsGroup.scale.y = wh;

    // Rooms: tinted floor + glow + pick plane
    const roomPicks = [];
    const rooms = {};
    f.rooms.forEach((room) => {
      const rg = new THREE.Group();
      let glowMeshes = [];
      room.rects.forEach(([x1, z1, x2, z2]) => {
        const w = x2 - x1 - t, d = z2 - z1 - t;
        const tintC = new THREE.Color(tintFor(room.id));
        if (room.color) tintC.lerp(new THREE.Color(room.color), 0.3);
        const floorTint = new THREE.Mesh(new THREE.PlaneGeometry(w, d), dm(tintC.getHex()));
        floorTint.rotation.x = -Math.PI / 2;
        floorTint.position.set((x1 + x2) / 2, 0.155, (z1 + z2) / 2);
        floorTint.receiveShadow = true;
        floorTint.userData = { pick: "room", floor: fid, area: room.id, roomColor: room.color || null };
        rg.add(floorTint);
        if (room.id) roomPicks.push(floorTint);
        const gp = glowPlane(w * 1.15, d * 1.15, P.glowWarm);
        gp.position.set((x1 + x2) / 2, 0.18, (z1 + z2) / 2);
        rg.add(gp); glowMeshes.push(gp);
      });
      detail.add(rg);
      if (room.id) rooms[room.id] = { def: room, glows: glowMeshes };
    });

    fo.detail = { group: detail, mats, rooms, roomPicks, walls: wallsGroup, fullH: f.height - 0.06, cutH: wh };
    fo.group.add(detail);
    return fo.detail;
  }

  // ---- Labels (DOM overlay) ---------------------------------------------------
  const labelPool = [];
  function makeLabel() {
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0;transition:opacity 250ms ease-out;will-change:transform;";
    labelLayer.appendChild(el);
    return el;
  }
  function labelHTML(name, chips) {
    const chipHtml = chips.map((c) =>
      `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;background:${P.labelBg};color:${c.color || P.labelText};font-family:var(--font-mono,monospace);font-size:11px;line-height:16px;white-space:nowrap;">${c.text}</span>`
    ).join("");
    return `<div style="padding:3px 10px;border-radius:999px;background:${P.labelBg};color:${P.labelText};font-family:var(--font-body,sans-serif);font-size:12px;font-weight:600;line-height:16px;white-space:nowrap;">${name}</div>` +
      (chips.length ? `<div style="display:flex;gap:4px;">${chipHtml}</div>` : "");
  }
  let activeLabels = [];   // { el, getWorld() }
  function clearLabels() {
    activeLabels.forEach((l) => {
      const el = l.el;
      el.style.transition = "opacity 150ms ease-out";
      el.style.opacity = "0";
      setTimeout(() => {
        el.style.display = "none";
        el.style.transition = "opacity 250ms ease-out";
        labelPool.push(el);
      }, 170);
    });
    activeLabels = [];
  }
  function areaChips(areaId) {
    const a = (homeState.areas || {})[areaId] || {};
    const chips = [];
    if (a.lightsOn > 0) chips.push({ text: a.lightsOn + (a.lightsOn === 1 ? " light" : " lights"), color: theme === "dark" ? "#ffc47e" : "#b06a10" });
    if (a.hasClimate && a.temp != null) {
      const c = a.climate === "heating" ? (theme === "dark" ? "#ffab66" : "#c25e0a") : a.climate === "cooling" ? (theme === "dark" ? "#7db8ff" : "#1559b8") : null;
      chips.push({ text: a.temp.toFixed(1) + "\u00B0", color: c });
    }
    if (a.showHumidity && a.humidity != null) chips.push({ text: a.humidity + "%" });
    return chips;
  }
  function buildFloorLabels(fid) {
    clearLabels();
    const fo = floorObjs[fid];
    const detail = buildDetail(fid);
    fo.def.rooms.forEach((room) => {
      const el2 = labelPool.pop() || makeLabel();
      el2.style.display = "";
      const el = el2;
      const name = room.id ? (homeState.areaNames || {})[room.id] || room.id : room.name || "";
      if (!name) return;
      el.innerHTML = labelHTML(name, room.id ? areaChips(room.id) : []);
      const lp = room.label;
      activeLabels.push({
        el, room, fid,
        world: new THREE.Vector3(lp[0], G.wall.roomWallHeight + 0.5, lp[1]),
      });
      requestAnimationFrame(() => { el.style.opacity = "1"; });
    });
  }
  function refreshLabelContent() {
    activeLabels.forEach((l) => {
      const name = l.room.id ? (homeState.areaNames || {})[l.room.id] || l.room.id : l.room.name || "";
      l.el.innerHTML = labelHTML(name, l.room.id ? areaChips(l.room.id) : []);
    });
  }
  const v3 = new THREE.Vector3();
  function updateLabelPositions() {
    if (!activeLabels.length) return;
    const rect = { w: container.clientWidth, h: container.clientHeight };
    activeLabels.forEach((l) => {
      const fo = floorObjs[l.fid];
      v3.copy(l.world); fo.group.localToWorld(v3);
      v3.project(camera);
      if (v3.z > 1) { l.el.style.display = "none"; return; }
      l.el.style.display = "";
      const x = (v3.x * 0.5 + 0.5) * rect.w, y = (-v3.y * 0.5 + 0.5) * rect.h;
      l.el.style.left = x.toFixed(1) + "px"; l.el.style.top = y.toFixed(1) + "px";
    });
  }

  // ---- Sun arc, sun disc, moon --------------------------------------------------
  const skyGroup = new THREE.Group(); scene.add(skyGroup);
  const arcMat = new THREE.LineBasicMaterial({ color: 0xffc478, transparent: true, opacity: 0.35 });
  let arcLine = null;
  function rebuildArc() {
    if (arcLine) { skyGroup.remove(arcLine); arcLine.geometry.dispose(); }
    if (ambient) { arcLine = null; return; }   // no sun-path line in the embedded view
    const pts = [];
    for (let h = 0; h <= 24; h += 0.2) {
      const { elev, az } = sunAngles(h, latitude, dayOfYear);
      if (elev > -0.02) pts.push(new THREE.Vector3(...sunVec(elev, az, 46)));
    }
    if (pts.length < 2) { arcLine = null; return; }
    arcLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMat);
    skyGroup.add(arcLine);
  }
  const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(0.9, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
  const sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffc478, transparent: true, opacity: 0.55, depthWrite: false }));
  sunHalo.scale.set(7, 7, 1);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xd8dce8 }));
  const moonHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xaab4d0, transparent: true, opacity: 0.35, depthWrite: false }));
  moonHalo.scale.set(4.5, 4.5, 1);
  skyGroup.add(sunDisc, sunHalo, moon, moonHalo);
  rebuildArc();

  // ---- Lighting update -------------------------------------------------------
  const cA = new THREE.Color(), cB = new THREE.Color(), cC = new THREE.Color();
  let glowBoost = 1;
  function updateLighting() {
    const { elev, az } = sunAngles(timeHours, latitude, dayOfYear);
    const elevDeg = (elev * 180) / Math.PI;
    const day = smooth(-4, 14, elevDeg);          // 0 night .. 1 day
    const warm = Math.exp(-Math.pow(elevDeg / 9, 2)) * (elevDeg > -9 ? 1 : 0); // dawn/dusk band
    glowBoost = 1 + (1 - day) * 1.1;

    // Sun light
    const sv = sunVec(Math.max(elev, 0.05), az, 46);
    sun.position.set(sv[0] * 0.9, Math.max(sv[1] * 0.9, 3), sv[2] * 0.9);
    cA.set(0xfff3e0); cB.set(0xff9d4d);
    sun.color.copy(cA).lerp(cB, warm * 0.85);
    sun.intensity = elevDeg > 0 ? lerp(0.25, theme === "dark" ? 1.5 : 1.9, day) : 0.0;
    sun.castShadow = elevDeg > 1;

    // Night: gentle moon key light
    if (elevDeg <= 0) {
      sun.position.set(-14, 20, 10);
      sun.color.set(theme === "dark" ? 0x93a4c8 : 0xaab8d8);
      sun.intensity = 0.32; sun.castShadow = true;
    }

    hemi.color.set(P.hemiSky); hemi.groundColor.set(P.hemiGround);
    hemi.intensity = lerp(theme === "dark" ? 0.42 : 0.55, theme === "dark" ? 0.75 : 1.0, day);
    fillAmbient.intensity = lerp(0.14, 0.1, day);

    // Sky gradient (CSS behind the transparent canvas)
    const kDay = P.skyDay, kDawn = P.skyDawn, kNight = P.skyNight;
    cA.set(kNight[0]).lerp(cC.set(kDay[0]), day).lerp(cC.set(kDawn[0]), warm * 0.75);
    cB.set(kNight[1]).lerp(cC.set(kDay[1]), day).lerp(cC.set(kDawn[1]), warm * 0.55);
    if (ambient) {
      container.style.background =
        "radial-gradient(ellipse 70% 42% at 50% 58%, #" + cB.getHexString() + " 0%, #" + cA.getHexString() + " 38%, var(--color-bg) 72%)";
    } else {
      container.style.background = "linear-gradient(180deg, #" + cA.getHexString() + " 0%, #" + cB.getHexString() + " 78%)";
    }
    shadowMat.opacity = theme === "dark" ? 0.13 : 0.09;
    if (!scene.fog) scene.fog = new THREE.Fog(0x000000, 60, 160);
    scene.fog.color.copy(cB);

    // Sun disc / arc / moon
    const sp = sunVec(elev, az, 46);
    sunDisc.position.set(...sp); sunHalo.position.set(...sp);
    const sunVisible = elevDeg > -1;
    sunDisc.visible = sunVisible; sunHalo.visible = sunVisible;
    if (arcMat) arcMat.opacity = lerp(0.14, 0.4, day);
    const mp = sunVec(-elev, az + Math.PI, 46);
    moon.position.set(mp[0], Math.max(mp[1], 6), mp[2]);
    moonHalo.position.copy(moon.position);
    // Sun and moon are mutually exclusive: around dawn/dusk the old windows
    // (sun above -1°, moon below +2°) overlapped and both discs showed.
    moon.visible = !sunVisible; moonHalo.visible = !sunVisible;

    applyState(); // glow intensities depend on glowBoost
  }

  // ---- State application -------------------------------------------------------
  function floorClimate(fid) {
    const f = G.floors[fid];
    let heat = false, cool = false;
    f.rooms.forEach((r) => {
      if (!r.id) return;
      const a = (homeState.areas || {})[r.id];
      if (!a) return;
      if (a.climate === "heating") heat = true;
      if (a.climate === "cooling") cool = true;
    });
    return heat ? "heating" : cool ? "cooling" : "idle";
  }
  function floorLights(fid) {
    let n = 0;
    G.floors[fid].rooms.forEach((r) => { if (r.id) n += ((homeState.areas || {})[r.id] || {}).lightsOn || 0; });
    return n;
  }
  function applyState() {
    floorIds.forEach((fid) => {
      const fo = floorObjs[fid];
      const lights = floorLights(fid);
      const clim = floorClimate(fid);
      const gate = fo.glowGate == null ? 1 : fo.glowGate;
      // Exterior wall glow per lit room
      Object.keys(fo.roomGlows || {}).forEach((aid) => {
        const a = (homeState.areas || {})[aid] || {};
        const op = a.lightsOn > 0 ? clamp(0.07 + a.lightsOn * 0.07, 0, 0.32) * glowBoost : 0;
        fo.roomGlows[aid].forEach((m2) => { m2.opacity = clamp(op, 0, 0.5) * gate; });
      });
      const target = lights > 0 ? clamp(0.16 + lights * 0.09, 0, 0.62) * glowBoost : 0;
      fo.slabGlow.material.opacity = fo.slabGlow.visible ? clamp(target * 0.55, 0, 0.5) : 0;
      // Volumes keep one uniform tone across floors (no climate wash)
      cA.set(G.floors[fid].belowGround ? P.bodyMuted : P.body);
      fo.volume.material.color.copy(cA);
      // Room glows in detail
      if (fo.detail) {
        Object.keys(fo.detail.rooms).forEach((aid) => {
          const a = (homeState.areas || {})[aid] || {};
          const op = a.lightsOn > 0 ? clamp(0.2 + a.lightsOn * 0.13, 0, 0.7) * glowBoost : 0;
          fo.detail.rooms[aid].glows.forEach((gp) => {
            gp.material.opacity = clamp(op, 0, 0.9) * fo.fade;
          });
        });
      }
    });
    Object.keys(outdoorGlows).forEach((aid) => {
      const a = (homeState.areas || {})[aid] || {};
      outdoorGlows[aid].material.opacity = (a.lightsOn > 0 ? 0.28 * glowBoost : 0) * patchGate;
    });
    refreshLabelContent();
  }

  // ---- Camera / orbit -------------------------------------------------------
  const homeRadius = clamp(Math.max(sb.w, sb.d) * 1.35 + 11, 24, 64);
  const cam = {
    theta: Math.PI - 0.55, phi: 1.1, radius: homeRadius,
    target: new THREE.Vector3(sb.cx, 2.0, sb.cz),
  };
  const goal = { theta: cam.theta, phi: cam.phi, radius: cam.radius, target: cam.target.clone() };
  const HOME_VIEW = { theta: Math.PI - 0.55, phi: 1.1, radius: homeRadius, target: new THREE.Vector3(sb.cx, 2.0, sb.cz) };
  function fitRadius(base) {
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    // Wider viewports pull the camera in so the home scales with the screen
    // instead of shrinking into the extra width.
    const k = aspect < 0.8 ? 1.45 : aspect < 1.2 ? 1.2 : Math.max(0.62, 1.2 - (aspect - 1.2) * 0.45);
    return base * k / zoomK;
  }
  let tween = null;
  function tweenCam(to, ms) {
    // wrap theta to nearest
    let th = to.theta;
    while (th - goal.theta > Math.PI) th -= Math.PI * 2;
    while (th - goal.theta < -Math.PI) th += Math.PI * 2;
    tween = {
      t0: performance.now(), ms: ms || 800,
      from: { theta: goal.theta, phi: goal.phi, radius: goal.radius, target: goal.target.clone() },
      to: { theta: th, phi: to.phi, radius: to.radius, target: to.target.clone() },
    };
  }
  function applyCamera() {
    cam.theta = lerp(cam.theta, goal.theta, 0.18);
    cam.phi = lerp(cam.phi, goal.phi, 0.18);
    cam.radius = lerp(cam.radius, goal.radius, 0.18);
    cam.target.lerp(goal.target, 0.18);
    const sp = Math.sin(cam.phi), y = Math.cos(cam.phi);
    camera.position.set(
      cam.target.x + cam.radius * sp * Math.sin(cam.theta),
      cam.target.y + cam.radius * y,
      cam.target.z + cam.radius * sp * Math.cos(cam.theta)
    );
    if (camera.position.y < 0.8) camera.position.y = 0.8;
    camera.lookAt(cam.target);
  }

  // ---- Pointer input ------------------------------------------------------------
  let lastInteract = performance.now();
  let idleReturned = true;
  const pointers = new Map();
  let pinchDist = 0;
  let downInfo = null;
  const el = renderer.domElement;
  el.style.cursor = "grab";

  el.addEventListener("pointerdown", (e) => {
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointers have no id */ }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
    downInfo = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    tween = null; lastInteract = performance.now(); idleReturned = false;
    el.style.cursor = "grabbing";
  });
  el.addEventListener("pointermove", (e) => {
    lastInteract = performance.now();
    if (!pointers.has(e.pointerId)) { if (canHover) hoverCheck(e); return; }
    const p = pointers.get(e.pointerId);
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (downInfo) downInfo.moved += Math.abs(dx) + Math.abs(dy);
    if (pointers.size === 1) {
      goal.theta -= dx * 0.0055;
      goal.phi = clamp(goal.phi - dy * 0.004, 0.35, 1.47);
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist > 0) goal.radius = clamp(goal.radius * (pinchDist / d), 9, 70);
      pinchDist = d;
    }
  });
  function endPointer(e) {
    pointers.delete(e.pointerId);
    el.style.cursor = "grab";
    if (downInfo && pointers.size === 0) {
      const dt = performance.now() - downInfo.t;
      if (downInfo.moved < 8 && dt < 500) handleTap(e.clientX, e.clientY);
      downInfo = null;
    }
    lastInteract = performance.now();
  }
  el.addEventListener("pointerup", endPointer);
  el.addEventListener("pointercancel", endPointer);
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    goal.radius = clamp(goal.radius * (1 + e.deltaY * 0.0012), 9, 70);
    tween = null; lastInteract = performance.now(); idleReturned = false;
  }, { passive: false });

  // ---- Picking ---------------------------------------------------------------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function raycast(cx, cy, targets) {
    const r = container.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(targets, false);
    return hits.length ? hits[0] : null;
  }
  function hoverCheck(e) {
    if (view !== "home" || transition) return;
    const hit = raycast(e.clientX, e.clientY, pickHome);
    const ud = hit ? hit.object.userData : null;
    const fid = ud && ud.pick === "floor" ? ud.floor : null;
    if (fid !== hoverFloor) hoverFloor = fid;
    el.style.cursor = ud ? "pointer" : "grab";
  }
  function screenPosOfArea(fid, areaId) {
    const fo = floorObjs[fid];
    const room = fo.def.rooms.find((r) => r.id === areaId);
    if (!room) return { x: container.clientWidth / 2, y: container.clientHeight / 2 };
    v3.set(room.label[0], 0.4, room.label[1]);
    fo.group.localToWorld(v3); v3.project(camera);
    return { x: (v3.x * 0.5 + 0.5) * container.clientWidth, y: (-v3.y * 0.5 + 0.5) * container.clientHeight };
  }
  function handleTap(cx, cy) {
    if (transition) return;
    if (view === "home") {
      const hit = raycast(cx, cy, pickHome);
      if (!hit) {
        if (opts.onAreaPick) opts.onAreaPick(null);
        // Zoomed on an outdoor patch: first tap outside reframes the home.
        if (areaFocused) { backHome(); if (opts.onViewChange) opts.onViewChange({ view: "home", floor: null }); }
        return;
      }
      const ud = hit.object.userData;
      if (ud.pick === "outdoor") {
        if (opts.onAreaPick) opts.onAreaPick({ area: ud.area, floor: null, anchor: { x: cx, y: cy } });
        return;
      }
      focusFloor(ud.floor);
    } else {
      const fo = floorObjs[selectedFloor];
      // Rooms of the selected floor win over the drifting slabs of other
      // floors, which can sit between the camera and the focused floor.
      const roomHit = raycast(cx, cy, fo.detail ? fo.detail.roomPicks : []);
      if (roomHit) {
        const ud = roomHit.object.userData;
        if (ud.area && opts.onAreaPick) opts.onAreaPick({ area: ud.area, floor: selectedFloor, anchor: screenPosOfArea(selectedFloor, ud.area) });
        return;
      }
      const slabHit = raycast(cx, cy, pickFloor.filter((m) => m.visible));
      if (slabHit) {
        const ud = slabHit.object.userData;
        if (ud.pick === "slab" && ud.floor !== selectedFloor) { focusFloor(ud.floor); return; }
      } else {
        if (opts.onAreaPick) opts.onAreaPick(null);
        if (areaFocused) {
          // Zoomed on a room: first tap outside goes back to the floor.
          areaFocused = false;
          tweenCam(floorCamera(selectedFloor), 850);
          if (opts.onViewChange) opts.onViewChange({ view: "floor", floor: selectedFloor });
        } else {
          backHome();
        }
      }
    }
  }

  // ---- Hover lift (home view) ---------------------------------------------------
  function updateHover() {
    floorIds.forEach((fid) => {
      const fo = floorObjs[fid];
      const isHover = view === "home" && hoverFloor === fid && !transition;
      const targetLift = isHover ? 0.14 : 0;
      fo.hoverLift = lerp(fo.hoverLift || 0, targetLift, 0.2);
      fo.volEdges.material.opacity = lerp(fo.volEdges.material.opacity, isHover ? 0.75 : 0.28, 0.15);
    });
    // Roof hover follows its building's top floor
    roofMeshes.forEach((r) => {
      const topHover = view === "home" && hoverFloor === topFloorId(r.building) && !transition;
      r.edges.material.opacity = lerp(r.edges.material.opacity, topHover ? 0.75 : 0.28, 0.15);
    });
  }

  // ---- View transitions -----------------------------------------------------------
  let transition = null; // { t0, ms, from: {fid: y}, to: {fid: y}, mode }
  const GAP = 4.0;
  function explodedBase(fid, selFid) {
    // The selected floor stays at its natural height; the others of the same
    // building drift away from there while they fade out. Other buildings
    // fade in place.
    if (bldOf(fid) !== bldOf(selFid)) return restBase[fid];
    const slot = G.floors[fid].slot, selSlot = G.floors[selFid].slot;
    const selBase = G.floors[selFid].belowGround ? 0.4 : restBase[selFid];
    return selBase + (slot - selSlot) * GAP;
  }
  function startTransition(mode, selFid, ms) {
    const from = {}, to = {};
    floorIds.forEach((fid) => { from[fid] = floorObjs[fid].group.position.y; });
    buildingIds.forEach((bid) => { from["__roof_" + bid] = roofGroups[bid].position.y; });
    if (mode === "explode") {
      floorIds.forEach((fid) => { to[fid] = explodedBase(fid, selFid); });
      const selBid = bldOf(selFid);
      buildingIds.forEach((bid) => {
        if (bid !== selBid) { to["__roof_" + bid] = roofBaseYB[bid]; return; }
        const topSlot = G.floors[topFloorId(bid)].slot;
        to["__roof_" + bid] = (G.floors[selFid].belowGround ? 0.4 : restBase[selFid]) + (topSlot + 1 - G.floors[selFid].slot) * GAP;
      });
    } else {
      floorIds.forEach((fid) => { to[fid] = restBase[fid]; });
      buildingIds.forEach((bid) => { to["__roof_" + bid] = roofBaseYB[bid]; });
    }
    transition = { t0: performance.now(), ms: ms || 850, from, to, mode, selFid };
    // An invisible (opacity 0) roof still casts a shadow; turn it off while exploded.
    roofMeshes.forEach((r) => { r.mesh.castShadow = mode !== "explode"; });
    // Prepare visibility
    floorIds.forEach((fid) => {
      const fo = floorObjs[fid];
      fo.volume.visible = true; fo.volEdges.visible = true;
      fo.slab.visible = true; fo.slabEdges.visible = true; fo.slabGlow.visible = false;
      if (mode === "explode" && fid === selFid) {
        buildDetail(fid); fo.detail.group.visible = true;
        fo.detail.walls.scale.y = fo.detail.fullH; // start at full height, sink during the move
      }
      if (fo.detail) fo.detail.group.visible = mode === "explode" && fid === selFid ? true : fo.detail.group.visible;
    });
  }
  function stepTransition(now) {
    if (!transition) return;
    const k = EASE(clamp((now - transition.t0) / transition.ms, 0, 1));
    const { from, to, mode, selFid } = transition;
    // Staggered fades: whatever is disappearing goes first (kOut), whatever is
    // appearing comes in after (kIn). The volume and the floor detail are
    // coplanar, so they must never be visible at the same time (z-fighting).
    const kOut = clamp(k / 0.45, 0, 1);
    const kIn = clamp((k - 0.5) / 0.5, 0, 1);
    floorIds.forEach((fid) => {
      const fo = floorObjs[fid];
      fo.group.position.y = lerp(from[fid], to[fid], k);
      const isSel = fid === selFid;
      const explode = mode === "explode";
      // Fades
      const volTarget = explode ? 0 : (G.floors[fid].belowGround ? BASEMENT_OP : 1);
      const kVol = explode ? kOut : kIn;
      fo.volume.material.opacity = lerp(from["vo_" + fid] ?? fo.volume.material.opacity, volTarget, kVol);
      fo.volEdges.material.opacity = explode ? lerp(fo.volEdges.material.opacity, 0, kOut) : lerp(fo.volEdges.material.opacity, 0.28, kIn);
      fo.slab.material.opacity = lerp(from["so_" + fid] ?? fo.slab.material.opacity, 0, kOut);
      fo.slabEdges.material.opacity = fo.slab.material.opacity * 0.8;
      (fo.wingRoofs || []).forEach((wr) => {
        wr.mesh.material.opacity = fo.volume.material.opacity;
        wr.mesh.visible = wr.mesh.material.opacity > 0.02;
        wr.edges.material.opacity = wr.mesh.material.opacity * 0.3;
        wr.edges.visible = wr.mesh.visible;
      });
      // Exterior glow fades for every floor while exploded; the focused floor
      // shows its own per-room interior glows instead.
      fo.glowGate = explode ? 1 - kOut : Math.max(fo.glowGate, kIn);
      if (fo.detail) {
        // Explode: detail fades in early (kOut), walls sink full->cut over k.
        // Collapse: walls rise cut->full early (kOut), then the detail fades
        // out late (kIn) as the volume returns, so the rise is visible.
        fo.fade = explode ? (isSel ? kOut : lerp(fo.fade, 0, kOut)) : (isSel ? 1 - kIn : lerp(fo.fade, 0, kOut));
        fo.detail.mats.forEach((m) => { m.opacity = fo.fade; });
        const d2 = fo.detail;
        if (isSel && explode) d2.walls.scale.y = lerp(d2.fullH, d2.cutH, k);
        else if (isSel && !explode) d2.walls.scale.y = lerp(d2.cutH, d2.fullH, kOut);
      }
      fo.volume.material.transparent = true;
      // Keep depth-writing while still fairly opaque, so the volume's own back
      // faces don't show through the front (reads as a transparent wall);
      // release depth only once mostly faded so the detail can come through.
      fo.volume.material.depthWrite = fo.volume.material.opacity > 0.35;
    });
    buildingIds.forEach((bid) => { roofGroups[bid].position.y = lerp(from["__roof_" + bid], to["__roof_" + bid], k); });
    patchGate = mode === "explode" ? 1 - kOut : kIn;
    if (k >= 1) patchGate = mode === "explode" ? 0 : 1;
    applyPatchGate();
    const roofTarget = mode === "explode" ? 0 : 1;
    roofMeshes.forEach((r) => {
      r.mesh.material.opacity = lerp(r.mesh.material.opacity, roofTarget, k * 0.7 + (k === 1 ? 1 : 0) * 0.3);
      if (k === 1) r.mesh.material.opacity = roofTarget;
      r.edges.material.opacity = r.mesh.material.opacity * 0.3;
    });
    if (k >= 1) {
      // Settle visibility
      floorIds.forEach((fid) => {
        const fo = floorObjs[fid];
        const explode = mode === "explode", isSel = fid === selFid;
        fo.volume.visible = !explode;
        fo.volEdges.visible = fo.volume.visible;
        fo.slab.visible = false;
        fo.slabEdges.visible = false;
        fo.slabGlow.visible = false;
        if (fo.detail) fo.detail.group.visible = explode && isSel;
      });
      roofMeshes.forEach((r) => { r.mesh.visible = mode !== "explode"; r.edges.visible = r.mesh.visible; });
      // Hide everything that could read as a ceiling over the focused floor
      floorIds.forEach((fid2) => {
        (floorObjs[fid2].wingRoofs || []).forEach((wr) => {
          wr.mesh.visible = mode !== "explode"; wr.edges.visible = wr.mesh.visible;
        });
      });
      if (mode === "explode") buildFloorLabels(selFid);
      transition = null;
      applyState();
    } else {
      applyState();
    }
  }

  function floorCamera(fid) {
    const fo = floorObjs[fid];
    const c = [fo.b.cx, fo.b.cz];
    const size = Math.max(fo.b.w, fo.b.d);
    return {
      theta: Math.PI - 0.35, phi: 0.52,
      radius: fitRadius(size * 1.55 + 4),
      target: new THREE.Vector3(c[0], (G.floors[fid].belowGround ? 0.4 : restBase[fid]) + 1.0, c[1]),
    };
  }

  function focusFloor(fid) {
    if (view === "floor" && selectedFloor === fid) {
      // Coming back from an area zoom: reframe the whole floor.
      if (areaFocused) { areaFocused = false; tweenCam(floorCamera(fid), 850); }
      return;
    }
    areaFocused = false;
    clearLabels();
    if (opts.onAreaPick) opts.onAreaPick(null);
    selectedFloor = fid; view = "floor"; hoverFloor = null;
    startTransition("explode", fid, 850);
    tweenCam(floorCamera(fid), 850);
    if (opts.onViewChange) opts.onViewChange({ view: "floor", floor: fid });
  }
  function backHome() {
    if (view === "home") {
      // Coming back from an outdoor-area zoom: reframe the whole home.
      if (areaFocused) { areaFocused = false; tweenCam({ theta: HOME_VIEW.theta, phi: HOME_VIEW.phi, radius: fitRadius(HOME_VIEW.radius), target: HOME_VIEW.target }, 850); }
      return;
    }
    areaFocused = false;
    clearLabels();
    view = "home"; const prev = selectedFloor; selectedFloor = null;
    startTransition("collapse", prev, 850);
    tweenCam({ theta: HOME_VIEW.theta, phi: HOME_VIEW.phi, radius: fitRadius(HOME_VIEW.radius), target: HOME_VIEW.target }, 850);
    if (opts.onViewChange) opts.onViewChange({ view: "home", floor: null });
    lastInteract = performance.now(); idleReturned = true;
  }

  // ---- Area focus: zoom the floor camera onto one room / outdoor patch ------
  let areaFocused = false;
  function areaBounds(areaId) {
    for (const fid of Object.keys(G.floors)) {
      const room = (G.floors[fid].rooms || []).find((r) => r.id === areaId);
      if (room && room.rects && room.rects.length) {
        let x1 = 1e9, z1 = 1e9, x2 = -1e9, z2 = -1e9;
        room.rects.forEach(([a, b, c, d]) => { x1 = Math.min(x1, a); z1 = Math.min(z1, b); x2 = Math.max(x2, c); z2 = Math.max(z2, d); });
        return { fid, cx: (x1 + x2) / 2, cz: (z1 + z2) / 2, w: x2 - x1, d: z2 - z1 };
      }
    }
    const o = (G.outdoor || []).find((p) => p.id === areaId);
    if (o && o.poly) { const b = bbox(o.poly); return { fid: null, cx: b.cx, cz: b.cz, w: b.w, d: b.d }; }
    return null;
  }
  function focusArea(areaId) {
    const ab = areaBounds(areaId);
    if (!ab) return;
    const size = Math.max(ab.w, ab.d);
    if (ab.fid) {
      if (!(view === "floor" && selectedFloor === ab.fid)) focusFloor(ab.fid);
      areaFocused = true;
      const y = (G.floors[ab.fid].belowGround ? 0.4 : restBase[ab.fid]) + 0.8;
      tweenCam({ theta: Math.PI - 0.35, phi: 0.52, radius: Math.max(fitRadius(size * 1.7 + 3), 7), target: new THREE.Vector3(ab.cx, y, ab.cz) }, 850);
    } else {
      // Outdoor areas live in the home view: zoom onto the patch.
      if (view !== "home") backHome();
      areaFocused = true;
      tweenCam({ theta: HOME_VIEW.theta, phi: 0.9, radius: Math.max(fitRadius(size * 1.6 + 6), 10), target: new THREE.Vector3(ab.cx, 1.0, ab.cz) }, 850);
    }
  }

  // ---- Resize -----------------------------------------------------------------
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (shiftX) camera.setViewOffset(w, h, -shiftX * w, 0, w, h);
    else camera.clearViewOffset();
    // Refit the current view's framing to the new size.
    if (!tween) {
      if (view === "home") { goal.radius = fitRadius(HOME_VIEW.radius); cam.radius = goal.radius; }
      else if (selectedFloor && !areaFocused) { goal.radius = floorCamera(selectedFloor).radius; cam.radius = goal.radius; }
    }
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // ---- Main loop -----------------------------------------------------------------
  let disposed = false;
  function frame(now) {
    if (disposed) return;
    requestAnimationFrame(frame);
    // Camera tween
    if (tween) {
      const k = EASE(clamp((now - tween.t0) / tween.ms, 0, 1));
      goal.theta = lerp(tween.from.theta, tween.to.theta, k);
      goal.phi = lerp(tween.from.phi, tween.to.phi, k);
      goal.radius = lerp(tween.from.radius, tween.to.radius, k);
      goal.target.lerpVectors(tween.from.target, tween.to.target, k);
      if (k >= 1) tween = null;
    } else if (view === "home" && !idleReturned && pointers.size === 0 && now - lastInteract > 9000) {
      idleReturned = true;
      tweenCam({ theta: HOME_VIEW.theta, phi: HOME_VIEW.phi, radius: fitRadius(HOME_VIEW.radius), target: HOME_VIEW.target }, 1600);
    }
    stepTransition(now);
    // Hover lift applied to group y (only at rest in home view)
    updateHover();
    if (!transition) {
      const maxLift = {};
      floorIds.forEach((fid) => {
        const fo = floorObjs[fid];
        if (view === "home") {
          // A hovered floor lifts, carrying every floor above it in the same
          // building (and that building's roof).
          let extra = 0;
          floorIds.forEach((oid) => {
            if (bldOf(oid) === bldOf(fid) && G.floors[oid].slot <= G.floors[fid].slot) extra = Math.max(extra, floorObjs[oid].hoverLift || 0);
          });
          fo.group.position.y = restBase[fid] + extra;
          const bid = bldOf(fid);
          maxLift[bid] = Math.max(maxLift[bid] || 0, extra);
        } else {
          fo.group.position.y = explodedBase(fid, selectedFloor);
        }
      });
      if (view === "home") buildingIds.forEach((bid) => { roofGroups[bid].position.y = roofBaseYB[bid] + (maxLift[bid] || 0); });
    }
    applyCamera();
    updateLabelPositions();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  // ---- Theme -----------------------------------------------------------------------
  function retheme(next) {
    theme = next; P = PALETTES[theme];
    contacts.forEach((contact) => {
      contact.material.color.set(P.contact);
      contact.material.opacity = theme === "dark" ? 0.18 : 0.09;
    });
    patchObjs.forEach((p) => { p.mesh.material.color.copy(patchColor(p.def)); });
    floorIds.forEach((fid) => {
      const fo = floorObjs[fid];
      fo.volume.material.color.set(P.body);
      fo.volEdges.material.color.set(P.edge);
      fo.slab.material.color.set(P.slab);
      fo.slabEdges.material.color.set(P.edge);
      Object.values(fo.roomGlows || {}).forEach((ms) => ms.forEach((m2) => m2.color.set(P.glowWarm)));
      fo.slabGlow.material.color.set(P.glowWarm);
      (fo.wingRoofs || []).forEach((wr) => { wr.mesh.material.color.set(P.roof); wr.edges.material.color.set(P.edge); });
      if (fo.detail) {
        // Rebuild detail materials by tinting
        fo.detail.group.traverse((o) => {
          if (o.isMesh && o.userData.pick === "room") {
            const c2 = new THREE.Color(tintFor(o.userData.area));
            if (o.userData.roomColor) c2.lerp(new THREE.Color(o.userData.roomColor), 0.3);
            o.material.color.copy(c2);
          }
        });
        fo.detail.mats.forEach((m) => { /* colors set individually below */ });
      }
    });
    // Recolor detail plates/walls
    Object.values(floorObjs).forEach((fo) => {
      if (!fo.detail) return;
      fo.detail.group.children.forEach((child) => {
        if (child.isMesh && child.geometry.type === "ExtrudeGeometry") child.material.color.set(P.floorPlate);
        if (child.isMesh && child.geometry.type === "BoxGeometry") child.material.color.set(P.wall);
        if (child.isGroup) child.children.forEach((cc) => {
          if (cc.isMesh && cc.userData.pick === "room") {
            const c2 = new THREE.Color(tintFor(cc.userData.area));
            if (cc.userData.roomColor) c2.lerp(new THREE.Color(cc.userData.roomColor), 0.3);
            cc.material.color.copy(c2);
          }
        });
      });
      Object.values(fo.detail.rooms).forEach((r) => r.glows.forEach((gp) => gp.material.color.set(P.glowWarm)));
    });
    roofMeshes.forEach((r) => { r.mesh.material.color.set(P.roof); r.edges.material.color.set(P.edge); });
    updateLighting();
    refreshLabelContent();
    activeLabels.forEach((l) => { /* labelHTML re-renders with new palette via refresh */ });
  }

  // ---- Intro ------------------------------------------------------------------------
  function intro() {
    goal.theta = HOME_VIEW.theta - 1.15;
    goal.phi = 0.88;
    goal.radius = fitRadius(HOME_VIEW.radius) * 1.7;
    cam.theta = goal.theta; cam.phi = goal.phi; cam.radius = goal.radius;
    tweenCam({ theta: HOME_VIEW.theta, phi: HOME_VIEW.phi, radius: fitRadius(HOME_VIEW.radius), target: HOME_VIEW.target }, 2000);
  }

  updateLighting();
  applyState();
  goal.radius = fitRadius(HOME_VIEW.radius);
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) intro();

  return {
    setTime(h) { timeHours = h; updateLighting(); },
    // Re-frame for a different mount (desktop background vs mobile hero):
    // same scene, new zoom multiplier and horizontal shift.
    setFraming(zoom, shift) { zoomK = zoom > 0 ? zoom : 1; shiftX = shift || 0; resize(); },
    setLatitude(lat) { latitude = lat; rebuildArc(); updateLighting(); },
    setTheme(t) { retheme(t === "light" ? "light" : "dark"); },
    updateState(s) { homeState = s; applyState(); },
    focusFloor, backHome, focusArea,
    tapAt(x, y) { handleTap(x, y); },
    getView() { return { view, floor: selectedFloor }; },
    screenPosOfArea,
    _debug: { scene, floorObjs, roofMeshes },
    dispose() {
      disposed = true; ro.disconnect();
      renderer.dispose();
      disposables.forEach((m) => m.dispose());
      container.contains(renderer.domElement) && container.removeChild(renderer.domElement);
      container.contains(labelLayer) && container.removeChild(labelLayer);
    },
  };
}
