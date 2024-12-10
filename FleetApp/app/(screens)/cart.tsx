import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../store/store';
import { Ionicons } from '@expo/vector-icons';
import { incrementQuantity, decrementQuantity } from '../../store/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';
import { handleCheckout } from '../../services/checkoutService'; // استيراد الدالة


export default function CartScreen() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user.id);


  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const newOrder = {
    id: `ORD-${Date.now()}`,
    items: cartItems,
    total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    date: new Date().toISOString(),
    status: 'pending' as const
  }

  const handleCartCheckout = () => {
      handleCheckout(newOrder, cartItems, userId, dispatch)
      router.push('/order-confirmation');
    }
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>YOUR CART</Text>
          <View style={{ width: 24 }} />
        </View>

      <ScrollView 
        style={styles.cartItems}
        contentContainerStyle={styles.cartItemsContent}
      >
        {cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => dispatch(decrementQuantity(item.id))}
                >
                  <Ionicons name="remove-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => dispatch(incrementQuantity(item.id))}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCartCheckout}
          >
            <Text style={styles.checkoutText}>CHECKOUT</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
    flex: 1,
    backgroundColor: '#fff',
    },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    },
    headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    },
    cartItems: {
    flex: 1,
    },
    cartItemsContent: {
    paddingBottom: 15, // إضافة مسافة في نهاية القائمة
    },
    cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    },
    // ... باقي الأنماط بدون تغيير
    footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 15, // إضافة مساحة إضافية للـ iOS
    },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});