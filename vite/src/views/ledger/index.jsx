import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import FileUpload from './components/FileUpload';
import Filters from './components/Filters';
import Graphs from './components/Graphs';
import Tables from './components/Tables';
import EquityCurveChart from './components/equityCurve';
import AuthContext from 'views/pages/authentication/auth-forms/AuthContext';
import './index.css';

const Ledger = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [processedTrades, setProcessedTrades] = useState([]);
  const { requestWithToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchAndProcessTrades = async () => {
      setLoading(true);
      try {
        const username = localStorage.getItem('username');
        if (!username) throw new Error('Username not found in localStorage.');

        const tradeRes = await requestWithToken(`${import.meta.env.VITE_API_URL}/api/service/list-user-trades/`, {
          method: 'POST',
          body: JSON.stringify({ username }),
          headers: { 'Content-Type': 'application/json' },
        });
        const userTrades = await tradeRes.json();

        const processTrades = (data) => {
          const grouped = data.reduce((acc, row) => {
            const symbol = row['scrip_contract'];
            const date = row['date'];
            if (!symbol || !date) return acc;
            const key = `${symbol}__${date}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(row);
            return acc;
          }, {});

          let aggregated = [];

          Object.entries(grouped).forEach(([key, group]) => {
            group.sort((a, b) => Number(a['trade_id']) - Number(b['trade_id']));
            const firstType = group[0]['buy_sell']?.toUpperCase() || '';
            const position = firstType === 'BUY' ? 'LONG' : 'SHORT';

            const buyRows = group.filter(r => r['buy_sell']?.toUpperCase() === 'BUY');
            const sellRows = group.filter(r => r['buy_sell']?.toUpperCase() === 'SELL');

            const calcAvg = (rows, field) => {
              let totalQty = 0;
              let totalVal = 0;
              rows.forEach(row => {
                const qty = Number(row.quantity) || 0;
                const price = Number(row[field]) || 0;
                totalQty += qty;
                totalVal += qty * price;
              });
              return totalQty > 0 ? totalVal / totalQty : 0;
            };

            const avgBuy = calcAvg(buyRows, 'buy_price');
            const avgSell = calcAvg(sellRows, 'sell_price');
            const totalBuyQty = buyRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
            const totalSellQty = sellRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);

            const base = {
              symbol: group[0]['scrip_contract'],
              date: group[0]['date'],
              position,
              avgBuyPrice: avgBuy,
              avgSellPrice: avgSell,
              strategy: '',
              mistakes: '',
            };

            if (totalBuyQty > 0 && totalSellQty > 0) {
              if (totalBuyQty === totalSellQty) {
                const pnl = (avgSell - avgBuy) * totalBuyQty;
                aggregated.push({ ...base, id: key, totalQuantity: totalBuyQty, profitLoss: pnl, result: pnl, status: 'CLOSE' });
              } else {
                const closedQty = Math.min(totalBuyQty, totalSellQty);
                const openQty = Math.abs(totalBuyQty - totalSellQty);
                const pnl = (avgSell - avgBuy) * closedQty;

                aggregated.push({ ...base, id: `${key}_closed`, totalQuantity: closedQty, profitLoss: pnl, result: pnl, status: 'OPEN' });
                aggregated.push({ ...base, id: `${key}_open`, totalQuantity: openQty, profitLoss: null, result: 'N/A', status: 'OPEN' });
              }
            } else {
              const qty = totalBuyQty > 0 ? totalBuyQty : totalSellQty;
              aggregated.push({ ...base, id: key, totalQuantity: qty, profitLoss: null, result: 'N/A', status: 'OPEN' });
            }
          });

          return aggregated;
        };

        const processed = Array.isArray(userTrades) ? processTrades(userTrades) : [];

        const metaRes = await requestWithToken(`${import.meta.env.VITE_API_URL}/api/service/fetch-ledger-data/`, {
          method: 'POST',
          body: JSON.stringify({ username }),
          headers: { 'Content-Type': 'application/json' },
        });

        const metaData = await metaRes.json();

        const finalMerged = processed.map((trade) => {
          const match = Array.isArray(metaData)
            ? metaData.find(
                (m) =>
                  m.stock_name === trade.symbol &&
                  m.status === trade.status &&
                  new Date(m.date).toISOString().split('T')[0] === new Date(trade.date).toISOString().split('T')[0]
              )
            : null;

          return match
            ? { ...trade, strategy: match.strategy || '', mistakes: match.mistakes || '' }
            : trade;
        });

        setProcessedTrades(finalMerged);
        setTableData(finalMerged);
        setFilteredData(finalMerged);
        console.log("finalMerged", finalMerged);
      } catch (err) {
        console.error('Error fetching ledger data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessTrades();
  }, [refreshKey]);

  const handleNewUpload = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTradeUpdate = async (updatedRow) => {
    try {
      const payload = {
        username: localStorage.getItem('username'),
        stock_name: updatedRow.symbol || updatedRow.stock_name,
        status: updatedRow.status,
        date: new Date(updatedRow.date).toISOString(),
        strategy: updatedRow.strategy || '',
        mistakes: updatedRow.mistakes || '',
      };

      await requestWithToken(`${import.meta.env.VITE_API_URL}/api/service/save-ledger-data/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const updated = processedTrades.map((trade) =>
        trade.id === updatedRow.id ? { ...trade, ...updatedRow } : trade
      );
      setProcessedTrades(updated);
      setFilteredData(updated);
      setTableData(updated);
    } catch (err) {
      console.error('Error updating trade:', err);
    }
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);

    let updated = [...processedTrades];

    if (filters.symbol) {
      updated = updated.filter((t) => t.symbol.toLowerCase().includes(filters.symbol.toLowerCase()));
    }

    if (filters.strategy) {
      updated = updated.filter((t) => t.strategy === filters.strategy);
    }

    if (filters.position) {
      updated = updated.filter((t) => t.position.toLowerCase() === filters.position.toLowerCase());
    }

    if (filters.mistake) {
      updated = updated.filter((t) => t.mistakes === filters.mistake);
    }

    if (filters.status) {
      updated = updated.filter((t) => t.status === filters.status);
    }

    if (filters.result) {
      const val = filters.result.toLowerCase();
      updated = updated.filter((t) => {
        const num = Number(t.result);
        if (val === 'profit') return num > 0;
        if (val === 'loss') return num < 0;
        if (val === 'neutral') return num === 0;
        return true;
      });
    }

    const parseDate = (dateStr) => {
      const n = Number(dateStr);
      if (!isNaN(n)) {
        return new Date((n - 25569) * 86400 * 1000);
      }
      return new Date(dateStr);
    };

    if (filters.durationFrom) {
      const from = new Date(filters.durationFrom);
      updated = updated.filter((t) => parseDate(t.date) >= from);
    }

    if (filters.durationTo) {
      const to = new Date(filters.durationTo);
      updated = updated.filter((t) => parseDate(t.date) <= to);
    }

    setFilteredData(updated);
  };

  return (
    <Box className="scrollable" style={{ height: '100vh', overflowY: 'auto', marginLeft: '110px', width: '91%' }}>
      <Grid container rowSpacing={1} columnSpacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className="heading-dashboard">LEDGER</Typography>
            <FileUpload onUploadComplete={handleNewUpload} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Filters onFilterChange={handleFilterChange} />
        </Grid>

        {filteredData.length > 0 && (
          <>
            <Grid item xs={12}>
              <Graphs trades={filteredData} />
            </Grid>
            <Grid item xs={12}>
              <Tables trades={filteredData} onTradeUpdate={handleTradeUpdate} />
            </Grid>
            <Grid item sx = {12}>
              <EquityCurveChart tradeData = {filteredData} />
            </Grid>
          </>
        )}

        {loading && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress color="secondary" />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Ledger;
