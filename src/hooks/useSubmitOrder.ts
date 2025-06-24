// ../api/hooks.ts lub osobny plik np. useSubmitOrder.ts
import { useMutation } from "@tanstack/react-query";
import { OrderSubmitData } from "../types";

export const useSubmitOrder = (
  onSuccess: () => void,
  onError?: (error: unknown) => void,
) => {
  return useMutation({
    mutationFn: async (orderData: OrderSubmitData) => {
      const response = await fetch(
        `http://localhost:3002/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess,
    onError,
  });
};
