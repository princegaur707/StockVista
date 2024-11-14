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
import EarningCard from './components/EarningCard';
import PopularCard from './components/PopularCard';
import TotalOrderLineChartCard from './components/TotalOrderLineChartCard';
import TotalIncomeDarkCard from './components/TotalIncomeDarkCard';
import TotalIncomeLightCard from './components/TotalIncomeLightCard';
import TotalGrowthBarChart from './components/TotalGrowthBarChart';
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
    nifty: { count: '0', percentage: 0 },
    sensex: { count: '0', percentage: 0 },
    nifty50: { count: '0', percentage: 0 },
    niftyBank: { count: '0', percentage: 0 }
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
    const ws = new WebSocket('ws://localhost:8001/ws/nifty50-feed/');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      updateData(message); // Existing logic for specific stock updates
      console.log(message, 'live4');
      updateLiveData(message);
      // setLiveMarketData(message); // New: Set live data for MarketDataTable
    };

    return () => {
      ws.close();
    };
  }, []);

  const updateData = (message) => {
    const { Name, LTP, Change } = message;

    console.log(Name, LTP, Change, 'here');

    switch (Name) {
      case 'NIFTY':
        setData((prevData) => ({
          ...prevData,
          nifty: { count: `${parseFloat(LTP).toFixed(2)}`, percentage: parseFloat(Change) }
        }));
        break;
      case 'SENSEX':
        setData((prevData) => ({
          ...prevData,
          sensex: { count: `${parseFloat(LTP).toFixed(2)}`, percentage: parseFloat(Change) }
        }));
        break;
      case 'NIFTY MIDCAP':
        setData((prevData) => ({
          ...prevData,
          nifty50: { count: `${parseFloat(LTP).toFixed(2)}`, percentage: parseFloat(Change) }
        }));
        break;
      case 'BANKNIFTY':
        setData((prevData) => ({
          ...prevData,
          niftyBank: { count: `${parseFloat(LTP).toFixed(2)}`, percentage: parseFloat(Change) }
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
    <Box className="scrollable" style={{ height: '100vh', overflowX: 'auto', overflowY:'auto', marginRight: '25px', marginLeft:'105px' }}>
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
              percentage={data.nifty.percentage} 
            />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className='Analyticbox'>
              <AnalyticEcommerce 
                title="SENSEX" 
                count={data.sensex.count} 
                percentage={data.sensex.percentage}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className='Analyticbox'>
              <AnalyticEcommerce
                title="NIFTY BANK"
                count={data.niftyBank.count}
                percentage={data.niftyBank.percentage}
                isLoss={data.niftyBank.percentage < 0}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className='Analyticbox'>
              <AnalyticEcommerce
                title="NIFTY 50"
                count={data.nifty50.count}
                percentage={data.nifty50.percentage}
                isLoss={data.nifty50.percentage < 0}
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
                <MarketDataTable
                  updateToken={updateToken}
                  displayTopGainers={true}
                  displayTopLosers={false}
                  setSymbolToken={setSymbolToken}
                  liveMarketData={liveMarketData} // New prop for live WebSocket data
                />
              </Box>
            </TabPanel>
            <TabPanel value="2">
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
            <TabPanel value="3">
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
                <MarketDataTable
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

// import { useEffect, useState } from 'react';

// // material-ui
// import Grid from '@mui/material/Grid';

// // project imports
// import EarningCard from './EarningCard';
// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';

// import { gridSpacing } from 'store/constant';

// // assets
// import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// // ==============================|| DEFAULT DASHBOARD ||============================== //

// const Dashboard = () => {
//   const [isLoading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(false);
//   }, []);

//   return (
//     <Grid container spacing={gridSpacing}>
//       <Grid item xs={12}>
//         <Grid container spacing={gridSpacing}>
//           <Grid item lg={4} md={6} sm={6} xs={12}>
//             <EarningCard isLoading={isLoading} />
//           </Grid>
//           <Grid item lg={4} md={6} sm={6} xs={12}>
//             <TotalOrderLineChartCard isLoading={isLoading} />
//           </Grid>
//           <Grid item lg={4} md={12} sm={12} xs={12}>
//             <Grid container spacing={gridSpacing}>
//               <Grid item sm={6} xs={12} md={6} lg={12}>
//                 <TotalIncomeDarkCard isLoading={isLoading} />
//               </Grid>
//               <Grid item sm={6} xs={12} md={6} lg={12}>
//                 <TotalIncomeLightCard
//                   {...{
//                     isLoading: isLoading,
//                     total: 203,
//                     label: 'Total Income',
//                     icon: <StorefrontTwoToneIcon fontSize="inherit" />
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//       <Grid item xs={12}>
//         <Grid container spacing={gridSpacing}>
//           <Grid item xs={12} md={8}>
//             <TotalGrowthBarChart isLoading={isLoading} />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <PopularCard isLoading={isLoading} />
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default Dashboard;
