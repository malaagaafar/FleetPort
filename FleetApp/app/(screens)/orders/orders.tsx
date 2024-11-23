import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../../../store/store';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
  const orders = useSelector((state: RootState) => state.orders.orders);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {orders.map(order => (
        <TouchableOpacity
          key={order.id}
          style={styles.orderCard}
          onPress={() => router.push(`/orders/${order.id}`)}
        >
          <Image 
            source={order.items[0].image} 
            style={styles.orderImage} 
            resizeMode="contain"
          />
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>Order number #{order.id.slice(-4).padStart(4, '0')}</Text>
            <Text style={styles.orderDate}>Date: {new Date(order.date).toLocaleDateString()}</Text>
            <Text style={styles.itemCount}>x{order.items.reduce((sum, item) => sum + item.quantity, 0)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  orderImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 16,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
});