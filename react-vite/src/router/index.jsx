import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ReviewManagement from '../components/ReviewManagement';
import MixManagement from '../components/MixManagement';
import ReviewForm from '../components/ReviewForm';
import MixDetails from '../components/MixDetails';
import MixForm from '../components/MixForm'
import MixList from '../components/MixList'
import MixSongs from '../components/MixSongs'
import ReviewList from '../components/ReviewList'
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MixList />,
      },
      {
        path: "/mixes/:mixId/view",
        element: <MixSongs />,
      },
      {
        path: "/reviews/browse",
        element: <ReviewList />,
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