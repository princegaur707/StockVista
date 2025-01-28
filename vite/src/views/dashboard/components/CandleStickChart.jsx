// import React, { useEffect, useRef, useState } from 'react';
// import { createChart } from 'lightweight-charts';
// import { Box, CircularProgress, Typography, FormControl, Select, MenuItem, Switch } from '@mui/material';
// import './CandleStickChart.css';

// const CandlestickChart = ( {token}) => {
//   const chartRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState([]);
//   const [error, setError] = useState('');
//   const [selectedStock, setSelectedStock] = useState(token); // Example default stock symbol
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [tooltipData, setTooltipData] = useState(null);
//   const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

//   const handleStockChange = (event) => {
//     setSelectedStock(event.target.value); // Update selected stock symbol
//   };

//   const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/service/get-token/?symbol=${selectedStock}`
//         );
//         if (!response.ok) throw new Error('Failed to fetch token');
//         const jsonData = await response.json();

//         if (jsonData.token) {
//           setNumericalToken(jsonData.token); // Update numerical token
//         } else {
//           throw new Error('Token not found');
//         }
//       } catch (err) {
//         setError('Error fetching token: ' + err.message);
//         setNumericalToken(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchToken();
//   }, [selectedStock]);

//   useEffect(() => {
//     if (numericalToken) {
//       const fetchHistoricalData = async () => {
//         setLoading(true);
//         try {
//           const response = await fetch(
//             `${import.meta.env.VITE_API_URL}/api/service/get-historical-data/?symbol=${selectedStock}`
//           );
//           if (!response.ok) throw new Error('Failed to fetch historical data');
//           const jsonData = await response.json();

//           if (Array.isArray(jsonData) && jsonData.length > 0) {
//             setData(jsonData);
//           } else {
//             throw new Error('Fetched data is not valid');
//           }
//         } catch (err) {
//           setError('Error fetching historical data: ' + err.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchHistoricalData();
//     }
//   }, [numericalToken]);

//   useEffect(() => {
//     if (data.length > 0 && chartRef.current) {
//       const chartOptions = {
//         width: chartRef.current.clientWidth,
//         height: chartRef.current.clientHeight,
//         layout: {
//           backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
//           textColor: isDarkMode ? '#FFFFFF' : '#000000'
//         },
//         grid: {
//           vertLines: { color: isDarkMode ? '#4A4A4A' : '#E0E0E0' },
//           horzLines: { color: isDarkMode ? '#4A4A4A' : '#E0E0E0' }
//         },
//         crosshair: {
//           mode: 1
//         },
//         priceScale: {
//           position: 'right'
//         },
//         timeScale: {
//           timeVisible: true,
//           secondsVisible: false
//         }
//       };

//       const chart = createChart(chartRef.current, chartOptions);

//       // Add candlestick series
//       const candlestickSeries = chart.addCandlestickSeries({
//         upColor: '#4fff28',
//         borderUpColor: '#4fff28',
//         downColor: '#ff4976',
//         borderDownColor: '#ff4976',
//         wickUpColor: '#4fff28',
//         wickDownColor: '#ff4976'
//       });

//       const candlestickData = data.map((entry) => ({
//         time: new Date(entry.Date).getTime() / 1000,
//         open: entry.Open,
//         high: entry.High,
//         low: entry.Low,
//         close: entry.Close
//       }));

//       candlestickSeries.setData(candlestickData);

//       chart.timeScale().fitContent();

//       // Cleanup on unmount
//       return () => chart.remove();
//     }
//   }, [data, isDarkMode]);

//   if (loading) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height="50vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Typography color="error" align="center">
//         {error}
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ width: '100%', height: '400px', position: 'relative' }}>
//       <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
//         <Select value={selectedStock} onChange={handleStockChange}>
//           <MenuItem value="2min">2min</MenuItem>
//           <MenuItem value="5min">5min</MenuItem>
//           <MenuItem value="1Day">1Day</MenuItem>
//         </Select>
//       </FormControl>

//       <Switch checked={isDarkMode} onChange={toggleDarkMode} />

//       <div ref={chartRef} style={{ width: '100%', height: '400px' }} />

//       {tooltipData && (
//         <Box
//           sx={{
//             position: 'absolute',
//             top: tooltipPosition.y - 30,
//             left: tooltipPosition.x + 10,
//             backgroundColor: 'rgba(0,0,0,0.7)',
//             color: '#FFFFFF',
//             padding: '5px',
//             borderRadius: '5px',
//             pointerEvents: 'none',
//             zIndex: 1000
//           }}
//         >
//           <div>Open: {tooltipData.open}</div>
//           <div>High: {tooltipData.high}</div>
//           <div>Low: {tooltipData.low}</div>
//           <div>Close: {tooltipData.close}</div>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default CandlestickChart;

import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, CircularProgress, Typography, FormControl, Select, MenuItem, Switch } from '@mui/material';
import './CandleStickChart.css';

