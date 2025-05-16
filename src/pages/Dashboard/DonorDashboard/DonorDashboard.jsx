import { FaChartLine, FaUsers } from "react-icons/fa";
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
];

const DonorDashboard = () => {
  const { userData, logout, loading, role } = useUserRole();
  return (
    <div>
      <DashboardLayout
        loading={loading}
        userData={userData}
        role={role}
        navLinks={donorNavLinks}
        logout={logout}
        headerTitle="Donor Dashboard"
        welcomeMessage="Welcome Donor!"
      />
    </div>
  );
};

export default DonorDashboard;
