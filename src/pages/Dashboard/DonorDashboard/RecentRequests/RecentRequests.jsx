import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../hooks/useAuth";
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
import Loading from "../../../../component/Loading/Loading";

const RecentRequests = () => {
  const { user } = useAuth();
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editRequestData, setEditRequestData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: responseData,
    isLoading,
    error,
    refetch,
  } = useDatabaseData(`/donations/recent?requesterEmail=${user?.email}`);

  const recentRequests = responseData?.data || [];

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    const { Icon } = getStatusConfig("error");
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="alert alert-error shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Icon />
          <span>Error loading requests. Please try again later.</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Header Section */}
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.h1
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2"
          >
            <baseConfig.icons.heartbeat className="text-red-500" />
            Recent Donation Requests
          </motion.h1>

          <Link
            to="/dashboard/donor/my-donation-requests"
            className="btn btn-sm btn-ghost text-primary flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 w-fit"
          >
            View All Requests
          </Link>
        </div>
      </header>

      {/* Main Content */}
      {recentRequests?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-red-500 text-sm md:text-base">
            No recent requests found
          </p>
        </div>
      ) : (
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
                <th className="text-center pr-4 md:pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {recentRequests?.map((request) => {
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
                      <td className="py-3 md:py-4 pl-4 md:pl-6">
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
                      <td>
                        <div className="badge badge-lg badge-ghost flex items-center gap-1 md:gap-2">
                          <BloodGroupIcon className="text-red-500 text-sm md:text-base" />
                          {request?.donationInfo?.bloodGroup || "Unknown"}
                        </div>
                      </td>
                      <td>
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
                      <td>
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
                      <td>
                        <div className="flex items-center gap-1 md:gap-2">
                          <StatusIcon className="text-sm md:text-base" />
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
                                className="btn btn-ghost btn-xs text-success hover:text-success tooltip tooltip-success"
                                data-tip="Complete"
                              >
                                <baseConfig.icons.check className="w-3 h-3 md:w-4 md:h-4" />
                              </motion.button>
                              <motion.button
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
      )}

      {/* Modals */}
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
              <div className="modal-action absolute right-4 md:right-7 top-2 -translate-0.5">
                <CloseBtn onClick={() => setIsDetailsModalOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

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

export default RecentRequests;
