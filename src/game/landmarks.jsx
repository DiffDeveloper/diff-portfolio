import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { BIOMES } from "./worldConfig";
import { LocationLabel } from "./props";

const NearRing = ({ isNear, discovered, radius = 2.2 }) => {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
    ref.current.scale.setScalar(isNear ? pulse : 1);
    ref.current.material.opacity = isNear ? 0.9 : discovered ? 0.5 : 0.22;
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, 0.06, 0]}>
      <ringGeometry args={[radius - 0.2, radius, 40]} />
      <meshBasicMaterial color={isNear ? "#ffffff" : discovered ? "#ffe9a8" : "#8a8270"} transparent opacity={0.3} />
    </mesh>
  );
};

const GuidanceBeam = ({ color }) => {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 1.7) * 0.2;
    ref.current.scale.x = pulse;
    ref.current.scale.z = pulse;
    ref.current.material.opacity = 0.1 + pulse * 0.045;
  });
  return (
    <mesh ref={ref} position={[0, 11.5, 0]}>
      <cylinderGeometry args={[0.08, 0.28, 20, 12, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.14}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
};

const Core = ({ activation, isNear }) => {
  const coreRef = useRef(null);
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      const s = 0.8 + activation * 0.6;
      coreRef.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 3, 1.6, Math.sin(a) * 3]}>
            <boxGeometry args={[0.5, 3.2, 0.5]} />
            <meshStandardMaterial color="#b6a888" roughness={0.9} flatShading />
          </mesh>
        );
      })}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[3.6, 4, 0.3, 6]} />
        <meshStandardMaterial color="#9a8f76" roughness={1} flatShading />
      </mesh>
      <Float speed={2} rotationIntensity={1} floatIntensity={0.8}>
        <mesh ref={coreRef} position={[0, 3.4, 0]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffe6a0"
            emissiveIntensity={0.4 + activation * 2}
            toneMapped={false}
            roughness={0.2}
          />
        </mesh>
      </Float>
      <pointLight position={[0, 3.4, 0]} intensity={2 + activation * 8} distance={16} decay={2} color="#ffdd99" />
      {activation >= 1 && <Sparkles count={40} scale={[7, 5, 7]} position={[0, 3, 0]} size={3} speed={0.5} color="#ffe9a8" />}
      <NearRing isNear={isNear} discovered={activation > 0} radius={4.4} />
    </group>
  );
};

const Camp = ({ isNear, discovered }) => {
  const fireRef = useRef(null);
  useFrame((state) => {
    if (fireRef.current) {
      fireRef.current.material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 12) * 0.5;
    }
  });
  return (
    <group>
      <mesh position={[0, 0.9, -0.3]}>
        <coneGeometry args={[1.3, 1.8, 4]} />
        <meshStandardMaterial color="#c67b4f" roughness={1} flatShading />
      </mesh>
      <group position={[1.6, 0, 0.6]}>
        <mesh ref={fireRef} position={[0, 0.25, 0]}>
          <coneGeometry args={[0.25, 0.6, 6]} />
          <meshStandardMaterial color="#ff8a3c" emissive="#ff6a1c" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.3]} rotation-z={0.6} rotation-y={a}>
              <cylinderGeometry args={[0.05, 0.05, 0.6, 5]} />
              <meshStandardMaterial color="#5a4432" roughness={1} />
            </mesh>
          );
        })}
        <pointLight position={[0, 0.6, 0]} intensity={5} distance={6} decay={2} color="#ff8a3c" />
        <Sparkles count={10} scale={[0.6, 1.4, 0.6]} position={[0, 0.9, 0]} size={1.5} speed={0.6} color="#ffb26a" />
      </group>
      <NearRing isNear={isNear} discovered={discovered} radius={2.6} />
    </group>
  );
};

const Shrine = ({ color, isNear, discovered }) => {
  const runeRef = useRef(null);
  useFrame((state) => {
    if (runeRef.current) runeRef.current.rotation.y = state.clock.elapsedTime * 1.2;
  });
  return (
    <group>
      {/* torii-style arch */}
      <mesh position={[-1, 1.2, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 2.4, 8]} />
        <meshStandardMaterial color="#7a6f58" roughness={1} />
      </mesh>
      <mesh position={[1, 1.2, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 2.4, 8]} />
        <meshStandardMaterial color="#7a6f58" roughness={1} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[2.6, 0.24, 0.34]} />
        <meshStandardMaterial color="#8a7f66" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[2.2, 0.16, 0.28]} />
        <meshStandardMaterial color="#8a7f66" roughness={1} />
      </mesh>
      {/* pedestal + floating rune */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.6, 8]} />
        <meshStandardMaterial color="#6f6553" roughness={1} flatShading />
      </mesh>
      <Float speed={2.4} rotationIntensity={0.6} floatIntensity={0.9}>
        <mesh ref={runeRef} position={[0, 1.3, 0]}>
          <octahedronGeometry args={[0.36, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={discovered ? 1.6 : 0.7}
            toneMapped={false}
            roughness={0.2}
          />
        </mesh>
      </Float>
      <pointLight position={[0, 1.3, 0]} intensity={discovered ? 4 : 1.5} distance={6} decay={2} color={color} />
      <NearRing isNear={isNear} discovered={discovered} radius={2} />
    </group>
  );
};

