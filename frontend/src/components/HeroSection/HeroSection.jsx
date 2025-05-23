import React, { useState } from "react";
import { motion } from "framer-motion";
import TextAnimation from "../TextAnimation";
import "./HeroBubbles.css";

const HeroSection = ({ onExploreClick }) => {
  const [showContent, setShowContent] = useState(false);

  return (
    <section className="relative z-10 pb-15 mt-[-25px] min-h-[105vh] flex items-center justify-center lg:px-12 overflow-hidden">
      {/* Bule animate */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`floating-bubble bubble-${i + 1}`} />
        ))}
      </div>

      {/* Conținut Hero */}
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
        {/* TEXT STÂNGA */}
        <div className="flex-1 flex flex-col gap-6 justify-center text-center lg:text-left lg:pr-12">
          <TextAnimation
            text="Bine ai venit! Grija față de tine începe aici."
            className="text-6xl font-extrabold bg-gradient-to-r from-[#ec4899] via-[#7c3aed] to-[#4f46e5] text-transparent bg-clip-text leading-tight"
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              fontFamily: "'Poppins', sans-serif",
            }}
            onComplete={() => setShowContent(true)}
          />

          <div className="flex flex-col gap-6 pt-6 min-h-[220px]">
            {/* Paragraf */}
            <motion.p
              className="text-xl text-gray-700"
              initial={false}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6 }}
              style={{ visibility: showContent ? "visible" : "hidden" }}
            >
              Descoperă un spațiu dedicat stării tale de bine în mediul de lucru.
            </motion.p>

            {/* Citat */}
            <motion.blockquote
              className="italic text-indigo-800 text-lg"
              initial={false}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ visibility: showContent ? "visible" : "hidden" }}
            >
              “A avea grijă de tine nu este egoism — este responsabilitate.”
            </motion.blockquote>

            {/* Buton */}
            <motion.button
              className="w-64 bg-orange-500 text-white px-6 py-3 mt-4 rounded-xl text-lg shadow-md hover:bg-orange-600 transition mx-auto lg:mx-0"
              whileTap={{ scale: 0.95 }}
              initial={false}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ visibility: showContent ? "visible" : "hidden" }}
              onClick={onExploreClick}
            >
              Explorează beneficiile
            </motion.button>
          </div>
        </div>

        {/* IMAGINE */}
        <div className="flex-1 flex justify-center mt-10 lg:mt-0">
          <motion.img
            src="/assets/hero_img.png"
            alt="MindCare Illustration"
            className="w-full max-w-[600px] lg:w-[400px] rounded-xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : 100 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
