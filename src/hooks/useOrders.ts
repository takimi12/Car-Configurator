// src/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { Order } from "../types";

const API_URL = "https://car-configurator-nine.vercel.app";

export const useOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/orders`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.message || "Wystąpił błąd podczas pobierania zamówień";
        throw new Error(message);
      }

      return response.json();
    },
  });
};
