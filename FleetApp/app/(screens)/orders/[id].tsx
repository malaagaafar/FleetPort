import React from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StatusBar, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OrderDetailsScreen() {
const { id } = useLocalSearchParams();
const orders = useSelector((state: RootState) => state.orders.orders);

console.log('ID from params:', id);
console.log('ID type:', typeof id);
console.log('All orders:', orders);

// تنظيف المعرف من أي أقواس أو مسافات
const cleanId = String(id).trim();

const order = orders.find(order => {
    console.log('Comparing:', {
    orderId: order.id,
    paramId: cleanId,
    isMatch: order.id === cleanId
    });
    return order.id === cleanId;
});

console.log('Found order:', order);

if (!order) {
    return (
    <View style={styles.container}>
        <Text style={styles.errorText}>لم يتم العثور على الطلب</Text>
        <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        >
        <Text style={styles.buttonText}>رجوع</Text>
        </TouchableOpacity>
    </View>
    );
}

  // تحويل حالة الطلب إلى تنسيق العرض المطلوب
  const orderStatus = {
    confirmed: {
      completed: true,
      date: new Date(order.date).toLocaleDateString('ar-SA'),
    },
    shipping: {
      completed: order.status === 'shipped' || order.status === 'delivered',
      estimatedDate: new Date(new Date(order.date).getTime() + 3*24*60*60*1000).toLocaleDateString('ar-SA'),
    },
    delivered: {
      completed: order.status === 'delivered',
      estimatedDate: new Date(new Date(order.date).getTime() + 14*24*60*60*1000).toLocaleDateString('ar-SA'),
    },
  };

  const orderDetails = {
    courierName: 'DHL',
    trackingNumber: `TRK-${order.id}`,
    trackingUrl: `https://www.dhl.com/tracking/${order.id}`,
    items: order.items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    })),
    shippingCost: 'FREE',
    total: order.total
  };
 // ... باقي الاستيرادات كما هي
    // ... باقي الكود حتى return
  
    return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Orders</Text>
          <View style={{ width: 24 }} />
        </View>
  
        <ScrollView style={styles.content}>
          <Text style={styles.orderNumber}>Order number #{order.id.slice(-4).padStart(4, '0')}</Text>
  
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLine}>
              <View style={[styles.progressFill, { width: '33%' }]} />
            </View>
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, styles.activeDot]} />
                <Text style={styles.statusText}>Confirmed</Text>
                <Text style={styles.dateText}>Jan 1, 2025</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Shipping</Text>
                <Text style={styles.dateText}>Est. Jan 4,2025</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Shipped</Text>
                <Text style={styles.dateText}>Est. Jan 14,2025</Text>
              </View>
            </View>
          </View>
  
          {/* Shipping Info */}
          <View style={styles.shippingInfo}>
            <Text style={styles.label}>Courier name:</Text>
            <TextInput
              style={styles.input}
              value="DHL"
              editable={false}
            />
            
            <Text style={styles.label}>Tracking number:</Text>
            <TextInput
              style={styles.input}
              value="575D852ANC12"
              editable={false}
            />
            
            <Text style={styles.label}>Shipment tracking URL:</Text>
            <TextInput
              style={styles.input}
              value="https://www.dhl.com/tracking/216d512"
              editable={false}
            />
          </View>
  
          {/* Items */}
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
          ))}
  
          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text>Product total</Text>
              <Text>${order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Shipping cost</Text>
              <Text style={styles.freeText}>FREE</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text>Total</Text>
              <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    orderNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    progressContainer: {
      marginBottom: 32,
    },
    progressLine: {
      height: 2,
      backgroundColor: '#E0E0E0',
      marginHorizontal: 20,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#4CAF50',
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    statusItem: {
      alignItems: 'center',
      flex: 1,
    },
    statusDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#E0E0E0',
      marginBottom: 8,
    },
    activeDot: {
      backgroundColor: '#4CAF50',
    },
    statusText: {
      fontSize: 15,
      marginBottom: 4,
    },
    dateText: {
      fontSize: 13,
      color: '#666',
    },
    label: {
      fontSize: 15,
      marginBottom: 8,
      marginTop: 16,
    },
    input: {
      backgroundColor: '#F5F5F5',
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 24,
      marginBottom: 16,
    },
    itemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    itemImage: {
      width: 60,
      height: 60,
      marginRight: 16,
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      marginBottom: 4,
    },
    itemQuantity: {
      fontSize: 14,
      color: '#666',
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: '600',
    },
    summary: {
      marginTop: 24,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    freeText: {
      color: '#4CAF50',
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingTop: 12,
      marginTop: 12,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });