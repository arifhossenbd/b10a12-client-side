import toast from "react-hot-toast";
import AuthForm from "../../component/AuthForm/AuthForm";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
const imgbbUrl = `${import.meta.env.VITE_IMGBB_URL}?key=${imgbbKey}`;

const Register = () => {
  const { user, register } = useAuth();
  const axiosPublic = useAxiosPublic();

  const handleRegister = async (data) => {
    try {
      let imageUrl = null;
      const formData = new FormData();
      formData.append("image", data?.image);

      const imgUploadResponse = await axiosPublic.post(imgbbUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if the image upload was successful
      if (imgUploadResponse.status === 200) {
        imageUrl = imgUploadResponse?.data?.data?.display_url;
      }

      const userData = {
        name: data.name,
        email: data.email,
        bloodGroup: data.bloodGroup,
        division: data.division,
        district: data.district,
        upazila: data.upazila,
        ...(imageUrl && { image: imageUrl }),
      };

      // Register the user
      await register(data?.email, data?.password, data?.name, imageUrl);

      // Send user data to the server after registration
      const res = await axiosPublic.post("/users", userData);
      if (res.insertedId) {
        toast.success("Registration successful");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <AuthForm type="register" onSubmit={handleRegister} user={user} />
    </div>
  );
};

export default Register;
