import { motion } from "framer-motion";
import { COLORS } from "../../../utils/colorConfig";

const RoleBadge = ({ name, role, email }) => {
  const roleColors = {
    volunteer: {
      bg: `${COLORS.primary}/10`,
      text: COLORS.primary,
      icon: "👨‍⚕️"
    },
    admin: {
      bg: `${COLORS.secondary}/10`,
      text: COLORS.secondary,
      icon: "👔"
    },
    donor: {
      bg: `${COLORS.success}/10`,
      text: COLORS.success,
      icon: "💉"
    },
    default: {
      bg: `${COLORS.textSecondary}/10`,
      text: COLORS.textSecondary,
      icon: "👤"
    }
  };

  const currentRole = roleColors[role?.toLowerCase()] || roleColors.default;

  return (
    <motion.div 
      className="flex items-center gap-3 py-2 rounded-full"
      style={{
        backgroundColor: currentRole.bg,
        color: currentRole.text
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-xl">{currentRole.icon}</span>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold capitalize">{role || 'User'}</h2>
          <motion.span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: COLORS.success }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
        <p className="text-xs opacity-80 truncate max-w-[120px]">
          {email || name}
        </p>
      </div>
    </motion.div>
  );
};

export default RoleBadge;