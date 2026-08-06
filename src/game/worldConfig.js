import { talentNodes } from "../constants/talentTree";

// ---------------------------------------------------------------------------
// Tuning — every gameplay-feel number lives here so it can be adjusted in one
// place. Distances are in world units; the island spans roughly ±26.
// ---------------------------------------------------------------------------
export const TUNING = {
  walkSpeed: 5.2,
  runSpeed: 9,
  acceleration: 18, // fast response when the player commits to a direction
  braking: 11, // slightly softer stop so motion keeps some weight
  airControl: 0.42,
  turnSpeed: 12, // how fast the character rotates to face travel
  jumpImpulse: 8.5,
  gravity: 24,
  coyoteTime: 0.11,
  jumpBufferTime: 0.13,
  jumpCutMultiplier: 0.48,
  cameraDistance: 9,
  cameraHeight: 3.4,
  cameraDamping: 3.2, // higher = tighter follow
  cameraRotationDamping: 10,
  cameraFocusDamping: 9,
  cameraDeadZone: 0.65,
  cameraMinDistance: 0.9, // lets the camera stay in front of very close cover
  cameraCollisionPadding: 0.45,
  cameraAutoRecenterDelay: 1.15,
  cameraAutoRecenterSpeed: 2.2,
  cameraFovBase: 55,
  cameraFovSprint: 63,
  interactReach: 3.6,
  collectReach: 1.6,
  islandRadius: 26,
};

// Biome palette — warm, controlled colours that break the monochrome look.
export const BIOMES = {
  grove: { ground: "#4f7a3a", accent: "#6f9a4a", fog: "#9db98a" },
  forest: { ground: "#37592f", accent: "#2c4726", fog: "#5c7250" },
  temple: { ground: "#8a7f66", accent: "#b6a888", fog: "#cbbf9e" },
  corrupted: { ground: "#3a2a52", accent: "#6a3f8f", fog: "#4a2f66" },
  overlook: { ground: "#5a6b7a", accent: "#8aa0b2", fog: "#a9c0d2" },
};

// Central raised plateau (the Temple). A cone frustum whose straight slope is
// matched exactly by getGroundHeight() so the character walks up it cleanly.
export const TEMPLE = { cx: 0, cz: -6, rTop: 5.5, rBottom: 10, height: 2.4 };

// Ground height at any point — the single source of truth for terrain
// collision. Kept a pure function so the renderer and controller never drift.
export const getGroundHeight = (x, z) => {
  const d = Math.hypot(x - TEMPLE.cx, z - TEMPLE.cz);
  if (d <= TEMPLE.rTop) return TEMPLE.height;
  if (d >= TEMPLE.rBottom) return 0;
  const t = (TEMPLE.rBottom - d) / (TEMPLE.rBottom - TEMPLE.rTop);
  return TEMPLE.height * t;
};

// Coloured biome discs used both to tint the ground and to pick footstep tone.
export const BIOME_REGIONS = [
  { id: "temple", x: 0, z: -6, radius: 11, biome: "temple" },
  { id: "corrupted", x: -13, z: -18, radius: 9, biome: "corrupted" },
  { id: "forest", x: -15, z: 4, radius: 10, biome: "forest" },
  { id: "overlook", x: 19, z: 3, radius: 8, biome: "overlook" },
  { id: "grove", x: 2, z: 13, radius: 14, biome: "grove" },
];

export const sampleBiome = (x, z) => {
  let best = "grove";
  let bestDist = Infinity;
  for (const region of BIOME_REGIONS) {
    const d = Math.hypot(x - region.x, z - region.z) - region.radius;
    if (d < bestDist) {
      bestDist = d;
      best = region.biome;
    }
  }
  return best;
};

// ---------------------------------------------------------------------------
// Locations — every skill group and portfolio section becomes a real place.
// `kind` drives which stylized landmark model renders.
// ---------------------------------------------------------------------------
const nodeById = Object.fromEntries(talentNodes.map((n) => [n.id, n]));

