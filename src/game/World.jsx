import { useMemo } from "react";
import { Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  BIOMES,
  BIOME_REGIONS,
  COLLECTIBLES,
  LOCATIONS_RESOLVED,
  PATHS,
  SKILL_LOCATION_IDS,
  TEMPLE,
  TUNING,
  getGroundHeight,
} from "./worldConfig";
import {
  Cloud,
  DeadTree,
  Fireflies,
  Fence,
  Flower,
  Lantern,
  MemoryFragment,
  Mushroom,
  Pond,
  RuinedGateway,
  Rock,
  Tree,
} from "./props";
import { Landmark } from "./landmarks";

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const farFromLandmarks = (x, z, min = 3.4) =>
  LOCATIONS_RESOLVED.every(
    (l) => Math.hypot(x - l.position[0], z - l.position[1]) > min
  );

// Deterministic, biome-aware scatter placed around each region rather than
// uniformly random, so the world reads as composed instead of noisy.
const useScatter = () =>
  useMemo(() => {
    const rand = mulberry32(1337);
    const trees = [];
    const flowers = [];
    const mushrooms = [];
    const rocks = [];
    const deadTrees = [];

    BIOME_REGIONS.forEach((region, ri) => {
      const density = region.biome === "grove" ? 10 : region.biome === "forest" ? 14 : 7;
      for (let i = 0; i < density; i += 1) {
        const a = (i / density) * Math.PI * 2 + rand() * 0.6;
        const r = region.radius * (0.62 + rand() * 0.42);
        const x = region.x + Math.cos(a) * r;
        const z = region.z + Math.sin(a) * r;
        if (Math.hypot(x, z) > TUNING.islandRadius - 1.5) continue;
        if (!farFromLandmarks(x, z)) continue;
        const phase = rand() * Math.PI * 2;
        const scale = 0.75 + rand() * 0.6;
        if (region.biome === "corrupted") {
          deadTrees.push({ key: `dt-${ri}-${i}`, position: [x, getGroundHeight(x, z), z], scale, phase });
        } else if (region.biome === "temple" || region.biome === "overlook") {
          rocks.push({ key: `rk-${ri}-${i}`, position: [x, getGroundHeight(x, z) + 0.2 * scale, z], scale, rot: rand() * 6 });
        } else {
          const tint = region.biome === "forest" ? "#2c4726" : "#3f6a34";
          trees.push({ key: `tr-${ri}-${i}`, position: [x, getGroundHeight(x, z), z], scale, phase, tint });
        }
      }
    });

    // flowers + mushrooms sprinkled in the grove / forest
    const grove = BIOME_REGIONS.find((r) => r.biome === "grove");
    for (let i = 0; i < 26; i += 1) {
      const a = rand() * Math.PI * 2;
      const r = grove.radius * rand();
      const x = grove.x + Math.cos(a) * r;
      const z = grove.z + Math.sin(a) * r;
      if (!farFromLandmarks(x, z, 2)) continue;
      const colors = ["#e8b8d0", "#f0d68a", "#c8b0e8", "#ffffff"];
      flowers.push({ key: `fl-${i}`, position: [x, getGroundHeight(x, z), z], color: colors[i % colors.length] });
    }
    const forest = BIOME_REGIONS.find((r) => r.biome === "forest");
    for (let i = 0; i < 12; i += 1) {
      const a = rand() * Math.PI * 2;
      const r = forest.radius * rand();
      const x = forest.x + Math.cos(a) * r;
      const z = forest.z + Math.sin(a) * r;
      if (!farFromLandmarks(x, z, 2)) continue;
      mushrooms.push({ key: `mu-${i}`, position: [x, getGroundHeight(x, z), z], scale: 0.7 + rand() * 0.7 });
    }

    return { trees, flowers, mushrooms, rocks, deadTrees };
  }, []);

const Ground = () => (
  <group>
    {/* base island */}
    <mesh position={[0, -0.05, 0]} receiveShadow>
      <cylinderGeometry args={[TUNING.islandRadius, TUNING.islandRadius - 1.5, 1.2, 72]} />
      <meshStandardMaterial color={BIOMES.grove.ground} roughness={1} flatShading />
    </mesh>
    {/* rocky underside */}
    <mesh position={[0, -5, 0]} rotation-x={Math.PI}>
      <coneGeometry args={[TUNING.islandRadius - 1, 9, 13, 4]} />
      <meshStandardMaterial color="#3a2f28" roughness={1} flatShading />
    </mesh>
    {/* biome colour patches */}
    {BIOME_REGIONS.filter((r) => r.biome !== "grove").map((region) => (
      <mesh key={region.id} position={[region.x, 0.56, region.z]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[region.radius, 48]} />
        <meshStandardMaterial color={BIOMES[region.biome].ground} roughness={1} transparent opacity={0.92} />
      </mesh>
    ))}
    {/* temple plateau (matches getGroundHeight frustum exactly) */}
    <mesh position={[TEMPLE.cx, TEMPLE.height / 2 + 0.55, TEMPLE.cz]}>
      <cylinderGeometry args={[TEMPLE.rTop, TEMPLE.rBottom, TEMPLE.height, 48]} />
      <meshStandardMaterial color={BIOMES.temple.ground} roughness={1} flatShading />
    </mesh>
    {/* temple stairs cue on the south face */}
    {[0, 1, 2, 3].map((i) => (
      <mesh key={i} position={[TEMPLE.cx, 0.6 + i * 0.5, TEMPLE.cz + TEMPLE.rBottom - 0.4 - i * 1]}>
        <boxGeometry args={[3, 0.3, 1]} />
        <meshStandardMaterial color={BIOMES.temple.accent} roughness={1} flatShading />
      </mesh>
    ))}
    {/* glowing rim */}
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.6, 0]}>
      <ringGeometry args={[TUNING.islandRadius - 0.6, TUNING.islandRadius - 0.2, 80]} />
      <meshBasicMaterial color="#ffe9a8" transparent opacity={0.35} />
    </mesh>
  </group>
);

