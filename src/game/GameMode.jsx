import { Component, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import World from "./World";
import Player from "./Player";
import { useProgress } from "./useProgress";
import { gameAudio } from "./audio";
import {
  COLLECTIBLES,
  LOCATIONS_RESOLVED,
  SKILL_LOCATION_IDS,
  getGroundHeight,
} from "./worldConfig";
import { lockScroll, unlockScroll } from "../utils/scrollLock";

const TUTORIAL_KEY = "diff-world-tutorial-seen";
const MINIMAP_SCALE = 1.9;

const FirstFrameNotifier = ({ onFirstFrame }) => {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      onFirstFrame();
    }
  });
  return null;
};

class WorldErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Diff World crashed:", error?.message, error?.stack);
    console.error("Diff World component stack:", info?.componentStack);
    this.props.onError();
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

const Joystick = ({ joystickRef }) => {
  const baseRef = useRef(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const move = (event) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const radius = rect.width / 2;
    let dx = event.clientX - (rect.left + radius);
    let dy = event.clientY - (rect.top + radius);
    const len = Math.hypot(dx, dy);
    if (len > radius) {
      dx = (dx / len) * radius;
      dy = (dy / len) * radius;
    }
    setKnob({ x: dx, y: dy });
    joystickRef.current = { x: dx / radius, z: dy / radius };
  };
  const reset = () => {
    setKnob({ x: 0, y: 0 });
    joystickRef.current = { x: 0, z: 0 };
  };
  return (
    <div
      ref={baseRef}
      className="pointer-events-auto relative h-28 w-28 touch-none rounded-full border border-white/25 bg-white/10 backdrop-blur-sm"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && move(e)}
      onPointerUp={reset}
      onPointerCancel={reset}
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full border border-white/40 bg-white/20"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
};

