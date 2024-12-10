import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; // استيراد useRouter
import { useCallback, useEffect, useState } from 'react'; // استيراد useState
import api from '@/config/api';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Image } from 'react-native'; // تأكد من استيراد Image
import { RefreshControl } from 'react-native'; // أضف هذا الاستيراد
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';


export default function ManageScreen() {
  const router = useRouter(); // استخدام useRouter
  const [activeTab, setActiveTab] = useState('Trips'); // الحالة لتتبع التبويب النشط
  const [vehicles, setVehicles] = useState([]); // الحالة لتخزين بيانات المركبات
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [driversAssignment, setDriversAssignment] = useState([]);
  const [trips, setTrips] = useState({
    upcoming: [],
    active: [],
    history: []
  });
  interface MaintenanceService {
    id: number;
    type: string;
    vehicle_name: string;
    scheduled_date: string;
    scheduled_end: string;
    status: string;
    custom_provider_name: string;
    // ... أي حقول أخرى ضرورية
  }
  interface ServicesState {
    upcoming: MaintenanceService[];
    active: MaintenanceService[];
    history: MaintenanceService[];
  }
  const [services, setServices] = useState<ServicesState>({
    upcoming: [],
    active: [],
    history: []
  });

  const getCityName = async (coordinates) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[1]}&lon=${coordinates[0]}&zoom=18&accept-language=en`
      );
      const data = await response.json();
      
      // ترتيب الأولوية من الأصغر إلى الأكبر
      return data.address.suburb || // الحي
             data.address.village || // القرية
             data.address.town || // البلدة
             data.address.city || // المدينة
             data.address.county || // المقاطعة
             data.address.state || // المحافظة/الولاية
             'Unknown';
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Unknown';
    }
  };

  // تحسين عرض النتيجة في البطاقة
  const renderLocationName = (locationKey, tripId) => {
    const name = cityNames[`${locationKey}-${tripId}`];
    if (!name) return <Text style={styles.cityName}>Loading...</Text>;
    
    return (
      <Text style={styles.cityName} numberOfLines={2} ellipsizeMode="tail">
        {name}
      </Text>
    );
  };

  // تخزين أسماء المدن في state لتجنب الطلبات المتكررة
  const [cityNames, setCityNames] = useState({});

  useEffect(() => {
    // تحديث أسماء المدن عند تغير الرحلات
    const updateCityNames = async () => {
      const newCityNames = {};
      
      for (const trip of [...trips.upcoming, ...trips.active, ...trips.history]) {
        if (!cityNames[`start-${trip.id}`]) {
          newCityNames[`start-${trip.id}`] = await getCityName(trip.start_location.coordinates);
        }
        if (!cityNames[`end-${trip.id}`]) {
          newCityNames[`end-${trip.id}`] = await getCityName(trip.end_location.coordinates);
        }
      }
      
      setCityNames(prev => ({ ...prev, ...newCityNames }));
    };
    
    updateCityNames();
  }, [trips]);

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

  const fetchTrips = async () => {
    try {
      const response = await api.get(`/trips?userId=${userId}`);
      
      // تصنيف الرحلات حسب مواعيدها
      const now = new Date();
      const categorizedTrips = response.data.reduce((acc: any, trip: any) => {
        const tripStartDate = new Date(trip.scheduled_start);
        const tripEndDate = new Date(trip.scheduled_end);
        
        if (tripStartDate > now) {
          // الرحلات التي لم يحن موعدها بعد
          acc.upcoming.push(trip);
        } else if (tripStartDate <= now && tripEndDate > now) {
          // الرحلات التي بدأت ولم تنتهي بعد
          acc.active.push(trip);
        } else if (tripEndDate <= now) {
          // الرحلات التي انتهت
          acc.history.push(trip);
        }
        
        return acc;
      }, { upcoming: [], active: [], history: [] });

      // ترتيب كل قسم حسب التاريخ
      categorizedTrips.upcoming.sort((a, b) => new Date(a.scheduled_start) - new Date(b.scheduled_start));
      categorizedTrips.active.sort((a, b) => new Date(b.scheduled_start) - new Date(a.scheduled_start));
      categorizedTrips.history.sort((a, b) => new Date(b.scheduled_end) - new Date(a.scheduled_end));

      //console.log('Categorized trips:', categorizedTrips);
      setTrips(categorizedTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/maintenance/maintenances');
      const { upcoming, active, history } = response.data.data;

      setServices({
        upcoming,
        active,
        history
      });
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'oil_change':
        return require('../../assets/icons/oil-in.png');
      case 'tire_service':
        return require('../../assets/icons/tire-in.png');
      case 'engine_service':
        return require('../../assets/icons/car-engine.png');
      default:
        return require('../../assets/icons/car-engine.png');
    }
  };

  const renderServiceCard = (service) => (
    <View style={styles.serviceCard} key={service.id}>
      <View style={styles.serviceDetails}>
        <View style={styles.serviceIconContainer}>
          <Image 
            source={getServiceIcon(service.type)}
            style={styles.serviceIcon}
          />
        </View>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>Service:</Text>
            <Text style={styles.serviceValue}>
              {service.type.replace(/_/g, ' ').toUpperCase()}
            </Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>Vehicle:</Text>
            <Text style={styles.serviceValue}>{service.vehicle_name}</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>Status:</Text>
            <Text style={styles.serviceValue}>{service.status}</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>Provider:</Text>
            <Text style={styles.serviceValue}>{service.custom_provider_name}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.serviceArrow}>
          <Text style={styles.arrowText}>▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderServiceSection = (title: string, services: MaintenanceService[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionSubtitle}>{title}</Text>
      {services.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            {title === 'Upcoming' ? 'No upcoming services' : 
             title === 'History' ? 'No services history' :
             'No active services'}
          </Text>
        </View>
      ) : (
        services.map(service => {
          const date = new Date(service.scheduled_date);
          return (
            <View key={service.id}>
              <Text style={styles.serviceDate}>
                {date.toLocaleDateString('en-US', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric'
                })} {date.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </Text>
              {renderServiceCard(service)}
            </View>
          );
        })
      )}
    </View>
  );

  const renderServicesTab = () => {
    return (
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Manage Services</Text>
        
        <View style={styles.actionButtons}>
          <View style={styles.tripButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.grayButton, styles.twoThirdButton]} 
              onPress={() => router.push('/(inputs)/ScheduleService')}
            >
              <Text style={styles.grayButtonText}>Schedule New Service</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.grayButton, styles.oneThirdButton]} 
              onPress={() => {}}
            >
              <Text style={styles.grayButtonText}>Edit Service</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.greenButton]}
            onPress={() => {}}
          >
            <Text style={styles.greenButtonText}>Start Scheduled Service</Text>
          </TouchableOpacity>
        </View>

        {renderServiceSection('Upcoming', services.upcoming)}
        {renderServiceSection('Active', services.active)}
        {renderServiceSection('History', services.history)}
      </View>
    );
  };

  useEffect(() => {
    fetchVehicles(); // استدعاء الدالة لجلب البيانات عند تحميل المكون
    if (activeTab === 'Drivers') {
      fetchDrivers();
    }
    if (activeTab === 'Trips') {
      fetchTrips();
    }
  }, [activeTab]); // [] تعني أن الدالة ستنفذ مرة واحدة عند تحميل المكون

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // إعادة تحميل البيانات
      await fetchVehicles();
      await fetchDrivers();
      await fetchTrips();
      await fetchServices();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);


  const navigateToForm = () => {
    console.log(activeTab);
    if (activeTab === 'Vehicles') {
      router.push('/(inputs)/AddVehicle'); // تغيير المسار حسب هيكل مشروعك
    } else if (activeTab === 'Drivers') {
      router.push('/(inputs)/AddDriver'); // تغيير المسار حسب هيكل مشروعك
    } else {
      router.push('/(inputs)/AddVehicle'); // تغيير المسار حسب هيكل مشروعك
    }
  };

  /*const renderVehiclesList = () => {
    return (
      <View style={styles.vehiclesListContainer}>
        {vehicles.map((vehicle, index) => (
          <View key={index} style={styles.vehicleItem}>
            <View style={[styles.vehicleIcon, getStatusStyle(vehicle.status)]}>
              {vehicle.alerts > 0 && <Text style={styles.alertCount}>{vehicle.alerts}</Text>}
              {vehicle.vehicle_image && ( // تحقق من وجود صورة المركبة
              <Image 
                  source={{ uri: vehicle.vehicle_image }} // استخدام عنوان URL للصورة
                  style={styles.vehicleImage} // إضافة نمط للصورة
                />
              )}
            </View>
            <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
          </View>
        ))}
      </View>
    );
  };*/
  
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

  const renderMaintenanceReport = () => (
    <View style={styles.maintenanceSection}>
      <View style={styles.header}>
        <Text style={styles.maintenanceTitle}>Maintenance Report</Text>
      </View>
      
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
                source={require('../../assets/icons/add-event-in.png')} 
                style={styles.scheduleIcon} 
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  const renderVehiclesTab = () => {
    return (
      <View style={styles.vehiclesSection}>
        <Text style={styles.sectionTitle}>Manage Vehicles</Text>
                
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.grayButton]} 
            onPress={navigateToForm}
          >
            <Text style={styles.grayButtonText}>Add a New Vehicle</Text>
          </TouchableOpacity>
          
          <View style={styles.greenButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.greenButton]} 
              onPress={() => router.push('/assign/DeviceVehicleAssignment')}
            >
              <Text style={styles.greenButtonText}>Assign Device to a Vehicle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.greenButton]}
              onPress={() => router.push('/assign/DriverVehicles')}
            >
              <Text style={styles.greenButtonText}>Assign Driver to a Vehicle</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionSubtitle}>Your Vehicles</Text>
            <TouchableOpacity>
              <Image 
                source={require('../../assets/icons/sort.png')}
                style={styles.moreButton}
              />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehiclesScroll}>
            {vehicles.map((vehicle, index) => (
              <View key={index} style={styles.vehicleCard}>
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
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleDetails}>
                    {vehicle.make} {vehicle.model}
                  </Text>
                  {vehicle.device_name ? (
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceName}>
                        {vehicle.device_name}
                      </Text>
                      <Text style={styles.serialNumber}>
                        {vehicle.device_serial_number}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.noDevice}>No device assigned</Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderDriversTab = () => {
    return (
      <View style={styles.driversSection}>
        <Text style={styles.sectionTitle}>Manage Drivers</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.grayButton]} 
            onPress={() => router.push('/(inputs)/AddDriver')}
          >
            <Text style={styles.grayButtonText}>Add a New Driver</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.greenButton]}
            onPress={() => router.push('/assign/DriverVehicles')}
          >
            <Text style={styles.greenButtonText}>Assign Driver to a Vehicle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionSubtitle}>Your Drivers</Text>
            <TouchableOpacity>
              <Image 
                source={require('../../assets/icons/sort.png')}
                style={styles.moreButton}
              />
            </TouchableOpacity>
          </View>
          
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
                  {driver.vehicle_name ? (
                    <View style={styles.assignedVehicleInfo}>
                      <Text style={styles.assignedVehicleName}>
                        {driver.vehicle_name}
                      </Text>
                      <Text style={styles.assignedVehiclePlate}>
                        {driver.vehicle_plate_number}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.noAssignedVehicle}>No vehicle assigned</Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const calculateProgress = async (trip) => {
    try {
      const deviceResponse = await api.get(`/device-assignments/vehicle-device/${trip.vehicle_id}`, {
        params: { userId }
      });
      
      const deviceId = deviceResponse.data.device_id;
      if (!deviceId) return null;

      const positionsResponse = await api.get(`/positions`, {
        params: {
          deviceId,
          from: trip.actual_start || trip.scheduled_start,
          to: new Date()
        }
      });

      if (positionsResponse.data.length < 2) return { distance: 0, currentLocation: null };

      const positions = positionsResponse.data;
      let totalDistance = 0;
      
      // حساب المسافة الكلية
      for (let i = 1; i < positions.length; i++) {
        const prev = positions[i - 1];
        const curr = positions[i];
        
        const R = 6371;
        const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
        const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        totalDistance += distance;
      }

      // الحصول على آخر موقع
      const lastPosition = positions[positions.length - 1];
      const currentLocation = await getCityName([lastPosition.longitude, lastPosition.latitude]);

      return { 
        distance: parseFloat(totalDistance.toFixed(2)),
        currentLocation,
        lastUpdate: new Date(lastPosition.device_time).toLocaleTimeString()
      };
    } catch (error) {
      console.error('Error calculating distance:', error);
      return null;
    }
  };

  const [tripProgress, setTripProgress] = useState({});

  useEffect(() => {
    const updateProgress = async () => {
      const newProgress = {};
      for (const trip of trips.active) {
        newProgress[trip.id] = await calculateProgress(trip);
      }
      setTripProgress(prev => ({ ...prev, ...newProgress }));
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 60000); // تحديث كل دقيقة
    return () => clearInterval(interval);
  }, [trips.active]);

  const renderTripCard = (trip) => (
    <View key={trip.id} style={styles.tripCard}>
      <View style={styles.tripDetails}>
        <View style={styles.locationContainer}>
          <View style={styles.locationPoint}>
            <Text style={styles.locationLabel}>From</Text>
            {renderLocationName('start', trip.id)}
          </View>
          <View style={styles.locationDivider} />
          <View style={styles.locationPoint}>
            <Text style={styles.locationLabel}>To</Text>
            {renderLocationName('end', trip.id)}
          </View>
        </View>
        <View style={styles.tripInfo}>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Trip:</Text>
            <Text style={styles.tripValue}>{trip.title}</Text>
          </View>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Vehicle:</Text>
            <Text style={styles.tripValue}>{trip.vehicle?.name || 'Not assigned'}</Text>
          </View>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Driver:</Text>
            <Text style={styles.tripValue}>
              {trip.driver ? `${trip.driver.first_name} ${trip.driver.last_name}` : 'Not assigned'}
            </Text>
          </View>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Status:</Text>
            <Text style={styles.tripValue}>{trip.status}</Text>
          </View>
          {trip.status === 'in_progress' || trip.status === 'scheduled' && tripProgress[trip.id] && (
            <>
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>Traveled:</Text>
                <Text style={styles.tripValue}>{`${tripProgress[trip.id].distance} km`}</Text>
              </View>
              {tripProgress[trip.id].currentLocation && (
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Current Location:</Text>
                  <Text style={styles.tripValue}>
                    {`${tripProgress[trip.id].currentLocation} (${tripProgress[trip.id].lastUpdate})`}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        <TouchableOpacity style={styles.tripArrow}>
          <Text style={styles.arrowText}>▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTripsTab = () => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // لعرض AM/PM
      });
    };

    return (
      <View style={styles.tripsSection}>
        <Text style={styles.sectionTitle}>Manage Trips</Text>
        
        <View style={styles.actionButtons}>
          <View style={styles.tripButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.grayButton, styles.twoThirdButton]} 
              onPress={() => router.push('/(inputs)/ScheduleTrip')}
            >
              <Text style={styles.grayButtonText}>Schedule a New Trip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.grayButton, styles.oneThirdButton]} 
              onPress={() => {}}
            >
              <Text style={styles.grayButtonText}>Edit Trip</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.greenButton]}
            onPress={() => {}}
          >
            <Text style={styles.greenButtonText}>Start Scheduled Trip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Upcoming Trips */}
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Upcoming</Text>
            {trips.upcoming.length > 0 ? (
              trips.upcoming.map(trip => (
                <React.Fragment key={trip.id}>
                  <Text style={styles.tripDate}>{formatDate(trip.scheduled_start)}</Text>
                  {renderTripCard(trip)}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No upcoming trips</Text>
              </View>
            )}
          </View>

          {/* Active Trips */}
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Active</Text>
            {trips.active.length > 0 ? (
              trips.active.map(trip => (
                <React.Fragment key={trip.id}>
                  <Text style={styles.tripDate}>{formatDate(trip.scheduled_start)}</Text>
                  {renderTripCard(trip)}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No active trips</Text>
              </View>
            )}
          </View>

          {/* Trip History */}
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>History</Text>
            {trips.history.length > 0 ? (
              trips.history.map(trip => (
                <React.Fragment key={trip.id}>
                  <Text style={styles.tripDate}>{formatDate(trip.scheduled_start)}</Text>
                  {renderTripCard(trip)}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No trip history</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };


  return (
    <ScrollView 
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >      
      <View style={styles.tabsContainer}>
        {['Trips', 'Vehicles', 'Drivers', 'Services'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'Trips' && renderTripsTab()}
      {activeTab === 'Vehicles' && renderVehiclesTab()}
      {activeTab === 'Vehicles' && renderMaintenanceReport()}
      {activeTab === 'Drivers' && renderDriversTab()}
      {activeTab === 'Services' && renderServicesTab()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  vehicleImage: {
    width: '75%', // اجعل الصورة تأخذ العرض الكامل
    height: '75%', // اجعل الصورة تأخذ الارتفاع الكامل
    borderRadius: 8, // إذا كنت تريد زوايا دائرية
    justifyContent: 'center',
    alignItems: 'center',
  },
  maintenanceSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
    paddingBottom: 20,
    width: '100%', // إضافة عرض كامل
    paddingHorizontal: 15, // إضافة هوامش جانبية
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 5,
  },
  maintenanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  iconsContainer: {
    marginBottom: 6,
    width: '97%', // تأكيد على العرض الكامل
    paddingHorizontal: 10, // هوامش داخلية
  },
  
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%', // تأكيد على العرض الكامل
  },
  iconWrapper: {
    padding: 4,
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    //borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.05,
    //shadowRadius: 4,
    //elevation: 2,
  },
  maintenanceIcon: {
    width: 36,
    height: 36,
  },
  redBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    width: 22,
    height: 22,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tasksContainer: {
    flex: 1,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    width: '100%', // تأكيد على العرض الكامل
  },
  taskLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  taskIconContainer: {
    width: 48,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskIcon: {
    width: 38,
    height: 36,
  },
  taskDetails: {
    flex: 1,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    width: 70,
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  scheduleButton: {
    padding: 8,
  },
  scheduleIcon: {
    width: 28,
    height: 28,
    tintColor: '#4CD964', // لون أخضر فاتح
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  inactiveTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: '#000',
  },
  maintenanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconContainer: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  iconText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksScrollView: {
    maxHeight: 300,
  },
  taskInfo: {
    flex: 1,
  },
  taskLabel: {
    width: 70,
    color: '#666',
    fontSize: 14,
  },
  taskValue: {
    flex: 1,
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 0,
    marginBottom: 15,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45,
  },
  greenButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  grayButton: {
    backgroundColor: '#F2F2F2',
    marginBottom: 12,
  },
  greenButton: {
    backgroundColor: '#4CD964',
    flex: 1,
  },
  grayButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
  },
  greenButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  vehiclesSection: {
    width: '100%',
    padding: 16,
    paddingBottom: 0,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moreButton: {
    width: 18, // عرض الصورة
    height: 18, // ارتفاع الصورة
  },
  vehiclesScroll: {
    marginBottom: 16,
  },
  vehicleCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  vehicleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#021037',
    overflow: 'hidden',
  },
  alertBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 0,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF', // لون الخلفية
    borderRadius: 5,
  },
  vehiclesList: {
    marginTop: 10,
  },
  maintenanceReport: {
    marginTop: 0,
  },
  vehiclesListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  vehicleItem: {
    alignItems: 'center',
  },
  alertCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 10,
    padding: 2,
    fontSize: 12,
  },
  vehicleName: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  driversSection: {
    width: '100%',
    padding: 16,
    paddingBottom: 500,
  },
  driverCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 120,
  },
  driverImage: {
    width: 80,
    height: 80,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#eee',
  },
  driverInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  vehicleInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
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
    //fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  driversScroll: {
    marginBottom: 16,
  },
  driverIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  tripsSection: {
    width: '100%',
    padding: 16,
    paddingBottom: 275,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tripDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tripIcon: {
    width: 30,
    height: 30,
    //tintColor: '#fff',
  },
  tripIconText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  tripInfo: {
    flex: 1,
  },
  tripRow: {
    flexDirection: 'row',
    gap: 0,
    marginBottom: 4,
  },
  tripLabel: {
    width: 65,
    fontSize: 11.5,
    color: '#666',
    fontWeight: '500',
  },
  tripValue: {
    flex: 1,
    fontSize: 11.5,
    color: '#000',
    fontWeight: '500',
  },
  tripArrow: {
    padding: 8,
  },
  arrowText: {
    color: '#5CE960',
    fontSize: 25,
  },
  tripButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  
  twoThirdButton: {
    flex: 2, // يأخذ ثلثي المساحة
  },
  
  oneThirdButton: {
    flex: 1, // يأخذ ثلث المساحة
  },
  servicesSection: {
    width: '100%',
    padding: 16,
    paddingBottom: 75,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  serviceDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceIcon: {
    width: 30,
    height: 30,
    //tintColor: '#fff',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  serviceLabel: {
    width: 70,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  serviceValue: {
    flex: 1,
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  serviceArrow: {
    padding: 8,
  },
  tripsContainer: {
    padding: 16,
    flexGrow: 1,
  },
  locationContainer: {
    width: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  locationPoint: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
  },
  coordinates: {
    fontSize: 11,
    color: '#000',
    fontWeight: '500',
  },
  locationDivider: {
    height: 20,
    width: 1,
    backgroundColor: '#ddd',
    marginVertical: 4,
  },
  cityName: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    position: 'absolute',
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyStateContainer: {
    padding: 5,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    //borderWidth: 1,
    //borderColor: '#eee',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic'
  },
});