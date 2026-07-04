// Editable home plan for the "Fit my home" editor, plus derivation of the
// render geometry (outline polygons, interior walls, roof plates, outdoor
// patches) from it.
//
// v2 model: the plan IS the floors-and-areas source of truth.
//   plan = {
//     v: 2,
//     buildings: [{ id, name }],
//     floors:    [{ id, name, building, height, belowGround, rooms }],
//     outdoor:   [{ key, area, name, icon, color, poly, rects }],
//   }
//   room = { key, area (legacy household link), name, icon, color, poly, rects }
//
// Rooms are edited as one rectilinear polygon (poly); rects are the derived
// form the 3D geometry and all hit-testing consume. Floors are listed in
// stack order within their building (lowest first).

export const PLAN_KEY = "cc-home3d-plan-v1";

const r2 = (v) => Math.round(v * 100) / 100;
const rectPoly = (x1, z1, x2, z2) => [[x1, z1], [x2, z1], [x2, z2], [x1, z2]];

// Mirrors home3d/home-geometry.js so the demo home is the starting point.
export const defaultPlan = {
  v: 2,
  buildings: [{ id: "main-house", name: "House" }],
  floors: [
    {
      id: "basement", name: "Basement", building: "main-house", height: 2.4, belowGround: true,
      rooms: [
        { key: "utility", area: "utility", name: "Utility", icon: "washing-machine", color: null, rects: [[0, 0, 5, 6]] },
      ],
    },
    {
      id: "ground", name: "Ground floor", building: "main-house", height: 2.75,
      rooms: [
        { key: "kitchen", area: "kitchen", name: "Kitchen", icon: "fridge", color: null, rects: [[0, 0, 3.2, 4]] },
        { key: "hallway", area: "hallway", name: "Hallway", icon: "door", color: null, rects: [[3.2, 0, 5.2, 4]] },
        { key: "living-room", area: "living-room", name: "Living room", icon: "sofa", color: null, rects: [[0, 4, 8, 9], [5.2, 0, 8, 4]] },
        { key: "garage", area: "garage", name: "Garage", icon: "garage", color: null, rects: [[-3.5, 0, 0, 6]] },
        { key: "greet-room", area: "greet-room", name: "Annex room", icon: "bed", color: null, rects: [[8, 4, 11, 7.2]] },
        { key: "greet-ensuite", area: "greet-ensuite", name: "Annex ensuite", icon: "shower", color: null, rects: [[8, 7.2, 11, 9]] },
      ],
    },
    {
      id: "first", name: "First floor", building: "main-house", height: 2.55,
      rooms: [
        { key: "main-bedroom", area: "main-bedroom", name: "Main bedroom", icon: "bed-king", color: null, rects: [[0, 4, 4.2, 9]] },
        { key: "tess-room", area: "tess-room", name: "Bedroom", icon: "bed", color: null, rects: [[4.2, 4, 8, 9]] },
        { key: "lars-room", area: "lars-room", name: "Bedroom", icon: "bed", color: null, rects: [[0, 0, 3.4, 4]] },
        { key: "bathroom", area: "bathroom", name: "Bathroom", icon: "shower", color: null, rects: [[5.0, 0, 8, 4]] },
        { key: "landing", area: null, name: "Landing", icon: "stairs", color: null, rects: [[3.4, 0, 5.0, 4]] },
      ],
    },
  ],
  outdoor: [
    { key: "garden", area: "garden", name: "Garden", icon: "tree", color: null, poly: rectPoly(-4, 9.6, 12.4, 15.4) },
    { key: "patio", area: "patio", name: "Patio", icon: "table-chair", color: null, poly: rectPoly(0.6, 9.6, 5.4, 12.4) },
    { key: "driveway", area: "driveway", name: "Driveway", icon: "car", color: null, poly: rectPoly(-3.6, -4.4, 0.4, 0) },
  ],
};

export function clonePlan(p) { return JSON.parse(JSON.stringify(p)); }

export function hasSavedPlan() {
  try { return !!localStorage.getItem(PLAN_KEY); } catch (e) { return false; }
}

