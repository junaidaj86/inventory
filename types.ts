export interface Product {
    id: string;
    category: Category;
    name: string;
    price: string;
    isFeatured: boolean;
    size: Size;
    color: Color;
    images: Image[];
    quantity: number;
    quantityInCart: number;
  };
  
  export interface Image {
    id: string;
    url: string;
  }
  
  
  
  export interface Category {
    id: string;
    name: string;
  };
  
  export interface Size {
    id: string;
    name: string;
    value: string;
  };
  
  export interface Color {
    id: string;
    name: string;
    value: string;
  };