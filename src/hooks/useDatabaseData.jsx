import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export const useDatabaseData = (endpoint, options = {}) => {
  const axiosPublic = useAxiosPublic();

  return useQuery({
    queryKey: [endpoint, options],
    
    queryFn: async () => {
      const response = await axiosPublic.get(endpoint, { params: options });

      if (!response.data.success) {
        throw new Error(response.data.message || "Request failed");
      }

      // Return consistent structure for both single items and paginated lists
      return {
        data: response.data.data,
        total: response.data.total || 1,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        totalPages: Math.ceil(
          (response.data.total || 1) / (response.data.limit || 10)
        ),
      };
    }
  });
};