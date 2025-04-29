import AuthForm from "../../component/AuthForm/AuthForm";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const { user, login } = useAuth();

  const handleLogin = async (data) => {
    const toastId = toast.loading("Securely logging you in...", {
      duration: 2000
    });

    try {
      await login(data.email, data.password);

      toast.success(<span>Welcome back! You're now signed in.</span>, {
        id: toastId,
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
    }
  };

  return <AuthForm user={user} onSubmit={handleLogin} type="login" />;
};

export default Login;
