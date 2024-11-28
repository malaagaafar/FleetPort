import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; // استيراد useRouter
import { useEffect, useState } from 'react'; // استيراد useState
import api from '@/config/api';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export default function ManageScreen() {
  const router = useRouter(); // استخدام useRouter
  const [activeTab, setActiveTab] = useState('Trips'); // الحالة لتتبع التبويب النشط
  const [vehicles, setVehicles] = useState([]); // الحالة لتخزين بيانات المركبات
  const userId = useSelector((state: RootState) => state.auth.user?.id);


  useEffect(() => {
    // دالة لجلب بيانات المركبات
    const fetchVehicles = async () => {
      try {
        const response = await api.get(`/vehicles?userId=${userId}`); // إضافة معرف المستخدم في الطلب
        setVehicles(response.data); // تخزين البيانات في الحالة
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles(); // استدعاء الدالة لجلب البيانات
  }, []); // [] تعني أن الدالة ستنفذ مرة واحدة عند تحميل المكون


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

  const renderVehiclesList = () => {
    return (
      <View style={styles.vehiclesListContainer}>
        {vehicles.map((vehicle, index) => (
          <View key={index} style={styles.vehicleItem}>
            <View style={[styles.vehicleIcon, getStatusStyle(vehicle.status)]}>
              {vehicle.alerts > 0 && <Text style={styles.alertCount}>{vehicle.alerts}</Text>}
            </View>
            <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return { borderColor: 'green' }; // لون الحدود للمركبة النشطة
      case 'warning':
        return { borderColor: 'red' }; // لون الحدود للمركبة التي بها تحذير
      case 'inactive':
        return { borderColor: 'gray' }; // لون الحدود للمركبة غير النشطة
      default:
        return {};
    }
  };

  const renderVehiclesTab = () => {
    return (
      <View style={styles.vehiclesSection}>
        <Text style={styles.sectionTitle}>Manage Vehicles</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToForm}>
          <Text style={styles.buttonText}>Add a New Vehicle</Text>
        </TouchableOpacity>
        <View style={styles.vehicleButtonsContainer}>
          <TouchableOpacity style={styles.assignButton} onPress={() => {/* إضافة وظيفة لتعيين جهاز */}}>
            <Text style={styles.assignButtonText}>Assign Device to a Vehicle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.assignButton} onPress={() => {/* إضافة وظيفة لتعيين سائق */}}>
            <Text style={styles.assignButtonText}>Assign Driver to a Vehicle</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSubtitle}>Your Vehicles</Text>
        {renderVehiclesList()}
        <Text style={styles.sectionSubtitle}>Maintenance Report</Text>
        <View style={styles.maintenanceReport}>
          <Text>Fuel Refill: Vehicle 320C, 10L</Text>
          <Text>Oil Change: Vehicle C2</Text>
          <Text>Tire Alignment: Vehicle 320C, -0.5°, 0.0°, 0.15” inch</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.tabsContainer}>
        {['Trips', 'Vehicles', 'Drivers', 'Services'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : styles.inactiveTab]} // تمييز التبويب النشط
            onPress={() => setActiveTab(tab)} // تحديث الحالة عند الضغط
          >
            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'Vehicles' && renderVehiclesTab()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center', // تطبيق الأنماط هنا
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 0,
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
  vehicleButtonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  assignButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#28a745', // لون الخلفية للأزرار الجديدة
    borderRadius: 5,
  },
  assignButtonText: {
    color: '#fff', // لون النص للأزرار الجديدة
    textAlign: 'center',
  },
  vehiclesSection: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 16,
    marginTop: 10,
  },
  vehiclesList: {
    marginTop: 10,
  },
  maintenanceReport: {
    marginTop: 10,
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
  vehicleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
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
  vehicleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
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
  },
});