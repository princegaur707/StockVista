import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

const Fundamental = ({ token }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState(token); // Set initial token
  const [stocks] = useState([
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

  // Fetch fundamental data when the selected stock changes
  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        // Construct the symbol based on selectedStock
        const stockSymbol = stocks
          .find((stock) => stock.token === selectedStock)
          ?.name.replace("-EQ", ".NS");
        if (!stockSymbol) throw new Error("Invalid stock selected");

        const response = await fetch(
          `http://localhost:8000/fundamental-data/?symbol=${stockSymbol}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const stockData = await response.json(); // Assuming stockData is a single object containing metrics

        // Format the fetched data for the DataGrid
        const formattedRows = Object.keys(stockData).map((key, index) => ({
          id: index + 1, // Add an id for each row (required for DataGrid)
          metric: key,
          value: stockData[key] !== null ? stockData[key] : "N/A",
        }));

        setRows(formattedRows);
      } catch (error) {
        setError("Failed to fetch data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedStock]); // Re-fetch when selected stock changes

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value); // Update selected stock
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

  if (rows.length === 0) {
    return <Typography align="center">No Data Available</Typography>;
  }

  // Define columns for DataGrid
  const columns = [
    { field: "metric", headerName: "Metric", flex: 1 }, // Match the keys in formattedRows
    { field: "value", headerName: "Value", flex: 1 }, // Match the keys in formattedRows
  ];

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

      {/* DataGrid for displaying fundamental data */}
      <Box sx={{ height: "64vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          components={{ Toolbar: GridToolbar }} // Corrected to match the MUI v5 structure
        />
      </Box>
    </Box>
  );
};

export default Fundamental;
