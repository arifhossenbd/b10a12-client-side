import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export const useDatabaseData = (endpoint, options = {}) => {
  const { axiosPublic } = useAxiosPublic();
  const { page = 1, limit = 10, ...filters } = options;

  return useQuery({
    queryKey: [endpoint, { page, limit, ...filters }],

    queryFn: async () => {
      if (!endpoint) {
        throw new Error("No endpoint provided");
      }

      const { data } = await axiosPublic.get(endpoint, {
        params: { page, limit, ...filters },
      });

      if (data?.success === false) {
        throw new Error(data.message || "Request failed");
      }

      return {
        data: data?.data ?? data,
        meta: {
          total: data?.total ?? 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil((data?.total ?? 0) / limit),
        },
      };
    },

    enabled: !!endpoint,
    retry: (failureCount, error) => {
      return error?.response?.status >= 500 && failureCount < 2;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });
};
