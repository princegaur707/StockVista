// Tables.jsx
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Select, MenuItem, Tooltip } from '@mui/material';
import './LedgerTable.css';

const menuItemStyle = { fontSize: '0.875rem', color: '#FFFFFF' };

const Tables = ({ trades, onTradeUpdate }) => {
  const convertDateToIST = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const handleStrategyChange = (id, newStrategy) => {
    const updatedTrade = trades.find(trade => trade.id === id);
    if (!updatedTrade) return;
  
    const updatedRow = { ...updatedTrade, strategy: newStrategy };
    onTradeUpdate(updatedRow); // Send only the changed row
  };
  

  const handleMistakeChange = (id, newMistake) => {
    const updatedTrade = trades.find(trade => trade.id === id);
    if (!updatedTrade) return;
  
    const updatedRow = { ...updatedTrade, mistakes: newMistake };
    onTradeUpdate(updatedRow); // Again, just the row
  };
  

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
          <Typography className="cell-text" style={{ color: '#FFE072', fontFamily: 'figtree' }}>
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
      renderCell: (params) => {
        const borderColor = params.value === 'SHORT' ? '#04b5d4' : '#6348c7';
        return (
          <Typography
            className="cell-text"
            style={{
              display: 'inline-block',
              border: `2px solid ${borderColor}`,
              padding: '4px 8px',
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
      flex: 0.5,
      minWidth: 60,
      type: 'number',
      renderCell: (params) => <Typography className="cell-text">{parseFloat(params.value).toFixed(2)}</Typography>
    },
    {
      field: 'avgSellPrice',
      headerName: 'Sell',
      headerAlign: 'left',
      align: 'left',
      flex: 0.5,
      minWidth: 60,
      type: 'number',
      renderCell: (params) => <Typography className="cell-text">{parseFloat(params.value).toFixed(2)}</Typography>
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'left',
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => {
        const color = params.value === 'CLOSE' ? '#b59ef3' : '#04b5d4';
        return (
          <Typography
            className="cell-text"
            style={{
              display: 'inline-block',
              padding: '4px 8px',
              color: '#FFFFFF',
              border: `2px solid ${color}`,
              borderRadius: '4px',
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
      renderCell: (params) => <Typography className="cell-text">{convertDateToIST(params.value)}</Typography>
    },
    {
      field: 'result',
      headerName: 'Result',
      headerAlign: 'left',
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        const value = parseFloat(params.value).toFixed(2);
        const isPositive = parseFloat(params.value) >= 0;
        const color = isPositive ? '#00EFC8' : '#FF5966';
        return (
          <Typography
            className="cell-text"
            style={{
              color: '#FFFFFF',
              backgroundColor: color,
              border: `2px solid ${color}`,
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            {value}
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
          disabled={params.row.status === 'OPEN'}
          size="small"
          sx={{ backgroundColor: '#1d1e20', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.875rem' }}
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
          onChange={(e) => handleMistakeChange(params.id, e.target.value)}
          fullWidth
          disabled={params.row.status === 'OPEN'}
          size="small"
          sx={{ backgroundColor: '#1d1e20', color: '#EEEEEE', borderRadius: '2px' }}
        >
          <MenuItem value="" style={menuItemStyle}>
            Select
          </MenuItem>
          <MenuItem value="ChasingLoses" style={menuItemStyle}>
          Chasing Loses
          </MenuItem>
          <MenuItem value="RiskNeglect" style={menuItemStyle}>
          Risk Neglect
          </MenuItem>
          <MenuItem value="EmotionalTrading" style={menuItemStyle}>
            EmotionalTrading
          </MenuItem>
        </Select>
      )
    }
  ];

  const rows = Array.isArray(trades)
    ? trades
        .map((trade) => ({
          id: trade.id,
          symbol: trade.symbol || '',
          position: trade.position || '',
          avgBuyPrice: trade.avgBuyPrice ?? 0,
          avgSellPrice: trade.avgSellPrice ?? 0,
          totalQuantity: trade.totalQuantity ?? 0,
          date: trade.date || '',
          result: trade.result ?? trade.profitLoss ?? 0,
          strategy: trade.strategy || '',
          mistakes: trade.mistakes || '',
          status: trade.status || ''
        }))
        .sort((a, b) => {
          const dateA = Date.parse(a.date) || 0;
          const dateB = Date.parse(b.date) || 0;
          return dateB - dateA;
        })
    : [];

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
        disableSelectionOnClick
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
