import {
  FaHome,
  FaHandsHelping,
  FaHandHoldingHeart,
  FaMoneyBillWave,
  FaBlog,
  FaTachometerAlt,
  FaUser
} from "react-icons/fa";
export const preLoginLinks = [
  {
    id: 1,
    name: "Home",
    path: "/",
    icon: <FaHome />,
  },
  {
    id: 2,
    name: "Donation Requests",
    path: "/donations",
    icon: <FaHandsHelping /> || <FaHandHoldingHeart />,
  },
  {
    id: 3,
    name: "Blog",
    path: "/blog",
    icon: <FaBlog />,
  },
];

export const postLoginLinks = [
  {
    id: 1,
    name: "Home",
    path: "/",
    icon: <FaHome />,
  },
  {
    id: 2,
    name: "Donation Requests",
    path: "/donations",
    icon: <FaHandsHelping /> || <FaHandHoldingHeart />,
  },
  {
    id: 3,
    name: "Funding",
    path: "/funding",
    icon: <FaMoneyBillWave />,
  },
  {
    id: 4,
    name: "Blog",
    path: "/blog",
    icon: <FaBlog />,
  },
];

export const userDropdownLinks = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    id: 2,
    name: "Profile",
    path: "/profile",
    icon: <FaUser />,
  }
];