export const LOCATIONS = [
  {
    id: "root",
    kind: "core",
    title: "The Talent Core",
    subtitle: "Heart of the island",
    biome: "temple",
    position: [0, -6],
    body:
      "Every skill on this island channels back to the Core. Discover all the shrines to light it fully.",
  },
  {
    id: "about",
    kind: "camp",
    title: "Traveler's Camp",
    subtitle: "About Me",
    section: "about",
    biome: "grove",
    position: [-5, 15],
    body:
      "Min Khant Than Swe (Diff) — a Java developer with a backend-first mindset, building production-minded fullstack systems. Rest by the fire, then read the full story on the site.",
  },
  {
    id: "languages",
    kind: "shrine",
    title: "Shrine of Tongues",
    subtitle: "Languages",
    biome: "grove",
    position: [4, 4],
    node: "languages",
  },
  {
    id: "frontend",
    kind: "shrine",
    title: "Loom of Interfaces",
    subtitle: "Front-end",
    biome: "forest",
    position: [-12, -1],
    node: "frontend",
  },
  {
    id: "backend",
    kind: "shrine",
    title: "Forge of Services",
    subtitle: "Back-end",
    biome: "temple",
    position: [12, -3],
    node: "backend",
  },
  {
    id: "databases",
    kind: "shrine",
    title: "Vault of Records",
    subtitle: "Databases",
    biome: "temple",
    position: [-4, -13],
    node: "databases",
  },
  {
    id: "tools",
    kind: "shrine",
    title: "Tinker's Yard",
    subtitle: "Tools",
    biome: "overlook",
    position: [14, -9],
    node: "tools",
  },
  {
    id: "exploring",
    kind: "shrine",
    title: "The Frontier",
    subtitle: "Exploring",
    biome: "corrupted",
    position: [-14, -16],
    node: "exploring",
  },
  {
    id: "projects",
    kind: "workshop",
    title: "The Workshop",
    subtitle: "Projects",
    section: "projects",
    biome: "forest",
    position: [-13, 10],
    body:
      "Where the builds take shape — a multi-vendor commerce platform, an AI finance coach, and more. Open the workbench to see them on the site.",
  },
  {
    id: "experiences",
    kind: "hall",
    title: "Chronicle Hall",
    subtitle: "Experience",
    section: "experiences",
    biome: "grove",
    position: [1, 19],
    body:
      "The hall records the journey — internship to permanent Java Developer at Sunline Technology, and the freelance road before it.",
  },
  {
    id: "education",
    kind: "library",
    title: "The Old Library",
    subtitle: "Education",
    section: "education",
    biome: "overlook",
    position: [11, 13],
    body:
      "Software Engineering, Mae Fah Luang University — graduated 2026 with a final GPA of 3.82, plus achievements along the way.",
  },
  {
    id: "contact",
    kind: "beacon",
    title: "Messenger Beacon",
    subtitle: "Let's Talk",
    section: "contact",
    biome: "overlook",
    position: [20, 4],
    body:
      "Light the beacon to send word. Open it to reach the contact form, email, or socials on the site.",
  },
];

// Attach resolved skill lists to shrine locations.
export const LOCATIONS_RESOLVED = LOCATIONS.map((loc) => ({
  ...loc,
  skills: loc.node ? nodeById[loc.node]?.skills ?? [] : [],
}));

export const SKILL_LOCATION_IDS = LOCATIONS_RESOLVED.filter(
  (l) => l.kind === "shrine"
).map((l) => l.id);

// Curved-ish walking paths (poly-lines of waypoints) that connect the camp to
// each landmark, laid on the ground as lantern-lit trails.
export const PATHS = [
  [[2, 13], [3, 6], [4, 4]],
  [[2, 13], [-6, 9], [-12, -1]],
  [[4, 4], [10, -1], [12, -3]],
  [[4, 4], [1, -6], [-4, -13]],
  [[12, -3], [14, -9]],
  [[-12, -1], [-13, -9], [-14, -16]],
  [[2, 13], [1, 19]],
  [[2, 13], [7, 14], [11, 13]],
  [[11, 13], [16, 8], [20, 4]],
  [[2, 13], [-5, 15]],
  [[2, 13], [-8, 11], [-13, 10]],
];

// Collectible "memory fragments" scattered along the trails.
export const COLLECTIBLES = [
  { id: "frag-1", position: [3, 8] },
  { id: "frag-2", position: [-7, 6] },
  { id: "frag-3", position: [9, 0] },
  { id: "frag-4", position: [-2, -9] },
  { id: "frag-5", position: [14, -6] },
  { id: "frag-6", position: [-13, -8] },
  { id: "frag-7", position: [6, 16] },
  { id: "frag-8", position: [15, 9] },
  { id: "frag-9", position: [-10, 13] },
  { id: "frag-10", position: [18, 1] },
];

export const SPAWN = [2, 13];
