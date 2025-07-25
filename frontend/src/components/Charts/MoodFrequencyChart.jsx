import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoodFrequency } from "../../features/reports/reportsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const colorsMap = {
  Energic: "#3b44f6ff",
  Optimist: "#3b82f6",
  Recunoscător: "#93c5fd",
  Calm: "#10a0b9ff",
  Concentrat: "#34d3b8ff",
  Motivat: "#438e70ff",
  Obosit: "#f5800bff",
  Distant: "#fcd34d",
  Plictisit: "#cbe642ff",
  Stresat: "#8b5cf6",
  Trist: "#5f3bb3ff",
  Confuz: "#9e8ce5ff",
  Anxios: "#b422beff",
  Dezamagit: "#962245ff",
  Furios: "#ef4444",
};


const MoodFrequencyChart = ({ managerId, selectedMonth, selectedYear }) => {
  const dispatch = useDispatch();
  const { moodFrequency, loading, error } = useSelector((state) => state.reports);

  useEffect(() => {
    if (managerId && selectedMonth && selectedYear) {
      dispatch(
        fetchMoodFrequency({ managerId, month: selectedMonth, year: selectedYear })
      );
    }
  }, [dispatch, managerId, selectedMonth, selectedYear]);

  if (loading) return <p>Se încarcă datele...</p>;
  if (error) return <p className="text-red-500">Eroare: {error}</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={moodFrequency}
        margin={{ top: 10, right: 30, left: 0, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="mood"
          interval={0}
          tick={{
            fill: "#1e293b",
            angle: 45,
            textAnchor: "start",
            dy: 20,
            fontSize: 11,
          }}
        />
        <YAxis
          tick={{ fill: "#1e293b" }}
          label={{
            value: "Număr stări raportate",
            position: "outsideLeft",
            angle: -90,
            dx: -20,
            style: { fill: "#1e293b", fontWeight: "normal" }
          }}
        />
        <Tooltip />
        <Bar dataKey="count">
          {moodFrequency.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colorsMap[entry.mood] || "#8884d8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>

  );
};

export default MoodFrequencyChart;
