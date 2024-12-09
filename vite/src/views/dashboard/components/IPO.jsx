import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography, CssBaseline } from '@mui/material';
import './MarketData.css';
import { IconBackground } from '@tabler/icons-react';

const IPODataTable = ({ updateToken, displayTopGainers, displayTopLosers, setSymbolToken, liveMarketData }) => {
  console.log(liveMarketData, 'bro');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/service/market-data/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData.data.fetched); // Assuming the fetched data is inside `data.fetched`
      } catch (err) {
        setError('Failed to fetch market data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  useEffect(() => {
    if (liveMarketData) {
      setData(liveMarketData);
      console.log(liveMarketData, 'live');
      // Find the stock in the existing data and update it
      // setData((prevData) => prevData.map((stock) => (stock.Symbol === liveMarketData.Symbol ? { ...stock, ...liveMarketData } : stock)));
    }
  }, [liveMarketData]);

  const handleCellClick = (params) => {
    // console.log('param', params.row.symbolToken);
    setSymbolToken(params.row.symbolToken);
    if (params.field === 'tradingSymbol') {
      updateToken(params.row.symbolToken);
    }
  };

  if (loading) {
    return (
      <Box style={{ alignSelf: 'center' }} display="flex" flexDirection="column" alignItems="center" height="18vh" justifyContent="center">
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

  if (data.length === 0) {
    return <Typography align="center">No Data Available</Typography>;
  }

  // Filter data based on the props
  let filteredData = [...data]; // Create a copy of the data

  if (displayTopGainers) {
    filteredData.sort((a, b) => b.percentChange - a.percentChange); // Sort by largest change %
    filteredData = filteredData.slice(0, 20); // Get top 20
  }

  if (displayTopLosers) {
    filteredData.sort((a, b) => a.percentChange - b.percentChange); // Sort by smallest change %
    filteredData = filteredData.slice(0, 20); // Get bottom 20
  }

  const columns = [
    { field: 'tradingSymbol', headerName: 'Name', headerClassName: 'header-name', flex: 1 },
    {
      field: 'ltp',
      headerName: 'LTP',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography align="center">{params?.value}</Typography>
        </Box>
      )
    },
    {
      field: 'percentChange',
      headerName: 'Change %',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          color={params.value > 0 ? '#00EFC8' : params.value < 0 ? '#FF5966' : '#EEEEEE'}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'netChange',
      headerName: 'Change',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          color={params.value > 0 ? '#00EFC8' : params.value < 0 ? '#FF5966' : '#EEEEEE'}
        >
          {params.value}
        </Box>
      )
    },
    { field: 'tradeVolume', headerName: 'Volume', headerClassName: 'header-name', type: 'number', flex: 1 },
    {
      field: 'buyPrice',
      headerName: 'Buy Price',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%" color="#00EFC8">
          {params.value}
        </Box>
      )
    },
    {
      field: 'sellPrice',
      headerName: 'Sell Price',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%" color="#FF5966">
          {params.value}
        </Box>
      )
    },
    { field: 'buyQty', headerName: 'Buy Quantity', headerClassName: 'header-name', type: 'number', flex: 1 },

    {
      field: 'sellQty',
      headerName: 'Sell Quantity',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%" color="#FF5966">
          {params.value}
        </Box>
      )
    }
  ];

  const rows = filteredData.map((row, index) => ({
    id: index,
    tradingSymbol: row.tradingSymbol,
    ltp: row.ltp,
    percentChange: row.percentChange,
    netChange: row.netChange,
    tradeVolume: row.tradeVolume,
    buyPrice: row.depth.buy[0]?.price || 0,
    sellPrice: row.depth.sell[0]?.price || 0,
    buyQty: row.depth.buy[0]?.quantity || 0,
    sellQty: row.depth.sell[0]?.quantity || 0,
    symbolToken: row.symbolToken
  }));

  return (
    <Box className="market-data" sx={{ mt: 0, width: '100vw'}}>
      {/* <CssBaseline /> */}
      <Box sx={{ height: '86vh'}}>
      {/* <Box className="scrollable" style={{ height: '100vh', overflowY:'auto', marginRight: '25px'}}> */}
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]} // Set the rows per page options
          onCellClick={handleCellClick}
          components={{ Toolbar: GridToolbar }} // Updated for newer versions of MUI
          pagination
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10
              }
            }
          }}
          pageSizeOptions={[10]}
          paginationMode="client" // This enables client-side pagination
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default IPODataTable;
