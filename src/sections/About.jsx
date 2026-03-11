import { Globe } from "../components/globe";
import Marquee from "../components/Marquee";
import { PinContainer } from "../components/PinContainer";
import ShineBorder from "../components/ShineBorder";

const About = () => {
  const linkedInProfile =
    "https://www.linkedin.com/in/min-khant-than-swe-29b877323/";

  const coreStack = [
    "C++",
    "Java",
    "Python",
    "Spring Boot",
    "React",
    "Next.js",
    "NestJS",
    "Firebase",
    "PostgreSQL",
    "JavaScript",
    "Docker",
    "Tailwind CSS",
    "Node.js",
    "Django",
  ];

  return (
    <section className="c-space mt-20 md:mt-24" id="about">
      <h2 className="text-heading">About Me</h2>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(18rem,auto)] lg:auto-rows-[18rem]">
        {/* Grid 1 */}
        <div className="grid-default-color grid-1">
          <img
            src="assets/coding-pov.png"
            className="absolute inset-0 h-full w-full object-cover object-[60%_22%] opacity-60"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/84 via-midnight/58 to-midnight/18" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_14%,rgba(255,255,255,0.16),transparent_46%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-primary/70 to-transparent" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 py-3 sm:gap-3 sm:py-4">
            <p className="text-sm tracking-[0.28em] text-neutral-100/90 uppercase transition duration-300 hover:text-white hover:[text-shadow:0_0_10px_rgba(255,255,255,0.55),0_0_24px_rgba(255,255,255,0.35)] sm:text-base md:text-lg">
              Diff
            </p>

            <PinContainer
              title="linkedin.com/in/min-khant-than-swe"
              href={linkedInProfile}
              containerClassName="w-full max-w-3xl"
            >
              <div className="px-0.5 sm:px-1">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3 sm:gap-3">
                  <p className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
                    Min Khant Than Swe
                  </p>
                </div>

                <p className="max-w-[65ch] text-[13px] leading-relaxed text-neutral-200 sm:text-sm md:text-base">
                  Software Engineering student with a strong backend-first
                  mindset, grounded in C++ and focused on building fullstack
                  systems with Java, Spring Boot, Next.js, and NestJS.
                  Experienced in enterprise support and production-minded API
                  delivery.
                </p>

                <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/45 to-white/0" />

                  <p className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.08em] text-neutral-300 uppercase sm:text-[11px] sm:tracking-[0.12em] md:text-xs">
                    <span className="rounded-full border border-white/35 bg-white/12 px-2 py-0.5 text-white">
                      Now
                    </span>
                    Java Developer Intern @ Sunline (Bangkok)
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "5+ Projects Shipped",
                      "2 Internships",
                      "1 AI Capstone",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/15 bg-primary/45 px-2.5 py-1 text-[10px] text-neutral-200 sm:px-3 sm:text-[11px] md:text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] text-neutral-200/75 sm:text-[11px] md:text-xs">
                    Tap or hover for 3D - Click for LinkedIn
                  </p>
                </div>
              </div>
            </PinContainer>
          </div>
        </div>
        {/* Grid 2 */}
        <div className="group grid-default-color grid-2">
          <ShineBorder
            borderWidth={1}
            duration={8}
            shineColor={["#ffffff", "#bdbdbd", "#ffffff"]}
            className="rounded-2xl"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/84 via-midnight/58 to-midnight/18" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_22%,rgba(255,255,255,0.15),transparent_48%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-primary/70 to-transparent" />

          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-5 text-center">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.2em] text-neutral-200/90 uppercase [text-shadow:0_0_10px_rgba(255,255,255,0.28)]">
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
                {coreStack.map((skill) => (
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
      </div>
    </section>
  );
};

export default About;
