import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import DonationRequestCard from "./DonationRequestCard";
import DonationRequestDetails from "./DonationRequestDetails";
import { motion, AnimatePresence } from "framer-motion";
import SecondaryBtn from "../../Buttons/SecondaryBtn";
import Search from "../Search/Search";
import {
  FaHeartbeat,
  FaSync,
  FaExclamationTriangle,
  FaSearch,
  FaClock,
} from "react-icons/fa";
import RequestCardSkeleton from "../../component/Skeleton/RequestCardSkeleton";
import CloseBtn from "../../Buttons/CloseBtn";
import useDatabaseData from "../../hooks/useDatabaseData";
import { useAuth } from "../../hooks/useAuth";
import Pagination from "../../component/Pagination/Pagination";
import useUserRole from "../../hooks/useUserRole";

const DonationRequests = () => {
  const navigate = useNavigate();
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { role } = useUserRole();
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  const {
    data: responseData,
    isLoading,
    refetch,
    error,
    isError,
    isRefetching,
  } = useDatabaseData(
    `/blood-requests?email=${user?.email}&role=${role}&page=${currentPage}&limit=${itemsPerPage}`
  );

  const bloodRequests = responseData?.data || [];
  const meta = responseData?.meta || {};

  const isNetworkError = error?.code === "ERR_NETWORK";
  const isEmptyResponse = bloodRequests?.length === 0 && !isLoading && !isError;

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const handleViewDetails = (id) => {
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
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

  return (
    <div
      className={`${
        isLoading ? "" : `pt-24 py-8`
      } px-4 lg:w-11/12 mx-auto min-h-screen`}
    >
      {isLoading ? (
        <RequestCardSkeleton count={6} />
      ) : isError ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              transition: { repeat: 3, duration: 0.5 },
            }}
            className="mb-6"
          >
            <FaExclamationTriangle className="h-16 w-16 text-red-500 mx-auto" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {isNetworkError ? "Connection Error" : "Failed to Load Requests"}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {isNetworkError
              ? "Unable to connect to server. Please check your network connection."
              : error?.message || "An unknown error occurred"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <PrimaryBtn onClick={() => navigate(-1)}>Go Back</PrimaryBtn>
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
          </div>
        </motion.div>
      ) : (
        <div>
          {/* Header Section */}
          <motion.div
            initial="hidden"
            animate="show"
            className="mb-10 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">
              Blood Donation Requests
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              {bloodRequests?.length > 0
                ? `${bloodRequests?.length} urgent requests need your help`
                : "No active requests currently"}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="badge badge-lg bg-red-100 text-red-600 border-red-200">
                <FaHeartbeat className="mr-2" />
                Life-Saving Requests
              </span>

              {bloodRequests?.length > 0 && (
                <span className="badge badge-lg bg-blue-100 text-blue-600 border-blue-200">
                  <FaClock className="mr-2" />
                  {bloodRequests?.length} Active
                </span>
              )}
            </div>

            {bloodRequests?.length > 0 && (
              <div className="flex justify-center gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2"
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2"
                >
                  <SecondaryBtn
                    onClick={() =>
                      document.getElementById("searchModal").showModal()
                    }
                  >
                    <motion.span
                      animate={{
                        x: [0, 3, -2, 0],
                        y: [0, 2, -1, 0],
                        rotate: [0, 5, -5, 0],
                        transition: {
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 3,
                          ease: "easeInOut",
                        },
                      }}
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <FaSearch />
                    </motion.span>
                    Search Donors
                  </SecondaryBtn>
                </motion.div>
              </div>
            )}
          </motion.div>

          {isEmptyResponse ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
                <SecondaryBtn onClick={handleRefresh}>Refresh</SecondaryBtn>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2"
                >
                  <SecondaryBtn
                    onClick={() =>
                      document.getElementById("searchModal").showModal()
                    }
                  >
                    <motion.span
                      animate={{
                        x: [0, 3, -2, 0],
                        y: [0, 2, -1, 0],
                        rotate: [0, 5, -5, 0],
                        transition: {
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 3,
                          ease: "easeInOut",
                        },
                      }}
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <FaSearch />
                    </motion.span>
                    Search Donors
                  </SecondaryBtn>
                </motion.div>
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
                      variants={containerVariants.children}
                      whileHover="hover"
                      layout
                    >
                      <DonationRequestCard
                        request={bloodRequest}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {meta?.totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={meta?.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Details Modal */}
          <dialog
            open={isModalOpen}
            onClose={closeModal}
            className="modal modal-middle"
          >
            <div className="modal-box max-w-3xl relative overflow-x-hidden">
              {selectedRequestId && (
                <DonationRequestDetails
                  requestId={selectedRequestId}
                  refetch={refetch}
                  closeModal={closeModal}
                />
              )}
              <div className="absolute right-7 top-8 -translate-0.5">
                <CloseBtn onClick={closeModal} />
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={closeModal}>close</button>
            </form>
          </dialog>

          {/* Search Modal */}
          <Search />
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
