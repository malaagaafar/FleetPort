import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import MapView, { Marker } from 'react-native-maps';
import { useCallback, useEffect, useState } from 'react'; // استيراد useState
import api from '@/config/api';
import { RefreshControl } from 'react-native'; // أضف هذا الاستيراد



export default function HomeScreen() {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]); // الحالة لتخزين بيانات المركبات
  const [vehicleLocations, setVehicleLocations] = useState([]);
  const [addresses, setAddresses] = useState({});
  //const [refreshing, setRefreshing] = useState(false);

  const fetchDrivers = async () => {
    try {
      //const response = await api.get(`/drivers/company?userId=${userId}`);
      //setDrivers(response.data);
      //console.log("res", response.data);
      const response = await api.get(`/assignments/assigned-driver-vehicles?userId=${userId}`);
      setDrivers(response.data);
      //console.log("ass", response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

const fetchVehicles = async () => {
    try {
      //const response = await api.get(`/vehicles?userId=${userId}`); // إضافة معرف المستخدم في الطلب
      //setVehicles(response.data); // تخزين البيانات في الحالة
      //console.log(response.data);
      const response = await api.get(`/assignments/assigned-vehicle-devices?userId=${userId}`); // إضافة معرف المستخدم في الطلب
      setVehicles(response.data); // تخزين البيانات في الحالة
      //console.log(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchVehicleLocations = async () => {
    try {
      const response = await api.get(`/locations/vehicle-locations?userId=${userId}`);
      setVehicleLocations(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching vehicle locations:', error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
    fetchVehicleLocations();

    // تحديث المواقع كل دقيقة
    const locationInterval = setInterval(fetchVehicleLocations, 60000);
    return () => clearInterval(locationInterval);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
        for (const vehicle of vehicleLocations) {
            if (vehicle.coordinate?.latitude && vehicle.coordinate?.longitude) {
                try {
                    const response = await api.get(`/locations/address?latitude=${vehicle.coordinate.latitude}&longitude=${vehicle.coordinate.longitude}`);
                    setAddresses(prev => ({
                        ...prev,
                        [vehicle.id]: response.data.address
                    }));
                } catch (error) {
                    console.error('Error fetching address:', error);
                }
            }
        }
    };

    if (vehicleLocations?.length > 0) {
        fetchAddresses();
    }
}, [vehicleLocations]);

  const onRefresh = useCallback(async () => {
    //setRefreshing(true);
    try {
      // إعادة تحميل البيانات
      //await fetchVehicles();
      await fetchDrivers();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      //setRefreshing(false);
    }
  }, [userId]);


  
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active':
      return { borderColor: '#4CD964' }; // لون الحدود للمركبة النشطة
    case 'warning':
      return { borderColor: 'red' }; // لون الحدود للمركبة التي بها تحذير
    case 'inactive':
      return { borderColor: 'gray' }; // لون الحدود للمركبة غير النشطة
    default:
      return {};
  }
};

  const fleetSummary = {
    inactiveVehicles: 2,
    activeVehicles: 5,
    activeTrips: 4,
    alerts: 10,
    upcomingEvents: 8,
    tripRequests: 1
  };

  const vvehicles = [
    {
      id: 1,
      status: 'active',
      vehicle: 'Volvo 320C',
      location: 'GTA, North York',
      driver: 'Yasser Mohamed',
      event: 'On Trip 304',
      coordinate: {
        latitude: 43.7184,
        longitude: -79.5181
      }
    },
    {
      id: 2,
      status: 'inactive',
      vehicle: 'Mercedes 250C',
      location: 'Parking lot 1',
      driver: 'Ali Ahmed',
      event: 'Parked',
      coordinate: {
        latitude: 44.7184,
        longitude: -80.5181
      }
    }
  ];

  /*const drivers = [
    { id: 1, name: 'Yasser G.', score: 4.8 },
    { id: 2, name: 'Yasser G.', score: 4.5 },
    { id: 3, name: 'Yasser G.', score: 4.7 },
    //{ id: 4, name: 'Yasser G.', score: 4.6 }
  ];*/
  
  const maintenanceTasks = [
    {
      id: 1,
      icon: require('../../assets/icons/fuel-in.png'),
      task: 'Fuel Refill',
      vehicle: 'Volvo 320C',
      measure: '10%',
    },
    {
      id: 2,
      icon: require('../../assets/icons/oil-in.png'),
      task: 'Oil Change',
      vehicle: 'Mercedes C2',
      measure: '5%',
    },
    {
      id: 3,
      icon: require('../../assets/icons/tire-in.png'),
      task: 'Tire Alignment',
      vehicle: 'Volvo 320C',
      measure: '-0.5°, 4.0°, 0.15°, 1/16 inch',
    },
  ];

  
  const maintenanceIcons = [
    { id: 1, badge: 2, icon: require('../../assets/icons/car-oil-in.png') },
    //{ id: 2, badge: 2, icon: require('../../assets/icons/diy.png') },
    { id: 2, badge: 2, icon: require('../../assets/icons/fuel.png') },
    { id: 3, badge: 2, icon: require('../../assets/icons/car-engine.png') },
    { id: 4, badge: 2, icon: require('../../assets/icons/disc-brake.png') },
    { id: 5, badge: 1, icon: require('../../assets/icons/temperature-in.png') },
    { id: 6, badge: 1, icon: require('../../assets/icons/electric-service-in.png') },
    //{ id: 8, badge: 1, icon: require('../../assets/icons/gauge.png') },
    { id: 7, badge: 1, icon: require('../../assets/icons/condenser-coil.png') },
    { id: 8, badge: 1, icon: require('../../assets/icons/car-battery.png') },
    { id: 9, badge: 3, icon: require('../../assets/icons/schedule.png') },
    //{ id: 10, badge: 3, icon: require('../../assets/icons/inspection-in.png') },
    { id: 11, badge: 3, icon: require('../../assets/icons/compressor.png') },
    { id: 12, badge: 3, icon: require('../../assets/icons/monitoring.png') },
    { id: 13, badge: 3, icon: require('../../assets/icons/steering-wheel-in.png') },
  ];

  const financialData = [
    { id: 1, label: 'Total Revenue', value: '$50,000' },
    { id: 2, label: 'Expenses', value: '$20,000' },
    { id: 3, label: 'Net Profit', value: '$30,000' },
    { id: 4, label: 'Outstanding Invoices', value: '$5,000' },
  ];

  const renderMaintenanceReport = () => (
    <View style={styles.maintenanceSection}>
      <View style={styles.header}>
        <Text style={styles.maintenanceTitle}>Maintenance Report</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehiclesScroll}>
        {vehicleLocations.map((vehicle, index) => (
          <View key={index} style={styles.mvehicleCard}>
            <View style={[styles.vehicleIcon, getStatusStyle(vehicle.status)]}>
              <Image 
                source={{ uri: vehicle.vehicle_image || 'https://your-default-image.png' }} 
                style={styles.vehicleImage}
                resizeMode="cover"
              />
              {vehicle.alerts > 0 && (
                <View style={styles.alertBadge}>
                  <Text style={styles.alertCount}>{vehicle.alerts}</Text>
                </View>
              )}
            </View>
            <View style={styles.mvehicleInfo}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleDetails}>
                    {vehicle.vehicle}
                  </Text>
            </View>
          </View>
        ))}
        {/* Add Vehicle Button */}
        <TouchableOpacity style={styles.mvehicleCard} onPress={() => router.push('/AddVehicle')}>
          <View style={styles.mvehicleIcon}>
            <MaterialIcons name="add" size={30} color="#000" />
          </View>
          <View style={styles.mvehicleInfo}>
            <Text style={styles.vehicleName}>Add Vehicle</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.iconsContainer}>
        <View style={styles.iconRow}>
          {maintenanceIcons.slice(0, 4).map((item) => (
            <TouchableOpacity key={item.id} style={styles.iconWrapper}>
              <View style={styles.iconBox}>
                <Image source={item.icon} style={styles.maintenanceIcon} />
                {item.badge > 0 && (
                  <View style={styles.redBadge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
  
        <View style={styles.iconRow}>
          {maintenanceIcons.slice(4, 8).map((item) => (
            <TouchableOpacity key={item.id} style={styles.iconWrapper}>
              <View style={styles.iconBox}>
                <Image source={item.icon} style={styles.maintenanceIcon} />
                {item.badge > 0 && (
                  <View style={styles.redBadge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
  
        <View style={styles.iconRow}>
          {maintenanceIcons.slice(8, 12).map((item) => (
            <TouchableOpacity key={item.id} style={styles.iconWrapper}>
              <View style={styles.iconBox}>
                <Image source={item.icon} style={styles.maintenanceIcon} />
                {item.badge > 0 && (
                  <View style={styles.redBadge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
  
      <ScrollView style={styles.tasksContainer} showsVerticalScrollIndicator={false}>
        {maintenanceTasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskLeft}>
              <View style={styles.taskIconContainer}>
                <Image source={task.icon} style={styles.taskIcon} />
              </View>
              <View style={styles.taskDetails}>
                <View style={styles.taskRow}>
                  <Text style={styles.label}>Task:</Text>
                  <Text style={styles.value}>{task.task}</Text>
                </View>
                <View style={styles.taskRow}>
                  <Text style={styles.label}>Vehicle:</Text>
                  <Text style={styles.value}>{task.vehicle}</Text>
                </View>
                <View style={styles.taskRow}>
                  <Text style={styles.label}>Measure:</Text>
                  <Text style={styles.value}>{task.measure}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.scheduleButton}>
              <Image 
                source={require('@/assets/icons/add-event-in.png')} 
                style={styles.scheduleIcon} 
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderFinancialReport = () => (
    <View style={styles.financialSection}>
      <Text style={styles.fsectionTitle}>Financial Report</Text>
      <View style={styles.financialGrid}>
        {financialData.map((item) => (
          <View key={item.id} style={styles.financialItem}>
            <Text style={styles.financialLabel}>{item.label}</Text>
            <Text style={styles.financialValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
      <ScrollView style={styles.container}>
      {/* Fleet Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Fleet Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>2</Text>
            <Text style={styles.summaryLabel}>Inactive{'\n'}Vehicles</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>5</Text>
            <Text style={styles.summaryLabel}>Active{'\n'}Vehicles</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>4</Text>
            <Text style={styles.summaryLabel}>Active{'\n'}Trips</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>10</Text>
            <Text style={styles.summaryLabel}>Alerts</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>8</Text>
            <Text style={styles.summaryLabel}>Upcoming{'\n'}Events</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>1</Text>
            <Text style={styles.summaryLabel}>Trip{'\n'}Request</Text>
          </View>
        </View>
      </View>

      {/* Map and Vehicles List Container */}
      <View style={styles.mapAndListContainer}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 43.7,
              longitude: -79.42,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {vehicleLocations?.map((vehicle) => {
              console.log('Rendering vehicle:', vehicle);
              return vehicle.coordinate?.latitude && vehicle.coordinate?.longitude ? (
                <Marker
                  key={vehicle.id}
                  coordinate={{
                    latitude: Number(vehicle.coordinate.latitude),
                    longitude: Number(vehicle.coordinate.longitude)
                  }}
                  title={vehicle.name}
                  description={`${vehicle.vehicle} - ${vehicle.plateNumber}`}
                >
                  <View style={[
                    styles.markerContainer, 
                    { borderColor: vehicle.status === 'online' ? '#4CD964' : '#999' }
                  ]}>
                    <Image 
                      source={{ uri: vehicle.vehicle_image || 'https://your-default-image.png' }} 
                      style={styles.markerIcon}
                    />
                  </View>
                </Marker>
              ) : null;
            })}
          </MapView>
        </View>

        {/* Vehicles List */}
        <View style={styles.vehiclesSection}>
          {vehicleLocations?.map(vehicle => (
           /* <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
              <View style={styles.vehicleStatusContainer}>
                <View style={[styles.statusIndicator, 
                  { backgroundColor: vehicle.status === 'active' ? '#4CAF50' : '#999' }]} />
                <Text style={styles.statusText}>{vehicle.status}</Text>
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleDetail}>Vehicle: {vehicle.vehicle}</Text>
                <Text style={styles.vehicleDetail}>Location: {vehicle.location}</Text>
                <Text style={styles.vehicleDetail}>Driver: {vehicle.driver}</Text>
                <Text style={styles.vehicleDetail}>Event: {vehicle.event}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>*/
            <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleInfo}>
              <View style={styles.statusIconsContainer}>
              <View style={[styles.statusIconContainer,
                { borderColor: vehicle.status === 'online' ? '#4CD964' : '#999',
                  borderWidth: vehicle.status === 'online' ? 1.5 : 0.5}]}>
              <Image 
                source={{ uri: vehicle.vehicle_image || 'https://your-default-image.png' }} 
                style={styles.statusIcon}
                />
                </View>
                {/*<View style={[styles.statusIndicator, 
                  { backgroundColor: vehicle.status === 'active' ? '#4CAF50' : '#999' }]} />*/}
              </View>
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Vehicle:</Text>
                  <Text style={styles.value}>
                    {vehicle.name} 
                    {'\n'}
                    <Text style={styles.vvehicleDetails}>
                      {vehicle.vehicle}
                    </Text>
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.value}>
                    {addresses[vehicle.id] || 'Loading address...'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Driver:</Text>
                  <Text style={styles.value}>{vehicle.driver}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Event:</Text>
                  <Text style={styles.value}>{vehicle.event}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.arrowContainer}>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Driver Score Section */}
      <View style={styles.driversSection}>
        <Text style={styles.driverScoreTitle}>Driver Score: <Text style={styles.driverScoreHint}>select a driver to show their score:</Text></Text>
        {/*<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.driversScroll}>
          {drivers.map(driver => (
            <View key={driver.id} style={styles.driverScore}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverInitial}>{driver.name[0]}</Text>
              </View>
              <Text style={styles.driverName}>{driver.name}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addDriverButton}>
            <MaterialIcons name="add" size={24} color="#007AFF" />
            <Text style={styles.addDriverText}>Add Driver</Text>
          </TouchableOpacity>
        </ScrollView>*/}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.driversScroll}>
            {drivers.map((driver, index) => (
              <View key={index} style={styles.driverCard}>
                <View style={[styles.driverIcon, getStatusStyle(driver.status)]}>
                  <Image 
                    source={{ uri: driver.profile_image || 'https://your-default-image.png' }}
                    style={styles.driverImage}
                  /> 
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>
                    {driver.first_name} {driver.last_name}
                  </Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.adddriverCard} onPress={() => router.push('/AddDriver')}>
              <View style={[styles.adddriverIcon]}>
                <MaterialIcons name="add" size={30} color="#000" />
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.adddriverName}>Add Driver</Text>
              </View>
            </TouchableOpacity>
        </ScrollView>
      </View>

      {renderMaintenanceReport()}
      {renderFinancialReport()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    vehiclesScroll: {
      marginBottom: 16,
    },
    mvehicleCard: {
      alignItems: 'center',
      marginRight: 15,
      width: 85,
    },
    vehicleIcon: {
      width: 65,
      height: 65,
      borderRadius: 32.5,
      borderWidth: 1.5,
      borderColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      overflow: 'hidden',
      marginBottom: 4,
    },
    mvehicleIcon: {
      width: 65,
      height: 65,
      borderRadius: 32.5,
      borderWidth: 1.5,
      borderColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      overflow: 'hidden',
      marginBottom: 4,
    },
    vehicleImage: {
      width: '75%',
      height: '75%',
    },
    alertBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: 'red',
      borderRadius: 10,
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    alertCount: {
      color: '#fff',
      fontSize: 11,
      fontWeight: 'bold',
    },
    vehicleInfo: {
      alignItems: 'center',
      marginTop: 6,
    },
    vehicleName: {
      fontSize: 13,
      fontWeight: '600',
      color: '#000',
      textAlign: 'center',
      marginBottom: 2,
    },
    vehicleDetails: {
      fontSize: 11,
      color: '#666',
      textAlign: 'center',
    },
    vvehicleDetails: {
      fontSize: 9,
      color: '#666',
      textAlign: 'left',
    },
    deviceInfo: {
      marginTop: 4,
      padding: 4,
      backgroundColor: '#f0f8ff',
      borderRadius: 4,
    },
    deviceName: {
      fontSize: 13,
      color: '#0066CC',
      textAlign: 'center',
      fontWeight: '500',
    },
    serialNumber: {
      fontSize: 12,
      color: '#666',
      textAlign: 'center',
    },
    noDevice: {
      fontSize: 13,
      color: '#999',
      textAlign: 'center',
      marginTop: 4,
    },
  driverCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 120,
  },
  adddriverCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 120,
    //paddingTop: 5,
  },
  driverImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#eee',
  },
  driverInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  adddriverName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  driversScroll: {
      flexDirection: 'row',
    },
    driverIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    adddriverIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      //borderWidth: 1,
      //borderColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F2F2F2',
      overflow: 'hidden',
    },
    assignedVehicleInfo: {
      marginTop: 4,
      padding: 4,
      backgroundColor: '#f0f8ff',
      borderRadius: 4,
    },
    assignedVehicleName: {
      fontSize: 13,
      color: '#0066CC',
      fontWeight: '500',
      textAlign: 'center',
    },
    assignedVehiclePlate: {
      fontSize: 12,
      color: '#666',
      textAlign: 'center',
    },
    noAssignedVehicle: {
      fontSize: 13,
      color: '#999',
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 4,
    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  summarySection: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 9,
  },
  fsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
    marginLeft: 0,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 5,
    paddingBottom: 0,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  mapAndListContainer: {
    //backgroundColor: '#E7EEF5',
    borderRadius: 12,
    margin: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  mapContainer: {
    height: 200,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  vehiclesSection: {
    padding: 10,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 2,
    //marginRight: 20,
    width: '100%',
    borderWidth: 0.2,
    borderColor: '#E7EEF5',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconsContainer: {
    width: 56,
    height: 56,
    //borderRadius: 30,
    //backgroundColor: '#fff',
    //borderWidth: 1,
    //borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    //marginRight: 16,
    marginBottom: 5,
  },
  statusIcon: {
    width: "75%",
    height: "75%",
    //tintColor: '#fff',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 70,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  arrowContainer: {
    padding: 8,
  },
  arrowText: {
    color: '#666',
    fontSize: 18,
  },
  vehicleStatusContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  mvehicleInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  vehicleDetail: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  driversSection: {
    padding: 15,
    marginLeft: 15,
    marginBottom: 5,
  },
  driverScoreTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
  },
  driverScoreHint: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  driversScroll: {
    flexDirection: 'row',
  },
  driverScore: {
    alignItems: 'center',
    marginRight: 20,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  driverInitial: {
    fontSize: 18,
    fontWeight: '600',
  },
  addDriverButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addDriverText: {
    color: '#007AFF',
    fontSize: 12,
    marginTop: 4,
  },
  maintenanceSection: {
    padding: 15,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  maintenanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    marginBottom: 5,
  },
  iconsContainer: {
    //marginBottom: 20,
    padding: 20,
    paddingBottom: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maintenanceIcon: {
    width: 30,
    height: 30,
  },
  redBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  tasksContainer: {
    maxHeight: 300,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 10,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    width: '100%', // تأكيد على العرض الكامل
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconContainer: {
    width: 48,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskIcon: {
    width: 24,
    height: 24,
  },
  taskDetails: {
    flex: 1,
  },
  taskRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },

  scheduleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00.',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleIcon: {
    width: 24,
    height: 24,
  },
  financialSection: {
    padding: 25,
    marginBottom: 5,
    marginTop: 8,
    paddingTop: 5,
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  financialItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  financialLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
  },
  markerIcon: {
    width: 20,
    height: 20,
  },
});