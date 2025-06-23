// hooks/useDeleteCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      // Fetch parts by category
      const partsResponse = await fetch(
        `https://car-configurator-nine.vercel.app/api/parts?categoryId=${categoryId}`,
      );
      if (!partsResponse.ok) {
        throw new Error("Failed to fetch parts");
      }
      const parts = await partsResponse.json();

      // Delete all parts
      await Promise.all(
        parts.map(async (part: { id: string }) => {
          const deletePartResponse = await fetch(
            `https://car-configurator-nine.vercel.app/api/parts/${part.id}`,
            { method: "DELETE" },
          );
          if (!deletePartResponse.ok) {
            throw new Error("Failed to delete part " + part.id);
          }
        }),
      );

      // Delete category
      const response = await fetch(
        `https://car-configurator-nine.vercel.app/api/categories/${categoryId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
