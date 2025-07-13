import React, { useState } from "react";
import { motion } from "framer-motion";
import TextAnimation from "../TextAnimation";
import "./HeroBubbles.css";

const HeroSectionSpecialist = ({ onExploreClick }) => {

  return (
    <section className="relative z-10 pb-15 mt-[-25px] min-h-[105vh] flex items-center justify-center lg:px-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`floating-bubble bubble-${i + 1}`} />
        ))}
      </div>

      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
        <div className="flex-1 flex flex-col gap-6 justify-center text-center lg:text-left lg:pr-12">
          <TextAnimation
            text="Bine ai venit! Fiecare sesiune contează."
            className="text-6xl font-extrabold bg-gradient-to-r from-[#ec4899] via-[#7c3aed] to-[#4f46e5] text-transparent bg-clip-text leading-tight"
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              fontFamily: "'Poppins', sans-serif",
            }}
          />

          <div className="flex flex-col gap-6 pt-6 min-h-[220px]">
            <motion.p
              className="text-xl text-gray-700"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.6 }}
            >
              Îți dedici timpul pentru a schimba vieți. MindCare te ajută să îți organizezi sesiunile și să ai un impact real.
            </motion.p>

            <motion.blockquote
              className="italic text-indigo-800 text-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, amount: 0.6 }}
            >
              “Grija față de ceilalți începe cu organizare, empatie și dedicare.”
            </motion.blockquote>

            <motion.button
              className="w-64 bg-orange-500 text-white px-6 py-3 mt-4 rounded-xl text-lg shadow-md hover:bg-orange-600 transition mx-auto lg:mx-0"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.6 }}
              onClick={onExploreClick}
            >
              Vezi cum funcționează
            </motion.button>
          </div>
        </div>

        <div className="flex-1 flex justify-center mt-10 lg:mt-0">
          <motion.img
            src="/assets/hero_img.png"
            alt="MindCare Specialist Illustration"
            className="w-full max-w-[600px] lg:w-[400px] rounded-xl"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.4 }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSectionSpecialist;
