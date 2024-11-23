import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';

interface Device {
  id: string;
  name: string;
  price: number;
  image: any;
  category: 'primary' | 'sensor';
  type?: string;
  rating?: number;
  description?: string[];
}

export default function DeviceDetailsScreen() {
    const params = useLocalSearchParams();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [selectedTab, setSelectedTab] = useState('Description');
  
    const device: Device = JSON.parse(params.device as string);
  
    const handleAddToCart = () => {
      // نرسل المنتج مع الكمية المحددة في العداد
      const itemToAdd = {
        id: device.id,
        name: device.name,
        price: device.price,
        image: device.image,
        quantity: quantity // هذه الكمية ستضاف إلى عداد السلة
      };
      
      dispatch(addToCart(itemToAdd));
      router.push("/cart");
    };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Devices</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="heart-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerIcon}
              onPress={() => router.push("/cart")}
            >
              <Ionicons name="cart-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

      <ScrollView>
        <Image source={device.image} style={styles.image} resizeMode="contain" />
        
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.productInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{device.name}</Text>
            {device.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{device.rating}</Text>
              </View>
            )}
            <Text style={styles.price}>${device.price}</Text>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, selectedTab === 'Description' && styles.activeTab]}
              onPress={() => setSelectedTab('Description')}
            >
              <Text style={[styles.tabText, selectedTab === 'Description' && styles.activeTabText]}>
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, selectedTab === 'Reviews' && styles.activeTab]}
              onPress={() => setSelectedTab('Reviews')}
            >
              <Text style={[styles.tabText, selectedTab === 'Reviews' && styles.activeTabText]}>
                Reviews
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, selectedTab === 'Specifications' && styles.activeTab]}
              onPress={() => setSelectedTab('Specifications')}
            >
              <Text style={[styles.tabText, selectedTab === 'Specifications' && styles.activeTabText]}>
                Product Specifications
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'Description' && device.description && (
            <View style={styles.descriptionContent}>
              {device.description.map((item, index) => (
                <Text key={index} style={styles.descriptionItem}>{item}</Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity 
            onPress={() => setQuantity(prev => prev + 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>ADD TO CART</Text>
          <Ionicons name="cart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      headerIcon: {
        marginLeft: 15,
      },
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f9f9f9',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0066CC',
  },
  productInfo: {
    padding: 16,
  },
  titleRow: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066CC',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  descriptionContent: {
    marginTop: 16,
  },
  descriptionItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginRight: 16,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0066CC',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});