import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import './index.css';
import QtyCalculator from './components/QtyCalculator';

// Import child components
// import QtyCalculator from './components/QtyCalculator';

function Calculator() {
  return (
    <Box className="scrollable" style={{ height: '100vh', overflowY: 'auto', marginLeft: '105px' }}>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* Header */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" width="90vw" marginBottom="25px">
            <div className="dashboard-font-box">
              <Typography className="heading-dashboard">CALCULATOR</Typography>
            </div>
          </Box>
        </Grid>

        {/* Grid for side-by-side chart display */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <QtyCalculator />
          </Grid>
          {/* <Grid item xs={12} md={6}> */}
          {/* <MarketTrendChart /> */}
          {/* </Grid> */}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Calculator;
