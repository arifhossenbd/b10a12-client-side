import { useSearchParams } from "react-router";
import { useDatabaseData } from "../../hooks/useDatabaseData";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import BloodDonationRequestModal from "../DonationRequestModal/DonationRequestModal";
import { motion } from "framer-motion";
import { FaHeartbeat, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const SearchResult = () => {
  const [searchParams] = useSearchParams();

  const filters = {
    bloodGroup: searchParams.get("blood"),
    division: searchParams.get("division"),
    district: searchParams.get("district"),
    upazila: searchParams.get("upazila"),
  };

  const { data, isLoading, isError, error } = useDatabaseData("users", {
    filters,
    page: 1,
    limit: 100,
  });

  const donationModal = () => {
    document.getElementById("donationModal").showModal();
  };

  // Animation variants
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
      <div className="py-8 pt-24 px-4 lg:w-11/12 mx-auto text-center">
        <div className="flex justify-center">
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
            <FaHeartbeat />
          </motion.div>
        </div>
        <p className="mt-4 text-gray-600">Searching for donors...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 pt-24 px-4 lg:w-11/12 mx-auto text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const donors = data?.data?.data || [];
  const totalDonors = data?.data?.total || 0;

  return (
    <div className="py-8 pt-24 px-4 lg:w-11/12 mx-auto min-h-screen">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center text-red-600"
      >
        Search Results ({totalDonors})
      </motion.h2>

      {donors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 text-xl mb-4">
            No donors found matching your criteria.
          </div>
          <PrimaryBtn type="button" onClick={() => window.history.back()}>
            Back to Search
          </PrimaryBtn>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          {donors.map((donor) => (
            <motion.div
              key={donor._id}
              variants={item}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white transition-all duration-300 hover:border-red-100 hover:bg-red-50 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4 flex-shrink-0">
                  {donor.image ? (
                    <img 
                      src={donor.image} 
                      alt={`Profile of ${donor.name}`}
                      className="w-12 h-12 object-cover rounded-full"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <FaUser className="text-red-600 text-xl" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {donor.name}
                </h3>
              </div>

              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center">
                  <FaHeartbeat className="text-red-500 mr-3 flex-shrink-0" />
                  <span className="font-medium">
                    Blood Group:{" "}
                    <span className="text-red-600 font-bold">
                      {donor.bloodGroup}
                    </span>
                  </span>
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">
                    {donor.upazila}, {donor.district}, {donor.division}
                  </span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto"
              >
                <PrimaryBtn
                  type="button"
                  onClick={donationModal}
                  className="w-full flex justify-center items-center"
                >
                  <FaHeartbeat className="mr-2" />
                  Request Donation
                </PrimaryBtn>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <BloodDonationRequestModal />
    </div>
  );
};

export default SearchResult;