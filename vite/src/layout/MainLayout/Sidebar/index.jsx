import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
const apiUrl = import.meta.env.VITE_API_URL;
import crownIcon from 'assets/images/sidebar/crownicon.svg';
import ledgerIcon from 'assets/images/sidebar/ledgerIcon.svg'

const Sidebar = () => {
  // State to track the active box
  const [activeBox, setActiveBox] = useState(0);
  const navigate = useNavigate();

  // Function to handle click and redirect
  const handleClick = (index) => {
    setActiveBox(index);

    // Redirect logic for specific boxes
    if (index === 0) {
      navigate('/dashboard') // Redirect for the first box
    } else if (index === 1) {
      navigate('/ledger'); // Redirect for the second box
    }  else if (index === 2) {
      navigate('/market'); // Redirect for the second box
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
        top: '75px',
        width: '75px',
        height: '100vh',
        bgcolor: '#1D1E20',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'fixed',
      }}
    >
      {/* Box 1 */}
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Centers horizontally
            height: '45px', 
            width: '45x',
            backgroundColor: activeBox === 0? '#26282B' : 'none',
            cursor: 'pointer', // Changes cursor on hover
            padding: '0px', // Add some padding for better appearance
            transition: 'all 0.3s ease', // Smooth transition for changes
            marginTop: '30px',
            marginBottom: '25px'
          }}
          onClick={() => handleClick(0)} // Toggle active state on click
        >
        <img
          src={crownIcon}
          alt="crownIcon"
          style={{
            width: '45px',
            height: '45px',
            border: activeBox === 0 ? '1px solid #FFD56B' : 'none', // Dynamic border
            borderRadius: '7px',
            padding: '5px'
          }}
        />
      </Box>

      {/* Box 2 */}
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Centers horizontally
            height: '50px', 
            width: '50px',
            // backgroundColor: activeBox === 1? '#26282B' : 'none',
            cursor: 'pointer', // Changes cursor on hover
            padding: '0px', // Add some padding for better appearance
            transition: 'all 0.3s ease', // Smooth transition for changes
          }}
          onClick={() => handleClick(1)} // Toggle active state on click
        >
        <img
          src={ledgerIcon}
          alt="ledgerIcon"
          style={{
            width: '45px',
            height: '45px',
            border: activeBox === 1 ? '1px solid #FFD56B' : 'none', // Dynamic border
            borderRadius: '7px',
            padding: '5px'
          }}
        />
      </Box>

      {/* Box 3 */}
      <Box
        onClick={() => handleClick(2)} // Click handler for second box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1,
          marginTop: '20px',
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
      {/* <Box
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
      </Box> */}

      {/* Box 5 */}
      {/* <Box
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
      </Box> */}

      {/* <Box sx={{ flexGrow: 0.8 }} /> */}

      {/* Bottom Boxes */}
      {/* {[0, 1].map((index) => (
        <Box
          key={6 + index}
          onClick={() => handleClick(6 + index)} // Click handler
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            marginBottom:'20px',
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
      ))} */}
    </Box>
  );
};

export default Sidebar;
