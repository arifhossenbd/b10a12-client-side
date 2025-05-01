import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FaHeartbeat, FaSearch, FaTint, FaUserPlus } from "react-icons/fa";
import CountUp from "react-countup";

const Banner = () => {
  const navigate = useNavigate();

  // Emergency blood types data
  const urgentBloodTypes = [
    { type: "O-", level: "critical" },
    { type: "B-", level: "low" },
  ];

  return (
    <div className="relative bg-[url('/blood-donate-and-heart-rate.jpg')] bg-contain bg-center">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 via-red-800/90 to-red-700/90 rounded-lg" />

      <div className="relative z-10 py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          {urgentBloodTypes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4 md:mb-6 inline-flex flex-wrap justify-center items-center gap-1 md:gap-2 bg-red-900/80 text-white px-3 py-1 md:px-4 md:py-2 rounded-full border border-red-300/50 animate-pulse text-xs sm:text-sm"
            >
              <FaTint className="text-red-300" />
              <span className="font-semibold">URGENT NEED:</span>
              {urgentBloodTypes.map((blood, i) => (
                <span key={i} className="ml-0 md:ml-1">
                  {blood.type}{" "}
                  <span className="text-red-200">({blood.level})</span>
                  {i < urgentBloodTypes.length - 1 ? "," : ""}
                </span>
              ))}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold md:font-extrabold text-white mb-4 md:mb-6 leading-snug md:leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-200 to-white">
              Your Blood Could Be
            </span>
            <br className="hidden sm:block" />
            Someone's Miracle
          </motion.h1>
          <div className="max-w-2xl md:max-w-3xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-red-100 mb-8 md:mb-10"
            >
              <CountUp
                end={1125684}
                duration={3}
                separator=","
                className="font-semibold md:font-bold text-white"
              />{" "}
              lives saved this year
            </motion.p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
            {["A+", "B+", "O+", "AB+"].map((type) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="bg-red-900/60 border border-red-400/30 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-white font-bold cursor-default text-sm sm:text-base md:text-lg"
              >
                {type}
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6">
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/register")}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3 md:px-8 md:py-4 bg-white text-red-700 font-semibold md:font-bold rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base md:text-lg"
            >
              <FaUserPlus className="text-lg" /> Register as Donor
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/search")}
              className="flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3 md:px-8 md:py-4 bg-transparent border-2 border-white/80 text-white font-semibold md:font-bold rounded-lg hover:bg-red-800/90 hover:border-red-800 backdrop-blur-sm transition-all cursor-pointer text-sm sm:text-base md:text-lg"
            >
              <FaSearch className="text-lg" /> Find Donors Now
            </motion.button>
          </div>
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-red-100 text-xs sm:text-sm">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-1 md:gap-2"
            >
              <FaTint className="text-red-300 text-sm md:text-base" />
              <span>100% Safe</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-1 md:gap-2"
            >
              <FaHeartbeat className="text-red-300 text-sm md:text-base" />
              <span>FDA Approved</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-1 md:gap-2"
            >
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-red-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure Data</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-1 md:gap-2"
            >
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-red-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Quick Process</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
