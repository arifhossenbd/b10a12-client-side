import toast from "react-hot-toast";
import AuthForm from "../../component/AuthForm/AuthForm";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaUserPlus } from "react-icons/fa";

const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
const imgbbUrl = `${import.meta.env.VITE_IMGBB_URL}?key=${imgbbKey}`;

const Register = () => {
  const { user, register } = useAuth();
  const axiosPublic = useAxiosPublic();

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

          const imgUploadResponse = await axiosPublic.post(imgbbUrl, formData, {
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
      const userData = {
        name: data.name,
        email: data.email,
        bloodGroup: data.bloodGroup,
        division: data.division,
        district: data.district,
        upazila: data.upazila,
        ...(imageUrl && { image: imageUrl }),
        role: "donor",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await register(data.email, data.password, data.name, imageUrl);
      const res = await axiosPublic.post("/users", userData);

      if (res.status === 201) {
        toast.success(
          <div className="flex items-center gap-2">
            <FaUserPlus />
            <span>Registration successful! Welcome to Blood Connect</span>
          </div>,
          { id: toastId, duration: 3000 }
        );
      } else {
        throw new Error("Failed to save user data");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <AuthForm type="register" onSubmit={handleRegister} user={user} />
      <p className="text-center text-sm text-gray-600 pb-8">
        By registering, you're agreeing to help save lives through blood
        donation.
      </p>
    </div>
  );
};

export default Register;
