import { useState } from "react";
import { FaEdit, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import useUserRole from "../../../hooks/useUserRole";
import ProfileEditModal from "./ProfileEditModal";

const Profile = () => {
  const { userData, loading: userLoading, refetch } = useUserRole();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safely destructure userData with fallbacks
  const { 
    name = '', 
    email = '', 
    bloodGroup = '', 
    image = null, 
    location = {
      division: '',
      district: '',
      upazila: ''
    } 
  } = userData || {};

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <span className="loading loading-spinner text-primary"></span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Profile Information
          </h2>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary border-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed ring-0 focus:ring-0 transition-colors duration-200 text-white shadow-sm hover:shadow-md active:shadow-none disabled:opacity-50"
            disabled={userLoading}
          >
            <FaEdit />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-4 md:p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="w-full.5 border border-gray-200 rounded-lg bg-gray-100">
                {name}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="w-full.5 border border-gray-200 rounded-lg bg-gray-100">
                {email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <div className="w-full.5 border border-gray-200 rounded-lg bg-gray-100">
                {bloodGroup || "Not specified"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Division
              </label>
              <div className="w-full.5 border border-gray-200 rounded-lg bg-gray-100">
                {location?.division || "Not specified"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <div className="w-full.5 border border-gray-200 rounded-lg bg-gray-100">
                {location?.district || "Not specified"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upazila
              </label>
              <div className="w-full.5 border border-gray-200 rounded-lg bg-gray-100">
                {location?.upazila || "Not specified"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <ProfileEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData}
        refetch={refetch}
      />
    </div>
  );
};

export default Profile;