import { motion } from "motion/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaTint,
  FaMapMarkedAlt,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaHeartbeat,
} from "react-icons/fa";
import { useMemo, useState } from "react";
import { useLocalData } from "../../hooks/useLocalData";
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

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
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

// Helper function to find selected item
const findSelectedItem = (list, value) => {
  return list?.find((item) => item.en_name === value || item.name === value);
};

const AuthForm = ({ type = "login", onSubmit, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { data: divisions = [] } = useLocalData("location/divisions.json");
  const { data: districts = [] } = useLocalData("location/districts.json");
  const { data: upazilas = [] } = useLocalData("location/upazilas.json");
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Validation schema
  const validationSchema = Yup.object().shape({
    ...(type === "register" && {
      name: Yup.string().required("Name is required"),
      bloodGroup: Yup.string().required("Blood group is required"),
      division: Yup.string().required("Division is required"),
      district: Yup.string().required("District is required"),
      upazila: Yup.string().required("Upazila is required"),
      image: Yup.string().required("Image is required"),
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

  const filteredDistricts = useMemo(() => {
    return (division) => {
      if (!division) return [];
      const selectedDivision = findSelectedItem(divisions, division);
      return selectedDivision
        ? districts.filter(
            (district) => district.division_id === selectedDivision.id
          )
        : [];
    };
  }, [divisions, districts]);

  const filteredUpazilas = useMemo(() => {
    return (district) => {
      if (!district) return [];
      const selectedDistrict = findSelectedItem(districts, district);
      return selectedDistrict
        ? upazilas.filter(
            (upazila) => upazila.district_id === selectedDistrict.id
          )
        : [];
    };
  }, [districts, upazilas]);

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
            {({ errors, touched, values, setFieldValue, isSubmitting }) => {
              const filteredDistrictsResult = filteredDistricts(
                values.division
              );
              const filteredUpazilasResult = filteredUpazilas(values.district);
              return (
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
                        <div className="relative">
                          <Field
                            name="name"
                            type="text"
                            className="w-full p-2 pl-10 border rounded"
                            placeholder="Enter your full name"
                            style={{
                              borderColor:
                                errors.name && touched.name
                                  ? COLORS.error
                                  : COLORS.border,
                              color: COLORS.textPrimary,
                            }}
                          />
                          <FaUser
                            className="absolute left-3 top-3"
                            style={{ color: COLORS.icon }}
                          />
                        </div>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-sm mt-1"
                          style={{ color: COLORS.error }}
                        />
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
                        <div className="relative">
                          <Field
                            as="select"
                            name="bloodGroup"
                            className="w-full p-2 pl-10 border rounded"
                            style={{
                              borderColor:
                                errors.bloodGroup && touched.bloodGroup
                                  ? COLORS.error
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
                        <ErrorMessage
                          name="bloodGroup"
                          component="div"
                          className="text-sm mt-1"
                          style={{ color: COLORS.error }}
                        />
                      </div>

                      {/* Division Field */}
                      <div>
                        <label
                          htmlFor="division"
                          className="block mb-1 font-medium"
                          style={{ color: COLORS.textPrimary }}
                        >
                          Division
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="division"
                            className="w-full p-2 pl-10 border rounded"
                            style={{
                              borderColor:
                                errors.division && touched.division
                                  ? COLORS.error
                                  : COLORS.border,
                              color: COLORS.textPrimary,
                            }}
                            onChange={(e) => {
                              setFieldValue("division", e.target.value);
                              setFieldValue("district", "");
                              setFieldValue("upazila", "");
                            }}
                          >
                            <option value="">Select Division</option>
                            {divisions?.map((division) => (
                              <option
                                key={division.id}
                                value={division.en_name || division.name}
                              >
                                {division.en_name || division.name}
                              </option>
                            ))}
                          </Field>
                          <FaMapMarkedAlt
                            className="absolute left-3 top-3"
                            style={{ color: COLORS.icon }}
                          />
                        </div>
                        <ErrorMessage
                          name="division"
                          component="div"
                          className="text-sm mt-1"
                          style={{ color: COLORS.error }}
                        />
                      </div>

                      {/* District Field */}
                      {values?.division && (
                        <div>
                          <label
                            htmlFor="district"
                            className="block mb-1 font-medium"
                            style={{ color: COLORS.textPrimary }}
                          >
                            District
                          </label>
                          <div className="relative">
                            <Field
                              as="select"
                              name="district"
                              className="w-full p-2 pl-10 border rounded"
                              style={{
                                borderColor:
                                  errors.district && touched.district
                                    ? COLORS.error
                                    : COLORS.border,
                                color: COLORS.textPrimary,
                              }}
                              onChange={(e) => {
                                setFieldValue("district", e.target.value);
                                setFieldValue("upazila", "");
                              }}
                            >
                              <option value="">Select District</option>
                              {filteredDistrictsResult?.map((district) => (
                                <option
                                  key={district.id}
                                  value={district.en_name || district.name}
                                >
                                  {district.en_name || district.name}
                                </option>
                              ))}
                            </Field>
                            <FaMapMarkedAlt
                              className="absolute left-3 top-3"
                              style={{ color: COLORS.icon }}
                            />
                          </div>
                          <ErrorMessage
                            name="district"
                            component="div"
                            className="text-sm mt-1"
                            style={{ color: COLORS.error }}
                          />
                        </div>
                      )}

                      {/* Upazila Field */}
                      {values?.district && (
                        <div>
                          <label
                            htmlFor="upazila"
                            className="block mb-1 font-medium"
                            style={{ color: COLORS.textPrimary }}
                          >
                            Upazila
                          </label>
                          <div className="relative">
                            <Field
                              as="select"
                              name="upazila"
                              className="w-full p-2 pl-10 border rounded"
                              style={{
                                borderColor:
                                  errors.upazila && touched.upazila
                                    ? COLORS.error
                                    : COLORS.border,
                                color: COLORS.textPrimary,
                              }}
                            >
                              <option value="">Select Upazila</option>
                              {filteredUpazilasResult?.map((upazila) => (
                                <option
                                  key={upazila.id}
                                  value={upazila.en_name || upazila.name}
                                >
                                  {upazila.en_name || upazila.name}
                                </option>
                              ))}
                            </Field>
                            <FaMapMarkedAlt
                              className="absolute left-3 top-3"
                              style={{ color: COLORS.icon }}
                            />
                          </div>
                          <ErrorMessage
                            name="upazila"
                            component="div"
                            className="text-sm mt-1"
                            style={{ color: COLORS.error }}
                          />
                        </div>
                      )}

                      {/* Image Upload */}
                      <div className="font-group">
                        <label
                          htmlFor="image"
                          className="block mb-1 font-medium"
                          style={{ color: COLORS.textPrimary }}
                        >
                          Profile Picture
                        </label>
                        <div className="relative">
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setFieldValue("image", e.currentTarget.files[0]);
                            }}
                            className="w-full p-2 pl-10 border rounded"
                            style={{
                              borderColor:
                                errors.image && touched.image
                                  ? COLORS.error
                                  : COLORS.border,
                              color: COLORS.textPrimary,
                            }}
                          />
                          <FaImage
                            className="absolute left-3 top-3"
                            style={{ color: COLORS.icon }}
                          />
                        </div>
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="text-sm mt-1"
                          style={{ color: COLORS.error }}
                        />
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
                    <div className="relative">
                      <Field
                        name="email"
                        type="email"
                        className="w-full p-2 pl-10 border rounded"
                        placeholder="Enter your email"
                        style={{
                          borderColor:
                            errors.email && touched.email
                              ? COLORS.error
                              : COLORS.border,
                          color: COLORS.textPrimary,
                        }}
                      />
                      <FaEnvelope
                        className="absolute left-3 top-3"
                        style={{ color: COLORS.icon }}
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm mt-1"
                      style={{ color: COLORS.error }}
                    />
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
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 pl-10 border rounded"
                        placeholder={
                          type === "login"
                            ? "Enter your password"
                            : "Create a password"
                        }
                        style={{
                          borderColor:
                            errors.password && touched.password
                              ? COLORS.error
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
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm mt-1"
                      style={{ color: COLORS.error }}
                    />
                    {type === "register" && (
                      <div
                        className="text-xs mt-1"
                        style={{ color: COLORS.textSecondary }}
                      >
                        Password must contain:
                        <ul className="list-disc pl-5">
                          <li>At least 6 characters</li>
                          <li>One uppercase letter</li>
                          <li>One lowercase letter</li>
                          <li>One number</li>
                          <li>One special character (~!@#$%^&*)</li>
                        </ul>
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
                      <div className="relative">
                        <Field
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          className="w-full p-2 pl-10 border rounded"
                          placeholder="Confirm your password"
                          style={{
                            borderColor:
                              errors.confirmPassword && touched.confirmPassword
                                ? COLORS.error
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
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-sm mt-1"
                        style={{ color: COLORS.error }}
                      />
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={user || isSubmitting}
                    variants={buttonVariants}
                    whileHover={!user && !isSubmitting ? "hover" : {}}
                    whileTap={!user && !isSubmitting ? "tap" : {}}
                    className="w-full py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out"
                    style={{
                      backgroundColor:
                        user || isSubmitting
                          ? COLORS.textSecondary
                          : COLORS.primary,
                      color: "#FFFFFF",
                    }}
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
                          {type === "login"
                            ? "Logging in..."
                            : "Registering..."}
                        </span>
                      </div>
                    ) : type === "login" ? (
                      "Login"
                    ) : (
                      "Register"
                    )}
                  </motion.button>

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
              );
            }}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthForm;
