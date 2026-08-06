import { useState } from "react";
import { motion } from "motion/react";
import { OPEN_PALETTE_EVENT } from "../components/CommandPalette";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "tech", label: "Tech" },
  { id: "projects", label: "Projects" },
  { id: "experiences", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

function Navigation({ onNavigate = () => {} }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  return (
    <ul className="nav-ul">
      {NAV_ITEMS.map((item) => (
        <li key={item.id} className="nav-li">
          <a
            href={`#${item.id}`}
            className="nav-link"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(item.id);
              onNavigate();
            }}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform);

  return (
    <div className="fixed inset-x-0 z-20 w-full backdrop-blur-lg bg-primary/40">
      <div className="mx-auto c-space max-w-7xl">
        <div className="flex items-center justify-between py-4 sm:py-6">
          <a
            href="/"
            className="text-xl font-bold transition-colors text-neutral-400 hover:text-white"
          >
            Diff
          </a>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono text-[11px] text-neutral-400 transition-colors hover:border-white/30 hover:text-white focus-visible:border-white/40 focus-visible:text-white focus-visible:outline-none"
              aria-label="Open command palette"
            >
              <span aria-hidden="true">{isMac ? "⌘" : "Ctrl"}</span>
              <span aria-hidden="true">K</span>
            </button>
            <nav className="hidden sm:flex">
              <Navigation onNavigate={() => setIsOpen(false)} />
            </nav>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden"
            >
              <img
                src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
                className="h-6 w-6"
                alt="toggle"
              />
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          className="block overflow-hidden text-center sm:hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ maxHeight: "100vh" }}
          transition={{ duration: 1 }}
        >
          <nav className="pb-5">
            <Navigation onNavigate={() => setIsOpen(false)} />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
