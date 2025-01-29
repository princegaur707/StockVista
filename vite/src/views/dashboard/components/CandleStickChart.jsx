import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, CircularProgress, Typography, ButtonGroup, Button } from '@mui/material';
import './CandleStickChart.css';

const CandlestickChart = ({ token }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(token);
  const [timePeriod, setTimePeriod] = useState('1M');
  const chartInstanceRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });


  const fetchHistoricalData = async (period) => {
    setLoading(true);
    try {
      let url =
        period === '1D' || period === '5D'
          ? `${import.meta.env.VITE_API_URL}/api/service/get-historical-data-minute-wise/?symbol=${selectedStock}`
          : `${import.meta.env.VITE_API_URL}/api/service/get-historical-data/?symbol=${selectedStock}&period=${period}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const jsonData = await response.json();

      if (jsonData.data && Array.isArray(jsonData.data)) {
        setData(jsonData.data);
      } else if (Array.isArray(jsonData)) {
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

  useEffect(() => {
    fetchHistoricalData(timePeriod);
  }, [selectedStock, timePeriod]);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }
    if (data.length > 0 && chartRef.current) {
      const chartOptions = {
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
        layout: {
          background: { type: 'solid', color: '#121212' },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
        },
        crosshair: { mode: 0 },
        priceScale: { borderColor: '#485c7b' },
        timeScale: { timeVisible: true, secondVisible: false },
        handleScroll: {
          vertTouchDrag: true, // Enable vertical touch scroll
          horzTouchDrag: true // Enable horizontal touch scroll
        },
        handleScale: {
          axisPressedMouseMove: true, // Enable scaling when axis is dragged
          pinch: true // Enable pinch-to-zoom functionality
        }
      };

      const chart = createChart(chartRef.current, chartOptions);
      chartInstanceRef.current = chart;
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26A69A', // Color for up candles
        borderUpColor: '#26A69A',
        downColor: '#F05350', // Color for down candles
        borderDownColor: '#F05350',
        wickUpColor: '#26A69A', // Wick color for up candles
        wickDownColor: '#F05350' // Wick color for down candles
      });

      const filteredData = getTimeFilter(timePeriod);
      const candlestickData = filteredData.map((entry) => ({
        time: new Date(entry.Date).getTime() / 1000,
        open: entry.Open,
        high: entry.High,
        low: entry.Low,
        close: entry.Close,
      }));

      candlestickSeries.setData(candlestickData);
      
      const volumeSeries = chart.addHistogramSeries({
        priceScaleId: '',
        priceLineVisible: false,
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      
      const volumeData = filteredData.map((entry) => ({
        time: new Date(entry.Date).getTime() / 1000,
        value: entry.Volume / 1000000,
        color: entry.Close >= entry.Open ? '#20605A' : '#853735',
      }));
      

      volumeSeries.setData(volumeData);
      
      chart.timeScale().fitContent();

      const handleResize = () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.resize(chartRef.current.clientWidth, chartRef.current.clientHeight);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.remove();
          chartInstanceRef.current = null;
        }
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [data]);

  const getTimeFilter = (period) => {
    if (period === '1D' || period === '5D') return data; // No need to filter again
  
    const today = new Date();
    let startDate = new Date();
  
    switch (period) {
      case '5D':
        startDate.setDate(today.getDate() - 5);
        break;
      case '1M':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(today.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case '5Y':
        startDate.setFullYear(today.getFullYear() - 5);
        break;
      case 'All':
        return data;
      default:
        return data;
    }
  
    return data.filter((entry) => new Date(entry.Date) >= startDate);
  };

  return (
    <Box sx={{ width: '100%', height: '455px', position: 'relative', backgroundColor: '#121212', color: '#FFFFFF' }}>
      {/* <Typography variant="h4" sx={{ textAlign: 'left', padding: '10px', fontWeight: 'bold', color: '#FFD700' }}>
        {selectedStock}
      </Typography> */}
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      {tooltipData && (
        <Box
          sx={{
            position: 'absolute',
            top: tooltipPosition.y - 30, // Adjust tooltip position near the cursor
            left: tooltipPosition.x + 10, // Adjust tooltip position near the cursor
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#FFFFFF',
            padding: '5px',
            borderRadius: '5px',
            pointerEvents: 'none', // Ensure the tooltip does not interfere with cursor events
            zIndex: 1000
          }}
        >
          <div>Open: {tooltipData.open}</div>
          <div>High: {tooltipData.high}</div>
          <div>Low: {tooltipData.low}</div>
          <div>Close: {tooltipData.close}</div>
        </Box>
      )}

      <ButtonGroup variant="contained" sx={{ display: 'flex', justifyContent: 'left', marginTop: 2 }}>
        {[
          { label: '1D', value: '1D' },
          { label: '5D', value: '5D' },
          { label: '1M', value: '1M' },
          { label: '3M', value: '3M' },
          { label: '6M', value: '6M' },
          { label: '1Y', value: '1Y' },
          { label: '5Y', value: '5Y' },
          { label: 'All', value: 'All' },
        ].map(({ label, value }) => (
          <Button
            key={value}
            onClick={() => setTimePeriod(value)}
            sx={{ backgroundColor: timePeriod === value ? '#FFE072' : 'inherit', color: timePeriod === value ? '#000' : '#FFF',
              fontWeight:'400',
              borderRadius:'1px',
              padding:'3px',
              fontSize:'12px',
              '&:hover': {
          backgroundColor: timePeriod === value ? '#FFE072' : 'inherit', // Keep the background color same on hover
          color: timePeriod === value ? '#333333' : '#FFFFFF', // Keep the text color same on hover
        }
             }}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default CandlestickChart;
