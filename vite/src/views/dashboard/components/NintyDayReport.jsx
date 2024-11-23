import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography } from '@mui/material';
import './MarketData.css';

const NintyDayReportTable = ({ updateToken, displayTopGainers, displayTopLosers, setSymbolToken, liveMarketData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReportData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/service/report/90-day-report/');
      if (!response.ok) throw new Error('Failed to fetch report data.');

      const result = await response.json();
      const reportData = result['90_day_report'];

      setData((prevData) =>
        prevData.map((item) => {
          const matchingReport = reportData.find((report) => report.symbol === item.tradingSymbol);
          return matchingReport ? { ...item, price_rating: matchingReport.price_rating } : { ...item, price_rating: null }; // Assign null if no match found
        })
      );
    } catch (err) {
      console.error('Error fetching report data:', err);
    }
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/service/market-data/');
        if (!response.ok) throw new Error('Failed to fetch market data.');

        const jsonData = await response.json();
        setData(jsonData.data.fetched); // Assuming the fetched data is inside `data.fetched`
      } catch (err) {
        setError('Failed to fetch market data: ' + err.message);
      } finally {
        setLoading(false);
        setTimeout(() => {
          fetchReportData();
        }, 1000);
      }
    };

    fetchMarketData();
  }, []);

  useEffect(() => {
    if (liveMarketData) {
      setData((prevData) =>
        prevData.map((item) => (item.tradingSymbol === liveMarketData.tradingSymbol ? { ...item, ...liveMarketData } : item))
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

  // Filter data based on props
  let filteredData = [...data]; // Create a copy of the data

  if (displayTopGainers) {
    filteredData.sort((a, b) => b.percentChange - a.percentChange); // Sort by largest change %
    filteredData = filteredData.slice(0, 50); // Get top 20
  }

  if (displayTopLosers) {
    filteredData.sort((a, b) => a.percentChange - b.percentChange); // Sort by smallest change %
    filteredData = filteredData.slice(0, 50);
  }

  const columns = [
    { field: 'tradingSymbol', headerName: 'Symbol', headerClassName: 'header-name', flex: 1 },
    { field: 'ltp', headerName: 'Price', headerClassName: 'header-name', flex: 1, type: 'number' },
    {
      field: 'netChange',
      headerName: 'Change',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box
          // display="flex"
          // alignItems="center"
          // justifyContent="center"
          height="100%"
          color={params.value > 0 ? '#00EFC8' : params.value < 0 ? '#FF5966' : '#EEEEEE'}
        >
          {params.value}
        </Box>
      )
    },
    { field: 'market_cap', headerName: 'Market Cap', headerClassName: 'header-name', flex: 1, type: 'number' },
    {
      field: 'price_rating',
      headerName: 'Price Rating',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'earning_rating',
      headerName: 'Earning Rating',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'investo_rating',
      headerName: 'Investo Rating',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      align: 'center',
      headerAlign: 'center'
    }
  ];

  const rows = filteredData.map((row, index) => ({
    id: index,
    tradingSymbol: row.tradingSymbol,
    ltp: row.ltp,
    percentChange: row.percentChange,
    netChange: row.netChange,
    tradeVolume: row.tradeVolume,
    price_rating: row.price_rating,
    symbolToken: row.symbolToken
  }));

  return (
    <Box className="market-data" 
        sx={{ mt: 0,
         width: '100%',
         scrollbarWidth: 'none', // Firefox: hides scrollbar but still allows scrolling
        msOverflowStyle: 'none', // IE/Edge: hides scrollbar
        '&::-webkit-scrollbar': {
          display: 'none', 
        }
      }}
      >
      <Box sx={{ height: '86vh',width:'90vw' }}>
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
                pageSize: 10
              }
            }
          }}
          paginationMode="client"
        />
      </Box>
    </Box>
  );
};

export default NintyDayReportTable;
