import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTherapySatisfactionDistribution } from "../../features/reports/reportsSlice";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const TherapySatisfactionChart = ({ managerId, selectedYear }) => {
    const dispatch = useDispatch();
    const { therapySatisfactionDistribution, loading, error } = useSelector((state) => state.reports);

    useEffect(() => {
        if (managerId && selectedYear) {
            dispatch(getTherapySatisfactionDistribution({ managerId, year: selectedYear }));
        }
    }, [dispatch, managerId, selectedYear]);

    return (
            
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={therapySatisfactionDistribution}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="score"
                            label={{ value: "Satisfacție", position: "insideBottom", offset: -10 }}
                            tickCount={6} 
                            domain={[0, 5]} 
                            type="number"
                            allowDecimals={false}
                        />
                        <YAxis
                            label={{ value: "Număr sesiuni", angle: -90, position: "insideLeft", dy: 50 }}
                            allowDecimals={false}
                        />
                        <Tooltip />
                        <Bar dataKey="count" name="Număr sesiuni" fill="#8b5cf6" barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            
    );
};

export default TherapySatisfactionChart;
