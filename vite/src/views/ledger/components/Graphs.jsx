// Graphs.jsx
import React from 'react';
import { Grid } from '@mui/material';
import AccumulativeReturn from './AccumulativeReturn';
import WinsRatio from './WinsRatio';
import AverageReturn from './AverageReturn';

const Graphs = ({ trades }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <AccumulativeReturn trades={trades} />
      </Grid>
      <Grid item xs={12} md={4}>
        <WinsRatio trades={trades} />
      </Grid>
      <Grid item xs={12} md={4}>
        <AverageReturn trades={trades} />
      </Grid>
    </Grid>
  );
};

export default Graphs;
