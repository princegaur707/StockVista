import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import './index.css';
import AnalyticEcommerce from 'ui-component/cards/statistics/AnalyticEcommerce';
import MarketDataTable from './components/MarketData';
import CandlestickChart from './components/CandleStickChart';
import ThirtyDayReportTable from './components/ThirtyDayReport';
import NinetyDayReportTable from './components/NinetyDayReport';
import WeeklyBreakoutTable from './components/WeeklyBreakout';
import IPOTable from './components/IPO';
import PropTypes from 'prop-types';
import { Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { x } from 'joi';

// modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [selected, setSelected] = useState('tabular');
  const [isHomePage, setIsHomePage] = useState(true);
  const [token, setToken] = useState('');
  const [symbolToken, setSymbolToken] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [liveMarketData, setLiveMarketData] = useState([]); // State for live WebSocket data

  const [data, setData] = useState({
    nifty: { count: '24618.8', change: 31.75, percentage: 0.13 },
    sensex: { count: '81526.14', change: 16.09, percentage: 0.02 },
    niftyBank: { count: '53391.35', change: -186.35, percentage: -0.35 },
    nifty50: { count: '59292.95', change: 157.55, percentage: 0.27 }
  });
  // const updateLiveData = (message) => {
  //   const { Symbol } = message; // Extract the stock symbol from the message

  //   setLiveMarketData((prevData) => {
  //     // If prevData is indeed an array, this will work
  //     const stockIndex = prevData.findIndex((stock) => stock.Symbol === Symbol);

  //     // If the stock exists, update the corresponding entry
  //     if (stockIndex !== -1) {
  //       // Create a new array with updated stock data
  //       return prevData.map((stock, index) => (index === stockIndex ? { ...stock, ...message } : stock));
  //     }

  //     // If the stock doesn't exist, add it to the array
  //     return [...prevData, message];
  //   });
  // };

  const updateLiveData = (message) => {
    const { Symbol } = message; // Extract the stock symbol and token from the message

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
      // Check if the stock already exists based on Symbol
      const stockIndex = prevData.findIndex((stock) => stock.tradingSymbol === Symbol);
      // Create the updated stock data object with defaults
      const updatedStockData = {
        ...defaultStockData,
        tradingSymbol: message.Symbol || '', // Use value from message if exists
        symbolToken: message.symbolToken || '', // Use value from message if exists
        ltp: message.LTP || '', // Use value from message if exists
        open: message.Open || '', // Use value from message if exists
        high: message.High || '', // Use value from message if exists
        low: message.Low || '', // Use value from message if exists
        close: message.Close || '', // Use value from message if exists
        lastTradeQty: message.LastTradeQty || '', // Use value from message if exists
        exchFeedTime: message.exchFeedTime || '', // Use value from message if exists
        exchTradeTime: message.exchTradeTime || '', // Use value from message if exists
        netChange: message.Change || '', // Use value from message if exists
        percentChange: message['Change %'] || '', // Use value from message if exists
        avgPrice: message.AvgPrice || '', // Use value from message if exists
        tradeVolume: message.Volume || '', // Use value from message if exists
        opnInterest: message.OpnInterest || '', // Use value from message if exists
        lowerCircuit: message.LowerCircuit || '', // Use value from message if exists
        upperCircuit: message.UpperCircuit || '', // Use value from message if exists
        totBuyQuan: message.TotBuyQuan || '', // Use value from message if exists
        totSellQuan: message.TotSellQuan || '', // Use value from message if exists
        '52WeekLow': message['52WeekLow'] || '', // Use value from message if exists
        '52WeekHigh': message['52WeekHigh'] || '', // Use value from message if exists
        depth: {
          buy: message.depth?.buy || [], // Use value from message if exists or default to empty array
          sell: message.depth?.sell || [] // Use value from message if exists or default to empty array
        }
      };

      // If the stock exists, update the corresponding entry
      if (stockIndex !== -1) {
        return prevData.map((stock, index) => (index === stockIndex ? { ...stock, ...updatedStockData } : stock));
      }

      // If the stock doesn't exist, add it to the array only if it's not already present
      return [...prevData, updatedStockData];
    });
  };

  useEffect(() => {
    const ws = new WebSocket(`ws://${import.meta.env.VITE_API_URL}/ws/nse-feed/`);
    // const ws = new WebSocket('ws://localhost:8000/ws/nse-feed/');
    // const ws = [];

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      updateData(message); // Existing logic for specific stock updates
      // console.log(message, 'live4');
      updateLiveData(message);
      // setLiveMarketData(message); // New: Set live data for MarketDataTable
    };

    return () => {
      ws.close();
    };
  }, []);


  const updateData = (message) => {
    const { Name, LTP, Change, 'Change %': ChangePercentage} = message;

    // console.log(Name, LTP, Change, ChangePercentage, 'here');

    switch (Name) {
      case 'NIFTY':
        setData((prevData) => ({
          ...prevData,
          nifty: { count: `${parseFloat(LTP).toFixed(2)}`, change: parseFloat(Change), percentage: parseFloat(ChangePercentage) }
        }));
        break;
      case 'SENSEX':
        setData((prevData) => ({
          ...prevData,
          sensex: { count: `${parseFloat(LTP).toFixed(2)}`, change: parseFloat(Change), percentage: parseFloat(ChangePercentage) }
        }));
        break;
      case 'NIFTY MIDCAP':
        setData((prevData) => ({
          ...prevData,
          nifty50: { count: `${parseFloat(LTP).toFixed(2)}`, change: parseFloat(Change), percentage: parseFloat(ChangePercentage) }
        }));
        break;
      case 'BANKNIFTY':
        setData((prevData) => ({
          ...prevData,
          niftyBank: { count: `${parseFloat(LTP).toFixed(2)}`, change: parseFloat(Change), percentage: parseFloat(ChangePercentage) }
        }));
        break;
      default:
        break;
    }
  };

  const updateToken = (_token) => {
    setToken(_token);
    setIsHomePage(false);
    setSelected('tabular');
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChange1 = (event) => {
    setSelected(event.target.value);
  };

  const [value, setValue] = React.useState('1'); // Default to Top Gainers

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // UseEffect to open modal when symbolToken changes
  useEffect(() => {
    if (symbolToken) {
      setOpenModal(true);
    }
  }, [symbolToken]);

  return (
    <Box className="scrollable" style={{ height: '100vh', overflowY:'auto', marginRight: '25px', marginLeft:'105px' }}>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <div className='dashboard-font-box'>
              <Typography className='heading-dashboard'>MOMENTUM KING</Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className='Analyticbox'>
              <AnalyticEcommerce title="NIFTY" 
              count={data.nifty.count} 
              change={data.nifty.change}
              percentage={data.nifty.percentage} 
              // isLoss={data.nifty.percentage < 0}
            />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className='Analyticbox'>
              <AnalyticEcommerce 
                title="SENSEX" 
                count={data.sensex.count} 
                change={data.sensex.change}
                percentage={data.sensex.percentage}
                // isLoss={data.sensex.percentage < 0}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className='Analyticbox'>
              <AnalyticEcommerce
                title="NIFTY BANK"
                count={data.niftyBank.count}
                change={data.niftyBank.change}
                percentage={data.niftyBank.percentage}
                // isLoss={data.niftyBank.percentage < 0}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className='Analyticbox'>
              <AnalyticEcommerce
                title="NIFTY 50"
                count={data.nifty50.count}
                change={data.nifty50.change}
                percentage={data.nifty50.percentage}
                // isLoss={data.nifty50.percentage < 0}
              />
            </div>
          </Grid>
          
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

        {/* row 2 */}
        <Box sx={{ width: 'auto' }}>
        {/* <Box> */}
          <TabContext value={value}>
            <Box>
              <TabList className ="tab-values" onChange={handleChange} aria-label="lab API tabs example">
                <Tab className="tabValue-head" label="30 days report" value="1" />
                <Tab className="tabValue-head" label="90 days report" value="2" />
                <Tab className="tabValue-head" label="IPO" value="3" />
                <Tab className="tabValue-head" label="Breakout Soon Daily" value="4" />
                <Tab className="tabValue-head" label="Breakout Soon Weekly" value="5" />
                <Tab className="tabValue-head" label="Recent Breakout" value="6" />
                <Tab className="tabValue-head" label="Big Players Money Flow" value="7" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box>
                <ThirtyDayReportTable
                  updateToken={updateToken}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData} // New prop for live WebSocket data
                />
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box>
                <NinetyDayReportTable
                  updateToken={updateToken}
                  displayTopGainers={true} // or false depending on the case
                  displayTopLosers={false} // or true depending on the case
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData} // New prop for live WebSocket data
                />
              </Box>
            </TabPanel>
            <TabPanel value="3">
              <Box>
                <IPOTable
                  updateToken={updateToken}
                  displayTopGainers={true} // or false depending on the case
                  displayTopLosers={false} // or true depending on the case
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData} // New prop for live WebSocket data
                />
              </Box>
            </TabPanel>
            <TabPanel value="4">
              <Box>
                <MarketDataTable
                  updateToken={updateToken}
                  displayTopGainers={true} // or false depending on the case
                  displayTopLosers={false} // or true depending on the case
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData} // New prop for live WebSocket data
                />
              </Box>
            </TabPanel>
            <TabPanel value="5">
              <Box>
                <WeeklyBreakoutTable
                  updateToken={updateToken}
                  displayTopGainers={true} // or false depending on the case
                  displayTopLosers={false} // or true depending on the case
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData} // New prop for live WebSocket data
                />
              </Box>
            </TabPanel>
            <TabPanel value="6">
              <Box>
                <MarketDataTable
                  updateToken={updateToken}
                  displayTopGainers={true} // or false depending on the case
                  displayTopLosers={false} // or true depending on the case
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData} // New prop for live WebSocket data
                />
              </Box>
            </TabPanel>
            <TabPanel value="7">
              <Box>
                <MarketDataTable
                  updateToken={updateToken}
                  displayTopGainers={true} // or false depending on the case
                  displayTopLosers={false} // or true depending on the case
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData} // New prop for live WebSocket data
                />
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>

      {/* Modal to show the Candlestick Chart */}
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="candlestick-chart-modal">
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Candlestick Chart
          </Typography>
          <CandlestickChart token={symbolToken} />
          <Button onClick={handleCloseModal} variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
