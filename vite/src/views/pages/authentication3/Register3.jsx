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
import './Register3.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [errorFontSize, setErrorFontSize] = useState('5px');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error
    setErrorFontSize('5px');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setErrorFontSize('12px');
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/service/signup/`,
        { username, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // Redirect on successful signup
      navigate('/pages/login/login3');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Signup failed.');
      setErrorFontSize('12px');
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
      }}
    >
      <Box 
        sx={{
          width: 620,
          height: 600,
          padding: '20px 80px',
          gap: '10px',
          backgroundColor: '#141516',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderRadius: 2,
          textAlign: 'center',
          border: '1px solid #313437',
        }}
      >
        <div className="SignupPage">
          <Typography 
            variant="h4"
            sx={{ color: '#ffffff', mb: 4, textAlign: 'left' }}
          >
            Sign up
          </Typography>
        </div>
        

        <form onSubmit={handleSubmit} className="FormInput">
          {/* Username Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 1,
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

          {/* Email Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 2,
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

          {/* Password Input */}
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 2,
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

          {/* Confirm Password Input */}
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              sx={{ color: 'red', mb: 2, textAlign: 'left', fontSize: errorFontSize }}
            >
              {error}
            </Typography>
          )}

          {/* Signup Button */}
          <Button
            fullWidth
            type="submit"
            variant="outlined"
            sx={{
              color: '#ffffff',
              fontFamily: 'figtree',
              fontSize: '14px',
              borderColor: '#ffffff',
              mb: 2,
              '&:hover': {
                backgroundColor: '#ffffff',
                color: '#1e1e1e',
              },
            }}
          >
            SIGN UP
          </Button>
        </form>

        {/* Divider with "OR" text */}
        <div
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
        </div>

        {/* Google Signup Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: '#ffffff',
            borderColor: '#ffffff',
            mt: 3,
            fontFamily: 'figtree',
            fontSize: '14px',
            mb: 1,
            '&:hover': {
              backgroundColor: '#ffffff',
              color: '#1e1e1e',
            },
          }}
        >
          SIGN UP USING GOOGLE ACCOUNT
        </Button>

        <div className='Signuplogin'>
          {/* Link to Login */}
          <Typography
            variant="body2"
            sx={{ color: '#ffffff', fontSize: '12px', mt: 2, textAlign: 'center' }}
          >
            Already have an account? <Link to="/pages/login/login3" style={{ color: '#00aaff' }}>Login</Link>
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default Register;
