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
    { id: 4, name: 'Yasser G.', score: 4.6 }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header with Logo and Icons */}

      {/* Fleet Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Fleet Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{fleetSummary.inactiveVehicles}</Text>
            <Text style={styles.summaryLabel}>Inactive{'\n'}Vehicles</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{fleetSummary.activeVehicles}</Text>
            <Text style={styles.summaryLabel}>Active{'\n'}Vehicles</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{fleetSummary.activeTrips}</Text>
            <Text style={styles.summaryLabel}>Active{'\n'}Trips</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{fleetSummary.alerts}</Text>
            <Text style={styles.summaryLabel}>Alerts</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{fleetSummary.upcomingEvents}</Text>
            <Text style={styles.summaryLabel}>Upcoming{'\n'}Events</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{fleetSummary.tripRequests}</Text>
            <Text style={styles.summaryLabel}>Trip{'\n'}Request</Text>
          </View>
        </View>
      </View>

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
            <View style={[styles.statusIndicator, 
              { backgroundColor: vehicle.status === 'active' ? '#4CAF50' : '#999' }]} />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleTitle}>Vehicle: {vehicle.vehicle}</Text>
              <Text style={styles.vehicleDetail}>Location: {vehicle.location}</Text>
              <Text style={styles.vehicleDetail}>Driver: {vehicle.driver}</Text>
              <Text style={styles.vehicleDetail}>Event: {vehicle.event}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Driver Scores */}
      <View style={styles.driversSection}>
        <Text style={styles.sectionTitle}>Driver Score:</Text>
        <Text style={styles.driverScoreHint}>select a driver to show their score:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.driversScroll}>
          {drivers.map(driver => (
            <View key={driver.id} style={styles.driverScore}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverInitial}>{driver.name[0]}</Text>
              </View>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverScoreNumber}>{driver.score}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addDriverButton}>
            <MaterialIcons name="add" size={24} color="#007AFF" />
            <Text style={styles.addDriverText}>Add Driver</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Maintenance Report Section */}
      <View style={styles.maintenanceSection}>
        <Text style={styles.sectionTitle}>Maintenance Report</Text>
        {/* Add maintenance report content here */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpace: {
    marginHorizontal: 15,
  },
  summarySection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '16%',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  mapContainer: {
    height: 200,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  vehiclesSection: {
    padding: 15,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  vehicleDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  driversSection: {
    padding: 15,
  },
  driverScoreHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  driversScroll: {
    flexDirection: 'row',
  },
  driverScore: {
    alignItems: 'center',
    marginRight: 20,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  driverInitial: {
    fontSize: 20,
    fontWeight: '600',
  },
  driverName: {
    fontSize: 14,
    marginBottom: 2,
  },
  driverScoreNumber: {
    fontSize: 14,
    color: '#666',
  },
  addDriverButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addDriverText: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 5,
  },
  maintenanceSection: {
    padding: 15,
  },
});