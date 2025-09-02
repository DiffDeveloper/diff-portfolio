/*
Model: mkts.glb
*/

import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useMotionValue, useSpring } from "motion/react";
import { useFrame } from "@react-three/fiber";

export function Astronaut(props) {
  const group = useRef();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(null);
  
  // Load the model using the hook
  const { scene, animations, nodes } = useGLTF("/models/mkts.glb");
  const { actions } = useAnimations(animations || [], group);
  
  useEffect(() => {
    console.log("=== GLB Model Debug Info ===");
    console.log("Model loaded:", !!scene);
    console.log("Scene:", scene);
    console.log("Nodes:", nodes);
    console.log("Animations:", animations);
    console.log("Available node keys:", Object.keys(nodes || {}));
    
    if (scene || nodes) {
      setModelLoaded(true);
    }
  }, [scene, nodes, animations]);

  useEffect(() => {
    if (animations && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);

  const yPosition = useMotionValue(5);
  const ySpring = useSpring(yPosition, { damping: 30 });
  
  useEffect(() => {
    ySpring.set(-1);
  }, [ySpring]);
  
  useFrame(() => {
    if (group.current) {
      group.current.position.y = ySpring.get();
    }
  });

  // If there's an error, show it
  if (modelError) {
    console.error("Model loading failed:", modelError);
    return (
      <group {...props}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    );
  }

  // If model isn't loaded yet, show loading state
  if (!modelLoaded) {
    console.log("Model still loading...");
    return (
      <group {...props}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </group>
    );
  }

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      rotation={[-Math.PI / 2, -0.2, 2.2]}
      scale={props.scale || 0.3}
      position={props.position || [1.3, -1, 0]}
    >
      {/* Try different ways to render the model */}
      {scene && <primitive object={scene} />}
      {nodes.Scene && <primitive object={nodes.Scene} />}
      {nodes.scene && <primitive object={nodes.scene} />}
      {nodes.root && <primitive object={nodes.root} />}
      {nodes.Root && <primitive object={nodes.Root} />}
      
      {/* If none of the above work, try to render all available nodes */}
      {!scene && !nodes.Scene && !nodes.scene && !nodes.root && !nodes.Root && (
        <>
          {Object.keys(nodes).map((key) => {
            const node = nodes[key];
            if (node && node.type) {
              return <primitive key={key} object={node} />;
            }
            return null;
          })}
        </>
      )}
    </group>
  );
}

useGLTF.preload("/models/mkts.glb");
