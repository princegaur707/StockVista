import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import './index.css';
// Import child components
import MarketTrendChart from './components/graph';


function MarketDepth() {

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
              <Typography className="heading-dashboard">Market Trend</Typography>
            </div>
          </Box>
          <MarketTrendChart></MarketTrendChart>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MarketDepth;