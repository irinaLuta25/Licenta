import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  CartesianGrid,
} from "recharts";
import CustomDropdown2 from "../../components/CustomDropdown2";

const GoalProgressChart = ({ employeeGoals, trackingsByGoalId }) => {
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const selectedGoal = useMemo(
    () => employeeGoals.find((g) => g.id === selectedGoalId),
    [selectedGoalId, employeeGoals]
  );

  const data = useMemo(() => {
    if (!selectedGoal) return [];

    const trackings = trackingsByGoalId[selectedGoal.id] || [];
    const now = new Date();
    const period = selectedGoal.period;

    const getBuckets = () => {
      const buckets = [];
      const today = new Date();
      const d = new Date(today);

      if (period === "zilnic") {
        for (let i = 29; i >= 0; i--) {
          const date = new Date(d);
          date.setDate(date.getDate() - i);
          buckets.push({ key: date.toISOString().split("T")[0], date });
        }
      } else if (period === "săptămânal") {
        for (let i = 11; i >= 0; i--) {
          const startOfWeek = new Date(d);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() - 7 * i);
          buckets.push({ key: startOfWeek.toISOString().split("T")[0], date: startOfWeek });
        }
      } else if (period === "lunar") {
        for (let i = 11; i >= 0; i--) {
          const month = new Date(d);
          month.setMonth(month.getMonth() - i);
          buckets.push({ key: `${month.getFullYear()}-${month.getMonth() + 1}`, date: month });
        }
      } else if (period === "anual") {
        for (let i = 4; i >= 0; i--) {
          const year = new Date(d);
          year.setFullYear(year.getFullYear() - i);
          buckets.push({ key: `${year.getFullYear()}`, date: year });
        }
      }
      return buckets;
    };

    const bucketKey = (date) => {
      const d = new Date(date);
      if (period === "zilnic") return d.toISOString().split("T")[0];
      if (period === "săptămânal") {
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return weekStart.toISOString().split("T")[0];
      }
      if (period === "lunar") return `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (period === "anual") return `${d.getFullYear()}`;
      return "";
    };

    const grouped = {};
    trackings.forEach((t) => {
      const key = bucketKey(t.createdAt);
      grouped[key] = (grouped[key] || 0) + t.value;
    });

    const buckets = getBuckets();
    return buckets.map(({ key, date }) => ({
      date: key,
      value: grouped[key] || 0,
    }));
  }, [selectedGoal, trackingsByGoalId]);

  if (employeeGoals.length === 0) return null;

  const goalOptions = employeeGoals.map((goal) => ({
    value: goal.id,
    label: `${goal.habit.name} (${goal.period})`
  }));

  return (
    <div className="w-full p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow">
      <h2 className="text-xl font-semibold text-indigo-800 mb-4">Progresul meu pe obiective</h2>

      <div className="w-full max-w-md mb-8">
        <CustomDropdown2
          value={selectedGoalId || ""}
          onChange={(val) => setSelectedGoalId(val)}
          options={[{ value: "", label: "Selectează un obiectiv" }, ...goalOptions]}
        />
      </div>

      {selectedGoal && data.length > 0 && (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: selectedGoal.habit.unit, angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(val) => `${val} ${selectedGoal.habit.unit}`} />
            <Legend />
            <ReferenceLine
              y={selectedGoal.targetValue}
              stroke="red"
              strokeDasharray="4 4"
              label={{ position: "top", value: `Target ${selectedGoal.targetValue} ${selectedGoal.habit.unit}`, fill: "#b91c1c" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Progres"
              stroke="#6366f1"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GoalProgressChart;