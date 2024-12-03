import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; // استيراد useRouter
import { useCallback, useEffect, useState } from 'react'; // استيراد useState
import api from '@/config/api';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Image } from 'react-native'; // تأكد من استيراد Image
import { RefreshControl } from 'react-native'; // أضف هذا الاستيراد


export default function ManageScreen() {
  const router = useRouter(); // استخدام useRouter
  const [activeTab, setActiveTab] = useState('Trips'); // الحالة لتتبع التبويب النشط
  const [vehicles, setVehicles] = useState([]); // الحالة لتخزين بيانات المركبات
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [driversAssignment, setDriversAssignment] = useState([]);


  const fetchVehicles = async () => {
    try {
      //const response = await api.get(`/vehicles?userId=${userId}`); // إضافة معرف المستخدم في الطلب
      //setVehicles(response.data); // تخزين البيانات في الحالة
      //console.log(response.data);
      const response = await api.get(`/assignments/assigned-vehicle-devices?userId=${userId}`); // إضافة معرف المستخدم في الطلب
      setVehicles(response.data); // تخزين البيانات في الحالة
      console.log(response.data);
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

  useEffect(() => {
    fetchVehicles(); // استدعاء الدالة لجلب البيانات عند تحميل المكون
    if (activeTab === 'Drivers') {
      fetchDrivers();
    }
  }, [activeTab]); // [] تعني أن الدالة ستنفذ مرة واحدة عند تحميل المكون

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // إعادة تحميل البيانات
      await fetchVehicles();
      await fetchDrivers();
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

  const renderTripsTab = () => {
    return (
      <View style={styles.tripsSection}>
        <Text style={styles.sectionTitle}>Manage Trips</Text>
        
        <View style={styles.actionButtons}>
          <View style={styles.tripButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.grayButton, styles.twoThirdButton]} 
              onPress={() => {}}
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

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Upcoming</Text>
          {/* بطاقة الرحلة القادمة */}
          <Text style={styles.tripDate}>21 Oct, 2024</Text>
          <View style={styles.tripCard}>
            <View style={styles.tripDetails}>
              <View style={styles.tripIconContainer}>
                <View style={styles.tripIcon}>
                <Image 
                  source={require('../../assets/icons/trip.png')}
                  style={styles.tripIcon}
                />                  
                </View>
              </View>
              <View style={styles.tripInfo}>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Trip:</Text>
                  <Text style={styles.tripValue}>Walmart Shipment 3</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Vehicle:</Text>
                  <Text style={styles.tripValue}>Volvo 320C</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Driver:</Text>
                  <Text style={styles.tripValue}>Youssef Mohamed</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Status:</Text>
                  <Text style={styles.tripValue}>Scheduled</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.tripArrow}>
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Active</Text>
          {/* بطاقة افتراضية للرحلات النشطة */}
          <Text style={styles.tripDate}>21 Oct, 2024</Text>
          <View style={styles.tripCard}>
            <View style={styles.tripDetails}>
              <View style={styles.tripIconContainer}>
                <View style={styles.tripIcon}>
                <Image 
                  source={require('../../assets/icons/trip.png')}
                  style={styles.tripIcon}
                />   
                </View>
              </View>
              <View style={styles.tripInfo}>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Trip:</Text>
                  <Text style={styles.tripValue}>Walmart Shipment 2</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Vehicle:</Text>
                  <Text style={styles.tripValue}>Volvo 320C</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Driver:</Text>
                  <Text style={styles.tripValue}>Ali Ahmed</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Status:</Text>
                  <Text style={styles.tripValue}>GTA, North York</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.tripArrow}>
                <Text style={styles.arrowText}></Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>History</Text>
          {/* بطاقة افتراضية للتاريخ */}
          <Text style={styles.tripDate}>20 Oct, 2024</Text>
          <View style={styles.tripCard}>
            <View style={styles.tripDetails}>
              <View style={styles.tripIconContainer}>
                <View style={styles.tripIcon}>
                <Image 
                  source={require('../../assets/icons/trip.png')}
                  style={styles.tripIcon}
                />   
                </View>
              </View>
              <View style={styles.tripInfo}>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Trip:</Text>
                  <Text style={styles.tripValue}>Walmart Shipment 1</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Vehicle:</Text>
                  <Text style={styles.tripValue}>Volvo 320C</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Driver:</Text>
                  <Text style={styles.tripValue}>Sara Ali</Text>
                </View>
                <View style={styles.tripRow}>
                  <Text style={styles.tripLabel}>Status:</Text>
                  <Text style={styles.tripValue}>Completed</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.tripArrow}>
                <Text style={styles.arrowText}></Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderServicesTab = () => {
    return (
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Manage Services</Text>
        
        <View style={styles.actionButtons}>
          <View style={styles.tripButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.grayButton, styles.twoThirdButton]} 
              onPress={() => {}}
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

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Upcoming</Text>
          <Text style={styles.serviceDate}>25 Oct, 2024</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceDetails}>
              <View style={styles.serviceIconContainer}>
                <Image 
                  source={require('../../assets/icons/oil-in.png')}
                  style={styles.serviceIcon}
                />
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Service:</Text>
                  <Text style={styles.serviceValue}>Oil Change</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Vehicle:</Text>
                  <Text style={styles.serviceValue}>Mercedes C2</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Status:</Text>
                  <Text style={styles.serviceValue}>Scheduled</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Provider:</Text>
                  <Text style={styles.serviceValue}>AutoCare Center</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.serviceArrow}>
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Active</Text>
          <Text style={styles.serviceDate}>21 Oct, 2024</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceDetails}>
              <View style={styles.serviceIconContainer}>
                <Image 
                  source={require('../../assets/icons/tire-in.png')}
                  style={styles.serviceIcon}
                />
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Service:</Text>
                  <Text style={styles.serviceValue}>Tire Alignment</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Vehicle:</Text>
                  <Text style={styles.serviceValue}>Volvo 320C</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Status:</Text>
                  <Text style={styles.serviceValue}>In Progress</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Provider:</Text>
                  <Text style={styles.serviceValue}>TirePro Shop</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.serviceArrow}>
                <Text style={styles.arrowText}></Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>History</Text>
          <Text style={styles.serviceDate}>18 Oct, 2024</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceDetails}>
              <View style={styles.serviceIconContainer}>
                <Image 
                  source={require('../../assets/icons/car-engine.png')}
                  style={styles.serviceIcon}
                />
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Service:</Text>
                  <Text style={styles.serviceValue}>Engine Tune-up</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Vehicle:</Text>
                  <Text style={styles.serviceValue}>Toyota Camry</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Status:</Text>
                  <Text style={styles.serviceValue}>Completed</Text>
                </View>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>Provider:</Text>
                  <Text style={styles.serviceValue}>Master Garage</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.serviceArrow}>
                <Text style={styles.arrowText}></Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    paddingBottom: 275,
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
});