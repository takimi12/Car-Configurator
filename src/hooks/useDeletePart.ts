import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePart = (categoryId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partId: string) => {
      const response = await fetch(`http://localhost:3002/parts/${partId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Nie udało się usunąć części");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts", categoryId] });
    },
  });
};
