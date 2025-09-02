import HeroText from "../components/HeroText";
import { Particles } from "../components/Particles";
import { Frameworks } from "../components/Frameworks";

const Hero = () => {
  return (
    <section id="home" className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space">
      <HeroText />
      
      {/* Tech Stacks Background - Orbiting frameworks */}
      <div className="absolute inset-0 -z-40">
        <Frameworks />
      </div>
      
      {/* Particles Background - Same as Contact.jsx */}
      <Particles
        className="absolute inset-0 -z-50"
        quantity={100}
        ease={80}
        color={"#ffffff"}
        refresh
      />
    </section>
  );
};

export default Hero;
