import { useQuery } from "@tanstack/react-query";
import { Part } from "../types";
export const useGetParts = (
  categoryId?: string | number | undefined | null,
) => {
  return useQuery<Part[]>({
    queryKey: ["parts", categoryId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3002/parts`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch parts");
      }

      const data = await response.json();

      if (categoryId) {
        return data.filter(
          (part: Part) => part.categoryId === categoryId.toString(),
        );
      }

      return data;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
};
