import { motion } from "motion/react";
import { useEffect } from "react";

const ProjectDetails = ({
  title,
  description,
  subDescription,
  image,
  tags,
  href,
  closeModal,
}) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/75 p-0 backdrop-blur-md sm:p-6"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} details`}
    >
      <motion.div
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-gradient-to-b from-midnight to-navy shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:w-full sm:max-w-4xl sm:rounded-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-midnight/95 px-4 py-3 backdrop-blur sm:px-6">
          <p className="max-w-[80%] truncate text-sm tracking-[0.08em] text-cyan-300/90 uppercase">
            Project Overview
          </p>
          <button
            onClick={closeModal}
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-navy/80 transition hover:border-cyan-300/70 hover:bg-cyan-300/10"
            aria-label="Close project details"
          >
            <img src="assets/close.svg" className="size-5" alt="Close" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="border-b border-white/10 bg-gradient-to-b from-navy/70 to-midnight/70 px-3 py-3 sm:px-4 sm:py-4">
            <img
              src={image}
              alt={title}
              className="mx-auto h-auto max-h-[45dvh] w-full rounded-lg object-contain sm:max-h-[50dvh]"
            />
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            <div className="space-y-3">
              <h5 className="text-2xl font-semibold text-white sm:text-3xl">
                {title}
              </h5>
              <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                {description}
              </p>
            </div>

            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-white/15 bg-midnight/70 px-3 py-1 text-xs text-neutral-200"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {subDescription.map((subDesc, index) => (
                <p
                  key={`${title}-detail-${index}`}
                  className="text-sm leading-relaxed text-neutral-300 sm:text-base"
                >
                  {subDesc}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={closeModal}
                className="rounded-full border border-white/20 px-5 py-2 text-sm text-neutral-200 transition hover:border-cyan-300/70 hover:text-white"
              >
                Close
              </button>

              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/45 bg-cyan-300/10 px-5 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-300/80 hover:bg-cyan-300/20"
                >
                  View Project
                  <img src="assets/arrow-up.svg" className="size-4" alt="Open" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
