import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import './Login3.css';

const Login = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212', // Dark background color
      }}
    >
      <Box
        sx={{
          width: 720,                   // Fixed width
          height: 648,                  // Fixed height
          padding: '80px 100px',        // Padding
          gap: '40px',                  // Gap
          backgroundColor: '#141516',   // Darker background for the card
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderRadius: 2,
          textAlign: 'center',
          border: '1px solid #313437',  // Border color
        }}
      >
        <Typography variant="h4" sx={{ color: '#ffffff', mb: 2, textAlign: 'left'}}>
          Login
        </Typography>

        
        <div className='FormInput'>
          {/* Email ID Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Email ID"
            sx={{
              mb: 2,
              backgroundColor: '#141516', // Match the card's background color
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516', // Explicitly set background color
                '& fieldset': {
                  borderColor: '#ffffff',
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff',
                }
              },
              input: { color: '#ffffff' }
            }}
          />

        {/* Password Input */}
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          placeholder="Password"
          sx={{
            mb: 3,
            backgroundColor: '#141516',
            '& .MuiOutlinedInput-root': {
              color: '#ffffff',
              backgroundColor: '#141516',
              '& fieldset': {
                borderColor: '#ffffff',
              },
              '&:hover fieldset': {
                borderColor: '#ffffff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ffffff',
              }
            },
            input: { color: '#ffffff' }
          }}
        />
        </div>


        {/* Login Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: '#ffffff',
            borderColor: '#ffffff',
            mb: 2,
            '&:hover': {
              backgroundColor: '#ffffff',
              color: '#1e1e1e'
            }
          }}
        >
          LOGIN
        </Button>

        {/* Divider with "OR" text */}
        <div className="DividerContainer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Divider sx={{ color: '#ffffff', my: 2, borderColor: '#ffffff', flex: 1 }} />
          <span style={{ margin: '0 10px', color: '#ffffff' }}>OR</span>
          <Divider sx={{ color: '#ffffff', my: 2, borderColor: '#ffffff', flex: 1 }} />
        </div>

        


        {/* Google Login Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: '#ffffff' ,
            borderColor: '#ffffff',
            mb: 2,
            '&:hover': {
              backgroundColor: '#ffffff',
              color: '#1e1e1e'
            }
          }}
        >
          SIGN IN USING GOOGLE ACCOUNT
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
