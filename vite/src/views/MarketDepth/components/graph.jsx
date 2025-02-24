import React from "react";
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

const data = [
  { date: "09 Dec 24", Above20EMA: 1227, Below20EMA: 731 },
  { date: "16 Dec 24", Above20EMA: 1204, Below20EMA: 754 },
  { date: "23 Dec 24", Above20EMA: 889, Below20EMA: 1069 },
  { date: "30 Dec 24", Above20EMA: 830, Below20EMA: 1128 },
  { date: "06 Jan 25", Above20EMA: 771, Below20EMA: 1187 },
  { date: "13 Jan 25", Above20EMA: 454, Below20EMA: 1504 },
  { date: "20 Jan 25", Above20EMA: 676, Below20EMA: 1282 },
  { date: "27 Jan 25", Above20EMA: 341, Below20EMA: 1617 },
  { date: "03 Feb 25", Above20EMA: 419, Below20EMA: 1539 },
  { date: "10 Feb 25", Above20EMA: 506, Below20EMA: 1452 },
];

const MarketTrendChart = () => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      {/* <h2>Market Trend LT</h2> */}
      <p>24th Feb, 3:30pm</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Above20EMA" stroke="#6baed6" strokeWidth={2} dot={false} name="above20ema" />
          <Line type="monotone" dataKey="Below20EMA" stroke="#e377c2" strokeWidth={2} dot={false} name="below20ema" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketTrendChart;
