// Home geometry for the 3D home view. Hand-authored to fit the household.js
// structure (basement / ground / first + outdoor areas). Units are meters.
// Plan coordinates: x runs west->east, z runs street(front, -z is street side)
// -> garden (back). y is up. The house front door faces the street at z = 0.
//
// This is THE one structure to tweak when reshaping the home. Everything the
// engine renders (footprints, walls, rooms, outdoor patches, neighbors) is
// derived from it.

export const homeGeometry = {
  // Wall thickness / heights used everywhere
  wall: { thickness: 0.14, roomWallHeight: 1.15 },

  // Floors keyed by household.js floor ids. `slot` is the physical stack index
  // (0 = lowest). `height` is the storey height of the rest-view volume.
  floors: {
    basement: {
      slot: 0, height: 2.4, belowGround: true,
      // Smaller footprint than the house above
      outline: [[0, 0], [5, 0], [5, 6], [0, 6]],
      walls: [],
      rooms: [
        { id: "utility", rects: [[0, 0, 5, 6]], label: [2.5, 3] },
      ],
    },
    ground: {
      slot: 1, height: 2.75,
      // L-shaped: main block + garage wing (west) + annex wing (east, back)
      outline: [
        [-3.5, 0], [8, 0], [8, 4], [11, 4], [11, 9], [0, 9], [0, 6], [-3.5, 6],
      ],
      // Interior partitions: [x1, z1, x2, z2]
      walls: [
        [0, 0, 0, 6],        // garage / main block
        [3.2, 0, 3.2, 4],    // kitchen / hallway
        [5.2, 0, 5.2, 4],    // hallway / living front part
        [0, 4, 5.2, 4],      // kitchen + hallway back wall
        [8, 4, 8, 9],        // living / annex
        [8, 7.2, 11, 7.2],   // annex room / ensuite
      ],
      rooms: [
        { id: "kitchen", rects: [[0, 0, 3.2, 4]], label: [1.6, 2] },
        { id: "hallway", rects: [[3.2, 0, 5.2, 4]], label: [4.2, 2] },
        { id: "living-room", rects: [[0, 4, 8, 9], [5.2, 0, 8, 4]], label: [4, 6.5] },
        { id: "garage", rects: [[-3.5, 0, 0, 6]], label: [-1.75, 3] },
        { id: "greet-room", rects: [[8, 4, 11, 7.2]], label: [9.5, 5.6] },
        { id: "greet-ensuite", rects: [[8, 7.2, 11, 9]], label: [9.5, 8.1] },
      ],
    },
    first: {
      slot: 2, height: 2.55,
      // Only over the main block; the garage and annex wings have flat roofs
      outline: [[0, 0], [8, 0], [8, 9], [0, 9]],
      walls: [
        [0, 4, 8, 4],        // front rooms / back rooms
        [4.2, 4, 4.2, 9],    // main bedroom / Tess
        [3.4, 0, 3.4, 4],    // Lars / landing
        [5.0, 0, 5.0, 4],    // landing / bathroom
      ],
      rooms: [
        { id: "main-bedroom", rects: [[0, 4, 4.2, 9]], label: [2.1, 6.5] },
        { id: "tess-room", rects: [[4.2, 4, 8, 9]], label: [6.1, 6.5] },
        { id: "lars-room", rects: [[0, 0, 3.4, 4]], label: [1.7, 2] },
        { id: "bathroom", rects: [[5.0, 0, 8, 4]], label: [6.5, 2] },
        { id: "landing", name: "Landing", rects: [[3.4, 0, 5.0, 4]], label: [4.2, 2] },
      ],
    },
  },

  // Flat roof plates: over which outline, at the top of which floor.
  roofs: [
    { over: "first", label: "Roof" },                       // main block roof
    { over: "ground", clip: [[-3.5, 0], [0, 0], [0, 6], [-3.5, 6]], label: null },   // garage roof
    { over: "ground", clip: [[8, 4], [11, 4], [11, 9], [8, 9]], label: null },       // annex roof
  ],

  // Ground plate + outdoor areas (keyed to household outdoorAreas ids)
  plate: { x1: -13, z1: -9, x2: 19, z2: 16, radius: 1.2 },
  outdoor: [
    { id: "driveway", kind: "paving", rect: [-3.6, -9, 0.4, 0], label: [-1.6, -3.5] },
    { id: "garden", kind: "grass", rect: [-6, 9.6, 14, 15.4], label: [4, 12.5] },
    { id: "patio", kind: "paving", rect: [0.6, 9.6, 5.4, 12.4], label: [3, 11] },
  ],
  // Front path from the door to the street edge
  path: { rect: [3.6, -9, 4.8, 0] },
  trees: [
    { at: [-8.5, 12], size: 1.35 },   // garden tree
    { at: [15.5, 2], size: 1.0 },
    { at: [-10, -5.5], size: 0.8 },
  ],
  hedges: [
    { from: [-13, 9.3], to: [-0.8, 9.3] },   // west garden boundary piece
    { from: [12.2, 4.2], to: [12.2, 15.6] }, // east boundary
    { from: [-12.6, -0.4], to: [-12.6, 8.9] },
  ],

  // Ghost neighbor houses: simple gabled volumes, faded
  neighbors: [
    { at: [-19, 3], w: 8, d: 10, h: 5.6, rot: 0 },
    { at: [24.5, 4], w: 7.5, d: 9, h: 5.2, rot: 0 },
    { at: [4, -22], w: 9, d: 8, h: 5.4, rot: Math.PI },
  ],
};
