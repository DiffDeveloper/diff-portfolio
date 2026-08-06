import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  COLLECTIBLES,
  LOCATIONS_RESOLVED,
  SPAWN,
  TUNING,
  getGroundHeight,
  sampleBiome,
} from "./worldConfig";
import { gameAudio } from "./audio";

const CharacterMesh = ({ bodyRef, leanRef, armLeftRef, armRightRef }) => (
  <group ref={bodyRef}>
    <group ref={leanRef}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.42, 0.55, 6, 14]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.36, 20, 20]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.4} />
      </mesh>
      {/* visor face — marks the front */}
      <mesh position={[0, 1.78, 0.27]}>
        <boxGeometry args={[0.44, 0.16, 0.18]} />
        <meshStandardMaterial color="#10131a" emissive="#2b6cff" emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
      {/* backpack — marks the back */}
      <mesh position={[0, 1.05, -0.44]} castShadow>
        <boxGeometry args={[0.46, 0.52, 0.2]} />
        <meshStandardMaterial color="#b98a52" roughness={0.8} />
      </mesh>
      <group ref={armLeftRef} position={[-0.52, 1.2, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.09, 0.32, 4, 8]} />
          <meshStandardMaterial color="#d8d2c6" roughness={0.6} />
        </mesh>
      </group>
      <group ref={armRightRef} position={[0.52, 1.2, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.09, 0.32, 4, 8]} />
          <meshStandardMaterial color="#d8d2c6" roughness={0.6} />
        </mesh>
      </group>
    </group>
  </group>
);

