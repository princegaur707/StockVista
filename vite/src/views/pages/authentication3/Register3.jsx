import { useState } from 'react';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
import './Register3.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation functions
  const validateUsername = (name) => {
    if (name.length < 3) return 'Username must be at least 3 characters long.';
    if (!/^\w+$/.test(name)) return 'Username can only contain letters, numbers, and underscores.';
    return '';
  };

  const validateEmail = (email) => {
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) return 'Enter a valid email address.';
    return '';
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/\d/.test(password)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    //Validate inputs
    newErrors.username = validateUsername(username);
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);
    newErrors.confirmPassword = password !== confirmPassword ? 'Passwords do not match.' : '';

    // Remove empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/service/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); // Handle invalid JSON response
        throw new Error(errorData?.detail || 'Signup failed! Please try again.');
      }

      // Redirect on successful signup
      navigate('/pages/login/login3');
    } catch (err) {
      setErrors({ api: err.message || 'Signup failed!' });
    }
  };

  return (
    <Box
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
          height: 600,
          padding: '20px 80px',
          gap: '10px',
          backgroundColor: '#141516',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderRadius: 2,
          textAlign: 'center',
          border: '1px solid #313437'
        }}
      >
        <Box className="Signup-heading">
          <Typography variant="h4" sx={{ color: '#ffffff', mb: 4, textAlign: 'left' }}>
            Sign up
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="FormInput">
          {/* Username Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Username"
            value={username}
            onBlur={() => setErrors((prev) => ({ ...prev, username: validateUsername(username) }))}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 1,
              backgroundColor: '#141516',
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516',
                '& fieldset': {
                  borderColor: '#777C81'
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff'
                }
              },
              input: { color: '#ffffff' }
            }}
          />
          {errors.username && <Typography sx={{ color: 'red', fontSize: '12px', textAlign: 'left', mb: 1 }}>{errors.username}</Typography>}

          {/* Email Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setErrors({ ...errors, email: validateEmail(email) })}
            sx={{
              mb: 2,
              backgroundColor: '#141516',
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516',
                '& fieldset': {
                  borderColor: '#777C81'
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff'
                }
              },
              input: { color: '#ffffff' }
            }}
          />
          {errors.email && <Typography sx={{ color: 'red', fontSize: '12px', textAlign: 'left', mb: 1 }}>{errors.email}</Typography>}

          {/* Password Input */}
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setErrors({ ...errors, password: validatePassword(password) })}
            sx={{
              mb: 2,
              backgroundColor: '#141516',
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516',
                '& fieldset': {
                  borderColor: '#777C81'
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff'
                }
              },
              input: { color: '#ffffff' }
            }}
          />
          {errors.password && <Typography sx={{ color: 'red', fontSize: '12px', textAlign: 'left', mb: 1 }}>{errors.password}</Typography>}

          {/* Confirm Password Input */}
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setErrors({ ...errors, confirmPassword: password !== confirmPassword ? 'Passwords do not match.' : '' })}
            sx={{
              mb: 3,
              backgroundColor: '#141516',
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#141516',
                '& fieldset': {
                  borderColor: '#777C81'
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff'
                }
              },
              input: { color: '#ffffff' }
            }}
          />

          {errors.confirmPassword && (
            <Typography sx={{ color: 'red', fontSize: '12px', textAlign: 'left', mb: 2 }}>{errors.confirmPassword}</Typography>
          )}

          {errors.api && <Typography sx={{ color: 'red', fontSize: '12px', mb: 2 }}>{errors.api}</Typography>}

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
                color: '#1e1e1e'
              }
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
            justifyContent: 'center'
          }}
        >
          <Divider sx={{ color: '#777C81', my: 3, borderColor: '#777C81', flex: 1 }} />
          <span style={{ margin: '0 10px', color: '#ffffff' }}>OR</span>
          <Divider sx={{ color: '#777C81', my: 3, borderColor: '#777C81', flex: 1 }} />
        </div>

        {/* Login Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: '#ffffff',
            borderColor: '#ffffff',
            mt: 3,
            fontFamily: 'figtree',
            fontSize: '14px',
            mb: '1px',
            '&:hover': {
              backgroundColor: '#ffffff',
              color: '#1e1e1e'
            }
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>

        {/* Link to Login */}
        {/* <div className="Signuplogin">
          <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '12px', mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00aaff' }}>
              Login
            </Link>
          </Typography>
        </div> */}
      </Box>
    </Box>
  );
};

export default Register;
