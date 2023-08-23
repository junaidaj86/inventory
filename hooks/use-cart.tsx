import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from "zustand/middleware"; 

import { Product } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
}

const useCart = create(
  persist<CartStore>((set, get) => ({
  items: [],
  addItem: (data: Product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.id === data.id);
    
    if (existingItem) {
      return toast('Item already in cart.');
    }

    set({ items: [...get().items, { ...data, quantityInCart: 1 }] });
    toast.success('Item added to cart.');
  },
  removeItem: (id: string) => {
    set({ items: [...get().items.filter((item) => item.id !== id)] });
    toast.success('Item removed from cart.');
  },
  removeAll: () => set({ items: [] }),
  increment: (id: string) => {
    set(state => ({
      items: state.items.map(item => {
        if (item.id === id) {
          const newQuantityInCart = (item.quantityInCart || 0) + 1;
          if (newQuantityInCart > item.quantity) {
            // Display a message indicating that the item is out of stock
            toast.error("Item is out of stock!");
  
            return item; // Keep the item unchanged
          }
  
          return { ...item, quantityInCart: newQuantityInCart };
        }
        return item;
      }),
    }));
  },
  decrement: (id: string) => {
    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantityInCart ? item.quantityInCart - 1 : 0;
          
        if (newQuantity > 0) {
          return { ...item, quantityInCart: newQuantity };
        }
        return null; // Mark for removal
        }
        return item;
      });
  
      return { items: updatedItems.filter((item) => item !== null) } as CartStore;
    });
  },
  
}), {
  name: 'cart-storage',
  storage: createJSONStorage(() => localStorage)
}));

export default useCart;
