import { Link, NavLink } from "react-router";

const Navbar = () => {
  return (
    <div className="bg-base-100 shadow-sm">
      <div className="navbar px-4 container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="lg:hidden mr-2"
            >
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 space-y-2 shadow"
            >
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-full bg-red-500 text-white font-semibold px-4 w-fit"
                      : "rounded-full bg-green-500 opacity-75 hover:opacity-100 text-white font-semibold px-4 w-fit"
                  }
                >
                  Home
                </NavLink>
              </li>
            </ul>
          </div>
          <Link className="font-semibold">Blood Donation</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal flex gap-2 items-center">
          </ul>
        </div>
        <div className="navbar-end font-semibold">
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
