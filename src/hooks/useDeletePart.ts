import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePart = (categoryId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partId: string) => {
      const response = await fetch(`/api/parts/${partId}`, {
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
