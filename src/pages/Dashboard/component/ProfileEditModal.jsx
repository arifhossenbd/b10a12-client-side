import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FaSave, FaTimes, FaUser, FaCamera, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useState } from "react";
import LocationSelector from "../../../component/LocationSelector/LocationSelector";
import CloseBtn from "../../../Buttons/CloseBtn";

const ProfileEditModal = ({ isOpen, onClose, userData, refetch }) => {
  const { axiosPublic, axiosImgBB } = useAxiosPublic();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Safely destructure userData with fallbacks
  const {
    _id = "",
    name = "",
    email = "",
    bloodGroup = "",
    image = null,
    location = {
      division: "",
      district: "",
      upazila: "",
    },
  } = userData || {};

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    bloodGroup: Yup.string().required("Blood group is required"),
    division: Yup.string().required("Division is required"),
    district: Yup.string().required("District is required"),
    upazila: Yup.string().required("Upazila is required"),
  });

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let imageUrl = image;
      if (imageFile) imageUrl = await uploadImage();

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
        toast.success("Profile updated successfully!");
        refetch();
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog className={`modal modal-middle ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-xl">
        <CloseBtn onClick={onClose} />

        <h3 className="font-bold text-lg mb-4 md:mb-6 text-center">Edit Profile</h3>

        <Formik
          initialValues={{
            name,
            email,
            bloodGroup,
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
              <div className="space-y-4">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    {imagePreview || image ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={imagePreview || image}
                          alt={name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-4xl text-gray-400" />
                      </div>
                    )}

                    <label className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <FaCamera className="text-white text-xl" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isImageUploading}
                      />
                    </label>
                  </div>
                  {isImageUploading && (
                    <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                      <span className="loading loading-spinner loading-xs"></span>
                      <span>Uploading image...</span>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <Field
                      name="email"
                      type="email"
                      disabled
                      className="input input-bordered w-full bg-gray-100"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Blood Group</span>
                    </label>
                    <Field
                      as="select"
                      name="bloodGroup"
                      className="select select-bordered w-full"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <LocationSelector
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-ghost disabled:cursor-not-allowed ring-0 focus:ring-0 transition-colors duration-200  shadow-sm hover:shadow-md active:shadow-none disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isImageUploading}
                    className="btn btn-primary border-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed ring-0 focus:ring-0 transition-colors duration-200 text-white shadow-sm hover:shadow-md active:shadow-none disabled:opacity-50"
                  >
                    {isSubmitting || isImageUploading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <FaSave />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </dialog>
  );
};

export default ProfileEditModal;
