import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { getGroundHeight } from "./worldConfig";

// --- Small natural props -------------------------------------------------

export const Tree = ({ position, scale = 1, phase = 0, tint = "#2f5a2c" }) => {
  const foliageRef = useRef(null);
  useFrame((state) => {
    if (!foliageRef.current) return;
    const t = state.clock.elapsedTime;
    foliageRef.current.rotation.z = Math.sin(t * 1.1 + phase) * 0.05;
    foliageRef.current.rotation.x = Math.cos(t * 0.9 + phase) * 0.04;
  });
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 1.2, 6]} />
        <meshStandardMaterial color="#5a4432" roughness={1} />
      </mesh>
      <group ref={foliageRef} position={[0, 1.2, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <coneGeometry args={[0.85, 1.4, 8]} />
          <meshStandardMaterial color={tint} roughness={1} flatShading />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <coneGeometry args={[0.6, 1.1, 8]} />
          <meshStandardMaterial color={tint} roughness={1} flatShading />
        </mesh>
        <mesh position={[0, 1.85, 0]} castShadow>
          <coneGeometry args={[0.38, 0.8, 8]} />
          <meshStandardMaterial color={tint} roughness={1} flatShading />
        </mesh>
      </group>
    </group>
  );
};

export const DeadTree = ({ position, scale = 1, phase = 0 }) => {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + phase) * 0.03;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.18, 1.8, 5]} />
        <meshStandardMaterial color="#2a2233" roughness={1} flatShading />
      </mesh>
      <mesh position={[0.25, 1.5, 0]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.04, 0.08, 0.7, 5]} />
        <meshStandardMaterial color="#2a2233" roughness={1} />
      </mesh>
      <mesh position={[-0.22, 1.7, 0.1]} rotation={[0, 0, 1.1]}>
        <cylinderGeometry args={[0.04, 0.07, 0.6, 5]} />
        <meshStandardMaterial color="#2a2233" roughness={1} />
      </mesh>
    </group>
  );
};

export const Flower = ({ position, color = "#e8b8d0" }) => (
  <group position={position}>
    <mesh position={[0, 0.12, 0]}>
      <cylinderGeometry args={[0.015, 0.015, 0.24, 4]} />
      <meshStandardMaterial color="#3f6a34" />
    </mesh>
    <mesh position={[0, 0.26, 0]}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} roughness={0.6} />
    </mesh>
  </group>
);

export const Mushroom = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.12, 0]}>
      <cylinderGeometry args={[0.06, 0.08, 0.24, 8]} />
      <meshStandardMaterial color="#e8e0d0" roughness={0.8} />
    </mesh>
    <mesh position={[0, 0.26, 0]}>
      <sphereGeometry args={[0.16, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#b8506a" emissive="#b8506a" emissiveIntensity={0.25} roughness={0.6} />
    </mesh>
  </group>
);

export const Lantern = ({ position, color = "#ffcf87", light = true }) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.05, 0.06, 1, 6]} />
      <meshStandardMaterial color="#3a2f28" roughness={1} />
    </mesh>
    <mesh position={[0, 1.08, 0]}>
      <boxGeometry args={[0.22, 0.28, 0.22]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
    {light && <pointLight position={[0, 1.08, 0]} intensity={3} distance={5} decay={2} color={color} />}
  </group>
);

export const Rock = ({ position, scale = 1, rotation = 0 }) => (
  <mesh position={position} scale={scale} rotation-y={rotation} castShadow>
    <dodecahedronGeometry args={[0.5, 0]} />
    <meshStandardMaterial color="#7c7266" roughness={1} flatShading />
  </mesh>
);

export const Fence = ({ position, rotation = 0, length = 2 }) => (
  <group position={position} rotation-y={rotation}>
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[0.08, 0.7, 0.08]} />
      <meshStandardMaterial color="#5a4432" roughness={1} />
    </mesh>
    <mesh position={[length, 0.5, 0]}>
      <boxGeometry args={[0.08, 0.7, 0.08]} />
      <meshStandardMaterial color="#5a4432" roughness={1} />
    </mesh>
    <mesh position={[length / 2, 0.6, 0]}>
      <boxGeometry args={[length, 0.06, 0.05]} />
      <meshStandardMaterial color="#6a5240" roughness={1} />
    </mesh>
    <mesh position={[length / 2, 0.35, 0]}>
      <boxGeometry args={[length, 0.06, 0.05]} />
      <meshStandardMaterial color="#6a5240" roughness={1} />
    </mesh>
  </group>
);

