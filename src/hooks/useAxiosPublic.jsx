import axios from "axios";
const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });
  const axiosImgBB = axios.create({
    withCredentials: false,
  });
  return { axiosPublic, axiosImgBB };
};

export default useAxiosPublic;
