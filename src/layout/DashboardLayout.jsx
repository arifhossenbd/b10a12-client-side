import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTint,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
  FaUser,
  FaBars,
  FaChevronLeft,
  FaHandsHelping,
  FaHome,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Search from "../pages/Search/Search";
import { capitalize } from "../utils/capitalized";

const DashboardLayout = ({
  headerTitle,
  userData,
  logout,
  navLinks,
  role,
  loading,
}) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarState, setSidebarState] = useState({
    mobileOpen: false,
    collapsed: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarState((prev) => ({ ...prev, mobileOpen: false }));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarState((prev) => {
      if (isMobile) {
        return { ...prev, mobileOpen: !prev.mobileOpen };
      } else {
        return { ...prev, collapsed: !prev.collapsed };
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarState.mobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() =>
              setSidebarState((prev) => ({ ...prev, mobileOpen: false }))
            }
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50 md:z-40 ${
          sidebarState.collapsed ? "w-20" : "w-64"
        }`}
        animate={{
          x: sidebarState.mobileOpen || !isMobile ? 0 : -300,
          transition: { type: "spring", damping: 25, stiffness: 300 },
        }}
      >
        <div className="h-full flex flex-col border-r border-gray-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-screen">
              <span className="loading loading-ring loading-xl"></span>
            </div>
          ) : (
            <>
              {/* Sidebar Header */}
              <div className="md:p-[17.5px] p-[19.5px] border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
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
                  className={`tooltip ${
                    sidebarState.collapsed ? "tooltip-right" : "tooltip-left"
                  }`}
                  data-tip={
                    sidebarState.collapsed
                      ? "Expand sidebar"
                      : "Collapse sidebar"
                  }
                >
                  <motion.button
                    onClick={toggleSidebar}
                    className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label={
                      sidebarState.collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                    }
                    initial={false}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ rotate: sidebarState.collapsed ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaChevronLeft className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                {/* User Profile */}
                <div className="p-4 border-b border-gray-200 relative">
                  <div
                    className={`flex items-center cursor-pointer ${
                      sidebarState.collapsed
                        ? "justify-center"
                        : "justify-between"
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
                          <p className="font-medium truncate">
                            {userData?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userData?.role && capitalize(userData?.role)}
                          </p>
                        </motion.div>
                        <motion.div
                          className="tooltip tooltip-left"
                          data-tip={
                            isProfileOpen ? "Close profile" : "Open profile"
                          }
                        >
                          <motion.button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                            whileTap={{ scale: 0.9 }}
                            animate={{ rotate: isProfileOpen ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <FaChevronDown className={`w-4 h-4`} />
                          </motion.button>
                        </motion.div>
                      </>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileOpen && !sidebarState.collapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          transition: {
                            opacity: { duration: 0.2 },
                            height: {
                              type: "spring",
                              damping: 20,
                              stiffness: 300,
                            },
                          },
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          transition: {
                            opacity: { duration: 0.1 },
                            height: { duration: 0.2 },
                          },
                        }}
                        className="mt-2 bg-gray-50 rounded-md overflow-hidden"
                      >
                        <Link to={`/dashboard/${role || "donor"}/profile`}>
                          <motion.button
                            whileHover={{ x: 5 }}
                            whileTap={{ x: 10 }}
                            className="w-full flex items-center gap-2 p-2 text-sm hover:bg-gray-100 cursor-pointer"
                          >
                            <FaUser className="text-gray-600 flex-shrink-0" />
                            <span>Profile</span>
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ x: 10 }}
                          className="w-full flex items-center gap-2 p-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="text-gray-600 flex-shrink-0" />
                          <span>Logout</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="p-2 md:p-3 lg:p-4">
                  <ul className="space-y-2">
                    {navLinks?.map((link) => (
                      <motion.li
                        key={link.id}
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
                            `flex items-center p-3 rounded-md transition-all ${
                              isActive
                                ? "bg-red-100 text-red-600"
                                : "hover:bg-gray-100 bg-gray-50 text-gray-700"
                            }`
                          }
                        >
                          <link.icon
                            className={`w-5 h-5 flex-shrink-0 ${
                              sidebarState.collapsed ? "mx-auto" : ""
                            }`}
                          />
                          {!sidebarState.collapsed && (
                            <span className="text-sm font-medium ml-3 whitespace-nowrap">
                              {link.name}
                            </span>
                          )}
                          {sidebarState.collapsed && (
                            <div
                              className="tooltip tooltip-right"
                              data-tip={link.name}
                            ></div>
                          )}
                        </NavLink>
                      </motion.li>
                    ))}
                    {role === "donor" && (
                      <>
                        <motion.li
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center p-3 rounded-md transition-all hover:bg-gray-100 bg-gray-50 text-gray-700 cursor-pointer"
                        >
                          <button
                            onClick={() =>
                              document.getElementById("searchModal").showModal()
                            }
                            className="flex items-center w-full"
                          >
                            <FaHandsHelping
                              className={`w-5 h-5 flex-shrink-0 ${
                                sidebarState.collapsed ? "mx-auto" : ""
                              }`}
                            />
                            {!sidebarState.collapsed && (
                              <span className="text-sm font-medium ml-3 whitespace-nowrap">
                                Create Donation Requests
                              </span>
                            )}
                            {sidebarState.collapsed && (
                              <div
                                className="tooltip tooltip-right"
                                data-tip="Create Donation Requests"
                              ></div>
                            )}
                          </button>
                        </motion.li>
                        <motion.li
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center p-3 rounded-md transition-all hover:bg-gray-100 bg-gray-50 text-gray-700 cursor-pointer"
                        >
                          <Link to="/" className="flex items-center w-full">
                            <FaHome
                              className={`w-5 h-5 flex-shrink-0 ${
                                sidebarState.collapsed ? "mx-auto" : ""
                              }`}
                            />
                            {!sidebarState.collapsed && (
                              <span className="text-sm font-medium ml-3 whitespace-nowrap">
                                Home
                              </span>
                            )}
                            {sidebarState.collapsed && (
                              <div
                                className="tooltip tooltip-right"
                                data-tip="Home"
                              ></div>
                            )}
                          </Link>
                        </motion.li>
                      </>
                    )}
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen ${
          sidebarState.collapsed ? "lg:ml-20" : "lg:ml-64"
        } transition-all duration-300`}
      >
        {/* Fixed Header */}
        <header
          className={`bg-white border-b border-gray-200 fixed top-0 z-30 h-16 ${
            sidebarState.collapsed ? "lg:left-20" : "lg:left-64"
          } right-0 left-0 transition-all duration-300`}
        >
          <div className="flex items-center justify-between p-4 md:px-6 h-full">
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ rotate: 180, scale: 0.9 }}
              className="md:hidden text-gray-500 hover:text-red-500 transition-colors cursor-pointer tooltip"
              data-tip="Toggle sidebar"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </motion.button>
            <h1 className="text-lg font-semibold">{headerTitle}</h1>
            <motion.button
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ rotate: -15, scale: 0.9 }}
              className="relative text-gray-500 hover:text-red-500 transition-colors cursor-pointer tooltip"
              data-tip="Notifications"
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

        {/* Scrollable Content */}
        <div className="flex-1 pt-16 overflow-y-auto">
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50"
          >
            <Outlet />
            <Search />
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
