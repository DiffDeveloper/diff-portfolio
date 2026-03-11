import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ProjectDetails = ({
  title,
  description,
  outcome,
  subDescription,
  image,
  tags,
  href,
  liveUrl,
  closeModal,
}) => {
  const dialogRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeModal, title]);

  const modalContent = (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-0 backdrop-blur-[2px] sm:p-6"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} details`}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex h-[100svh] w-full flex-col overflow-hidden border border-white/10 bg-gradient-to-b from-midnight to-navy shadow-[0_20px_65px_rgba(0,0,0,0.62)] transition-transform duration-200 sm:h-auto sm:max-h-[88svh] sm:w-full sm:max-w-4xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-midnight/95 px-4 py-3 backdrop-blur sm:px-6">
          <p className="max-w-[80%] truncate text-sm tracking-[0.08em] text-neutral-200/90 uppercase">
            Project Overview
          </p>
          <button
            onClick={closeModal}
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-navy/80 transition hover:border-white/70 hover:bg-white/10"
            aria-label="Close project details"
          >
            <img src="/assets/close.svg" className="size-5" alt="Close" />
          </button>
        </div>

        <div ref={scrollContainerRef} className="project-modal-scroll overflow-y-auto">
          <div className="border-b border-white/10 bg-gradient-to-b from-navy/70 to-midnight/70 px-3 py-3 sm:px-4 sm:py-4">
            <img
              src={image}
              alt={title}
              loading="eager"
              decoding="sync"
              className="mx-auto h-auto max-h-[45dvh] w-full rounded-lg object-contain sm:max-h-[50dvh]"
            />
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            <div className="space-y-3">
              <h5 className="text-2xl font-semibold text-white sm:text-3xl">
                {title}
              </h5>
              <p className="text-[11px] tracking-[0.16em] text-neutral-100 uppercase">
                Problem
              </p>
              <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
                {description}
              </p>
            </div>

            {outcome && (
              <div className="rounded-xl border border-white/25 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-neutral-100 uppercase">
                  Result
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-200 sm:text-base">
                  {outcome}
                </p>
              </div>
            )}

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
              <p className="text-[11px] tracking-[0.16em] text-neutral-100 uppercase">
                What I Built
              </p>
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
                className="rounded-full border border-white/20 px-5 py-2 text-sm text-neutral-200 transition hover:border-white/70 hover:text-white"
              >
                Close
              </button>

              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:border-white/80 hover:bg-white/20"
                >
                  Live Demo
                  <img src="/assets/arrow-up.svg" className="size-4" alt="Open" />
                </a>
              )}

              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:border-white/80 hover:bg-white/20"
                >
                  Source Code
                  <img src="/assets/arrow-up.svg" className="size-4" alt="Open" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;

  return createPortal(modalContent, document.body);
};

export default ProjectDetails;
