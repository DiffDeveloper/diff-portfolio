import { motion } from "motion/react";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const isExternalLink = (href) => /^https?:\/\//i.test(href ?? "");

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}) => {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? {
        href,
        target: isExternalLink(href) ? "_blank" : undefined,
        rel: isExternalLink(href) ? "noopener noreferrer" : undefined,
        "aria-label": title ? `Open ${title}` : "Open link",
      }
    : {};

  return (
    <Wrapper
      className={joinClasses(
        "group/pin relative block w-full touch-manipulation rounded-2xl [perspective:1000px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
        containerClassName
      )}
      {...wrapperProps}
    >
      <motion.div
        className={joinClasses(
          "relative rounded-2xl border border-white/20 bg-midnight/60 p-4 sm:p-5 shadow-[0_12px_30px_rgba(3,4,18,0.55)] backdrop-blur-sm transition-colors duration-300 will-change-transform group-active/pin:border-cyan-300/55 group-focus-visible/pin:border-cyan-300/55 md:group-hover/pin:border-cyan-300/50",
          className
        )}
        transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.8 }}
        whileHover={{ rotateX: 20, scale: 0.95, y: -4 }}
        whileTap={{ rotateX: 10, scale: 0.98, y: -1 }}
      >
        {children}
      </motion.div>

      <PinPerspective title={title} />
    </Wrapper>
  );
};

const PinPerspective = ({ title }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute inset-x-0 top-2 flex justify-center opacity-0 transition-opacity duration-300 group-active/pin:opacity-100 group-focus-visible/pin:opacity-100 md:group-hover/pin:opacity-100">
        <div className="rounded-full border border-cyan-300/35 bg-primary/90 px-3 py-1 text-[11px] tracking-[0.16em] text-cyan-200 uppercase">
          {title}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-1 flex justify-center opacity-0 transition-opacity duration-300 group-active/pin:opacity-100 group-focus-visible/pin:opacity-100 md:bottom-[-2.6rem] md:group-hover/pin:opacity-100">
        <div className="relative h-14 w-40 [transform:rotateX(70deg)] sm:h-20 sm:w-52 md:h-24 md:w-56">
          <motion.div
            className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-lg sm:size-20 md:size-24 md:blur-xl"
            animate={{ opacity: [0, 0.8, 0], scale: [0.35, 1.1, 1.45] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/18 blur-lg sm:size-20 md:size-24 md:blur-xl"
            animate={{ opacity: [0, 0.7, 0], scale: [0.35, 1.1, 1.45] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/16 blur-lg sm:size-20 md:size-24 md:blur-xl"
            animate={{ opacity: [0, 0.65, 0], scale: [0.35, 1.1, 1.45] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeOut", delay: 2.4 }}
          />

          <div className="absolute left-1/2 top-0 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/0 via-cyan-300/45 to-cyan-300/0 blur-[1px] sm:h-16 md:h-20" />
          <div className="absolute left-1/2 top-0 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/0 via-cyan-300/65 to-cyan-300/0 sm:h-16 md:h-20" />
          <div className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-cyan-300/90 blur-[1px] md:size-2" />
        </div>
      </div>
    </div>
  );
};
