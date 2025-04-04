import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AuthContext from '../authentication/auth-forms/AuthContext.jsx'; // Import your AuthContext
const apiUrl = import.meta.env.VITE_API_URL;
import './Login3.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      console.log("Login successful, redirecting to dashboard...");
      navigate('/dashboard');
      console.log("Navigation called");
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  

  return (
    <Box
      className="loginPage"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212'
      }}
    >
      <Box
        sx={{
          width: 620,
          height: 548,
          padding: '40px 80px',
          gap: '30px',
          backgroundColor: '#141516',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderRadius: 2,
          textAlign: 'center',
          border: '1px solid #313437'
        }}
      >
        <Box className="login-heading">
          <Typography variant="h4" sx={{ color: '#ffffff', mb: 6, textAlign: 'left' }}>
            Login
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="FormInput">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"  // Added autocomplete for username
            sx={{
              mb: 2,
              backgroundColor: '#141516',
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516',
                '& fieldset': { borderColor: '#F5F5DC' },
                '&:hover fieldset': { borderColor: '#ffffff' },
                '&.Mui-focused fieldset': { borderColor: '#ffffff' }
              },
              input: { color: '#ffffff' }
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"  // Added autocomplete for current password
            sx={{
              mb: 3,
              backgroundColor: '#141516',
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516',
                '& fieldset': { borderColor: '#F5F5DC' },
                '&:hover fieldset': { borderColor: '#ffffff' },
                '&.Mui-focused fieldset': { borderColor: '#ffffff' }
              },
              input: { color: '#ffffff' }
            }}
          />

          {error && <Typography sx={{ color: 'red', mb: 2, textAlign: 'left' }}>{error}</Typography>}

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
              '&:hover': { backgroundColor: '#ffffff', color: '#1e1e1e' }
            }}
          >
            LOGIN
          </Button>
        </form>

        <div
          className="DividerContainer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Divider sx={{ color: '#777C81', my: 3, borderColor: '#777C81', flex: 1 }} />
          <span style={{ margin: '0 10px', color: '#ffffff' }}>OR</span>
          <Divider sx={{ color: '#777C81', my: 3, borderColor: '#777C81', flex: 1 }} />
        </div>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: '#ffffff',
            borderColor: '#ffffff',
            mt: 3,
            fontFamily: 'figtree',
            fontSize: '14px',
            mb: 2,
            '&:hover': { backgroundColor: '#ffffff', color: '#1e1e1e' }
          }}
          onClick={() => navigate('/register')}
        >
          SIGN UP 
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
