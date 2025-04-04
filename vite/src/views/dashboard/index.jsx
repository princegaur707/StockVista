// src/pages/DashboardDefault.jsx

import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AnalyticEcommerce from 'ui-component/cards/statistics/AnalyticEcommerce';
import MarketDataTable from './components/MarketData';
import CandlestickChart from './components/CandleStickChart';
import ThirtyDayReportTable from './components/ThirtyDayReport';
import NinetyDayReportTable from './components/NinetyDayReport';
import IPOTable from './components/IPO';
import BreakOutSoonDailyTable from './components/BreakoutSoonDaily';
import WeeklyBreakoutTable from './components/BreakoutSoonWeekly';
import RecentBreakOutTable from './components/RecentBreakOut';
import BigPlayersTable from './components/BigPlayers';
import ReversalTable from './components/Reversal';
import { bgcolor } from '@mui/system';
import AuthContext from '../pages/authentication/auth-forms/AuthContext.jsx';
import './index.css';

// modal style
const modalStyle = {
  outline: 'none',
  border: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: '#141516',
  boxShadow: 24,
  p: 1,
  borderRadius: 1
};
const apiUrl = import.meta.env.VITE_API_URL;
export default function DashboardDefault() {
  const [selected, setSelected] = useState('tabular');
  const [isHomePage, setIsHomePage] = useState(true);
  const [token, setToken] = useState('');
  const [symbolToken, setSymbolToken] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [liveMarketData, setLiveMarketData] = useState([]); // State for live WebSocket data

  const [data, setData] = useState({
    nifty50: { count: '22547.55', change: -5.8, percentage: 0.03 },
    sensex: { count: '74602.12', change: 147.71, percentage: 0.2 },
    niftyBank: { count: '48606.35', change: -43.35, percentage: -0.35 },
    nifty100: { count: '22987.95', change: -34.55, percentage: -0.15 }
  });

  // Import requestWithToken from AuthContext
  const { requestWithToken } = useContext(AuthContext);

  const updateLiveData = (message) => {
    const { Symbol } = message; // Extract the stock symbol

    const defaultStockData = {
      exchange: 'NSE',
      tradingSymbol: '',
      symbolToken: '',
      ltp: '',
      open: '',
      high: '',
      low: '',
      close: '',
      lastTradeQty: '',
      exchFeedTime: '',
      exchTradeTime: '',
      netChange: '',
      percentChange: '',
      avgPrice: '',
      tradeVolume: '',
      opnInterest: '',
      lowerCircuit: '',
      upperCircuit: '',
      totBuyQuan: '',
      totSellQuan: '',
      '52WeekLow': '',
      '52WeekHigh': '',
      depth: {
        buy: [],
        sell: []
      }
    };

    setLiveMarketData((prevData) => {
      const stockIndex = prevData.findIndex((stock) => stock.tradingSymbol === Symbol);
      const updatedStockData = {
        ...defaultStockData,
        tradingSymbol: message.Symbol || '',
        symbolToken: message.symbolToken || '',
        ltp: message.LTP || '',
        open: message.Open || '',
        high: message.High || '',
        low: message.Low || '',
        close: message.Close || '',
        lastTradeQty: message.LastTradeQty || '',
        exchFeedTime: message.exchFeedTime || '',
        exchTradeTime: message.exchTradeTime || '',
        netChange: message.Change || '',
        percentChange: message['Change %'] || '',
        avgPrice: message.AvgPrice || '',
        tradeVolume: message.Volume || '',
        opnInterest: message.OpnInterest || '',
        lowerCircuit: message.LowerCircuit || '',
        upperCircuit: message.UpperCircuit || '',
        totBuyQuan: message.TotBuyQuan || '',
        totSellQuan: message.TotSellQuan || '',
        '52WeekLow': message['52WeekLow'] || '',
        '52WeekHigh': message['52WeekHigh'] || '',
        depth: {
          buy: message.depth?.buy || [],
          sell: message.depth?.sell || []
        }
      };

      if (stockIndex !== -1) {
        return prevData.map((stock, index) => (index === stockIndex ? { ...stock, ...updatedStockData } : stock));
      }
      return [...prevData, updatedStockData];
    });
  };

  // Update fetchIndexData to use the requestWithToken helper
  const fetchIndexData = async () => {
    try {
      const response = await requestWithToken(`${apiUrl}/api/service/get-index-data`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const indexData = await response.json();

      setData({
        nifty50: {
          count: indexData['NIFTY 50']['Current Value'].toFixed(2),
          change: indexData['NIFTY 50'].Change,
          percentage: indexData['NIFTY 50']['Change (%)']
        },
        sensex: {
          count: indexData.SENSEX['Current Value'].toFixed(2),
          change: indexData.SENSEX.Change,
          percentage: indexData.SENSEX['Change (%)']
        },
        niftyBank: {
          count: indexData['NIFTY BANK']['Current Value'].toFixed(2),
          change: indexData['NIFTY BANK'].Change,
          percentage: indexData['NIFTY BANK']['Change (%)']
        },
        nifty100: {
          count: indexData['NIFTY 100']['Current Value'].toFixed(2),
          change: indexData['NIFTY 100'].Change,
          percentage: indexData['NIFTY 100']['Change (%)']
        }
      });
    } catch (error) {
      console.error('Error fetching index data:', error);
    }
  };

  useEffect(() => {
    fetchIndexData();
    const interval = setInterval(fetchIndexData, 10000); // Fetch data every 10 seconds
    return () => clearInterval(interval);
  }, [requestWithToken]);

  // Modal & tab functions
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setSymbolToken('');
    setOpenModal(false);
  };

  const handleChange1 = (event) => {
    setSelected(event.target.value);
  };

  const [value, setValue] = useState('1'); // Default to Thirty Day Table

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Open modal when symbolToken changes
  useEffect(() => {
    if (symbolToken) {
      setOpenModal(true);
    }
  }, [symbolToken]);

  return (
    <Box className="scrollable" style={{ height: '100vh', overflowY: 'auto', marginRight: '25px', marginLeft: '105px' }}>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* Row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <div className="dashboard-font-box">
            <Typography className="heading-dashboard">MOMENTUM KING</Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="Analyticbox">
            <AnalyticEcommerce
              title="NIFTY 50"
              count={data.nifty50.count}
              change={data.nifty50.change}
              percentage={data.nifty50.percentage}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="Analyticbox">
            <AnalyticEcommerce title="SENSEX" count={data.sensex.count} change={data.sensex.change} percentage={data.sensex.percentage} />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="Analyticbox">
            <AnalyticEcommerce
              title="NIFTY BANK"
              count={data.niftyBank.count}
              change={data.niftyBank.change}
              percentage={data.niftyBank.percentage}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="Analyticbox">
            <AnalyticEcommerce
              title="NIFTY 100"
              count={data.nifty100.count}
              change={data.nifty100.change}
              percentage={data.nifty100.percentage}
            />
          </div>
        </Grid>

        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

        {/* Row 2: Tab Panels */}
        <Box sx={{ width: 'auto' }}>
          <TabContext value={value}>
            <Box>
              <TabList className="tab-values" onChange={handleChange} aria-label="lab API tabs example">
                <Tab className="tabValue-head" label="30 days report" value="1" />
                <Tab className="tabValue-head" label="90 days report" value="2" />
                <Tab className="tabValue-head" label="IPO" value="3" />
                <Tab className="tabValue-head" label="Breakout Soon Daily" value="4" />
                <Tab className="tabValue-head" label="Breakout Soon Weekly" value="5" />
                <Tab className="tabValue-head" label="Recent Breakout" value="6" />
                <Tab className="tabValue-head" label="Big Players Money Flow" value="7" />
                <Tab className="tabValue-head" label="Reversal" value="8" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box>
                <ThirtyDayReportTable setSymbolToken={setSymbolToken} liveMarketData={liveMarketData} />
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box>
                <NinetyDayReportTable
                  displayTopGainers={true}
                  displayTopLosers={false}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData}
                />
              </Box>
            </TabPanel>
            <TabPanel value="3">
              <Box>
                <IPOTable
                  displayTopGainers={true}
                  displayTopLosers={false}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData}
                />
              </Box>
            </TabPanel>
            <TabPanel value="4">
              <Box>
                <BreakOutSoonDailyTable
                  displayTopGainers={true}
                  displayTopLosers={false}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData}
                />
              </Box>
            </TabPanel>
            <TabPanel value="5">
              <Box>
                <WeeklyBreakoutTable
                  displayTopGainers={true}
                  displayTopLosers={false}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData}
                />
              </Box>
            </TabPanel>
            <TabPanel value="6">
              <Box>
                <RecentBreakOutTable
                  displayTopGainers={true}
                  displayTopLosers={false}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData}
                />
              </Box>
            </TabPanel>
            <TabPanel value="7">
              <Box>
                <BigPlayersTable
                  displayTopGainers={true}
                  displayTopLosers={false}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData}
                />
              </Box>
            </TabPanel>
            <TabPanel value="8">
              <Box>
                <ReversalTable
                  displayTopGainers={true}
                  displayTopLosers={false}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData}
                />
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>

      {/* Modal for Candlestick Chart */}
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="candlestick-chart-modal">
        <Box sx={modalStyle}>
          <Box display={'flex'} justifyContent="space-between" alignItems="center" mb="15px">
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'figtree',
                textAlign: 'left',
                padding: '10px',
                fontWeight: '300',
                color: '#FFE072',
                fontSize: '20px',
                letterSpacing: '1px'
              }}
            >
              {symbolToken}
            </Typography>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              sx={{
                color: '#FFE072',
                borderColor: '#FFE072',
                mt: 1,
                '&:hover': {
                  border: 'none',
                  backgroundColor: '#241e13'
                },
                mr: 2
              }}
            >
              Close
            </Button>
          </Box>
          <CandlestickChart token={symbolToken} />
        </Box>
      </Modal>
    </Box>
  );
}
