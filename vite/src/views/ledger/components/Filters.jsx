import React, { useState, useRef } from 'react';
import { TextField, Box, MenuItem, Button, IconButton } from '@mui/material';
import './filters.css';
// import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';

function Filters({ onFilterChange }) {
  const defaultFilters = {
    symbol: '',
    strategy: '',
    mistake: '',
    position: '',
    durationFrom: '',
    durationTo: '',
    status: '',
    result: ''
  };

  const [filters, setFilters] = useState(defaultFilters);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Common styling for TextFields and Selects
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#141516',
      color: 'white',
      '& fieldset': {
        border: 'none'
      },
      '& .MuiOutlinedInput-input': {
        color: '#FFFFFF'
      }
    },
    '& .MuiOutlinedInput-input::placeholder': {
      color: 'white',
      opacity: 1
    },
    '& .MuiInputLabel-root': { 
      color: '#FFFFFF'
    },
    //Managing the shrunk text's color of filter
    '& .MuiInputLabel-root.Mui-focused': { 
      color: '#FFFFFF',
    },
    '& .MuiSelect-select': { 
      color: 'white' 
    },
    '& .MuiSelect-icon': { 
      color: '#FFFFFF'
    },
    '& .MuiSvgIcon-root': { 
      color: '#FFFFFF'
    }
  };
  

  const menuItemStyle = { color: '#FFFFFF' };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '88vw',
        backgroundColor: '#26282A',
        p: 0.3,
        borderRadius: 1,
        gap: 0.5
      }}
    >
      {/* Symbol */}
      <TextField
        label="Symbol"
        name="symbol"
        value={filters.symbol}
        onChange={handleChange}
        size="small"
        sx={{ flex: 0.8, minWidth: '150px', ...textFieldStyles }}
        variant="outlined"
      />

      {/* Strategy */}
      <TextField
        select
        label="Strategy"
        name="strategy"
        value={filters.strategy}
        onChange={handleChange}
        size="small"
        // InputLabelProps={{ shrink: true }}  // always show the label
        sx={{ flex: 0.8, minWidth: '150px', ...textFieldStyles }}
        variant="outlined"
      >
        <MenuItem value="" style={menuItemStyle}>
          All
        </MenuItem>
        <MenuItem value="30Day" style={menuItemStyle}>
          30 Day
        </MenuItem>
        <MenuItem value="90Day" style={menuItemStyle}>
          90 Day
        </MenuItem>
        <MenuItem value="IPO" style={menuItemStyle}>
          IPO
        </MenuItem>
        <MenuItem value="BreakoutDaily" style={menuItemStyle}>
          Breakout Soon Daily
        </MenuItem>
        <MenuItem value="BreakoutWeekly" style={menuItemStyle}>
          Breakout Soon Weekly
        </MenuItem>
        <MenuItem value="RecentBreakout" style={menuItemStyle}>
          Recent Breakout
        </MenuItem>
        <MenuItem value="BigPlayers" style={menuItemStyle}>
          Big Players Money Flow
        </MenuItem>
      </TextField>

      {/* Mistake */}
      <TextField
        select
        label="Mistake"
        name="mistake"
        value={filters.mistake}
        onChange={handleChange}
        size="small"
        sx={{ flex: 0.5, minWidth: '150px', ...textFieldStyles }}
        variant="outlined"
      >
        <MenuItem value="" style={menuItemStyle}>
          All
        </MenuItem>
        <MenuItem value="ChasingLoses" style={menuItemStyle}>
          Chasing Loses
        </MenuItem>
        <MenuItem value="RiskNeglect" style={menuItemStyle}>
          Risk Neglect
        </MenuItem>
        <MenuItem value="EmotionalTrading" style={menuItemStyle}>
          Emotional Trading
        </MenuItem>
      </TextField>

      {/* Position */}
      <TextField
        select
        label="Position"
        name="position"
        value={filters.position}
        onChange={handleChange}
        size="small"
        sx={{ flex: 0.3, minWidth: '100px', ...textFieldStyles }}
        variant="outlined"
      >
        <MenuItem value="" style={menuItemStyle}>
          All
        </MenuItem>
        <MenuItem value="LONG" style={menuItemStyle}>
          Long
        </MenuItem>
        <MenuItem value="SHORT" style={menuItemStyle}>
          Short
        </MenuItem>
      </TextField>

      {/* Duration: Combined "From" & "To" in one box */}
      <Box sx={{ display: 'flex', flex: 1, minWidth: '260px', gap: 1 }}>
        <TextField
          variant="outlined"
          type="date"
          label="from"
          name="durationFrom"
          inputRef={fromDateRef}
          onClick={() => fromDateRef.current?.showPicker()}
          value={filters.durationFrom || ''}
          onChange={handleChange}
          size="small"
          InputLabelProps={{
            shrink: true,
            style: {
              color: 'rgb(255, 255, 255)',
              marginTop: '0.5rem',
              paddingTop: '0rem',
              fontSize: '0.7rem',
              marginLeft: '-0.1rem'
            }
          }}
          sx={{ flex: 1.5, ...textFieldStyles }}
        />

        <TextField
          variant="outlined"
          type="date"
          name="durationTo"
          inputRef={toDateRef}
          onClick={() => toDateRef.current?.showPicker()}
          label="to"
          value={filters.durationTo || ''}
          onChange={handleChange}
          size="small"
          InputLabelProps={{
            shrink: true,
            style: {
              color: 'rgb(255, 255, 255)',
              marginTop: '0.5rem',
              paddingTop: '0rem',
              fontSize: '0.7rem',
              marginLeft: '-0.1rem'
            }
          }}
          sx={{ flex: 1.5, ...textFieldStyles }}
        />
      </Box>

      {/* Mistake */}
      <TextField
        select
        label="Status"
        name="status"
        value={filters.status}
        onChange={handleChange}
        size="small"
        sx={{ flex: 0.5, minWidth: '60px', ...textFieldStyles }}
        variant="outlined"
      >
        <MenuItem value="" style={menuItemStyle}>
          All
        </MenuItem>
        <MenuItem value="OPEN" style={menuItemStyle}>
          Open
        </MenuItem>
        <MenuItem value="CLOSE" style={menuItemStyle}>
          Close
        </MenuItem>
      </TextField>

      {/* Result */}
      <TextField
        select
        label="Result"
        name="result"
        value={filters.result}
        onChange={handleChange}
        size="small"
        sx={{ flex: 0.5, minWidth: '80px', ...textFieldStyles }}
        variant="outlined"
      >
        <MenuItem value="" style={menuItemStyle}>
          All
        </MenuItem>
        <MenuItem value="profit" style={menuItemStyle}>
          Profit
        </MenuItem>
        <MenuItem value="loss" style={menuItemStyle}>
          Loss
        </MenuItem>
      </TextField>

      {/* Apply Filter Button */}
      <Button
        variant="outlined"
        onClick={handleApply}
        size="small"
        sx={{
          fontFamily: 'Figtree',
          width: '7rem',
          height: '40px', // set to match TextField height
          border: '1px solid',
          fontSize: '14px',
          // borderImage: 'linear-gradient(93.4deg, #FFC42B 0%, #FFD567 50%, #FFC42B 100%)',
          borderImageSlice: 1,
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
        Apply Filter
      </Button>

      {/* Reset Icon Button */}
      <IconButton onClick={handleReset} color="primary" aria-label="reset filters">
        <Button
          variant="outlined"
          // onClick={handleApply}
          size="small"
          sx={{
            fontFamily: 'Figtree',
            width: '4rem',
            height: '40px', // set to match TextField height
            border: '1px solid',
            fontSize: '14px',
            // borderImage: 'linear-gradient(93.4deg, #FFC42B 0%, #FFD567 50%, #FFC42B 100%)',
            borderImageSlice: 1,
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
          Reset
        </Button>
        {/* <RestartAltOutlinedIcon style={{ fontSize: '25px', color: '#FFFFFF' }} /> */}
      </IconButton>
    </Box>
  );
}

export default Filters;
