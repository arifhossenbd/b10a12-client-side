import {
  FaHandsHelping,
  FaBlog,
  FaUser,
  FaMoneyCheckAlt 
} from "react-icons/fa";
import { RiHomeHeartLine } from "react-icons/ri";
import { MdSpaceDashboard } from "react-icons/md";

export const preLoginLinks = [
  {
    id: 1,
    name: "Home",
    path: "/",
    icon: RiHomeHeartLine,
  },
  {
    id: 2,
    name: "Donation Requests",
    path: "/donations",
    icon: FaHandsHelping,
  },
  {
    id: 3,
    name: "Blog",
    path: "/blog",
    icon: FaBlog,
  },
];

export const postLoginLinks = [
  {
    id: 1,
    name: "Home",
    path: "/",
    icon: RiHomeHeartLine,
  },
  {
    id: 2,
    name: "Donation Requests",
    path: "/donations",
    icon: FaHandsHelping,
  },
  {
    id: 3,
    name: "Funding",
    path: "/funding",
    icon: FaMoneyCheckAlt ,
  },
  {
    id: 4,
    name: "Blog",
    path: "/blog",
    icon: FaBlog,
  },
];

export const userDropdownLinks = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
    icon: MdSpaceDashboard,
  },
  {
    id: 2,
    name: "Profile",
    path: "/profile",
    icon: FaUser,
  }
];