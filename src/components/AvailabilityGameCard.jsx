import { useEffect, useState } from "react";

const BEST_SCORE_KEY = "diff-reaction-best-score";
const ROUND_SECONDS = 15;

const nextTarget = () => ({
  x: 10 + Math.random() * 80,
  y: 20 + Math.random() * 64,
});

const AvailabilityGameCard = () => {
  const [view, setView] = useState("availability");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [target, setTarget] = useState(() => nextTarget());

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(BEST_SCORE_KEY) || "0");
    if (!Number.isNaN(saved)) {
      setBestScore(saved);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning || timeLeft !== 0) return;

    setBestScore((currentBest) => {
      const nextBest = Math.max(currentBest, score);
      window.localStorage.setItem(BEST_SCORE_KEY, `${nextBest}`);
      return nextBest;
    });
  }, [isRunning, score, timeLeft]);

  const startRound = () => {
    setView("game");
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setTarget(nextTarget());
    setIsRunning(true);
  };

  const hitTarget = () => {
    if (!isRunning) return;
    setScore((current) => current + 1);
    setTarget(nextTarget());
  };

  const resetToAvailability = () => {
    setView("availability");
    setIsRunning(false);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
  };

  if (view === "availability") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
        <p className="text-[11px] tracking-[0.2em] text-cyan-300/90 uppercase">
          Availability
        </p>
        <h3 className="text-xl font-semibold text-white md:text-2xl">
          Open for Internship / Full-time
        </h3>
        <p className="text-sm text-neutral-300 md:text-base">
          Bangkok • Remote • Relocation
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href="#contact"
            className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs font-medium text-cyan-100 transition hover:border-cyan-300/70 hover:bg-cyan-300/20"
          >
            Contact Me
          </a>
          <button
            onClick={startRound}
            className="rounded-full border border-white/15 bg-midnight/65 px-4 py-2 text-xs text-neutral-200 transition hover:border-cyan-300/60 hover:text-white"
          >
            Play Mini-Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
          Reaction Tap
        </p>
        <button
          onClick={resetToAvailability}
          className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-neutral-200 transition hover:border-cyan-300/60 hover:text-white"
        >
          Back
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-200">
        <span className="rounded-full border border-white/12 bg-midnight/70 px-3 py-1">
          Time: {timeLeft}s
        </span>
        <span className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-cyan-100">
          Score: {score}
        </span>
        <span className="rounded-full border border-white/12 bg-midnight/70 px-3 py-1">
          Best: {bestScore}
        </span>
      </div>

      <div className="relative h-28 w-full overflow-hidden rounded-xl border border-white/12 bg-midnight/65 sm:h-32">
        {isRunning ? (
          <button
            onClick={hitTarget}
            className="absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/80 bg-cyan-300/20 shadow-[0_0_14px_rgba(34,211,238,0.45)] transition hover:scale-105"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            aria-label="Hit target"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {timeLeft === 0 ? (
              <div className="text-center">
                <p className="text-sm text-white">Round complete!</p>
                <p className="mt-1 text-xs text-neutral-300">
                  Final score: {score}
                </p>
              </div>
            ) : (
              <button
                onClick={startRound}
                className="rounded-full border border-cyan-300/45 bg-cyan-300/10 px-4 py-2 text-xs font-medium text-cyan-100 transition hover:border-cyan-300/70 hover:bg-cyan-300/20"
              >
                Start 15s Round
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityGameCard;
