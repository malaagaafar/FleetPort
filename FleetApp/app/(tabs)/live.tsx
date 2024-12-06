import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Image } from 'react-native'; // تأكد من استيراد Image
const { width, height } = Dimensions.get('window');
import { MaterialIcons } from '@expo/vector-icons';

export default function LiveScreen() {
  const [activeTab, setActiveTab] = useState('Vehicles');

  // بيانات افتراضية للمركبات النشطة مع إحداثيات
  const activeVehicles = [
    {
      id: 1,
      vehicle: 'Volvo 320C',
      location: 'GTA, North York',
      driver: 'Youssef Mohamed',
      event: 'On Trip 304',
      status: 'Active',
      coordinate: {
        latitude: 43.7184,
        longitude: -79.5181
      }
    },
    // يمكنك إضافة المزيد من المركبات هنا
  ];

  // بيانات افتراضية للرحلات - إضافة المزيد من البيانات للاختبار
  const trips = [
    {
      id: 1,
      tripName: 'Trip to Downtown',
      vehicle: 'Volvo 320C',
      driver: 'Youssef Mohamed',
      status: 'In Progress',
    },
    {
      id: 2,
      tripName: 'Airport Transfer',
      vehicle: 'Mercedes Benz',
      driver: 'Ahmed Hassan',
      status: 'In Progress',
    },
    {
      id: 3,
      tripName: 'Shopping Mall Route',
      vehicle: 'Ford F-150',
      driver: 'Omar Ali',
      status: 'In Progress',
    }
  ];

  // إضافة وظيفة للتأكد من تغيير التاب
  const handleTabChange = (tab) => {
    console.log('Changing to tab:', tab); // للتأكد من أن النقر يعمل
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* الخريطة */}
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
          {activeVehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              coordinate={vehicle.coordinate}
              title={vehicle.vehicle}
              description={vehicle.driver}
            />
          ))}
        </MapView>
      </View>

      {/* شريط التبويب والمحتوى */}
      <View style={styles.bottomSheet}>
        <View style={styles.tabsContainer}>
          {['Vehicles', 'Trips'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab ? styles.activeTab : styles.inactiveTab
              ]}
              onPress={() => handleTabChange(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.activeTabText : styles.inactiveTabText
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.listContainer}>
          {activeTab === 'Vehicles' ? (
            // عرض المركبات
            activeVehicles.map((vehicle) => (
              <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleInfo}>
                  <View style={styles.statusIconContainer}>
                    <Image 
                      source={require('../../assets/icons/delivery-truck.png')}
                      style={styles.statusIcon}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Vehicle:</Text>
                      <Text style={styles.value}>{vehicle.vehicle}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Location:</Text>
                      <Text style={styles.value}>{vehicle.location}</Text>
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
            ))
          ) : (
            // عرض الرحلات
            trips.map((trip) => (
              <TouchableOpacity key={trip.id} style={styles.vehicleCard}>
                <View style={styles.vehicleInfo}>
                  <View style={styles.statusIconContainer}>
                    <Image 
                      source={require('../../assets/icons/trip.png')}
                      style={styles.statusIcon}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Trip:</Text>
                      <Text style={styles.value}>{trip.tripName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Vehicle:</Text>
                      <Text style={styles.value}>{trip.vehicle}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Driver:</Text>
                      <Text style={styles.value}>{trip.driver}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Status:</Text>
                      <Text style={styles.value}>{trip.status}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.arrowContainer}>
                    <MaterialIcons name="chevron-right" size={24} color="#999" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    height: height * 0.68,
    width: width,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  leftTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopLeftRadius: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  inactiveTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: '#000',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 16,
  },
  statusIcon: {
    width: '75%',
    height: '75%',
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
});