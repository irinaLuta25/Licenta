import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoodEvolution } from "../../features/reports/reportsSlice";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const MoodEvolutionChart = ({ managerId, selectedMonth, selectedYear }) => {
    const dispatch = useDispatch();
    const { moodEvolution, loading, error } = useSelector(
        (state) => state.reports
    );

    const [selectedEmotions, setSelectedEmotions] = useState([
        "Calm",
        "Obosit",
        "Furios",
    ]);

    const emotions = [
        { key: "Energic", color: "#3b82f6" },
        { key: "Optimist", color: "#60a5fa" },
        { key: "Recunoscător", color: "#93c5fd" },
        { key: "Calm", color: "#10b981" },
        { key: "Concentrat", color: "#34d399" },
        { key: "Motivat", color: "#6ee7b7" },
        { key: "Obosit", color: "#f59e0b" },
        { key: "Apat", color: "#fbbf24" },
        { key: "Indiferent", color: "#fcd34d" },
        { key: "Stresat", color: "#f87171" },
        { key: "Trist", color: "#6366f1" },
        { key: "Furios", color: "#ef4444" },
        { key: "Anxios", color: "#8b5cf6" },
        { key: "Dezamagit", color: "#a78bfa" },
        { key: "Deznadajduit", color: "#c4b5fd" },
    ];

    useEffect(() => {
        if (managerId && selectedMonth && selectedYear) {
            dispatch(
                fetchMoodEvolution({ managerId, month: selectedMonth, year: selectedYear })
            );
        }
    }, [dispatch, managerId, selectedMonth, selectedYear]);

    const generateMonthDates = (year, month) => {
        const dates = [];
        const date = new Date(year, month - 1, 1);
        while (date.getMonth() === month - 1) {
            dates.push(date.toISOString().split("T")[0]);
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };

    const formattedData = (() => {
        if (!Array.isArray(moodEvolution)) return [];

        const dataMap = {};
        moodEvolution.forEach((entry) => {
            const key = new Date(entry.date).toISOString().split("T")[0];
            dataMap[key] = { ...entry, date: key };
        });

        const allDates = generateMonthDates(selectedYear, selectedMonth);
        const complete = allDates.map((dateStr) => {
            const dayEntry = dataMap[dateStr] || { date: dateStr };
            emotions.forEach(({ key }) => {
                if (dayEntry[key] === undefined) {
                    dayEntry[key] = 0;
                }
            });
            return dayEntry;
        });

        return complete;
    })();
    console.log(formattedData)

    const handleCheckboxChange = (emotion) => {
        setSelectedEmotions((prev) =>
            prev.includes(emotion)
                ? prev.filter((e) => e !== emotion)
                : [...prev, emotion]
        );
    };


    if (loading) return <p>Se încarcă datele...</p>;
    if (error) return <p className="text-red-500">Eroare: {error}</p>;

    return (
        <div>
            {/* ✅ Selectare emoții */}
            <div className="flex flex-wrap gap-2 mb-4">
                {emotions.map(({ key, color }) => {
                    const selected = selectedEmotions.includes(key);
                    return (
                        <button
                            key={key}
                            onClick={() => handleCheckboxChange(key)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border transition 
          ${selected ? "text-white" : "text-gray-800 bg-white/60"}
          ${selected ? "" : "border-gray-300"}
        `}
                            style={selected ? {
                                backgroundColor: color,
                                borderColor: color,
                            } : {}}
                        >
                            {key}
                        </button>
                    );
                })}
            </div>


            {/* ✅ Grafic */}
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={formattedData}>
                    <defs>
                        {emotions.map(({ key, color }) => (
                            <linearGradient id={`color${key}`} key={key} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.7} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid stroke="#9ca3af" strokeDasharray="4 4" />
                    <XAxis
                        dataKey="date"
                        stroke="#374151"
                        tick={{ fill: "#374151", fontSize: 12 }}
                    />
                    <YAxis
                        stroke="#374151"
                        tick={{ fill: "#374151", fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#ffffffee",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            color: "#111827",
                        }}
                        labelStyle={{ color: "#111827", fontWeight: 600 }}
                        itemStyle={{ color: "#111827" }}
                    />


                    {emotions
                        .filter(({ key }) => selectedEmotions.includes(key))
                        .map(({ key, color }) => (
                            <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={color}
                                strokeWidth={2.2}
                                fill={`url(#color${key})`}
                                fillOpacity={0.6}
                            />
                        ))}
                </AreaChart>
            </ResponsiveContainer>

        </div>
    );
};

export default MoodEvolutionChart;
