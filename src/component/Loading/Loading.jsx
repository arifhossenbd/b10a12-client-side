import { motion } from "framer-motion";
import { FaHeartbeat, FaTint } from "react-icons/fa";

const Loading = ({ heading = "Loading BloodConnect", subheading = "Saving lives one drop at a time" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-white p-6"
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo with animation */}
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-3">
            <FaTint className="text-red-600 text-4xl" />
            <span className="text-3xl font-bold text-gray-800">
              Blood<span className="text-red-600">Connect</span>
            </span>
          </div>
        </motion.div>

        {/* Pulsing heartbeat icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex justify-center"
        >
          <FaHeartbeat className="text-red-500 text-5xl" />
        </motion.div>

        {/* Text content */}
        <div className="space-y-2">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-800"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            {subheading}
          </motion.p>
        </div>

        {/* Animated progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="h-2 bg-red-100 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full bg-gradient-to-r from-red-400 to-red-600 w-1/2"
          />
        </motion.div>

        {/* Floating blood drops */}
        <div className="relative h-20 w-full">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="absolute"
              style={{
                left: `${10 + i * 20}%`,
              }}
            >
              <FaTint className="text-red-400 text-xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;