function migrate(plan) {
  if (!Array.isArray(plan.buildings) || !plan.buildings.length) {
    plan.buildings = [{ id: "main-house", name: "House" }];
  }
  plan.floors.forEach((f) => { if (!f.building) f.building = plan.buildings[0].id; });
  if (!Array.isArray(plan.outdoor)) plan.outdoor = clonePlan(defaultPlan.outdoor);
  const fix = (r) => {
    if (!r.poly && r.rects && r.rects.length) r.poly = polyFromRects(r.rects);
    if (r.poly && (!r.rects || !r.rects.length)) r.rects = rectsFromPoly(r.poly);
    if (r.icon === undefined) r.icon = null;
    if (r.color === undefined) r.color = null;
  };
  plan.floors.forEach((f) => f.rooms.forEach(fix));
  plan.outdoor.forEach(fix);
  plan.v = 2;
  return plan;
}

export function loadPlan() {
  let plan = null;
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && Array.isArray(p.floors)) plan = p;
    }
  } catch (e) { /* fall through */ }
  if (!plan) plan = clonePlan(defaultPlan);
  return migrate(plan);
}

export function savePlan(p) {
  try { localStorage.setItem(PLAN_KEY, JSON.stringify(p)); } catch (e) { /* ignore */ }
}

export function clearPlan() {
  try { localStorage.removeItem(PLAN_KEY); } catch (e) { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Geometry derivation. Grid resolution 0.2m: rooms snap to it in the editor.

const S = 0.2;

function rectArea(rc) { return Math.max(0, rc[2] - rc[0]) * Math.max(0, rc[3] - rc[1]); }

export function roomLabel(room) {
  // Center of the largest rect.
  if (!room.rects || !room.rects.length) return [0, 0];
  let best = room.rects[0];
  room.rects.forEach((rc) => { if (rectArea(rc) > rectArea(best)) best = rc; });
  return [r2((best[0] + best[2]) / 2), r2((best[1] + best[3]) / 2)];
}

// Trace boundary loops of a boolean cell grid. Edges are oriented with the
// inside on the left so loops close; collinear points are dropped.
function traceLoops(at, nx, nz, x0, z0) {
  const segs = new Map();
  const add = (a, b) => {
    const k = a[0] + "," + a[1];
    if (!segs.has(k)) segs.set(k, []);
    segs.get(k).push(b);
  };
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    if (!at(i, j)) continue;
    if (!at(i - 1, j)) add([i, j + 1], [i, j]);
    if (!at(i + 1, j)) add([i + 1, j], [i + 1, j + 1]);
    if (!at(i, j - 1)) add([i, j], [i + 1, j]);
    if (!at(i, j + 1)) add([i + 1, j + 1], [i, j + 1]);
  }
  const loops = [];
  while (segs.size) {
    const firstKey = segs.keys().next().value;
    let cur = firstKey.split(",").map(Number);
    const loop = [];
    for (let guard = 0; guard < 100000; guard++) {
      const k = cur[0] + "," + cur[1];
      const outs = segs.get(k);
      if (!outs || !outs.length) break;
      const nxt = outs.shift();
      if (!outs.length) segs.delete(k);
      loop.push(cur);
      cur = nxt;
      if (cur[0] + "," + cur[1] === firstKey) break;
    }
    if (loop.length >= 4) loops.push(loop);
  }
  return loops.map((lp) => {
    const pts = [];
    const n = lp.length;
    for (let k = 0; k < n; k++) {
      const p = lp[k], prev = lp[(k - 1 + n) % n], nxt = lp[(k + 1) % n];
      const c = (p[0] - prev[0]) * (nxt[1] - p[1]) - (p[1] - prev[1]) * (nxt[0] - p[0]);
      if (c !== 0) pts.push([r2(x0 + p[0] * S), r2(z0 + p[1] * S)]);
    }
    return pts;
  }).filter((p) => p.length >= 4);
}

export function signedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}

// Outer loops only (holes have opposite winding to the biggest loop).
function outerLoops(loops) {
  if (!loops.length) return [];
  let biggest = loops[0];
  loops.forEach((l) => { if (Math.abs(signedArea(l)) > Math.abs(signedArea(biggest))) biggest = l; });
  const sign = Math.sign(signedArea(biggest)) || 1;
  return loops.filter((l) => Math.sign(signedArea(l)) === sign);
}