const Workshop = ({ isNear, discovered }) => (
  <group>
    <mesh position={[0, 0.8, 0]}>
      <boxGeometry args={[2.4, 1.6, 2]} />
      <meshStandardMaterial color="#8a6a4a" roughness={1} flatShading />
    </mesh>
    <mesh position={[0, 2, 0]} rotation-y={Math.PI / 4}>
      <coneGeometry args={[1.9, 1.1, 4]} />
      <meshStandardMaterial color="#5a3f2c" roughness={1} flatShading />
    </mesh>
    <mesh position={[0.8, 2.4, 0.4]}>
      <boxGeometry args={[0.35, 1, 0.35]} />
      <meshStandardMaterial color="#4a3524" roughness={1} />
    </mesh>
    <Sparkles count={8} scale={[0.6, 1.6, 0.6]} position={[0.8, 3.4, 0.4]} size={2} speed={0.5} color="#9a9a9a" />
    <mesh position={[0, 0.7, 1.02]}>
      <boxGeometry args={[0.7, 1, 0.05]} />
      <meshStandardMaterial color="#ffcf87" emissive="#ffcf87" emissiveIntensity={discovered ? 1 : 0.3} toneMapped={false} />
    </mesh>
    <NearRing isNear={isNear} discovered={discovered} radius={2.4} />
  </group>
);

const Hall = ({ isNear, discovered }) => (
  <group>
    <mesh position={[0, 0.9, 0]}>
      <boxGeometry args={[4, 1.8, 2.2]} />
      <meshStandardMaterial color="#8a7f66" roughness={1} flatShading />
    </mesh>
    <mesh position={[0, 2.1, 0]}>
      <boxGeometry args={[4.4, 0.5, 2.6]} />
      <meshStandardMaterial color="#6a5f48" roughness={1} flatShading />
    </mesh>
    {[-1.5, -0.5, 0.5, 1.5].map((x) => (
      <mesh key={x} position={[x, 0.9, 1.15]}>
        <cylinderGeometry args={[0.16, 0.16, 1.8, 8]} />
        <meshStandardMaterial color="#a89e86" roughness={1} />
      </mesh>
    ))}
    <mesh position={[0, 1.4, 1.35]}>
      <planeGeometry args={[0.7, 1.4]} />
      <meshStandardMaterial color="#b8503c" emissive="#b8503c" emissiveIntensity={discovered ? 0.6 : 0.2} side={2} />
    </mesh>
    <NearRing isNear={isNear} discovered={discovered} radius={3} />
  </group>
);

const Library = ({ isNear, discovered }) => (
  <group>
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[2.6, 2, 2.4]} />
      <meshStandardMaterial color="#7a8290" roughness={1} flatShading />
    </mesh>
    <mesh position={[0, 2.4, 0]}>
      <boxGeometry args={[3, 0.5, 2.8]} />
      <meshStandardMaterial color="#5a6270" roughness={1} flatShading />
    </mesh>
    <mesh position={[0, 3.1, 0]} rotation-y={Math.PI / 4}>
      <coneGeometry args={[1.4, 0.9, 4]} />
      <meshStandardMaterial color="#48505c" roughness={1} flatShading />
    </mesh>
    <mesh position={[0, 1.1, 1.22]}>
      <planeGeometry args={[0.6, 1.6]} />
      <meshStandardMaterial color="#e8d8a8" emissive="#e8d8a8" emissiveIntensity={discovered ? 0.7 : 0.25} side={2} />
    </mesh>
    <NearRing isNear={isNear} discovered={discovered} radius={2.4} />
  </group>
);

const Beacon = ({ isNear, discovered }) => {
  const lightRef = useRef(null);
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.material.emissiveIntensity = (discovered ? 2 : 0.8) + Math.sin(state.clock.elapsedTime * 3) * 0.4;
    }
  });
  return (
    <group>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 3.2, 8]} />
        <meshStandardMaterial color="#5a6b7a" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <cylinderGeometry args={[0.7, 0.6, 0.5, 8]} />
        <meshStandardMaterial color="#48545f" roughness={1} flatShading />
      </mesh>
      <mesh ref={lightRef} position={[0, 3.7, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#aee3ff" emissive="#7ecbff" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 3.7, 0]} intensity={discovered ? 8 : 3} distance={18} decay={2} color="#7ecbff" />
      <NearRing isNear={isNear} discovered={discovered} radius={2.2} />
    </group>
  );
};

const MODELS = {
  core: Core,
  camp: Camp,
  shrine: Shrine,
  workshop: Workshop,
  hall: Hall,
  library: Library,
  beacon: Beacon,
};

export const Landmark = ({ location, groundY, isNear, discovered, activation = 0 }) => {
  const Model = MODELS[location.kind] || Shrine;
  const accent = BIOMES[location.biome]?.accent || "#c7c7c7";
  const labelY = location.kind === "core" ? 5.4 : location.kind === "hall" ? 3.4 : 3.2;

  return (
    <group position={[location.position[0], groundY, location.position[1]]}>
      <Model color={accent} isNear={isNear} discovered={discovered} activation={activation} />
      {location.kind === "shrine" && !discovered && <GuidanceBeam color={accent} />}
      <LocationLabel y={labelY} title={location.title} subtitle={location.subtitle} isNear={isNear} discovered={discovered} />
    </group>
  );
};
