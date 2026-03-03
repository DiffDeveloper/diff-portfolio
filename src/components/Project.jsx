import { useState } from "react";
import ProjectDetails from "./ProjectDetails";
import ShineBorder from "./ShineBorder";

const Project = ({
  title,
  description,
  outcome,
  subDescription,
  href,
  liveUrl,
  image,
  tags,
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const isFeatured = variant === "featured";

  return (
    <>
      <article
        onPointerEnter={() => setIsInteractive(true)}
        onPointerLeave={() => setIsInteractive(false)}
        onFocusCapture={() => setIsInteractive(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsInteractive(false);
          }
        }}
        className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-midnight/80 to-primary/90 transition-transform duration-300 hover:-translate-y-1 ${
          isFeatured ? "p-5 sm:p-6" : "p-4 sm:p-5"
        }`}
      >
        {isFeatured && isInteractive && (
          <ShineBorder
            borderWidth={1}
            duration={8}
            shineColor={["#22d3ee", "#57db96", "#22d3ee"]}
            className="rounded-2xl"
          />
        )}

        <div className="relative z-10 flex h-full flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-midnight/65">
            <img
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
              className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
                isFeatured
                  ? "h-44 sm:h-52 md:h-56 lg:h-60"
                  : "h-36 sm:h-40 md:h-44"
              }`}
            />
          </div>

          <div className="space-y-3">
            <h3
              className={`font-semibold text-white ${
                isFeatured ? "text-xl md:text-2xl" : "text-lg md:text-xl"
              }`}
            >
              {title}
            </h3>

            <p className="text-sm leading-relaxed text-neutral-300 md:text-base">
              {description}
            </p>

            {outcome && (
              <p className="text-sm leading-relaxed text-cyan-200/95">
                <span className="font-medium">Outcome:</span> {outcome}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.slice(0, isFeatured ? 5 : 4).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-midnight/70 px-3 py-1 text-xs text-neutral-200"
              >
                {tag.path && (
                  <img
                    src={tag.path}
                    alt={tag.name}
                    className="size-3.5 object-contain"
                  />
                )}
                {tag.name}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-full border border-cyan-300/45 bg-cyan-300/10 px-4 py-2 text-xs font-medium text-cyan-100 transition hover:border-cyan-300/80 hover:bg-cyan-300/20"
            >
              View Case Study
            </button>

            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 text-xs text-neutral-200 transition hover:border-cyan-300/70 hover:text-white"
              >
                Live Demo
              </a>
            )}

            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 text-xs text-neutral-200 transition hover:border-cyan-300/70 hover:text-white"
              >
                Source Code
              </a>
            )}
          </div>
        </div>
      </article>

      {isOpen && (
        <ProjectDetails
          title={title}
          description={description}
          outcome={outcome}
          subDescription={subDescription}
          image={image}
          tags={tags}
          href={href}
          liveUrl={liveUrl}
          closeModal={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Project;
