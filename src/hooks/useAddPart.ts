import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewPart } from "../types";

export const useAddPart = (
  categoryId: string | undefined,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPart: NewPart) => {
      const response = await fetch("https://car-configurator-nine.vercel.app/api/parts", {
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
