import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { FaBrain, FaCalendarCheck } from "react-icons/fa";
import TextAnimation from "../components/TextAnimation";
import { FaCheckCircle, FaBullseye, FaUserMd, FaChartLine, FaCalendarAlt, FaComments, FaLeaf, FaSmile } from "react-icons/fa";
import StepsSection from "../components/StepsSection";
import CustomCarousel from "../components/CustomCarousel/CustomCarousel";
import { useNavigate } from "react-router-dom";


function HomepageEmployee() {
    const navigate = useNavigate();

    return (
        <div className="pt-24 px-8 sm:px-16 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800">
            <Navbar />

            <div className="flex flex-col">
                {/* Hero Section */}
                <motion.section
                    className="max-w-7xl mx-auto mt-12 flex flex-col lg:flex-row items-center justify-between gap-12 mb-10"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Text Section */}
                    <div className="flex flex-col gap-4 flex-1 text-center lg:text-left">
                        <TextAnimation
                            text="Bine ai venit! Grija față de tine începe aici."
                            className="text-5xl font-bold leading-none tracking-normal text-indigo-900 mb-4"
                        />
                        <p className="text-lg text-gray-700 mb-6">
                            Descoperă un spațiu dedicat stării tale de bine în mediul de lucru.
                        </p>
                        <blockquote className="italic text-indigo-800 mb-8">
                            “A avea grijă de tine nu este egoism — este responsabilitate.”
                        </blockquote>
                        <motion.button
                            className="w-64 bg-orange-500 text-white px-6 py-3 rounded-xl text-lg shadow-md hover:bg-orange-600 transition"
                            whileTap={{ scale: 0.95 }}
                        >
                            Explorează beneficiile
                        </motion.button>
                    </div>

                    {/* Image Section */}
                    <div className="flex-2">
                        <img
                            src="/assets/hero_img.png"
                            alt="MindCare Illustration"
                            className="w-full max-w-md mx-auto lg:mx-0 rounded-xl"
                        />
                    </div>
                </motion.section>

                {/* Statistics */}
                <section className="mt-20 mb-12 text-center">
                    <h2 className="text-3xl font-bold text-indigo-900 mb-8">
                        De ce să folosești MindCare?
                    </h2>
                    <CustomCarousel />
                </section>

                {/* How It Works */}
                <motion.section
                    className="mt-20 max-w-6xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.2 },
                        },
                    }}
                >
                    <h2 className="text-3xl font-bold text-center text-indigo-900 mb-10">
                        Cum funcționează aplicația
                    </h2>

                    {/* Ședințe de terapie */}
                    <StepsSection
                        title="🧠 Ședințe de terapie"
                        steps={[
                            { icon: <FaUserMd size={32} />, title: "Alege terapeut", description: "Completează formularul de compatibilitate pentru a găsi exact ce cauți" },
                            { icon: <FaBullseye size={32} />, title: "Programează o ședință", description: "Alege un interval disponibil" },
                            { icon: <FaChartLine size={32} />, title: "Spune-ne cum a fost", description: "Urmărește programarea în calendarul personal și acordă feedback" }
                        ]}
                    />

                    {/* Evenimente */}
                    <StepsSection
                        title="📅 Participare la evenimente"
                        steps={[
                            {
                                icon: <FaCalendarAlt size={32} />,
                                title: "Vezi evenimentele",
                                description: "Workshop-uri și traininguri de la specialiști de top",
                            },

                            {
                                icon: <FaCheckCircle size={32} />,
                                title: "Înscrie-te la oricare",
                                description: "Alege evenimentul care ți se potrivește și participă cu un singur click",
                            },
                            {
                                icon: <FaComments size={32} />,
                                title: "Lasă feedback",
                                description: "Vezi evenimentul în calendar și împărtășește-ți experiența.",
                            },
                        ]}
                    />


                    {/* Obiceiuri sănătoase */}
                    <StepsSection
                        title="💡 Stil de viață și obiective"
                        steps={[
                            {
                                icon: <FaLeaf size={32} />,
                                title: "Setează obiective",
                                description: "Focus, somn, relaxare, meditație.",
                            },
                            {
                                icon: <FaChartLine size={32} />,
                                title: "Vezi progresul",
                                description: "Urmărește-ți evoluție săptămânală.",
                            },
                            {
                                icon: <FaBullseye size={32} />,
                                title: "Recompense motivaționale",
                                description: "Primește badge-uri și feedback pozitiv.",
                            },
                        ]}
                    />

                </motion.section>

                {/* Call to Action */}
                {/* <section className="text-center mt-24 mb-20">
                    <h3 className="text-2xl font-semibold text-indigo-900 mb-4">
                        Începe călătoria spre echilibru emoțional
                    </h3>
                    <button
                        className="bg-indigo-700 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-800 transition"
                        onClick={() => setTimeout(() => navigate("/therapists"), 0)}
                    >
                        Vezi terapeuții disponibili
                    </button>
                </section> */}

            </div>


        </div>
    );
}

export default HomepageEmployee;
