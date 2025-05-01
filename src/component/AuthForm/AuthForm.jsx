import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaTint,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaHeartbeat,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import LocationSelector from "../LocationSelector/LocationSelector";
import { useState } from "react";

// Color scheme constants
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

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

const fieldFocusVariants = {
  focus: {
    boxShadow: `0 0 0 2px ${COLORS.primary}40`,
    borderColor: COLORS.primary,
    transition: { duration: 0.2 },
  },
};

const AuthForm = ({ type = "login", onSubmit, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Validation schema
  const validationSchema = Yup.object().shape({
    ...(type === "register" && {
      name: Yup.string().required("Name is required"),
      bloodGroup: Yup.string().required("Blood group is required"),
      division: Yup.string().required("Division is required"),
      district: Yup.string().required("District is required"),
      upazila: Yup.string().required("Upazila is required"),
      image: Yup.mixed().required("Profile picture is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*])[A-Za-z\d~!@#$%^&*]{6,}$/,
        "Password must contain at least one uppercase, one lowercase, one number and one special character"
      ),
  });

  // Initial values
  const initialValues = {
    name: "",
    email: "",
    password: "",
    ...(type === "register" && { confirmPassword: "" }),
    bloodGroup: "",
    division: "",
    district: "",
    upazila: "",
    image: null,
  };

  return (
    <div className="bg-base-100">
      <div className="px-4 pb-8 pt-24">
        <motion.div
          className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden p-6 border border-gray-200"
          style={{ backgroundColor: COLORS.cardBg }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-6">
            <motion.div variants={pulseVariants} animate="pulse">
              <FaHeartbeat
                className="mx-auto text-4xl mb-2"
                style={{ color: COLORS.primary }}
              />
            </motion.div>
            <h2
              className="text-2xl font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              {type === "login"
                ? "Login to Save Lives"
                : "Join Our Donor Community"}
            </h2>
            <p className="mt-1" style={{ color: COLORS.textSecondary }}>
              {type === "login"
                ? "Your blood can give someone a second chance at life"
                : "Register to become a blood donor today"}
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-4">
                {type === "register" && (
                  <>
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
                            className="w-full p-2 pl-10 border rounded focus:outline-none"
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
                            className="w-full p-2 pl-10 border rounded focus:outline-none"
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

                    {/* Location Selector */}
                    <LocationSelector 
                      color={COLORS}
                      setFieldValue={setFieldValue}
                      values={values}
                      errors={errors}
                      touched={touched}
                    />

                    {/* Image Upload */}
                    <div className="font-group">
                      <label
                        htmlFor="image"
                        className="block mb-1 font-medium"
                        style={{ color: COLORS.textPrimary }}
                      >
                        Profile Picture
                      </label>
                      <motion.div
                        whileFocus="focus"
                        variants={fieldFocusVariants}
                      >
                        <div className="relative">
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setFieldValue("image", e.currentTarget.files[0]);
                            }}
                            className="w-full p-2 pl-10 border rounded focus:outline-none"
                            style={{
                              borderColor:
                                errors.image && touched.image
                                  ? COLORS.error
                                  : !errors.image && touched.image
                                  ? COLORS.success
                                  : COLORS.border,
                              color: COLORS.textPrimary,
                            }}
                          />
                          <FaImage
                            className="absolute left-3 top-3"
                            style={{ color: COLORS.icon }}
                          />
                        </div>
                      </motion.div>
                      <ErrorMessage
                        name="image"
                        component="div"
                        className="text-sm mt-1"
                        style={{ color: COLORS.error }}
                      />
                      {!errors.image && touched.image && (
                        <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <FaCheckCircle />
                          <span>Image selected</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div className="font-group">
                  <label
                    htmlFor="email"
                    className="block mb-1 font-medium"
                    style={{ color: COLORS.textPrimary }}
                  >
                    Email
                  </label>
                  <motion.div whileFocus="focus" variants={fieldFocusVariants}>
                    <div className="relative">
                      <Field
                        name="email"
                        type="email"
                        className="w-full p-2 pl-10 border rounded focus:outline-none"
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

                {/* Password Field */}
                <div className="font-group">
                  <label
                    htmlFor="password"
                    className="block mb-1 font-medium"
                    style={{ color: COLORS.textPrimary }}
                  >
                    Password
                  </label>
                  <motion.div whileFocus="focus" variants={fieldFocusVariants}>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 pl-10 border rounded focus:outline-none"
                        placeholder={
                          type === "login"
                            ? "Enter your password"
                            : "Create a password"
                        }
                        style={{
                          borderColor:
                            errors.password && touched.password
                              ? COLORS.error
                              : !errors.password && touched.password
                              ? COLORS.success
                              : COLORS.border,
                          color: COLORS.textPrimary,
                        }}
                      />
                      <FaLock
                        className="absolute left-3 top-3"
                        style={{ color: COLORS.icon }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl md:text-2xl"
                        style={{ color: COLORS.icon }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </motion.div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm mt-1"
                    style={{ color: COLORS.error }}
                  />
                  {type === "register" && values.password && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span style={{ color: COLORS.textSecondary }}>
                          Password strength:
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              values.password.length >= 8 &&
                              /[A-Z]/.test(values.password) &&
                              /[a-z]/.test(values.password) &&
                              /\d/.test(values.password) &&
                              /[~!@#$%^&*]/.test(values.password)
                                ? "bg-green-500"
                                : values.password.length >= 6
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${
                                values.password.length >= 8 &&
                                /[A-Z]/.test(values.password) &&
                                /[a-z]/.test(values.password) &&
                                /\d/.test(values.password) &&
                                /[~!@#$%^&*]/.test(values.password)
                                  ? "100"
                                  : values.password.length >= 6
                                  ? "60"
                                  : "30"
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                {type === "register" && (
                  <div className="font-group">
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-1 font-medium"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Confirm Password
                    </label>
                    <motion.div
                      whileFocus="focus"
                      variants={fieldFocusVariants}
                    >
                      <div className="relative">
                        <Field
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          className="w-full p-2 pl-10 border rounded focus:outline-none"
                          placeholder="Confirm your password"
                          style={{
                            borderColor:
                              errors.confirmPassword && touched.confirmPassword
                                ? COLORS.error
                                : !errors.confirmPassword &&
                                  touched.confirmPassword
                                ? COLORS.success
                                : COLORS.border,
                            color: COLORS.textPrimary,
                          }}
                        />
                        <FaLock
                          className="absolute left-3 top-3"
                          style={{ color: COLORS.icon }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xl md:text-2xl"
                          style={{ color: COLORS.icon }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </motion.div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-sm mt-1"
                      style={{ color: COLORS.error }}
                    />
                    {!errors.confirmPassword && touched.confirmPassword && (
                      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle />
                        <span>Passwords match</span>
                      </div>
                    )}
                  </div>
                )}
                <PrimaryBtn
                  style="w-full flex justify-center"
                  user={user}
                  loading={isSubmitting}
                  toolTipText={"You are already logged in"}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <FaSpinner />
                      </motion.div>
                      <span>
                        {type === "login" ? "Logging in..." : "Registering..."}
                      </span>
                    </div>
                  ) : type === "login" ? (
                    "Login"
                  ) : (
                    "Register"
                  )}
                </PrimaryBtn>

                <div
                  className="text-center text-sm mt-4"
                  style={{ color: COLORS.textSecondary }}
                >
                  {type === "login" ? (
                    <div>
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        style={{ color: COLORS.secondary }}
                        className="hover:underline"
                      >
                        Register here
                      </Link>
                    </div>
                  ) : (
                    <div>
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{ color: COLORS.secondary }}
                        className="hover:underline"
                      >
                        Login here
                      </Link>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthForm;