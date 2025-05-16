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
import Pagination from "../../../../component/Pagination/Pagination";
import { FaFilter } from "react-icons/fa";

const MyDonationRequests = () => {
  const { user } = useAuth();
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editRequestData, setEditRequestData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 5;

  const {
    data: responseData,
    isLoading,
    refetch,
  } = useDatabaseData(
    `/donations/my-requests?email=${
      user?.email
    }&page=${currentPage}&limit=${itemsPerPage}${
      statusFilter !== "all" ? `&status=${statusFilter}` : ""
    }`
  );

  const recentRequests = responseData?.data || [];
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4 md:p-6 py-6 md:py-8 lg:py-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <motion.h1
          initial={{ x: -10 }}
          animate={{ x: 0 }}
          className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2"
        >
          <baseConfig.icons.heartbeat className="text-red-500" />
          Donation Requests
        </motion.h1>
        <div className="join">
          <button className="btn join-item btn-sm font-semibold bg-stone-100 hover:bg-stone-200 hover:border-stone-300">
            <FaFilter className="mr-1" />
            Filter:
          </button>
          <select
            className="select select-bordered join-item select-sm border-l-0 border-stone-200 
            outline-none focus:outline-none focus:ring-0 focus:border-stone-300 hover:bg-stone-100 hover:border-stone-200 focus:bg-stone-200
            text-sm font-semibold cursor-pointer"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </header>

      {recentRequests?.length ? (
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
                  {recentRequests?.map((request) => {
                    const statusConfig = getStatusConfig(request?.status?.current);
                    const StatusIcon = statusConfig.Icon;
                    const bloodGroupConfig = getBloodGroupConfig(request?.donationInfo?.bloodGroup);
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
                              {request?.recipient?.hospital || "Hospital not specified"}
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
                              {request?.location?.district || "District not specified"}
                            </p>
                            <p className="text-xs md:text-sm opacity-50">
                              {request?.location?.upazila || "Upazila not specified"}
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
                          <div className="flex items-center gap-1 md:gap-2">
                            <StatusIcon className="text-sm md:text-base" />
                            <StatusBadge status={request?.status?.current || "unknown"} />
                          </div>
                          {request?.status?.current === "inprogress" &&
                            request?.donor && (
                              <div className="mt-1 text-xs opacity-50">
                                <p>Donor: {request?.donor.name}</p>
                                <p>Email: {request?.donor.email}</p>
                              </div>
                            )}
                        </td>
                        <td className="pr-4 md:pr-6 py-3 md:py-4">
                          <div className="flex justify-end gap-1 md:gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedRequestId(request?._id);
                                setIsDetailsModalOpen(true);
                              }}
                              className="btn btn-ghost btn-xs text-gray-500 hover:text-primary"
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
                                  className="btn btn-ghost btn-xs text-gray-500 hover:text-success"
                                >
                                  <baseConfig.icons.edit className="w-3 h-3 md:w-4 md:h-4" />
                                </motion.button>
                                <motion.button
                                  className="btn btn-ghost btn-xs text-gray-500 hover:text-error"
                                  onClick={() => handleDeleteRequest(request?._id)}
                                >
                                  <baseConfig.icons.trash className="w-3 h-3 md:w-4 md:h-4" />
                                </motion.button>
                              </>
                            )}

                            {request?.status?.current === "inprogress" && (
                              <>
                                <motion.button
                                  className="btn btn-ghost btn-xs text-success hover:text-success"
                                  onClick={() => handleCompleteRequest(request?._id)}
                                >
                                  <baseConfig.icons.check className="w-3 h-3 md:w-4 md:h-4" />
                                </motion.button>
                                <motion.button
                                  className="btn btn-ghost btn-xs text-error hover:text-error"
                                  onClick={() => handleCancelRequest(request?._id)}
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
          <div>
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
              <div className="modal-action absolute right-4 md:right-7 top-2 -translate-0.5">
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