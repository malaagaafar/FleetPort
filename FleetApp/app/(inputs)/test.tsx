import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import api from '../../config/api';
import { addToCart } from '../../store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { TypeSelectorModal } from '../../components/TypeSelectorModal';

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

export default function DevicesScreen() {
  const dispatch = useDispatch();
  const [primaryDevices, setPrimaryDevices] = useState<Device[]>([]);
  const [sensors, setSensors] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState('');
  const [trailerType, setTrailerType] = useState('');
  const [selectedSensorType, setSelectedSensorType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
  const [isTrailerModalVisible, setIsTrailerModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Get Devices'); // الحالة لتتبع التبويب النشط

  const sensorTypes = ['All', 'Temperature', 'Door', 'Fuel', 'Weight', 'Camera'];
  const vehicleTypes = [
    'Truck',
    'Van',
    'Pickup',
    'Tanker',
    'Trailer',
    'Car',
    'Bus',
];
  const trailerTypes = [
    'Flatbed',
    'Box',
    'Refrigerated',
    'Tanker',
    'Lowboy',
];;

  const handleSearch = async () => {
    if (!vehicleType || !trailerType) {
      setError('Please select both vehicle and trailer type');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/devices', {
        params: {
          category: 'primary_devices',
          vehicleType: vehicleType.toLowerCase(), // تحويل إلى أحرف صغيرة
          trailerType: trailerType.toLowerCase()
        }
      });
      
      if (response.data?.devices) {
        setPrimaryDevices(response.data.devices);
      } else {
        setError('No data received from server');
      }
    } catch (err) {
      setError('حدث خطأ في جلب البيانات');
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSensors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get('/devices/sensors', {
        params: {
          category: 'sensors',
          type: selectedSensorType !== 'All' ? selectedSensorType.toLowerCase() : undefined
        }
      });
  
      if (res.data?.devices) {
        setSensors(res.data.devices);
      } else {
        setError('No data received from server');
      }
    } catch (err) {
      setError('حدث خطأ في جلب المستشعرات');
      console.error('Error fetching sensors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleType && trailerType) {
      fetchSensors();
    }
  }, [selectedSensorType]);
  
  const renderHeader = () => (
    <View style={styles.container}>
          <View style={styles.tabsContainer}>
          {['Get Devices', 'Your Devices'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab ? styles.activeTab : styles.inactiveTab]} // تمييز التبويب النشط
              onPress={() => setActiveTab(tab)} // تحديث الحالة عند الضغط
            >
              <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
          </View>

      <View style={styles.typeSelectors}>
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Vehicle Type</Text>
          <TouchableOpacity 
            style={[
              styles.selector,
              !vehicleType && styles.selectorEmpty
            ]}
            onPress={() => setIsVehicleModalVisible(true)}
          >
            <Text style={!vehicleType ? styles.placeholderText : styles.selectedText}>
              {vehicleType || 'Select vehicle type'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Trailer</Text>
          <TouchableOpacity 
            style={[
              styles.selector,
              !trailerType && styles.selectorEmpty
            ]}
            onPress={() => setIsTrailerModalVisible(true)}
          >
            <Text style={!trailerType ? styles.placeholderText : styles.selectedText}>
              {trailerType || 'Select trailer type'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.searchButton,
          (!vehicleType || !trailerType) && styles.searchButtonDisabled
        ]}
        onPress={() => {
          handleSearch();
          fetchSensors();
        }}
        disabled={!vehicleType || !trailerType}
      >
        <Text style={styles.searchButtonText}>Get Devices</Text>
      </TouchableOpacity>

      <TypeSelectorModal
        visible={isVehicleModalVisible}
        onClose={() => setIsVehicleModalVisible(false)}
        data={vehicleTypes}
        onSelect={setVehicleType}
        title="Select Vehicle Type"
      />
      <TypeSelectorModal
        visible={isTrailerModalVisible}
        onClose={() => setIsTrailerModalVisible(false)}
        data={trailerTypes}
        onSelect={setTrailerType}
        title="Select Trailer Type"
      />
    </View>
  );

  const renderDeviceCard = (device: Device) => (
    <TouchableOpacity
      key={device.id}
      style={styles.deviceCard}
      onPress={() => router.push({
        pathname: `/devices/${device.id}`,
        params: {
          device: JSON.stringify(device)
        }
      })}>
      <Image
        source={{ uri: device.imageUrl }}
        style={styles.deviceImage}
        resizeMode="cover"
      />
      <Text style={styles.deviceName}>{device.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.devicePrice}>${device.price}</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => dispatch(addToCart({
            id: device.id.toString(),
            name: device.name,
            price: device.price,
            image: { uri: device.imageUrl },
            quantity: 1
          }))}
        >
          <Ionicons name="cart-outline" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderPrimaryDevices = () => {
    if (primaryDevices.length === 0)     return (
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Primary Devices</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.noDataContainer}>
          <Text>No available devices for the selected types</Text>
        </View>
      </View>
    );
  
    return (
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Primary Devices</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.devicesGrid}>
          {primaryDevices.map(device => renderDeviceCard(device))}
        </View>
      </View>
    );
  };

  const renderSensorsSection = () => {
    if (sensors.length === 0) {
      return (
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
              <Text style={[
                styles.sensorTypeText,
                selectedSensorType === type && styles.selectedSensorTypeText
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.noDataContainer}>
          <Text>No available sensors for the selected type</Text>
        </View>
      </View>
    );
    }

    return (
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
              <Text style={[
                styles.sensorTypeText,
                selectedSensorType === type && styles.selectedSensorTypeText
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.devicesGrid}>
          {sensors.map(renderDeviceCard)}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!loading && !error && (primaryDevices.length > 0 || sensors.length > 0) && (
        <View style={styles.devicesContainer}>
          {renderPrimaryDevices()}
          {renderSensorsSection()}
        </View>
      )}
      {!vehicleType || !trailerType && !loading && !error && primaryDevices.length === 0 && sensors.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text>Select Vehicle and Trailer Type</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // توزيع علامات التبويب بالتساوي
    width: '100%',
    backgroundColor: '#fff', // لون خلفية علامات التبويب
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // لون الحدود السفلية
    borderTopWidth: 1,
    borderTopColor: '#ccc', // لون الحدود السفلية
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    backgroundColor: '#000', // لون خلفية التبويب النشط
  },
  inactiveTab: {
    backgroundColor: '#fff', // لون خلفية التبويب غير النشط
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff', // لون النص للتبويب النشط
  },
  inactiveTabText: {
    color: '#000', // لون النص للتبويب غير النشط
  },
  devicesContainer: {
    flex: 1,
    padding: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
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
  selectorEmpty: {
    borderColor: '#ccc',
  },
  placeholderText: {
    color: '#666',
  },
  selectedText: {
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
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
    paddingHorizontal: 0,
    marginTop: 10,
  },
});