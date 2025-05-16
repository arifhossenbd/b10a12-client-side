import {
  FaClock,
  FaHeartbeat,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaHistory,
} from "react-icons/fa";
import { MdContactless } from "react-icons/md";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  formatDate,
  formatTime,
  getStatusConfig,
  getUrgencyConfig,
  getBloodGroupConfig,
  baseConfig,
} from "../../utils/config.jsx";
import {
  scrollYAnimation,
  scrollLeftAnimation,
  scrollRightAnimation,
  containerVariants,
} from "../../utils/animation.js";
import { donationTimeValidate } from "../../utils/donationTimeValidate.js";
import useCustomToast from "../../hooks/useCustomToast.jsx";
import useDatabaseData from "../../hooks/useDatabaseData.jsx";

const DonationRequestDetails = ({ requestId, refetch }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { axiosPublic } = useAxiosPublic();
  const { showConfirmationToast } = useCustomToast();
  const nowTime = useMemo(() => dayjs().toISOString(), []);

  const {
    data,
    isLoading,
    error,
    refetch: detailsRefetch,
  } = useDatabaseData(requestId ? `/blood-requests/${requestId}` : null);

  const requestData = useMemo(() => data?.data || {}, [data]);

  const {
    _id = "",
    donationInfo = {},
    donationStatus = "pending",
    location = {},
    metadata = {},
    recipient = {},
    requester = {},
    status = {},
    updatedAt = nowTime,
  } = requestData;

  // Get configs using your imported functions
  const urgencyConfig = getUrgencyConfig(donationInfo?.urgency);
  const statusConfig = getStatusConfig(status);
  const bloodGroupConfig = getBloodGroupConfig(donationInfo?.bloodGroup);

  const safeData = useMemo(
    () => ({
      donationInfo: {
        bloodGroup: "Not specified",
        requiredDate: nowTime,
        requiredTime: nowTime,
        urgency: "normal",
        additionalInfo: "",
        ...donationInfo,
      },
      location: {
        district: "",
        division: "",
        fullAddress: "",
        upazila: "",
        ...location,
      },
      metadata: {
        donorId: "",
        donorEmail: "",
        donorName: "",
        ...metadata,
      },
      recipient: {
        hospital: "Hospital not specified",
        name: "Recipient not specified",
        ...recipient,
      },
      requester: {
        name: "Requester not specified",
        email: "",
        id: "",
        createdAt: nowTime,
        ...requester,
      },
      status: {
        current: "pending",
        history: [],
        ...status,
      },
    }),
    [donationInfo, location, metadata, nowTime, recipient, requester, status]
  );

  const isRequester = useMemo(() => {
    return user?.uid === safeData.requester.id;
  }, [user?.uid, safeData.requester.id]);

  const isAssignedDonor = useMemo(() => {
    return user?.uid === safeData.metadata.donorId;
  }, [user?.uid, safeData.metadata.donorId]);

  const canDonate = useMemo(() => {
    return !isRequester && !isAssignedDonor && donationStatus !== "inprogress";
  }, [isRequester, isAssignedDonor, donationStatus]);

  const donationProcess = donationStatus === "inprogress" && !isAssignedDonor;

  const handleDonateClick = useCallback(() => {
    if (
      !donationTimeValidate(
        safeData.donationInfo.requiredDate,
        safeData.donationInfo.requiredTime
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

    if (isRequester) {
      return toast.error("You cannot donate to your own request");
    }

    if (!canDonate) {
      return toast.error("You are not eligible to donate to this request");
    }

    showConfirmationToast({
      title: "Confirm Your Donation",
      description: `For ${safeData.recipient.name} at ${safeData.recipient.hospital}`,
      items: [
        { label: "Patient:", value: safeData.recipient.name },
        { label: "Requested by:", value: safeData.requester.name },
      ],
      contactEmail: safeData.requester.email,
      confirmText: "Confirm Donation",
      onConfirm: async () => {
        try {
          setIsProcessing(true);
          const donationUpdate = {
            donationStatus: "inprogress",
            metadata: {
              ...safeData.metadata,
              donorId: user?.uid,
              donorName: user?.displayName,
              donorEmail: user?.email,
            },
            status: {
              current: "inprogress",
              history: [
                ...(safeData.status.history || []),
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
            `/blood-requests/${_id}`,
            donationUpdate
          );

          if (response.data.success) {
            await detailsRefetch();
            await refetch();
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
      },
    });
  }, [
    _id,
    isRequester,
    donationProcess,
    detailsRefetch,
    refetch,
    nowTime,
    safeData,
    user,
    axiosPublic,
    canDonate,
    showConfirmationToast,
  ]);

  if (isLoading) {
    return (
      <motion.div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[200px] text-red-500 p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaExclamationTriangle className="text-3xl sm:text-4xl mb-3 sm:mb-4" />
        <p className="text-base sm:text-lg font-medium">
          Failed to load request details
        </p>
      </motion.div>
    );
  }

  return (
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
              {safeData.recipient.name || "Recipient Name Not Available"}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Requested by: {safeData.requester.name || "Unknown Requester"}
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
                    {safeData.requester.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <Link
                    to={`mailto:${safeData.requester.email}`}
                    className="text-blue-400 hover:text-blue-600 break-all text-sm sm:text-base"
                  >
                    {safeData.requester.email || "No email provided"}
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
                  <p className="text-gray-500 text-sm">Required Blood Group</p>
                  <span
                    className={`font-bold text-lg sm:text-xl ${bloodGroupConfig?.color}`}
                  >
                    {safeData.donationInfo.bloodGroup || "Not specified"}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Donation Date & Time</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500 text-sm" />
                      <span className="text-gray-900 text-sm sm:text-base">
                        {formatDate(safeData.donationInfo.requiredDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-500 text-sm" />
                      <span className="text-gray-900 text-sm sm:text-base">
                        {formatTime(safeData.donationInfo.requiredTime)}
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

                {safeData.donationInfo.additionalInfo && (
                  <div>
                    <p className="text-gray-500 text-sm">Additional Notes</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm sm:text-base">
                      {safeData.donationInfo.additionalInfo}
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
                    {safeData.recipient.hospital || "Hospital not specified"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {safeData.location.fullAddress && (
                      <span>{safeData.location.fullAddress}, </span>
                    )}
                    {safeData.location.upazila && (
                      <span>{safeData.location.upazila}, </span>
                    )}
                    {safeData.location.district && (
                      <span>{safeData.location.district}, </span>
                    )}
                    {safeData.location.division && (
                      <span>{safeData.location.division}</span>
                    )}
                    {!safeData.location.fullAddress &&
                      !safeData.location.upazila &&
                      !safeData.location.district &&
                      !safeData.location.division && (
                        <span>Location not specified</span>
                      )}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Requested</p>
                    <p className="text-gray-700 text-sm">
                      {safeData.requester.createdAt ? (
                        <>
                          {formatDate(safeData.requester.createdAt)}
                          <span className="text-gray-500 ml-2 text-xs">
                            {formatTime(safeData.requester.createdAt)}
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
            {safeData.metadata.donorName && (
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
                      {safeData.metadata.donorName}
                    </span>
                  </p>
                  {safeData.metadata.donorEmail && (
                    <p className="text-sm sm:text-base">
                      <span className="text-gray-500">Email:</span>{" "}
                      <Link
                        to={`mailto:${safeData.metadata.donorEmail}`}
                        className="text-blue-400 hover:text-blue-500"
                      >
                        {safeData.metadata.donorEmail}
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
          transition={{ duration: 0.8, delay: 0.5, stiffness: 0.1 }}
          className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 mb-6 sm:mb-8"
        >
          <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <FaHistory className="text-purple-500 text-xl" />
            <span>Status History</span>
          </h3>

          {safeData.status.history?.length > 0 ? (
            <motion.ul className="timeline timeline-vertical">
              {[...safeData.status.history]
                .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                .map((item, index, array) => {
                  const statusValue = item?.status;
                  const changedAt = item?.changedAt;
                  const changedByValue = item?.changedBy;
                  const historyStatusConfig = getStatusConfig(statusValue);
                  const isCurrent =
                    index === 0 && safeData.status.current === item.status;
                  const isLastItem = index === array.length - 1;

                  return (
                    <li key={index}>
                      {index !== 0 && <hr className="bg-gray-200" />}

                      <div className="timeline-middle">
                        <div
                          className={`p-1 sm:p-1.5 rounded-full ${historyStatusConfig?.bgColor}`}
                        >
                          <historyStatusConfig.Icon
                            className={`${historyStatusConfig?.iconColor} h-3 w-3 sm:h-4 sm:w-4`}
                          />
                        </div>
                      </div>

                      <div
                        className={`timeline-${
                          index % 2 === 0 ? "start" : "end"
                        } timeline-box w-full`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:gap-0">
                          <div>
                            <div className="font-medium text-sm sm:text-base">
                              {historyStatusConfig?.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(changedAt)} • {formatTime(changedAt)}
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
                              <div className="badge badge-sm sm:badge-md badge-primary ml-2 flex-1/2 md:flex-none">
                                Current
                              </div>
                            )}
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
          safeData.donationInfo.requiredDate,
          safeData.donationInfo.requiredTime
        ) ? (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg w-full text-center text-sm sm:text-base">
            <FaExclamationTriangle className="inline mr-2" />
            This donation request has expired
          </div>
        ) : (
          <PrimaryBtn
            toolTipText={
              donationStatus === "inprogress" && !isAssignedDonor
                ? "Donation already in progress"
                : isRequester
                ? "You cannot donate to your own request"
                : donationStatus === "inprogress" && isAssignedDonor
                ? "You are already donating for this request"
                : "I can donate to this request"
            }
            onClick={handleDonateClick}
            disabled={
              isProcessing ||
              !canDonate ||
              (donationStatus === "inprogress" && !isAssignedDonor)
            }
            style="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 tooltip tooltip-info tooltip-top md:tooltip-left"
          >
            {isProcessing
              ? "Processing..."
              : donationStatus === "inprogress"
              ? isAssignedDonor
                ? "You're Donating"
                : "In Progress"
              : "I Can Donate"}
          </PrimaryBtn>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DonationRequestDetails;
