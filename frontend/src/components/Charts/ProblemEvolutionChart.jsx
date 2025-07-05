import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblemsPerMonth } from "../../features/reports/reportsSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProblemEvolutionChart = ({ managerId, selectedYear }) => {
  const dispatch = useDispatch();
  const { problemsPerMonth, loading, error } = useSelector((state) => state.reports);

  useEffect(() => {
    if (managerId && selectedYear) {
      dispatch(fetchProblemsPerMonth({ managerId, year: selectedYear }));
    }
  }, [dispatch, managerId, selectedYear]);

  if (loading) return <p>Se incarca datele...</p>;
  if (error) return <p className="text-red-500">Eroare: {error}</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={problemsPerMonth} margin={{ top: 10, right: 38, left: 0, bottom: 70 }}>
        <CartesianGrid stroke="#9ca3af" strokeDasharray="4 4" />
        <XAxis

          dataKey="month"
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
          label={{
            value: "Număr probleme raportate",
            position: "outsideLeft",
            angle: -90,
            dx: -20,
            style: { fill: "#1e293b", fontWeight: "normal" }
          }}
          allowDecimals={false}
          tick={{
            fill: "#1e293b",
          }} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProblemEvolutionChart;