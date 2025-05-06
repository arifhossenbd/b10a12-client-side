import { useNavigate } from "react-router-dom";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import { useDatabaseData } from "../../hooks/useDatabaseData";
import DonationRequestCard from "./DonationRequestCard";
import { motion, AnimatePresence } from "framer-motion";
import SecondaryBtn from "../../Buttons/SecondaryBtn";
import Search from "../Search/Search";

const DonationRequests = () => {
  const navigate = useNavigate();
  const { data, isLoading, isRefetching, refetch, isError, error } =
    useDatabaseData("blood-requests", {
      page: 1,
      limit: 100,
    });

  const bloodRequests = data?.data?.data || [];

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div className={`${isLoading ? "" : `pt-24 py-8`} px-4 lg:w-11/12 mx-auto`}>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen flex flex-col justify-center items-center text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="mb-4"
          >
            <span className="loading loading-spinner loading-xl text-red-500"></span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-center"
          >
            Loading donation requests...
          </motion.p>
        </motion.div>
      ) : isError ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </motion.div>
          <motion.h3 className="text-xl font-medium text-gray-800 mb-2 items-center text-center">
            Failed to load requests
          </motion.h3>
          <motion.p className="text-red-500 mb-6 max-w-md mx-auto items-center">
            {error?.message || "An unknown error occurred"}
          </motion.p>
          <motion.div className="flex justify-center gap-4 items-center">
            <SecondaryBtn
              onClick={handleRefresh}
              disabled={isRefetching}
              style="rounded-md hover:bg-red-600 hover:text-white border border-red-500 text-gray-600 hover:border-red-50 py-2 px-6 font-medium cursor-pointer transition-all duration-200 linear"
            >
              {isRefetching ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Refreshing
                </span>
              ) : (
                "Try Again"
              )}
            </SecondaryBtn>
            <PrimaryBtn onClick={() => navigate(-1)}>Go Back</PrimaryBtn>
          </motion.div>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 items-center text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Pending Donation Requests
            </h2>
            {bloodRequests.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex flex-col items-center justify-center gap-5"
              >
                <p className="text-gray-500 text-lg">
                  No donation requests found.
                </p>
                <SecondaryBtn
                  onClick={() =>
                    document.getElementById("searchModal").showModal()
                  }
                >
                  Go to Search
                </SecondaryBtn>
              </motion.div>
            )}
            <Search />
          </motion.div>

          <AnimatePresence>
            {bloodRequests.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {bloodRequests.map((bloodRequest) => (
                  <motion.div
                    key={bloodRequest?._id}
                    variants={itemVariants}
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
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default DonationRequests;
