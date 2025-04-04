import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
import ProtectedRoute from 'views/pages/authentication3/ProtectedRoute.jsx';
const Dashboard = Loadable(lazy(() => import('views/dashboard')));
const Ledger = Loadable(lazy(() => import('views/ledger')));
const MarketDepth = Loadable(lazy(() => import('views/MarketDepth')));
const InvestorArea = Loadable(lazy(() => import('views/Investor')));
const Calculator = Loadable(lazy(() => import('views/Calculator')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // {
    //   path: '/',
    //   element: <DashboardDefault />
    // },
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        }
      ]
    },
    {
      path: 'ledger',
      children: [
        {
          path: '',
          element: (
            <ProtectedRoute>
              <Ledger />
            </ProtectedRoute>
          ),
        }
      ]
    },
    {
      path: 'market',
      children: [
        {
          path: '',
          element: (
            <ProtectedRoute>
              <MarketDepth />
            </ProtectedRoute>
          ),
        }
      ]
    },
    {
      path: 'investor',
      children: [
        {
          path: '',
          element: (
            <ProtectedRoute>
              <InvestorArea />
            </ProtectedRoute>
          ),
        }
      ]
    },
    {
      path: 'calculator',
      children: [
        {
          path: '',
          element: (
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          ),
        }
      ]
    },
    // {
    //   path: 'utils',
    //   children: [
    //     {
    //       path: 'util-shadow',
    //       element: <UtilsShadow />
    //     }
    //   ]
    // },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'tabler-icons',
    //       element: <UtilsTablerIcons />
    //     }
    //   ]
    // },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'material-icons',
    //       element: <UtilsMaterialIcons />
    //     }
    //   ]
    // },
    // {
    //   path: 'sample-page',
    //   element: <SamplePage />
    // }
  ]
};

export default MainRoutes;
