import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPaperPlane,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaTint,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { motion } from "framer-motion";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import { Link } from "react-router";

// Color scheme constants
const COLORS = {
  primary: "#E53E3E", // Vibrant red for primary actions
  primaryHover: "#C53030", // Darker red for hover states
  secondary: "#3182CE", // Blue for links
  background: "#F7FAFC", // Light background
  cardBg: "#FFFFFF", // White card background
  textPrimary: "#2D3748", // Dark text
  textSecondary: "#718096", // Secondary text
  error: "#E53E3E", // Error messages
  success: "#38A169", // Success messages
  border: "#E2E8F0", // Border color
  icon: "#718096", // Icon color
};

const fieldFocusVariants = {
  focus: {
    boxShadow: `0 0 0 2px ${COLORS.primary}40`,
    borderColor: COLORS.primary,
    transition: { duration: 0.2 },
  },
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Contact = () => {
  const axiosPublic = useAxiosPublic();

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required").min(2, "Too short!"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    message: Yup.string()
      .required("Message is required")
      .min(10, "Message too short"),
    bloodType: Yup.string(),
  });

  const initialValues = {
    name: "",
    email: "",
    message: "",
    bloodType: "",
  };

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    const toastId = toast.loading("Sending your message...");

    try {
      const res = await axiosPublic.post("/messages", values);
      if (res.status === 201) {
        toast.success("Thank you! We'll respond within 24 hours.", {
          id: toastId,
        });
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.", { id: toastId });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3"
        >
          <span className="text-red-600">Contact</span> Our Team
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Have questions about donation? Need help finding a donor?
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col"
        >
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-5 text-gray-900 flex items-center gap-2">
            <FaPaperPlane className="text-red-500" />
            Send Us a Message
          </h3>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col h-full">
                <div className="space-y-4 flex-grow">
                  {/* Name Field */}
                  <div className="form-group">
                    <label
                      htmlFor="name"
                      className="block mb-1 font-medium"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Full Name
                    </label>
                    <motion.div
                      whileFocus="focus"
                      variants={fieldFocusVariants}
                    >
                      <div className="relative">
                        <Field
                          name="name"
                          type="text"
                          className="w-full p-2 pl-9 border rounded focus:outline-none"
                          placeholder="Enter your full name"
                          style={{
                            borderColor:
                              errors.name && touched.name
                                ? COLORS.error
                                : !errors.name && touched.name
                                ? COLORS.success
                                : COLORS.border,
                            color: COLORS.textPrimary,
                          }}
                        />
                        <FaUser
                          className="absolute left-3 top-3"
                          style={{ color: COLORS.icon }}
                        />
                      </div>
                    </motion.div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-sm mt-1"
                      style={{ color: COLORS.error }}
                    />
                    {!errors.name && touched.name && (
                      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle />
                        <span>Name looks good</span>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="font-group">
                    <label
                      htmlFor="email"
                      className="block mb-1 font-medium"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Email
                    </label>
                    <motion.div
                      whileFocus="focus"
                      variants={fieldFocusVariants}
                    >
                      <div className="relative">
                        <Field
                          name="email"
                          type="email"
                          className="w-full p-2 pl-9 border rounded focus:outline-none"
                          placeholder="Enter your email"
                          style={{
                            borderColor:
                              errors.email && touched.email
                                ? COLORS.error
                                : !errors.email && touched.email
                                ? COLORS.success
                                : COLORS.border,
                            color: COLORS.textPrimary,
                          }}
                        />
                        <FaEnvelope
                          className="absolute left-3 top-3"
                          style={{ color: COLORS.icon }}
                        />
                      </div>
                    </motion.div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm mt-1"
                      style={{ color: COLORS.error }}
                    />
                    {!errors.email && touched.email && (
                      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle />
                        <span>Email looks good</span>
                      </div>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label
                      htmlFor="bloodGroup"
                      className="block mb-1 font-medium"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Blood Group
                    </label>
                    <motion.div
                      whileFocus="focus"
                      variants={fieldFocusVariants}
                    >
                      <div className="relative">
                        <Field
                          as="select"
                          name="bloodGroup"
                          className="w-full p-2 pl-9 border rounded focus:outline-none"
                          style={{
                            borderColor:
                              errors.bloodGroup && touched.bloodGroup
                                ? COLORS.error
                                : !errors.bloodGroup && touched.bloodGroup
                                ? COLORS.success
                                : COLORS.border,
                            color: COLORS.textPrimary,
                          }}
                        >
                          <option value="">Select Blood Group</option>
                          {bloodGroups?.map((group) => (
                            <option key={group} value={group}>
                              {group}
                            </option>
                          ))}
                        </Field>
                        <FaTint
                          className="absolute left-3 top-3"
                          style={{ color: COLORS.icon }}
                        />
                      </div>
                    </motion.div>
                    <ErrorMessage
                      name="bloodGroup"
                      component="div"
                      className="text-sm mt-1"
                      style={{ color: COLORS.error }}
                    />
                    {!errors.bloodGroup && touched.bloodGroup && (
                      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle />
                        <span>Blood group selected</span>
                      </div>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="form-group">
                    <label
                      htmlFor="message"
                      className="mb-1 font-medium flex items-center gap-2"
                      style={{ color: COLORS.textPrimary }}
                    >
                      <FaMessage style={{ color: COLORS.icon }} />
                      Message
                    </label>
                    <motion.div
                      whileFocus="focus"
                      variants={fieldFocusVariants}
                    >
                      <Field
                        name="message"
                        as="textarea"
                        rows="5"
                        className="w-full p-2 border rounded focus:outline-none md:h-48 lg:h-36"
                        placeholder="Write your valuable message"
                        style={{
                          borderColor:
                            errors.message && touched.message
                              ? COLORS.error
                              : !errors.message && touched.message
                              ? COLORS.success
                              : COLORS.border,
                          color: COLORS.textPrimary,
                        }}
                      />
                    </motion.div>
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-sm mt-1"
                      style={{ color: COLORS.error }}
                    />
                    {!errors.message && touched.message && (
                      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle />
                        <span>Message looks good</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 md:flex justify-end">
                  <PrimaryBtn
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    style="w-full md:w-fit flex justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </PrimaryBtn>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 md:space-y-6"
        >
          {/* Emergency Contact */}
          <div className="bg-red-50 p-4 md:p-5 rounded-xl border border-red-100">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FaPhone className="text-red-500" />
              Emergency Contact
            </h4>
            <div className="space-y-2">
              <a
                href="tel:+8801234567890"
                className="text-xl md:text-2xl font-bold text-red-600 hover:text-red-700 flex items-center gap-3"
              >
                <span className="bg-white p-2 rounded-full shadow-sm">
                  <FaPhone className="text-red-500" />
                </span>
                01234-567890
              </a>
              <p className="text-sm md:text-base text-gray-600">
                Our 24/7 helpline is always available for urgent blood requests
              </p>
            </div>
          </div>

          {/* Location and Hours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Location */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                Our Centers
              </h4>
              <address className="text-sm not-italic">
                <p className="font-medium">National Headquarters</p>
                <p>Blood Connect</p>
                <p>Secretariat Rd, Dhaka 1000</p>
                <Link
                  to="https://www.google.com/maps/search/Secretariat+rd+dhaka+1000+address/@23.7318011,90.3827875,15z?entry=ttu&g_ep=EgoyMDI1MDQyOC4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline inline-block mt-2"
                >
                  View on Map →
                </Link>
              </address>
            </div>

            {/* Hours */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <FaClock className="text-red-500" />
                Operating Hours
              </h4>
              <ul className="text-sm space-y-2">
                {[
                  { day: "Mon-Fri:", hours: "7AM - 9PM" },
                  { day: "Saturday:", hours: "8AM - 7PM" },
                  { day: "Sunday:", hours: "9AM - 5PM" },
                ].map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.day}</span> <span>{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Email Contact */}
          <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FaEnvelope className="text-red-500" />
              General Inquiries
            </h4>
            <div className="space-y-1">
              <Link
                to="mailto:contact@bloodconnect.org"
                className="text-red-600 hover:underline block"
              >
                contact@bloodconnect.org
              </Link>
              <p className="text-sm text-gray-600">
                We typically respond to all inquiries within 24 hours
              </p>
            </div>
          </div>

          {/* Recipient Experiences Testimonials */}
          <div>
            {/* Medical Recipient */}
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 shadow-sm">
              <div className="flex items-center mb-3">
                <svg
                  className="w-5 h-5 text-purple-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <h4 className="font-semibold text-gray-900 text-base">
                  Emergency Surgery
                </h4>
              </div>
              <p className="text-gray-700 mb-3 text-sm italic leading-relaxed">
                "After my car accident, I needed 4 units of O+ blood. The rapid
                delivery from Blood Connect's network gave me a second chance at
                life."
              </p>
              <p className="text-sm text-gray-600 font-medium">
                — Liton Kumar, ~Trauma Survivor
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
