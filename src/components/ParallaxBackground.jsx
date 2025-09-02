import { motion, useScroll, useSpring, useTransform } from "motion/react";

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { damping: 50 });
  const starsY = useTransform(x, [0, 0.5], ["0%", "30%"]);

  return (
    <section className="absolute inset-0">
      <div className="relative h-screen overflow-y-hidden">
        {/* Dark Black-Purple Gradient Background */}
        <div
          className="absolute inset-0 w-full h-screen -z-50"
          style={{
            background: `
              radial-gradient(ellipse at center, 
                rgba(88, 28, 135, 0.2) 0%, 
                rgba(59, 7, 100, 0.15) 30%, 
                rgba(30, 10, 63, 0.2) 60%, 
                rgba(0, 0, 0, 1) 100%)
            `,
          }}
        />
        
        {/* Very subtle purple overlay for depth */}
        <div
          className="absolute inset-0 w-full h-screen -z-45"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(147, 51, 234, 0.03) 0%, 
                transparent 50%, 
                rgba(79, 70, 229, 0.03) 100%)
            `,
          }}
        />

        {/* Subtle animated stars */}
        <motion.div
          className="absolute inset-0 -z-40"
          style={{
            backgroundImage: "radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 160px 30px, rgba(255,255,255,0.3), transparent)",
            backgroundRepeat: "repeat",
            backgroundSize: "200px 100px",
            y: starsY,
          }}
        />

        {/* Very subtle floating particles */}
        <div className="absolute inset-0 -z-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParallaxBackground;
