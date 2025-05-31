const StatusBadge = ({ status, style }) => {
  const config = {
    pending: { color: "badge-warning", text: "Pending" },
    inprogress: { color: "badge-info", text: "Inprogress" },
    completed: { color: "badge-success", text: "Completed" },
    cancelled: { color: "badge-error", text: "Cancelled" },
    blocked: { color: "badge-error", text: "Blocked" },
    default: { color: "badge-neutral", text: "Current" },
  };

  const { color, text } = config[status] || config[status] || config.default;

  return (
    <span
      className={`badge text-xs md:text-sm font-semibold rounded-full text-white ${color} ${style}`}
    >
      {text}
    </span>
  );
};

export default StatusBadge;
