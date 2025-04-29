import { motion } from "motion/react";

const PrimaryBtn = ({
  type,
  onClick = () => {},
  style = ``,
  children,
  loading,
  user,
  toolTipText
}) => {
  const isDisabled = loading || user;

  const handleClick = (e) => {
    if (isDisabled) return;
    onClick(e);
  };

  return (
    <motion.button
      onClick={handleClick}
      type={type}
      disabled={isDisabled}
      whileHover={
        !isDisabled
          ? {
              scale: 1.05,
              transition: { duration: 0.1, ease: "easeOut" },
            }
          : {}
      }
      whileTap={
        !isDisabled
          ? {
              scale: 0.95,
              transition: { duration: 0.1 },
            }
          : {}
      }
      className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 shadow-md hover:from-red-700 hover:to-red-600 transition-all duration-200 flex items-center gap-1 ${
        isDisabled ? "opacity-50 cursor-not-allowed tooltip" : "cursor-pointer"
      } ${style}`}
      data-tip={user && toolTipText}
    >
      {children}
    </motion.button>
  );
};

export default PrimaryBtn;
