import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ReviewManagement from '../components/ReviewManagement';
import MixManagement from '../components/MixManagement';
import ReviewForm from '../components/ReviewForm';
import MixDetails from '../components/MixDetails';
import MixForm from '../components/MixForm'

import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "/review/new",
        element: <ReviewForm />,
      },
      {
        path: "/mixes/:mixId",
        element: <MixDetails />,
      },
      {
        path: "/mix/new",
        element: <MixForm />,
      },
      {
        path: "/reviews/manage",
        element: <ReviewManagement />,
      },
      {
        path: "/mixes/manage",
        element: <MixManagement />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);