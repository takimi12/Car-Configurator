import { useMutation } from "@tanstack/react-query";
import { OrderSubmitData } from "../../types";

export const useSubmitOrder = (
  onSuccess: () => void,
  onError?: (error: unknown) => void,
) => {
  return useMutation({
    mutationFn: async (orderData: OrderSubmitData) => {
      const response = await fetch(
        `https://car-configurator-nine.vercel.app/api/orders`,
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