export const RuinedGateway = ({ position, rotation = 0 }) => (
  <group position={position} rotation-y={rotation}>
    <mesh position={[-1, 1.3, 0]} rotation-z={0.04}>
      <boxGeometry args={[0.5, 2.6, 0.5]} />
      <meshStandardMaterial color="#8a7f66" roughness={1} flatShading />
    </mesh>
    <mesh position={[1, 1.1, 0]} rotation-z={-0.05}>
      <boxGeometry args={[0.5, 2.2, 0.5]} />
      <meshStandardMaterial color="#8a7f66" roughness={1} flatShading />
    </mesh>
    <mesh position={[-0.1, 2.5, 0]} rotation-z={0.08}>
      <boxGeometry args={[2.4, 0.45, 0.5]} />
      <meshStandardMaterial color="#9a8f76" roughness={1} flatShading />
    </mesh>
  </group>
);

// --- Environmental effects ----------------------------------------------

export const Fireflies = ({ position, count = 14, color = "#cfe89a", radius = 4 }) => (
  <Sparkles
    position={position}
    count={count}
    scale={[radius, 2.4, radius]}
    size={2.4}
    speed={0.4}
    color={color}
  />
);

export const Cloud = ({ position, scale = 1, speed = 0.4, range = 6 }) => {
  const ref = useRef(null);
  const start = useMemo(() => position[0], [position]);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = start + Math.sin(state.clock.elapsedTime * 0.05 * speed) * range;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {[[0, 0, 0], [1.1, -0.2, 0.3], [-1.1, -0.1, -0.2], [0.4, 0.3, 0.5]].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.9, 10, 10]} />
          <meshStandardMaterial color="#dfe6ee" transparent opacity={0.5} roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

export const Pond = ({ position, radius = 3 }) => {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
      ref.current.scale.set(s, 1, s);
    }
  });
  return (
    <mesh ref={ref} position={position} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[radius, 40]} />
      <meshStandardMaterial color="#3d6b7a" metalness={0.6} roughness={0.15} transparent opacity={0.85} />
    </mesh>
  );
};

// --- Collectible ---------------------------------------------------------

export const MemoryFragment = ({ position }) => {
  const ref = useRef(null);
  const y = getGroundHeight(position[0], position[1]);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 1.5;
      ref.current.position.y = y + 1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });
  return (
    <group>
      <mesh ref={ref} position={[position[0], y + 1.1, position[1]]}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#ffe9a8" emissive="#ffcf5a" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
      {/* halo billboard instead of a point light — keeps the dynamic-light
          count low (this scene already runs many lights) */}
      <Sparkles position={[position[0], y + 1.1, position[1]]} count={6} scale={1} size={2} speed={0.5} color="#ffe9a8" />
    </group>
  );
};

// --- Floating name label reused by landmarks -----------------------------

// Labels are drawn to a 2D canvas and shown on a Sprite (always camera-facing),
// deliberately avoiding drei's troika <Text>, whose worker/OffscreenCanvas
// construction was the source of the "Illegal constructor" crash.
const makeLabelTexture = (title, subtitle) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 512, 160);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.font = "bold 54px system-ui, sans-serif";
  ctx.strokeStyle = "rgba(10,8,4,0.85)";
  ctx.lineWidth = 8;
  ctx.strokeText(title, 256, 58);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 256, 58);
  if (subtitle) {
    ctx.font = "30px system-ui, sans-serif";
    ctx.strokeStyle = "rgba(10,8,4,0.75)";
    ctx.lineWidth = 6;
    ctx.strokeText(subtitle, 256, 112);
    ctx.fillStyle = "#c9c2b0";
    ctx.fillText(subtitle, 256, 112);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
};

export const LocationLabel = ({ y, title, subtitle, isNear, discovered }) => {
  const texture = useMemo(() => makeLabelTexture(title, subtitle), [title, subtitle]);
  const color = isNear ? "#ffffff" : discovered ? "#f3e7c8" : "#c9c2b0";
  return (
    <sprite position={[0, y, 0]} scale={[4.2, 1.31, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} color={color} />
    </sprite>
  );
};

export { Float };