function floorGrid(rooms) {
  let x1 = 1e9, z1 = 1e9, x2 = -1e9, z2 = -1e9;
  rooms.forEach((r) => r.rects.forEach((rc) => {
    x1 = Math.min(x1, rc[0]); z1 = Math.min(z1, rc[1]);
    x2 = Math.max(x2, rc[2]); z2 = Math.max(z2, rc[3]);
  }));
  if (x1 > x2) return null;
  const gi = (v, o) => Math.round((v - o) / S);
  const nx = gi(x2, x1), nz = gi(z2, z1);
  const owner = new Int16Array(nx * nz);
  rooms.forEach((r, idx) => r.rects.forEach((rc) => {
    const i1 = Math.max(0, gi(rc[0], x1)), i2 = Math.min(nx, gi(rc[2], x1));
    const j1 = Math.max(0, gi(rc[1], z1)), j2 = Math.min(nz, gi(rc[3], z1));
    for (let j = j1; j < j2; j++) for (let i = i1; i < i2; i++) owner[j * nx + i] = idx + 1;
  }));
  return { owner, nx, nz, x0: x1, z0: z1 };
}

function deriveWalls(g) {
  const { owner, nx, nz, x0, z0 } = g;
  const walls = [];
  for (let i = 1; i < nx; i++) {
    let run = -1;
    for (let j = 0; j <= nz; j++) {
      const a = j < nz ? owner[j * nx + i - 1] : 0;
      const b = j < nz ? owner[j * nx + i] : 0;
      const isB = j < nz && a && b && a !== b;
      if (isB && run < 0) run = j;
      if (!isB && run >= 0) {
        walls.push([r2(x0 + i * S), r2(z0 + run * S), r2(x0 + i * S), r2(z0 + j * S)]);
        run = -1;
      }
    }
  }
  for (let j = 1; j < nz; j++) {
    let run = -1;
    for (let i = 0; i <= nx; i++) {
      const a = i < nx ? owner[(j - 1) * nx + i] : 0;
      const b = i < nx ? owner[j * nx + i] : 0;
      const isB = i < nx && a && b && a !== b;
      if (isB && run < 0) run = i;
      if (!isB && run >= 0) {
        walls.push([r2(x0 + run * S), r2(z0 + j * S), r2(x0 + i * S), r2(z0 + j * S)]);
        run = -1;
      }
    }
  }
  return walls;
}

function pointCovered(x, z, floors) {
  return floors.some((f) => f.rooms.some((r) => r.rects.some(
    (rc) => x > rc[0] && x < rc[2] && z > rc[1] && z < rc[3])));
}

// Every room is an area: its id is the linked household area if it has one,
// otherwise its own key.
export function roomAreaId(room) { return room.area || room.key; }

