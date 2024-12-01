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
  StatusBar,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import api from '../../config/api';
import { addToCart } from '../../store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { TypeSelectorModal } from '../../components/TypeSelectorModal';
import { RootState } from '@/store/store';
import { useQuery, useQueryClient } from '@tanstack/react-query';


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
  serial_number: string;
  isConnecting?: boolean;
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
  const [isConnected, setIsConnected] = useState(false); // حالة للتحكم في زر الربط
  const [connectingDevices, setConnectingDevices] = useState<{ [key: string]: boolean }>({});

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


  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const queryClient = useQueryClient();
  
    const { 
      data: purchasedDevices = [], 
      isLoading: devicesLoading,
      error: devicesError
    } = useQuery({
      queryKey: ['purchasedDevices', userId],
      queryFn: async () => {
        const response = await api.get('/purchase/purchased-devices', { 
          params: { userId } 
        });
        return Array.isArray(response.data?.data) ? 
          response.data.data : 
          (response.data?.data ? [response.data.data] : []);
      },
      enabled: activeTab === 'Your Devices' && !!userId,
      staleTime: 30000, // البيانات تبقى صالحة لمدة 30 ثانية
      cacheTime: 5 * 60 * 1000, // تبقى في الذاكرة لمدة 5 دقائق
      refetchOnWindowFocus: false, // لا تعيد الطلب عند التركيز على النافذة
      refetchOnMount: false, // لا تعيد الطلب عند تركيب المكون
    });
  
    const { 
      data: purchasedSensors = [], 
      isLoading: sensorsLoading,
      error: sensorsError
    } = useQuery({
      queryKey: ['purchasedSensors', userId],
      queryFn: async () => {
        const response = await api.get('/purchase/purchased-sensors', { 
          params: { userId } 
        });
        return Array.isArray(response.data?.data) ? 
          response.data.data : 
          (response.data?.data ? [response.data.data] : []);
      },
      enabled: activeTab === 'Your Devices' && !!userId,
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

    const handleRefresh = () => {
      if (activeTab === 'Your Devices' && userId) {
        queryClient.invalidateQueries({ queryKey: ['purchasedDevices', userId] });
        queryClient.invalidateQueries({ queryKey: ['purchasedSensors', userId] });
      }
    };
    const handleConnectToTraccar = async (serialNumber: string) => {
      try {
        setConnectingDevices(prev => ({ ...prev, [serialNumber]: true }));
        await api.post('/devices/connect-traccar', { serialNumber });
        
        // إعادة تحميل البيانات مباشرة
        await queryClient.invalidateQueries(['purchasedDevices', userId]);
        Alert.alert('نجاح', 'تم ربط الجهاز بنظام التتبع بنجاح');
      } catch (error: any) {
        Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ أثناء ربط الجهاز');
      } finally {
        setConnectingDevices(prev => ({ ...prev, [serialNumber]: false }));
      }
    };


const renderTabs = () => (
  <View style={styles.header}>
      <View style={styles.tabsContainer}>
          {['Get Devices', 'Your Devices'].map((tab) => (
              <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab ? styles.activeTab : styles.inactiveTab]}
                  onPress={() => {
                      console.log('Tab pressed:', tab);
                      setActiveTab(tab);
                  }}
              >
                  <Text style={[
                      styles.tabText, 
                      activeTab === tab ? styles.activeTabText : styles.inactiveTabText
                  ]}>
                      {tab}
                  </Text>
              </TouchableOpacity>
          ))}
      </View>
  </View>
);

