import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import axios from "axios";
import { useMemo } from "react";

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logout();
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [navigate, logout]);

  return axiosSecure;
};

export default useAxiosSecure;
