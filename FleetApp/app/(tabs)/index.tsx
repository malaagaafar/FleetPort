import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen() {
  const router = useRouter();

  const fleetSummary = {
    inactiveVehicles: 2,
    activeVehicles: 5,
    activeTrips: 4,
    alerts: 10,
    upcomingEvents: 8,
    tripRequests: 1
  };

  const vehicles = [
    {
      id: 1,
      status: 'active',
      vehicle: 'Volvo 320C',
      location: 'GTA, North York 36.1L/68',
      driver: 'Yasser Mohamed',
      event: 'On Trip 304'
    },
    {
      id: 2,
      status: 'inactive',
      vehicle: 'Mercedes 250C',
      location: 'Parking lot 1',
      driver: 'Ali Ahmed',
      event: 'Parked'
    }
  ];

  const drivers = [
    { id: 1, name: 'Yasser G.', score: 4.8 },
    { id: 2, name: 'Yasser G.', score: 4.5 },
    { id: 3, name: 'Yasser G.', score: 4.7 },
    //{ id: 4, name: 'Yasser G.', score: 4.6 }
  ];
  
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
              latitude: 43.7184,
              longitude: -79.5181,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {vehicles.map((vehicle) => (
              <Marker
                key={vehicle.id}
                coordinate={{
                  latitude: 43.7184,
                  longitude: -79.5181,
                }}
                title={vehicle.vehicle}
                description={vehicle.driver}
              />
            ))}
          </MapView>
        </View>

        {/* Vehicles List */}
        <View style={styles.vehiclesSection}>
          {vehicles.map(vehicle => (
            <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
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
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Driver Score Section */}
      <View style={styles.driversSection}>
        <Text style={styles.driverScoreTitle}>Driver Score: <Text style={styles.driverScoreHint}>select a driver to show their score:</Text></Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.driversScroll}>
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
        </ScrollView>
      </View>

      {renderMaintenanceReport()}
      {renderFinancialReport()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 15,
    overflow: 'hidden',
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
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  vehicleStatusContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
  },
  vehicleInfo: {
    flex: 1,
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
  driverName: {
    fontSize: 12,
    color: '#333',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  label: {
    fontSize: 13,
    color: '#666',
    width: 60,
  },
  value: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  scheduleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
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
    marginTop: 0,
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
});