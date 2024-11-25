import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';

interface Device {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: 'primary_devices' | 'sensors';
  type?: string;
  specifications?: Record<string, any>;
  description?: string;
  installation_fee?: number;
  supported_sensors?: string[];
}

export default function DeviceDetailsScreen() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('Description');

  const device: Device = JSON.parse(params.device as string);

  const handleAddToCart = () => {
    const itemToAdd = {
      id: device.id.toString(),
      name: device.name,
      price: device.price,
      image: { uri: device.imageUrl },
      quantity: quantity
    };
    
    dispatch(addToCart(itemToAdd));
    router.push("/cart");
  };

  return (
    <SafeAreaView style={styles.safeArea}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Device Details</Text>
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
          <Image 
            source={{ uri: device.imageUrl }} 
            style={styles.image} 
            resizeMode="contain" 
          />
          
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.productInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.productName}>{device.name}</Text>
              <Text style={styles.price}>${device.price}</Text>
              {device.installation_fee && (
                <Text style={styles.installationFee}>
                  Installation Fee: ${device.installation_fee}
                </Text>
              )}
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
                style={[styles.tab, selectedTab === 'Specifications' && styles.activeTab]}
                onPress={() => setSelectedTab('Specifications')}
              >
                <Text style={[styles.tabText, selectedTab === 'Specifications' && styles.activeTabText]}>
                  Specifications
                </Text>
              </TouchableOpacity>
              {device.supported_sensors && (
                <TouchableOpacity 
                  style={[styles.tab, selectedTab === 'Supported' && styles.activeTab]}
                  onPress={() => setSelectedTab('Supported')}
                >
                  <Text style={[styles.tabText, selectedTab === 'Supported' && styles.activeTabText]}>
                    Supported Sensors
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {selectedTab === 'Description' && device.description && (
              <View style={styles.descriptionContent}>
                <Text style={styles.descriptionItem}>{device.description}</Text>
              </View>
            )}

            {selectedTab === 'Specifications' && device.specifications && (
              <View style={styles.descriptionContent}>
                {Object.entries(device.specifications).map(([key, value]) => (
                  <Text key={key} style={styles.descriptionItem}>
                    {key}: {value}
                  </Text>
                ))}
              </View>
            )}

            {selectedTab === 'Supported' && device.supported_sensors && (
              <View style={styles.descriptionContent}>
                {device.supported_sensors.map((sensor, index) => (
                  <Text key={index} style={styles.descriptionItem}>
                    • {sensor}
                  </Text>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
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
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  installationFee: {
    fontSize: 16,
    color: '#666',
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