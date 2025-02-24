// WinsRatio.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

const WinsRatio = ({ trades }) => {
  // Filter trades with valid profitLoss
  const validTrades = trades.filter((trade) => typeof trade.profitLoss === 'number');

  const wins = validTrades.filter((trade) => trade.profitLoss > 0).length;
  const losses = validTrades.filter((trade) => trade.profitLoss < 0).length;
  const total = wins + losses;
  const winsRatio = total > 0 ? (wins / total) * 100 : 0;

  const data = [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses }
  ];
  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100px',
        p: 1,
        backgroundColor: '#1D1E20',
        borderTop: '1.25px solid',
        borderBottom: '1.25px solid',
        borderImageSource:
          'linear-gradient(90deg, rgba(255, 204, 25, 0.013) 0%, rgba(255, 204, 25, 0.65) 36%, rgba(255, 231, 145, 0.65) 51.5%, rgba(255, 204, 25, 0.65) 65%, rgba(255, 204, 25, 0.013) 100%)',
        borderImageSlice: 1,
        flexDirection:'row',
        justifyContent:'center'
      }}
    >
      {/* Left half: Text */}
      <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ color: '#ff8142', marginBottom: '15px' }}>
          Wins Ratio
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color: winsRatio >= 0 ? '#FFFFFF' : '#FF5966' // Conditionally apply color
          }}
        >
          {winsRatio.toFixed(2)}%
        </Typography>
      </Box>
      {/* Right half: Graph */}
      <Box sx={{ width: '70%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={40} innerRadius={20} label={false}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default WinsRatio;
