import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useDatabaseData = (endpoint, options = {}) => {
  const { axiosPublic } = useAxiosPublic();

  return useQuery({
    queryKey: [endpoint, options],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(endpoint, { params: options });

        if (!data.success) {
          throw new Error(data.message || "Request failed");
        }

        return {
          data: data?.data,
          meta: {
            total: data?.meta?.total || 0,
            page: data?.meta?.page || 1,
            limit: data?.meta?.limit || options.limit || 10,
            totalPages:
              data?.meta?.totalPages ||
              Math.ceil(
                (data?.meta?.total || 0) /
                  (data?.meta?.limit || options.limit || 10)
              ),
            hasNext: data?.meta?.hasNext || false,
            hasPrev: data?.meta?.hasPrev || false,
          },
        };
      } catch (error) {
        if (error.response?.status === 404) {
          throw new Error("Data not found");
        }
        throw error;
      }
    },
    keepPreviousData: true,
    staleTime: 30000,
    retry: 2, // Add retry for transient errors
    retryDelay: 1000,
  });
};

export default useDatabaseData;
