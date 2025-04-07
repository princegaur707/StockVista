import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import './index.css';

// Import child components
import MarketTrendChart from './components/graph';
import MarketTrendChartLT from './components/LTgraph';
import CurrentMarketMeter from './components/marketmeter';
import SectorTreemap from './components/sectorgraph';
import Gauge from './components/meter2';

function MarketFlow() {
  return (
    <Box
      className="scrollable"
      style={{ height: '100vh', overflowY: 'auto', marginLeft: '105px' }}
    >
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* Header */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" width="90vw" marginBottom="25px">
            <div className="dashboard-font-box">
              <Typography className="heading-dashboard">MARKET FLOW</Typography>
            </div>
          </Box>
        </Grid>

        {/* Grid for side-by-side chart display */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <MarketTrendChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <MarketTrendChartLT />
          </Grid>
        </Grid>

        <Grid container spacing={4}  marginTop={2}>
          <Grid item xs={12} md={12}>
            <SectorTreemap />
          </Grid>
        </Grid>

        <Grid container spacing={4}  marginTop={2}>
          <Grid item xs={12} md={6}>
          <CurrentMarketMeter />
          </Grid>
          <Grid item xs={12} md={6}>
          <Gauge />
          </Grid>
        </Grid>
  
      </Grid>
    </Box>
  );
}

export default MarketFlow;