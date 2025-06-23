import { useQuery } from "@tanstack/react-query";
import { Part } from "../types";

export const useGetPartsByCategory = (categoryId?: string) => {
  return useQuery<Part[]>({
    queryKey: ["parts", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        return [];
      }

      const response = await fetch(
        `https://car-configurator-nine.vercel.app/api/parts?categoryId=${categoryId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch parts");
      }

      const data = await response.json();
      return data;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
};
