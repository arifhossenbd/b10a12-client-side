import toast from "react-hot-toast";
import AuthForm from "../../component/AuthForm/AuthForm";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaUserPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
const imgbbUrl = `${import.meta.env.VITE_IMGBB_URL}?key=${imgbbKey}`;

const Register = () => {
  const { user, register } = useAuth();
  const { axiosPublic, axiosImgBB } = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleRegister = async (data) => {
    const toastId = toast.loading("Creating your account...", {
      duration: 2000,
    });

    try {
      let imageUrl = null;
      if (data?.image) {
        try {
          const formData = new FormData();
          formData.append("image", data.image);

          const imgUploadResponse = await axiosImgBB.post(imgbbUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (imgUploadResponse.data?.data?.display_url) {
            imageUrl = imgUploadResponse.data.data.display_url;
          }
        } catch (error) {
          console.error("Image upload error:", error);
        }
      }
      const donorData = {
        // Basic Info
        name: data.name,
        email: data.email,
        bloodGroup: data.bloodGroup,

        // Location
        location: {
          division: data.division,
          district: data.district,
          upazila: data.upazila,
          fullAddress: "",
        },
        // Status history
        statusHistory: [
          {
            status: "active",
            changedAt: new Date().toISOString(),
            changedBy: "admin",
            reason: "New registration",
          },
        ],

        // Current Status
        accountStatus: "active",
        availability: true,
        lastDonationDate: null,
        nextEligibleDonationDate: null, // Calculated (lastDonation + 3 months)

        // System
        role: "donor", // 'donor', 'admin', 'volunteer'
        image: imageUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await register(data.email, data.password, data.name, imageUrl);
      const res = await axiosPublic.post("/users", donorData);

      if (res.status === 201) {
        toast.success(
          <div className="flex items-center gap-2">
            <FaUserPlus />
            <span>Registration successful! Welcome to Blood Connect</span>
          </div>,
          { id: toastId, duration: 3000 }
        );
        navigate(from, { replace: true });
      } else {
        throw new Error("Failed to save user data");
      }
    } catch (error) {
      toast.dismiss(toastId);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered. Please login instead.");
        navigate("/login", { state: { from } });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <AuthForm type="register" onSubmit={handleRegister} user={user} />
      <p className="text-center text-sm text-gray-600 pb-8 px-4">
        By registering, you're agreeing to help save lives through blood
        donation.
      </p>
    </div>
  );
};

export default Register;
