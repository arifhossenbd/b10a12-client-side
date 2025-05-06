import {
  FaClock,
  FaHeartbeat,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaEnvelope,
  FaHistory,
} from "react-icons/fa";
import { MdContactless } from "react-icons/md";
import { useDatabaseData } from "../../hooks/useDatabaseData";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useState } from "react";
import { Link } from "react-router-dom";
import SecondaryBtn from "../../Buttons/SecondaryBtn";
import dayjs from "dayjs";
import {
  formatDate,
  formatTime,
  getStatusConfig,
} from "../../utils/config.jsx";
import {
  scrollYAnimation,
  scrollLeftAnimation,
  scrollRightAnimation,
  containerVariants,
} from "../../utils/animation.js";
import { donationTimeValidate } from "../../utils/donationTimeValidate.js";

const DonationRequestDetails = ({
  requestId,
  closeModal,
  statusConfig,
  bloodGroupConfig,
  urgencyConfig,
  refetch,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const {
    data,
    isLoading,
    error,
    refetch: detailsRefetch,
  } = useDatabaseData(`blood-request`, {
    id: requestId,
  });

  const requestData = data?.data || {};
  const nowTime = dayjs().toISOString();

  // Destructure with proper fallbacks
  const {
    _id,
    donationInfo = {
      bloodGroup: "Not specified",
      requiredDate: nowTime || "",
      requiredTime: nowTime || "",
      urgency: "normal",
      additionalInfo: "",
    },
    donationStatus = "pending",
    location = {
      district: "",
      division: "",
      fullAddress: "",
      upazila: "",
    },
    metadata = {
      donorId: "",
      donorEmail: "",
      donorName: "",
    },
    recipient = {
      hospital: "Hospital not specified",
      name: "Recipient not specified",
    },
    requester = {
      name: "Requester not specified",
      email: "",
      id: "",
      createdAt: nowTime || "",
    },
    status = {
      current: "pending",
      history: [],
    },
    updatedAt,
  } = requestData;

  const donationProcess = donationStatus === "inprogress";

  const handleDonateClick = () => {
    if (
      !donationTimeValidate(
        donationInfo?.requiredDate,
        donationInfo?.requiredTime
      )
    ) {
      return toast.error(
        "This donation request has expired. The scheduled time has passed."
      );
    }

    if (donationProcess) {
      return toast.error(
        "Already in progress. You can't donate again. Try again later."
      );
    }
    closeModal();
    toast.custom(
      (t) => {
        const handleConfirm = async () => {
          try {
            setIsProcessing(true);
            const donationUpdate = {
              donationStatus: "inprogress",
              donorId: user?.uid,
              donorName: user?.displayName,
              donorEmail: user?.email,
              status: {
                current: "inprogress",
                history: [
                  ...(status?.history || []),
                  {
                    status: "inprogress",
                    changedAt: nowTime,
                    changedBy: {
                      id: user?.uid,
                      name: user?.displayName,
                      email: user?.email,
                    },
                  },
                ],
              },
              updatedAt: nowTime,
            };

            const response = await axiosPublic.patch(
              `/blood-request/${_id}`,
              donationUpdate
            );

            if (response.data.success) {
              await detailsRefetch();
              await refetch();
              toast.dismiss();
              toast.success(
                () => (
                  <motion.div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <FaHeartbeat className="text-green-500" />
                    </motion.div>
                    <span>Donation confirmed successfully!</span>
                  </motion.div>
                ),
                {
                  position: "top-center",
                  duration: 2000,
                }
              );
            }
          } catch (error) {
            console.error("Error:", error);
            toast.error(
              error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
          } finally {
            setIsProcessing(false);
          }
        };

        return (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                mass: 0.5,
              },
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
              transition: { duration: 0.2 },
            }}
            className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-auto p-4 sm:p-6 space-y-4 z-[9999] backdrop-blur-sm"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-md"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { repeat: Infinity, duration: 1.5 },
                }}
                className="bg-red-100 p-2 rounded-full"
              >
                <FaHeartbeat className="text-red-500 text-xl" />
              </motion.div>
            </motion.div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div>
                <motion.h3 className="font-bold text-lg sm:text-xl text-gray-800">
                  Confirm Your Donation
                </motion.h3>
                <motion.p className="text-gray-600 text-sm mt-1">
                  For{" "}
                  <span className="font-medium text-red-600">
                    {recipient?.name}
                  </span>{" "}
                  at <span className="font-medium">{recipient?.hospital}</span>
                </motion.p>
              </div>
            </div>

            <motion.div className="space-y-3 pt-2">
              {[
                { label: "Patient:", value: recipient?.name },
                { label: "Requested by:", value: requester?.name },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-500 text-xs md:text-sm">
                    {item?.label}
                  </span>
                  <span className="text-gray-700 font-medium text-right break-all">
                    {item?.value}
                  </span>
                </motion.div>
              ))}

              <motion.div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 text-xs md:text-sm">
                  Contact Requester:
                </span>
                <a
                  href={`mailto:${requester?.email}`}
                  className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
                >
                  <FaEnvelope className="mr-1.5" />
                  <span>Send Email</span>
                </a>
              </motion.div>
            </motion.div>

            <motion.div className="flex flex-wrap justify-end gap-3 pt-4">
              <SecondaryBtn
                onClick={() => toast.dismiss(t.id)}
                type="button"
                style="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 px-3 sm:px-4 rounded-md cursor-pointer py-1.5 sm:py-2"
              >
                Cancel
              </SecondaryBtn>
              <PrimaryBtn
                onClick={handleConfirm}
                disabled={isProcessing || donationProcess}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>Confirm Donation</span>
                )}
              </PrimaryBtn>
            </motion.div>
          </motion.div>
        );
      },
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {isLoading ? (
        <motion.div className="flex justify-center items-center min-h-[200px]">
          <div className="loading loading-xl loading-spinner text-red-500"></div>
        </motion.div>
      ) : error ? (
        <motion.div className="flex flex-col items-center justify-center min-h-[200px] text-red-500 p-4 sm:p-6">
          <FaExclamationTriangle className="text-3xl sm:text-4xl mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-medium">
            Failed to load request details
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4 md:space-y-6 lg:space-y-8"
        >
          {/* Header Section */}
          <motion.div
            {...scrollYAnimation}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <motion.div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <FaUser className="text-red-500 text-xl" />
              </div>
              <motion.div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words">
                  {recipient?.name || "Recipient Name Not Available"}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Requested by: {requester?.name || "Unknown Requester"}
                </p>
              </motion.div>
            </motion.div>

            <motion.div className="flex flex-wrap gap-2 mt-3">
              <span
                className={`py-1 px-2.5 sm:py-1.5 sm:px-3 text-xs sm:text-sm font-semibold rounded-full ${statusConfig?.color}`}
              >
                {statusConfig?.label}
              </span>
              <span
                className={`py-1 px-2.5 sm:py-1.5 sm:px-3 text-xs sm:text-sm font-semibold rounded-full ${urgencyConfig?.color}`}
              >
                {urgencyConfig?.label} Priority
              </span>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Contact Information */}
                <motion.div
                  {...scrollLeftAnimation}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <MdContactless className="text-blue-500 text-xl" />
                    <span>Contact Information</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-sm">Requester</p>
                      <p className="text-gray-700 font-medium text-base sm:text-lg">
                        {requester?.name || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <Link
                        to={`mailto:${requester?.email}`}
                        className="text-blue-400 hover:text-blue-600 break-all text-sm sm:text-base"
                      >
                        {requester?.email || "No email provided"}
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Medical Info */}
                <motion.div
                  {...scrollYAnimation}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaHeartbeat className="text-red-500 text-xl" />
                    <span>Medical Information</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Required Blood Group
                      </p>
                      <span
                        className={`font-bold text-lg sm:text-xl ${bloodGroupConfig?.color}`}
                      >
                        {donationInfo?.bloodGroup || "Not specified"}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">
                        Donation Date & Time
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-500 text-sm" />
                          <span className="text-gray-900 text-sm sm:text-base">
                            {formatDate(donationInfo?.requiredDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-500 text-sm" />
                          <span className="text-gray-900 text-sm sm:text-base">
                            {formatTime(donationInfo?.requiredTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Urgency Level</p>
                      <span
                        className={`font-medium text-base ${urgencyConfig?.textColor}`}
                      >
                        {urgencyConfig?.label}
                      </span>
                    </div>

                    {donationInfo?.additionalInfo && (
                      <div>
                        <p className="text-gray-500 text-sm">
                          Additional Notes
                        </p>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm sm:text-base">
                          {donationInfo?.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Location Details */}
                <motion.div
                  {...scrollRightAnimation}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-500 text-xl" />
                    <span>Location Details</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900 text-lg">
                        {recipient?.hospital || "Hospital not specified"}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {location?.fullAddress && (
                          <span>{location.fullAddress}, </span>
                        )}
                        {location?.upazila && <span>{location.upazila}, </span>}
                        {location?.district && (
                          <span>{location.district}, </span>
                        )}
                        {location?.division && <span>{location.division}</span>}
                        {!location?.fullAddress &&
                          !location?.upazila &&
                          !location?.district &&
                          !location?.division && (
                            <span>Location not specified</span>
                          )}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Requested</p>
                        <p className="text-gray-700 text-sm">
                          {requester?.createdAt ? (
                            <>
                              {formatDate(requester?.createdAt)}
                              <span className="text-gray-500 ml-2 text-xs">
                                {formatTime(requester?.createdAt)}
                              </span>
                            </>
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Updated</p>
                        <p className="text-gray-700 text-sm">
                          {updatedAt ? (
                            <>
                              {formatDate(updatedAt)}
                              <span className="text-gray-500 ml-2 text-xs">
                                {formatTime(updatedAt)}
                              </span>
                            </>
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Donor Info */}
                {metadata?.donorName && (
                  <motion.div
                    {...scrollRightAnimation}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100"
                  >
                    <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <FaUser className="text-blue-500 text-xl" />
                      <span>Donor Information</span>
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm sm:text-base">
                        <span className="text-gray-500">Name:</span>{" "}
                        <span className="font-medium">
                          {metadata?.donorName}
                        </span>
                      </p>
                      {metadata?.donorEmail && (
                        <p className="text-sm sm:text-base">
                          <span className="text-gray-500">Email:</span>{" "}
                          <Link
                            to={`mailto:${metadata?.donorEmail}`}
                            className="text-blue-400 hover:text-blue-500"
                          >
                            {metadata?.donorEmail}
                          </Link>
                        </p>
                      )}
                      <p className="text-sm sm:text-base">
                        <span className="text-gray-500">Status:</span>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs sm:text-sm ${statusConfig?.color}`}
                        >
                          {statusConfig?.label}
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Status History Section */}
            <motion.div
              {...scrollYAnimation}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 mb-6 sm:mb-8"
            >
              <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <FaHistory className="text-purple-500 text-xl" />
                <span>Status History</span>
              </h3>

              {status?.history?.length > 0 ? (
                <motion.ul
                  {...scrollYAnimation}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="timeline timeline-vertical"
                >
                  {[...status.history]
                    .sort(
                      (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
                    )
                    .map((item, index, array) => {
                      const statusValue = item?.status;
                      const changedAt = item.changedAt;
                      const changedByValue = item?.changedBy;
                      const historyStatusConfig = getStatusConfig(statusValue);
                      const isCurrent = status.current === statusValue;
                      const isLastItem = index === array.length - 1;

                      return (
                        <li key={index}>
                          {index !== 0 && <hr className="bg-gray-200" />}

                          {index % 2 === 0 ? (
                            <motion.div
                              {...scrollLeftAnimation}
                              transition={{ duration: 0.8, delay: 0.1 }}
                              className="timeline-start timeline-box w-full"
                            >
                              <div className="font-medium text-sm sm:text-base">
                                {historyStatusConfig?.label}
                              </div>
                              <div className="flex flex-col sm:flex-row align-baseline gap-1 sm:gap-2">
                                <div>
                                  <div className="text-xs text-gray-500">
                                    {formatDate(changedAt)} •{" "}
                                    {formatTime(changedAt)}
                                  </div>
                                  {changedByValue && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      Changed by:{" "}
                                      {typeof changedByValue === "string"
                                        ? changedByValue
                                        : changedByValue?.name || "System"}
                                    </div>
                                  )}
                                </div>
                                {isCurrent && (
                                  <div className="badge badge-sm sm:badge-md badge-primary mt-1 sm:mt-0">
                                    Current
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              {...scrollRightAnimation}
                              transition={{ duration: 0.8, delay: 0.1 }}
                              className="timeline-end timeline-box w-full"
                            >
                              <div className="font-medium text-sm sm:text-base">
                                {historyStatusConfig?.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(changedAt)} •{" "}
                                {formatTime(changedAt)}
                              </div>
                              {changedByValue && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Changed by:{" "}
                                  {typeof changedByValue === "string"
                                    ? changedByValue
                                    : changedByValue?.name || "System"}
                                </div>
                              )}
                              {isCurrent && (
                                <div className="badge badge-sm sm:badge-md badge-primary mt-1">
                                  Current
                                </div>
                              )}
                            </motion.div>
                          )}

                          <div className="timeline-middle">
                            <div
                              className={`p-1 sm:p-1.5 rounded-full ${historyStatusConfig?.bgColor}`}
                            >
                              <historyStatusConfig.Icon
                                className={`${historyStatusConfig?.iconColor} h-3 w-3 sm:h-4 sm:w-4`}
                              />
                            </div>
                          </div>

                          {!isLastItem && <hr className="bg-gray-200" />}
                        </li>
                      );
                    })}
                </motion.ul>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">
                  No status history available
                </p>
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            {...scrollYAnimation}
            transition={{ duration: 0.6, delay: 0.2, stiffness: 0.1 }}
            className="flex justify-end border-t border-t-gray-200 pt-4 sm:pt-6"
          >
            {!donationTimeValidate(
              donationInfo.requiredDate,
              donationInfo.requiredTime
            ) ? (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg w-full text-center text-sm sm:text-base">
                <FaExclamationTriangle className="inline mr-2" />
                This donation request has expired
              </div>
            ) : (
              <PrimaryBtn
                toolTipText={
                  donationStatus === "inprogress"
                    ? "Already being processed"
                    : "Confirm your donation"
                }
                onClick={handleDonateClick}
                disabled={isProcessing || donationStatus === "inprogress"}
                style="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 tooltip tooltip-info tooltip-top md:tooltip-left"
              >
                {isProcessing
                  ? "Processing..."
                  : donationStatus === "inprogress"
                  ? "In Progress"
                  : "I Can Donate"}
              </PrimaryBtn>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DonationRequestDetails;
