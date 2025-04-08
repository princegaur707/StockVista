import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Button, Typography, Select, MenuItem } from '@mui/material';
import AuthContext from '../../pages/authentication/auth-forms/AuthContext.jsx';

const MarketTrendChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataUpdatedTime, setDataUpdatedTime] = useState('');
  const [days, setDays] = useState(50); // NEW: dropdown state
  const { requestWithToken } = useContext(AuthContext);

  const fetchData = async (selectedDays = days) => {
    setLoading(true);
    try {
      const response = await requestWithToken(`${import.meta.env.VITE_API_URL}/api/service/market-trend-daily/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: selectedDays })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      const updatedTime = jsonData && jsonData.length > 0 ? jsonData[jsonData.length - 1].date : 'N/A';
      setDataUpdatedTime(updatedTime);
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

  const handleDaysChange = (event) => {
    const newDays = event.target.value;
    setDays(newDays);
    fetchData(newDays);
  };

  const handleApply = () => {
    fetchData();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <CircularProgress sx={{ color: '#FFC42B' }} />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Top Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: '8px',
          marginLeft: '60px',
          marginRight: '20px'
        }}
      >
        {/* Left: Date */}
        <Typography variant="body1" sx={{ color: '#FFFFFF', fontFamily: 'Figtree', fontWeight: 400 }}>
          {dataUpdatedTime}
        </Typography>

        {/* Center: Title */}
        <Typography
          variant="body1"
          sx={{
            color: '#FFC42B',
            fontFamily: 'Figtree',
            fontWeight: 500,
            fontSize: '1.2rem'
          }}
        >
          Daily Market Trend
        </Typography>

        {/* Right: Dropdown + Refresh */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Dropdown */}
          <Select
            value={days}
            onChange={handleDaysChange}
            size="small"
            sx={{
              fontFamily: 'Figtree',
              fontSize: '14px',
              height: '35px',
              color: '#FFFFFF',
              backgroundColor: '#1d1e20',
              '.MuiSelect-select': {
                paddingRight: '32px'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFFFFF'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFC42B'
              },
              '& .MuiSvgIcon-root': {
                color: '#FFC42B',
                right: '8px',
                position: 'absolute'
              },
              minWidth: '60px'
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#1d1e20',
                  color: '#fff',
                  fontFamily: 'Figtree'
                }
              }
            }}
          >
            {[10, 20, 30, 40, 50].map((week) => (
              <MenuItem key={week} value={week}>
                {week}
              </MenuItem>
            ))}
          </Select>

          {/* Refresh Button */}
          <Button
            variant="outlined"
            onClick={handleApply}
            size="small"
            sx={{
              fontFamily: 'Figtree',
              width: '4rem',
              height: '35px',
              border: '1px solid',
              fontSize: '14px',
              borderImageSlice: 1,
              color: '#FFFFFF',
              backgroundColor: '#1d1e20',
              '&:hover': {
                backgroundColor: '#ffffff',
                color: '#1e1e1e'
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 2, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Above20EMA" stroke="#6baed6" strokeWidth={2} dot={false} name="above20ema" />
            <Line type="monotone" dataKey="Below20EMA" stroke="#e377c2" strokeWidth={2} dot={false} name="below20ema" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
};

export default MarketTrendChart;
