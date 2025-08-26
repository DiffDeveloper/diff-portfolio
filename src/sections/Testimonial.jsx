import { motion } from "motion/react";

const EducationCard = ({ degree, institution, date, description, achievements }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative p-6 border rounded-xl border-gray-50/[.1] bg-gradient-to-r bg-indigo to-storm hover:bg-royal hover-animation"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{degree}</h3>
          <p className="text-neutral-300 mb-1">{institution}</p>
          <p className="text-sm text-neutral-400">{date}</p>
        </div>
      </div>
      <p className="text-neutral-300 mb-4">{description}</p>
      {achievements && achievements.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Key Achievements:</h4>
          <ul className="space-y-1">
            {achievements.map((achievement, index) => (
              <li key={index} className="text-sm text-neutral-300 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

const AchievementCard = ({ title, description, date, icon, location }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative p-6 border rounded-xl border-gray-50/[.1] bg-gradient-to-r bg-indigo to-storm hover:bg-royal hover-animation"
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && <div className="text-2xl">{icon}</div>}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-neutral-300 mb-2">{description}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">{date}</p>
        {location && <p className="text-sm text-neutral-400">{location}</p>}
      </div>
    </motion.div>
  );
};

export default function EducationAndAchievements() {
  const education = [
    {
      degree: "Bachelor of Engineering in Software Engineering",
      institution: "Mae Fah Luang University",
      date: "August 2021 - Present",
      description: "Comprehensive software engineering program focusing on modern development practices, algorithms, and software architecture.",
      achievements: [
        "Current GPA: 3.80",
        "Software Engineering specialization",
        "Active in software development projects",
        "Studying modern development methodologies"
      ]
    },
    {
      degree: "Web Development Certification",
      institution: "AB Web Beginner Class",
      date: "August 2020 - January 2021",
      description: "Intensive web development course covering fundamental technologies and practical application building.",
      achievements: [
        "Successfully completed and passed",
        "Mastered PHP, HTML, CSS fundamentals",
        "Gained practical skills in web application development",
        "Built and styled complete web applications"
      ]
    }
  ];

  const achievements = [
    {
      title: "Hackathon Finalist - Group Interview Challenge",
      description: "Successfully passed the competitive group hackathon/interview challenge at Issa Compass, showcasing collaboration, problem-solving, and communication under pressure. Recognized for strong performance in both technical and interpersonal aspects.",
      date: "March 2025",
      icon: "🏆",
      location: "Bangkok, Thailand"
    },
    {
      title: "Project Manager - Software Engineering Open House",
      description: "Selected to showcase RepoAI, an AI-powered GitHub assistant, at the Software Engineering Open House. Demonstrated the system's real-time LLM integration, GitHub automation, and code refactoring capabilities to students, faculty, and visitors. Engaged in Q&A and explained AI model workflows, system architecture, and project outcomes.",
      date: "February 2025",
      icon: "🤖",
      location: "Chiang Rai, Thailand"
    }
  ];

  return (
    <section id="education" className="items-start mt-25 md:mt-35 c-space">
      <h2 className="text-heading">Education & Achievements</h2>
      
      {/* Education Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-white mb-6">Education</h3>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {education.map((edu, index) => (
            <EducationCard key={index} {...edu} />
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-white mb-6">Key Achievements</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {achievements.map((achievement, index) => (
            <AchievementCard key={index} {...achievement} />
          ))}
        </div>
      </div>
    </section>
  );
}
