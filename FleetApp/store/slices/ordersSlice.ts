import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: any;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload); // إضافة الطلب الجديد في بداية المصفوفة
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const order = state.orders.find(order => order.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;