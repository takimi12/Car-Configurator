// hooks/useGetPartsByCategory.ts
import { useQuery } from "@tanstack/react-query";
import { fetchPartsByCategory } from "../api/hooks";
import { Part } from "../types";

export const useGetPartsByCategory = (categoryId?: string) => {
  return useQuery<Part[]>({
    queryKey: ["parts", categoryId],
    queryFn: () => {
      if (!categoryId) {
        return Promise.resolve([]);
      }
      return fetchPartsByCategory(categoryId);
    },
    enabled: !!categoryId, // zapytanie tylko gdy mamy categoryId
    staleTime: 1000 * 60 * 5, // opcjonalnie: cache na 5 minut
  });
};
