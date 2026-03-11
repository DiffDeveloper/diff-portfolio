import HeroText from "../components/HeroText";
import BackgroundBeams from "../components/BackgroundBeams";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden c-space"
    >
      <div className="pointer-events-none absolute inset-0 -z-40 bg-[#050505]" />

      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.16),transparent_44%,rgba(5,5,5,0.9)_100%)]" />

      <BackgroundBeams className="-z-30" />

      <HeroText />
    </section>
  );
};

export default Hero;
