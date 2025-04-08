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
import CandlestickChart from './components/CandleStickChart';
import GrowthStock from './components/growthStocks';
import EarningBreakout from './components/earningBreakout';
import UnderValue from './components/underValue';
import GoodQuarter from './components/goodQuarter';
import './index.css';

// Modal style
const modalStyle = {
  outline: 'none',
  border: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '600px',
  bgcolor: '#141516',
  boxShadow: 24,
  p: 1,
  borderRadius: 1
};

function InvestorArea() {
  const [symbolToken, setSymbolToken] = useState(''); // Add symbolToken state
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState('1'); // Default to Thirty Day Table

  // Handling tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Handling modal open/close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setSymbolToken(''); // Reset symbolToken when closing modal
    setOpenModal(false);
  };

  // UseEffect to open modal when symbolToken changes
  useEffect(() => {
    if (symbolToken) {
      setOpenModal(true);
    }
  }, [symbolToken]);

  return (
    <Box className="scrollable" style={{ height: '100vh', overflowY: 'auto', marginRight: '25px', marginLeft: '105px' }}>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <div className="dashboard-font-box">
            <Typography className="heading-dashboard">INVESTOR AREA</Typography>
          </div>
        </Grid>
        <Box sx={{ width: 'auto' }}>
          <TabContext value={value}>
            <Box>
              <TabList className="tab-values" onChange={handleChange} aria-label="lab API tabs example">
                <Tab className="tabValue-head" label="Growth stocks" value="1" />
                <Tab className="tabValue-head" label="Earning Breakout" value="2" />
                <Tab className="tabValue-head" label="Undervalue stocks" value="3" />
                <Tab className="tabValue-head" label="Good Quarter stocks" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box>
                <GrowthStock />
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box>
                <EarningBreakout />
              </Box>
            </TabPanel>
            <TabPanel value="3">
              <Box>
                <UnderValue />
              </Box>
            </TabPanel>
            <TabPanel value="4">
              <Box>
                <GoodQuarter />
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>

      {/* Modal to show Candlestick Chart */}
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

export default InvestorArea;
