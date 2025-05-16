import { motion } from "framer-motion";
import {
  FaChartLine,
  FaUsers,
  FaHandsHelping,
  FaHistory,
  FaTint,
} from "react-icons/fa";
import useUserRole from "../../../hooks/useUserRole";
import RoleBadge from "./RoleBadge";
import HeaderStats from "./HeaderStats";
import StatCard from "./StatCard";
import { COLORS } from "../../../utils/colorConfig";
import RecentRequests from "../DonorDashboard/RecentRequests/RecentRequests";

const Dashboard = () => {
  const { userData, role, loading } = useUserRole();

  // Stats configuration based on role
  const statsConfig = {
    volunteer: [
      {
        title: "Active Requests",
        value: "12",
        icon: FaHandsHelping,
        color: `bg-[${COLORS.primary}]/10 text-[${COLORS.primary}]`,
        borderColor: `border-[${COLORS.primary}]`,
      },
      {
        title: "Completed",
        value: "24",
        icon: FaHistory,
        color: `bg-[${COLORS.success}]/10 text-[${COLORS.success}]`,
        borderColor: `border-[${COLORS.success}]`,
      },
      {
        title: "Rating",
        value: "4.8",
        icon: FaChartLine,
        color: `bg-[${COLORS.secondary}]/10 text-[${COLORS.secondary}]`,
        borderColor: `border-[${COLORS.secondary}]`,
      },
    ],
    admin: [
      {
        title: "Total Users",
        value: "142",
        icon: FaUsers,
        color: `bg-[${COLORS.secondary}]/10 text-[${COLORS.secondary}]`,
        borderColor: `border-[${COLORS.secondary}]`,
      },
      {
        title: "Active Requests",
        value: "86",
        icon: FaHandsHelping,
        color: `bg-[${COLORS.primary}]/10 text-[${COLORS.primary}]`,
        borderColor: `border-[${COLORS.primary}]`,
      },
      {
        title: "Blood Units",
        value: "127",
        icon: FaTint,
        color: `bg-[${COLORS.error}]/10 text-[${COLORS.error}]`,
        borderColor: `border-[${COLORS.error}]`,
      },
    ],
    donor: [
      {
        title: "Total Donations",
        value: "5",
        icon: FaTint,
        color: `bg-[${COLORS.primary}]/10 text-[${COLORS.primary}]`,
        borderColor: `border-[${COLORS.primary}]`,
      },
      {
        title: "Last Donation",
        value: "2 weeks",
        icon: FaHistory,
        color: `bg-[${COLORS.success}]/10 text-[${COLORS.success}]`,
        borderColor: `border-[${COLORS.success}]`,
      },
      {
        title: "Next Eligible",
        value: "3 weeks",
        icon: FaChartLine,
        color: `bg-[${COLORS.secondary}]/10 text-[${COLORS.secondary}]`,
        borderColor: `border-[${COLORS.secondary}]`,
      },
    ],
  };

  const currentStats =
    statsConfig[role?.toLowerCase()] || statsConfig.volunteer;

  if (loading) {
    return (
      <div
        className="flex flex-col justify-center items-center h-screen"
        style={{ backgroundColor: COLORS.background }}
      >
        <span className="loading loading-ring loading-xl mx-auto"></span>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 min-h-screen"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Header with Role Badge and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <RoleBadge name={userData?.name} role={role} email={userData?.email} />
        <HeaderStats
          stats={currentStats.map((stat) => ({
            label: stat.title,
            value: stat.value,
            color: stat.color,
          }))}
        />
      </div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: COLORS.textPrimary }}
        >
          Welcome back,{" "}
          <span style={{ color: COLORS.primary }}>{userData?.name}</span>
        </h1>
        <p className="mt-2" style={{ color: COLORS.textSecondary }}>
          {role === "volunteer" &&
            "Here's an overview of your volunteer activities."}
          {role === "admin" && "Here's your system overview and quick actions."}
          {role === "donor" &&
            "Thank you for being a life saver! Here's your donation summary."}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {currentStats?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            borderColor={stat.borderColor}
          />
        ))}
      </motion.div>

      {/* Additional Dashboard Content */}
      <div className="py-8 md:py-10 lg:py-12">{role === "donor" && <RecentRequests />}</div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-lg shadow p-6"
        style={{
          backgroundColor: COLORS.cardBg,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: COLORS.textPrimary }}
        >
          {role === "volunteer" && "Recent Activities"}
          {role === "admin" && "System Overview"}
          {role === "donor" && "Your Donation History"}
        </h2>
        <div style={{ color: COLORS.textSecondary }}>
          <p>Dashboard content specific to {role} role will appear here.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
