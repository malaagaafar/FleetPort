import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';
import { addOrder } from '../../store/slices/ordersSlice';
import { RootState } from '../../store/store';

export default function OrderConfirmationScreen() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [order, setOrder] = React.useState<Order | null>(null);
    
    // إنشاء الطلب عند تحميل الصفحة
    React.useEffect(() => {
      const newOrder = {
        id: `ORD-${Date.now()}`,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending' as const
      };
      
      console.log('Creating new order:', newOrder);
      dispatch(addOrder(newOrder));
      dispatch(clearCart());
      setOrder(newOrder);
    }, []); // تشغيل مرة واحدة فقط عند تحميل المكون
  
    const handleTrackOrder = () => {
      if (!order) return;
      
      console.log('Navigating to order with ID:', order.id);
      router.push({
        pathname: "/(screens)/orders/[id]",
        params: { id: order.id }
      });
    };
  
    if (!order) {
      return (
        <View style={styles.container}>
          <Text>جاري إنشاء الطلب...</Text>
        </View>
      );
    }
  return (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
      
      <Text style={styles.title}>Your Order</Text>
      <Text style={styles.subtitle}>Has Been Accepted</Text>
      <Text style={styles.orderNumber}>Order ID: {order.id}</Text>      
      
      <Text style={styles.description}>
        Your items have been placed and are on its way to being processed
      </Text>
      
      <TouchableOpacity
        style={styles.trackButton}
        onPress={() => router.push(`/(screens)/orders/${order.id}`)}
      >
        <Text style={styles.trackButtonText}>TRACK ORDER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push('../(tabs)/devices')}
      >
        <Text style={styles.homeButtonText}>BACK TO HOME</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  orderNumber: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00E676',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmark: {
    color: '#fff',
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: '80%',
  },
  trackButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
  },
  homeButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});