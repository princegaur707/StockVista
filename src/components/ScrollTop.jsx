import PropTypes from 'prop-types';
import { useEffect } from 'react';

// ==============================|| NAVIGATION - SCROLL TO TOP ||============================== //

const ScrollTop = ({ children }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  // Inline styles to hide scrollbar
  const scrollStyle = {
    height: '100vh', // Full height to enable scrolling
    overflow: 'auto', // Enable scrolling
    scrollbarWidth: 'none', // Hide scrollbar for Firefox
    msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
  };
  //Scroll bar updated version1
  // For Webkit browsers (Chrome, Safari)
  const webkitScrollStyle = {
    '&::-webkit-scrollbar': {
      display: 'none', // Hide scrollbar for WebKit browsers
    },
  };

  return (
    <div style={{ ...scrollStyle, ...webkitScrollStyle }}>
      {children}
    </div>
  );
  // return children || null; //original
};

ScrollTop.propTypes = {
  children: PropTypes.node
};

export default ScrollTop;
