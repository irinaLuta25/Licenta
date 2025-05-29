import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventTypeDistribution } from "../../features/reports/reportsSlice";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#8b5cf6",
    "#6ee7b7",
];

const EventTypeChart = ({ managerId, selectedYear }) => {
    const dispatch = useDispatch();
    const { eventTypeDistribution } = useSelector((state) => state.reports);

    useEffect(() => {
        if (managerId && selectedYear) {
            dispatch(getEventTypeDistribution({ managerId, year: selectedYear }));
        }
    }, [dispatch, managerId, selectedYear]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={eventTypeDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                    {Array.isArray(eventTypeDistribution) &&
                        eventTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default EventTypeChart;
