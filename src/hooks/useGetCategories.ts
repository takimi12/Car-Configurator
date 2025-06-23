import { useQuery } from "@tanstack/react-query";
import { Category } from "../types";

export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        "https://car-configurator-nine.vercel.app/api/categories",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return response.json();
    },
  });
};
