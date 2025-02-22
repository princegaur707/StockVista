import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Graphs({ trades }) {
  /**
   * Group trades by strategy and sum the profit/loss
   */
  const strategyMap = trades.reduce((acc, trade) => {
    const strat = trade.strategy || 'Unassigned';
    if (!acc[strat]) {
      acc[strat] = 0;
    }
    acc[strat] += trade.profitLoss;
    return acc;
  }, {});

  const chartData = Object.keys(strategyMap).map((key) => ({
    strategy: key,
    profitLoss: strategyMap[key],
  }));

  return (
    <div style={{ width: '100%', height: 400, marginTop: '32px' }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="strategy" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="profitLoss" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graphs;



// import React from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const Graphs = ({ data }) => {
//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="Date" />
//         <YAxis />
//         <Tooltip />
//         <Line type="monotone" dataKey="Return" stroke="#8884d8" />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default Graphs;
