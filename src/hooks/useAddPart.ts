import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewPart } from "../types";

export const useAddPart = (
  categoryId: string | undefined,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPart: NewPart) => {
      const response = await fetch("http://localhost:3002/parts", {
        method: "POST",
        body: JSON.stringify({ ...newPart, categoryId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Nie udało się dodać części");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts", categoryId] });
      if (onSuccess) onSuccess();
    },
  });
};