const Minimap = ({ playerStateRef, discovered }) => {
  const dot = useRef(null);
  useEffect(() => {
    let raf;
    const loop = () => {
      if (dot.current) {
        const { x, z, rot } = playerStateRef.current;
        dot.current.style.transform = `translate(calc(-50% + ${x * MINIMAP_SCALE}px), calc(-50% + ${z * MINIMAP_SCALE}px)) rotate(${Math.PI - rot}rad)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [playerStateRef]);
  return (
    <div className="relative h-40 w-40 rounded-full border border-white/20 bg-black/50" aria-hidden="true">
      {LOCATIONS_RESOLVED.map((l) => (
        <span
          key={l.id}
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `calc(50% + ${l.position[0] * MINIMAP_SCALE}px)`,
            top: `calc(50% + ${l.position[1] * MINIMAP_SCALE}px)`,
            background: discovered.has(l.id) ? "#ffe9a8" : "#5a5a5a",
          }}
        />
      ))}
      <span ref={dot} className="absolute left-1/2 top-1/2 text-[10px] leading-none text-white">
        ▲
      </span>
    </div>
  );
};

const GameMode = ({ onExit, onNavigate }) => {
  const joystickRef = useRef({ x: 0, z: 0 });
  const playerStateRef = useRef({ x: 0, z: 0, rot: Math.PI });
  const interactionPointRef = useRef(null);
  const collectedRef = useRef(new Set());
  const toastTimer = useRef(null);

  const [status, setStatus] = useState("booting");
  const [worldKey, setWorldKey] = useState(0);
  const [nearId, setNearId] = useState(null);
  const [cameraMode, setCameraMode] = useState("follow");
  const [activePanel, setActivePanel] = useState(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [toast, setToast] = useState(null);
  const [showTutorial, setShowTutorial] = useState(() => {
    try {
      return !localStorage.getItem(TUTORIAL_KEY);
    } catch {
      return true;
    }
  });

  const { discovered, collected, discover, collect, reset } = useProgress();
  const [isCoarse] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );

  const nearLocation = useMemo(
    () => LOCATIONS_RESOLVED.find((l) => l.id === nearId) || null,
    [nearId]
  );

  useEffect(() => {
    collectedRef.current = collected;
  }, [collected]);

  useEffect(() => {
    lockScroll();
    return () => {
      unlockScroll();
      gameAudio.setMuted(true);
    };
  }, []);

  // resume synthesized audio on the first real input, respecting mute
  useEffect(() => {
    const kick = () => {
      gameAudio.resume();
      gameAudio.setMuted(muted);
    };
    window.addEventListener("keydown", kick, { once: true });
    window.addEventListener("pointerdown", kick, { once: true });
    return () => {
      window.removeEventListener("keydown", kick);
      window.removeEventListener("pointerdown", kick);
    };
  }, [muted]);

  const flashToast = useCallback((text) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1900);
  }, []);

  // discovery on approach
  useEffect(() => {
    if (!nearId) return;
    if (discover(nearId)) {
      const loc = LOCATIONS_RESOLVED.find((l) => l.id === nearId);
      gameAudio.discover();
      flashToast(`Discovered — ${loc?.title ?? "a place"}`);
    }
  }, [nearId, discover, flashToast]);

  const openPanel = (loc) => {
    if (!loc) return;
    const gy = getGroundHeight(loc.position[0], loc.position[1]);
    interactionPointRef.current = { x: loc.position[0], y: gy, z: loc.position[1] };
    setActivePanel(loc);
    gameAudio.interact();
  };

  const closePanel = () => {
    setActivePanel(null);
    interactionPointRef.current = null;
  };

  const handleCollect = (id) => {
    if (collect(id)) {
      gameAudio.collect();
      const total = COLLECTIBLES.length;
      const count = collected.size + 1;
      flashToast(`Memory fragment ${count}/${total}`);
    }
  };

  const toggleCamera = () => setCameraMode((m) => (m === "follow" ? "tactical" : "follow"));
  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      gameAudio.setMuted(next);
      return next;
    });
  };
  const recenter = () => playerStateRef.current.requestRecenter?.();

  // key handling
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof Element && e.target.closest("input, textarea")) return;
      const key = e.key.toLowerCase();
      if (e.key === "Escape") {
        if (activePanel) closePanel();
        else if (paused) setPaused(false);
        else setPaused(true);
        return;
      }
      if (showTutorial) return;
      if (key === "e" || e.key === "Enter") {
        if (activePanel) closePanel();
        else if (nearLocation) openPanel(nearLocation);
        return;
      }
      if (key === "c") toggleCamera();
      if (key === "p") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activePanel, paused, nearLocation, showTutorial]);

  const dismissTutorial = () => {
    setShowTutorial(false);
    try {
      localStorage.setItem(TUTORIAL_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const reloadWorld = () => {
    setStatus("booting");
    setNearId(null);
    closePanel();
    setWorldKey((k) => k + 1);
  };

  const skillsFound = SKILL_LOCATION_IDS.filter((id) => discovered.has(id)).length;
  const objective =
    skillsFound < SKILL_LOCATION_IDS.length
      ? `Discover the shrines · ${skillsFound}/${SKILL_LOCATION_IDS.length}`
      : collected.size < COLLECTIBLES.length
      ? `Gather memory fragments · ${collected.size}/${COLLECTIBLES.length}`
      : "Everything found — return to the Core";

  return (
    <div className="fixed inset-0 z-40 bg-[#0d1420]" role="dialog" aria-modal="true" aria-label="Diff World 3D mode">
      <WorldErrorBoundary key={`boundary-${worldKey}`} onError={() => setStatus("crashed")}>
        <Canvas
          key={`world-${worldKey}`}
          dpr={isCoarse ? [1, 1.25] : [1, 1.5]}
          camera={{ position: [2, 9, 22], fov: 55 }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (event) => {
                event.preventDefault();
                setStatus("crashed");
              },
              false
            );
          }}
        >
          <FirstFrameNotifier onFirstFrame={() => setStatus("ready")} />
          <World nearId={nearId} discovered={discovered} collected={collected} />
          <Player
            joystickRef={joystickRef}
            cameraMode={cameraMode}
            isInteracting={Boolean(activePanel)}
            interactionPointRef={interactionPointRef}
            collectedRef={collectedRef}
            playerStateRef={playerStateRef}
            onNear={setNearId}
            onCollect={handleCollect}
          />
        </Canvas>
      </WorldErrorBoundary>

      {/* cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

      {/* boot / crash cover */}
      {status !== "ready" && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#0d1420]">
          {status === "booting" ? (
            <p className="animate-pulse font-mono text-sm text-neutral-300">Entering Diff World…</p>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-mono text-sm text-neutral-300">The world glitched out of existence.</p>
              <div className="flex gap-3">
                <button type="button" onClick={reloadWorld} className="cursor-pointer rounded-md border border-white/25 bg-white/10 px-4 py-2 font-mono text-xs text-white hover:bg-white/20">
                  ↻ Reload World
                </button>
                <button type="button" onClick={onExit} className="cursor-pointer rounded-md border border-white/15 px-4 py-2 font-mono text-xs text-neutral-400 hover:text-white">
                  Exit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- minimal HUD ---- */}
      {status === "ready" && !showTutorial && (
        <div className="pointer-events-none absolute inset-0 select-none">
          {/* objective (top-left) */}
          <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Diff World</p>
            <p className="mt-1 font-mono text-[11px] text-white/80">{objective}</p>
          </div>

          {/* menu button (top-right) */}
          <button
            type="button"
            onClick={() => setPaused(true)}
            className="pointer-events-auto absolute right-4 top-4 flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-black/40 px-3 py-2 font-mono text-xs text-neutral-300 backdrop-blur-sm hover:border-white/40 hover:text-white sm:right-6 sm:top-6"
          >
            ☰ Menu <span className="rounded border border-white/20 px-1">esc</span>
          </button>

          {/* toast */}
          {toast && (
            <div className="absolute left-1/2 top-16 -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-1.5 font-mono text-[11px] text-amber-100 backdrop-blur-md">
              ✦ {toast}
            </div>
          )}

          {/* contextual interaction prompt (bottom-center) */}
          {nearLocation && !activePanel && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 sm:bottom-16">
              <div className="rounded-xl border border-white/25 bg-black/60 px-4 py-2.5 text-center font-mono text-sm text-white backdrop-blur-md">
                <span className="rounded border border-white/30 px-1.5">E</span>{" "}
                {nearLocation.section ? "Enter" : "Inspect"} · {nearLocation.title}
              </div>
            </div>
          )}

          {/* touch controls */}
          {isCoarse && (
            <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex items-end justify-between px-6">
              <Joystick joystickRef={joystickRef} />
              <div className="flex flex-col gap-2">
                {nearLocation && (
                  <button type="button" onClick={() => openPanel(nearLocation)} className="pointer-events-auto rounded-full border border-white/30 bg-white/15 px-5 py-4 font-mono text-sm text-white backdrop-blur-md">
                    E
                  </button>
                )}
                <button type="button" onClick={toggleCamera} className="pointer-events-auto rounded-full border border-white/20 bg-black/40 px-4 py-3 font-mono text-xs text-neutral-200 backdrop-blur-md">
                  ⌖
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- interaction panel ---- */}
      {activePanel && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10 sm:items-center sm:justify-end sm:pb-0 sm:pr-10">
          <div className="pointer-events-auto w-[92%] max-w-md rounded-2xl border border-white/15 bg-black/80 p-6 backdrop-blur-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-200/70">{activePanel.subtitle}</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{activePanel.title}</h3>
            {activePanel.body && <p className="mt-3 text-sm leading-relaxed text-neutral-300">{activePanel.body}</p>}
            {activePanel.skills?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {activePanel.skills.map((s) => (
                  <span key={s.name} className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[11px] text-neutral-200">
                    {s.name}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5 flex items-center gap-3">
              {activePanel.section && (
                <button type="button" onClick={() => onNavigate(activePanel.section)} className="cursor-pointer rounded-lg border border-white/25 bg-white/10 px-4 py-2 font-mono text-xs text-white hover:bg-white/20">
                  Open on site →
                </button>
              )}
              <button type="button" onClick={closePanel} className="cursor-pointer rounded-lg border border-white/15 px-4 py-2 font-mono text-xs text-neutral-300 hover:text-white">
                Close <span className="rounded border border-white/20 px-1">esc</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- pause / settings ---- */}
      {paused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="w-[92%] max-w-lg rounded-2xl border border-white/15 bg-[#0d1420]/90 p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Paused</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Diff World</h3>
              </div>
              <Minimap playerStateRef={playerStateRef} discovered={discovered} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] text-neutral-400">
              <span>Shrines · {skillsFound}/{SKILL_LOCATION_IDS.length}</span>
              <span>Fragments · {collected.size}/{COLLECTIBLES.length}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPaused(false)} className="col-span-2 cursor-pointer rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/20">
                Resume
              </button>
              <button type="button" onClick={toggleCamera} className="cursor-pointer rounded-lg border border-white/15 px-4 py-2.5 font-mono text-xs text-neutral-200 hover:text-white">
                Camera · {cameraMode === "follow" ? "Follow" : "Tactical"}
              </button>
              <button type="button" onClick={recenter} className="cursor-pointer rounded-lg border border-white/15 px-4 py-2.5 font-mono text-xs text-neutral-200 hover:text-white">
                Recenter camera
              </button>
              <button type="button" onClick={toggleMute} className="cursor-pointer rounded-lg border border-white/15 px-4 py-2.5 font-mono text-xs text-neutral-200 hover:text-white">
                Sound · {muted ? "Off" : "On"}
              </button>
              <button type="button" onClick={() => { reset(); flashToast("Progress reset"); }} className="cursor-pointer rounded-lg border border-white/15 px-4 py-2.5 font-mono text-xs text-neutral-200 hover:text-white">
                Reset progress
              </button>
              <button type="button" onClick={onExit} className="col-span-2 cursor-pointer rounded-lg border border-white/15 px-4 py-2.5 font-mono text-xs text-neutral-400 hover:text-white">
                Exit to site
              </button>
            </div>

            <p className="mt-5 font-mono text-[10px] leading-relaxed text-neutral-500">
              WASD / arrows move · Shift sprint · Space jump · drag to orbit · E interact · C camera · Esc menu
            </p>
          </div>
        </div>
      )}

      {/* ---- first-time tutorial ---- */}
      {showTutorial && status === "ready" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 backdrop-blur-md">
          <div className="w-[92%] max-w-md rounded-2xl border border-white/15 bg-[#0d1420]/90 p-7 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-200/70">Welcome, traveler</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Diff World</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              Explore a floating island where every skill and story is a place. Discover the shrines, gather memory
              fragments, and light the Talent Core.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 font-mono text-[11px] text-neutral-400">
              <span>{isCoarse ? "Joystick" : "WASD / arrows"} — move</span>
              <span>{isCoarse ? "Drag screen" : "Mouse drag"} — camera</span>
              <span>{isCoarse ? "Tap E" : "Shift"} — {isCoarse ? "interact" : "sprint"}</span>
              <span>{isCoarse ? "⌖" : "Space"} — {isCoarse ? "camera" : "jump"}</span>
            </div>
            <button type="button" onClick={dismissTutorial} className="mt-6 cursor-pointer rounded-lg border border-white/25 bg-white/10 px-6 py-2.5 text-sm text-white hover:bg-white/20">
              Begin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMode;
