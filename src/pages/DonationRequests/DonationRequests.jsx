import { useNavigate } from "react-router-dom";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import { useDatabaseData } from "../../hooks/useDatabaseData";
import DonationRequestCard from "./DonationRequestCard";
import { motion, AnimatePresence } from "framer-motion";
import SecondaryBtn from "../../Buttons/SecondaryBtn";
import Search from "../Search/Search";
import { FaHeartbeat, FaSync, FaExclamationTriangle, FaSearch, FaClock } from "react-icons/fa";
import RequestCardSkeleton from "../../component/Skeleton/RequestCardSkeleton";

const DonationRequests = () => {
  const navigate = useNavigate();
  const { 
    data, 
    isLoading, 
    isRefetching, 
    refetch, 
    isError, 
    error 
  } = useDatabaseData(
    "/blood-requests", 
    {
      page: 1,
      limit: 100,
    },
  );

  const bloodRequests = data?.data || [];
  const isNetworkError = error?.code === 'ERR_NETWORK';
  const isEmptyResponse = bloodRequests.length === 0 && !isLoading && !isError;

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Animation Variants
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
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.96
    },
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
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 } 
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

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        mass: 0.5
      }
    }
  };

  const errorVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className={`${isLoading ? "" : `pt-24 py-8`} px-4 lg:w-11/12 mx-auto min-h-screen`}>
      {isLoading ? (
        <RequestCardSkeleton count={6} />
      ) : isError ? (
        <motion.div
          variants={errorVariants}
          initial="hidden"
          animate="show"
          className="text-center py-20"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              transition: { repeat: 3, duration: 0.5 }
            }}
            className="mb-6"
          >
            <FaExclamationTriangle className="h-16 w-16 text-red-500 mx-auto" />
          </motion.div>
          <motion.h3 className="text-2xl font-bold text-gray-800 mb-3">
            {isNetworkError ? "Connection Error" : "Failed to Load Requests"}
          </motion.h3>
          <motion.p className="text-gray-600 mb-8 max-w-md mx-auto">
            {isNetworkError
              ? "Unable to connect to server. Please check your network connection."
              : error?.message || "An unknown error occurred"}
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-4">
            <PrimaryBtn 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              Go Back
            </PrimaryBtn>
            <SecondaryBtn
              onClick={handleRefresh}
              disabled={isRefetching}
              className="flex items-center gap-2"
            >
              {isRefetching ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <FaSync className="text-sm" />
                  </motion.span>
                  Refreshing...
                </>
              ) : (
                "Try Again"
              )}
            </SecondaryBtn>
          </motion.div>
        </motion.div>
      ) : (
        <div>
          {/* Enhanced Header Section */}
          <motion.div
            initial="hidden"
            animate="show"
            className="mb-10 text-center"
          >
            <motion.h1
              variants={titleVariants}
              className="text-3xl md:text-4xl font-bold text-red-600 mb-3"
            >
              Blood Donation Requests
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.3, duration: 0.5 }
              }}
            >
              {bloodRequests.length > 0 
                ? `${bloodRequests.length} urgent requests need your help`
                : "No active requests currently"}
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.4 }
              }}
            >
              <motion.span 
                className="badge badge-lg bg-red-100 text-red-600 border-red-200"
                variants={itemVariants}
              >
                <FaHeartbeat className="mr-2" />
                Life-Saving Requests
              </motion.span>
              
              {bloodRequests.length > 0 && (
                <motion.span
                  className="badge badge-lg bg-blue-100 text-blue-600 border-blue-200"
                  variants={itemVariants}
                >
                  <FaClock className="mr-2" />
                  {bloodRequests.length} Active
                </motion.span>
              )}
            </motion.div>

            <motion.div
              className="flex justify-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.5 }
              }}
            >
              <SecondaryBtn
                onClick={handleRefresh}
                disabled={isRefetching}
                className="flex items-center gap-2"
              >
                {isRefetching ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <FaSync className="text-sm" />
                    </motion.span>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FaSync className="text-sm" />
                    Refresh
                  </>
                )}
              </SecondaryBtn>

              <PrimaryBtn
                onClick={() => document.getElementById("searchModal").showModal()}
                className="flex items-center gap-2"
              >
                <FaSearch className="text-sm" />
                Search Donors
              </PrimaryBtn>
            </motion.div>
          </motion.div>

          {isEmptyResponse ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex flex-col items-center justify-center gap-5"
            >
              <div className="text-center">
                <FaHeartbeat className="text-red-400 text-5xl mx-auto mb-4" />
                <p className="text-gray-500 text-xl">
                  No active donation requests found.
                </p>
                <p className="text-gray-400 mt-2">
                  Check back later or search for donors.
                </p>
              </div>
              <div className="flex gap-4">
                <SecondaryBtn
                  onClick={handleRefresh}
                >
                  Refresh
                </SecondaryBtn>
                <PrimaryBtn
                  onClick={() => document.getElementById("searchModal").showModal()}
                >
                  Search Donors
                </PrimaryBtn>
              </div>
            </motion.div>
          ) : (
            <>
              {isRefetching && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed top-4 right-4 z-50 bg-white p-2 rounded-full shadow-lg"
                >
                  <span className="loading loading-spinner loading-sm text-red-500"></span>
                </motion.div>
              )}
              <AnimatePresence>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {bloodRequests?.map((bloodRequest) => (
                    <motion.div
                      key={bloodRequest._id}
                      variants={itemVariants}
                      whileHover="hover"
                      layout
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <DonationRequestCard
                        request={bloodRequest}
                        refetch={refetch}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
          <Search />
        </div>
      )}
    </div>
  );
};

export default DonationRequests;