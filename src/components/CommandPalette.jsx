import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { myEmail, myGithub, mySocials } from "../constants";
import { ENTER_GAME_EVENT } from "../game/events";
import { lockScroll, unlockScroll } from "../utils/scrollLock";

export const OPEN_PALETTE_EVENT = "diff:open-command-palette";

const SECTIONS = [
  { id: "home", label: "Home", keywords: "hero top start" },
  { id: "about", label: "About", keywords: "bio profile who" },
  { id: "tech", label: "Tech Talent Tree", keywords: "skills stack rpg" },
  { id: "projects", label: "Projects", keywords: "work portfolio builds" },
  { id: "experiences", label: "Experience", keywords: "jobs career sunline" },
  { id: "education", label: "Education", keywords: "degree achievements" },
  { id: "contact", label: "Contact", keywords: "email message talk" },
];

const linkedIn = mySocials.find((social) => social.name === "Linkedin");

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const commands = useMemo(() => {
    const navCommands = SECTIONS.map((section) => ({
      id: `goto-${section.id}`,
      group: "Navigate",
      glyph: "❯",
      label: section.label,
      keywords: section.keywords,
      run: () => {
        document
          .getElementById(section.id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        return "close";
      },
    }));

    const actionCommands = [
      {
        id: "enter-game",
        group: "Actions",
        glyph: "▶",
        label: "Enter 3D Mode — Diff World",
        keywords: "game play walk rpg world explore start",
        run: () => {
          window.dispatchEvent(new Event(ENTER_GAME_EVENT));
          return "close";
        },
      },
      {
        id: "copy-email",
        group: "Actions",
        glyph: "✦",
        label: copied ? `Copied ${myEmail} ✓` : "Copy email address",
        keywords: `mail ${myEmail}`,
        run: async () => {
          try {
            await navigator.clipboard.writeText(myEmail);
          } catch {
            const textarea = document.createElement("textarea");
            textarea.value = myEmail;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
          }
          setCopied(true);
          return "copied";
        },
      },
      {
        id: "send-email",
        group: "Actions",
        glyph: "✉",
        label: "Send me an email",
        keywords: "mailto message contact",
        run: () => {
          window.location.href = `mailto:${myEmail}`;
          return "close";
        },
      },
      {
        id: "open-github",
        group: "Actions",
        glyph: "⌥",
        label: "Open GitHub",
        keywords: "code repos source",
        run: () => {
          window.open(myGithub, "_blank", "noopener,noreferrer");
          return "close";
        },
      },
      ...(linkedIn?.href
        ? [
            {
              id: "open-linkedin",
              group: "Actions",
              glyph: "in",
              label: "Open LinkedIn",
              keywords: "profile network hire",
              run: () => {
                window.open(linkedIn.href, "_blank", "noopener,noreferrer");
                return "close";
              },
            },
          ]
        : []),
    ];

    return [...navCommands, ...actionCommands];
  }, [copied]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.keywords}`.toLowerCase().includes(term)
    );
  }, [commands, query]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, handleOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, handleOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    setQuery("");
    setActiveIndex(0);
    setCopied(false);
    requestAnimationFrame(() => inputRef.current?.focus());

    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const activeElement = listRef.current?.querySelector('[data-active="true"]');
    activeElement?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filtered.length]);

  const runCommand = async (command) => {
    const result = await command.run();
    if (result === "copied") {
      window.setTimeout(() => setIsOpen(false), 900);
      return;
    }
    setIsOpen(false);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      runCommand(filtered[activeIndex]);
    }
  };

  const groups = useMemo(() => {
    const grouped = [];
    filtered.forEach((command, index) => {
      const lastGroup = grouped[grouped.length - 1];
      if (!lastGroup || lastGroup.name !== command.group) {
        grouped.push({ name: command.group, items: [{ command, index }] });
        return;
      }
      lastGroup.items.push({ command, index });
    });
    return grouped;
  }, [filtered]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[16vh] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-midnight/95 shadow-[0_0_60px_rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="font-mono text-sm text-neutral-500" aria-hidden="true">
                &gt;_
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command or search..."
                className="w-full bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral-500"
                aria-label="Search commands"
              />
              <span className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500">
                esc
              </span>
            </div>

            <div ref={listRef} className="max-h-72 overflow-y-auto py-2">
              {groups.length === 0 && (
                <p className="px-4 py-6 text-center font-mono text-xs text-neutral-500">
                  No commands found for "{query}"
                </p>
              )}

              {groups.map((group) => (
                <div key={group.name}>
                  <p className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    {group.name}
                  </p>
                  {group.items.map(({ command, index }) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={command.id}
                        type="button"
                        data-active={isActive}
                        onClick={() => runCommand(command)}
                        onMouseMove={() => setActiveIndex(index)}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-neutral-300"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="inline-grid w-5 place-items-center font-mono text-[11px] text-neutral-500"
                            aria-hidden="true"
                          >
                            {command.glyph}
                          </span>
                          {command.label}
                        </span>
                        {isActive && (
                          <span className="font-mono text-[10px] text-neutral-500">
                            ↵
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2 font-mono text-[10px] text-neutral-500">
              <span>
                <span className="rounded border border-white/15 px-1 py-0.5">↑</span>{" "}
                <span className="rounded border border-white/15 px-1 py-0.5">↓</span>{" "}
                navigate
              </span>
              <span>
                <span className="rounded border border-white/15 px-1 py-0.5">↵</span>{" "}
                select
              </span>
              <span className="ml-auto hidden sm:inline">Diff's Portfolio OS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
