// Tables.jsx
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Select, MenuItem, Tooltip } from '@mui/material';
import './LedgerTable.css';

const menuItemStyle = { fontSize: '0.875rem', color: '#FFFFFF' };

const Tables = ({ trades, onTradeUpdate }) => {
  // Helper: Convert an Excel date number to an IST date string.
  const convertExcelDateToIST = (excelDate) => {
    if (!excelDate) return '';
    const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
    return jsDate.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  // Update the "Strategy" value for a specific trade.
  const handleStrategyChange = (id, newStrategy) => {
    const updatedTrades = trades.map((trade) => (trade.id === id ? { ...trade, strategy: newStrategy } : trade));
    onTradeUpdate(updatedTrades);
  };

  // Update the "Mistakes" value for a specific trade.
  const handleMistakesChange = (id, newMistake) => {
    const updatedTrades = trades.map((trade) => (trade.id === id ? { ...trade, mistakes: newMistake } : trade));
    onTradeUpdate(updatedTrades);
  };

  // Define the DataGrid columns.
  const columns = [
    {
      field: 'symbol',
      headerName: 'Stock',
      headerAlign: 'left',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Tooltip
          title={params.value || ''}
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: '#26282B',
                color: '#FFFFFF',
                fontSize: '0.875rem'
              }
            }
          }}
        >
          <Typography className="cell-text" style={{ color: '#FFE072', fontFamily:'figtree' }}>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'position',
      headerName: 'Position',
      headerAlign: 'left',
      flex: 0.5,
      minWidth: 100,
      // renderCell: (params) => (
      //   <Typography className="cell-text">
      //     {params.value}
      //   </Typography>
      // ),
      renderCell: (params) => {
        const borderColor = params.value === 'SHORT' ? '#04b5d4' : '#6348c7'; // Set border color based on the value

        return (
          <Typography
            className="cell-text"
            style={{
              display: 'inline-block',
              border: `2px solid ${borderColor}`, // Apply border with the color
              padding: '4px 8px', // Optional: Add padding for better visibility
              textAlign: 'center',
              marginRight: '10px',
              borderRadius: '4px'
            }}
          >
            {params.value}
          </Typography>
        );
      }
    },
    {
      field: 'avgBuyPrice',
      headerName: 'Buy',
      headerAlign: 'left',
      // align: 'center',
      flex: 0.5,
      minWidth: 60,
      type: 'number',
      renderCell: (params) => {
        const formattedValue = parseFloat(params.value).toFixed(2); // Round the number to 2 decimal places
        return <Typography className="cell-text">{formattedValue}</Typography>;
      }
    },
    {
      field: 'avgSellPrice',
      headerName: 'Sell',
      headerAlign: 'left',
      align: 'left',
      flex: 0.5,
      minWidth: 60,
      type: 'number',
      renderCell: (params) => {
        const formattedValue = parseFloat(params.value).toFixed(2); // Round the number to 2 decimal places
        return <Typography className="cell-text">{formattedValue}</Typography>;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'left',
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => {
        const color = params.value === 'CLOSE' ? '#b59ef3' : '#04b5d4'; // Set color based on whether value is 'Close'

        return (
          <Typography
            className="cell-text"
            style={{
              display: 'inline-block',
              padding: '4px 8px',
              color: '#FFFFFF', // Text color remains white
              border: `2px solid ${color}`, // Border color based on the condition
              borderRadius: '4px', // Optional: Add border radius for rounded corners
              textAlign: 'center'
            }}
          >
            {params.value}
          </Typography>
        );
      }
    },
    {
      field: 'totalQuantity',
      headerName: 'Qty',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      minWidth: 60,
      type: 'number'
    },
    {
      field: 'date',
      headerName: 'Date',
      headerAlign: 'left',
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => <Typography className="cell-text">{convertExcelDateToIST(params.value)}</Typography>
    },
    {
      field: 'result',
      headerName: 'Result',
      hederAlign: 'left',
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        const formattedValue = parseFloat(params.value).toFixed(2); // Round the number to 2 decimal places
        const isPositive = parseFloat(params.value) >= 0; // Check if value is positive or negative
        const color = isPositive ? '#00EFC8' : '#FF5966'; // Choose the color based on positivity or negativity

        // Lighter shade of the color for the background
        const backgroundColor = isPositive ? '#00EFC8' : '#FF5966';
        const lighterShade = isPositive ? '#80E7D6' : '#FF8A8A'; // Lighter tones of the colors

        return (
          <Typography
            className="cell-text"
            style={{
              color: '#FFFFFF', // Text color should be white
              backgroundColor: backgroundColor, // Lighter background color
              border: `2px solid ${color}`, // Border with the original color
              padding: '4px 8px', // Add padding for better readability
              borderRadius: '4px', // Optional: Add border radius for rounded corners
              textAlign: 'center'
            }}
          >
            {formattedValue}
          </Typography>
        );
      }
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      headerAlign: 'left',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => handleStrategyChange(params.id, e.target.value)}
          fullWidth
          size="small"
          sx={{
            backgroundColor: '#1d1e20',
            color: '#FFFFFF',
            borderRadius: '2px',
            fontSize: '0.875rem'
          }}
        >
          <MenuItem value="" style={menuItemStyle}>
            All
          </MenuItem>
          <MenuItem value="30Day" style={menuItemStyle}>
            30 Day
          </MenuItem>
          <MenuItem value="90Day" style={menuItemStyle}>
            90 Day
          </MenuItem>
          <MenuItem value="IPO" style={menuItemStyle}>
            IPO
          </MenuItem>
          <MenuItem value="BreakoutDaily" style={menuItemStyle}>
            Breakout Soon Daily
          </MenuItem>
          <MenuItem value="BreakoutWeekly" style={menuItemStyle}>
            Breakout Soon Weekly
          </MenuItem>
          <MenuItem value="RecentBreakout" style={menuItemStyle}>
            Recent Breakout
          </MenuItem>
          <MenuItem value="BigPlayers" style={menuItemStyle}>
            Big Players Money Flow
          </MenuItem>
        </Select>
      )
    },
    {
      field: 'mistakes',
      headerName: 'Mistakes',
      headerAlign: 'left',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => handleMistakesChange(params.id, e.target.value)}
          fullWidth
          size="small"
          sx={{
            backgroundColor: '#1d1e20',
            color: '#EEEEEE',
            borderRadius: '2px'
          }}
        >
          <MenuItem value="" style={menuItemStyle}>
            Select
          </MenuItem>
          <MenuItem value="1" style={menuItemStyle}>
            1
          </MenuItem>
          <MenuItem value="2" style={menuItemStyle}>
            2
          </MenuItem>
          <MenuItem value="3" style={menuItemStyle}>
            3
          </MenuItem>
        </Select>
      )
    }
  ];

  // Prepare rows from the aggregated trades; provide default values to avoid undefined.
  const rows = trades.map((trade) => ({
    id: trade.id,
    symbol: trade.symbol || '',
    position: trade.position || '',
    avgBuyPrice: trade.avgBuyPrice ?? 0,
    avgSellPrice: trade.avgSellPrice ?? 0,
    totalQuantity: trade.totalQuantity ?? 0,
    date: trade.date || '',
    result: trade.result || '',
    strategy: trade.strategy || '',
    mistakes: trade.mistakes || '',
    status: trade.status || ''
  }));

  return (
    <Box
      className="ledger-data"
      sx={{
        width: '100%',
        ml: 0,
        '&::-webkit-scrollbar': { display: 'none' },
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem'
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#141516',
          color: '#EEEEEE',
          fontSize: '0.875rem'
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: '#141516',
          fontSize: '0.875rem',
          color: 'red'
        }
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        // pageSize={10}
        // rowsPerPageOptions={[10]}
        disableSelectionOnClick
        // components={{ Toolbar: GridToolbar }}
        hideFooterSelectedRowCount
        sx={{
          backgroundColor: '#26282B',
          color: '#EEEEEE',
          border: 'none'
        }}
      />
    </Box>
  );
};

export default Tables;
