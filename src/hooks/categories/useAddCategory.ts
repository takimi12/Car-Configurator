import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewCategory } from "../../types";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategory: NewCategory) => {
      const response = await fetch(
        "https://car-configurator-nine.vercel.app/api/categories",
        {
          method: "POST",
          body: JSON.stringify(newCategory),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
