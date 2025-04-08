import React, { useEffect, useState, useContext } from 'react';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AuthContext from 'views/pages/authentication/auth-forms/AuthContext';

const getColor = (pct_change) => {
  if (pct_change >= 10) return '#00ff00';
  if (pct_change >= 5) return '#33cc33';
  if (pct_change >= 2) return '#66cc66';
  if (pct_change > 0) return '#b3ffb3';
  if (pct_change === 0) return '#f0f0f0';
  if (pct_change > -2) return '#ff9999';
  if (pct_change > -5) return '#ff4d4d';
  if (pct_change > -10) return '#e60000';
  return '#990000';
};

const getTextColor = (pct_change) => {
  const bgColor = getColor(pct_change);
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

const CustomizedContent = ({ x, y, width, height, name, originalValue, adjusted }) => {
  const safeName = name || '';
  const bgColor = getColor(originalValue);
  const textColor = getTextColor(originalValue);

  const padding = 4;
  const minFontSize = 10;
  const maxFontSize = 24;

  const availableHeight = height - 2 * padding;
  const availableWidth = width - 2 * padding;

  const estimateTextWidth = (text, fontSize) => text.length * fontSize * 0.6;

  let fontSize = maxFontSize;

  const secondLine = `${originalValue?.toFixed(2)}%`;
  const thirdLine = adjusted ? '(Adjusted Area)' : null;

  while (fontSize >= minFontSize) {
    const lineHeight = fontSize;
    const totalHeight = thirdLine ? lineHeight * 3 + 4 : lineHeight * 2 + 4;

    const nameWidth = estimateTextWidth(safeName, fontSize);
    const secondWidth = estimateTextWidth(secondLine, fontSize);
    const thirdWidth = thirdLine ? estimateTextWidth(thirdLine, fontSize) : 0;

    if (
      totalHeight <= availableHeight &&
      nameWidth <= availableWidth &&
      secondWidth <= availableWidth &&
      thirdWidth <= availableWidth
    ) {
      break;
    }
    fontSize -= 1;
  }

  const centerX = x + width / 2;
  const baseY = y + height / 2 - (thirdLine ? fontSize : fontSize / 2);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={bgColor}
        stroke="#1D1E20"
        strokeWidth={2}
      />
      <text
        x={centerX}
        y={baseY}
        fill={textColor}
        fontSize={fontSize}
        fontFamily="Figtree"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {safeName}
      </text>
      <text
        x={centerX}
        y={baseY + fontSize + 2}
        fill={textColor}
        fontSize={fontSize}
        fontFamily="Figtree"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {secondLine}
      </text>
      {thirdLine && (
        <text
          x={centerX}
          y={baseY + (fontSize + 2) * 2}
          fill={textColor}
          fontSize={fontSize}
          fontFamily="Figtree"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {thirdLine}
        </text>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, originalValue } = payload[0].payload;
    return (
      <Box
        sx={{
          backgroundColor: '#1d1e20',
          padding: '8px 12px',
          borderRadius: '8px',
          color: '#fff',
          fontFamily: 'Figtree',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div>{name}</div>
        <div>{originalValue?.toFixed(2)}%</div>
      </Box>
    );
  }
  return null;
};

const SectorTreemap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { requestWithToken } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const res = await requestWithToken('http://127.0.0.1:8000/api/service/thirty-day-sector/');
      const json = await res.json();

      const rawValues = (json.data || []).map(item => ({
        name: item.index_name || 'Unknown',
        pct_change: parseFloat(item.pct_change ?? 0)
      }));

      const totalAbs = rawValues.reduce((sum, item) => sum + Math.abs(item.pct_change), 0);
      const maxAllowed = totalAbs / 900;

      const formatted = rawValues.map(item => {
        const absChange = Math.abs(item.pct_change);
        const adjusted = absChange > maxAllowed;
        return {
          name: item.name,
          value: adjusted ? maxAllowed : absChange,
          originalValue: item.pct_change,
          adjusted
        };
      });

      setData(formatted);
    } catch (err) {
      console.error('Failed to fetch sector data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [requestWithToken]);

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

  if (!data || data.length === 0) {
    return <div>No data available for the Treemap.</div>;
  }

  return (
    <Box
      sx={{
        padding: '2px 8px',
        borderRadius: '8px',
        marginLeft: '60px',
        marginRight: '20px',
        height: 600,
        backgroundColor: '#1d1e20',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px 0 16px'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#FFC42B',
            fontFamily: 'Figtree',
            fontWeight: 500,
            fontSize: '1.2rem'
          }}
        >
          30-Day Sector Treemap
        </Typography>
        <IconButton onClick={() => { setLoading(true); fetchData(); }}>
          <RefreshIcon sx={{ color: '#FFC42B' }} />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="value"
            aspectRatio={16 / 6}
            content={(props) => <CustomizedContent {...props} />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default SectorTreemap;


// import React, { useEffect, useState, useContext } from 'react';
// import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Typography, IconButton } from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import AuthContext from 'views/pages/authentication/auth-forms/AuthContext';

// const getColor = (pct_change) => {
//   if (pct_change >= 10) return '#00ff00';
//   if (pct_change >= 5) return '#33cc33';
//   if (pct_change >= 2) return '#66cc66';
//   if (pct_change > 0) return '#b3ffb3';
//   if (pct_change === 0) return '#f0f0f0';
//   if (pct_change > -2) return '#ff9999';
//   if (pct_change > -5) return '#ff4d4d';
//   if (pct_change > -10) return '#e60000';
//   return '#990000';
// };

// const getTextColor = (pct_change) => {
//   const bgColor = getColor(pct_change);
//   const r = parseInt(bgColor.slice(1, 3), 16);
//   const g = parseInt(bgColor.slice(3, 5), 16);
//   const b = parseInt(bgColor.slice(5, 7), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128 ? '#000000' : '#ffffff';
// };

// const CustomizedContent = ({ x, y, width, height, name, originalValue }) => {
//   const safeName = name || '';
//   const bgColor = getColor(originalValue);
//   const textColor = getTextColor(originalValue);

//   const padding = 4;
//   const minFontSize = 10;
//   const maxFontSize = 24;

//   const availableHeight = height - 2 * padding;
//   const availableWidth = width - 2 * padding;

//   const estimateTextWidth = (text, fontSize) => text.length * fontSize * 0.6;

//   let fontSize = maxFontSize;

//   // Decrease font size until both lines fit
//   while (fontSize >= minFontSize) {
//     const nameHeight = fontSize;
//     const percentHeight = fontSize;
//     const totalHeight = nameHeight + percentHeight + 4;

//     const nameWidth = estimateTextWidth(safeName, fontSize);
//     const percentWidth = estimateTextWidth(`${originalValue?.toFixed(2)}%`, fontSize);

//     if (
//       totalHeight <= availableHeight &&
//       nameWidth <= availableWidth &&
//       percentWidth <= availableWidth
//     ) {
//       break;
//     }
//     fontSize -= 1;
//   }

//   const nameX = x + width / 2;
//   const nameY = y + height / 2 - fontSize / 2;

//   const pctX = x + width / 2;
//   const pctY = nameY + fontSize + 4;

//   return (
//     <g>
//       <rect
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//         fill={bgColor}
//         stroke="#1D1E20"
//         strokeWidth={2}
//       />
//       <text
//         x={nameX}
//         y={nameY}
//         fill={textColor}
//         fontSize={fontSize}
//         fontFamily="Figtree"
//         textAnchor="middle"
//         dominantBaseline="middle"
//       >
//         {safeName}
//       </text>
//       <text
//         x={pctX}
//         y={pctY}
//         fill={textColor}
//         fontSize={fontSize}
//         fontFamily="Figtree"
//         textAnchor="middle"
//         dominantBaseline="middle"
//       >
//         {originalValue?.toFixed(2)}%
//       </text>
//     </g>
//   );
// };


// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const { name, originalValue } = payload[0].payload;
//     return (
//       <Box
//         sx={{
//           backgroundColor: '#1d1e20',
//           padding: '8px 12px',
//           borderRadius: '8px',
//           color: '#fff',
//           fontFamily: 'Figtree',
//           boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
//         }}
//       >
//         <div>{name}</div>
//         <div>{originalValue?.toFixed(2)}%</div>
//       </Box>
//     );
//   }
//   return null;
// };

// const SectorTreemap = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { requestWithToken } = useContext(AuthContext);

//   const fetchData = async () => {
//     try {
//       const res = await requestWithToken('http://127.0.0.1:8000/api/service/thirty-day-sector/');
//       const json = await res.json();

//       const formatted = (json.data || []).map((item) => {
//         const change = parseFloat(item.pct_change ?? 0);
//         return {
//           name: item.index_name || 'Unknown',
//           value: Math.abs(change), // for sizing
//           originalValue: change    // for coloring + tooltip
//         };
//       });

//       setData(formatted);
//     } catch (err) {
//       console.error('Failed to fetch sector data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [requestWithToken]);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%'
//         }}
//       >
//         <CircularProgress sx={{ color: '#FFC42B' }} />
//       </Box>
//     );
//   }

//   if (!data || data.length === 0) {
//     return <div>No data available for the Treemap.</div>;
//   }

//   return (
//     <Box
//       sx={{
//         padding: '2px 8px',
//         borderRadius: '8px',
//         marginLeft: '60px',
//         marginRight: '20px',
//         height: 600,
//         backgroundColor: '#1d1e20',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
//         display: 'flex',
//         flexDirection: 'column'
//       }}
//     >
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           padding: '10px 16px 0 16px'
//         }}
//       >
//         <Typography
//           variant="body1"
//           sx={{
//             color: '#FFC42B',
//             fontFamily: 'Figtree',
//             fontWeight: 500,
//             fontSize: '1.2rem'
//           }}
//         >
//           30-Day Sector Treemap
//         </Typography>
//         <IconButton onClick={() => { setLoading(true); fetchData(); }}>
//           <RefreshIcon sx={{ color: '#FFC42B' }} />
//         </IconButton>
//       </Box>

//       <Box sx={{ flexGrow: 1 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <Treemap
//             data={data}
//             dataKey="value"
//             aspectRatio={16 / 6}
//             // stroke="#000000"
//             content={(props) => <CustomizedContent {...props} />}
//           >
//             <Tooltip content={<CustomTooltip />} />
//           </Treemap>
//         </ResponsiveContainer>
//       </Box>
//     </Box>
//   );
// };

// export default SectorTreemap;
