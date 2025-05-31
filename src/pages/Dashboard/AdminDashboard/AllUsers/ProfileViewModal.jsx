import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  FiX,
  FiMail,
  FiMapPin,
  FiDroplet,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import CloseBtn from "../../../../Buttons/CloseBtn";

const ProfileViewModal = ({ user, onClose }) => {
  return (
    <AnimatePresence>
      {/* Backdrop with blur and fade */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      >
        {/* Modal container with spring animation */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            mass: 0.5,
          }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          {/* Close button with hover effect */}
          <div className="absolute top-1 right-1 z-10">
            <CloseBtn onClick={onClose} />
          </div>

          {/* Scrollable content with overflow gradient */}
          <div className="overflow-y-auto h-full">
            {/* Header with parallax effect */}
            <motion.div
              className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600"
              layoutId={`user-header-${user._id}`}
            >
              <motion.div
                className="absolute -bottom-12 left-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-white shadow-lg overflow-hidden"
                    layoutId={`user-avatar-${user._id}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=random`
                      }
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {user.verified && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <RiVerifiedBadgeFill className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Content with staggered animations */}
            <div className="pt-16 px-6 pb-6">
              <LayoutGroup>
                {/* Name with verification badge */}
                <motion.div
                  className="flex items-center gap-2 mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h2>
                </motion.div>

                {/* Email with icon */}
                <motion.div
                  className="flex items-center text-gray-500 dark:text-gray-400 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FiMail className="mr-2 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </motion.div>

                {/* Stats grid with pop-in effect */}
                <motion.div
                  className="grid grid-cols-3 gap-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, staggerChildren: 0.1 }}
                >
                  {[
                    { label: "Donations", value: user.donationCount || 0 },
                    { label: "Campaigns", value: user.campaignCount || 0 },
                    {
                      label: "Joined",
                      value: new Date(user.createdAt).getFullYear(),
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.1, type: "spring" }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Details section with smooth reveal */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Blood Group */}
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                      <FiDroplet className="text-red-500 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Blood Group
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.bloodGroup || "Not specified"}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                      <FiMapPin className="text-blue-500 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Location
                      </div>
                      {user.location ? (
                        <div className="font-medium text-gray-900 dark:text-white">
                          {[
                            user.location.division,
                            user.location.district,
                            user.location.upazila,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400">
                          Not specified
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                      <FiCalendar className="text-green-500 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Member Since
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </LayoutGroup>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileViewModal;