const CandlestickChart = ({ token }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(token);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleStockChange = (event) => setSelectedStock(event.target.value);
  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service/get-historical-data/?symbol=${selectedStock}`);
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
      // const chartOptions = {
      //   width: chartRef.current.clientWidth,
      //   height: chartRef.current.clientHeight,
      //   layout: {
      //     backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      //     textColor: isDarkMode ? '#FFFFFF' : '#000000'
      //   },
      //   grid: {
      //     vertLines: { color: isDarkMode ? '#4A4A4A' : '#E0E0E0' },
      //     horzLines: { color: isDarkMode ? '#4A4A4A' : '#E0E0E0' }
      //   },
      //   crosshair: {
      //     mode: 1 // Enable crosshair
      //   },
      //   priceScale: {
      //     position: 'right'
      //   },
      //   timeScale: {
      //     timeVisible: true,
      //     secondsVisible: false
      //   }
      // };
      const chartOptions = {
        width: chartRef.current.clientWidth, // Set chart width dynamically
        height: chartRef.current.clientHeight, // Set chart height dynamically
        layout: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', // Set background color based on dark mode
          textColor: isDarkMode ? '#FFFFFF' : '#000000', // Adjust text color based on dark mode
          fontSize: 12, // Set default font size
          fontFamily: 'Verdana, Arial, sans-serif' // Define font family
        },
        grid: {
          vertLines: { color: isDarkMode ? '#4A4A4A' : '#E0E0E0', visible: true }, // Vertical grid lines
          horzLines: { color: isDarkMode ? '#4A4A4A' : '#E0E0E0', visible: true } // Horizontal grid lines
        },
        crosshair: {
          mode: 1, // Normal crosshair mode
          vertLine: {
            color: '#758696', // Customize vertical line color
            width: 1, // Line width
            style: 0, // Solid line
            visible: true // Enable visibility
          },
          horzLine: {
            color: '#758696', // Customize horizontal line color
            width: 1, // Line width
            style: 0, // Solid line
            visible: true // Enable visibility
          }
        },
        priceScale: {
          position: 'right', // Set price scale to the right
          borderColor: isDarkMode ? '#CCCCCC' : '#2B2B43', // Border color of price scale
          autoScale: true // Enable auto-scaling
        },
        timeScale: {
          rightOffset: 10, // Space from the right of the chart
          barSpacing: 6, // Space between bars
          fixLeftEdge: true, // Fix the left edge
          lockVisibleTimeRangeOnResize: true, // Prevent shifting of visible time range on resize
          timeVisible: true, // Show time labels on the time axis
          secondsVisible: false, // Hide seconds on the time axis
          borderColor: isDarkMode ? '#CCCCCC' : '#2B2B43' // Border color for time scale
        },
        handleScroll: {
          vertTouchDrag: true, // Enable vertical touch scroll
          horzTouchDrag: true // Enable horizontal touch scroll
        },
        handleScale: {
          axisPressedMouseMove: true, // Enable scaling when axis is dragged
          pinch: true // Enable pinch-to-zoom functionality
        },
        watermark: {
          color: 'rgba(255, 255, 255, 0.5)', // Watermark color
          visible: true, // Show watermark
          text: 'TradingView', // Watermark text
          fontSize: 24 // Watermark font size
        }
      };

      const chart = createChart(chartRef.current, chartOptions);

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#4fff28', // Color for up candles
        borderUpColor: '#4fff28',
        downColor: '#ff4976', // Color for down candles
        borderDownColor: '#ff4976',
        wickUpColor: '#4fff28', // Wick color for up candles
        wickDownColor: '#ff4976' // Wick color for down candles
      });

      const candlestickData = data.map((entry) => ({
        time: new Date(entry.Date).getTime() / 1000, // Time in seconds
        open: entry.Open,
        high: entry.High,
        low: entry.Low,
        close: entry.Close
      }));

      candlestickSeries.setData(candlestickData);

      // Add histogram (bar) series for volume data
      const volumeSeries = chart.addHistogramSeries({
        priceScaleId: '', // Attach volume to the main price scale
        priceLineVisible: false, // Hide price line
        scaleMargins: {
          top: 0.8, // Reserve most of the space for the candlestick chart
          bottom: 0 // Align bars with the bottom
        }
      });

      const volumeData = data.map((entry) => ({
        time: new Date(entry.Date).getTime() / 1000,
        value: entry.Volume / 1000000, // Scale volume to millions
        // Add RGBA colors with reduced opacity for better visibility
        color: entry.Close >= entry.Open ? 'rgba(41, 98, 255, 0.2)' : 'rgba(255, 165, 0, 0.2)' // Blue for up, Orange for down with 50% opacity
      }));

      volumeSeries.setData(volumeData);

      chart.timeScale().fitContent();

      // Subscribe to crosshair move to show tooltips near cursor
      chart.subscribeCrosshairMove((param) => {
        if (!param || !param.seriesData || !param.time || !param.point) {
          setTooltipData(null); // Hide tooltip if no data
          return;
        }

        const candlestickPoint = param.seriesData.get(candlestickSeries);
        if (candlestickPoint) {
          // Update tooltip data and position
          setTooltipData({
            open: candlestickPoint.open,
            high: candlestickPoint.high,
            low: candlestickPoint.low,
            close: candlestickPoint.close
          });
          setTooltipPosition({ x: param.point.x, y: param.point.y });
        }
      });

      const handleResize = () => {
        chart.resize(chartRef.current.clientWidth, chartRef.current.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        chart.remove();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [data, isDarkMode]);

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
      {/* <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <Select value={selectedStock} onChange={handleStockChange}>
        </Select>
      </FormControl> */}

      {/* <Switch checked={isDarkMode} onChange={toggleDarkMode} /> */}

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
    </Box>
  );
};

export default CandlestickChart;
