import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

const HistoricalDataTable = ({ token }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState(token); // Default selected stock
  const [stocks, setStocks] = useState([
    { name: "BPCL-EQ", token: "526" },
    { name: "CIPLA-EQ", token: "694" },
    { name: "SUNPHARMA-EQ", token: "3351" },
    { name: "DIVISLAB-EQ", token: "10940" },
    { name: "RELIANCE-EQ", token: "2885" },
    { name: "TITAN-EQ", token: "3506" },
    { name: "HCLTECH-EQ", token: "7229" },
    { name: "EICHERMOT-EQ", token: "910" },
    { name: "HINDALCO-EQ", token: "1363" },
    { name: "GRASIM-EQ", token: "1232" },
    { name: "NTPC-EQ", token: "11630" },
    { name: "COALINDIA-EQ", token: "20374" },
    { name: "APOLLOHOSP-EQ", token: "157" },
    { name: "BAJAJFINSV-EQ", token: "16675" },
    { name: "ASIANPAINT-EQ", token: "236" },
    { name: "INDUSINDBK-EQ", token: "5258" },
    { name: "MARUTI-EQ", token: "10999" },
    { name: "ADANIENT-EQ", token: "25" },
    { name: "HDFCLIFE-EQ", token: "467" },
    { name: "INFY-EQ", token: "1594" },
    { name: "TATASTEEL-EQ", token: "3499" },
    { name: "TCS-EQ", token: "11536" },
    { name: "M&M-EQ", token: "2031" },
    { name: "BAJAJ-AUTO-EQ", token: "16669" },
    { name: "ONGC-EQ", token: "2475" },
    { name: "BRITANNIA-EQ", token: "547" },
    { name: "SBIN-EQ", token: "3045" },
    { name: "WIPRO-EQ", token: "3787" },
    { name: "DRREDDY-EQ", token: "881" },
    { name: "TECHM-EQ", token: "13538" },
    { name: "SHRIRAMFIN-EQ", token: "4306" },
    { name: "AXISBANK-EQ", token: "5900" },
    { name: "ITC-EQ", token: "1660" },
    { name: "LTIM-EQ", token: "17818" },
    { name: "BAJFINANCE-EQ", token: "317" },
    { name: "SBILIFE-EQ", token: "21808" },
    { name: "TATAMOTORS-EQ", token: "3456" },
    { name: "JSWSTEEL-EQ", token: "11723" },
    { name: "NESTLEIND-EQ", token: "17963" },
    { name: "HINDUNILVR-EQ", token: "1394" },
    { name: "TATACONSUM-EQ", token: "3432" },
    { name: "ULTRACEMCO-EQ", token: "11532" },
    { name: "ADANIPORTS-EQ", token: "15083" },
    { name: "KOTAKBANK-EQ", token: "1922" },
    { name: "LT-EQ", token: "11483" },
    { name: "HEROMOTOCO-EQ", token: "1348" },
    { name: "ICICIBANK-EQ", token: "4963" },
    { name: "HDFCBANK-EQ", token: "1333" },
    { name: "BHARTIARTL-EQ", token: "10604" },
    { name: "POWERGRID-EQ", token: "14977" },
  ]); // Stocks fetched from the API
  const [searchTerm, setSearchTerm] = useState(""); // For searching stocks

  // useEffect(() => {
  //   const fetchStockData = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json"
  //       );
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const stockData = await response.json();
  //       setStocks(stockData.slice(0, 400)); // Store the fetched stocks
  //     } catch (err) {
  //       setError("Failed to fetch stocks: " + err.message);
  //     }
  //   };

  //   fetchStockData();
  // }, []);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/historical-data/?exchange=${"NSE"}&token=${selectedStock}&timeperiod=ONE_DAY`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [selectedStock]); // Refetch data when selectedStock changes

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
    setLoading(true); // Show loader when stock changes
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "18vh",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </div>
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

  // Helper function to determine color
  const getColor = (value, previousClose) => {
    if (value == null) return "black"; // Default color for null
    return value > previousClose
      ? "green"
      : value < previousClose
      ? "red"
      : "black"; // Green if higher, red if lower
  };

  // Define columns for DataGrid
  const columns = [
    { field: "Date", headerName: "Date", flex: 1 },
    {
      field: "Open",
      headerName: "Open",
      flex: 1,
      type: "number",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: getColor(params.value, params.row.PTD_Close), // Compare with previous close
          }}
        >
          {params.value != null ? params.value.toFixed(2) : "N/A"}
        </Box>
      ),
    },
    {
      field: "High",
      headerName: "High",
      flex: 1,
      type: "number",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: getColor(params.value, params.row.PTD_Close),
          }}
        >
          {params.value != null ? params.value.toFixed(2) : "N/A"}
        </Box>
      ),
    },
    {
      field: "Low",
      headerName: "Low",
      flex: 1,
      type: "number",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: getColor(params.value, params.row.PTD_Close),
          }}
        >
          {params.value != null ? params.value.toFixed(2) : "N/A"}
        </Box>
      ),
    },
    {
      field: "Close",
      headerName: "Close",
      flex: 1,
      type: "number",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: getColor(params.value, params.row.PTD_Close),
          }}
        >
          {params.value != null ? params.value.toFixed(2) : "N/A"}
        </Box>
      ),
    },
    { field: "Volume", headerName: "Volume", flex: 1, type: "number" },
    {
      field: "PTD_Close",
      headerName: "Previous Close",
      flex: 1,
      type: "number",
    }, // Display PTD_Close as "Previous Close"
    {
      field: "Change",
      headerName: "Change %",
      flex: 1,
      type: "number",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color:
              params.value > 0 ? "green" : params.value < 0 ? "red" : "black",
          }}
        >
          {params.value != null ? `${params.value.toFixed(2)}%` : "N/A"}
        </Box>
      ),
    },
  ];

  // Rows data for DataGrid
  const rows = data.map((row, index) => ({
    id: index,
    Date: row.Date,
    Open: row.Open,
    High: row.High,
    Low: row.Low,
    Close: row.Close,
    Volume: row.Volume,
    PTD_Close: row.PTD_Close,
    Change: row.Change, // Map Change % value
  }));

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Dropdown for selecting stock */}
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <Select value={selectedStock} onChange={handleStockChange}>
          {stocks.map((stock, index) => (
            <MenuItem key={index} value={stock.token}>
              {stock.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* DataGrid for displaying historical data */}
      <Box sx={{ height: "64vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            sorting: {
              sortModel: [{ field: "Date", sort: "desc" }],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default HistoricalDataTable;
