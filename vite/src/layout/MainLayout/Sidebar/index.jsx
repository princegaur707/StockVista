import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import crownIcon from 'assets/images/sidebar/crownicon.svg';
import ledgerIcon from 'assets/images/sidebar/ledgerIcon.svg';
import marketIcon from 'assets/images/sidebar/marketIcon.svg';
import investorIcon from 'assets/images/sidebar/investorIcon.png';
import calculatorIcon from 'assets/images/sidebar/calculatorIcon.png';

const sidebarItems = [
  {
    id: 0,
    path: '/dashboard',
    type: 'img',
    icon: crownIcon,
    alt: 'Dashboard',
    // Custom styles can be added if needed per item.
    boxStyles: { marginTop: '25px', marginBottom: '10px', height: '45px' },
    imageStyles: { width: '45px', height: '45px' }
  },
  {
    id: 1,
    path: '/ledger',
    type: 'img',
    icon: ledgerIcon,
    alt: 'Ledger',
    boxStyles: { marginTop: '10px', marginBottom: '5px', height: '50px' },
    imageStyles: { width: '45px', height: '42px' }
  },
  {
    id: 2,
    path: '/market',
    type: 'img',
    icon: marketIcon,
    alt: 'Market',
    boxStyles: { marginTop: '10px', marginBottom: '10px', height: '50px' },
    imageStyles: { width: '45px', height: '45px' }
  },
  {
    id: 3,
    path: '/investor',
    type: 'img',
    icon: investorIcon,
    alt: 'Investor',
    boxStyles: { marginTop: '10px', marginBottom: '10px', height: '50px' },
    imageStyles: { width: '45px', height: '45px' }
  },

  {
    id: 4,
    path: '/calculator',
    type: 'img',
    icon: calculatorIcon,
    alt: 'Calculator',
    boxStyles: { marginTop: '10px', marginBottom: '10px', height: '50px' },
    imageStyles: { width: '40px', height: '45px' }
  },
  // {
  //   id: 6,
  //   path: '/market-view',
  //   type: 'svg',
  //   boxStyles: { marginTop: '20px', marginBottom: '20px', height: '40px', width: '40px' },
  // },
  // {
  //   id: 7,
  //   path: '/account',
  //   type: 'svg',
  //   boxStyles: { marginTop: '20px', marginBottom: '20px', height: '40px', width: '40px' },
  // },
  // {
  //   id: 8,
  //   path: '/about-us',
  //   type: 'svg',
  //   boxStyles: { marginTop: '20px', marginBottom: '20px', height: '40px', width: '40px' },
  // },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Derives the active sidebar item based on the current URL.
  // This ensures that even if the page is refreshed,
  // the correct tab remains active.
  const getActiveBox = useCallback(() => {
    const currentPath = location.pathname;
    const activeItem = sidebarItems.find((item) => currentPath.startsWith(item.path));
    return activeItem ? activeItem.id : 0;
  }, [location.pathname]);

  const activeBox = getActiveBox();

  // Handles click events and navigates immediately,
  // decoupling the sidebar's active state from any data loading delays.
  const handleClick = useCallback(
    (path) => {
      if (path) {
        navigate(path);
      }
    },
    [navigate]
  );

  // Renders a sidebar item using common styles.
  const renderItem = (item) => {
    const isActive = activeBox === item.id;

    // Common style for the active state.
    const commonStyles = {
      border: isActive ? '1px solid #FFD56B' : 'none',
      borderRadius: '7px',
      padding: '5px'
    };

    return (
      <Box
        key={item.id}
        onClick={() => handleClick(item.path)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          transition: 'all 0.3s ease',
          // backgroundColor: isActive ? '#26282B' : 'transparent',
          ...item.boxStyles // Custom per-item box styles (height, margins)
        }}
      >
        {item.type === 'img' ? (
          <img
            src={item.icon}
            alt={item.alt}
            style={{
              ...item.imageStyles,
              ...commonStyles
            }}
          />
        ) : (
          <svg
            width={item.boxStyles.width || '40px'}
            height={item.boxStyles.height || '40px'}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={commonStyles}
          >
            <rect x="1" y="1" width="38" height="38" rx="7" fill="#26282B" stroke={isActive ? '#FFD56B' : 'none'} strokeWidth="2" />
          </svg>
        )}
      </Box>
    );
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
        position: 'fixed'
      }}
    >
      {sidebarItems.map(renderItem)}
    </Box>
  );
};

export default Sidebar;
