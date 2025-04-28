import { Link, NavLink } from "react-router";
import {
  postLoginLinks,
  preLoginLinks,
  userDropdownLinks,
} from "../../config/links";
import { useAuth } from "../../hooks/useAuth";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-20">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="lg:hidden mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 shadow"
            >
              {user
                ? postLoginLinks?.map((link) => (
                    <li key={link?.id}>
                      <NavLink
                        to={link?.path}
                        className={({ isActive }) =>
                          isActive
                            ? "text-red-500 bg-transparent font-semibold lg:text-base"
                            : "text-green-500 bg-transparent opacity-75 hover:opacity-100 font-semibold lg:text-base"
                        }
                      >
                        {link?.name}
                      </NavLink>
                    </li>
                  ))
                : preLoginLinks?.map((link) => (
                    <li key={link?.id}>
                      <NavLink
                        to={link?.path}
                        className={({ isActive }) =>
                          isActive
                            ? "text-red-500 bg-transparent font-semibold lg:text-base"
                            : "text-green-500 bg-transparent opacity-75 hover:opacity-100 font-semibold lg:text-base"
                        }
                      >
                        {link?.name}
                      </NavLink>
                    </li>
                  ))}
            </ul>
          </div>
          <Link className="font-semibold">Blood Donation</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">
            {user
              ? postLoginLinks?.map((link) => (
                  <li key={link?.id}>
                    <NavLink
                      to={link?.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-red-500 bg-transparent font-semibold lg:text-base"
                          : "text-green-500 bg-transparent opacity-75 hover:opacity-100 font-semibold lg:text-base"
                      }
                    >
                      {link?.name}
                    </NavLink>
                  </li>
                ))
              : preLoginLinks?.map((link) => (
                  <li key={link?.id}>
                    <NavLink
                      to={link?.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-red-500 bg-transparent font-semibold lg:text-base"
                          : "text-green-500 bg-transparent opacity-75 hover:opacity-100 font-semibold lg:text-base"
                      }
                    >
                      {link?.name}
                    </NavLink>
                  </li>
                ))}
          </ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {user?.photoURL ? (
                    <img alt="userPhoto" src={user?.photoURL} />
                  ) : (
                    <FaUser />
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-32 p-2 shadow"
              >
                {userDropdownLinks?.map((link) => (
                  <li key={link?.id}>
                    <NavLink
                      to={link?.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-red-500 bg-transparent font-semibold lg:text-base"
                          : "text-green-500 bg-transparent opacity-75 hover:opacity-100 font-semibold lg:text-base"
                      }
                    >
                      {link?.name}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <button
                    onClick={logout}
                    className="bg-transparent opacity-80 hover:opacity-100 text-black font-semibold lg:text-base"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
