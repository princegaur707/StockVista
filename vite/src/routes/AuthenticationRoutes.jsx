import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
// const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication3/Login3')));
// const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication3/Register3')));
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
const LandingPage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login/login3',
      element: <Login />
    },
    {
      path: '/pages/register/register3',
      element: <Register />
    },
    {
      path: '/landing', // New path for the landing page
      element: <LandingPage />
    },
  ]
};

export default AuthenticationRoutes;
