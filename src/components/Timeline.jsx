"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="relative c-space section-spacing" ref={containerRef}>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.09),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:linear-gradient(to_bottom,black_20%,transparent_90%)] bg-[repeating-linear-gradient(102deg,transparent_0_72px,rgba(255,255,255,0.03)_72px_74px,transparent_74px_148px)]" />

      <h2 className="text-heading">My Work Experience</h2>
      <div ref={ref} className="relative pb-20">
        {data.map((item, index) => {
          const isSunline = item.job.includes("Sunline Technology");
          const isLumonix = item.job.includes("Lumonix Lab AI");

          const jobClassName = isSunline
            ? "text-3xl text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]"
            : isLumonix
            ? "inline-block text-3xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.45)]"
            : "text-3xl text-neutral-500";

          const mobileJobClassName = isSunline
            ? "text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]"
            : isLumonix
            ? "inline-block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.45)]"
            : "text-neutral-300";

          return (
            <div
              key={index}
              className="flex justify-start pt-10 md:pt-40 md:gap-10"
            >
              <div className="sticky z-40 flex flex-col items-center self-start max-w-xs md:flex-row top-40 lg:max-w-sm md:w-full">
                <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-[15px] bg-midnight">
                  <div className="w-4 h-4 p-2 border rounded-full bg-neutral-800 border-neutral-700" />
                </div>
                <div className="flex-col hidden gap-2 text-xl font-bold md:flex md:pl-20 md:text-4xl text-neutral-300">
                  <h3>{item.date}</h3>
                  <h3 className="text-3xl text-neutral-400">{item.title}</h3>
                  <h3 className={jobClassName}>{item.job}</h3>
                </div>
              </div>

              <div className="relative w-full pl-20 pr-4 md:pl-4">
                <div className="block mb-4 text-2xl font-bold text-left text-neutral-300 md:hidden ">
                  <h3>{item.date}</h3>
                  <h3 className="text-xl text-neutral-400">{item.title}</h3>
                  <h3 className={mobileJobClassName}>{item.job}</h3>
                </div>

                <ul className="space-y-3">
                  {item.contents.map((content, contentIndex) => (
                    <li
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-neutral-200/95 backdrop-blur-[1px]"
                      key={contentIndex}
                    >
                      <span className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-white/0 via-white/75 to-white/0" />
                      <span className="block pl-2">{content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-1 left-1 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-white/85 via-white/40 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
