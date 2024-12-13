import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography } from '@mui/material';
import './MarketData.css';

const WeeklyBreakoutTable = ({ setSymbolToken, updateToken, liveMarketData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReportData = async (retries = 3, delay = 1000) => {
    try {
      const response = await fetch('http://localhost:8000/api/service/breakout/weekly-breakout/');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const result = await response.json();
      const reportData = result['data'];
  
      if (!Array.isArray(reportData)) {
        console.error('Expected reportData to be an array:', reportData);
        setError('Invalid data structure received from the 30-day report API.');
        return;
      }
  
      // Map the fetched report data to the initial table data
      const initialData = reportData.map((item) => ({
        tradingSymbol: item.symbol,
        ltp: item.latest_price || '',
        market_cap: item.market_cap,
        price_rating: item.price_rating,
        netChange: item.pct_change,
        percentChange: null,
        earning_rating: null,
        investo_rating: null,
        symbolToken: item.token,
      }));
      console.log(initialData,"initial data output")
      setData(initialData);
      setError(''); // Clear any previous errors
    } catch (err) {
      if (retries > 0) {
        console.warn(`Retrying... Attempts left: ${retries}`);
        setTimeout(() => fetchReportData(retries - 1, delay), delay);
      } else {
        console.error('Failed to fetch report data after retries:', err);
        setError('Failed to fetch report data after multiple attempts.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchReportData();
  }, []);


  // useEffect(() => {
  //   if(liveMarketData) {
  //     console.log(liveMarketData, "test");
  //     setData(liveMarketData);
  //   }
  // },[liveMarketData]);
  // useEffect(() => {
  //   if (liveMarketData) {
  //     console.log(liveMarketData, "test");
  //     setData((prevData) =>
  //       prevData.map((item) =>
  //         item.tradingSymbol === liveMarketData.tradingSymbol
  //           ? { ...item, ...liveMarketData }
  //           : item
  //       )
  //     );
  //   }
  // }, [liveMarketData]);
  useEffect(() => {
    if (Array.isArray(liveMarketData) && liveMarketData.length > 0) {
      setData((prevData) =>
        prevData.map((item) => {
          // Find matching live market data for the current item
          const liveData = liveMarketData.find(
            (liveItem) => liveItem.tradingSymbol === item.tradingSymbol
          );
  
          // If a match is found and ltp exists, update the item
          return liveData && liveData.ltp
            ? { ...item, ltp: liveData.ltp }
            : item;
        })
      );
    }
  }, [liveMarketData]);
  
  

  const handleCellClick = (params) => {
    setSymbolToken(params.row.symbolToken);
    if (params.field === 'tradingSymbol') {
      updateToken(params.row.symbolToken);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" height="18vh" justifyContent="center">
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

  const columns = [
    { 
      field: 'tradingSymbol', 
      headerName: 'Symbol', 
      flex: 1 
    },
    {
      field: 'ltp',
      headerName: 'Price',
      // alignContent: 'center',
      headerAlign: 'center',
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
      field: 'netChange',
      headerName: 'Change',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box
          height="100%"
          color={params.value > 0 ? '#00EFC8' : params.value < 0 ? '#FF5966' : '#EEEEEE'}
        >
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'market_cap', 
      headerName: 'Market Cap',
      flex: 1, 
      type: 'number' 
    },
    { 
      field: 'price_rating',
      headerName: 'Price Rating', 
      flex: 1, 
      type: 'number',
      alignContent: 'center' 
    },
    {
      field: 'earning_rating',
      headerName: 'Earning Rating',
      flex: 1,
      type: 'number',
      align: 'center',
    },
    {
      field: 'investo_rating',
      headerName: 'Investo Rating',
      flex: 1,
      type: 'number',
      align: 'center',
    },
  ];

  const rows = data.map((row, index) => ({
    id: index,
    tradingSymbol: row.tradingSymbol,
    ltp: row.ltp,
    netChange: row.netChange,
    market_cap: row.market_cap,
    price_rating: row.price_rating,
    earning_rating: row.earning_rating,
    investo_rating: row.investo_rating,
    symbolToken: row.symbolToken,
  }));

  return (
    <Box
      className="market-data"
      sx={{
        mt: 0,
        width: '100%',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Box sx={{ height: '86vh', width: '90vw' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onCellClick={handleCellClick}
          components={{ Toolbar: GridToolbar }}
          pagination
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default WeeklyBreakoutTable;