const Player = ({
  joystickRef,
  cameraMode,
  isInteracting,
  interactionPointRef,
  collectedRef,
  playerStateRef,
  onNear,
  onCollect,
}) => {
  const groupRef = useRef(null);
  const bodyRef = useRef(null);
  const leanRef = useRef(null);
  const armLeftRef = useRef(null);
  const armRightRef = useRef(null);
  const dustRef = useRef(null);
  const { camera, gl, scene } = useThree();

  const keys = useRef({});
  const velocity = useRef(new THREE.Vector2(0, 0));
  const vy = useRef(0);
  const yOffset = useRef(0); // height above terrain (jumping)
  const grounded = useRef(true);
  const walkTime = useRef(0);
  const stepAccum = useRef(0);
  const landTimer = useRef(0);
  const coyoteTimer = useRef(0);
  const jumpBufferTimer = useRef(0);
  const jumpHeld = useRef(false);
  const jumpCutApplied = useRef(false);
  const spawnTime = useRef(0);
  const nearIdRef = useRef(null);

  // orbit camera state (user-controlled)
  const camYaw = useRef(Math.PI);
  const camPitch = useRef(0.42);
  const dragging = useRef(false);
  const recenterRef = useRef(false);
  const cameraIdleTime = useRef(0);
  const cameraFocus = useRef(new THREE.Vector3());
  const cameraFocusReady = useRef(false);
  const cameraColliders = useRef([]);
  const colliderRefreshTimer = useRef(0);
  const collisionCheckTimer = useRef(0);
  const collisionDistance = useRef(TUNING.cameraDistance);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const tmp2 = useMemo(() => new THREE.Vector3(), []);
  const tmp3 = useMemo(() => new THREE.Vector3(), []);
  const tmp4 = useMemo(() => new THREE.Vector3(), []);
  const cameraRaycaster = useMemo(() => new THREE.Raycaster(), []);
  const lookMatrix = useMemo(() => new THREE.Matrix4(), []);
  const targetQuaternion = useMemo(() => new THREE.Quaternion(), []);

  // keyboard
  useEffect(() => {
    const down = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === " ") {
        e.preventDefault();
        jumpHeld.current = true;
        if (!e.repeat) jumpBufferTimer.current = TUNING.jumpBufferTime;
      }
    };
    const up = (e) => {
      keys.current[e.key.toLowerCase()] = false;
      if (e.key === " ") jumpHeld.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // pointer-drag orbit on the canvas
  useEffect(() => {
    const el = gl.domElement;
    let lastX = 0;
    let lastY = 0;
    const onDown = (e) => {
      dragging.current = true;
      cameraIdleTime.current = 0;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      cameraIdleTime.current = 0;
      camYaw.current -= (e.clientX - lastX) * 0.005;
      camPitch.current = THREE.MathUtils.clamp(
        camPitch.current - (e.clientY - lastY) * 0.004,
        0.1,
        1.15
      );
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging.current = false;
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [gl]);

  // expose a recenter trigger through the shared player-state ref
  useEffect(() => {
    playerStateRef.current.requestRecenter = () => {
      recenterRef.current = true;
      cameraIdleTime.current = TUNING.cameraAutoRecenterDelay;
    };
  }, [playerStateRef]);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, 0.05);

    // --- spawn drop-in --------------------------------------------------
    if (spawnTime.current < 1) {
      spawnTime.current += delta * 1.2;
      yOffset.current = (1 - Math.min(spawnTime.current, 1) ** 2) * 8;
    }
    const controllable = spawnTime.current >= 1 && !isInteracting;

    // --- read input -----------------------------------------------------
    const k = keys.current;
    let fwd = (k.w || k.arrowup ? 1 : 0) - (k.s || k.arrowdown ? 1 : 0);
    let strafe = (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0);
    const stick = joystickRef.current;
    if (fwd === 0 && strafe === 0 && stick && (stick.x || stick.z)) {
      fwd = -stick.z;
      strafe = stick.x;
    }
    const sprinting = Boolean(k.shift) && grounded.current;
    if (!controllable) {
      fwd = 0;
      strafe = 0;
    }

    // camera-relative movement basis
    const yaw = camYaw.current;
    const fX = -Math.sin(yaw);
    const fZ = -Math.cos(yaw);
    const rX = Math.cos(yaw);
    const rZ = -Math.sin(yaw);
    let dirX = fX * fwd + rX * strafe;
    let dirZ = fZ * fwd + rZ * strafe;
    const dirLen = Math.hypot(dirX, dirZ);
    if (dirLen > 0) {
      dirX /= dirLen;
      dirZ /= dirLen;
    }

    // --- velocity: smooth accel / decel --------------------------------
    const inputAmount = Math.min(1, dirLen);
    const maxSpeed = sprinting ? TUNING.runSpeed : TUNING.walkSpeed;
    const targetVX = dirX * maxSpeed * inputAmount;
    const targetVZ = dirZ * maxSpeed * inputAmount;
    const response = inputAmount > 0 ? TUNING.acceleration : TUNING.braking;
    const control = grounded.current ? 1 : TUNING.airControl;
    const velocityBlend = 1 - Math.exp(-response * control * delta);
    velocity.current.x += (targetVX - velocity.current.x) * velocityBlend;
    velocity.current.y += (targetVZ - velocity.current.y) * velocityBlend;

    group.position.x += velocity.current.x * delta;
    group.position.z += velocity.current.y * delta;

    // island edge clamp
    const radial = Math.hypot(group.position.x, group.position.z);
    if (radial > TUNING.islandRadius - 2) {
      const s = (TUNING.islandRadius - 2) / radial;
      group.position.x *= s;
      group.position.z *= s;
    }

    const speed = velocity.current.length();
    const isMoving = speed > 0.4;

    // --- forgiving jump: input buffer, coyote window, variable height ---
    jumpBufferTimer.current = Math.max(0, jumpBufferTimer.current - delta);
    if (grounded.current) coyoteTimer.current = TUNING.coyoteTime;
    else coyoteTimer.current = Math.max(0, coyoteTimer.current - delta);

    if (controllable && jumpBufferTimer.current > 0 && coyoteTimer.current > 0) {
      vy.current = TUNING.jumpImpulse;
      grounded.current = false;
      coyoteTimer.current = 0;
      jumpBufferTimer.current = 0;
      jumpCutApplied.current = false;
      gameAudio.jump();
    }
    if (!grounded.current) {
      if (!jumpHeld.current && vy.current > 0 && !jumpCutApplied.current) {
        vy.current *= TUNING.jumpCutMultiplier;
        jumpCutApplied.current = true;
      }
      vy.current -= TUNING.gravity * delta;
      yOffset.current += vy.current * delta;
      if (yOffset.current <= 0) {
        yOffset.current = 0;
        grounded.current = true;
        vy.current = 0;
        jumpCutApplied.current = false;
        landTimer.current = 0.18; // trigger landing squash
      }
    }

    const groundY = getGroundHeight(group.position.x, group.position.z);
    group.position.y = groundY + yOffset.current;

    // --- facing ---------------------------------------------------------
    let turnDelta = 0;
    if (isMoving) {
      const targetRot = Math.atan2(velocity.current.x, velocity.current.y);
      turnDelta = targetRot - group.rotation.y;
      turnDelta = Math.atan2(Math.sin(turnDelta), Math.cos(turnDelta));
      group.rotation.y += turnDelta * (1 - Math.exp(-TUNING.turnSpeed * delta));
      // Distance-based phase keeps limbs and footsteps coherent at any speed.
      walkTime.current += speed * delta;
    }

    // --- body anim: bob, lean, squash/stretch, arm swing ---------------
    if (bodyRef.current && leanRef.current) {
      const gait = Math.sin(walkTime.current * 2.25);
      const speedRatio = THREE.MathUtils.clamp(speed / TUNING.runSpeed, 0, 1);
      const bob = isMoving
        ? Math.abs(gait) * THREE.MathUtils.lerp(0.07, 0.14, speedRatio)
        : Math.sin(state.clock.elapsedTime * 2) * 0.03;
      leanRef.current.position.y = bob;

      const lean = isMoving ? speedRatio * 0.18 : 0;
      const turnLean = isMoving
        ? -THREE.MathUtils.clamp(turnDelta, -0.9, 0.9) * speedRatio * 0.16
        : 0;
      leanRef.current.rotation.x += (lean - leanRef.current.rotation.x) * Math.min(1, delta * 8);
      leanRef.current.rotation.z += (turnLean - leanRef.current.rotation.z) * Math.min(1, delta * 10);

      // squash / stretch
      let sx = 1;
      let sy = 1;
      if (!grounded.current) {
        const stretch = THREE.MathUtils.clamp(vy.current * 0.03, -0.18, 0.22);
        sy = 1 + stretch;
        sx = 1 - stretch * 0.6;
      } else if (landTimer.current > 0) {
        landTimer.current -= delta;
        const squash = (landTimer.current / 0.18) * 0.25;
        sy = 1 - squash;
        sx = 1 + squash * 0.6;
      }
      bodyRef.current.scale.x += (sx - bodyRef.current.scale.x) * Math.min(1, delta * 18);
      bodyRef.current.scale.z = bodyRef.current.scale.x;
      bodyRef.current.scale.y += (sy - bodyRef.current.scale.y) * Math.min(1, delta * 18);
    }
    const swingAmount = THREE.MathUtils.lerp(0.55, 1.05, THREE.MathUtils.clamp(speed / TUNING.runSpeed, 0, 1));
    const swing = isMoving ? Math.sin(walkTime.current * 2.25) * swingAmount : 0;
    if (armLeftRef.current) armLeftRef.current.rotation.x += (swing - armLeftRef.current.rotation.x) * Math.min(1, delta * 14);
    if (armRightRef.current) armRightRef.current.rotation.x += (-swing - armRightRef.current.rotation.x) * Math.min(1, delta * 14);

    // dust when moving on ground
    if (dustRef.current) {
      dustRef.current.visible = isMoving && grounded.current;
    }

    // --- footstep audio -------------------------------------------------
    if (isMoving && grounded.current) {
      stepAccum.current += speed * delta;
      const stride = sprinting ? 2.6 : 2;
      if (stepAccum.current > stride) {
        stepAccum.current = 0;
        gameAudio.footstep(sampleBiome(group.position.x, group.position.z));
      }
    }

    // --- camera ---------------------------------------------------------
    const headY = group.position.y + 1.4;
    tmp2.set(group.position.x, headY, group.position.z);
    if (!cameraFocusReady.current) {
      cameraFocus.current.copy(tmp2);
      cameraFocusReady.current = true;
    }

    // A horizontal dead zone prevents tiny player adjustments from shaking
    // the view while still letting the camera catch up decisively.
    tmp3.copy(tmp2).sub(cameraFocus.current);
    tmp3.y = 0;
    const focusDistance = tmp3.length();
    if (focusDistance > TUNING.cameraDeadZone) {
      const focusBlend = 1 - Math.exp(-TUNING.cameraFocusDamping * delta);
      cameraFocus.current.addScaledVector(
        tmp3,
        ((focusDistance - TUNING.cameraDeadZone) / focusDistance) * focusBlend
      );
    }
    cameraFocus.current.y +=
      (headY - cameraFocus.current.y) * (1 - Math.exp(-TUNING.cameraFocusDamping * delta));

    const smoothLookAt = (target, damping = TUNING.cameraRotationDamping) => {
      lookMatrix.lookAt(camera.position, target, camera.up);
      targetQuaternion.setFromRotationMatrix(lookMatrix);
      camera.quaternion.slerp(targetQuaternion, 1 - Math.exp(-damping * delta));
    };

    if (isInteracting && interactionPointRef.current) {
      const p = interactionPointRef.current;
      tmp.set(p.x + 4.5, p.y + 3.6, p.z + 4.5);
      camera.position.lerp(tmp, 1 - Math.exp(-3 * delta));
      tmp2.set(p.x, p.y + 1.4, p.z);
      smoothLookAt(tmp2, 8);
    } else if (cameraMode === "tactical") {
      tmp.set(group.position.x, group.position.y + 11, group.position.z + 9);
      camera.position.lerp(tmp, 1 - Math.exp(-4 * delta));
      tmp2.set(group.position.x, group.position.y + 1, group.position.z);
      smoothLookAt(tmp2, 10);
    } else {
      if (isMoving && grounded.current && !dragging.current) {
        cameraIdleTime.current += delta;
      } else if (!recenterRef.current) {
        cameraIdleTime.current = 0;
      }

      if (
        recenterRef.current ||
        cameraIdleTime.current >= TUNING.cameraAutoRecenterDelay
      ) {
        const targetYaw = group.rotation.y + Math.PI;
        const yawDelta = Math.atan2(
          Math.sin(targetYaw - camYaw.current),
          Math.cos(targetYaw - camYaw.current)
        );
        camYaw.current +=
          yawDelta * (1 - Math.exp(-TUNING.cameraAutoRecenterSpeed * delta));
        if (Math.abs(yawDelta) < 0.015) recenterRef.current = false;
      }

      const cameraYaw = camYaw.current;
      const horiz = Math.cos(camPitch.current) * TUNING.cameraDistance;
      const vert = Math.sin(camPitch.current) * TUNING.cameraDistance;
      tmp.set(
        cameraFocus.current.x + Math.sin(cameraYaw) * horiz,
        cameraFocus.current.y + vert,
        cameraFocus.current.z + Math.cos(cameraYaw) * horiz
      );

      // Pull the camera in front of opaque world geometry instead of letting
      // landmarks and trees hide the character.
      tmp4.copy(tmp).sub(cameraFocus.current);
      const desiredDistance = tmp4.length();
      tmp4.normalize();
      colliderRefreshTimer.current -= delta;
      if (colliderRefreshTimer.current <= 0) {
        const colliders = [];
        scene.traverse((object) => {
          if (
            !object.isMesh ||
            object.isLine ||
            object.isLine2 ||
            object.isLineSegments2 ||
            object.isPoints ||
            object.isSprite ||
            !object.visible ||
            object.userData.ignoreCameraCollision
          ) {
            return;
          }

          let parent = object;
          while (parent) {
            if (parent === group) return;
            parent = parent.parent;
          }

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          if (materials.some((material) => material?.transparent)) return;
          colliders.push(object);
        });
        cameraColliders.current = colliders;
        colliderRefreshTimer.current = 0.75;
      }

      collisionCheckTimer.current -= delta;
      if (collisionCheckTimer.current <= 0) {
        cameraRaycaster.set(cameraFocus.current, tmp4);
        // Defensive assignment for custom raycast implementations. Filtered
        // Line2 objects never reach this raycaster, but extensions may still
        // consult the active camera.
        cameraRaycaster.camera = camera;
        cameraRaycaster.near = 0.15;
        cameraRaycaster.far = desiredDistance;
        const obstruction = cameraRaycaster.intersectObjects(
          cameraColliders.current,
          false
        )[0];
        collisionDistance.current = obstruction
          ? Math.max(
              TUNING.cameraMinDistance,
              obstruction.distance - TUNING.cameraCollisionPadding
            )
          : desiredDistance;
        collisionCheckTimer.current = 0.06;
      }

      const safeDistance = Math.min(desiredDistance, collisionDistance.current);
      tmp.copy(cameraFocus.current).addScaledVector(tmp4, safeDistance);
      const isObstructed = safeDistance < desiredDistance - 0.05;
      const cameraDamping = isObstructed ? 14 : TUNING.cameraDamping;
      const lag = 1 - Math.exp(-cameraDamping * delta);
      camera.position.lerp(tmp, lag);
      smoothLookAt(cameraFocus.current);
    }

    // sprint FOV
    const targetFov = sprinting && isMoving ? TUNING.cameraFovSprint : TUNING.cameraFovBase;
    if (Math.abs(camera.fov - targetFov) > 0.1) {
      camera.fov += (targetFov - camera.fov) * Math.min(1, delta * 6);
      camera.updateProjectionMatrix();
    }

    // --- share state to HUD --------------------------------------------
    playerStateRef.current.x = group.position.x;
    playerStateRef.current.z = group.position.z;
    playerStateRef.current.rot = group.rotation.y;

    // --- collectibles ---------------------------------------------------
    if (controllable) {
      for (const c of COLLECTIBLES) {
        if (collectedRef.current.has(c.id)) continue;
        if (Math.hypot(group.position.x - c.position[0], group.position.z - c.position[1]) < TUNING.collectReach) {
          onCollect(c.id);
        }
      }
    }

    // --- nearest interactable ------------------------------------------
    let nearest = null;
    let nearestDist = Infinity;
    for (const loc of LOCATIONS_RESOLVED) {
      const d = Math.hypot(group.position.x - loc.position[0], group.position.z - loc.position[1]);
      if (d < TUNING.interactReach && d < nearestDist) {
        nearest = loc.id;
        nearestDist = d;
      }
    }
    if (nearest !== nearIdRef.current) {
      nearIdRef.current = nearest;
      onNear(nearest);
    }
  });

  return (
    <group ref={groupRef} position={[SPAWN[0], 8, SPAWN[1]]} rotation={[0, Math.PI, 0]}>
      <pointLight position={[0, 2.6, 0.4]} intensity={6} distance={9} decay={2} color="#fff2d8" />
      <CharacterMesh bodyRef={bodyRef} leanRef={leanRef} armLeftRef={armLeftRef} armRightRef={armRightRef} />
      {/* contact shadow */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
      {/* facing chevron */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0.04, 0.85]} scale={[1, 1, 0.25]}>
        <coneGeometry args={[0.16, 0.38, 3]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      {/* running dust */}
      <group ref={dustRef} visible={false}>
        <mesh position={[0, 0.1, -0.4]}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshBasicMaterial color="#d8cbb0" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
};

export default Player;
