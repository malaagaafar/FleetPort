import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      addToCart: (state, action: PayloadAction<CartItem>) => {
        const { id, quantity } = action.payload;
        const existingItem = state.items.find(item => item.id === id);
        
        if (existingItem) {
          // إذا كان المنتج موجود، نضيف الكمية المحددة إلى الكمية الحالية
          existingItem.quantity = existingItem.quantity + quantity;
        } else {
          // إذا كان المنتج غير موجود، نضيفه مع الكمية المحددة
          state.items.push({
            ...action.payload,
            quantity: quantity
          });
        }
      },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    // ... أي reducers أخرى
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { 
    addToCart, 
    incrementQuantity, 
    decrementQuantity,
    clearCart 
  } = cartSlice.actions;
  export default cartSlice.reducer;