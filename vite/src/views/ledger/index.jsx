// Ledger.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';

// Import child components
import FileUpload from './components/FileUpload';
import Filters from './components/Filters';
import Tables from './components/Tables';
import Graphs from './components/Graphs';

function Ledger() {
  // Raw JSON data from the uploaded file.
  const [rawData, setRawData] = useState([]);
  // Aggregated trades based on composite key: Scrip/Contract + Date.
  const [trades, setTrades] = useState([]);
  // Trades after applying any user filters.
  const [filteredTrades, setFilteredTrades] = useState([]);

  // Called by FileUpload when the file is parsed.
  const handleDataLoaded = (data) => {
    setRawData(data);
  };

  /**
   * processTrades:
   * 1. Group rows using the composite key: "Scrip/Contract" + "Date".
   * 2. For each group:
   *    - Sort by "Trade ID" (numerically).
   *    - Determine overall position using the first row.
   *    - Separate BUY and SELL orders.
   *    - Compute weighted average prices:
   *         weightedAvg = (Sum(price × quantity)) / (Sum(quantity))
   *    - Compute total quantity (from the side that exists).
   *    - Compute profit/loss and determine the result.
   */
  const processTrades = (data) => {
    // Group rows by composite key.
    const grouped = data.reduce((acc, row) => {
      const symbol = row['Scrip/Contract'];
      const date = row['Date'];
      if (!symbol || !date) return acc;
      const key = `${symbol}__${date}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    const aggregatedTrades = Object.keys(grouped).map((key) => {
      const group = grouped[key];

      // Sort by Trade ID (numerically).
      group.sort((a, b) => Number(a['Trade ID']) - Number(b['Trade ID']));

      // Determine position using the first trade.
      const firstTradeType = group[0]['Buy/Sell']
        ? group[0]['Buy/Sell'].toUpperCase()
        : '';
      const position = firstTradeType === 'BUY' ? 'LONG' : 'SHORT';

      // Separate BUY and SELL orders.
      const buyRows = group.filter(
        (row) =>
          row['Buy/Sell'] && row['Buy/Sell'].toUpperCase() === 'BUY'
      );
      const sellRows = group.filter(
        (row) =>
          row['Buy/Sell'] && row['Buy/Sell'].toUpperCase() === 'SELL'
      );

      // Helper to compute weighted average.
      const calcWeightedAvg = (rows, priceField) => {
        let totalQty = 0;
        let totalPriceQty = 0;
        rows.forEach((row) => {
          const qty = Number(row['Quantity']) || 0;
          // If the price is blank, treat it as zero.
          const price = row[priceField] !== '' ? Number(row[priceField]) : 0;
          totalQty += qty;
          totalPriceQty += qty * price;
        });
        return totalQty > 0 ? totalPriceQty / totalQty : 0;
      };

      const avgBuyPrice =
        buyRows.length > 0 ? calcWeightedAvg(buyRows, 'Buy Price') : 0;
      const avgSellPrice =
        sellRows.length > 0 ? calcWeightedAvg(sellRows, 'Sell Price') : 0;

      // Total quantity: take from BUY orders if available, else SELL orders.
      const totalQuantity =
        buyRows.length > 0
          ? buyRows.reduce(
              (sum, row) => sum + (Number(row['Quantity']) || 0),
              0
            )
          : sellRows.length > 0
          ? sellRows.reduce(
              (sum, row) => sum + (Number(row['Quantity']) || 0),
              0
            )
          : 0;

      // Calculate profit/loss.
      const profitLoss = (avgSellPrice - avgBuyPrice) * totalQuantity;
      const result =
        profitLoss > 0 ? 'Profit' : profitLoss < 0 ? 'Loss' : 'Break-even';

      return {
        id: key, // Composite key serves as unique identifier.
        symbol: group[0]['Scrip/Contract'] || '',
        date: group[0]['Date'] || '',
        position,
        avgBuyPrice,
        avgSellPrice,
        totalQuantity,
        profitLoss,
        result,
        strategy: '', // For Strategy dropdown.
        mistakes: ''  // For Mistakes dropdown.
      };
    });

    return aggregatedTrades;
  };

  // Process rawData whenever it changes.
  useEffect(() => {
    if (rawData.length > 0) {
      const aggregated = processTrades(rawData);
      setTrades(aggregated);
      setFilteredTrades(aggregated);
    }
  }, [rawData]);

  // Filter trades (e.g., by stock symbol) based on user input.
  const handleFilterChange = (filters) => {
    const { symbol } = filters;
    let updatedTrades = [...trades];
    if (symbol) {
      updatedTrades = updatedTrades.filter((t) =>
        t.symbol.toLowerCase().includes(symbol.toLowerCase())
      );
    }
    setFilteredTrades(updatedTrades);
  };

  // Update trade entries when dropdown selections change.
  const handleTradeUpdate = (updatedTrades) => {
    setTrades(updatedTrades);
    setFilteredTrades(updatedTrades);
  };

  return (
    <Box
      className="scrollable"
      style={{ height: '100vh', overflowY: 'auto', marginLeft: '105px' }}
    >
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* Header */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" width="90vw">
            <div className="dashboard-font-box">
              <Typography className="heading-dashboard">LEDGER</Typography>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
          </Box>
        </Grid>

        {/* Filters */}
        <Filters onFilterChange={handleFilterChange} />

        {/* Table and Graphs (shown only if there are aggregated trades) */}
        {trades.length > 0 && (
          <>
            <Tables trades={filteredTrades} onTradeUpdate={handleTradeUpdate} />
            <Graphs trades={filteredTrades} />
          </>
        )}
      </Grid>
    </Box>
  );
}

export default Ledger;