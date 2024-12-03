import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useState } from 'react';

export default function LiveScreen() {
  const [activeTab, setActiveTab] = useState('Vehicles'); // حالة لتتبع التبويب النشط

  // بيانات افتراضية للمركبات النشطة
  const activeVehicles = [
    {
      id: 1,
      vehicle: 'Volvo 320C',
      location: 'GTA, North York 364L168',
      driver: 'Youssef Mohamed',
      event: 'On Trip 304',
      status: 'Active'
    },
    {
      id: 2,
      vehicle: 'Volvo 320C',
      location: 'GTA, North York 364L168',
      driver: 'Youssef Mohamed',
      event: 'On Trip 304',
      status: 'Active'
    },
    {
      id: 3,
      vehicle: 'Volvo 320C',
      location: 'GTA, North York 364L168',
      driver: 'Youssef Mohamed',
      event: 'On Trip 304',
      status: 'Active'
    },
    {
      id: 4,
      vehicle: 'Volvo 320C',
      location: 'GTA, North York 364L168',
      driver: 'Youssef Mohamed',
      event: 'On Trip 304',
      status: 'Active'
    },
  ];

  return (
    <View style={styles.container}>
      {/* شريط التبويب */}
      <View style={styles.tabsContainer}>
        {['Vehicles', 'Trips'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab ? styles.activeTab : styles.inactiveTab
            ]}
            onPress={() => setActiveTab(tab)}
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

      {/* قائمة المركبات */}
      <ScrollView style={styles.listContainer}>
        {activeVehicles.map((vehicle) => (
          <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleInfo}>
              <View style={styles.statusIconContainer}>
                <View style={styles.statusIcon}>
                  <Text style={styles.statusText}>{vehicle.status}</Text>
                </View>
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
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    marginRight: 16,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#021037',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 14,
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