import { motion } from "framer-motion";
import { FaHeartbeat, FaUser, FaHospital, FaClock } from "react-icons/fa";

const RequestCardSkeleton = ({ count = 6 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        mass: 0.5
      } 
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
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
    <div className='py-8 pt-24 lg:w-11/12 mx-auto min-h-screen'>
      <motion.div
        initial="hidden"
        animate="show"
        className="mb-10 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-300 mb-3"
        >
          Loading Requests
        </motion.h1>

        <motion.p
          className="text-lg text-gray-400 mb-6"
          variants={itemVariants}
        >
          Searching for donation requests...
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          variants={containerVariants}
        >
          <motion.span 
            variants={itemVariants}
            className="skeleton h-8 w-32 rounded-full"
          />
          <motion.span
            variants={itemVariants}
            className="skeleton h-8 w-28 rounded-full"
          />
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 mb-8"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="skeleton h-12 w-32 rounded-lg"
          />
          <motion.div
            variants={itemVariants}
            className="skeleton h-12 w-36 rounded-lg"
          />
        </motion.div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            variants={itemVariants}
            whileHover="hover"
            className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:border-red-100 hover:bg-red-50 flex flex-col"
          >
            {/* Profile Section */}
            <div className="flex items-center mb-4">
              <motion.div
                variants={pulseAnimation}
                className="bg-gray-200 p-3 rounded-full mr-4"
              >
                <FaUser className="text-gray-400 text-xl" />
              </motion.div>
              <div className="skeleton h-6 w-3/4"></div>
            </div>

            {/* Details Section */}
            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex items-center">
                <FaHeartbeat className="text-gray-400 mr-3" />
                <div className="skeleton h-5 w-1/2"></div>
              </div>

              <div className="flex items-center">
                <FaHospital className="text-gray-400 mr-3" />
                <div className="skeleton h-5 w-3/4"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaClock className="text-gray-400 mr-3" />
                  <div className="skeleton h-5 w-20"></div>
                </div>
                <div className="skeleton h-6 w-24 rounded-full"></div>
              </div>
            </div>

            {/* Button */}
            <motion.div
              variants={pulseAnimation}
              className="mt-auto"
            >
              <button className="btn w-full flex justify-center bg-gray-200 border-gray-300 text-transparent">
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

export default RequestCardSkeleton;