// Turn a plan into the geometry structure home3d/engine.js renders.
export function planToGeometry(plan) {
  const floorsOut = {};
  const shaped = plan.floors.filter((f) => f.rooms.some((r) => r.rects.length));
  shaped.forEach((f) => {
    const rooms = f.rooms.filter((r) => r.rects.length);
    const g = floorGrid(rooms);
    if (!g) return;
    const at = (i, j) => i >= 0 && i < g.nx && j >= 0 && j < g.nz && g.owner[j * g.nx + i] > 0;
    const loops = outerLoops(traceLoops(at, g.nx, g.nz, g.x0, g.z0));
    if (!loops.length) return;
    let outline = loops[0];
    loops.forEach((l) => { if (Math.abs(signedArea(l)) > Math.abs(signedArea(outline))) outline = l; });
    floorsOut[f.id] = {
      slot: 0, // set below once all floors of the building are known
      building: f.building,
      height: f.height || 2.55,
      belowGround: !!f.belowGround,
      name: f.name,
      outline,
      walls: deriveWalls(g),
      rooms: rooms.map((r) => ({
        id: roomAreaId(r),
        name: r.name,
        color: r.color || null,
        icon: r.icon || null,
        rects: r.rects.map((rc) => rc.map(r2)),
        label: roomLabel(r),
      })),
      _grid: g,
    };
  });
  const ids = Object.keys(floorsOut);
  if (!ids.length) return null;

  // Slots: index within the building's stack (plan order, lowest first).
  plan.buildings.forEach((b) => {
    let slot = 0;
    plan.floors.forEach((f) => {
      if (f.building === b.id && floorsOut[f.id]) { floorsOut[f.id].slot = slot; slot++; }
    });
  });

  // Roofs, per building: full plate over the top at-grade floor; exposed
  // portions of lower at-grade floors get their own plates.
  const roofs = [];
  plan.buildings.forEach((b) => {
    const above = shaped.filter((f) => f.building === b.id && floorsOut[f.id] && !f.belowGround);
    if (!above.length) return;
    const top = above[above.length - 1];
    roofs.push({ over: top.id, label: "Roof" });
    for (let i = 0; i < above.length - 1; i++) {
      const f = above[i];
      const higher = above.slice(i + 1);
      const g = floorsOut[f.id]._grid;
      const at = (ci, cj) => {
        if (ci < 0 || ci >= g.nx || cj < 0 || cj >= g.nz) return false;
        if (!(g.owner[cj * g.nx + ci] > 0)) return false;
        const x = g.x0 + (ci + 0.5) * S, z = g.z0 + (cj + 0.5) * S;
        return !pointCovered(x, z, higher);
      };
      outerLoops(traceLoops(at, g.nx, g.nz, g.x0, g.z0)).forEach((loop) => {
        roofs.push({ over: f.id, clip: loop, label: null });
      });
    }
  });
  ids.forEach((id) => { delete floorsOut[id]._grid; });

  // Outdoor patches (drawn on the ground around the buildings)
  const outdoor = (plan.outdoor || []).filter((o) => o.poly && o.poly.length >= 4).map((o) => {
    const bb = polyBounds(o.poly);
    return {
      id: roomAreaId(o),
      name: o.name,
      icon: o.icon || null,
      color: o.color || null,
      poly: o.poly.map((p) => [r2(p[0]), r2(p[1])]),
      label: [r2((bb.x1 + bb.x2) / 2), r2((bb.z1 + bb.z2) / 2)],
    };
  });

  return {
    wall: { thickness: 0.14, roomWallHeight: 1.15 },
    buildings: plan.buildings.map((b) => ({ id: b.id, name: b.name })),
    floors: floorsOut,
    roofs,
    outdoor,
    plate: null,
    path: null,
    trees: [],
    hedges: [],
    neighbors: [],
  };
}

// ---------------------------------------------------------------------------
// Editor helpers

export function uid(prefix) {
  return (prefix || "r") + "-" + Math.random().toString(36).slice(2, 8);
}

export function snap(v) { return r2(Math.round(v / S) * S); }

export function rectsOverlap(a, b) {
  const eps = 0.001;
  return a[0] < b[2] - eps && a[2] > b[0] + eps && a[1] < b[3] - eps && a[3] > b[1] + eps;
}

export function roomOverlaps(rects, rooms, skipKey, obstacles) {
  if (rooms.some((r) => r.key !== skipKey && r.rects.some(
    (b) => rects.some((a) => rectsOverlap(a, b))))) return true;
  if (obstacles && obstacles.some((b) => rects.some((a) => rectsOverlap(a, b)))) return true;
  return false;
}

// Rects that an edited shape may not overlap:
// - a room on a floor: every room of every floor in OTHER buildings, plus all
//   outdoor patches (buildings and patches never interpenetrate);
// - an outdoor patch: every room of every floor (any building), plus is
//   checked against its sibling patches by roomOverlaps itself.
export function obstacleRects(plan, ctx) {
  const out = [];
  if (ctx.type === "floor") {
    const f = plan.floors[ctx.floorIdx];
    plan.floors.forEach((fl) => {
      if (fl.building !== f.building) fl.rooms.forEach((r) => r.rects.forEach((rc) => out.push(rc)));
    });
    (plan.outdoor || []).forEach((o) => (o.rects || []).forEach((rc) => out.push(rc)));
  } else {
    plan.floors.forEach((fl) => fl.rooms.forEach((r) => r.rects.forEach((rc) => out.push(rc))));
  }
  return out;
}

// Do the rooms of a floor form one connected shape (edge adjacency)?
export function floorConnected(rooms) {
  const rs = rooms.filter((r) => r.rects.length);
  if (rs.length <= 1) return true;
  const touch = (a, b) => {
    const eps = 0.001;
    const xOverlap = Math.min(a[2], b[2]) - Math.max(a[0], b[0]);
    const zOverlap = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
    return (xOverlap > eps && zOverlap >= -eps) && (zOverlap > eps && xOverlap >= -eps)
      ? true
      : (xOverlap > eps && Math.abs(zOverlap) < eps) || (zOverlap > eps && Math.abs(xOverlap) < eps) || (xOverlap > eps && zOverlap > eps);
  };
  const roomTouch = (r1, r2b) => r1.rects.some((a) => r2b.rects.some((b) => touch(a, b)));
  const seen = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const i = stack.pop();
    rs.forEach((r, j) => {
      if (!seen.has(j) && roomTouch(rs[i], r)) { seen.add(j); stack.push(j); }
    });
  }
  return seen.size === rs.length;
}

