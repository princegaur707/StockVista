// material-ui
import React, { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Table,TableBody,TableCell,TableContainer, TableHead,TableRow, Paper} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './components/MonthlyBarChart';
import ReportAreaChart from './components/ReportAreaChart';
import UniqueVisitorCard from './components/UniqueVisitorCard';
import SaleReportCard from './components/SaleReportCard';
import OrdersTable from './components/OrdersTable';
import MarketDataTable from "./components/MarketData";
import HistoricalDataTable from "./components/HistoricalData";
import Fundamental from "./components/Fundamental";
import CandlestickChart from './components/CandleStickChart';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [selected, setSelected] = useState("tabular"); // Hooks are now correctly placed inside the component
  const [isHomePage, setIsHomePage] = useState(true);
  const [token, setToken] = useState("");

  const updateToken = (_token) => {
    setToken(_token);
    setIsHomePage(false);
    setSelected("tabular");
  };
  const [indicesData, setIndicesData] = useState({
    NIFTY: { LTP: "24962.10", Change: "-51.05", 'Change %': "-0.20%" },
    SENSEX: { LTP: "81385.40", Change: "-249.41", 'Change %': "-0.31%" },
    BANKNIFTY: { LTP: "50957.40", Change: "-63.60", 'Change %': "-0.12%" },
    'NIFTY MIDCAP': { LTP: "59055.65", Change: "519.75", 'Change %': "0.89%" }
  });
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8001/ws/stock-indices-feed/');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setIndicesData((prevData) => ({
        ...prevData,
        [data.Name]: {
          LTP: data.LTP,
          Change: data.Change,
          'Change %': data['Change %']
        }
      }));
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  const handleChange1 = (event) => {
    setSelected(event.target.value);
  };
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="NIFTY 50"
          count={`₹${indicesData.NIFTY.LTP}`}
          percentage={parseFloat(indicesData.NIFTY['Change %'])}
          isLoss={parseFloat(indicesData.NIFTY['Change %']) < 0}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="SENSEX"
          count={`₹${indicesData.SENSEX.LTP}`}
          percentage={parseFloat(indicesData.SENSEX['Change %'])}
          isLoss={parseFloat(indicesData.SENSEX['Change %']) < 0}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="NIFTY BANK"
          count={`₹${indicesData.BANKNIFTY.LTP}`}
          percentage={parseFloat(indicesData.BANKNIFTY['Change %'])}
          isLoss={parseFloat(indicesData.BANKNIFTY['Change %']) < 0}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="NIFTY MIDCAP 100"
          count={`₹${indicesData['NIFTY MIDCAP'].LTP}`}
          percentage={parseFloat(indicesData['NIFTY MIDCAP']['Change %'])}
          isLoss={parseFloat(indicesData['NIFTY MIDCAP']['Change %']) < 0}
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {/* <Tab label="Live" value="1" /> */}
            <Tab label="Top Gainers" value="1" />
            <Tab label="Top Losers" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box
          sx={{
            // minHeight: "100vh", // Full viewport height
            display: "flex",
            justifyContent: "start",
            alignItems: "flex-start", // Align items at the top
            flexDirection: "column",
            // width: "100vw",//this line is making table go out of screen
            paddingTop: 1, // Add some padding at the top
            position: "relative",
          }}
        >
          <Container >
            <Typography variant="h5" align="left" gutterBottom>
              {!isHomePage ? (
                <div className="container">
                  <span>Historical Data</span>
                  <span
                    onClick={() => {
                      setIsHomePage(true);
                      setSelected(true);
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        position: 'absolute', // Position the button absolutely
                        top: 50, // Adjust as needed
                        right: 16, // Adjust as needed
                      }}
                    onClick={() => {
                      setIsHomePage(true);
                      setSelected(true);
                    }}
                  >
                    Home
                  </Button>
                  </span>
                </div>
              ) : (
                ""
              )}
            </Typography>
            {!isHomePage && (
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Select preference
                </FormLabel>
                <RadioGroup
                  onChange={handleChange1}
                  defaultValue="tabular"
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="tabular"
                    control={<Radio />}
                    label="Tabular View"
                  />

                  <FormControlLabel
                    value="graphical"
                    control={<Radio />}
                    label="Graphical View"
                  />
                  <FormControlLabel
                    value="fundamental"
                    control={<Radio />}
                    label="Fundamental"
                  />
                </RadioGroup>
              </FormControl>
            )}

            {isHomePage ? (
              <MarketDataTable updateToken={updateToken} />
            ) : selected === "tabular" ? (
              <HistoricalDataTable token={token} />
            ) : selected === "graphical" ? (
              <CandlestickChart token={token} />
            ) : (
              <Fundamental token={token} />
            )}
          </Container>
      </Box>
      </TabPanel>
      <TabPanel value="2">
        <Box
          sx={{
            // minHeight: "100vh", // Full viewport height
            display: "flex",
            justifyContent: "start",
            alignItems: "flex-start", // Align items at the top
            flexDirection: "column",
            // width: "100vw",//this line is making table go out of screen
            paddingTop: 1, // Add some padding at the top
            position: "relative",
          }}
          >
          <Container >
            <Typography variant="h5" align="left" gutterBottom>
              {!isHomePage ? (
                <div className="container">
                  <span>Historical Data</span>
                  <span
                    onClick={() => {
                      setIsHomePage(true);
                      setSelected(true);
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        position: 'absolute', // Position the button absolutely
                        top: 50, // Adjust as needed
                        right: 16, // Adjust as needed
                      }}
                    onClick={() => {
                      setIsHomePage(true);
                      setSelected(true);
                    }}
                  >
                    Home
                  </Button>
                  </span>
                </div>
              ) : (
                ""
              )}
            </Typography>
            {!isHomePage && (
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Select preference
                </FormLabel>
                <RadioGroup
                  onChange={handleChange1}
                  defaultValue="tabular"
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="tabular"
                    control={<Radio />}
                    label="Tabular View"
                  />

                  <FormControlLabel
                    value="graphical"
                    control={<Radio />}
                    label="Graphical View"
                  />
                  <FormControlLabel
                    value="fundamental"
                    control={<Radio />}
                    label="Fundamental"
                  />
                </RadioGroup>
              </FormControl>
            )}

            {isHomePage ? (
              <MarketDataTable updateToken={updateToken} />
            ) : selected === "tabular" ? (
              <HistoricalDataTable token={token} />
            ) : selected === "graphical" ? (
              <CandlestickChart token={token} />
            ) : (
              <Fundamental token={token} />
            )}
          </Container>
      </Box>
    </TabPanel>
        </TabContext>
      </Box>
      
    
      {/* <Grid item xs={12} md={7} lg={8}>
        <UniqueVisitorCard />
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">
                This Week Statistics
              </Typography>
              <Typography variant="h3">$7,650</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid> */}

      {/* row 3 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid> */}

      {/* row 4 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <SaleReportCard />
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Transaction History</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid> */}
    </Grid>
  );
}
