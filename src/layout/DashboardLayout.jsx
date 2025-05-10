import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTint,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";
import CloseBtn from "../Buttons/CloseBtn";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.98 },
};

const DashboardLayout = ({
  headerTitle,
  data,
  logout,
  navLinks,
  welcomeMessage,
}) => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex h-screen bg-gray-50 overflow-hidden"
    >
      {/* Sidebar */}
      <motion.div
        className="w-72 min-h-screen bg-gradient-to-b from-red-50 to-red-100 border-r border-red-200 shadow-lg flex flex-col"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="sticky top-0 z-10 bg-white px-6 py-4 flex items-center justify-between border-b border-red-200">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <FaTint className="text-red-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">
              Blood<span className="text-red-600">Connect</span>
            </span>
          </motion.div>
          <Link to="/">
            <CloseBtn />
          </Link>
        </div>

        {/* User Profile */}
        {data && (
          <motion.div
            className="px-6 py-4 border-b border-red-200 bg-white/50 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <div className="relative">
                <figure className="h-10 w-10 avatar">
                  {data?.image ? (
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={data?.image}
                      alt={data?.name}
                    />
                  ) : (
                    <FaUserCircle className="text-4xl text-red-600" />
                  )}
                </figure>
                <motion.span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {data?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{data?.role}</p>
              </div>
              <motion.div
                animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-gray-500 text-sm" />
              </motion.div>
            </div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2 cursor-pointer px-4 py-2 text-gray-700 text-sm"
                  >
                    <FaUser className="text-red-500" />
                    <span>Profile</span>
                  </motion.button>
                  <hr className="text-gray-100 hover:text-gray-200" />
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2 cursor-pointer px-4 py-2 text-gray-700 text-sm"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="text-red-500" />
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Navigation Links */}
        <motion.div
          className="mt-6 px-4 space-y-1 flex-1 overflow-y-auto"
          variants={containerVariants}
        >
          {navLinks?.map((link, i) => (
            <motion.div
              key={link.id}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              custom={i}
              className="px-2 py-1"
            >
              <NavLink
                key={link.id}
                to={link.path}
                className={`flex items-center p-3 rounded-lg transition-all ${
                  (
                    link.exact
                      ? location.pathname === link.path
                      : location.pathname.startsWith(link.path)
                  )
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-red-100 hover:text-red-600"
                }`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                <div>
                  <p className="text-sm font-medium">{link.name}</p>
                  <p className="text-xs opacity-70">{link.description}</p>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.div
          className="bg-white border-b border-gray-200 px-6 py-4.5 flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {headerTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative text-gray-500 hover:text-red-600"
            >
              <FaBell className="text-xl" />
              <motion.span
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-gray-50"
        >
          <Outlet />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardLayout;
