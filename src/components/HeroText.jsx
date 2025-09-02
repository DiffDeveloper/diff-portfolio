import { FlipWords } from "./FlipWords";
import { motion } from "motion/react";

const HeroText = () => {
  const words = ["Secure", "Modern", "Scalable"];
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  
  return (
    <div className="z-10 mt-20 md:mt-40 rounded-3xl bg-clip-text w-full">
      {/* Desktop View - Centered layout */}
      <div className="hidden md:flex w-full flex-col items-center space-y-12">
        {/* Text - Centered */}
        <div className="text-center">
          <motion.h1
            className="text-3xl font-medium"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1 }}
          >
            Hi, I'm Min Khant Than Swe
          </motion.h1>
          <div className="flex flex-col items-center">
            <motion.p
              className="text-4xl font-medium text-neutral-300"
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.2 }}
            >
              A FullstackSoftware Engineer<br />
              Dedicated to Crafting
            </motion.p>
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.5 }}
            >
              <FlipWords
                words={words}
                className="font-black text-white text-6xl"
              />
            </motion.div>
            <motion.p
              className="text-3xl font-medium text-neutral-300"
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.8 }}
            >
              Fullstack & Software Solutions
            </motion.p>
          </div>
        </div>
        
        {/* Image - Large and centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: 2, 
            duration: 0.8, 
            ease: "easeOut" 
          }}
          className="w-[500px] h-[500px] flex items-center justify-center"
        >
          <img
            src="/assets/Adobe Express - file.png"
            alt="MKTS Portfolio"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error("Image failed to load:", e.target.src);
              e.target.style.display = 'none';
            }}
          />
        </motion.div>
      </div>
      
      {/* Mobile View - Stacked and centered */}
      <div className="md:hidden flex flex-col items-center space-y-8 text-center">
        {/* Text */}
        <motion.h1
          className="text-3xl font-medium"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          Hi, I'm Min Khant Than Swe
        </motion.h1>
        <div className="flex flex-col items-center">
          <motion.p
            className="text-4xl font-medium text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            A Software Engineer<br />
            A Fullstack Developer <br /> 
            Dedicated to Crafting
          </motion.p>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipWords
              words={words}
              className="font-black text-white text-6xl"
            />
          </motion.div>
          <motion.p
            className="text-3xl font-medium text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            Fullstack & Software Solutions
          </motion.p>
        </div>
        
        {/* Mobile Image - Large and centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: 2, 
            duration: 0.8, 
            ease: "easeOut" 
          }}
          className="w-80 h-80 flex items-center justify-center"
        >
          <img
            src="/assets/Adobe Express - file.png"
            alt="MKTS Portfolio"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error("Image failed to load:", e.target.src);
              e.target.style.display = 'none';
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroText;
