import { useQuery } from "@tanstack/react-query";

export const useLocalData = (fileName) => {
  return useQuery({
    queryKey: [fileName],
    queryFn: async () => {
      const response = await fetch(`/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Data`);
      }
      const jsonData = await response.json();
      if (Array.isArray(jsonData)) {
        const dataObject = jsonData?.find((item) => item?.data);
        return dataObject?.data ?? jsonData;
      }
      return jsonData?.data ?? jsonData;
    },
    staleTime: Infinity,
  });
};
