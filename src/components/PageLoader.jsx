import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const PageLoader = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(".js-loader-bar", { scaleX: 0, transformOrigin: "left center" });

      const pulseTimeline = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });

      pulseTimeline
        .fromTo(
          ".js-loader-brand",
          { opacity: 0.35, scale: 0.95, letterSpacing: "0.15em" },
          { opacity: 1, scale: 1, letterSpacing: "0.24em", duration: 0.6 }
        )
        .to(
          ".js-loader-brand",
            {
              textShadow:
                "0 0 14px rgba(255, 255, 255, 0.72), 0 0 26px rgba(255, 255, 255, 0.4)",
              duration: 0.55,
            },
          0
        )
        .to(".js-loader-brand", { opacity: 0.82, duration: 0.55 })
        .to(".js-loader-bar", { scaleX: 1, duration: 0.9, ease: "power3.out" }, 0)
        .set(".js-loader-bar", { scaleX: 0, transformOrigin: "left center" });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="page-loader" role="status" aria-live="polite">
      <div className="page-loader__scanline" aria-hidden="true" />
      <div className="page-loader__grain" aria-hidden="true" />

      <div className="page-loader__content">
        <p className="page-loader__eyebrow">Initializing Experience</p>
        <h1 className="page-loader__brand js-loader-brand">Diff</h1>
        <div className="page-loader__progress" aria-hidden="true">
          <span className="js-loader-bar" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
