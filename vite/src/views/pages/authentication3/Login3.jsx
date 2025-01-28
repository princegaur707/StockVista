import { useState } from 'react';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
const apiUrl = import.meta.env.VITE_API_URL;
import './Login3.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [errorFontSize, setErrorFontSize] = useState('5px');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error
    setErrorFontSize('5px');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/service/login/`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // Check for tokens in the response
      const { access, refresh } = response.data;

      if (access && refresh) {
        // Save tokens to localStorage or sessionStorage
        sessionStorage.setItem('accessToken', access);
        sessionStorage.setItem('refreshToken', refresh);

        // Redirect using useNavigate
        navigate('/dashboard/default');
        // console.log("HI");
      } else {
        setError('Invalid Credentials');
        setErrorFontSize('5px');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Login failed.');
      setErrorFontSize('12px');
    }
  };

  return (
    <Box className="loginPage"
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
          width: 620, // Fixed width
          height: 548, // Fixed height
          padding: '40px 80px', // Padding
          gap: '30px', // Gap
          backgroundColor: '#141516', // Darker background for the card
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderRadius: 2,
          textAlign: 'center',
          border: '1px solid #313437', // Border color
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: '#ffffff', mb: 6, textAlign: 'left' }}
        >
          Login
        </Typography>

        <form onSubmit={handleSubmit} className="FormInput">
          {/* Username Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: '#141516', // Match the card's background color
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516', // Explicitly set background color
                '& fieldset': {
                  borderColor: '#777C81',
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff',
                },
              },
              input: { color: '#ffffff' },
            }}
          />

          {/* Password Input */}
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 3,
              backgroundColor: '#141516',
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516',
                '& fieldset': {
                  borderColor: '#777C81',
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff',
                },
              },
              input: { color: '#ffffff' },
            }}
          />

          {/* Error Message */}
          {error && (
            <Typography
              variant="body2"
              sx={{ color: 'red', mb: 2, textAlign: 'left' }}
            >
              {error}
            </Typography>
          )}

          {/* Login Button */}
          <Button
            fullWidth
            type="submit"
            variant="outlined"
            sx={{
              color: '#ffffff',
              fontFamily: 'figtree',
              fontSize: '14px',
              borderColor: '#ffffff',
              mb: 4,
              '&:hover': {
                backgroundColor: '#ffffff',
                color: '#1e1e1e',
              },
            }}
          >
            LOGIN
          </Button>
        </form>

        {/* Divider with "OR" text */}
        {/* <div
          className="DividerContainer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Divider
            sx={{ color: '#777C81', my: 3, borderColor: '#777C81', flex: 1 }}
          />
          <span style={{ margin: '0 10px', color: '#ffffff' }}>OR</span>
          <Divider
            sx={{ color: '#777C81', my: 3, borderColor: '#777C81', flex: 1 }}
          />
        </div> */}

        {/* Google Login Button */}
        {/* <Button
          fullWidth
          variant="outlined"
          sx={{
            color: '#ffffff',
            borderColor: '#ffffff',
            mt: 3,
            fontFamily: 'figtree',
            fontSize: '14px',
            mb: 2,
            '&:hover': {
              backgroundColor: '#ffffff',
              color: '#1e1e1e',
            },
          }}
        >
          SIGN IN USING GOOGLE ACCOUNT
        </Button> */}
        <div className='Signuplogin'>
          {/* Link to Login */}
          <Typography
            variant="body2"
            sx={{ color: '#ffffff', fontSize: '12px', mt: 2, textAlign: 'center' }}
          >
            Don't have an account? <Link to="/pages/register/register3" style={{ color: '#00aaff' }}>Sign up</Link>
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default Login;
