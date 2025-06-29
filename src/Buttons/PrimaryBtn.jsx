import { motion } from "framer-motion";

const PrimaryBtn = ({
  type = "button",
  onClick = () => {},
  children,
  loading = false,
  user = null,
  toolTipText = "",
  style = ``,
  disabled
}) => {
  const isDisabled = loading || user || disabled;

  return (
    <motion.button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      whileHover={
        !isDisabled
          ? {
              scale: 1.02,
              transition: { duration: 0.1, ease: "easeOut" },
            }
          : {}
      }
      whileTap={
        !isDisabled
          ? {
              scale: 0.9,
              transition: { duration: 0.1 },
            }
          : {}
      }
      className={
        isDisabled
          ? `bg-stone-800 text-white text-sm font-medium py-2 px-4 rounded-md opacity-50 cursor-not-allowed w-full flex items-center justify-center gap-2`
          : `${
              style ? style : `w-fit`
            } text-white cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center 
        justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 shadow-md hover:from-red-700 hover:to-red-600`
      }
      aria-disabled={isDisabled}
      aria-busy={loading}
      data-tip={isDisabled && toolTipText ? toolTipText : undefined}
    >
      {loading && (
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 0.6 }}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          className="fill-white"
        >
          <path
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity="0.25"
          />
          <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" />
        </motion.svg>
      )}
      {children}
    </motion.button>
  );
};

export default PrimaryBtn;