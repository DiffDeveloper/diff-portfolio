import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "diff-world-progress-v1";

const readInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { discovered: [], collected: [] };
    const parsed = JSON.parse(raw);
    return {
      discovered: Array.isArray(parsed.discovered) ? parsed.discovered : [],
      collected: Array.isArray(parsed.collected) ? parsed.collected : [],
    };
  } catch {
    return { discovered: [], collected: [] };
  }
};

// Discovery + collectible progress, persisted to localStorage so a returning
// visitor keeps what they found. Sets are exposed for O(1) lookups in render.
export const useProgress = () => {
  const [discovered, setDiscovered] = useState(() => new Set(readInitial().discovered));
  const [collected, setCollected] = useState(() => new Set(readInitial().collected));
  const saveTimer = useRef(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            discovered: [...discovered],
            collected: [...collected],
          })
        );
      } catch {
        /* storage may be unavailable (private mode) — progress stays in-memory */
      }
    }, 200);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [discovered, collected]);

  const discover = useCallback((id) => {
    let added = false;
    setDiscovered((prev) => {
      if (prev.has(id)) return prev;
      added = true;
      return new Set(prev).add(id);
    });
    return added;
  }, []);

  const collect = useCallback((id) => {
    let added = false;
    setCollected((prev) => {
      if (prev.has(id)) return prev;
      added = true;
      return new Set(prev).add(id);
    });
    return added;
  }, []);

  const reset = useCallback(() => {
    setDiscovered(new Set());
    setCollected(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { discovered, collected, discover, collect, reset };
};
