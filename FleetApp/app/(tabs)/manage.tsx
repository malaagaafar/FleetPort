import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // استيراد useRouter
import { useState } from 'react'; // استيراد useState

export default function ManageScreen() {
  const router = useRouter(); // استخدام useRouter
  const [activeTab, setActiveTab] = useState('Trips'); // الحالة لتتبع التبويب النشط

  const navigateToForm = () => {
    console.log(activeTab)
    if (activeTab == 'Vehicles'){
      router.push('/(inputs)/AddVehicle'); // تغيير المسار حسب هيكل مشروعك

    }else if (activeTab == 'Drivers'){
      router.push('/(inputs)/AddDriver'); // تغيير المسار حسب هيكل مشروعك
 
    }else {router.push('/(inputs)/AddVehicle'); }// تغيير المسار حسب هيكل مشروعك
  };

  const renderButton = () => {
    return (
      <TouchableOpacity style={styles.button} onPress={navigateToForm}>
        <Text style={styles.buttonText}>Add {activeTab}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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
      {renderButton()}
    </View>
  );
}

const styles = StyleSheet.create({
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
});