// Ledger.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';

// Import child components
import FileUpload from './components/FileUpload';
import Filters from './components/Filters';
import Graphs from './components/Graphs';
import Tables from './components/Tables';
import './index.css';

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
   *    - Compute total BUY and SELL quantities.
   *    - Determine status: if BUY quantity equals SELL quantity → 'Close', otherwise 'Open'.
   *    - For 'open', set effective quantity = min(totalBuyQuantity, totalSellQuantity) and compute profit/loss using that quantity.
   *    - For 'close', calculations remain as before.
   *    - Set result as the numeric profit/loss.
   */
  const processTrades = (data) => {
    // Group rows by composite key: Scrip/Contract + Date.
    const grouped = data.reduce((acc, row) => {
      const symbol = row['Scrip/Contract'];
      const date = row['Date'];
      if (!symbol || !date) return acc;
      const key = `${symbol}__${date}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    let aggregatedTrades = [];

    Object.keys(grouped).forEach((key) => {
      const group = grouped[key];

      // Sort by Trade ID (numerically).
      group.sort((a, b) => Number(a['Trade ID']) - Number(b['Trade ID']));

      // Determine position using the first trade.
      const firstTradeType = group[0]['Buy/Sell'] ? group[0]['Buy/Sell'].toUpperCase() : '';
      const position = firstTradeType === 'BUY' ? 'LONG' : 'SHORT';

      // Separate BUY and SELL orders.
      const buyRows = group.filter((row) => row['Buy/Sell'] && row['Buy/Sell'].toUpperCase() === 'BUY');
      const sellRows = group.filter((row) => row['Buy/Sell'] && row['Buy/Sell'].toUpperCase() === 'SELL');

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

      const avgBuyPrice = buyRows.length > 0 ? calcWeightedAvg(buyRows, 'Buy Price') : 0;
      const avgSellPrice = sellRows.length > 0 ? calcWeightedAvg(sellRows, 'Sell Price') : 0;

      const totalBuyQuantity = buyRows.reduce((sum, row) => sum + (Number(row['Quantity']) || 0), 0);
      const totalSellQuantity = sellRows.reduce((sum, row) => sum + (Number(row['Quantity']) || 0), 0);

      if (totalBuyQuantity > 0 && totalSellQuantity > 0) {
        // Both sides exist.
        if (totalBuyQuantity === totalSellQuantity) {
          const profitLoss = (avgSellPrice - avgBuyPrice) * totalBuyQuantity;
          aggregatedTrades.push({
            id: key,
            symbol: group[0]['Scrip/Contract'] || '',
            date: group[0]['Date'] || '',
            position,
            avgBuyPrice,
            avgSellPrice,
            totalQuantity: totalBuyQuantity,
            profitLoss,
            result: profitLoss,
            status: 'Close',
            strategy: '',
            mistakes: ''
          });
        } else {
          // Mismatch: produce two rows.
          const closedQty = Math.min(totalBuyQuantity, totalSellQuantity);
          const profitLossClosed = (avgSellPrice - avgBuyPrice) * closedQty;
          aggregatedTrades.push({
            id: key + '_closed',
            symbol: group[0]['Scrip/Contract'] || '',
            date: group[0]['Date'] || '',
            position,
            avgBuyPrice,
            avgSellPrice,
            totalQuantity: closedQty,
            profitLoss: profitLossClosed,
            result: profitLossClosed,
            status: 'Open',
            strategy: '',
            mistakes: ''
          });

          const openQty = Math.abs(totalBuyQuantity - totalSellQuantity);
          aggregatedTrades.push({
            id: key + '_open',
            symbol: group[0]['Scrip/Contract'] || '',
            date: group[0]['Date'] || '',
            position,
            avgBuyPrice,
            avgSellPrice,
            totalQuantity: openQty,
            profitLoss: null,
            result: 'N/A',
            status: 'Open',
            strategy: '',
            mistakes: ''
          });
        }
      } else {
        // Only one side exists → produce a single row.
        const qty = totalBuyQuantity > 0 ? totalBuyQuantity : totalSellQuantity;
        aggregatedTrades.push({
          id: key,
          symbol: group[0]['Scrip/Contract'] || '',
          date: group[0]['Date'] || '',
          position,
          avgBuyPrice,
          avgSellPrice,
          totalQuantity: qty,
          profitLoss: null,
          result: 'N/A',
          status: 'Open',
          strategy: '',
          mistakes: ''
        });
      }
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

  // Filter trades based on user input.
  const handleFilterChange = (filters) => {
    const { symbol } = filters;
    let updatedTrades = [...trades];
    if (symbol) {
      updatedTrades = updatedTrades.filter((t) => t.symbol.toLowerCase().includes(symbol.toLowerCase()));
    }
    if (filters.strategy) {
      updatedTrades = updatedTrades.filter(t => t.strategy === filters.strategy);
    }
    if(filters.mistake) {
      updatedTrades = updatedTrades.filter(t => t.mistake == filters.mistake);
    }
    // if(filters.position) {
    //   updatedTrades = updatedTrades.filter(t => t.position == );
    // }
    if (filters.result) {
      if (filters.result.toLowerCase() === 'profit') {
        updatedTrades = updatedTrades.filter(t => Number(t.result) > 0);
      } else if (filters.result.toLowerCase() === 'loss') {
        updatedTrades = updatedTrades.filter(t => Number(t.result) < 0);
      }
    }
    if (filters.durationFrom) {
      updatedTrades = updatedTrades.filter(t => new Date(t.date) >= new Date(filters.durationFrom));
    }
    if (filters.durationTo) {
      updatedTrades = updatedTrades.filter(t => new Date(t.date) <= new Date(filters.durationTo));
    }            
    setFilteredTrades(updatedTrades);
  };

  // Update trade entries when dropdown selections change.
  const handleTradeUpdate = (updatedTrades) => {
    console.log(updatedTrades);
    setTrades(updatedTrades);
    setFilteredTrades(updatedTrades);
  };

  return (
    <Box className="scrollable" style={{ height: '100vh', overflowY: 'auto', marginLeft: '105px' }}>
      <Grid container rowSpacing={1} columnSpacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="space-between" width="90vw">
            <div className="dashboard-font-box">
              <Typography className="heading-dashboard">LEDGER</Typography>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
          </Box>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Filters onFilterChange={handleFilterChange} />
        </Grid>

        {/* Graphs (side by side above the table; each graph is 100px in height) */}
        {trades.length > 0 && (
          <Grid item xs={12}>
            <Graphs trades={filteredTrades} />
          </Grid>
        )}

        {/* Table */}
        {trades.length > 0 && (
          <Grid item xs={12}>
            <Tables trades={filteredTrades} onTradeUpdate={handleTradeUpdate} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Ledger;
