import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import TechOrbit from "./sections/TechOrbit";
import Projects from "./sections/Projects";
import Experiences from "./sections/Experiences";
import EducationAndAchievements from "./sections/Testimonial";
import Contact from "./sections/Contact";
import Footer from './sections/Footer';
import PageLoader from "./components/PageLoader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const appRef = useRef(null);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoading]);

  useGSAP(
    () => {
      if (isLoading) return;

      const sections = gsap.utils.toArray("[data-cinematic-section]");
      gsap.set(sections, { autoAlpha: 0, y: 44 });
      gsap.set(appRef.current, { autoAlpha: 0 });

      gsap.to(appRef.current, {
        autoAlpha: 1,
        duration: 0.7,
        ease: "power2.out",
      });

      sections.forEach((section) => {
        gsap.to(section, {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });
      });
    },
    { scope: appRef, dependencies: [isLoading], revertOnUpdate: true }
  );

  return (
    <>
      {isLoading && <PageLoader />}

      <div
        ref={appRef}
        className={`container mx-auto max-w-7xl ${
          isLoading ? "pointer-events-none" : ""
        }`}
      >
        <Navbar />
        <Hero />
        <div data-cinematic-section>
          <About />
        </div>
        <div data-cinematic-section>
          <TechOrbit />
        </div>
        <div data-cinematic-section>
          <Projects />
        </div>
        <div data-cinematic-section>
          <Experiences />
        </div>
        <div data-cinematic-section>
          <EducationAndAchievements />
        </div>
        <div data-cinematic-section>
          <Contact />
        </div>
        <div data-cinematic-section>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