const Trails = () => {
  const trails = useMemo(
    () =>
      PATHS.map((waypoints, i) => {
        const pts = waypoints.map(([x, z]) => new THREE.Vector3(x, getGroundHeight(x, z) + 0.08, z));
        const curve = new THREE.CatmullRomCurve3(pts);
        return { key: `path-${i}`, points: curve.getPoints(waypoints.length * 8) };
      }),
    []
  );
  return (
    <>
      {trails.map((t) => (
        <Line key={t.key} points={t.points} color="#d8c89a" transparent opacity={0.35} lineWidth={2.5} />
      ))}
    </>
  );
};

const Lanterns = () => {
  const lanterns = useMemo(() => {
    const list = [];
    PATHS.forEach((wp, pi) => {
      wp.forEach(([x, z], i) => {
        if (i % 2 === 0) return;
        list.push({ key: `ln-${pi}-${i}`, position: [x + 0.6, getGroundHeight(x, z), z] });
      });
    });
    return list;
  }, []);
  return (
    <>
      {lanterns.map((l, i) => (
        <Lantern key={l.key} position={l.position} light={i % 2 === 0} />
      ))}
    </>
  );
};

const World = ({ nearId, discovered, collected }) => {
  const scatter = useScatter();
  const activation = discovered
    ? SKILL_LOCATION_IDS.filter((id) => discovered.has(id)).length / SKILL_LOCATION_IDS.length
    : 0;

  return (
    <>
      <color attach="background" args={["#0d1420"]} />
      <fog attach="fog" args={["#1a2436", 26, 74]} />

      {/* warm key light + cool fill */}
      <hemisphereLight args={["#cfe0ff", "#2a2418", 0.55]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[14, 22, 8]} intensity={1.5} color="#ffe6c0" />
      <directionalLight position={[-12, 8, -10]} intensity={0.35} color="#7ea8ff" />

      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[26, 24, 1, 48]} />
        <meshStandardMaterial color="#4f7a3a" />
      </mesh>
      <Stars radius={90} depth={40} count={1800} factor={3} fade speed={0.4} />

      <Ground />
      <Trails />
      <Lanterns />

      {/* scatter */}
      {scatter.trees.map((t) => (
        <Tree key={t.key} position={t.position} scale={t.scale} phase={t.phase} tint={t.tint} />
      ))}
      {scatter.deadTrees.map((t) => (
        <DeadTree key={t.key} position={t.position} scale={t.scale} phase={t.phase} />
      ))}
      {scatter.rocks.map((r) => (
        <Rock key={r.key} position={r.position} scale={r.scale} rotation={r.rot} />
      ))}
      {scatter.flowers.map((f) => (
        <Flower key={f.key} position={f.position} color={f.color} />
      ))}
      {scatter.mushrooms.map((m) => (
        <Mushroom key={m.key} position={m.position} scale={m.scale} />
      ))}

      {/* set-dressing landmarks that aren't interactive */}
      <RuinedGateway position={[2, getGroundHeight(2, 9), 9]} rotation={0.2} />
      <Fence position={[-6.5, getGroundHeight(-6, 15), 15]} rotation={0.3} length={2.4} />
      <Fence position={[-3.5, getGroundHeight(-3, 16.5), 16.5]} rotation={-0.2} length={2} />
      <Pond position={[8, getGroundHeight(8, 11) + 0.05, 11]} radius={2.6} />

      {/* atmosphere */}
      <Fireflies position={[-15, 1.5, 4]} count={16} color="#cfe89a" radius={6} />
      <Fireflies position={[-13, 1.5, -16]} count={20} color="#c89aff" radius={6} />
      <Cloud position={[-14, 12, -6]} scale={2.2} speed={1} range={5} />
      <Cloud position={[16, 14, 8]} scale={2.8} speed={0.7} range={6} />
      <Cloud position={[4, 16, 18]} scale={2} speed={1.3} range={4} />

      {/* corrupted-area mist */}
      <mesh position={[-13, 1.4, -17]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[9, 32]} />
        <meshBasicMaterial color="#6a3f8f" transparent opacity={0.14} />
      </mesh>

      {/* interactive landmarks */}
      {LOCATIONS_RESOLVED.map((location) => (
        <Landmark
          key={location.id}
          location={location}
          groundY={getGroundHeight(location.position[0], location.position[1])}
          isNear={nearId === location.id}
          discovered={discovered ? discovered.has(location.id) : false}
          activation={location.kind === "core" ? activation : 0}
        />
      ))}

      {/* collectibles */}
      {COLLECTIBLES.filter((c) => !(collected && collected.has(c.id))).map((c) => (
        <MemoryFragment key={c.id} position={c.position} />
      ))}
    </>
  );
};

export default World;
