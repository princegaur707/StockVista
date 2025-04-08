import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Box, Typography, CircularProgress, IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format, parseISO, addDays, isBefore } from 'date-fns';

const EquityCurveChart = ({ tradeData }) => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateEquityCurve = () => {
    setLoading(true);

    const capital = parseFloat(localStorage.getItem('capital') || '0');
    if (!tradeData || tradeData.length === 0) {
      setSegments([]);
      setLoading(false);
      return;
    }

    const sortedTrades = [...tradeData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const pnlByDate = {};
    sortedTrades.forEach((trade) => {
      const dateStr = trade.date.split('T')[0];
      if (!pnlByDate[dateStr]) pnlByDate[dateStr] = 0;
      pnlByDate[dateStr] += trade.profitLoss;
    });

    const startDate = parseISO(sortedTrades[0].date);
    const endDate = parseISO(sortedTrades[sortedTrades.length - 1].date);

    let currentDate = startDate;
    let runningEquity = capital;
    const fullCurve = [];

    while (!isBefore(endDate, currentDate)) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (pnlByDate[dateStr] != null) {
        runningEquity += pnlByDate[dateStr];
      }

      fullCurve.push({
        date: format(currentDate, 'dd MMM yyyy'),
        equity: parseFloat(runningEquity.toFixed(2))
      });

      currentDate = addDays(currentDate, 1);
    }

    // 🔄 Compress flat lines
    const compressedCurve = fullCurve.filter((point, idx, arr) => {
      if (idx === 0 || idx === arr.length - 1) return true;
      const prev = arr[idx - 1];
      const next = arr[idx + 1];
      return point.equity !== prev.equity || point.equity !== next.equity;
    });

    // ⬆️⬇️ Split into rising/falling segments (overlap resolved)
    const splitSegments = [];
    let currentSegment = [];
    let currentTrend = null;

    for (let i = 0; i < compressedCurve.length; i++) {
      const current = compressedCurve[i];
      const prev = compressedCurve[i - 1];

      if (i === 0) {
        currentSegment.push(current);
        continue;
      }

      const isRising = current.equity > prev.equity;

      if (currentTrend === null) {
        currentTrend = isRising;
      }

      if (isRising === currentTrend) {
        currentSegment.push(current);
      } else {
        splitSegments.push({
          data: currentSegment,
          rising: currentTrend
        });
        currentSegment = [compressedCurve[i - 1], current]; // ✅ no overlap
        currentTrend = isRising;
      }
    }

    if (currentSegment.length > 0) {
      splitSegments.push({ data: currentSegment, rising: currentTrend });
    }

    setSegments(splitSegments);
    setLoading(false);
  };

  useEffect(() => {
    calculateEquityCurve();
  }, [tradeData]);

  if (loading) {
    return (
      <Box sx={{ height: 600, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#FFC42B' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '600px',
        width: '90vw',
        margin: '40px auto',
        backgroundColor: '#1d1e20',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px 8px'
      }}>
        <Typography
          variant="h3"
          sx={{ color: '#FFC42B', fontFamily: 'Figtree', fontWeight: 600 }}
        >
          Equity Curve
        </Typography>
        <IconButton onClick={calculateEquityCurve}>
          <RefreshIcon sx={{ color: '#FFC42B' }} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, padding: '0 0px 16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart margin={{ top: 10, right: 60, bottom: 30, left: 0 }}>
            <CartesianGrid stroke="#2c2c2e" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#ccc"
              minTickGap={20}
              tick={{ fontSize: 12 }}
              allowDuplicatedCategory={false}
            />
            <YAxis
              stroke="#ccc"
              domain={['auto', 'auto']}
              tickFormatter={(val) => `₹${val.toLocaleString()}`}
              tick={{ fontSize: 12 }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1d1e20',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontFamily: 'Figtree'
              }}
              formatter={(value) => [`₹${value}`, 'Equity']}
            />
            {segments.map((seg, index) => {
              const color = seg.rising ? '#00EFC8' : '#FF5966';
              return (
                <Area
                  key={index}
                  type="monotone"
                  dataKey="equity"
                  data={seg.data}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                  dot={false}
                  isAnimationActive={false}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default EquityCurveChart;
