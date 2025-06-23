import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      try {
        const partsResponse = await fetch(
          `https://car-configurator-nine.vercel.app/api/parts?categoryId=${categoryId}`,
        );
        if (!partsResponse.ok) {
          const errorText = await partsResponse.text();
          console.error("Nie udało się pobrać części:", errorText);
          throw new Error("Nie udało się pobrać części: " + errorText);
        }
        const parts = await partsResponse.json();

        // Użyj Promise.allSettled, aby zobaczyć wyniki wszystkich obietnic
        const deletionResults = await Promise.allSettled(
          parts.map(async (part: { _id: string }) => {
            // Zmieniono part.id na part._id na podstawie ObjectId z MongoDB
            const deletePartResponse = await fetch(
              `https://car-configurator-nine.vercel.app/api/parts/${part._id}`, // Użyj part._id
              { method: "DELETE" },
            );
            if (!deletePartResponse.ok) {
              const errorText = await deletePartResponse.text();
              console.error(
                `Nie udało się usunąć części ${part._id}:`,
                errorText,
              );
              throw new Error(
                "Nie udało się usunąć części " + part._id + ": " + errorText,
              );
            }
          }),
        );

        // Sprawdź, czy którekolwiek usunięcia części się nie powiodły
        const failedDeletions = deletionResults.filter(
          (result) => result.status === "rejected",
        );
        if (failedDeletions.length > 0) {
          console.error(
            "Niektóre części nie zostały usunięte:",
            failedDeletions,
          );
          throw new Error(
            "Nie udało się usunąć wszystkich powiązanych części.",
          );
        }

        const response = await fetch(
          `https://car-configurator-nine.vercel.app/api/categories/${categoryId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const error = await response.json();
          console.error("Nie udało się usunąć kategorii:", error);
          throw new Error(error.message || "Nie udało się usunąć kategorii");
        }
      } catch (error) {
        console.error("Błąd podczas procesu usuwania kategorii:", error);
        throw error; // Ponowne rzucenie, aby propagować do handlera błędów useMutation
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["parts"] }); // Unieważnij również części
    },
    onError: (error) => {
      console.error("Błąd mutacji:", error.message);
      // Tutaj możesz wyświetlić powiadomienie (np. toast)
    },
  });
};
