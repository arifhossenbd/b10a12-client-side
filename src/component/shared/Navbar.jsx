import { motion, AnimatePresence } from "motion/react";
import { Link, NavLink } from "react-router";
import {
  postLoginLinks,
  preLoginLinks,
  userDropdownLinks,
} from "../../config/links";
import { useAuth } from "../../hooks/useAuth";
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";
import PrimaryBtn from "../../Buttons/PrimaryBtn";

const navItemVariants = {
  hover: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const Navbar = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-100 h-16 bg-gray-200 animate-pulse">
        <div className="px-4 lg:w-11/12 mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded bg-gray-300 md:hidden"></div>
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className="hidden md:flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-300 rounded"></div>
            ))}
          </div>
          {user ? (
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          ) : (
            <div className="h-6 w-14 md:w-16 bg-gray-300 rounded"></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-red-50 to-white shadow-sm border-b border-gray-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          <div className="px-4 lg:w-11/12 mx-auto">
            <div className="flex items-center justify-between h-16">
              {/* Brand logo and mobile menu button */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="mobile-drawer"
                  className="md:hidden rounded-md text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <FaBars className="h-5 w-5" />
                </label>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  <NavLink to="/" className="flex items-center gap-1">
                    <FaDroplet className="text-red-600 text-xl" />
                    <span className="text-xl font-bold text-gray-800 tracking-tight">
                      Blood<span className="text-red-600">Connect</span>
                    </span>
                  </NavLink>
                </motion.div>
              </div>

              {/* Desktop Navigation with Underline */}
              <nav className="hidden md:flex items-center h-full">
                <div className="flex items-center gap-4 h-full relative">
                  {(user ? postLoginLinks : preLoginLinks).map((link, i) => (
                    <motion.div
                      key={link.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={navItemVariants}
                    >
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `relative h-full flex items-center text-sm font-medium ${
                            isActive
                              ? "text-red-600"
                              : "text-gray-700 hover:text-red-600"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <div className="relative h-full flex flex-col justify-center">
                            <motion.span
                              className="flex items-center gap-1"
                              whileHover="hover"
                              whileTap="tap"
                              variants={navItemVariants}
                            >
                              {link.icon && <link.icon className="w-4 h-4" />}
                              {link.name}
                            </motion.span>

                            {/* Underline container */}
                            <div className="absolute -bottom-7 -translate-y-1/2 left-0 right-0 h-1">
                              {/* Static underline for active route */}
                              {isActive && (
                                <motion.div
                                  className="bg-red-600 h-0.5 w-full"
                                  layoutId="underline"
                                />
                              )}
                              {/* Animated underline on hover for inactive route */}
                              {!isActive && (
                                <motion.div
                                  className="bg-red-600 h-0.5"
                                  initial={{ width: 0 }}
                                  whileHover={{ width: "100%" }}
                                  transition={{ duration: 0.2 }}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* User actions */}
              {user ? (
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    {user?.photoURL ? (
                      <figure className="w-10 h-10">
                        <img
                          alt="User profile"
                          src={user?.photoURL}
                          className="object-cover w-full h-full rounded-full"
                        />
                      </figure>
                    ) : (
                      <FaUser className="text-red-600 text-lg" />
                    )}
                  </div>
                  <AnimatePresence>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="dropdown-content mt-3 rounded-md bg-white shadow-lg border border-gray-100 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1 px-4">
                        {userDropdownLinks.map((link, i) => (
                          <motion.div
                            key={link.id}
                            custom={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ x: 4 }}
                          >
                            <NavLink
                              to={link.path}
                              className={({ isActive }) =>
                                `flex items-center py-2 text-sm ${
                                  isActive
                                    ? "text-red-600"
                                    : "text-gray-700 hover:text-red-600"
                                }`
                              }
                            >
                              {link.icon && (
                                <link.icon className="w-4 h-4 mr-2" />
                              )}
                              {link.name}
                            </NavLink>
                          </motion.div>
                        ))}

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: userDropdownLinks.length * 0.05 + 0.1,
                          }}
                          className="border-t border-gray-100"
                        >
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 4 }}
                            onClick={() => {
                              logout();
                            }}
                            className="flex w-full cursor-pointer items-center py-2 text-sm text-gray-700 hover:text-red-600"
                          >
                            <FaSignOutAlt className="w-4 h-4 mr-2" />
                            Sign out
                          </motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <PrimaryBtn type="button" variants={navItemVariants}>
                    Sign in
                  </PrimaryBtn>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Drawer Sidebar */}
      <div className="drawer-side z-100">
        <label
          htmlFor="mobile-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-64 bg-base-100 text-base-content relative"
        >
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-base-200 px-4 py-3 flex items-center justify-between">
            <NavLink
              to="/"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("mobile-drawer").click()}
            >
              <FaDroplet className="text-red-600 text-2xl" />
              <span className="text-xl font-bold text-gray-800">
                Blood<span className="text-red-600">Connect</span>
              </span>
            </NavLink>
            <motion.label
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              htmlFor="mobile-drawer"
              className="p-2 rounded-md text-gray-700 hover:text-red-600 cursor-pointer"
            >
              <FaTimes className="text-xl" />
            </motion.label>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto h-[calc(100vh-60px)] pt-2">
            <nav className="flex flex-col px-4">
              {(user ? postLoginLinks : preLoginLinks).map((link, i) => (
                <motion.div
                  key={link.id}
                  custom={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full"
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative block w-fit px-3 py-2 ${
                        isActive
                          ? "text-red-600"
                          : "text-gray-700 hover:text-red-600"
                      }`
                    }
                    onClick={() =>
                      document.getElementById("mobile-drawer").click()
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-1">
                        {link.icon && <link.icon className="w-4 h-4" />}
                        <span>{link.name}</span>
                        {isActive && (
                          <motion.div
                            className="absolute left-3 right-3 bottom-1 h-0.5 bg-red-600"
                            layoutId="mobileUnderline"
                          />
                        )}
                      </div>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;
