import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FlipWords } from "./FlipWords";
import HoverBorderButton from "./HoverBorderButton";

gsap.registerPlugin(useGSAP);

const HeroText = () => {
  const words = ["Secure", "Modern", "Scalable"];
  const heroRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".js-hero-reveal",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".js-hero-portrait",
        { autoAlpha: 0, y: 22, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    },
    { scope: heroRef }
  );

  return (
    <div ref={heroRef} className="relative z-10 flex w-full items-center py-20 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 text-center">
          <p className="js-hero-reveal text-[11px] tracking-[0.3em] text-neutral-200/85 uppercase">
            Fullstack Engineer • Bangkok
          </p>

          <h1 className="js-hero-reveal text-[clamp(1.25rem,5.1vw,3rem)] font-semibold leading-tight whitespace-nowrap text-white">
            Hi, I&apos;m Min Khant Than Swe
          </h1>

          <div className="space-y-3">
            <p className="js-hero-reveal text-xl text-neutral-200 sm:text-2xl md:text-3xl">
              I design and deliver
            </p>

            <div className="js-hero-reveal">
              <FlipWords
                words={words}
                className="font-black text-4xl text-white sm:text-5xl md:text-6xl"
              />
            </div>

            <p className="js-hero-reveal text-lg text-neutral-300 sm:text-xl md:text-2xl">
              fullstack products and software solutions.
            </p>
          </div>

          <div className="js-hero-reveal flex flex-wrap items-center justify-center gap-3">
            <HoverBorderButton href="#projects">View Projects</HoverBorderButton>
            <HoverBorderButton href="#contact">Let&apos;s Talk</HoverBorderButton>
          </div>
        </div>

        <div className="js-hero-portrait relative mx-auto w-full max-w-sm md:max-w-md">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.28),transparent_72%)] blur-xl" />
          <img
            src="/assets/Adobe Express - file.png"
            alt="Min Khant Than Swe profile"
            width="1024"
            height="1024"
            fetchPriority="high"
            decoding="async"
            className="relative mx-auto h-auto w-full max-w-[22rem] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroText;
