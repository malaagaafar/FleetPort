import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../config/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function AssignDeviceScreen() {
  const { deviceSerial, deviceType } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // جلب المركبات المتاحة للربط
  const { data: availableVehicles = [], isLoading } = useQuery({
    queryKey: ['availableVehicles', userId],
    queryFn: async () => {
      const response = await api.get('/vehicles/available-for-device', {
        params: { 
          userId,
          deviceType 
        }
      });
      return response.data?.vehicles || [];
    }
  });

  // mutation لعملية الربط
  const assignMutation = useMutation({
    mutationFn: async (vehicleId: number) => {
      return await api.post('/purchase/assign-device', {
        deviceSerial,
        vehicleId,
        userId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['purchasedDevices', userId]);
      Alert.alert('نجاح', 'تم ربط الجهاز بالمركبة بنجاح');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ أثناء ربط الجهاز');
    }
  });

  const handleAssign = (vehicleId: number) => {
    Alert.alert(
      'تأكيد',
      'هل أنت متأكد من ربط الجهاز بهذه المركبة؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel'
        },
        {
          text: 'تأكيد',
          onPress: () => assignMutation.mutate(vehicleId)
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>اختر مركبة للربط</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const renderVehicle = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.vehicleItem}
      onPress={() => handleAssign(item.id)}
    >
      <Text style={styles.vehicleName}>{item.name} - {item.make} {item.model}</Text>
      <Text style={styles.vehicleDetails}>سنة الصنع: {item.year}</Text>
      <Text style={styles.plateNumber}>رقم اللوحة: {item.plate_number}</Text>
      <Text style={styles.vehicleType}>النوع: {item.type}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>جاري تحميل المركبات المتاحة...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!availableVehicles.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.noVehiclesText}>لا توجد مركبات متاحة للربط</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          الجهاز: {deviceSerial}
          {'\n'}
          النوع: {deviceType}
        </Text>
        <FlatList
          data={availableVehicles}
          renderItem={renderVehicle}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'right',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  list: {
    paddingVertical: 8,
  },
  vehicleItem: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
  },
  plateNumber: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    textAlign: 'right',
  },
  vehicleType: {
    fontSize: 14,
    color: '#0066CC',
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  noVehiclesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});