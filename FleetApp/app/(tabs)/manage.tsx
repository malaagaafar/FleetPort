import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // استيراد useRouter

export default function ManageScreen() {
  const router = useRouter(); // استخدام useRouter

  const navigateToForm = () => {
    router.push('/(inputs)/AddVehicle'); // تغيير المسار حسب هيكل مشروعك
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Vehicles</Text>
      <Text style={styles.subtitle}>Manage your vehicle information here.</Text>
      <TouchableOpacity style={styles.button} onPress={navigateToForm}>
        <Text style={styles.buttonText}>Add Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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