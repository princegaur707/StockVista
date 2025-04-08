import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, CircularProgress, Typography, ButtonGroup, Button } from '@mui/material';
import './CandleStickChart.css';

const HoverChart = ({ token }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(token);
  const [timePeriod, setTimePeriod] = useState('1M');
  const chartInstanceRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [volume, setVolume] = useState(null); // New state for volume
  const [currentTime, setCurrentTime] = useState('');
  const lastDate = null;

  const toIST = (timestamp) => {
    const date = new Date(timestamp);
    return Math.floor(new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getTime() / 1000);
  };

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
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formattedTime = now.toLocaleTimeString('en-IN', options);
      setCurrentTime(formattedTime);
    };

    // Update time immediately and every second
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
          textColor: 'rgba(255, 255, 255, 0.9)'
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' }
        },
        crosshair: {
          mode: 0,
          vertLine: {
            color: '#FFE072', // Change vertical line color
            labelBackgroundColor: '#FFE072' // Background color of the crosshair tooltip
          },
          horzLine: {
            color: '#FFE072', // Change horizontal line color
            labelBackgroundColor: '#FFE072' // Background color of the crosshair tooltip
          }
        },
        priceScale: { borderColor: '#485c7b' },

        handleScroll: {
          vertTouchDrag: true, // Enable vertical touch scroll
          horzTouchDrag: true // Enable horizontal touch scroll
        },
        handleScale: {
          axisPressedMouseMove: true, // Enable scaling when axis is dragged
          pinch: true // Enable pinch-to-zoom functionality
        },
        localization: {
          timeFormatter: (time) => {
            const date = new Date(time * 1000);
            const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

            const formattedDate = istDate.toLocaleDateString('en-IN', {
              timeZone: 'Asia/Kolkata',
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            });

            const formattedTime = istDate.toLocaleTimeString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });

            // Check if the selected time period is 1D or 5D
            if (timePeriod === '1D' || timePeriod === '5D') {
              return `${formattedDate} ${formattedTime}`; // Show date + time
            } else {
              return formattedDate; // Show only date
            }
          }
        },
        timeScale:
          timePeriod === '1D' || timePeriod === '5D'
            ? {
                timeVisible: true,
                secondVisible: false,
                timezone: 'Asia/Kolkata', // Set the timezone to IST
                tickMarkFormatter: (() => {
                  let lastDate = null; // Store the last processed date

                  return (time) => {
                    const date = new Date(time * 1000);
                    const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

                    // Extract date and time separately
                    const formattedDate = istDate.toLocaleDateString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      day: '2-digit',
                      // month: '2-digit' // Include month to make date changes clear
                    });

                    const formattedTime = istDate.toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    });

                    if (formattedDate !== lastDate) {
                      // If the date has changed, show it along with the time
                      lastDate = formattedDate;
                      return `${formattedDate} ${formattedTime}`;
                      // return formattedTime
                    } else {
                      // Otherwise, show only the time
                      return formattedTime;
                    }
                  };
                })()
              }
            : {
                timeVisible: true,
                secondVisible: false,
                timezone: 'Asia/Kolkata' // Set the timezone to IST
              }
      };

      const chart = createChart(chartRef.current, chartOptions);
      chartInstanceRef.current = chart;

      const filteredData = getTimeFilter(timePeriod);
      const candlestickData = filteredData.map((entry) => ({
        time: toIST(entry.Date), // Convert to IST before using it in the chart
        open: entry.Open,
        high: entry.High,
        low: entry.Low,
        close: entry.Close
      }));

      //Add histogram series with a unique priceScaleId
      const volumeSeries = chart.addHistogramSeries({
        priceScaleId: 'volume',
        priceLineVisible: false,
        scaleMargins: { top: 0.85, bottom: 0 }
      });

      const volumeData = filteredData.map((entry) => ({
        time: toIST(entry.Date),
        value: entry.Volume / 10000,
        color: entry.Close >= entry.Open ? '#20605A' : '#853735'
      }));

      volumeSeries.setData(volumeData);

      //Add candlestick chart
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26A69A', // Color for up candles
        borderUpColor: '#26A69A',
        downColor: '#F05350', // Color for down candles
        borderDownColor: '#F05350',
        wickUpColor: '#26A69A', // Wick color for up candles
        wickDownColor: '#F05350' // Wick color for down candles
      });

      candlestickSeries.setData(candlestickData);

      // Set the time scale visibility range based on the time period
      const setVisibleRange = (rangeFrom, rangeTo) => {
        chart.timeScale().setVisibleRange({ from: rangeFrom, to: rangeTo });
      };

      if (timePeriod === '1D') {
        const lastDayTimestamp = Math.max(...candlestickData.map((entry) => entry.time));
        const oneDayAgoTimestamp = lastDayTimestamp - 24 * 60 * 60; // Subtract one day in seconds
        setVisibleRange(oneDayAgoTimestamp, lastDayTimestamp);
      } else if (timePeriod === '5D') {
        const lastDayTimestamp = Math.max(...candlestickData.map((entry) => entry.time));
        const fiveDaysAgoTimestamp = lastDayTimestamp - 5 * 24 * 60 * 60; // Subtract five days in seconds
        setVisibleRange(fiveDaysAgoTimestamp, lastDayTimestamp);
      } else if (timePeriod === '1M') {
        const lastDayTimestamp = Math.max(...candlestickData.map((entry) => entry.time));
        const oneMonthAgoTimestamp = lastDayTimestamp - 30 * 24 * 60 * 60; // Subtract one month in seconds
        setVisibleRange(oneMonthAgoTimestamp, lastDayTimestamp);
      } else if (timePeriod === '3M') {
        const lastDayTimestamp = Math.max(...candlestickData.map((entry) => entry.time));
        const threeMonthsAgoTimestamp = lastDayTimestamp - 90 * 24 * 60 * 60; // Subtract three months in seconds
        setVisibleRange(threeMonthsAgoTimestamp, lastDayTimestamp);
      } else if (timePeriod === '6M') {
        const lastDayTimestamp = Math.max(...candlestickData.map((entry) => entry.time));
        const sixMonthsAgoTimestamp = lastDayTimestamp - 180 * 24 * 60 * 60; // Subtract six months in seconds
        setVisibleRange(sixMonthsAgoTimestamp, lastDayTimestamp);
      } else if (timePeriod === '1Y') {
        const lastDayTimestamp = Math.max(...candlestickData.map((entry) => entry.time));
        const oneYearAgoTimestamp = lastDayTimestamp - 365 * 24 * 60 * 60; // Subtract one year in seconds
        setVisibleRange(oneYearAgoTimestamp, lastDayTimestamp);
      } else if (timePeriod === '5Y') {
        const lastDayTimestamp = Math.max(...candlestickData.map((entry) => entry.time));
        const fiveYearsAgoTimestamp = lastDayTimestamp - 5 * 365 * 24 * 60 * 60; // Subtract five years in seconds
        setVisibleRange(fiveYearsAgoTimestamp, lastDayTimestamp);
      } else {
        chart.timeScale().fitContent(); // Default for 'All'
      }

      // Subscribe to crosshair move to show tooltips near cursor
      chart.subscribeCrosshairMove((param) => {
        if (!param || !param.seriesData || !param.time || !param.point) {
          setTooltipData(null); // Hide tooltip if no data
          setVolume(null); // Hide volume if no data
          return;
        }

        const candlestickPoint = param.seriesData.get(candlestickSeries);
        const volumePoint = param.seriesData.get(volumeSeries);

        if (!candlestickPoint) {
          setTooltipData(null);
          setVolume(null);
          return;
        }
        
        if (candlestickPoint) {
          // Convert the UTC time to IST
          const time = new Date(param.time * 1000); // UTC to JavaScript Date
          const istTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
          const formattedTime = istTime.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });

          // Update tooltip data and position
          setTooltipData({
            open: candlestickPoint.open.toFixed(2),
            high: candlestickPoint.high.toFixed(2),
            low: candlestickPoint.low.toFixed(2),
            close: candlestickPoint.close.toFixed(2),
            time: formattedTime // Add the formatted time to the tooltip
          });
          setTooltipPosition({ x: param.point.x, y: param.point.y });

          // Update volume data (divide by 1000 and append 'k')
          const volumeInK = ((volumePoint.value * 10000) / 1000).toFixed(1); // Convert to thousands and round to 1 decimal place
          setVolume(`${volumeInK} K`); // Append 'k' to the value
        } else {
          setVolume(null); // Hide volume if no data
        }
      });

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
    return data; // No need to filter, just return full data
  };
  return (
    <Box sx={{ width: '100%', height: '300px', position: 'relative', backgroundColor: 'red', color: '#FFFFFF' }}>
      {/* <Typography variant="h4" sx={{ textAlign: 'left', padding: '10px', fontWeight: 'bold', color: '#FFD700' }}>
        {selectedStock}
      </Typography> */}
      {/* Volume display at the top-left corner */}
      {volume && (
        <Box
          sx={{
            position: 'absolute',
            top: 10, // Position at the top
            left: 10, // Position at the left
            backgroundColor: '#141516',
            color: '#FFFFFF',
            padding: '5px',
            borderRadius: '15px',
            pointerEvents: 'none', // Ensure the box does not interfere with cursor events
            zIndex: 1000
          }}
        >
          Volume: {volume}
        </Box>
      )}
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

      {/* Indian Time Watch at the bottom-right corner */}
      {/* <Box
        sx={{
          position: 'absolute',
          bottom: 10, // Position at the bottom
          right: 10, // Position at the right
          // backgroundColor: '#141516',
          color: '#FFFFFF',
          padding: '5px',
          borderRadius: '5px',
          pointerEvents: 'none', // Ensure the box does not interfere with cursor events
          zIndex: 1000,
          mb: '5px'
        }}
      >
        {currentTime} IST
      </Box> */}

      <ButtonGroup variant="contained" sx={{ display: 'flex', justifyContent: 'left', marginTop: 2, marginLeft:0.5}}>
        {[
          { label: '1D', value: '1D' },
          { label: '5D', value: '5D' },
          { label: '1M', value: '1M' },
          { label: '3M', value: '3M' },
          { label: '6M', value: '6M' },
          { label: '1Y', value: '1Y' },
          { label: '5Y', value: '5Y' },
          { label: 'All', value: 'All' }
        ].map(({ label, value }) => (
          <Button
            key={value}
            onClick={() => setTimePeriod(value)}
            sx={{
              backgroundColor: timePeriod === value ? '#FFE072' : 'inherit',
              color: timePeriod === value ? '#000' : '#FFF',
              fontWeight: '400',
              borderRadius: '1px',
              padding: '1px',
              fontSize: '12px',
              '&:hover': {
                backgroundColor: timePeriod === value ? '#FFE072' : 'inherit', // Keep the background color same on hover
                color: timePeriod === value ? '#333333' : '#FFFFFF' // Keep the text color same on hover
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

export default HoverChart;
