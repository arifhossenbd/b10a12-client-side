import { getStatusConfig } from "../../../utils/config";

const StatusBadge = ({ status }) => {
  try {
    const statusInfo = getStatusConfig(status);
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full text-wrap ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  } catch (error) {
    console.error("Error in StatusBadge:", error);
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        Current
      </span>
    );
  }
};

export default StatusBadge;
