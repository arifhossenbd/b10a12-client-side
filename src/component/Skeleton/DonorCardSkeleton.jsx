import { motion } from "framer-motion";
import { FaHeartbeat, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const DonorCardSkeleton = ({ count = 6 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 12px 28px -8px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const pulseAnimation = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: 0.8,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="py-8 pt-24 px-4 lg:w-11/12 mx-auto min-h-screen">
      {/* Header Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mb-10"
      >
        {/* Main Heading with Animation */}
        <motion.div variants={titleVariants} className="text-center mb-6">
          <motion.div
            className="skeleton h-10 w-64 mx-auto mb-4"
            variants={pulseAnimation}
          />
          <motion.div
            className="skeleton h-6 w-48 mx-auto"
            variants={pulseAnimation}
          />
        </motion.div>

        {/* Search Summary Skeleton */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-gray-100 p-4 rounded-lg"
          variants={pulseAnimation}
        >
          <div className="flex-1 flex flex-wrap gap-2 justify-center sm:justify-start">
            <div className="skeleton h-8 w-24 rounded-full"></div>
            <div className="skeleton h-8 w-28 rounded-full"></div>
            <div className="skeleton h-8 w-20 rounded-full"></div>
          </div>
          <div className="skeleton h-12 w-32 rounded-lg"></div>
        </motion.div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:border-red-100 hover:bg-red-50 flex flex-col"
          >
            {/* Profile Section */}
            <div className="flex items-center mb-4">
              <motion.div
                variants={pulseAnimation}
                className="bg-red-100 p-3 rounded-full mr-4 flex-shrink-0"
              >
                <FaUser className="text-red-300 text-xl" />
              </motion.div>
              <div className="skeleton h-6 w-3/4"></div>
            </div>

            {/* Details Section */}
            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex items-center">
                <FaHeartbeat className="text-gray-300 mr-3" />
                <div className="skeleton h-5 w-1/2"></div>
              </div>

              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-300 mr-3" />
                <div className="skeleton h-5 w-3/4"></div>
              </div>
            </div>

            {/* Button Section */}
            <motion.div
              variants={pulseAnimation}
              className="mt-auto"
            >
              <button className="w-full flex justify-center items-center bg-gradient-to-r from-gray-200 to-gray-300 text-transparent rounded-md px-4 py-2 cursor-pointer">
                <FaHeartbeat className="text-gray-400 mr-2" />
                Loading...
              </button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DonorCardSkeleton;