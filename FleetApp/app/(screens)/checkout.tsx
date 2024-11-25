import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { RootState } from '../../store/store';
import { router } from 'expo-router';
import { clearCart } from '../../store/slices/cartSlice';

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const totalAmount = useAppSelector((state: RootState) => state.cart.totalAmount);
  const dispatch = useAppDispatch();

  const initializePayment = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'usd',
        }),
      });

      const { paymentIntent, ephemeralKey, customer } = await response.json();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "متجر الأجهزة",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
      });

      if (error) {
        Alert.alert('خطأ', error.message);
      } else {
        await presentPaymentSheet();
        dispatch(clearCart());
        router.push('/order-confirmation');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ في تهيئة الدفع');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace('/cart');
    } else {
      initializePayment();
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stripe Payment Sheet سيظهر تلقائياً */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});