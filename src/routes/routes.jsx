import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import DonationRequests from "../pages/DonationRequests/DonationRequests";
import SearchResults from "../pages/SearchResults/SearchResults";
import DonationRequestDetails from "../pages/DonationRequests/DonationRequestDetails";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/donation-requests",
        element: <DonationRequests />,
      },
      {
        path: "/search-results",
        element: <SearchResults />,
      },
      {
        path: "/blood-request-details/:id",
        element: <DonationRequestDetails />,
      },
    ],
  },
]);
