import { FaChartLine, FaEdit, FaHandsHelping, FaHome } from "react-icons/fa";
import useUserRole from "../../../hooks/useUserRole";
import DashboardLayout from "../../../layout/DashboardLayout";
const volunteerLinks = [
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
    icon: FaHandsHelping,
  },
  {
    id: 3,
    name: "Content Management",
    path: "/dashboard/volunteer/content-management",
    icon: FaEdit,
  },
  { id: 4, name: "Home", path: "/", icon: FaHome, exact: true },
];
const VolunteerDashboard = () => {
  const { userData, logout, role, user, loading } = useUserRole();

  return (
    <DashboardLayout
      loading={loading}
      user={user}
      role={role}
      userData={userData}
      navLinks={volunteerLinks}
      logout={logout}
      headerTitle="Volunteer Dashboard"
      welcomeMessage="Welcome Volunteer!"
    />
  );
};

export default VolunteerDashboard;
