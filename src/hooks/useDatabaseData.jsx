import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

export const useDatabaseData = (
  endpoint,
  { filters = {}, page = 1, limit = 10, ...queryOptions } = {}
) => {
  const axiosPublic = useAxiosPublic();
  
  return useQuery({
    queryKey: [endpoint, { ...filters, page, limit }],
    queryFn: async () => {
      const response = await axiosPublic.get(`/${endpoint}`, {
        params: {
          ...filters,
          page,
          limit,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Database request failed");
      }

      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        totalPages: Math.ceil(response.data.total / limit),
      };
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
    ...queryOptions,
  });
};