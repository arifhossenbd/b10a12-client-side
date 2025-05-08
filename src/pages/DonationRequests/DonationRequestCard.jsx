import { motion } from "framer-motion";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import {
  getUrgencyConfig,
  getStatusConfig,
  getBloodGroupConfig,
  baseConfig,
  formatDate,
  formatTime,
} from "../../utils/config.jsx";
import { FaExclamationTriangle, FaEye } from "react-icons/fa";

const DonationRequestCard = ({ request, onViewDetails }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    hover: { y: -5, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.3)" },
  };

  if (!request) {
    return (
      <motion.div
        variants={item}
        className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white"
      >
        <div className="flex flex-col items-center justify-center text-center py-8">
          <FaExclamationTriangle className="text-gray-400 text-3xl mb-4" />
          <p className="text-gray-500 text-sm">No donation request available</p>
        </div>
      </motion.div>
    );
  }

  const {
    _id,
    donationInfo = {
      bloodGroup: "Not specified",
      requiredDate: "",
      requiredTime: "",
      urgency: "default",
    },
    recipient = {
      name: "Recipient",
      hospital: "Hospital",
    },
    status = { current: "pending" },
  } = request;

  const urgencyConfig = getUrgencyConfig(donationInfo?.urgency);
  const statusConfig = getStatusConfig(status);
  const bloodGroupConfig = getBloodGroupConfig(donationInfo?.bloodGroup);

  return (
    <motion.div
      variants={item}
      whileHover="hover"
      className={`border ${urgencyConfig.borderColor} p-3 md:p-4 lg:p-5 rounded-xl shadow-sm bg-white transition-all duration-300 hover:border-red-100 hover:bg-red-50 flex flex-col h-full`}
    >
      {/* Recipient Info */}
      <div className="flex items-start mb-4">
        <div className="bg-red-100 p-3 rounded-full mr-4">
          <baseConfig.icons.user className="text-red-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {recipient?.name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center">
            <baseConfig.icons.hospital className="mr-1" />{" "}
            {recipient?.hospital}
          </p>
        </div>
      </div>

      {/* Donation Details */}
      <div className="space-y-4 mb-6 flex-grow">
        <div className="flex items-center">
          <baseConfig.icons.heartbeat className="text-red-500 mr-3" />
          <span className="font-medium">
            Blood Group:{" "}
            <span className={`font-bold ${bloodGroupConfig.color}`}>
              {donationInfo?.bloodGroup || "Not specified"}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 md:gap-4 lg:gap-5">
          <div className="flex items-center">
            <baseConfig.icons.calendar className="text-red-500 mr-3" />
            <span className="text-gray-600">
              {formatDate(donationInfo?.requiredDate)}
            </span>
          </div>

          <div className="flex items-center">
            <baseConfig.icons.clock className="text-red-500 mr-3" />
            <span className="text-gray-600">
              {formatTime(donationInfo?.requiredTime)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 md:gap-4 lg:gap-5">
          <div className="flex items-center gap-2">
            <urgencyConfig.Icon />
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyConfig.color}`}
            >
              {urgencyConfig.label} Priority
            </span>
          </div>
          <div className="flex items-center gap-2">
            <statusConfig.Icon />
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <PrimaryBtn
          style="w-full flex justify-center bg-red-500 hover:bg-red-600 text-white"
          onClick={() => onViewDetails(_id)}
        >
          <FaEye className="mr-2" />
          View Details
        </PrimaryBtn>
      </div>
    </motion.div>
  );
};

export default DonationRequestCard;