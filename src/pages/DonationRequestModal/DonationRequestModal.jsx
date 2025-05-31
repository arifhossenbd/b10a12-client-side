import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { COLORS } from "../../utils/colorConfig";
import { getUrgencyConfig, getBloodGroupConfig } from "../../utils/config";
import CloseBtn from "../../Buttons/CloseBtn";
import dayjs from "dayjs";
import { validateDonationTime } from "../../utils/timeUtils";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaHospital,
  FaMapMarkerAlt,
  FaStickyNote,
  FaEnvelope,
  FaGlobeAsia,
  FaCity,
  FaMapMarkedAlt,
} from "react-icons/fa";
import useUserRole from "../../hooks/useUserRole";

const DonationRequestModal = ({
  donor = null,
  refetch,
  isEditMode = false,
  requestData = null,
  onClose,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { axiosPublic } = useAxiosPublic();
  const { role } = useUserRole();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User data with fallbacks
  const { uid, displayName, email } = user || {};

  // Donor data with fallbacks
  const donorData = donor || {};
  const {
    _id,
    name: donorName = "Unknown Donor",
    email: donorEmail = "",
    bloodGroup = "Unknown",
    location: donorLocation = {},
    role: donorRole = "donor",
  } = donorData;

  const bloodGroupConfig = getBloodGroupConfig(bloodGroup);
  const urgencyConfig = getUrgencyConfig("normal");
  const nowTime = dayjs().toISOString();

  // Form handling
  const formik = useFormik({
    initialValues: {
      recipientName: "",
      hospitalName: "",
      fullAddress: "",
      donationDate: dayjs().format("YYYY-MM-DD"),
      donationTime: dayjs().add(1, "hour").format("HH:mm"),
      requestMessage: "",
    },
    validate: (values) => {
      const errors = validateDonationTime(values);
      if (errors?.donationDate || errors?.donationTime) {
        const message =
          errors?.donationDate && errors?.donationTime
            ? "Please select a valid future date and time"
            : errors?.donationDate
            ? errors.donationDate
            : errors.donationTime;
        toast.error(message, { id: "date-time-error" });
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const errors = validateDonationTime(values);
        if (Object.keys(errors)?.length > 0) return;

        const payload = {
          recipient: {
            name: values.recipientName,
            hospital: values.hospitalName,
          },
          donationInfo: {
            bloodGroup: isEditMode
              ? requestData?.donationInfo?.bloodGroup
              : bloodGroup,
            requiredDate: values.donationDate,
            requiredTime: values.donationTime,
            urgency: "normal",
            additionalInfo: values.requestMessage || "",
          },
          location: {
            division: isEditMode
              ? requestData?.location?.division
              : donorLocation?.division || "",
            district: isEditMode
              ? requestData?.location?.district
              : donorLocation?.district || "",
            upazila: isEditMode
              ? requestData?.location?.upazila
              : donorLocation?.upazila || "",
            fullAddress: values.fullAddress,
          },
          requester: {
            id: uid,
            name: displayName || "Unknown",
            email: email || "",
            role: role || "requester",
          },
          donor: isEditMode
            ? requestData?.donor || {
                id: _id,
                name: donorName,
                email: donorEmail,
                role: donorRole || "donor",
              }
            : {
                id: _id,
                name: donorName,
                email: donorEmail,
                role: donorRole || "donor",
              },
          role: role || "requester",
          createdAt: nowTime,
          updatedAt: nowTime,
        };

        if (isEditMode) {
          // Update existing request
          const response = await axiosPublic.patch(
            `/blood-requests/${requestData._id}`,
            {
              ...payload,
              action: "update",
              role: role || "requester",
              email: email,
              updatedAt: nowTime,
              status: {
                current: "pending",
                history: [
                  ...(requestData?.status?.history || []),
                  {
                    changedAt: nowTime,
                    changedBy: {
                      name: displayName || "Unknown",
                      email: email || "",
                      role: role || "requester",
                    },
                  },
                ],
              }
            }
          );
          if (response.data?.success) {
            toast.success("Request updated successfully!");
            refetch();
            onClose();
          }
        } else {
          // Create new request
          const response = await axiosPublic.post("/blood-requests", {
            ...payload,
            requester: {
              ...payload.requester,
              createdAt: nowTime,
            },
            status: {
              current: "pending",
              history: [
                {
                  changedAt: nowTime,
                  changedBy: {
                    name: displayName || "Unknown",
                    email: email || "",
                    role: "requester",
                  },
                },
              ],
            },
          });
          if (response.status === 201) {
            toast.success("Request submitted successfully!");
            refetch();
            onClose();
            navigate("/donation-requests");
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (isEditMode && requestData) {
      formik.setValues({
        recipientName: requestData.recipient?.name || "",
        hospitalName: requestData.recipient?.hospital || "",
        fullAddress: requestData.location?.fullAddress || "",
        donationDate:
          requestData.donationInfo?.requiredDate ||
          dayjs().format("YYYY-MM-DD"),
        donationTime:
          requestData.donationInfo?.requiredTime ||
          dayjs().add(1, "hour").format("HH:mm"),
        requestMessage: requestData.donationInfo?.additionalInfo || "",
      });
    }
  }, [isEditMode, requestData]);

  return (
    <div className="modal modal-open modal-middle">
      <AnimatePresence>
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="absolute inset-0 w-full h-full cursor-default"
            disabled={isSubmitting}
            onClick={onClose}
          />
        </motion.div>
      </AnimatePresence>

      <div className="modal-box max-w-xl relative p-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-4 md:p-6"
        >
          <CloseBtn onClick={onClose} disabled={isSubmitting} />

          <div
            className={`flex flex-col items-center justify-center mb-4 md:mb-6 gap-2 ${bloodGroupConfig.color}`}
          >
            <p className="text-5xl">
              <bloodGroupConfig.Icon size={60} />
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-center">
              {isEditMode ? "Edit Donation Request" : "Blood Donation Request"}
            </h3>
            <div
              className={`badge ${bloodGroupConfig.badgeClass} ${bloodGroupConfig.color} gap-2 font-bold`}
            >
              <bloodGroupConfig.Icon size={12} />
              {isEditMode
                ? requestData?.donationInfo?.bloodGroup
                : bloodGroup || "Unknown"}
            </div>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-3 md:space-y-4"
          >
            {/* Requester Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Your Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName || "Unknown"}
                    readOnly
                    className="input input-bordered w-full pl-9 focus:outline-none"
                    style={{
                      backgroundColor: COLORS?.disabledBg,
                      color: COLORS?.disabledText,
                      borderColor: COLORS?.border,
                      cursor: "not-allowed",
                    }}
                  />
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
                </div>
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Your Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email || "Not provided"}
                    readOnly
                    className="input input-bordered w-full pl-9 focus:outline-none"
                    style={{
                      backgroundColor: COLORS?.disabledBg,
                      color: COLORS?.disabledText,
                      borderColor: COLORS?.border,
                      cursor: "not-allowed",
                    }}
                  />
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
                </div>
              </div>
            </div>

            {/* Recipient Info */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Patient Name *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="recipientName"
                  onChange={formik.handleChange}
                  value={formik.values.recipientName}
                  className="input input-bordered w-full pl-9 focus:outline-none"
                  required
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Hospital Name *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="hospitalName"
                  onChange={formik.handleChange}
                  value={formik.values.hospitalName}
                  className="input input-bordered w-full pl-9 focus:outline-none"
                  required
                />
                <FaHospital className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
              </div>
            </div>

            {/* Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">
                    Donation Date *
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="donationDate"
                    onChange={formik.handleChange}
                    value={formik.values.donationDate}
                    min={dayjs().format("YYYY-MM-DD")}
                    className="input input-bordered w-full pl-9 focus:outline-none"
                    required
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
                </div>
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">
                    Donation Time *
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="donationTime"
                    onChange={formik.handleChange}
                    value={formik.values.donationTime}
                    min={
                      formik.values.donationDate ===
                      dayjs().format("YYYY-MM-DD")
                        ? dayjs().add(1, "minute").format("HH:mm")
                        : "00:00"
                    }
                    className="input input-bordered w-full pl-9 focus:outline-none"
                    required
                  />
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
                </div>
              </div>
            </div>

            {/* Location */}
            {!isEditMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Division</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={donorLocation?.division || "Not specified"}
                      readOnly
                      className="input input-bordered w-full pl-9 focus:outline-none"
                      style={{
                        backgroundColor: COLORS?.disabledBg,
                        color: COLORS?.disabledText,
                        borderColor: COLORS?.border,
                        cursor: "not-allowed",
                      }}
                    />
                    <FaGlobeAsia className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">District</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={donorLocation?.district || "Not specified"}
                      readOnly
                      className="input input-bordered w-full pl-9 focus:outline-none"
                      style={{
                        backgroundColor: COLORS?.disabledBg,
                        color: COLORS?.disabledText,
                        borderColor: COLORS?.border,
                        cursor: "not-allowed",
                      }}
                    />
                    <FaMapMarkedAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Upazila</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={donorLocation?.upazila || "Not specified"}
                      readOnly
                      className="input input-bordered w-full pl-9 focus:outline-none"
                      style={{
                        backgroundColor: COLORS?.disabledBg,
                        color: COLORS?.disabledText,
                        borderColor: COLORS?.border,
                        cursor: "not-allowed",
                      }}
                    />
                    <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Full Address */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Full Address *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullAddress"
                  onChange={formik.handleChange}
                  value={formik.values.fullAddress}
                  className="input input-bordered w-full pl-9 focus:outline-none"
                  required
                />
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 z-1" />
              </div>
            </div>

            {/* Notes */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Additional Notes</span>
              </label>
              <div className="relative">
                <textarea
                  name="requestMessage"
                  onChange={formik.handleChange}
                  value={formik.values.requestMessage}
                  className="textarea textarea-bordered w-full pl-9 focus:outline-none"
                  rows="3"
                />
                <FaStickyNote className="absolute left-3 top-4 z-1" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 md:pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`btn w-full ${urgencyConfig.color}`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <urgencyConfig.Icon size={16} />
                    {isEditMode ? "Update Request" : "Submit Request"}
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DonationRequestModal;