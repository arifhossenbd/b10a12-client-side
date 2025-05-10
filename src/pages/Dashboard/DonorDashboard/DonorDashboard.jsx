import { FaChartLine, FaHandsHelping, FaHome, FaUsers } from "react-icons/fa";
import DashboardLayout from "../../../layout/DashboardLayout";
import useUserRole from "../../../hooks/useUserRole";

const donorNavLinks = [
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
    icon: FaUsers,
    description: "Manage donation request",
  },
  {
    id: 3,
    name: "Create Donation Requests",
    path: "/dashboard/donor/create-donation-request",
    icon: FaHandsHelping,
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
];

const DonorDashboard = () => {
  const { userData, logout, loading } = useUserRole();
  return (
    <div>
      <DashboardLayout
        loading={loading}
        userData={userData}
        navLinks={donorNavLinks}
        logout={logout}
        headerTitle="Donor Dashboard"
        welcomeMessage="Welcome Donor!"
      />
    </div>
  );
};

export default DonorDashboard;
