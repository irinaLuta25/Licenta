import React, { useEffect, useRef, useState } from "react";
import "./CustomCarousel.css";
import { FaSmileBeam, FaUserMd, FaChartLine, FaCalendarCheck, FaBrain, FaHeartbeat, FaHandsHelping } from "react-icons/fa";


const CustomCarousel = () => {
    const itemsRef = useRef([]);
    const [active, setActive] = useState(3);

    const slides = [
        { icon: <FaSmileBeam size={64} color="#6646f1" />, title: "86% mai puțin stres", text: "Utilizatorii noștri au raportat o reducere semnificativă a stresului." },
        { icon: <FaUserMd size={64} color="#10b981" />, title: "+120 sesiuni lunare", text: "Terapeuții sunt activi și disponibili să te sprijine oricând." },
        { icon: <FaChartLine size={64} color="#f59e0b" />, title: "Progres vizibil", text: "Obiceiurile tale sănătoase sunt înregistrate și analizate automat." },
        { icon: <FaCalendarCheck size={64} color="#3b82f6" />, title: "Programări ușoare", text: "Alege rapid intervalul care ți se potrivește cel mai bine." },
        { icon: <FaBrain size={64} color="#8b5cf6" />, title: "Focus mental îmbunătățit", text: "Activitățile din aplicație susțin echilibrul tău emoțional." },
        { icon: <FaHeartbeat size={64} color="#ef4444" />, title: "Stare de bine crescută", text: "Starea generală de sănătate este influențată pozitiv." },
        { icon: <FaHandsHelping size={64} color="#14b8a6" />, title: "Sprijin constant", text: "Ai parte de susținere în orice moment ai nevoie." },
    ];

    const getIndex = (index) => {
        const len = slides.length;
        return ((index % len) + len) % len;
    };

    useEffect(() => {
        const items = itemsRef.current;
        if (!items || items.length === 0) return;

        const current = getIndex(active);

        items.forEach((item, i) => {
            const realIndex = i;
            const offset = realIndex - current;

            let visibleOffset = offset;
            if (offset > slides.length / 2) {
                visibleOffset = offset - slides.length;
            } else if (offset < -slides.length / 2) {
                visibleOffset = offset + slides.length;
            }

            if (visibleOffset === 0) {
                item.style.transform = `none`;
                item.style.zIndex = 1;
                item.style.filter = "none";
                item.style.opacity = 1;
            } else {
                item.style.transform = `translateX(${visibleOffset * 120}px) scale(${1 - 0.2 * Math.abs(visibleOffset)
                    }) perspective(16px) rotateY(${visibleOffset > 0 ? "-1" : "1"}deg)`;
                item.style.zIndex = -Math.abs(visibleOffset);
                item.style.filter = "blur(5px)";
                item.style.opacity = Math.abs(visibleOffset) > 2 ? 0 : 0.6;
            }
        });
    }, [active, slides.length]);


    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => prev + 1);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const next = () => setActive((prev) => prev + 1);
    const prev = () => setActive((prev) => prev - 1);

    return (
        <div className="slider">
            {slides.map((slide, i) => (
                <div
                    className="item"
                    key={i}
                    ref={(el) => (itemsRef.current[i] = el)}
                >
                    <div className="item-content">
                        <div className="icon" style={{ marginBottom: "10px" }}>{slide.icon}</div>
                        <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", marginBottom: "8px", color: "#1e3a8a" }}>{slide.title}</h1>
                        <p style={{ fontSize: "1rem", color: "#4b5563", textAlign: "center" }}>{slide.text}</p>
                    </div>
                </div>
            ))}
            <button id="prev" onClick={prev}>
                {"<"}
            </button>
            <button id="next" onClick={next}>
                {">"}
            </button>
        </div>
    );
};

export default CustomCarousel;