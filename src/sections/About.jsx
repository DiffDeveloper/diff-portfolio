import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/Frameworks";
import Marquee from "../components/Marquee";

const About = () => {
  const coreExpertise = [
    "Java",
    "Spring Boot",
    "React",
    "Node.js",
    "REST APIs",
    "System Monitoring",
  ];

  return (
    <section className="c-space section-spacing" id="about">
      <h2 className="text-heading">About Me</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* Grid 1 */}
        <div className="flex items-end grid-default-color grid-1">
          <img
            src="assets/coding-pov.png"
            className="absolute scale-[1.75] -right-[5rem] -top-[1rem] md:scale-[3] md:left-50 md:inset-y-10 lg:scale-[2.5]"
          />
          <div className="z-10">
            <p className="headtext">Min Khant Than Swe (AKA Diff)</p>
            <p className="subtext">
              Software Engineering student focused on fullstack application
              development with Java, Spring Boot, React, and Node.js.
              Experienced in enterprise backend support and client projects,
              with emphasis on reliable APIs, performance, and clean delivery.
            </p>
          </div>
          <div className="absolute inset-x-0 pointer-evets-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-indigo" />
        </div>
        {/* Grid 2 */}
        <div className="grid-default-color grid-2">
          <div className="flex h-full w-full flex-col items-center justify-center gap-5 text-center">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.2em] text-cyan-300/90 uppercase [text-shadow:0_0_10px_rgba(34,211,238,0.35)]">
                Professional Focus
              </p>
              <p className="mt-2 text-2xl font-semibold text-neutral-200 md:text-3xl">
                Core Expertise
              </p>
            </div>
            <div className="w-full max-w-[32rem]">
              <Marquee
                reverse
                repeat={5}
                className="[--duration:70s] [--gap:0.65rem] px-0 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
              >
                {coreExpertise.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-white/15 bg-midnight/60 px-3 py-2 text-xs text-neutral-200 sm:text-sm whitespace-nowrap"
                  >
                    {skill}
                  </span>
                ))}
              </Marquee>
            </div>
            <p className="subtext mx-auto max-w-lg text-center">
              Building reliable fullstack products with clean architecture and
              production-minded engineering.
            </p>
          </div>
        </div>
        {/* Grid 3 */}
        <div className="grid-black-color grid-3">
          <div className="z-10 w-[50%]">
            <p className="headtext">Time Zone</p>
            <p className="subtext">
              I am currently based in Bangkok, Thailand, and open to remote,
              onsite, and relocation opportunities.
            </p>
          </div>
          <figure className="absolute left-[30%] top-[10%]">
            <Globe />
          </figure>
        </div>
        {/* Grid 4 */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">
              Do you want to start a project together?
            </p>
            <CopyEmailButton />
          </div>
        </div>
        {/* Grid 5 */}
          <div className="grid-default-color grid-5">
            <div className="z-10 w-[50%]">
              <p className="headtext">Tech Stack</p>
              <p className="subtext">
                My core stack includes Java, Python, React, Node.js, Spring
                Boot, Django, and PostgreSQL, plus tools like Docker,
                Git/GitHub, and foundational exposure to AWS and Kubernetes.
              </p>
            </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
