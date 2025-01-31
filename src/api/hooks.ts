export interface Category {
  id: string;
  name: string;
  identifier: string;
  position: number;
}

export interface Part {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}

export interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  value: number;
  details: string;
}

export interface OrderSubmitData {
  firstName: string;
  lastName: string;
  email: string;
  value: number;
  details: string;
}

const API_URL = "http://localhost:3000";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

export const addCategory = async (
  category: Omit<Category, "id">,
): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  return handleResponse(response);
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  // Fetch parts for the category
  const parts = await fetchPartsByCategory(categoryId);

  // Delete all parts for the category
  await Promise.all(parts.map(part => deletePart(part.id)));

  // Now delete the category itself
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
  });
  await handleResponse(response);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  return handleResponse(response);
};

export const fetchPartsByCategory = async (
  categoryId: string,
): Promise<Part[]> => {
  const response = await fetch(`${API_URL}/parts?categoryId=${categoryId}`);
  return handleResponse(response);
};

export const deletePart = async (partId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/parts/${partId}`, {
    method: "DELETE",
  });
  await handleResponse(response);
};

export const addPart = async (part: Omit<Part, "id">): Promise<Part> => {
  const response = await fetch(`${API_URL}/parts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(part),
  });
  return handleResponse(response);
};

export const fetchCategoriesById = async (id: string): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`);
  return handleResponse(response);
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/orders`);
  if (!response.ok) {
    throw new Error("Error fetching orders");
  }
  return response.json();
};

export const submitOrder = async (orderData: OrderSubmitData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
