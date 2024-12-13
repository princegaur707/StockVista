import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import './MarketData.css';

const IPOTable = ({ setSymbolToken, updateToken, liveMarketData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fetchReportData = async (retries = 3, delay = 1000) => {
    try {
      const response = await fetch('http://localhost:8000/api/service/report/30-day-report/');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      const reportData = result['data'];

      if (!Array.isArray(reportData)) {
        console.error('Expected reportData to be an array:', reportData);
        setError('Invalid data structure received from the 30-day report API.');
        return;
      }

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
      setData(initialData);
      setError('');
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

  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    setData((prevData) =>
      prevData.filter((row) =>
        row.tradingSymbol.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const handleSearchIconClick = () => {
    setIsSearchActive(true);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    setSearchText('');
    fetchReportData(); // Reset data
  };

  const columns = [
    {
      field: 'tradingSymbol',
      headerName: 'Symbol',
      flex: 1,
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          {isSearchActive ? (
            <TextField
              autoFocus
              placeholder="Search..."
              variant="outlined"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                style: {
                  backgroundColor: '#1d1e20',
                  color: '#EEEEEE',
                  borderRadius: '4px',
                  padding: '5px 10px',
                },
                endAdornment: (
                  <IconButton onClick={handleSearchClose}>
                    <CloseIcon style={{ color: '#EEEEEE' }} />
                  </IconButton>
                ),
              }}
              fullWidth
            />
          ) : (
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleSearchIconClick}>
                <SearchIcon style={{ color: '#EEEEEE', marginRight: '8px' }} />
              </IconButton>
              <Typography variant="body1" style={{ color: '#EEEEEE' }}>
                Symbol
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      field: 'ltp',
      headerName: 'Price',
      flex: 1,
      type: 'number',
    },
    {
      field: 'netChange',
      headerName: 'Change',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box color={params.value > 0 ? '#00EFC8' : params.value < 0 ? '#FF5966' : '#EEEEEE'}>
          {params.value}
        </Box>
      ),
    },
    { field: 'market_cap', headerName: 'Market Cap', flex: 1, type: 'number' },
    { field: 'price_rating', headerName: 'Price Rating', flex: 1, type: 'number' },
    { field: 'earning_rating', headerName: 'Earning Rating', flex: 1, type: 'number' },
    { field: 'investo_rating', headerName: 'Investo Rating', flex: 1, type: 'number' },
  ];

  const rows = data.map((row, index) => ({ id: index, ...row }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="18vh">
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

  return (
    <Box sx={{ mt: 0, width: '100%' }}>
      <Box sx={{ height: '86vh', width: '90vw' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onCellClick={(params) => {
            setSymbolToken(params.row.symbolToken);
            if (params.field === 'tradingSymbol') {
              updateToken(params.row.symbolToken);
            }
          }}
          components={{ Toolbar: GridToolbar }}
          pagination
        />
      </Box>
    </Box>
  );
};

export default IPOTable;
