import { motion } from "motion/react";
import ShineBorder from "../components/ShineBorder";

const achievementToneStyles = {
  amber: {
    dot: "bg-orange",
  },
  pink: {
    dot: "bg-fuchsia",
  },
};

const EducationCard = ({
  degree,
  institution,
  date,
  description,
  achievements,
  index,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
      className="group relative overflow-hidden rounded-2xl bg-midnight/70 p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
    >
      <ShineBorder
        borderWidth={1}
        duration={8}
        shineColor={["#22d3ee", "#57db96", "#22d3ee"]}
        className="rounded-2xl"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] tracking-[0.18em] text-aqua/80 uppercase">
            Education
          </p>
          <h3 className="text-lg font-semibold leading-snug text-white md:text-xl">
            {degree}
          </h3>
          <p className="text-sm text-neutral-300 md:text-base">{institution}</p>
        </div>
        <span className="min-w-[8.75rem] shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-midnight/55 px-3 py-1.5 text-center text-xs leading-none text-neutral-300">
          {date}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-300 md:text-base">
        {description}
      </p>

      {achievements && achievements.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3 text-sm font-medium text-white">Highlights</h4>
          <ul className="ml-4 list-disc space-y-2 text-left text-xs text-neutral-200 md:text-sm">
            {achievements.map((achievement, achievementIndex) => (
              <li key={achievementIndex} className="leading-relaxed marker:text-aqua">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.article>
  );
};

const AchievementCard = ({
  title,
  description,
  date,
  location,
  tone,
  index,
}) => {
  const toneStyle = achievementToneStyles[tone] || achievementToneStyles.pink;

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.25 }}
      className="group relative overflow-hidden rounded-2xl bg-midnight/70 p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
    >
      <ShineBorder
        borderWidth={1}
        duration={8}
        shineColor={["#22d3ee", "#57db96", "#22d3ee"]}
        className="rounded-2xl"
      />

      <div className="flex items-start justify-between gap-4">
        <h3 className="pr-2 text-base font-semibold leading-snug text-white md:text-lg">
          {title}
        </h3>
        <span className="min-w-[8.75rem] shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-midnight/55 px-3 py-1.5 text-center text-xs leading-none text-neutral-300">
          {date}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-300 md:text-base">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm text-neutral-300">
        <span className={`size-2 rounded-full ${toneStyle.dot}`} />
        {location && <p>{location}</p>}
      </div>
    </motion.article>
  );
};

export default function EducationAndAchievements() {
  const education = [
    {
      degree: "Bachelor of Engineering in Software Engineering",
      institution: "Mae Fah Luang University",
      date: "August 2022 - May 2026 (Expected)",
      description:
        "Software engineering curriculum centered on practical application development, architecture fundamentals, and team-based delivery.",
      achievements: [
        "Current GPA: 3.80",
        "Software Engineering specialization",
        "Built fullstack and AI-focused academic projects",
        "Hands-on experience with agile collaboration",
      ],
    },
    {
      degree: "Web Development Certification",
      institution: "AB Web Beginner Class",
      date: "August 2020 - January 2021",
      description:
        "Foundational web development training focused on building complete web pages and practical frontend implementation.",
      achievements: [
        "Successfully completed and passed",
        "Mastered PHP, HTML, CSS fundamentals",
        "Applied basic JavaScript in practical exercises",
        "Built and styled complete web interfaces",
      ],
    },
  ];

  const achievements = [
    {
      title: "Hackathon Finalist - Group Interview Challenge",
      description:
        "Passed the competitive group hackathon/interview challenge at Issa Compass, demonstrating collaboration, communication, and structured problem-solving under pressure.",
      date: "March 2025",
      location: "Bangkok, Thailand",
      tone: "amber",
    },
    {
      title: "Project Manager - Software Engineering Open House",
      description:
        "Showcased RepoAI at the Software Engineering Open House, presenting AI-driven GitHub workflows, system architecture, and project outcomes to students and faculty.",
      date: "February 2025",
      location: "Chiang Rai, Thailand",
      tone: "pink",
    },
  ];

  return (
    <section id="education" className="c-space section-spacing">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(40,43,75,0.55)_0%,rgba(31,30,57,0.45)_40%,rgba(6,9,31,0.85)_75%,rgba(3,4,18,0.95)_100%)] p-6 md:p-10">
        <div className="relative z-10">
          <p className="text-xs tracking-[0.25em] text-cyan-300/90 uppercase [text-shadow:0_0_12px_rgba(34,211,238,0.32)]">
            Academic Journey
          </p>
          <h2 className="mt-3 text-heading">Education & Achievements</h2>
          <p className="subtext mt-3 max-w-3xl">
            A quick view of my formal education and key milestones that shaped
            my growth as a software engineer.
          </p>

          <div className="mt-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="size-2 rounded-full bg-aqua shadow-[0_0_10px_rgba(51,194,204,0.6)]" />
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                Education
              </h3>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {education.map((edu, index) => (
                <EducationCard key={edu.degree} index={index} {...edu} />
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="size-2 rounded-full bg-fuchsia shadow-[0_0_10px_rgba(202,47,140,0.55)]" />
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                Key Achievements
              </h3>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {achievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.title}
                  index={index}
                  {...achievement}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
