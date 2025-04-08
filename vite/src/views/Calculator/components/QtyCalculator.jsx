import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import './calculator.css';

const QtyCalculator = () => {
  const [capital, setCapital] = useState(localStorage.getItem('capital') || 100000);
  const [riskPerTrade, setRiskPerTrade] = useState(localStorage.getItem('riskPerTrade') || 0.5);
  const [cmp, setCmp] = useState('');
  const [sl, setSl] = useState('');
  const [quantity, setQuantity] = useState(null);

  useEffect(() => {
    localStorage.setItem('capital', capital);
    localStorage.setItem('riskPerTrade', riskPerTrade);
  }, [capital, riskPerTrade]);

  const handleCalculate = () => {
    const riskAmount = (capital * riskPerTrade) / 100;
    const riskPerShare = cmp - sl;

    if (riskPerShare > 0) {
      setQuantity(Math.floor(riskAmount / riskPerShare));
    } else {
      setQuantity(null);
      alert('Stop clause should be less than CMP');
    }
  };

  return (
    <Container maxWidth="xs">
      <Card sx={{ mt: 4, p: 1, boxShadow: 3, borderRadius: 3, background: '#1e1f22', color: '#fff' }}>
        <CardContent>
          <Typography
            variant="body1"
            sx={{
              color: '#FFC42B',
              fontFamily: 'Figtree',
              fontWeight: 500,
              fontSize: '1.5rem',
              marginBottom: '12px'
            }}
          >
            Quantity Calculator
          </Typography>
          <TextField
            label="Capital"
            type="number"
            fullWidth
            margin="normal"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            
          />
          <TextField
            label="Risk Per Trade (%)"
            type="number"
            fullWidth
            margin="normal"
            value={riskPerTrade}
            onChange={(e) => setRiskPerTrade(e.target.value)}
          />
          <TextField
            label="Current Market Price"
            type="number"
            fullWidth
            margin="normal"
            value={cmp}
            onChange={(e) => setCmp(e.target.value)}
          />
          <TextField
            label="Stop Clause"
            type="number"
            fullWidth
            margin="normal"
            value={sl}
            onChange={(e) => setSl(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={handleCalculate}
            size="small"
            sx={{
              fontFamily: 'Figtree',
              width: '10rem',
              height: '35px', // set to match TextField height
              border: '1px solid',
              fontSize: '14px',
              // borderImage: 'linear-gradient(93.4deg, #FFC42B 0%, #FFD567 50%, #FFC42B 100%)',
              borderImageSlice: 1,
              marginTop: '14px',
              // color: '#FFC42B',
              color: '#FFFFFF',
              // backgroundColor: '#231E13',
              backgroundColor: '#1d1e20',
              '&:hover': {
                backgroundColor: '#ffffff',
                color: '#1e1e1e'
                // backgroundColor: 'rgba(255, 196, 43, 0.1)',
                // borderImage: 'linear-gradient(93.4deg, #FFC42B 100%, #FFD567 100%, #FFC42B 100%)',
                // border: 'none'
              }
            }}
          >
            Calculate Quantity
          </Button>
          {quantity !== null && (
            <Typography
              variant="h6"
              sx={{
                color: '#FFC42B',
                fontFamily: 'Figtree',
                fontWeight: 500,
                fontSize: '1.2rem',
                marginTop: '25px'
              }}
            >
              Quantity to Buy: {quantity}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default QtyCalculator;
