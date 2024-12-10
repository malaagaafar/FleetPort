import api from '@/config/api';
//import { clearCart} from '../../store/slices/cartSlice';
import { addOrder, Order } from '../../store/slices/ordersSlice';
import { AppDispatch } from '../../store/store';

export const handleCheckout = async (newOrder: Order, cartItems: any[], userId: string, dispatch: AppDispatch) => {
  try {
    // تسجيل عملية الشراء في قاعدة البيانات
    await api.post('/purchase', {
      id: newOrder.id,
      items: JSON.stringify(cartItems),  // تأكد من تحويل cartItems إلى JSON
      total: newOrder.total,
      date: newOrder.date,
      userId: userId,
    });
    //dispatch(addOrder(newOrder)); // إضافة الطلب إلى المتجر
    //dispatch(clearCart()); // تفريغ السلة
  } catch (error) {
    console.error('Error during checkout:', error);
  }
};