import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTint,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
  FaUser,
  FaBars,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { useState } from "react";

const DashboardLayout = ({ headerTitle, userData, logout, navLinks }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarState, setSidebarState] = useState({
    mobileOpen: false,
    collapsed: false,
  });

  const toggleSidebar = () => {
    setSidebarState((prev) => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      return {
        mobileOpen: isDesktop ? false : !prev.mobileOpen,
        collapsed: isDesktop ? !prev.collapsed : prev.collapsed,
      };
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarState.mobileOpen && !isDesktop() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() =>
              setSidebarState((prev) => ({ ...prev, mobileOpen: false }))
            }
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:relative inset-y-0 left-0 bg-white shadow-lg z-50 md:z-auto ${
          sidebarState.collapsed ? "w-20" : "w-64"
        }`}
        animate={{
          x: sidebarState.mobileOpen || isDesktop() ? 0 : -300,
          transition: { type: "spring", damping: 25, stiffness: 300 },
        }}
      >
        <div className="h-full flex flex-col border-r border-gray-200">
          {/* Brand Header */}
          <div className="md:p-4 p-[18px] border-b border-gray-200 flex items-center justify-between">
            <motion.div
              animate={{
                opacity: sidebarState.collapsed ? 0 : 1,
                width: sidebarState.collapsed ? 0 : "auto",
                transition: { duration: 0.2, ease: "easeInOut" },
              }}
              className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTint className="text-red-500 text-xl flex-shrink-0" />
              </motion.div>
              <p className="font-bold md:text-xl">
                Blood<span className="text-red-600">Connect</span>
              </p>
            </motion.div>

            <motion.div
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-red-500 transition-colors"
              aria-label={
                sidebarState.collapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              initial={false}
              animate={{
                rotate: sidebarState.collapsed ? 180 : 0,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              {sidebarState.collapsed ? (
                <motion.button
                  whileHover={{
                    rotate: 180,
                    scale: 1.1,
                    transition: { duration: 0.2, stiffness: 0.1 },
                  }}
                >
                  <FaChevronRight className="w-4 h-4 cursor-pointer" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{
                    rotate: -360,
                    scale: 1.1,
                    transition: { duration: 0.5, stiffness: 0.1 },
                  }}
                >
                  <FaChevronLeft className="w-4 h-4 cursor-pointer" />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-200 relative">
            <div
              className={`flex items-center cursor-pointer ${
                sidebarState.collapsed ? "justify-center" : "justify-between"
              } gap-3`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <motion.div
                className="relative"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {userData?.image ? (
                  <img
                    src={userData?.image}
                    alt={userData?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-gray-400" />
                )}
                <motion.span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>

              {!sidebarState.collapsed && (
                <>
                  <motion.div
                    className="flex-1 min-w-0 overflow-hidden whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                  >
                    <p className="font-medium truncate">{userData?.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData?.role && userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1)}
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  >
                    <FaChevronDown className="text-sm text-gray-500" />
                  </motion.div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && !sidebarState.collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 bg-gray-50 rounded-md overflow-hidden"
                >
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="w-full flex items-center gap-2 p-2 text-sm hover:bg-gray-100"
                  >
                    <motion.div whileHover={{ rotate: 15 }}>
                      <FaUser className="text-gray-600 flex-shrink-0" />
                    </motion.div>
                    <span>Profile</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="w-full flex items-center gap-2 p-2 text-sm hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <motion.div whileHover={{ rotate: 15 }}>
                      <FaSignOutAlt className="text-gray-600 flex-shrink-0" />
                    </motion.div>
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 md:p-3 lg:p-4">
            <ul className="space-y-1">
              {navLinks?.map((link) => (
                <motion.li
                  key={link.id}
                  initial={false}
                  whileHover={{
                    scale: sidebarState.collapsed ? 1.05 : 1.02,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NavLink
                    to={link.path}
                    end={link.exact}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-red-100 text-red-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`
                    }
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      animate={{
                        scale: sidebarState.collapsed ? 1.1 : 1,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <link.icon
                        className={`w-5 h-5 flex-shrink-0 ${
                          sidebarState.collapsed ? "mx-auto" : ""
                        }`}
                      />
                    </motion.div>

                    {!sidebarState.collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: 0.1, duration: 0.2 },
                        }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium ml-3 whitespace-nowrap"
                      >
                        {link.name}
                      </motion.span>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ rotate: 180, scale: 0.9 }}
              className="md:hidden text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </motion.button>
            <h1 className="text-lg font-semibold">{headerTitle}</h1>
            <motion.button
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ rotate: -15, scale: 0.9 }}
              className="relative text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <FaBell className="text-xl" />
              <motion.span
                className="absolute -top-1 right-0 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto bg-gray-50"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
