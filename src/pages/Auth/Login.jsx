import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../../component/AuthForm/AuthForm";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (data) => {
    const toastId = toast.loading("Securely logging you in...", {
      duration: 2000,
    });

    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
      toast.success(<span>Welcome back! You're now signed in.</span>, {
        id: toastId,
        duration: 3000,
      });
    } catch (error) {
      toast.dismiss(toastId);
      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please check your email or register.");
        navigate("/register");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return <AuthForm user={user} onSubmit={handleLogin} type="login" />;
};

export default Login;
