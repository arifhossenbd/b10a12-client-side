import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import DonationRequests from "../pages/DonationRequests/DonationRequests";
import SearchResults from "../pages/SearchResults/SearchResults";
import DonationRequestDetails from "../pages/DonationRequests/DonationRequestDetails";
import RoleBasedDashboard from "../pages/Dashboard/RoleBasedDashboard";
import PrivateRoute from "./PrivateRoute";
import AllUsers from "../pages/Dashboard/AdminDashboard/AllUsers/AllUsers";
import AllBloodDonationRequests from "../pages/Dashboard/AdminVolunteerPages/AllBloodDonationRequests/AllBloodDonationRequests";
import ContentManagement from "../pages/Dashboard/AdminVolunteerPages/ContentManagement/ContentManagement";
import AdminDashboard from "../pages/Dashboard/AdminDashboard/AdminDashboard";
import VolunteerDashboard from "../pages/Dashboard/VolunteerDashboard/VolunteerDashboard";
import Dashboard from "../pages/Dashboard/component/Dashboard";
import DonorDashboard from "../pages/Dashboard/DonorDashboard/DonorDashboard";
import MyDonationRequests from "../pages/Dashboard/DonorDashboard/MyDonationRequests/MyDonationRequests";
import Profile from "../pages/Dashboard/component/Profile";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
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
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <RoleBasedDashboard />,
      },
      // Admin routes
      {
        path: "admin",
        element: <AdminDashboard />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "all-blood-donation-request",
            element: <AllBloodDonationRequests />,
          },
          {
            path: "content-management",
            element: <ContentManagement />,
          },
        ],
      },
      // Volunteer routes
      {
        path: "volunteer",
        element: <VolunteerDashboard />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "all-blood-donation-request",
            element: <AllBloodDonationRequests />,
          },
          {
            path: "content-management",
            element: <ContentManagement />,
          },
        ],
      },
      // Donor routes
      {
        path: "donor",
        element: <DonorDashboard />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "my-donation-requests",
            element: <MyDonationRequests />,
          },
          {
            path: "create-donation-request",
            element: <ContentManagement />,
          },
        ],
      },
    ],
  },
]);
