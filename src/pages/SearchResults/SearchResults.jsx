import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDatabaseData } from "../../hooks/useDatabaseData";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import DonationRequestModal from "../DonationRequestModal/DonationRequestModal";
import { motion } from "framer-motion";
import { FaHeartbeat, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useState } from "react";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [selectedDonor, setSelectedDonor] = useState({});
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

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useDatabaseData("donors", queryParams);

  const donors = data?.data || [];

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const openDonationModal = (donor) => {
    setSelectedDonor(donor);
    document.getElementById("donationModal").showModal();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-red-500 text-4xl"
        >
          <FaHeartbeat size={50} />
        </motion.div>
        <p className="mt-4 text-gray-600 ml-4">Searching for donors...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 flex flex-col items-center justify-center min-h-screen"
      >
        <p className="text-red-500 mb-4">Error: {error?.message}</p>
        <PrimaryBtn type="button" onClick={() => navigate(-1)}>
          Retry
        </PrimaryBtn>
      </motion.div>
    );
  }

  if (donors?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 flex flex-col items-center justify-center min-h-screen"
      >
        <div className="text-gray-500 text-xl mb-4">
          No donors found matching your criteria.
        </div>
        <div className="flex items-center gap-5">
          <SecondaryBtn
            onClick={handleRefresh}
            disabled={isRefetching}
            style="rounded-md hover:bg-red-600 hover:text-white border border-red-500 text-gray-600 hover:border-red-50 py-1 px-4 font-medium cursor-pointer transition-all duration-200 linear"
          >
            {isRefetching ? "Refreshing..." : "Refresh"}
          </SecondaryBtn>
          <PrimaryBtn type="button" onClick={() => navigate(-1)}>
            Back to Search
          </PrimaryBtn>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="py-8 pt-24 px-4 lg:w-11/12 mx-auto min-h-screen">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center text-red-600"
      >
        Search Results ({donors.length})
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {donors.map((donor) => (
          <motion.div
            key={donor?._id}
            variants={item}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white transition-all duration-300 hover:border-red-100 hover:bg-red-50 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-4 flex-shrink-0">
                {donor?.image ? (
                  <img
                    src={donor?.image}
                    alt={`Profile of ${donor?.name}`}
                    className="w-12 h-12 object-cover rounded-full"
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
              </div>
              <h3 className="text-xl font-bold text-gray-800 truncate">
                {donor?.name}
              </h3>
            </div>

            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex items-center">
                <FaHeartbeat className="text-red-500 mr-3 flex-shrink-0" />
                <span className="font-medium">
                  Blood Group:{" "}
                  <span className="text-red-600 font-bold">
                    {donor?.bloodGroup}
                  </span>
                </span>
              </div>

              <div className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600">
                  {donor?.location?.upazila}, {donor?.location?.district},{" "}
                  {donor?.location?.division}
                </span>
              </div>
            </div>

            <div className="mt-auto">
              <PrimaryBtn
                type="button"
                onClick={() => openDonationModal(donor)}
                className="w-full flex justify-center items-center bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 cursor-pointer"
              >
                <FaHeartbeat className="mr-2" />
                Request Donation
              </PrimaryBtn>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <DonationRequestModal donor={selectedDonor} />
    </div>
  );
};

export default SearchResult;
