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
} from "recharts";

const MoodEvolutionChart = ({ managerId, selectedMonth, selectedYear }) => {
    const dispatch = useDispatch();
    const { moodEvolution, loading, error } = useSelector(
        (state) => state.reports
    );

    const [selectedEmotions, setSelectedEmotions] = useState([
        "Stresat",
        "Optimist",
        "Furios",
    ]);

    const emotions = [
        { key: "Energic", color: "#3b44f6ff" },
        { key: "Optimist", color: "#3b82f6" },
        { key: "Recunoscător", color: "#93c5fd" },
        { key: "Calm", color: "#10a0b9ff" },
        { key: "Concentrat", color: "#34d3b8ff" },
        { key: "Motivat", color: "#438e70ff" },
        { key: "Obosit", color: "#f5800bff" },
        { key: "Distant", color: "#fcd34d" },
        { key: "Plictisit", color: "#cbe642ff" },
        { key: "Stresat", color: "#8b5cf6" },
        { key: "Trist", color: "#5f3bb3ff" },
        { key: "Confuz", color: "#9e8ce5ff" },
        { key: "Anxios", color: "#b422beff" },
        { key: "Dezamagit", color: "#962245ff" },
        { key: "Furios", color: "#ef4444" },
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

        const weekOrder = ["Săpt. 1", "Săpt. 2", "Săpt. 3", "Săpt. 4"];

        const mapped = moodEvolution.map((entry) => {
            const result = { week: entry.week };
            emotions.forEach(({ key }) => {
                result[key] = entry[key] !== undefined ? entry[key] : null;
            });
            return result;
        }).filter(entry =>
            selectedEmotions.some((key) => entry[key] !== null)
        );

        return mapped.sort(
            (a, b) => weekOrder.indexOf(a.week) - weekOrder.indexOf(b.week)
        );
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
                        dataKey="week"
                        tick={{ fill: "#374151", fontSize: 12 }}
                    />
                    <YAxis
                        label={{
                            value: "Număr stări raportate",
                            position: "outsideLeft",
                            angle: -90,
                            dx: -20,
                            style: { fill: "#1e293b", fontWeight: "normal" }
                        }}
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
