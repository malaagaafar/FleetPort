import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { addToCart } from '../../store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';

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

export default function DevicesScreen() {
  const dispatch = useDispatch();
  const [vehicleType, setVehicleType] = useState('');
  const [trailerType, setTrailerType] = useState('');
  const [selectedSensorType, setSelectedSensorType] = useState('All');

  const devices: Device[] = [
    {
      id: '1',
      name: 'FMC003 4G',
      price: 150,
      image: require('../../assets/images/fmc003.png'),
      category: 'primary',
      rating: 4.5,
      description: [
        'Reading OBD OEM Parameters',
        'Get Real Odometer & Real Fuel Level Data',
        'Effortless Plug & Play Installation',
        'Electric Vehicle Support'
      ]
    },
    {
      id: '2',
      name: 'FMC230 4G',
      price: 270,
      image: require('../../assets/images/fmb225.png'),
      category: 'primary',
      rating: 4.2,
      description: [
        'Advanced Vehicle Tracking',
        'Real-time Data Monitoring',
        'Easy Installation',
        'Comprehensive Reports'
      ]
    },
    {
      id: '3',
      name: 'Eye Beacon',
      price: 10,
      image: require('../../assets/images/eye-beacon0.png'),
      category: 'sensor',
      type: 'Temperature',
      rating: 4.0,
      description: [
        'Temperature Monitoring',
        'Long Battery Life',
        'Compact Design',
        'Wireless Connection'
      ]
    },
    {
      id: '4',
      name: 'Eye Sensor',
      price: 15,
      image: require('../../assets/images/eye-sensor1.png'),
      category: 'sensor',
      type: 'Door',
      rating: 4.3,
      description: [
        'Door Status Monitoring',
        'Easy Installation',
        'Long Range Connection',
        'Battery Efficient'
      ]
    }
  ];

  const sensorTypes = ['All', 'Temperature', 'Door', 'Cam', 'Tracker'];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.typeSelectors}>
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Vehicle Type</Text>
          <TouchableOpacity style={styles.selector}>
            <Text>Select vehicle type</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Trailer</Text>
          <TouchableOpacity style={styles.selector}>
            <Text>Select trailer type</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Primary Devices</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPrimaryDevices = () => {
    const primaryDevices = devices.filter(device => device.category === 'primary');
    return (
      <View style={styles.devicesGrid}>
        {primaryDevices.map(device => (
          <TouchableOpacity 
            key={device.id}
            style={styles.deviceCard}
            onPress={() => {
              router.push({
                pathname: `/(screens)/devices/${device.id}`,
                params: { device: JSON.stringify(device) }
              });
            }}
          >
            <Image source={device.image} style={styles.deviceImage} resizeMode="contain" />
            <Text style={styles.deviceName}>{device.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.devicePrice}>${device.price}</Text>
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={() => dispatch(addToCart({ ...device, quantity: 1 }))}
              >
                <Ionicons name="cart-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSensorsSection = () => (
    <View style={styles.sensorsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sensors</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sensorTypes}>
        {sensorTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.sensorTypeButton,
              selectedSensorType === type && styles.selectedSensorType
            ]}
            onPress={() => setSelectedSensorType(type)}
          >
            <Text
              style={[
                styles.sensorTypeText,
                selectedSensorType === type && styles.selectedSensorTypeText
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSensorsGrid = () => {
    const sensorDevices = devices.filter(device => {
      if (device.category !== 'sensor') return false;
      if (selectedSensorType === 'All') return true;
      return device.type === selectedSensorType;
    });

    return (
      <View style={styles.devicesGrid}>
        {sensorDevices.map(device => (
          <TouchableOpacity 
            key={device.id}
            style={styles.deviceCard}
            onPress={() => {
              router.push({
                pathname: `/(screens)/devices/${device.id}`,
                params: { device: JSON.stringify(device) }
              });
            }}
          >
            <Image source={device.image} style={styles.deviceImage} resizeMode="contain" />
            <Text style={styles.deviceName}>{device.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.devicePrice}>${device.price}</Text>
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={() => dispatch(addToCart({ ...device, quantity: 1 }))}
              >
                <Ionicons name="cart-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderPrimaryDevices()}
      {renderSensorsSection()}
      {renderSensorsGrid()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  filterButton: {
    padding: 5,
  },
  typeSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectorContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  selectorLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#0066CC',
  },
  devicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  deviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceImage: {
    width: '100%',
    height: 120,
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 16,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  devicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    padding: 5,
  },
  sensorTypes: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sensorTypeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  selectedSensorType: {
    backgroundColor: '#000',
  },
  sensorTypeText: {
    color: '#666',
  },
  selectedSensorTypeText: {
    color: '#fff',
  },
  sensorsSection: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
});