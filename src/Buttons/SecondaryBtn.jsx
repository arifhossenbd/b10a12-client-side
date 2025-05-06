import { animate, motion } from "framer-motion";

const SecondaryBtn = ({
  type = "button",
  onClick = () => {},
  children,
  loading = false,
  user = null,
  toolTipText = "",
  style = ``,
}) => {
  const isDisabled = loading || user;

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
          ? `opacity-50 cursor-not-allowed px-4 py-2 rounded-md text-sm font-medium flex items-center 
        justify-center gap-2 shadow-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white ${
          style
            ? style
            : `w-fit cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-600 to-red-500 shadow-md hover:from-red-700 hover:to-red-600 text-white`
        } flex items-center gap-2 justify-center`
          : `${
              style
                ? style
                : `w-fit cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-600 to-red-500 shadow-md hover:from-red-700 hover:to-red-600 text-white`
            }  flex items-center gap-2 justify-center
      `
      }
      aria-disabled={isDisabled}
      aria-busy={loading}
      data-tip={isDisabled && toolTipText ? toolTipText : undefined}
    >
      {loading ? (
        <>
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
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default SecondaryBtn;
