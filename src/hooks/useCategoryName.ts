import { useGetCategories } from "./useGetCategories";

export const useCategoryName = (categoryId?: string) => {
  const { data: categories } = useGetCategories();
  const categoryName =
    categories?.find((c) => c.id === categoryId)?.name || categoryId;
  return categoryName;
};
