import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDatabaseData } from "../../hooks/useDatabaseData";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import SecondaryBtn from "../../Buttons/SecondaryBtn";
import DonationRequestModal from "../DonationRequestModal/DonationRequestModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeartbeat, FaMapMarkerAlt, FaUser, FaSync } from "react-icons/fa";
import { useState } from "react";
import DonorCardSkeleton from "../../component/Skeleton/DonorCardSkeleton";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [selectedDonor, setSelectedDonor] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const queryParams = {};

  const bloodGroup = searchParams.get("bloodGroup");
  const division = searchParams.get("division");
  const district = searchParams.get("district");
  const upazila = searchParams.get("upazila");

  if (bloodGroup) queryParams.bloodGroup = bloodGroup;
  if (division) queryParams.division = division;
  if (district) queryParams.district = district;
  if (upazila) queryParams.upazila = upazila;

  const { data, isLoading, isError, error, refetch } = useDatabaseData(
    "/users",
    {
      ...queryParams,
      page: 1,
      limit: 100,
    }
  );

  const donors = data?.data || [];
  const isEmptyResponse = donors?.length === 0 && !isLoading && !isError;
  const isNetworkError = error.code === "ERR_NETWORK";

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const openDonationModal = (donor) => {
    setSelectedDonor(donor);
    document.getElementById("donationModal").showModal();
  };

  // Animation variants
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

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
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

  const errorVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (isLoading) {
    return <DonorCardSkeleton count={donors?.length || 6} />;
  }

  if (isError) {
    return (
      <motion.div
        variants={errorVariants}
        initial="hidden"
        animate="show"
        className="text-center py-12 flex flex-col items-center justify-center min-h-screen"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            transition: { repeat: 3, duration: 0.5 },
          }}
          className="mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500"
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
          {isNetworkError ? "Connection Error" : "Failed to search"}
        </motion.h3>
        <motion.p className="text-red-500 mb-6 max-w-md mx-auto items-center">
          {isNetworkError
            ? "Unable to connect to server. Please check your network connection."
            : error?.message || "An unknown error occurred"}
        </motion.p>
        <motion.div className="flex gap-4 mt-6">
          <PrimaryBtn
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Search
          </PrimaryBtn>
          <SecondaryBtn
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
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
    );
  }

  if (isEmptyResponse) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 flex flex-col items-center justify-center min-h-screen"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 2 },
          }}
          className="mb-6"
        >
          <FaHeartbeat className="text-red-500 text-5xl" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-xl mb-6"
        >
          No donors found matching your criteria.
        </motion.div>
        <motion.div
          className="flex items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SecondaryBtn
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
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
              "Refresh"
            )}
          </SecondaryBtn>
          <PrimaryBtn
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Search
          </PrimaryBtn>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="py-8 pt-24 px-4 lg:w-11/12 mx-auto min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mb-10"
      >
        {/* Main Heading with Animation */}
        <motion.div variants={titleVariants} className="text-center mb-6">
          <motion.h1
            className="text-4xl font-bold text-red-600 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Donor Search Results
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {donors?.length} matching donors found
          </motion.p>
        </motion.div>

        {/* Search Summary with Staggered Animation */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-red-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex-1">
            <motion.div
              className="flex flex-wrap gap-2 justify-center sm:justify-start"
              variants={containerVariants}
            >
              {bloodGroup && (
                <motion.span
                  variants={itemVariants}
                  className="badge badge-lg bg-red-100 text-red-600 border-red-200"
                >
                  Blood Group: {bloodGroup}
                </motion.span>
              )}
              {division && (
                <motion.span
                  variants={itemVariants}
                  className="badge badge-lg bg-red-100 text-red-600 border-red-200"
                >
                  Division: {division}
                </motion.span>
              )}
              {district && (
                <motion.span
                  variants={itemVariants}
                  className="badge badge-lg bg-red-100 text-red-600 border-red-200"
                >
                  District: {district}
                </motion.span>
              )}
              {upazila && (
                <motion.span
                  variants={itemVariants}
                  className="badge badge-lg bg-red-100 text-red-600 border-red-200"
                >
                  Upazila: {upazila}
                </motion.span>
              )}
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <SecondaryBtn
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              {isRefreshing ? (
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
                  Refresh Results
                </>
              )}
            </SecondaryBtn>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          <motion.div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors?.map((donor) => (
              <motion.div
                key={donor?._id}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                layout
                className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:border-red-100 hover:bg-red-50 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-red-100 p-3 rounded-full mr-4 flex-shrink-0"
                  >
                    {donor?.image ? (
                      <motion.img
                        src={donor?.image}
                        alt={`Profile of ${donor?.name}`}
                        className="w-12 h-12 object-cover rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = (
                            <FaUser className="text-red-600 text-xl" />
                          );
                        }}
                      />
                    ) : (
                      <FaUser className="text-red-600 text-xl" />
                    )}
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold text-gray-800 truncate"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {donor?.name}
                  </motion.h3>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaHeartbeat className="text-red-500 mr-3 flex-shrink-0" />
                    <span className="font-medium">
                      Blood Group:{" "}
                      <span className="text-red-600 font-bold">
                        {donor?.bloodGroup}
                      </span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FaMapMarkerAlt className="text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      {donor?.location?.upazila}, {donor?.location?.district},{" "}
                      {donor?.location?.division}
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <PrimaryBtn
                    type="button"
                    onClick={() => openDonationModal(donor)}
                    className="w-full flex justify-center items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-md px-4 py-2 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaHeartbeat className="mr-2" />
                    Request Donation
                  </PrimaryBtn>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <DonationRequestModal donor={selectedDonor} />
    </div>
  );
};

export default SearchResult;