export function totalArea(plan) {
  let a = 0;
  plan.floors.forEach((f) => f.rooms.forEach((r) => r.rects.forEach((rc) => { a += rectArea(rc); })));
  return a;
}

// Scale everything (rooms and outdoor patches) around the overall centroid.
export function scalePlan(plan, k) {
  let x1 = 1e9, z1 = 1e9, x2 = -1e9, z2 = -1e9;
  const all = [];
  plan.floors.forEach((f) => f.rooms.forEach((r) => all.push(r)));
  (plan.outdoor || []).forEach((o) => all.push(o));
  all.forEach((r) => (r.rects || []).forEach((rc) => {
    x1 = Math.min(x1, rc[0]); z1 = Math.min(z1, rc[1]);
    x2 = Math.max(x2, rc[2]); z2 = Math.max(z2, rc[3]);
  }));
  if (x1 > x2) return plan;
  const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
  all.forEach((r) => {
    if (r.poly && r.poly.length >= 4) {
      r.poly = r.poly.map(([px, pz]) => [snap(cx + (px - cx) * k), snap(cz + (pz - cz) * k)]);
      const rects = rectsFromPoly(r.poly);
      if (rects.length) { r.rects = rects; return; }
    }
    r.rects = (r.rects || []).map((rc) => {
      let nx1 = snap(cx + (rc[0] - cx) * k), nz1 = snap(cz + (rc[1] - cz) * k);
      let nx2 = snap(cx + (rc[2] - cx) * k), nz2 = snap(cz + (rc[3] - cz) * k);
      if (nx2 - nx1 < S) nx2 = nx1 + S;
      if (nz2 - nz1 < S) nz2 = nz1 + S;
      return [nx1, nz1, nx2, nz2];
    });
  });
  return plan;
}

// ---------------------------------------------------------------------------
// Rectilinear polygons (the editable shape; rects are derived from it)

export function pointInPoly(x, z, poly) {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], zi = poly[i][1], xj = poly[j][0], zj = poly[j][1];
    if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) ins = !ins;
  }
  return ins;
}

export function polyBounds(poly) {
  let x1 = 1e9, z1 = 1e9, x2 = -1e9, z2 = -1e9;
  poly.forEach(([x, z]) => {
    x1 = Math.min(x1, x); z1 = Math.min(z1, z);
    x2 = Math.max(x2, x); z2 = Math.max(z2, z);
  });
  return { x1, z1, x2, z2 };
}

// One room's rects to a single outline polygon (largest boundary loop).
export function polyFromRects(rects) {
  const g = floorGrid([{ rects }]);
  if (!g) return [];
  const at = (i, j) => i >= 0 && i < g.nx && j >= 0 && j < g.nz && g.owner[j * g.nx + i] > 0;
  const loops = outerLoops(traceLoops(at, g.nx, g.nz, g.x0, g.z0));
  if (!loops.length) return [];
  let best = loops[0];
  loops.forEach((l) => { if (Math.abs(signedArea(l)) > Math.abs(signedArea(best))) best = l; });
  return best;
}

// Decompose a rectilinear polygon into row-strip rects (what the 3D consumes).
export function rectsFromPoly(poly) {
  if (!poly || poly.length < 4) return [];
  const bb = polyBounds(poly);
  const nx = Math.round((bb.x2 - bb.x1) / S), nz = Math.round((bb.z2 - bb.z1) / S);
  if (nx <= 0 || nz <= 0) return [];
  const inside = (i, j) => pointInPoly(bb.x1 + (i + 0.5) * S, bb.z1 + (j + 0.5) * S, poly);
  const rects = [];
  let prev = [];
  for (let j = 0; j < nz; j++) {
    const runs = [];
    let start = -1;
    for (let i = 0; i <= nx; i++) {
      const v = i < nx && inside(i, j);
      if (v && start < 0) start = i;
      if (!v && start >= 0) { runs.push([start, i]); start = -1; }
    }
    const cur = [];
    runs.forEach(([a, b]) => {
      const m = prev.find((p) => p.i1 === a && p.i2 === b && !p.taken);
      if (m) {
        m.taken = true;
        m.rect[3] = r2(bb.z1 + (j + 1) * S);
        cur.push({ i1: a, i2: b, rect: m.rect });
      } else {
        const rect = [r2(bb.x1 + a * S), r2(bb.z1 + j * S), r2(bb.x1 + b * S), r2(bb.z1 + (j + 1) * S)];
        rects.push(rect);
        cur.push({ i1: a, i2: b, rect });
      }
    });
    prev = cur;
  }
  return rects;
}

