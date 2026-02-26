import HeroText from "../components/HeroText";
import BackgroundBeams from "../components/BackgroundBeams";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden c-space"
    >
      <div className="pointer-events-none absolute inset-0 -z-40 bg-[#030412]" />

      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_14%,rgba(34,211,238,0.14),transparent_42%,rgba(3,4,18,0.84)_100%)]" />

      <BackgroundBeams className="-z-30" />

      <HeroText />
    </section>
  );
};

export default Hero;
