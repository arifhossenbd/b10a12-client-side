import {
  FaClock,
  FaHeartbeat,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaHistory,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { MdContactless } from "react-icons/md";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import SecondaryBtn from "../../Buttons/SecondaryBtn";
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
import StatusBadge from "../Dashboard/component/StatusBadge.jsx";
import { capitalize } from "../../utils/capitalized.js";
import useUserRole from "../../hooks/useUserRole.jsx";

const DonationRequestDetails = ({ requestId, refetch, closeModal }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { axiosPublic } = useAxiosPublic();
  const { showConfirmationToast } = useCustomToast();
  const { role } = useUserRole();
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
    location = {},
    donor = {},
    recipient = {},
    requester = {},
    status = {},
    updatedAt = nowTime,
  } = requestData;

  // Get configs
  const urgencyConfig = getUrgencyConfig(donationInfo?.urgency);
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
      donor: {
        id: "",
        email: "",
        name: "",
        ...donor,
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
        ...requester,
      },
      status: {
        current: "pending",
        history: [],
        ...status,
      },
      createdAt: nowTime,
    }),
    [donationInfo, location, donor, nowTime, recipient, requester, status]
  );

  const isRequester = useMemo(() => {
    return user?.uid === safeData?.requester?.id;
  }, [user?.uid, safeData?.requester?.id]);

  const isAssignedDonor = useMemo(() => {
    return user?.email === safeData?.donor?.email;
  }, [user?.email, safeData?.donor?.email]);

  const isRequestActive = useMemo(() => {
    return donationTimeValidate(
      safeData?.donationInfo?.requiredDate,
      safeData?.donationInfo?.requiredTime
    );
  }, [
    safeData?.donationInfo?.requiredDate,
    safeData?.donationInfo?.requiredTime,
  ]);

  // Permission checks
  const canAccept = useMemo(() => {
    return (
      isRequestActive &&
      safeData?.status?.current === "pending" &&
      (isAssignedDonor || role === "admin")
    );
  }, [isRequestActive, safeData?.status, isAssignedDonor, role]);

  const canComplete = useMemo(() => {
    return (
      isRequestActive &&
      safeData?.status?.current === "inprogress" &&
      (isRequester || role === "admin" || role === "volunteer")
    );
  }, [isRequestActive, safeData?.status, isRequester, role]);

  const canCancel = useMemo(() => {
    return (
      isRequestActive &&
      ["pending", "inprogress"].includes(safeData?.status?.current) &&
      (isRequester || role === "admin")
    );
  }, [isRequestActive, safeData?.status, isRequester, role]);

  const handleStatusUpdate = useCallback(
    async (newStatus) => {
      try {
        const actionMap = {
          inprogress: "update",
          completed: "complete",
          cancelled: "cancel",
        };
        const action = actionMap[newStatus] || "update";

        const confirmed = await showConfirmationToast({
          title: `Confirm ${capitalize(action)}`,
          description: `Are you sure you want to ${action} this donation request?`,
          items: [
            { label: "Patient:", value: safeData?.recipient?.name },
            { label: "Hospital:", value: safeData?.recipient?.hospital },
            {
              label: "Blood Group:",
              value: safeData?.donationInfo?.bloodGroup,
            },
          ],
          confirmText: `Yes, ${action}`,
        });

        if (!confirmed) return;

        setIsProcessing(true);

        const response = await axiosPublic.patch(`/blood-requests/${_id}`, {
          status: { current: newStatus },
          role,
          email: user?.email,
          name: user?.displayName,
          action,
        });

        if (response.data.success) {
          await Promise.all([await detailsRefetch(), await refetch(), closeModal?.()]);
          toast.success(`Request ${action}ed successfully`);
        } else {
          throw new Error(response.data.message || "Update failed");
        }
      } catch (error) {
        console.error("Status update error:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to update request status"
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [
      _id,
      axiosPublic,
      detailsRefetch,
      refetch,
      closeModal,
      role,
      user,
      showConfirmationToast,
      safeData,
    ]
  );

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
      <motion.div {...scrollYAnimation} transition={{ duration: 0.8 }}>
        <motion.div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
          <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
            <FaUser className="text-red-500 text-xl" />
          </div>
          <motion.div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words max-w-xl">
              {safeData?.recipient?.name || "Recipient Name Not Available"}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Requested by: {safeData?.requester?.name || "Unknown Requester"}
            </p>
          </motion.div>
        </motion.div>

        <motion.div className="flex flex-wrap gap-2 mt-3">
          <StatusBadge status={safeData?.status?.current} />
          <span
            className={`badge badge-info border-none text-xs sm:text-sm font-semibold rounded-full ${urgencyConfig?.color}`}
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
              transition={{ duration: 0.8 }}
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
                    {safeData?.requester?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <Link
                    to={`mailto:${safeData?.requester?.email}`}
                    className="text-blue-400 hover:text-blue-600 break-all text-sm sm:text-base"
                  >
                    {safeData?.requester?.email || "No email provided"}
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Medical Info */}
            <motion.div
              {...scrollYAnimation}
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
                    {safeData?.donationInfo?.bloodGroup || "Not specified"}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Donation Date & Time</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500 text-sm" />
                      <span className="text-gray-900 text-sm sm:text-base">
                        {formatDate(safeData?.donationInfo?.requiredDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-500 text-sm" />
                      <span className="text-gray-900 text-sm sm:text-base">
                        {formatTime(safeData?.donationInfo?.requiredTime)}
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

                {safeData?.donationInfo?.additionalInfo && (
                  <div>
                    <p className="text-gray-500 text-sm">Additional Notes</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm sm:text-base">
                      {safeData?.donationInfo?.additionalInfo}
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
              transition={{ duration: 0.8 }}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100"
            >
              <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500 text-xl" />
                <span>Location Details</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 text-lg">
                    {safeData?.recipient?.hospital || "Hospital not specified"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {[
                      safeData?.location.fullAddress,
                      safeData?.location.upazila,
                      safeData?.location.district,
                      safeData?.location.division,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Requested</p>
                    <p className="text-gray-700 text-sm">
                      {safeData?.createdAt ? (
                        <>
                          {formatDate(safeData?.createdAt)}
                          <span className="text-gray-500 ml-2 text-xs">
                            {formatTime(safeData?.createdAt)}
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
            {safeData?.donor && (
              <motion.div
                {...scrollRightAnimation}
                transition={{ duration: 0.7 }}
                className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-500 text-xl" />
                  <span>Donor Information</span>
                </h3>
                <div className="space-y-3">
                  <p className="text-sm sm:text-base">
                    <span className="text-gray-500">Name:</span>{" "}
                    <span className="font-medium">{safeData?.donor?.name}</span>
                  </p>
                  {safeData?.donor?.email && (
                    <p className="text-sm sm:text-base">
                      <span className="text-gray-500">Email:</span>{" "}
                      <Link
                        to={`mailto:${safeData?.donor?.email}`}
                        className="text-blue-400 hover:text-blue-500"
                      >
                        {safeData?.donor?.email}
                      </Link>
                    </p>
                  )}
                  {safeData?.status?.current && (
                    <StatusBadge status={safeData?.status?.current} />
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Status History Section */}
        <motion.div
          {...scrollYAnimation}
          transition={{ duration: 0.6 }}
          className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 mb-6 sm:mb-8"
        >
          <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <FaHistory className="text-purple-500 text-xl" />
            <span>Status History</span>
          </h3>

          {safeData?.status?.history?.length > 0 ? (
            <motion.ul className="timeline timeline-vertical">
              {[...safeData.status.history]
                ?.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                ?.map((item, index, array) => {
                  const statusValue = item?.status || safeData?.status?.current;
                  const changedAt = item?.changedAt;
                  const changedBy = item?.changedBy;
                  const historyStatusConfig = getStatusConfig(statusValue);
                  const isCurrent = index === 0;
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
                            <p className="font-medium text-sm sm:text-base">
                              {historyStatusConfig?.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(changedAt)} • {formatTime(changedAt)}
                            </p>
                            {changedBy && (
                              <>
                                <p className="text-xs text-gray-400 mt-1 text-wrap">
                                  Changed by:
                                  <span className="ml-1">
                                    {changedBy?.name || "Unknown"}
                                  </span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {safeData?.role ? (
                                    <span>{capitalize(safeData?.role)}</span>
                                  ) : (
                                    <span>
                                      {changedBy?.role
                                        ? capitalize(changedBy.role)
                                        : "Unknown"}
                                    </span>
                                  )}
                                </p>
                              </>
                            )}
                          </div>
                          {isCurrent && <StatusBadge status="Current" />}
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
        transition={{ duration: 0.5 }}
        className="flex flex-wrap gap-3 justify-end border-t border-t-gray-200 pt-4 sm:pt-6"
      >
        {!isRequestActive ? (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg w-full text-center text-sm sm:text-base">
            <FaExclamationTriangle className="inline mr-2" />
            This donation request has expired
          </div>
        ) : (
          <>
            {canCancel && (
              <SecondaryBtn
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={isProcessing}
                className="bg-white text-red-500 border-red-500 hover:bg-red-50"
              >
                <FaTimes className="mr-2" />
                {isProcessing ? "Processing..." : "Cancel Request"}
              </SecondaryBtn>
            )}

            {canAccept && (
              <PrimaryBtn
                onClick={() => handleStatusUpdate("inprogress")}
                disabled={isProcessing}
              >
                <FaCheck className="mr-2" />
                {isProcessing ? "Processing..." : "Accept Donation"}
              </PrimaryBtn>
            )}

            {canComplete && (
              <PrimaryBtn
                onClick={() => handleStatusUpdate("completed")}
                disabled={isProcessing}
              >
                <FaHeartbeat className="mr-2" />
                {isProcessing ? "Processing..." : "Complete Donation"}
              </PrimaryBtn>
            )}

            {!canAccept && !canComplete && !canCancel && (
              <div className="bg-gray-100 text-gray-600 p-3 rounded-lg w-full text-center text-sm sm:text-base">
                {safeData?.donor?.email
                  ? "Only assigned donor can manage this request"
                  : "Awaiting donor assignment"}
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DonationRequestDetails;