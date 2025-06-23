// hooks/useAddCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "../types";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Omit<Category, "id">): Promise<Category> => {
      const response = await fetch(
        "https://car-configurator-nine.vercel.app/api/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
