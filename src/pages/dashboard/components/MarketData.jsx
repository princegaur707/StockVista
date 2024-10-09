import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";

const MarketDataTable = ({ updateToken }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("http://localhost:8000/market-data/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData.data.fetched); // Assuming the fetched data is inside `data.fetched`
      } catch (err) {
        setError("Failed to fetch market data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const handleCellClick = (params) => {
    // Check if the clicked cell is in the first column (tradingSymbol)
    if (params.field === "tradingSymbol") {
      updateToken(params.row.symbolToken);
    }
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

  // Define columns for DataGrid
  const columns = [
    {
      field: "tradingSymbol",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "ltp",
      headerName: "LTP",
      flex: 1,
      type: "number",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography align="center">{params.value.toFixed(2)}</Typography>
        </Box>
      ),
    },
    {
      field: "percentChange",
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
    {
      field: "netChange",
      headerName: "Change",
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
          {params.value != null ? params.value.toFixed(2) : "N/A"}
        </Box>
      ),
    },
    {
      field: "tradeVolume",
      headerName: "Volume",
      type: "number",

      flex: 1,
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
      flex: 1,
      type: "number",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "green",
          }}
        >
          {params.value != null ? params.value.toFixed(2) : "N/A"}
        </Box>
      ),
    },
    {
      field: "sellPrice",
      headerName: "Sell Price",
      flex: 1,
      type: "number",

      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "red",
          }}
        >
          {params.value != null ? params.value.toFixed(2) : "N/A"}
        </Box>
      ),
    },
    {
      field: "buyQty",
      type: "number",

      headerName: "Buy Quantity",
      flex: 1,
    },
    {
      field: "sellQty",
      type: "number",

      headerName: "Sell Quantity",
      flex: 1,
    },
  ];

  // Rows data for DataGrid
  const rows = data.map((row, index) => ({
    id: index,
    tradingSymbol: row.tradingSymbol,
    ltp: row.ltp,
    percentChange: row.percentChange,
    netChange: row.netChange,
    tradeVolume: row.tradeVolume,
    buyPrice: row.depth.buy[0].price,
    sellPrice: row.depth.sell[0].price,
    buyQty: row.depth.buy[0].quantity,
    sellQty: row.depth.sell[0].quantity,
    symbolToken: row.symbolToken,
  }));

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ height: "86vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          onCellClick={handleCellClick} // Add the cell click handler
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default MarketDataTable;
