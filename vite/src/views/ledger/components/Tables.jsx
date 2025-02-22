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
    const updatedTrades = trades.map((trade) =>
      trade.id === id ? { ...trade, strategy: newStrategy } : trade
    );
    onTradeUpdate(updatedTrades);
  };

  // Update the "Mistakes" value for a specific trade.
  const handleMistakesChange = (id, newMistake) => {
    const updatedTrades = trades.map((trade) =>
      trade.id === id ? { ...trade, mistakes: newMistake } : trade
    );
    onTradeUpdate(updatedTrades);
  };

  // Define the DataGrid columns.
  const columns = [
    {
      field: 'symbol',
      headerName: 'Stock',
      headerAlign: 'left',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Tooltip title={params.value || ''} arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: '#26282B',
              color: '#FFE072',
              fontSize: '0.875rem'
            },
          },
        }}
        >
        <Typography className="cell-text">
          {params.value}
        </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'position',
      headerName: 'Position',
      headerAlign: 'left',
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <Typography className="cell-text">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'avgBuyPrice',
      headerName: 'Entry',
      headerAlign:'left',
      align:'left',
      flex: 0.5,
      minWidth: 120,
      type: 'number',
      // Use optional chaining to avoid errors if row is undefined.
      valueGetter: (params) => params?.row?.avgBuyPrice ?? 0,
      valueFormatter: (params) => {
        const value = params.value;
        return value !== undefined && value !== null
          ? Number(value).toFixed(2)
          : '-';
      },
    },
    {
      field: 'avgSellPrice',
      headerName: 'Exit',
      headerAlign:'left',
      align:'left',
      flex: 0.3,
      minWidth: 60,
      type: 'number',
      valueGetter: (params) => params?.row?.avgSellPrice ?? 0,
      valueFormatter: (params) => {
        const value = params.value;
        return value !== undefined && value !== null
          ? Number(value).toFixed(2)
          : '-';
      },
    },
    {
      field: 'totalQuantity',
      headerName: 'Qty',
      headerAlign: 'center',
      align:'center',
      flex: .8,
      minWidth: 80,
      type: 'number',
    },
    {
      field: 'date',
      headerName: 'Date',
      headerAlign: 'left',
      flex: 0.5,
      minWidth: 130,
      renderCell: (params) => (
        <Typography className="cell-text">
          {convertExcelDateToIST(params.value)}
        </Typography>
      ),
    },
    {
      field: 'result',
      headerName: 'Result',
      hederAlign:'left',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography className="cell-text">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      headerAlign: 'left',
      flex: 1.2,
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
            fontSize: '0.875rem',
          }}
        >
          <MenuItem value="" style={menuItemStyle}>All</MenuItem>
          <MenuItem value="30Day" style={menuItemStyle}>30 Day</MenuItem>
          <MenuItem value="90Day" style={menuItemStyle}>90 Day</MenuItem>
          <MenuItem value="IPO" style={menuItemStyle}>IPO</MenuItem>
          <MenuItem value="BreakoutDaily" style={menuItemStyle}>Breakout Soon Daily</MenuItem>
          <MenuItem value="BreakoutWeekly" style={menuItemStyle}>Breakout Soon Weekly</MenuItem>
          <MenuItem value="RecentBreakout" style={menuItemStyle}>Recent Breakout</MenuItem>
          <MenuItem value="BigPlayers" style={menuItemStyle}>Big Players Money Flow</MenuItem>
        </Select>
      ),
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
            borderRadius: '2px',
          }}
        >
          <MenuItem value="" style={menuItemStyle}>Select</MenuItem>
          <MenuItem value="1" style={menuItemStyle}>1</MenuItem>
          <MenuItem value="2" style={menuItemStyle}>2</MenuItem>
          <MenuItem value="3" style={menuItemStyle}>3</MenuItem>
        </Select>
      ),
    },
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
  }));

  return (
    <Box
      className="ledger-data"
      sx={{
        mt: 0,
        width: '100vw',
        marginLeft: 2,
        '&::-webkit-scrollbar': { display: 'none' },
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#141516',
          color: '#EEEEEE',
          fontSize: '0.875rem',
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: '#141516',
          fontSize: '0.875rem',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        components={{ Toolbar: GridToolbar }}
        hideFooterSelectedRowCount
        sx={{
          backgroundColor: '#26282B',
          color: '#EEEEEE',
          border: 'none',
        }}
      />
    </Box>
  );
};

export default Tables;
