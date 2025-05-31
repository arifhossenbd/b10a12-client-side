import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaCamera,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import useUserRole from "../../../hooks/useUserRole";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LocationSelector from "../../../component/LocationSelector/LocationSelector";

const Profile = () => {
  const { userData, loading: userLoading, refetch } = useUserRole();
  const { axiosPublic, axiosImgBB } = useAxiosPublic();
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const { _id, name, email, bloodGroup, image, location } = userData || {};

  // Blood group options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    bloodGroup: Yup.string().required("Blood group is required"),
    division: Yup.string().required("Division is required"),
    district: Yup.string().required("District is required"),
    upazila: Yup.string().required("Upazila is required"),
  });

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to ImgBB
  const uploadImage = async () => {
    if (!imageFile) return null;

    setIsImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axiosImgBB.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );

      return response.data.data.url;
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
      return null;
    } finally {
      setIsImageUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let imageUrl = image;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      // Prepare updated data for MongoDB
      const updatedData = {
        name: values?.name,
        bloodGroup: values?.bloodGroup,
        location: {
          division: values?.division,
          district: values?.district,
          upazila: values?.upazila,
        },
        ...(imageUrl && { image: imageUrl }),
      };
      const response = await axiosPublic.patch(`/users/${_id}`, updatedData);
      if (response.status === 200) {
        await refetch()
        toast.success("Profile updated successfully!");
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" },
    tap: { scale: 0.98 },
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FaSpinner className="text-4xl text-red-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <Formik
        initialValues={{
          name: name || "",
          email: email || "",
          bloodGroup: bloodGroup || "",
          division: location?.division || "",
          district: location?.district || "",
          upazila: location?.upazila || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form>
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Profile Information
                </h2>

                <AnimatePresence mode="wait">
                  {!editMode ? (
                    <motion.button
                      key="edit"
                      type="button"
                      onClick={() => setEditMode(true)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <FaEdit /> Edit Profile
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        key="cancel"
                        type="button"
                        disabled={isSubmitting || isImageUploading}
                        onClick={() => {
                          setEditMode(false);
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        <FaTimes /> Cancel
                      </motion.button>
                      <motion.button
                        key="save"
                        type="submit"
                        disabled={isSubmitting || isImageUploading}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-70 cursor-pointer"
                      >
                        {isSubmitting || isImageUploading ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                          >
                            <FaSpinner />
                          </motion.span>
                        ) : (
                          <FaSave />
                        )}
                        Save Changes
                      </motion.button>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Content */}
              <div className="p-4 md:p-6">
                {/* Avatar Section */}
                <motion.div
                  className="flex flex-col items-center mb-6"
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <div className="relative group">
                    {imagePreview || image ? (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={imagePreview || image}
                          alt={name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-5xl text-gray-400" />
                      </div>
                    )}

                    {editMode && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-black/50 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ opacity: 1 }}
                      >
                        <label className="cursor-pointer p-3 bg-white bg-opacity-80 rounded-full">
                          <FaCamera className="text-gray-700" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isImageUploading}
                          />
                        </label>
                      </motion.div>
                    )}
                  </div>
                  {isImageUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-gray-500 flex items-center gap-2"
                    >
                      <FaSpinner className="animate-spin" /> Uploading image...
                    </motion.div>
                  )}
                </motion.div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <motion.div
                    variants={formItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Field
                      name="name"
                      type="text"
                      disabled={!editMode}
                      className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all ${
                        !editMode ? "bg-gray-100" : "bg-white"
                      }`}
                    />
                  </motion.div>

                  {/* Email Field (disabled) */}
                  <motion.div
                    variants={formItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100"
                    />
                  </motion.div>

                  {/* Blood Group Field */}
                  <motion.div
                    variants={formItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <Field
                      as="select"
                      name="bloodGroup"
                      disabled={!editMode}
                      className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all ${
                        !editMode ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups?.map((group) => (
                        <option
                          key={group}
                          value={group}
                          defaultValue={group === bloodGroup}
                        >
                          {group}
                        </option>
                      ))}
                    </Field>
                  </motion.div>

                  {/* Location Selector */}
                  {editMode ? (
                    <div className="md:col-span-2 space-y-4">
                      <LocationSelector
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Display-only Location Fields */}
                      <motion.div
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={4}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          Division
                        </label>
                        <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100">
                          {location?.division || "Not specified"}
                        </div>
                      </motion.div>

                      <motion.div
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={5}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          District
                        </label>
                        <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100">
                          {location?.district || "Not specified"}
                        </div>
                      </motion.div>

                      <motion.div
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={6}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          Upazila
                        </label>
                        <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100">
                          {location?.upazila || "Not specified"}
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default Profile;
