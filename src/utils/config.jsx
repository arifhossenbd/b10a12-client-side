import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

import {
  FaClock,
  FaHeartbeat,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaUser,
  FaCalendarAlt,
  FaHospital,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";

// Base configuration
const baseConfig = {
  icons: {
    clock: FaClock,
    heartbeat: FaHeartbeat,
    check: FaCheck,
    times: FaTimes,
    alert: FaExclamationTriangle,
    user: FaUser,
    calendar: FaCalendarAlt,
    hospital: FaHospital,
    eye: FaEye,
    edit: FaEdit,
    trash: FaTrash
  },
  formats: {
    time: "h:mm A",
    date: "MMM D, YYYY",
    dateTime: "MMM D, YYYY h:mm A"
  }
};

// Urgency Configuration
const urgencyConfig = {
  emergency: {
    color: "bg-red-100 text-red-800 hover:bg-red-700 hover:text-white",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    icon: baseConfig.icons.alert,
    label: "Emergency",
    badgeClass: "badge-error",
  },
  urgent: {
    color: "bg-orange-100 text-orange-800 hover:bg-red-700 hover:text-white",
    textColor: "text-orange-800",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
    icon: baseConfig.icons.heartbeat,
    label: "Urgent",
    badgeClass: "badge-warning",
  },
  normal: {
    color: "bg-green-100 text-green-800 hover:bg-red-700 hover:text-white",
    textColor: "text-green-800",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    icon: baseConfig.icons.heartbeat,
    label: "Normal",
    badgeClass: "badge-success",
  },
  default: {
    color: "bg-gray-100 text-gray-800 hover:bg-red-700 hover:text-white",
    textColor: "text-gray-800",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    icon: baseConfig.icons.clock,
    label: "Standard",
    badgeClass: "badge-neutral",
  }
};

// Status Configuration
const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    icon: baseConfig.icons.clock,
    iconColor: "text-yellow-500",
    label: "Pending",
    badgeClass: "badge-warning",
  },
  inprogress: {
    color: "bg-blue-100 text-blue-800",
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-blue-500",
    label: "In Progress",
    badgeClass: "badge-info",
  },
  completed: {
    color: "bg-green-100 text-green-800",
    textColor: "text-green-800",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    icon: baseConfig.icons.check,
    iconColor: "text-green-500",
    label: "Completed",
    badgeClass: "badge-success",
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    icon: baseConfig.icons.times,
    iconColor: "text-red-500",
    label: "Cancelled",
    badgeClass: "badge-error",
  },
  default: {
    color: "bg-gray-100 text-gray-800",
    textColor: "text-gray-800",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    icon: baseConfig.icons.clock,
    iconColor: "text-gray-500",
    label: "Unknown",
    badgeClass: "badge-neutral",
  }
};

// Blood Group Configuration
const bloodGroupConfig = {
  "A+": {
    color: "text-red-600",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-red-500"
  },
  "A-": {
    color: "text-red-700",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-red-600"
  },
  "B+": {
    color: "text-blue-600",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-blue-500"
  },
  "B-": {
    color: "text-blue-700",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-blue-600"
  },
  "AB+": {
    color: "text-purple-600",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-purple-500"
  },
  "AB-": {
    color: "text-purple-700",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-purple-600"
  },
  "O+": {
    color: "text-green-600",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-green-500"
  },
  "O-": {
    color: "text-green-700",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-green-600"
  },
  default: {
    color: "text-gray-600",
    icon: baseConfig.icons.heartbeat,
    iconColor: "text-gray-500"
  }
};

const formatTime = (timeStr) => {
  if (!timeStr) return "Not specified";
  
  // If it's already a full date-time string
  if (dayjs(timeStr).isValid()) {
    return dayjs(timeStr).format('h:mm A');
  }
  
  // If it's just a time string (HH:mm)
  if (typeof timeStr === 'string' && timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':');
    return dayjs().hour(hours).minute(minutes).format('h:mm A');
  }
  
  return "Invalid time";
};

const formatDate = (dateStr) => {
  return dateStr ? dayjs(dateStr).format('MMM D, YYYY') : "Not specified";
};

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "Not specified";
  
  // Combine date and time, then display in local time
  const [hours, minutes] = timeStr.split(':');
  const dateTime = dayjs(dateStr).hour(hours).minute(minutes);
  return dateTime.format('MMM D, YYYY h:mm A');
};

// Config Getters
const getUrgencyConfig = (urgency) => {
  const config = urgencyConfig[urgency] || urgencyConfig.default;
  return {
    ...config,
    Icon: ({ className = "", size = "text-base" }) => {
      const IconComponent = config.icon;
      return <IconComponent className={`${config.iconColor} ${size} ${className}`} />;
    }
  };
};

const getStatusConfig = (status) => {
  const statusValue = typeof status === 'object' ? status.current : status;
  const config = statusConfig[statusValue] || statusConfig.default;
  return {
    ...config,
    Icon: ({ className = "", size = "text-base" }) => {
      const IconComponent = config.icon;
      return <IconComponent className={`${config.iconColor} ${size} ${className}`} />;
    }
  };
};

const getBloodGroupConfig = (bloodGroup) => {
  const config = bloodGroupConfig[bloodGroup] || bloodGroupConfig.default;
  return {
    ...config,
    Icon: ({ className = "", size = "text-base" }) => {
      const IconComponent = config.icon;
      return <IconComponent className={`${size} ${className}`} />;
    }
  };
};

export {
  formatTime,
  formatDate,
  formatDateTime,
  getUrgencyConfig,
  getStatusConfig,
  getBloodGroupConfig,
  baseConfig
};