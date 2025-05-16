import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useDatabaseData = (endpoint, options = {}) => {
  const { axiosPublic } = useAxiosPublic();
  
  return useQuery({
    queryKey: [endpoint, options],
    queryFn: async () => {
      const { data } = await axiosPublic.get(endpoint, {
        params: options
      });

      if (!data.success) {
        throw new Error(data.message || "Request failed");
      }

      // console.log(data.meta)

      const allData = data?.data
      const meta = data?.meta
      return {
        data: allData,
        meta: {
          total: meta?.total || 0,
          page: meta?.page || 1,
          limit: meta?.limit || options.limit || 10,
          totalPages: meta?.totalPages || 
            Math.ceil((meta?.total || 0) / (meta?.limit || options.limit || 10))
        }
      };
    },
    keepPreviousData: true,
    staleTime: 30000
  });
};

export default useDatabaseData;