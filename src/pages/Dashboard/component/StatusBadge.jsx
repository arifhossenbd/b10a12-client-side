import { getStatusConfig } from "../../../utils/config";

const StatusBadge = ({ status }) => {
  const statusInfo = getStatusConfig(status);
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
};

export default StatusBadge;