// Sanity check for an edited polygon: big enough, and not self-intersecting
// (raster area must match the shoelace area).
export function validPoly(poly) {
  if (!poly || poly.length < 4) return false;
  const area = Math.abs(signedArea(poly));
  if (area < 1.0) return false;
  const bb = polyBounds(poly);
  if (bb.x2 - bb.x1 < 1.2 || bb.z2 - bb.z1 < 1.2) return false;
  const nx = Math.round((bb.x2 - bb.x1) / S), nz = Math.round((bb.z2 - bb.z1) / S);
  let count = 0;
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    if (pointInPoly(bb.x1 + (i + 0.5) * S, bb.z1 + (j + 0.5) * S, poly)) count++;
  }
  return Math.abs(count * S * S - area) < 0.4;
}

// Drop consecutive coincident points (zero-length edges). Collinear points are
// kept on purpose: they are the added dots that let a wall extend in parts.
export function tidyPoly(poly) {
  const out = [];
  poly.forEach((p) => {
    const last = out[out.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push([r2(p[0]), r2(p[1])]);
  });
  while (out.length > 1 && out[0][0] === out[out.length - 1][0] && out[0][1] === out[out.length - 1][1]) out.pop();
  return out;
}

// Find a free spot for a new w x d shape near the existing ones.
export function findFreeSpot(rooms, w, d, obstacles) {
  const has = rooms.some((r) => r.rects.length);
  const seed = has ? rooms : null;
  let x1, z1, x2, z2;
  if (seed) {
    x1 = 1e9; z1 = 1e9; x2 = -1e9; z2 = -1e9;
    seed.forEach((r) => r.rects.forEach((rc) => {
      x1 = Math.min(x1, rc[0]); z1 = Math.min(z1, rc[1]);
      x2 = Math.max(x2, rc[2]); z2 = Math.max(z2, rc[3]);
    }));
  } else if (obstacles && obstacles.length) {
    x1 = 1e9; z1 = 1e9; x2 = -1e9; z2 = -1e9;
    obstacles.forEach((rc) => {
      x1 = Math.min(x1, rc[0]); z1 = Math.min(z1, rc[1]);
      x2 = Math.max(x2, rc[2]); z2 = Math.max(z2, rc[3]);
    });
  } else {
    return [0, 0, w, d];
  }
  const tries = [];
  for (let x = x1; x <= x2; x += 1) { tries.push([x, z2, x + w, z2 + d]); tries.push([x, z1 - d, x + w, z1]); }
  for (let z = z1; z <= z2; z += 1) { tries.push([x2, z, x2 + w, z + d]); tries.push([x1 - w, z, x1, z + d]); }
  for (let gap = 1; gap <= 4; gap += 1.5) {
    tries.push([x2 + gap, z1, x2 + gap + w, z1 + d]);
    tries.push([x1 - gap - w, z1, x1 - gap, z1 + d]);
  }
  for (const t of tries) {
    const rc = t.map(snap);
    if (!roomOverlaps([rc], rooms, null, obstacles)) return rc;
  }
  return [snap(x2 + 2), snap(z1), snap(x2 + 2 + w), snap(z1 + d)];
}

// Curated area colors and icons for the area settings sheet.
export const AREA_COLORS = [
  "#1C6FD6", "#2E8B57", "#B0722B", "#8A5FBF", "#C2554F", "#2A8F8A", "#B0568C", "#6B7280",
];
export const AREA_ICONS = [
  "sofa", "fridge", "silverware-fork-knife", "bed", "bed-king", "shower", "toilet", "door",
  "stairs", "garage", "washing-machine", "desk", "television", "gamepad-variant", "dumbbell",
  "baby-carriage", "bookshelf", "flower", "tree", "grill", "table-chair", "car", "pool", "paw",
];
