import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDatabaseData from "../../../../hooks/useDatabaseData";
import {
  formatDate,
  formatTime,
  getBloodGroupConfig,
  getStatusConfig,
  baseConfig,
} from "../../../../utils/config";
import DonationRequestDetails from "../../../DonationRequests/DonationRequestDetails";
import CloseBtn from "../../../../Buttons/CloseBtn";
import DonationRequestModal from "../../../DonationRequestModal/DonationRequestModal";
import StatusBadge from "../../component/StatusBadge";
import Pagination from "../../../../component/Pagination/Pagination";
import useCustomToast from "../../../../hooks/useCustomToast";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import useUserRole from "../../../../hooks/useUserRole";

const MyDonationRequests = () => {
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editRequestData, setEditRequestData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { showConfirmationToast } = useCustomToast();
  const { axiosPublic } = useAxiosPublic();
  const { role, loading, user } = useUserRole();
  const itemsPerPage = 5;

  const {
    data: responseData,
    isLoading,
    refetch,
  } = useDatabaseData(
    user?.email && role
      ? `/blood-requests?email=${user.email}&role=${role}&page=${currentPage}&limit=${itemsPerPage}`
      : null
  );

  // Filter to show only requests where user is involved (as donor or requester)
  const myRequests = (responseData?.data || []).filter(
    (request) =>
      request?.requester?.email === user?.email ||
      request?.donor?.email === user?.email
  );
  const meta = responseData?.meta || {};

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  // Handle status update (complete/cancel)
  const handleStatusUpdate = async (requestId, action) => {
    try {
      const confirmed = await showConfirmationToast({
        title: `${action === "complete" ? "Complete" : "Cancel"} Request`,
        description: `Are you sure you want to ${action} this donation request?`,
        confirmText: action === "complete" ? "Complete" : "Cancel",
        cancelText: "Go Back",
        icon: action === "complete" ? "check" : "times",
      });

      if (!confirmed) return;

      const response = await axiosPublic.patch(`/blood-requests/${requestId}`, {
        action,
        email: user?.email,
        name: user?.displayName,
        role: "requester",
      });

      if (response.data.success) {
        toast.success(
          `Request ${
            action === "complete" ? "completed" : "cancelled"
          } successfully`
        );
        await refetch?.();
      }
    } catch (error) {
      console.error(`${action} request error:`, error);
      toast.error(
        error.response?.data?.message || `Failed to ${action} request`
      );
    }
  };

  // Handle delete request
  const handleDeleteRequest = async (requestId) => {
    try {
      const confirmed = await showConfirmationToast({
        title: "Delete Request",
        description: "Are you sure you want to delete this donation request?",
        confirmText: "Delete",
        cancelText: "Cancel",
        icon: "trash",
      });

      if (!confirmed) return;

      const response = await axiosPublic.delete(
        `/blood-requests/${requestId}/?email=${user?.email}`
      );

      if (response.data.success) {
        toast.success("Donation request deleted successfully");
        await refetch();
      }
    } catch (error) {
      console.error("Delete request error:", error);
      toast.error(error.response?.data?.message || "Failed to delete request");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4 md:p-6 py-6 md:py-8 lg:py-10"
    >
      <header className="mb-6 gap-4">
        <motion.h1
          initial={{ x: -10 }}
          animate={{ x: 0 }}
          className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2"
        >
          <baseConfig.icons.heartbeat className="text-red-500" />
          Donation Requests
        </motion.h1>
      </header>

      {myRequests?.length ? (
        <>
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100">
            <motion.table
              className="table w-full"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th className="pl-4 md:pl-6">Recipient</th>
                  <th>Blood Group</th>
                  <th>Location</th>
                  <th>Date/Time</th>
                  <th>Status</th>
                  <th className="pr-4 md:pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {myRequests?.map((request) => {
                    const statusConfig = getStatusConfig(
                      request?.status?.current
                    );
                    const StatusIcon = statusConfig.Icon;
                    const bloodGroupConfig = getBloodGroupConfig(
                      request?.donationInfo?.bloodGroup
                    );
                    const BloodGroupIcon = bloodGroupConfig.Icon;

                    return (
                      <motion.tr
                        key={request?._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="pl-4 md:pl-6 py-3 md:py-4">
                          <div>
                            <h2 className="font-semibold md:font-bold text-sm md:text-base">
                              {request?.recipient?.name || "Unknown Recipient"}
                            </h2>
                            <p className="text-xs md:text-sm opacity-50 flex items-center gap-1 mt-1">
                              <baseConfig.icons.hospital className="text-xs" />
                              {request?.recipient?.hospital ||
                                "Hospital not specified"}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 md:py-4">
                          <div className="badge badge-lg badge-ghost flex items-center gap-1 md:gap-2">
                            <BloodGroupIcon className="text-red-500 text-sm md:text-base" />
                            {request?.donationInfo?.bloodGroup || "Unknown"}
                          </div>
                        </td>
                        <td className="py-3 md:py-4">
                          <address className="not-italic">
                            <p className="text-sm md:text-base">
                              {request?.location?.district ||
                                "District not specified"}
                              ,
                            </p>
                            <p className="text-xs md:text-sm opacity-50">
                              {request?.location?.upazila ||
                                "Upazila not specified"}
                              ,
                            </p>
                            <p className="text-xs md:text-sm opacity-50">
                              {request?.location?.fullAddress ||
                                "Full address not specified"}
                            </p>
                          </address>
                        </td>
                        <td className="py-3 md:py-4">
                          <div>
                            <p className="text-xs md:text-sm flex items-center gap-1">
                              <baseConfig.icons.calendar className="text-gray-400 text-xs md:text-sm" />
                              {request?.donationInfo?.requiredDate
                                ? formatDate(request?.donationInfo.requiredDate)
                                : "Date not set"}
                            </p>
                            <p className="text-xs opacity-50 flex items-center gap-1">
                              <baseConfig.icons.clock className="text-gray-400 text-xs" />
                              {request?.donationInfo?.requiredTime
                                ? formatTime(request?.donationInfo.requiredTime)
                                : "Time not set"}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 md:py-4">
                          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-base">
                            <StatusIcon />
                            <StatusBadge
                              status={request?.status?.current || "unknown"}
                            />
                          </div>
                          {request?.status?.current === "inprogress" &&
                            request?.donor && (
                              <div className="mt-1 text-xs opacity-50">
                                <p>Donor: {request?.donor.name}</p>
                                <p>Email: {request?.donor.email}</p>
                              </div>
                            )}
                        </td>
                        <td className="pr-4 md:pr-6">
                          <div className="flex justify-end gap-1 md:gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedRequestId(request?._id);
                                setIsDetailsModalOpen(true);
                              }}
                              className="btn btn-ghost btn-xs text-gray-500 hover:text-primary tooltip tooltip-info"
                              data-tip="Details"
                            >
                              <baseConfig.icons.eye className="w-3 h-3 md:w-4 md:h-4" />
                            </motion.button>

                            {request?.status?.current === "pending" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setEditRequestData(request);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="btn btn-ghost btn-xs text-gray-500 hover:text-success tooltip tooltip-accent"
                                  data-tip="Edit"
                                >
                                  <baseConfig.icons.edit className="w-3 h-3 md:w-4 md:h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleDeleteRequest(request?._id)
                                  }
                                  className="btn btn-ghost btn-xs text-gray-500 hover:text-error tooltip tooltip-warning"
                                  data-tip="Delete"
                                >
                                  <baseConfig.icons.trash className="w-3 h-3 md:w-4 md:h-4" />
                                </motion.button>
                              </>
                            )}
                            {request?.status?.current === "cancelled" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleDeleteRequest(request?._id)
                                  }
                                  className="btn btn-ghost btn-xs text-gray-500 hover:text-error tooltip tooltip-warning"
                                  data-tip="Delete"
                                >
                                  <baseConfig.icons.trash className="w-3 h-3 md:w-4 md:h-4" />
                                </motion.button>
                              </>
                            )}
                            {request?.status?.current === "inprogress" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleStatusUpdate(request?._id, "complete")
                                  }
                                  className="btn btn-ghost btn-xs text-success hover:text-success tooltip tooltip-success"
                                  data-tip="Complete"
                                >
                                  <baseConfig.icons.check className="w-3 h-3 md:w-4 md:h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleStatusUpdate(request?._id, "cancel")
                                  }
                                  className="btn btn-ghost btn-xs text-error hover:text-error tooltip tooltip-warning"
                                  data-tip="Cancel"
                                >
                                  <baseConfig.icons.times className="w-3 h-3 md:w-4 md:h-4" />
                                </motion.button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </motion.table>
          </div>

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
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="alert shadow-lg mt-6"
        >
          <div className="flex items-center gap-1">
            <baseConfig.icons.info className="text-blue-500" />
            <span>No donation requests found matching your criteria.</span>
          </div>
        </motion.div>
      )}

      {/* Request Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && (
          <div className="modal modal-middle modal-open">
            <div className="modal-box max-w-3xl relative overflow-x-hidden">
              {selectedRequestId && (
                <DonationRequestDetails
                  requestId={selectedRequestId}
                  refetch={refetch}
                  closeModal={() => setIsDetailsModalOpen(false)}
                />
              )}
              <div className="modal-action absolute right-7 md:right-7 top-2 -translate-0.5">
                <CloseBtn onClick={() => setIsDetailsModalOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Request Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <DonationRequestModal
            isEditMode={true}
            requestData={editRequestData}
            refetch={refetch}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default MyDonationRequests;
