import React, { useEffect, useState, useRef } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, IconButton, TextField, CircularProgress, Typography, Popover } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './FullScreenTable.css';
import HoverChart from './HoverChart';

const ThirtyDayReportTable = ({ setSymbolToken, updateToken, liveMarketData }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredSymbol, setHoveredSymbol] = useState(null);
  const [isHoveringPopover, setIsHoveringPopover] = useState(false);
  const timeoutRef = useRef(null);

  const fetchReportData = async (retries = 3, delay = 1000) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service/report/30-day-report/`);
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
        tradingSymbol: item.symbol.replace('.NS', ''),
        ltp: item.latest_price || '',
        market_cap: item.market_cap,
        change: item.change,
        pct_change: item.pct_change,
        price_rating: item.price_rating,
        earning_rating: item.earning_rating,
        investo_rating: item.investo_rating,
        symbolToken: item.token
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
    if (searchValue.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) =>
        row.tradingSymbol.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // We now attach the mouse events to the Typography element so the anchor is just the symbol text.
  const handleMouseEnter = (event, symbol) => {
    setAnchorEl(event.currentTarget);
    setHoveredSymbol(symbol);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringPopover) {
        setAnchorEl(null);
        setHoveredSymbol(null);
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Number formatter remains unchanged.
  const formatMarketValue = (value) => {
    if (value == null) return 'N/A';
    if (value >= 1_000_000_0) {
      value = value / 10000000;
      return `${parseFloat(value.toFixed(2)).toLocaleString('en-IN')} Cr`;
    }
    if (value >= 1_000_000) {
      value = value / 100000;
      return `${parseFloat(value.toFixed(2)).toLocaleString('en-IN')} L`;
    }
    return value.toFixed(2).toString();
  };

  const handleSearchIconClick = (event) => {
    event.stopPropagation();
    setIsSearchActive(true);
  };

  const handleSearchClose = (event) => {
    event.stopPropagation();
    setIsSearchActive(false);
    setSearchText('');
    setFilteredData(data);
  };

  function standardizeSymbol(symbol) {
    return symbol.replace(/-EQ$/, '').replace('.NS', '').toUpperCase();
  }

  useEffect(() => {
    if (Array.isArray(liveMarketData) && liveMarketData.length > 0) {
      setData((prevData) =>
        prevData.map((item) => {
          const liveData = liveMarketData.find(
            (liveItem) =>
              standardizeSymbol(liveItem.tradingSymbol) === standardizeSymbol(item.tradingSymbol)
          );
          return liveData && liveData.ltp ? { ...item, ltp: liveData.ltp } : item;
        })
      );
    }
  }, [liveMarketData]);

  const handleCellClick = (params) => {
    setSymbolToken(params.row.tradingSymbol);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 150,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <CircularProgress sx={{ color: '#FFC42B' }} />
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
      flex: 1.3,
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
                  borderRadius: '1px',
                  padding: '1px'
                },
                endAdornment: (
                  <IconButton onClick={handleSearchClose} sx={{ '&:focus': { outline: 'none' } }}>
                    <CloseIcon style={{ color: '#EEEEEE' }} />
                  </IconButton>
                )
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused': { outline: 'none', borderColor: 'transparent' },
                  '& fieldset': { borderColor: 'red' }
                }
              }}
            />
          ) : (
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleSearchIconClick}>
                <SearchIcon style={{ color: '#EEEEEE', marginRight: '12px' }} />
              </IconButton>
              <Typography variant="body1" style={{ color: '#EEEEEE' }}>
                Symbol
              </Typography>
            </Box>
          )}
        </Box>
      ),
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%" mt={0.2} sx={{ cursor: 'pointer' }}>
          <svg width="46" height="28" viewBox="0 0 46 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="46" height="28" fill="#26282B" />
            <path
              d="M12.438 19.168C11.8967 19.168 11.416 19.112 10.996 19C10.576 18.8787 10.212 18.7153 9.904 18.51C9.596 18.2953 9.344 18.062 9.148 17.81C8.952 17.5487 8.80733 17.2733 8.714 16.984L9.848 16.592C9.988 17.0027 10.268 17.362 10.688 17.67C11.1173 17.9687 11.64 18.118 12.256 18.118C13.012 18.118 13.6047 17.9687 14.034 17.67C14.4633 17.3713 14.678 16.9747 14.678 16.48C14.678 16.0227 14.4867 15.654 14.104 15.374C13.7213 15.0847 13.2173 14.8607 12.592 14.702L11.514 14.422C11.0753 14.31 10.6693 14.1467 10.296 13.932C9.932 13.708 9.638 13.428 9.414 13.092C9.19933 12.7467 9.092 12.336 9.092 11.86C9.092 10.9733 9.37667 10.2827 9.946 9.788C10.5247 9.284 11.3553 9.032 12.438 9.032C13.082 9.032 13.6373 9.13933 14.104 9.354C14.5707 9.55933 14.9487 9.82533 15.238 10.152C15.5367 10.4693 15.7467 10.8147 15.868 11.188L14.748 11.58C14.5707 11.1133 14.272 10.7493 13.852 10.488C13.432 10.2173 12.9233 10.082 12.326 10.082C11.7007 10.082 11.2013 10.236 10.828 10.544C10.464 10.8427 10.282 11.2533 10.282 11.776C10.282 12.224 10.4267 12.5693 10.716 12.812C11.0053 13.0453 11.3833 13.218 11.85 13.33L12.928 13.596C13.88 13.82 14.608 14.1933 15.112 14.716C15.6253 15.2293 15.882 15.7847 15.882 16.382C15.882 16.8953 15.7513 17.3667 15.49 17.796C15.2287 18.216 14.8413 18.552 14.328 18.804C13.824 19.0467 13.194 19.168 12.438 19.168Z
              M17.9016 19V9.2H19.1056L24.9436 17.068V9.2H26.1336V19H24.9436L19.0916 11.09V19H17.9016Z
              M35.4774 19V9.2H36.6534V19H35.4774ZM28.7434 19V9.2H29.9334V19H28.7434ZM29.7934 14.492V13.414H35.7294V14.492H29.7934Z"
              fill="#EEEEEE"
            />
          </svg>
          <Typography
            ml={1}
            onMouseEnter={(e) => handleMouseEnter(e, params.value)}
            onMouseLeave={handleMouseLeave}
          >
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'ltp',
      headerName: 'Price',
      headerAlign: 'left',
      headerClassName: 'header-name',
      flex: 1,
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography align="center">{params?.value}</Typography>
        </Box>
      )
    },
    {
      field: 'change',
      headerName: 'Change',
      flex: 1.2,
      headerAlign: 'left',
      type: 'number',
      renderCell: (params) => {
        const change = params.row.change;
        const pct_change = params.row.pct_change;
        if (change == null || pct_change == null) {
          return (
            <Typography align="left" color="error">
              N/A
            </Typography>
          );
        }
        const changeColor = change > 0 ? '#00EFC8' : change < 0 ? '#FF5966' : '#EEEEEE';
        const pctChangeColor = pct_change > 0 ? '#00EFC8' : pct_change < 0 ? '#FF5966' : '#EEEEEE';
        return (
          <Box display="flex" alignItems="center" height="100%">
            <Typography align="left" sx={{ color: changeColor }}>
              {change.toFixed(2)}
            </Typography>
            <Typography sx={{ color: pctChangeColor }}>
              ({pct_change.toFixed(2)}%)
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'market_cap',
      headerName: 'Market Cap',
      flex: 1.3,
      headerAlign: 'left',
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography align="left">{formatMarketValue(params.value)}</Typography>
        </Box>
      )
    },
    {
      field: 'price_rating',
      headerName: 'Price Rating',
      flex: 0.8,
      headerAlign: 'left',
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography align="center">{params?.value ? params.value.toFixed(2) : 'N/A'}</Typography>
        </Box>
      )
    },
    {
      field: 'earning_rating',
      headerName: 'Earning Rating',
      flex: 0.8,
      headerAlign: 'left',
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography align="center">{params?.value ? params.value.toFixed(2) : 'N/A'}</Typography>
        </Box>
      )
    },
    {
      field: 'investo_rating',
      headerName: 'Investo Rating',
      flex: 0.8,
      headerAlign: 'left',
      type: 'number',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography align="center">{params?.value ? params.value.toFixed(2) : 'N/A'}</Typography>
        </Box>
      )
    }
  ];

  const rows = (filteredData.length > 0 ? filteredData : data).map((row, index) => ({
    id: index,
    tradingSymbol: row.tradingSymbol,
    ltp: row.ltp,
    change: row.change,
    pct_change: row.pct_change,
    market_cap: row.market_cap,
    price_rating: row.price_rating,
    earning_rating: row.earning_rating,
    investo_rating: row.investo_rating
  }));

  return (
    <Box
      className="market-data"
      sx={{
        mt: 0,
        width: '100%',
        '&::-webkit-scrollbar': { display: 'none' }
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
          hideFooterSelectedRowCount
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'price_rating', sort: 'desc' }] }
          }}
        />
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        disableRestoreFocus
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          style: {
            width: '400px',
            height: '400px',
            scrollbarWidth:'0px',
            backgroundColor: '#141516',
            boxShadow: 'none',
            border: '0px solid #FFE072'
          }
        }}
      >
        {hoveredSymbol && (
          <Box
            onMouseEnter={() => {
              setIsHoveringPopover(true);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }}
            onMouseLeave={() => {
              setIsHoveringPopover(false);
              timeoutRef.current = setTimeout(() => {
                setAnchorEl(null);
              }, 300);
            }}
          >
            <HoverChart token={hoveredSymbol} />
          </Box>
        )}
      </Popover>
    </Box>
  );
};

export default ThirtyDayReportTable;
