import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import './MarketData.css';

const ThirtyDayReport = ({ updateToken, setSymbolToken, liveMarketData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from the 30-day report API
  useEffect(() => {
    const fetchThirtyDayData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/service/report/30-day-report/");
        if (!response.ok) {
          throw new Error("Failed to fetch 30-day report data.");
        }
        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData); // Log the data structure
        if (jsonData["30_day_report"] && Array.isArray(jsonData["30_day_report"])) {
          setData(jsonData["30_day_report"]);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThirtyDayData();
  }, []);

  // Update LTP and Change in real-time using WebSocket data
  useEffect(() => {
    if (liveMarketData) {
      setData(liveMarketData);
      console.log(liveMarketData, 'live');
      // Find the stock in the existing data and update it
      // setData((prevData) => prevData.map((stock) => (stock.Symbol === liveMarketData.Symbol ? { ...stock, ...liveMarketData } : stock)));
    }
  }, [liveMarketData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
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

  if (!Array.isArray(data) || data.length === 0) {
    return <Typography align="center">No Data Available</Typography>;
  }

  const columns = [
    { field: "symbol", headerName: "Symbol", flex: 1 },
    { field: "ltp", headerName: "Price", flex: 1, type: "number" }, // LTP Column
    { field: "percent_change", headerName: "Change", flex: 1, type: "number" },
    { field: "price_rating", headerName: "Price Rating", flex: 1, type: "number" },
    // { field: "token", headerName: "Token", flex: 1 },
  ];

  const rows = data.map((row, index) => ({
    id: index,
    symbol: row.symbol,
    ltp: row.LTP,
    //  !== null && row.LTP !== undefined ? row.LTP.toFixed(2) : "N/A", // Check for valid LTP
    percent_change: row.percent_change.toFixed(2), // Format to 2 decimal places
    price_rating: row.price_rating,
    // token: row.token,
  }));

  return (
    <Box className="market-data" sx={{ height: "86vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        components={{ Toolbar: GridToolbar }}
      />
    </Box>
  );
};

export default ThirtyDayReport;
