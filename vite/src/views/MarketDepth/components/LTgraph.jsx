import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, IconButton, Button, Typography } from '@mui/material';
import AuthContext from '../../pages/authentication/auth-forms/AuthContext.jsx';

const MarketTrendChartLT = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataUpdatedTime, setDataUpdatedTime] = useState('');
  // Import the requestWithToken helper from AuthContext
  const { requestWithToken } = useContext(AuthContext);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await requestWithToken(`${import.meta.env.VITE_API_URL}/api/service/market-trend-weekly/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeks: 10 })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();

      // Use the "date" field from the last entry as the updated time.
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

  // Handlers for the Reset button (which re-fetches the data)
  const handleReset = () => {
    fetchData();
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
      {/* Styled updated time entry */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 2px',
          // background: 'linear-gradient(90deg, #1d1e20, #2c2d31)',
          borderRadius: '8px',
          marginLeft: '60px',
          marginRight: '20px'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#FFFFFF',
            fontFamily: 'Figtree',
            fontWeight: 400
          }}
        >
          {dataUpdatedTime}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#FFC42B',
            fontFamily: 'Figtree',
            fontWeight: 500,
            fontSize: '1.2rem'
          }}
        >
          Market Trend LT
        </Typography>

        {/* Reset Button using the provided style */}
        <IconButton
          onClick={handleReset}
          color="primary"
          aria-label="reset filters"
          // sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
        >
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
        </IconButton>
      </Box>

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

export default MarketTrendChartLT;
