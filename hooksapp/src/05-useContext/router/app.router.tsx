import {createBrowserRouter, Navigate} from 'react-router';
import {AboutPage} from '../pages/about/AboutPage';
import {ProfilePage} from '../pages/profile/ProfilePage';
import {LoginPage} from '../pages/auth/LoginPage';
import {PrivateRoutes} from './PrivateRoutes';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AboutPage />,
  },
  {
    path: '/profile',
    element: <PrivateRoutes element={<ProfilePage />} />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
