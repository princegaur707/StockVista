// AccumulativeReturn.jsx
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

const AccumulativeReturn = ({ trades }) => {
  // Filter trades with numeric profitLoss
  const validTrades = trades.filter((trade) => typeof trade.profitLoss === 'number');

  // Sort by date (assumes YYYY-MM-DD format)
  const sortedTrades = [...validTrades].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Compute cumulative profit/loss over time
  let cumulative = 0;
  const data = sortedTrades.map((trade) => {
    cumulative += trade.profitLoss;
    return { cumReturn: cumulative };
  });

  // Total accumulative return
  const totalAccReturn = data.length > 0 ? cumulative : 0;

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
      {/* Left half: Text */}
      <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ color: '#b59ef3', marginBottom: '15px', fontFamily:'figtree' }}>
          Accumulative Return
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color: totalAccReturn >= 0 ? '#00EFC8' : '#FFFFFF', // Conditionally apply color
            fontFamily:'figtree',
            fontWeight: '400'
          }}
        >
          {totalAccReturn.toFixed(2)}
        </Typography>
      </Box>
      {/* Right half: Graph */}
      <Box sx={{ width: '60%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area type="monotone" dataKey="cumReturn" stroke="#8884d8" fill="#8884d8" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default AccumulativeReturn;
