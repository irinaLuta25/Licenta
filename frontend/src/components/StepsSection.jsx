import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const StepsSection = ({ title, steps }) => (
  <motion.div
    className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)] mb-12"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={{
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.3 },
      },
    }}
  >
    <h1 className="text-2xl font-bold text-indigo-900 mb-6">{title}</h1>
    <div className="flex flex-wrap gap-6 items-center justify-center">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.2 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.5 }}
            className="w-64 h-48 bg-white/80 p-6 rounded-xl shadow-md backdrop-blur-sm border border-white/40 text-center flex flex-col items-center justify-start gap-2"
          >
            <div className="text-indigo-700 mb-4">{step.icon}</div>
            <h4 className="text-lg font-semibold text-indigo-900">{step.title}</h4>
            <p className="text-gray-700 text-sm">{step.description}</p>
          </motion.div>

          {index < steps.length - 1 && (
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.3 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#ec4899] text-white p-2 rounded-full shadow-md flex items-center justify-center"
            >
              <FaChevronRight size={16} />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  </motion.div>
);

export default StepsSection;
