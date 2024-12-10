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
import { KeyboardWrapper } from '../../../components/KeyboardWrapper';

export default function AssignSensorScreen() {
  const { sensorSerial, sensorType } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // جلب الأجهزة المتاحة للربط
  const { data: availableDevices = [], isLoading } = useQuery({
    queryKey: ['availableDevices', userId, sensorType],
    queryFn: async () => {
      const response = await api.get('/purchase/available-for-sensor', {
        params: { 
          userId,
          sensorType 
        }
      });
      return response.data?.devices || [];
    }
  });

  // إنشاء mutation لعملية الربط
  const assignMutation = useMutation({
    mutationFn: async (deviceSerial: string) => {
      return await api.post('/purchase/assign-sensor', {
        sensorSerial,
        deviceSerial,
        userId
      });
    },
    onSuccess: () => {
      // تحديث البيانات بعد نجاح عملية الربط
      queryClient.invalidateQueries(['purchasedDevices', userId]);
      queryClient.invalidateQueries(['purchasedSensors', userId]);
      Alert.alert('نجاح', 'تم ربط المستشعر بنجاح');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ أثناء ربط المستشعر');
    }
  });

  const handleAssign = (deviceSerial: string) => {
    Alert.alert(
      'تأكيد',
      'هل أنت متأكد من ربط المستشعر بهذا الجهاز؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel'
        },
        {
          text: 'تأكيد',
          onPress: () => assignMutation.mutate(deviceSerial)
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
      <Text style={styles.headerTitle}>اختر جهازاً للربط</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const renderDevice = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => handleAssign(item.serial_number)}
    >
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceModel}>{item.manufacturer} - {item.model}</Text>
      <Text style={styles.deviceSerial}>الرقم التسلسلي: {item.serial_number}</Text>
      <Text style={styles.deviceType}>النوع: {item.type}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>جاري تحميل الأجهزة المتاحة...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!availableDevices.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.noDevicesText}>لا توجد أجهزة متاحة للربط</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardWrapper>
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          المستشعر: {sensorSerial}
          {'\n'}
          النوع: {sensorType}
        </Text>
        <FlatList
          data={availableDevices}
          renderItem={renderDevice}
          keyExtractor={item => item.serial_number}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      </SafeAreaView>
    </KeyboardWrapper>
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
    width: 40, // لموازنة زر الرجوع
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
  deviceItem: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
  deviceModel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
  },
  deviceSerial: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    textAlign: 'right',
  },
  deviceType: {
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
  noDevicesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});