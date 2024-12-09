import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography } from '@mui/material';
import './MarketData.css';

const NintyDayReportTable = ({ updateToken, setSymbolToken, liveMarketData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/service/market-data/');
        if (!response.ok) throw new Error('Failed to fetch market data.');

        const jsonData = await response.json();
        setData(jsonData.data.fetched); // Assuming the fetched data is inside `data.fetched`
      } catch (err) {
        setError('Failed to fetch market data: ' + err.message);
      }
    };

    const fetchReportData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/service/report/90-day-report/');
        if (!response.ok) throw new Error('Failed to fetch 90-day report.');

        const reportResult = await response.json();
        const reportData = reportResult['90_day_report'];

        // Merge market data with report data
        setData((prevData) =>
          prevData.map((item) => {
            const matchingReport = reportData.find((report) => report.symbol === item.tradingSymbol);
            return matchingReport
              ? { ...item, price_rating: matchingReport.price_rating }
              : { ...item, price_rating: null }; // Assign null if no match found
          })
        );
      } catch (err) {
        setError('Failed to fetch 90-day report: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchMarketData();
      await fetchReportData();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (liveMarketData) {
      setData((prevData) =>
        prevData.map((item) =>
          item.tradingSymbol === liveMarketData.tradingSymbol ? { ...item, ...liveMarketData } : item
        )
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

  let filteredData = [...data]; // Create a copy of the data

  const columns = [
    { field: 'tradingSymbol', headerName: 'Symbol', flex: 1 },
    { field: 'ltp', headerName: 'Price', flex: 1, type: 'number' },
    { field: 'netChange', headerName: 'Change', flex: 1, type: 'number' },
    { field: 'tradeVolume', headerName: 'Volume', flex: 1, type: 'number' },
    { field: 'price_rating', headerName: 'Price Rating', flex: 1, align: 'center', headerAlign: 'center' }
  ];

  const rows = filteredData.map((row, index) => ({
    id: index,
    tradingSymbol: row.tradingSymbol,
    ltp: row.ltp,
    netChange: row.netChange,
    tradeVolume: row.tradeVolume,
    price_rating: row.price_rating,
    symbolToken: row.symbolToken
  }));

  return (
    <Box className="market-data" sx={{ mt: 0, width: '100%' }}>
      <Box sx={{ height: '86vh' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onCellClick={handleCellClick}
          components={{ Toolbar: GridToolbar }}
          pagination
          paginationMode="client"
        />
      </Box>
    </Box>
  );
};

export default NintyDayReportTable;
