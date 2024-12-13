import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, CircularProgress, Typography } from '@mui/material';
import './CandleStickChart.css';

const CandlestickChart = ({ token }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(token);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        console.log(selectedStock, "selected stock");
        const response = await fetch(`http://localhost:8000/api/service/historical-data/?exchange=NSE&token=${selectedStock}&timeperiod=ONE_DAY`);
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonData = await response.json();

        if (Array.isArray(jsonData) && jsonData.length > 0) {
          setData(jsonData);
        } else {
          throw new Error('Fetched data is not valid');
        }
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [selectedStock]);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const chartOptions = {
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
        layout: {
          backgroundColor: '#1E1E1E', // Always dark background
          textColor: '#FFFFFF', // Light text color
          fontSize: 12,
          fontFamily: 'Verdana, Arial, sans-serif'
        },
        grid: {
          vertLines: { color: '#4A4A4A' },
          horzLines: { color: '#4A4A4A' }
        },
        crosshair: {
          mode: 1,
        },
        priceScale: {
          position: 'right',
          borderColor: '#CCCCCC',
        },
        timeScale: {
          rightOffset: 10,
          barSpacing: 6,
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#CCCCCC'
        },
      };

      const chart = createChart(chartRef.current, chartOptions);

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#4fff28',
        borderUpColor: '#4fff28',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        wickUpColor: '#4fff28',
        wickDownColor: '#ff4976',
      });

      const candlestickData = data.map((entry) => ({
        time: new Date(entry.Date).getTime() / 1000,
        open: entry.Open,
        high: entry.High,
        low: entry.Low,
        close: entry.Close,
      }));

      candlestickSeries.setData(candlestickData);

      chart.timeScale().fitContent();

      const handleResize = () => {
        chart.resize(chartRef.current.clientWidth, chartRef.current.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        chart.remove();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '400px', position: 'relative' }}>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </Box>
  );
};

export default CandlestickChart;
