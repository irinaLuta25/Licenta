import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { FaUserMd, FaCalendarAlt, FaComments, FaChartLine, FaMedal, FaSmile } from "react-icons/fa";
import StepsSection from "../components/StepsSection";
import HeroSectionSpecialist from "../components/HeroSection/HeroSectionSpecialist";


function HomepageSpecialist() {
  const howItWorksRef = useRef(null);

  return (
    <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800">
      <Navbar />

      <div className="flex flex-col">
        {/* Hero Section */}
        <HeroSectionSpecialist onExploreClick={() => {
          howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
        }} />

        {/* Despre impactul specialiștilor */}
        <section className="mt-20 py-16 bg-gradient-to-r from-[#f0fdf4] via-[#e0f2fe] to-[#dbeafe] text-center px-4 mb-12">
          <motion.h2
            className="text-3xl font-bold text-indigo-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Rolul tău face diferența
          </motion.h2>

          <motion.p
            className="text-gray-700 mb-12 mt-10 max-w-2xl mx-auto leading-relaxed text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Ca specialist, contribui direct la echilibrul emoțional al angajaților. Platforma MindCare te ajută să-ți organizezi sesiunile, să urmărești progresul și să creezi un impact real.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: "👥",
                title: "Construiești relații de încredere",
                text: "Întâlnești clienți care au nevoie de ghidare și susținere.",
              },
              {
                icon: "📊",
                title: "Monitorizezi progresul",
                text: "Primești feedback constant și vezi impactul muncii tale.",
              },
              {
                icon: "🎯",
                title: "Contribui la bunăstare",
                text: "Fiecare sesiune ajută la prevenția burnout-ului în companie.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <p className="text-4xl mb-4">{card.icon}</p>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-700">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <motion.section
          ref={howItWorksRef}
          className="mt-20 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-8" style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)" }}>
            Ce poți face cu MindCare
          </h2>

          <StepsSection
            title="🧭 Ghidarea angajaților"
            steps={[
              {
                icon: <FaUserMd size={32} />,
                title: "Gestionează sesiunile",
                description: "Vezi programările, confirmă prezența și oferă sprijin personalizat.",
              },
              {
                icon: <FaComments size={32} />,
                title: "Privește dincolo de feedback",
                description: "Înțelege nevoile reale din spatele evaluărilor primite.",
              },
              {
                icon: <FaSmile size={32} />,
                title: "Oferă suport constant",
                description: "Contribuie la o cultură a echilibrului și bunăstării.",
              },
            ]}
          />

          <StepsSection
            title="📅 Organizare eficientă"
            steps={[
              {
                icon: <FaCalendarAlt size={32} />,
                title: "Gestionează evenimente",
                description: "Crează sau participă la workshopuri dedicate dezvoltării emoționale.",
              },
              {
                icon: <FaChartLine size={32} />,
                title: "Vezi impactul în cifre",
                description: "Urmărește participarea și feedbackul pe fiecare sesiune.",
              },
              {
                icon: <FaMedal size={32} />,
                title: "Recunoaștere profesională",
                description: "Contribuția ta este vizibilă și apreciată.",
              },
            ]}
          />
        </motion.section>
      </div>
    </div>
  );
}

export default HomepageSpecialist;
