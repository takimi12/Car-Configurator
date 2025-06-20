
export interface Category {
    id: string;
    name: string;
    position: number;
    identifier: string;  }
  
  export interface Part {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    partId?: string; 
  }
 
  
  export interface NewPart {
    name: string;
    price: string;
    partId: string;
  }
  
  export interface PartWithQuantity extends Part {
    quantity: number;
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
  