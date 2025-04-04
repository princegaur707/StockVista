import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

function Gauge() {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch your gauge value (replace with your actual endpoint)
  useEffect(() => {
    fetch('https://example.com/api/gauge-value')
      .then((res) => res.json())
      .then((data) => {
        // Assume API returns { gaugeValue: number }
        setValue(data.gaugeValue);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching gauge value:', err);
        setLoading(false);
      });
  }, []);

  // Default to 0 if no data yet
  const displayValue = value ?? 0;
  const clampedValue = Math.max(-20, Math.min(20, displayValue));

  // Convert [-20..20] → angle in [-90..90]
  const angle = (clampedValue / 20) * 90;

  // For text color below the gauge
  const valueTextColor = value !== null ? (clampedValue < 0 ? '#FF5966' : '#00EFC8') : '#FFFFFF';

  // Utility: convert polar (degrees) → Cartesian
  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad)
    };
  };

  // Partition the semicircle (180° → 0°) into 4 segments with small gaps
  const segments = [
    { start: 180, end: 138 },
    { start: 134, end: 92 },
    { start: 88, end: 46 },
    { start: 42, end: 0 }
  ];

  // Define a broader needle as a polygon
  const needlePoints = '48,50 52,50 50,5';

  // IDs of the 4 gradients (defined in <defs>)
  const gradientIds = ['segment1Grad', 'segment2Grad', 'segment3Grad', 'segment4Grad'];

  return (
    <Box sx={{ width: 400, height: 400, position: 'relative', margin: '20px auto' }}>
      <Typography
        variant="h5"
        mb={0}
        sx={{
          fontFamily: 'Figtree',
          color: '#FFFFFF',
          opacity: 0.8,
          fontWeight: '400',
          fontSize: '20px',
          textAlign: 'center'
        }}
      >
        Current Market Status
      </Typography>

      {loading && (
        <CircularProgress
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      <Box component="svg" viewBox="0 0 100 50" sx={{ width: '100%', height: '60%' }}>
        <defs>
          {/* 1) Orange → Green */}
          <linearGradient id="segment1Grad" x1="100%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="100%" stopColor="#FF0000" />
          </linearGradient>
          {/* 2) Solid Green */}
          <linearGradient id="segment2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="50%" stopColor="#FFC107" />
          </linearGradient>
          {/* 3) Green → Orange */}
          <linearGradient id="segment3Grad" x1="0%" y1="70%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FEC107" />
            <stop offset="100%" stopColor="#28a745" />
          </linearGradient>

          {/* 4) Orange → Red */}
          <linearGradient id="segment4Grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#28a745" />
            <stop offset="100%" stopColor="#28a745" />
          </linearGradient>
        </defs>

        {/* Render each partition with its corresponding gradient */}
        {segments.map((seg, idx) => {
          const start = polarToCartesian(50, 50, 40, seg.start);
          const end = polarToCartesian(50, 50, 40, seg.end);
          return (
            <path
              key={idx}
              d={`M ${start.x} ${start.y} A 40 40 0 0 1 ${end.x} ${end.y}`}
              fill="none"
              stroke={`url(#${gradientIds[idx]})`}
              strokeWidth="20"
            />
          );
        })}

        {/* Needle as a polygon, rotated around (50,50) */}
        <polygon points={needlePoints} fill="#4b0082" transform={`rotate(${angle} 50 50)`} style={{ transition: 'transform 0.5s ease' }} />

        {/* Pivot circle */}
        <circle cx="50" cy="50" r="5" fill="#4b0082" />
      </Box>

      {/* Label below the gauge */}
      <Typography
        mb={2}
        sx={{
          fontFamily: 'Figtree',
          opacity: 0.8,
          fontWeight: '400',
          fontSize: '16px',
          textAlign: 'center',
          alignItems: 'center',
          color: valueTextColor
        }}
      >
        {value !== null ? `API Value: ${clampedValue}` : 'Awaiting data from API...'}
      </Typography>
    </Box>
  );
}

export default Gauge;
