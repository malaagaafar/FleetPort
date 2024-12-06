import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import * as Location from 'expo-location';

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [location, setLocation] = useState(null);
  const { driver } = useAuth();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await api.driver.getVehicles(driver.id);
      console.log(data);
      setVehicles(data);
    } catch (error) {
      console.log(error);
      alert('Error loading vehicles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  const getLocation = async () => {
    try {
      // طلب صلاحيات الموقع
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return null;
      }

      // الحصول على الموقع الحالي
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const handleVehicleAction = async (vehicleId, action) => {
    setProcessingId(vehicleId);
    try {
      // الحصول على الموقع قبل إرسال الطلب
      const userLocation = await getLocation();
      
      if (action === 'login') {
        await api.driver.vehicleLogin(driver.id, vehicleId, userLocation);
        alert('Login successful');
      } else {
        await api.driver.vehicleLogout(driver.id, vehicleId, userLocation);
        alert('Logout successful');
      }
      fetchVehicles();
    } catch (error) {
      alert(error.message || `Failed to ${action === 'login' ? 'login' : 'logout'}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerText}>Assigned Vehicles</ThemedText>
        <ThemedText style={styles.subHeaderText}>Log in or out of your assigned vehicles</ThemedText>
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color="#999" />
            <ThemedText style={styles.emptyText}>
              No vehicles available
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleInfo}>
              <View style={styles.plateContainer}>
                <View style={styles.vehicleImageContainer}>
                  <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
                </View>
                <ThemedText style={styles.plateNumber}>{item.plateNumber}</ThemedText>
              </View>
              <ThemedText style={styles.model}>{item.make} {item.model}</ThemedText>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: item.isActive ? '#4CAF50' : '#FFC107' }]} />
                <ThemedText style={[styles.statusText, { color: '#4CAF50' }]}>
                   {item.order}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <ThemedButton
                style={[styles.actionButton, { opacity: item.canLogin ? 1 : 0.5 }]}
                onPress={() => handleVehicleAction(item.id, 'login')}
                loading={processingId === item.id}
                disabled={!item.canLogin || processingId === item.id}
                title="Login"
                icon="login"
              />
              <ThemedButton
                style={[styles.actionButton, styles.logoutButton, { opacity: item.canLogout ? 1 : 0.5 }]}
                onPress={() => handleVehicleAction(item.id, 'logout')}
                loading={processingId === item.id}
                disabled={!item.canLogout || processingId === item.id}
                title="Logout"
                icon="logout"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleCard: {
    margin: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  plateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  vehicleImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 0.5,
    //borderColor: '#ddd',
  },
  plateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  model: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 12,
  },
});