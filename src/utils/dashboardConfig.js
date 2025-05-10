import {
  FaChartLine,
  FaHome,
  FaTint,
  FaHeart,
  FaUserShield,
  FaClipboardList,
  FaEdit,
  FaSyringe,
  FaFileAlt
} from "react-icons/fa";

export const dashboardConfig = {
  donor: {
    navLinks: [
      {
        id: 1,
        name: "Dashboard",
        path: "/dashboard/donor",
        icon: FaChartLine,
        description: "Overview and analytics",
        exact: true,
      },
      {
        id: 2,
        name: "My Donation Requests",
        path: "/dashboard/donor/my-donation-requests",
        icon: FaTint,
        description: "Manage donation request",
      },
      {
        id: 3,
        name: "Create Donation Requests",
        path: "/dashboard/donor/create-donation-request",
        icon: FaHeart,
        description: "Create donation request",
      },
      {
        id: 5,
        name: "Home",
        path: "/",
        icon: FaHome,
        description: "Go home page",
        exact: true,
      },
    ],
    headerTitle: "Donor Dashboard",
    welcomeMessage: "Welcome Donor!"
  },

  volunteer: {
    navLinks: [
      {
        id: 1,
        name: "Dashboard",
        path: "/dashboard/volunteer",
        icon: FaChartLine,
        exact: true,
      },
      {
        id: 2,
        name: "Donation Requests",
        path: "/dashboard/volunteer/all-blood-donation-request",
        icon: FaClipboardList,
      },
      {
        id: 3,
        name: "Content Management",
        path: "/dashboard/volunteer/content-management",
        icon: FaFileAlt,
      },
      { 
        id: 4, 
        name: "Home", 
        path: "/", 
        icon: FaHome,
        exact: true 
      },
    ],
    headerTitle: "Volunteer Dashboard",
    welcomeMessage: "Welcome Volunteer!"
  },

  admin: {
    navLinks: [
      {
        id: 1,
        name: "Dashboard",
        path: "/dashboard/admin",
        icon: FaChartLine,
        description: "Overview",
        exact: true,
      },
      {
        id: 2,
        name: "All Users",
        path: "/dashboard/admin/all-users",
        icon: FaUserShield,
        description: "Manage users",
      },
      {
        id: 3,
        name: "All Blood Requests",
        path: "/dashboard/admin/all-blood-donation-request",
        icon: FaSyringe,
      },
      {
        id: 4,
        name: "Content Management",
        path: "/dashboard/admin/content-management",
        icon: FaEdit,
      },
      { 
        id: 5, 
        name: "Home", 
        path: "/", 
        icon: FaHome,
        exact: true 
      },
    ],
    headerTitle: "Admin Dashboard",
    welcomeMessage: "Welcome Admin!"
  }
};