const fetchPurchasedItems = async () => {
  try {
      setLoading(true);
      console.log('Making API calls...');

      const [devicesResponse, sensorsResponse] = await Promise.all([
          api.get('/purchase/purchased-devices', { 
              params: { userId }
          }),
          api.get('/purchase/purchased-sensors', { 
              params: { userId }
          })
      ]);

      // تصحيح تنسيق البيانات - نأخذ المصفوفة الأولى فقط إذا كانت موجودة
      const devices = Array.isArray(devicesResponse.data?.data) ? 
          devicesResponse.data.data : 
          (devicesResponse.data?.data ? [devicesResponse.data.data] : []);

      const sensors = Array.isArray(sensorsResponse.data?.data) ? 
          sensorsResponse.data.data : 
          (sensorsResponse.data?.data ? [sensorsResponse.data.data] : []);

  } catch (err: any) {
      console.error('API Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'حدث خطأ في جلب البيانات');
  } finally {
      setLoading(false);
  }
};

const renderPurchasedDeviceCard = (device: any) => {
  const uniqueKey = `device-${device.id}-${device.first_purchase_date}`;
  const isConnecting = connectingDevices[device.serial_number];

  return (
    <TouchableOpacity
      key={uniqueKey}
      style={styles.deviceCard}
    >
      <Image
        source={{ uri: device.image_url }}
        style={styles.deviceImage}
        resizeMode="cover"
      />
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceDetails}>
          {device.manufacturer} - {device.model}
        </Text>
        <View style={styles.serialNumberContainer}>
          <Text style={styles.serialLabel}>الرقم التسلسلي:</Text>
          <Text style={styles.serialNumber}>{device.serial_number}</Text>
        </View>
        <View style={styles.assignmentInfo}>
          <Text style={styles.assignmentStatus}>
            الحالة: {device.assigned_to_vehicle ? 'مرتبط' : 'غير مرتبط'}
          </Text>
          {device.assigned_to_vehicle && device.vehicle_plate_number && (
            <Text style={styles.assignedDevice}>
              مرتبط بالمركبة: {device.vehicle_name}{'\n'}
              رقم اللوحة: {device.vehicle_plate_number}
            </Text>
          )}
          {!device.assigned_to_vehicle && (
            <TouchableOpacity
              style={styles.assignButton}
              onPress={() => router.push({
                pathname: '/assign/DeviceAssign',
                params: {
                  deviceSerial: device.serial_number,
                  deviceType: device.type
                }
              })}
            >
              <Text style={styles.assignButtonText}>ربط بمركبة</Text>
            </TouchableOpacity>
          )}

        </View>
        <View style={styles.traccarStatus}>
          <Text style={styles.statusLabel}>
            حالة التتبع: {device.traccar_id ? 'متصل' : 'غير متصل'}
          </Text>
          
          {!device.traccar_id && (
            <TouchableOpacity
              style={[styles.connectButton, isConnecting && styles.disabledButton]}
              disabled={isConnecting}
              onPress={() => handleConnectToTraccar(device.serial_number)}
            >
              <Text style={styles.connectButtonText}>
                {isConnecting ? 'جاري الربط...' : 'Connect'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>
            {device.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const renderPurchasedSensorCard = (sensor: any) => {
  // نفترض أن كل مستشعر له رقم تسلسلي واحد الآن
  const uniqueKey = `sensor-${sensor.id}-${sensor.first_purchase_date}-${sensor.serial_number}`;
  
  return (
    <TouchableOpacity
      key={uniqueKey}
      style={styles.deviceCard}
    >
      <Image
        source={{ uri: sensor.image_url }}
        style={styles.deviceImage}
        resizeMode="cover"
      />
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{sensor.name}</Text>
        <Text style={styles.deviceDetails}>
          {sensor.manufacturer} - {sensor.model}
        </Text>
        <View style={styles.serialNumberContainer}>
          <Text style={styles.serialLabel}>الرقم التسلسلي:</Text>
          <Text style={styles.serialNumber}>{sensor.serial_number}</Text>
        </View>
        <View style={styles.assignmentInfo}>
          <Text style={styles.assignmentStatus}>
            الحالة: {sensor.assigned ? 'مرتبط' : 'غير مرتبط'}
          </Text>
          {sensor.assigned && sensor.device_serial_number && (
            <Text style={styles.assignedDevice}>
              مرتبط بالجهاز: {sensor.device_serial_number}
            </Text>
          )}
          {!sensor.assigned && (
            <TouchableOpacity
              style={styles.assignButton}
              onPress={() => router.push({
                pathname: '/assign/SensorAssign',
                params: {
                  sensorSerial: sensor.serial_number,
                  sensorType: sensor.type
                }
              })}
            >
              <Text style={styles.assignButtonText}>ربط بجهاز</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>
            {sensor.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const renderContent = () => {
  if (activeTab === 'Your Devices') {
    if (devicesLoading || sensorsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>جاري تحميل الأجهزة...</Text>
        </View>
      );
    }

    if (devicesError || sensorsError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {devicesError?.message || sensorsError?.message || 'حدث خطأ في جلب البيانات'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              queryClient.invalidateQueries(['purchasedDevices', userId]);
              queryClient.invalidateQueries(['purchasedSensors', userId]);
            }}
          >
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const hasDevices = purchasedDevices.length > 0;
    const hasSensors = purchasedSensors.length > 0;

    if (!hasDevices && !hasSensors) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>لا توجد أجهزة أو مستشعرات مشتراة</Text>
        </View>
      );
    }

    return (
      // تحديث renderContent لاستخدام الدالتين الجديدتين
      <ScrollView style={styles.devicesContainer}>
        {hasDevices && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الأجهزة المشتراة</Text>
            <View style={styles.devicesGrid}>
              {purchasedDevices.map(device => renderPurchasedDeviceCard(device))}
            </View>
          </View>
        )}
        
        {hasSensors && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المستشعرات المشتراة</Text>
            <View style={styles.devicesGrid}>
              {purchasedSensors.map(sensor => renderPurchasedSensorCard(sensor))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
  return null;
};

  // تعديل معالج تغيير التبويب
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'Your Devices') {
      fetchPurchasedItems();
    }
  };



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
    <View style={styles.header}>
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
      <View style={styles.subheader}>
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
            quantity: 1,
            category: device.category
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
      <StatusBar barStyle='default' backgroundColor="#000" />
      {(activeTab=== 'Your Devices') && (
        <View style={styles.header}>
          {renderTabs()}
          {renderContent()}
        </View>
      )}
      {(activeTab=== 'Get Devices') && renderHeader()}
      {(activeTab=== 'Get Devices') && loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      )}
      {(activeTab=== 'Get Devices') && error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {(activeTab=== 'Get Devices') && !loading && !error && (primaryDevices.length > 0 || sensors.length > 0) && (
        <View style={styles.devicesContainer}>
          {renderPrimaryDevices()}
          {renderSensorsSection()}
        </View>
      )}
      {(activeTab === 'Get Devices') && (!vehicleType || !trailerType) && !loading && !error && primaryDevices.length === 0 && sensors.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text>Select Vehicle and Trailer Type</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  traccarStatus: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  connectButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  traccarInfo: {
    marginTop: 8,
  },
  traccarStatusText: {
    fontSize: 14,
    color: '#666',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // توزيع علامات التبويب بالتساوي
    width: '100%',
    backgroundColor: '#fff', // لون خلفية علامات التبويب
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // لون الحدود السفلية
    borderTopWidth: 1,
    borderTopColor: '#ccc', // لون الحدود السفلية
    //margin: 0, // إزالة الهوامش
    //padding: 0, // إزالة الحشو
    
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
    padding: 0,
    margin: 0, // تأكد من عدم وجود هوامش

  },
  subheader: {
    padding: 15,
    margin: 0, // تأكد من عدم وجود هوامش

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
    marginBottom: 15,
    marginTop: 5,

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
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF', // لون الخلفية
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // لون النص
    fontSize: 16,
  },
  deviceInfo: {
    padding: 10,
},
deviceDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
},
typeContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
},
typeText: {
    fontSize: 12,
    color: '#444',
},
section: {
    marginBottom: 20,
},

  loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
  },
  retryButton: {
      backgroundColor: '#0066CC',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
  },
  retryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
  },
  noDataText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  list: {
    paddingVertical: 8,
  },
  deviceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceSerial: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  serialNumberContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  serialLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  serialNumber: {
    fontSize: 14,
    color: '#0066CC',
    marginTop: 4,
  },
  assignmentInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f0f7ff',
    borderRadius: 4,
  },
  assignmentStatus: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  assignedDevice: {
    fontSize: 14,
    color: '#0066CC',
    marginTop: 4,
    textAlign: 'right',
  },
  assignButton: {
    backgroundColor: '#0066CC',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});