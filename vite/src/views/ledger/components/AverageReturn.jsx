// AverageReturn.jsx
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Box, Typography } from '@mui/material';

const AverageReturn = ({ trades }) => {
  // Filter trades with valid profitLoss
  const validTrades = trades.filter((trade) => typeof trade.profitLoss === 'number');

  const overallAverage = validTrades.length > 0 ? validTrades.reduce((acc, trade) => acc + trade.profitLoss, 0) / validTrades.length : 0;

  // Group by date and compute average return per day (dates not displayed)
  const groupedByDate = validTrades.reduce((acc, trade) => {
    if (trade.date) {
      if (!acc[trade.date]) acc[trade.date] = [];
      acc[trade.date].push(trade.profitLoss);
    }
    return acc;
  }, {});

  const data = Object.keys(groupedByDate)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => {
      const returns = groupedByDate[date];
      const avg = returns.reduce((sum, val) => sum + val, 0) / returns.length;
      return { avgReturn: avg };
    });

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
        borderImageSlice: 1
      }}
    >
      {' '}
      {/* Left half: Text */}
      <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ color: '#81c99d', marginBottom: '15px', fontFamily: 'figtree' }}>
          Average Return
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color: overallAverage >= 0 ? '#00EFC8' : '#FFFFFF', // Conditionally apply color
            fontFamily:'figtree',
            fontWeight: '400'
          }}
        >
          {overallAverage.toFixed(2)}
        </Typography>
      </Box>
      {/* Right half: Graph */}
      <Box sx={{ width: '70%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis hide />
            <YAxis hide />
            <Bar dataKey="avgReturn" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default AverageReturn;
