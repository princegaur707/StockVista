import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
const apiUrl = import.meta.env.VITE_API_URL;

const Sidebar = () => {
  // State to track the active box
  const [activeBox, setActiveBox] = useState(0);
  const navigate = useNavigate();

  // Function to handle click and redirect
  const handleClick = (index) => {
    setActiveBox(index);

    // Redirect logic for specific boxes
    if (index === 0) {
      navigate('/dashboard/default') // Redirect for the first box
    } else if (index === 1) {
      navigate('/investor'); // Redirect for the second box
    }  else if (index === 2) {
      navigate('/intraday'); // Redirect for the second box
    } else if (index === 3) {
      navigate('/sector'); // Redirect for the second box
    } else if (index === 4) {
      navigate('/ranking'); // Redirect for the second box
    } else if (index === 6) {
      navigate('/market-view'); // Redirect for the second box
    } else if (index === 7) {
      navigate('/account'); // Redirect for the second box
    } else if (index === 8) {
      navigate('/about-us'); // Redirect for the second box
    }else {
      console.log(`Redirecting to page ${index + 1}`); // Placeholder for other boxes
    }
  };

  return (
    <Box
      sx={{
        top: '50px',
        width: 70,
        height: '100vh',
        bgcolor: '#1D1E20',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '51px',
        position: 'fixed',
      }}
    >
      {/* Box 1 */}
      <Box
        onClick={() => handleClick(0)} // Click handler for second box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          marginBottom: '33px',
          cursor: 'pointer', // Pointer cursor for clickable effect
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            border: activeBox === 0 ? '1px solid #FFD56B' : 'none', // Dynamic border
            borderRadius: '7px',
          }}
        >
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="7"
            fill="#26282B"
            stroke={activeBox === 0 ? '#FFD56B' : 'none'}
            strokeWidth="2"
          />
        </svg>
      </Box>

      {/* Box 2 */}
      <Box
        onClick={() => handleClick(1)} // Click handler for second box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          marginBottom: '33px',
          cursor: 'pointer', // Pointer cursor for clickable effect
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            border: activeBox === 1 ? '1px solid #FFD56B' : 'none', // Dynamic border
            borderRadius: '7px',
          }}
        >
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="7"
            fill="#26282B"
            stroke={activeBox === 1 ? '#FFD56B' : 'none'}
            strokeWidth="2"
          />
        </svg>
      </Box>

      {/* Box 3 */}
      <Box
        onClick={() => handleClick(2)} // Click handler for second box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          marginBottom: '33px',
          cursor: 'pointer', // Pointer cursor for clickable effect
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            border: activeBox === 2 ? '1px solid #FFD56B' : 'none', // Dynamic border
            borderRadius: '7px',
          }}
        >
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="7"
            fill="#26282B"
            stroke={activeBox === 2 ? '#FFD56B' : 'none'}
            strokeWidth="2"
          />
        </svg>
      </Box>

      {/* Box 4 */}
      <Box
        onClick={() => handleClick(3)} // Click handler for second box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          marginBottom: '33px',
          cursor: 'pointer', // Pointer cursor for clickable effect
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            border: activeBox === 3 ? '1px solid #FFD56B' : 'none', // Dynamic border
            borderRadius: '7px',
          }}
        >
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="7"
            fill="#26282B"
            stroke={activeBox === 3 ? '#FFD56B' : 'none'}
            strokeWidth="2"
          />
        </svg>
      </Box>

      {/* Box 5 */}
      <Box
        onClick={() => handleClick(4)} // Click handler for second box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          marginBottom: '33px',
          cursor: 'pointer', // Pointer cursor for clickable effect
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            border: activeBox === 4 ? '1px solid #FFD56B' : 'none', // Dynamic border
            borderRadius: '7px',
          }}
        >
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="7"
            fill="#26282B"
            stroke={activeBox === 4 ? '#FFD56B' : 'none'}
            strokeWidth="2"
          />
        </svg>
      </Box>

      <Box sx={{ flexGrow: 0.8 }} />

      {/* Bottom Boxes */}
      {[0, 1].map((index) => (
        <Box
          key={6 + index}
          onClick={() => handleClick(6 + index)} // Click handler
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            marginBottom: index === 0 ? '32px' : '40px',
            cursor: 'pointer', // Pointer cursor for clickable effect
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              border: activeBox === 6 + index ? '1px solid #FFD56B' : 'none', // Dynamic border
              borderRadius: '7px',
            }}
          >
            <rect
              x="1"
              y="1"
              width="38"
              height="38"
              rx="7"
              fill="#26282B"
              stroke={activeBox === 6 + index ? '#FFD56B' : 'none'}
              strokeWidth="2"
            />
          </svg>
        </Box>
      ))}
    </Box>
  );
};

export default Sidebar;
