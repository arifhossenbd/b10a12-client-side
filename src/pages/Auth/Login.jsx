// import { domAnimations } from "motion/react"
// export const domAnimations
import AuthForm from "../../component/AuthForm/AuthForm";
import { useAuth } from "../../hooks/useAuth";

// const loadFeatures = import("./features.js")
//   .then(res => res.default)

const Login = () => {
  const { user, login } = useAuth();

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <AuthForm user={user} onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
