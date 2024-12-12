export interface Part {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}

export interface PartWithQuantity extends Part {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  position: number;
}
