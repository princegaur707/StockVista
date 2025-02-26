import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MarketTrendChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/service/market-trend-weekly/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ weeks: 10 }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      // Assuming jsonData is in the same format as your demo data
      setData(jsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div style={{ width: "100%", height: 400 }}>
      <p>26th Feb 2025</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Above20EMA"
            stroke="#6baed6"
            strokeWidth={2}
            dot={false}
            name="above20ema"
          />
          <Line
            type="monotone"
            dataKey="Below20EMA"
            stroke="#e377c2"
            strokeWidth={2}
            dot={false}
            name="below20ema"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketTrendChart;
