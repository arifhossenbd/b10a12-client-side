import { FaTimes } from "react-icons/fa";
import { COLORS } from "../utils/colorConfig";
import { motion } from "framer-motion";
const CloseBtn = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick ? onClick : undefined}
      className="btn btn-sm btn-circle"
      style={{
        backgroundColor: COLORS.cardBg,
        borderColor: COLORS.border,
        color: COLORS.icon,
      }}
      initial={{ rotate: 0 }}
      whileHover={{
        backgroundColor: COLORS.background,
        color: COLORS.primary,
        rotate: 180,
        scale: 1.1,
        transition: {
          type: "spring",
          stiffness: 300,
          duration: 0.5,
        },
      }}
      whileTap={{
        scale: 0.9,
        transition: { duration: 0.1 },
      }}
      transition={{
        backgroundColor: { duration: 0.2 },
        color: { duration: 0.2 },
      }}
    >
      <motion.span
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        <FaTimes />
      </motion.span>
    </motion.button>
  );
};

export default CloseBtn;
