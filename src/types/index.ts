// Pełna kategoria jaką zwraca backend
export interface Category {
  _id: string; // MongoDB ID
  id?: string; // Opcjonalny dodatkowy ID, jeśli występuje
  name: string;
  identifier: string;
  position: number;
}

// Typ do dodawania nowej kategorii (wysyłany z frontu)
export interface NewCategory {
  name: string;
  identifier: string;
  position: number;
}

// Część w bazie danych
export interface Part {
  _id: string; // MongoDB ObjectId jako string
  id: string; // Twoje własne ID
  name: string;
  price: number;
  partId: string; // Slug/identyfikator części
  categoryId: string;
}

// Nowa część do dodania
export interface NewPart {
  name: string;
  price: string;
  partId: string;
}

// Część z ilością (np. do koszyka)
export interface PartWithQuantity extends Part {
  quantity: number;
}

// Pełne zamówienie z bazy danych
export interface Order {
  _id:string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  value: number;
  details: string;
}

// Dane do wysłania zamówienia
export interface OrderSubmitData {
  firstName: string;
  lastName: string;
  email: string;
  value: number;
  details: string;
}
