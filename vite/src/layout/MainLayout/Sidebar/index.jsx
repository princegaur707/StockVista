import { Box } from '@mui/material';

const Sidebar = () => {
  return (
    <Box
      sx={{
        top: '25px',
        width: 80,
        height: '100vh',
        bgcolor: '#1D1E20',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '51px',
        position: 'fixed',
      }}
    >
      {/* Active item with yellow stroke */}
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1,
          backgroundColor: '#26282B',
          border: '2px solid #FFD56B',
          marginBottom: '33px',
        }}
      />
      {/* Inactive items */}
      {[...Array(5)].map((_, index) => (
        <Box
          key={index}
          sx={{
            width: 30,
            height: 30,
            borderRadius: 1,
            backgroundColor: '#26282B',
            marginBottom: '33px',
          }}
        />
      ))}
      {/* Bottom items */}
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1,
          backgroundColor: '#26282B',
          marginBottom: '32px',
        }}
      />
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1,
          backgroundColor: '#26282B',
          marginBottom: '40px',
        }}
      />
    </Box>
  );
};

export default Sidebar;

// import PropTypes from 'prop-types';

// // material-ui
// import { useTheme } from '@mui/material';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import Stack from '@mui/material/Stack';
// import useMediaQuery from '@mui/material/useMediaQuery';

// // third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import { BrowserView, MobileView } from 'react-device-detect';

// // project imports
// import MenuCard from './MenuCard';
// import MenuList from './MenuList';
// import LogoSection from '../LogoSection';
// import Chip from 'ui-component/extended/Chip';

// import { drawerWidth } from 'store/constant';

// // ==============================|| SIDEBAR DRAWER ||============================== //

// const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
//   const theme = useTheme();
//   const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

//   const drawer = (
//     <>
//       <Box sx={{ display: { xs: 'block', md: 'none'}}}>
//         <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
//           <LogoSection />
//         </Box>
//       </Box>
//       <BrowserView>
//         <PerfectScrollbar
//           component="div"
//           style={{
//             height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
//             paddingLeft: '16px',
//             paddingRight: '16px'
//           }}
//         >
//           <MenuList />
//           <MenuCard />
//           <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
//             <Chip label={import.meta.env.VITE_APP_VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer' }} />
//           </Stack>
//         </PerfectScrollbar>
//       </BrowserView>
//       <MobileView>
//         <Box sx={{ px: 2 }}>
//           <MenuList />
//           <MenuCard />
//           <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
//             <Chip label={import.meta.env.VITE_APP_VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer' }} />
//           </Stack>
//         </Box>
//       </MobileView>
//     </>
//   );

//   const container = window !== undefined ? () => window.document.body : undefined;

//   return (
//     <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
//       <Drawer
//         container={container}
//         variant={matchUpMd ? 'persistent' : 'temporary'}
//         anchor="left"
//         open={drawerOpen}
//         onClose={drawerToggle}
//         sx={{
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//             background: theme.palette.background.default,
//             color: theme.palette.text.primary,
//             borderRight: 'none',
//             [theme.breakpoints.up('md')]: {
//               top: '88px'
//             }
//           }
//         }}
//         ModalProps={{ keepMounted: true }}
//         color="inherit"
//       >
//         {drawer}
//       </Drawer>
//     </Box>
//   );
// };

// Sidebar.propTypes = {
//   drawerOpen: PropTypes.bool,
//   drawerToggle: PropTypes.func,
//   window: PropTypes.object
// };

// export default Sidebar;
