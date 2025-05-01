import { useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { FaTimes, FaTint } from "react-icons/fa";
import moment from "moment";
import LocationSelector from "../../component/LocationSelector/LocationSelector";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";

const COLORS = {
  primary: "#E53E3E",
  primaryHover: "#C53030",
  secondary: "#3182CE",
  background: "#F7FAFC",
  cardBg: "#FFFFFF",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  error: "#E53E3E",
  success: "#38A169",
  border: "#E2E8F0",
  icon: "#718096",
};

const fieldFocusVariants = {
  focus: {
    boxShadow: `0 0 0 2px ${COLORS.primary}40`,
    borderColor: COLORS.primary,
    transition: { duration: 0.2 },
  },
};

const DonationRequestModal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      recipientName: "",
      division: "",
      district: "",
      upazila: "",
      hospitalName: "",
      fullAddress: "",
      bloodGroup: "",
      donationDate: moment().format("YYYY-MM-DD"),
      donationTime: moment().format("HH:mm"),
      requestMessage: "",
      donationStatus: "pending",
      requesterName: user?.displayName || "",
      requesterEmail: user?.email || "",
    },
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const response = await axiosPublic.post("/blood-request", {
          ...values,
          createdAt: Date.now(),
        });

        if (response.status === 201) {
          toast.success("Blood donation request submitted successfully!");
          resetForm();
          document.getElementById("donationModal").close();
          navigate('/donation-requests');
        } else {
          toast.error("Failed to submit request. Please try again.");
        }
      } catch (error) {
        console.error("Request submission error:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again later."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <dialog id="donationModal" className="modal modal-middle">
      <div className="modal-box max-w-md relative">
        <button
          onClick={() => document.getElementById("donationModal").close()}
          className="btn btn-sm btn-circle absolute right-2 top-2"
          disabled={isSubmitting}
        >
          <FaTimes />
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <h3 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            Blood Donation Request
          </h3>

          <form onSubmit={formik.handleSubmit} className="space-y-4 mt-6">
            {/* Requester Information (read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label
                  className="block mb-1 font-medium"
                  style={{ color: COLORS.textPrimary }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="requesterName"
                  value={formik.values.requesterName}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textSecondary,
                  }}
                />
              </div>

              <div className="form-group">
                <label
                  className="block mb-1 font-medium"
                  style={{ color: COLORS.textPrimary }}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  name="requesterEmail"
                  value={formik.values.requesterEmail}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textSecondary,
                  }}
                />
              </div>
            </div>

            {/* Recipient Information */}
            <div className="form-group">
              <label
                className="block mb-1 font-medium"
                style={{ color: COLORS.textPrimary }}
              >
                Patient/Recipient Name *
              </label>
              <input
                type="text"
                name="recipientName"
                onChange={formik.handleChange}
                value={formik.values.recipientName}
                className="w-full p-2 border rounded"
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                }}
                required
              />
            </div>

            {/* Recipient Location */}
            <LocationSelector
              color={COLORS}
              values={formik.values}
              handleChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Hospital Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label
                  className="block mb-1 font-medium"
                  style={{ color: COLORS.textPrimary }}
                >
                  Hospital/Clinic Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  onChange={formik.handleChange}
                  value={formik.values.hospitalName}
                  className="w-full p-2 border rounded"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label
                  className="block mb-1 font-medium"
                  style={{ color: COLORS.textPrimary }}
                >
                  Full Address *
                </label>
                <input
                  type="text"
                  name="fullAddress"
                  onChange={formik.handleChange}
                  value={formik.values.fullAddress}
                  className="w-full p-2 border rounded"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                  }}
                  required
                />
              </div>
            </div>

            {/* Blood Group and Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label
                  className="block mb-1 font-medium"
                  style={{ color: COLORS.textPrimary }}
                >
                  Blood Group Needed *
                </label>
                <motion.div whileFocus="focus" variants={fieldFocusVariants}>
                  <div className="relative">
                    <select
                      name="bloodGroup"
                      onChange={formik.handleChange}
                      value={formik.values.bloodGroup}
                      className="w-full p-2 pl-5 border rounded focus:outline-none"
                      style={{
                        borderColor: COLORS.border,
                        color: COLORS.textPrimary,
                      }}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        )
                      )}
                    </select>
                    <FaTint
                      className="absolute left-1.5 top-3"
                      style={{ color: COLORS.icon }}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="form-group">
                <label
                  className="block mb-1 font-medium"
                  style={{ color: COLORS.textPrimary }}
                >
                  Required Date *
                </label>
                <input
                  type="date"
                  name="donationDate"
                  onChange={formik.handleChange}
                  value={formik.values.donationDate}
                  min={moment().format("YYYY-MM-DD")}
                  className="w-full p-2 border rounded"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label
                  className="block mb-1 font-medium"
                  style={{ color: COLORS.textPrimary }}
                >
                  Required Time *
                </label>
                <input
                  type="time"
                  name="donationTime"
                  onChange={formik.handleChange}
                  value={formik.values.donationTime}
                  className="w-full p-2 border rounded"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                  }}
                  required
                />
              </div>
            </div>

            {/* Additional Message */}
            <div className="form-group">
              <label
                className="block mb-1 font-medium"
                style={{ color: COLORS.textPrimary }}
              >
                Additional Details (Optional)
              </label>
              <textarea
                name="requestMessage"
                onChange={formik.handleChange}
                value={formik.values.requestMessage}
                className="w-full p-2 border rounded"
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                }}
                rows="3"
                placeholder="Any special instructions or details about the patient's condition"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full p-3 rounded-md text-white font-medium flex items-center justify-center"
                style={{
                  backgroundColor: isSubmitting
                    ? COLORS.secondary
                    : COLORS.primary,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
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
                    Submitting...
                  </span>
                ) : (
                  "Submit Request"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button disabled={isSubmitting}>close</button>
      </form>
    </dialog>
  );
};

export default DonationRequestModal;
