import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { FaBrain, FaCalendarCheck } from "react-icons/fa";
import TextAnimation from "../components/TextAnimation";
import { FaCheckCircle, FaBullseye, FaUserMd, FaChartLine, FaCalendarAlt, FaComments, FaLeaf, FaSmile } from "react-icons/fa";
import StepsSection from "../components/StepsSection";
import CustomCarousel from "../components/CustomCarousel/CustomCarousel";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection/HeroSection";
import ReportProblemModal from "../components/ReportProblemModal";


function HomepageEmployee() {
    const navigate = useNavigate();
    const howItWorksRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800">
            <Navbar />

            <div className="flex flex-col">
                {/* Hero Section */}
                <HeroSection onExploreClick={() => {
                    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
                }} />


                {/* Mental Health awareness */}
                <section
                    className="mt-20 py-16 bg-gradient-to-r from-[#dbeafe] via-[#e0f2fe] to-[#f0fdf4] text-center px-4"
                >
                    <motion.h2
                        className="text-3xl font-bold text-indigo-900 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        Sănătatea mintală contează mai mult decât crezi.
                    </motion.h2>

                    <motion.p
                        className="text-gray-700 mb-12 mt-10 max-w-2xl mx-auto leading-relaxed text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        Starea ta emoțională influențează totul — de la relații și productivitate până la calitatea somnului. Acordă-ți timp. Ai dreptul să te simți bine, nu doar să funcționezi.
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                icon: "🧠",
                                title: "Conștientizare emoțională",
                                text: "Învață să-ți recunoști stările interioare. Echilibrul începe cu înțelegerea propriilor emoții.",
                            },
                            {
                                icon: "💬",
                                title: "Comunicare autentică",
                                text: "Vorbește deschis despre cum te simți. Dialogul sincer este primul pas către susținere.",
                            },
                            {
                                icon: "🌿",
                                title: "Pauze și echilibru",
                                text: "Nu trebuie să fii productiv non-stop. Odihna și claritatea mentală merg mână în mână.",
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
                                <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-gray-700">{card.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Statistics */}
                <section className="mt-28 mb-16 text-center px-16">
                    <h2
                        className="text-3xl font-bold text-indigo-900 mb-8"
                        style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)" }}
                    >
                        De ce să folosești MindCare?
                    </h2>
                    <CustomCarousel />
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
                        visible: {
                            transition: { staggerChildren: 0.2 },
                        },
                    }}
                >
                    <h2
                        className="text-3xl font-bold text-center text-indigo-900 mb-8"
                        style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)" }}
                    >
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
                <section className="text-center mt-24 mb-20">
                    <h3 className="text-2xl font-semibold text-indigo-900 mb-4">
                        Vrei să ne semnalezi o problemă?
                    </h3>
                    <button
                        onClick={() => {
                            setIsModalOpen(true)
                        }}
                        className="bg-indigo-700 text-white mt-6 px-6 py-3 rounded-xl shadow hover:bg-indigo-800 transition inline-block text-lg"
                    >
                        Raportează
                    </button>

                </section>

            </div>

            {isModalOpen && (
                <ReportProblemModal
                    onClose={() => setIsModalOpen(false)}
                />
            )}


        </div>
    );
}

export default HomepageEmployee;
