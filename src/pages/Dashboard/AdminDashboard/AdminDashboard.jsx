import useUserRole from "../../../hooks/useUserRole";
import DashboardLayout from "../../../layout/DashboardLayout";
import {
  FaChartLine,
  FaEdit,
  FaHandsHelping,
  FaHome,
  FaUsers,
} from "react-icons/fa";
const adminNavLinks = [
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
    icon: FaUsers,
    description: "Manage users",
  },
  {
    id: 3,
    name: "All Blood Requests",
    path: "/dashboard/admin/all-blood-donation-request",
    icon: FaHandsHelping,
  },
  {
    id: 4,
    name: "Content Management",
    path: "/dashboard/admin/content-management",
    icon: FaEdit,
  },
  { id: 5, name: "Home", path: "/", icon: FaHome, exact: true },
];
const AdminDashboard = () => {
  const { userData, logout, role, user } = useUserRole();

  return (
    <DashboardLayout
      user={user}
      role={role}
      data={userData}
      logout={logout}
      navLinks={adminNavLinks}
      headerTitle="Admin Dashboard"
      welcomeMessage="Welcome Admin!"
    />
  );
};

export default AdminDashboard;
