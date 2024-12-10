import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import api from '@/config/api';
import { RootState } from '@/store/store';
import { KeyboardWrapper } from '../../components/KeyboardWrapper';
import MapView, { Marker } from 'react-native-maps';
import { Modal } from 'react-native';
import { format } from 'date-fns';

export default function ScheduleMaintenance() {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // حالات القوائم المنسدلة
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [customProviderName, setCustomProviderName] = useState('');
  const [showCustomProvider, setShowCustomProvider] = useState(false);

  const [maintenanceData, setMaintenanceData] = useState({
    vehicle_id: null,
    custom_provider_name: '',
    type: '',
    custome_type: '',
    scheduled_date: new Date(),
    scheduled_end: new Date(),
    estimated_duration: null,
    location: '',
    cost_estimate: '',
    notes: '',
    status: 'scheduled'
  });

  const [selectedType, setSelectedType] = useState(null);

  const maintenanceTypes = [
    { label: 'Oil Change', value: 'oil_change' },
    { label: 'Tire Service', value: 'tire_service' },
    { label: 'Brake Service', value: 'brake_service' },
    { label: 'Battery Service', value: 'battery_service' },
    { label: 'Engine Service', value: 'engine_service' },
    { label: 'Transmission', value: 'transmission' },
    { label: 'Cooling System', value: 'cooling_system' },
    { label: 'Fuel System', value: 'fuel_system' },
    { label: 'Electrical', value: 'electrical' },
    { label: 'Inspection', value: 'inspection' },
    { label: 'Filter Change', value: 'filter_change' },
    { label: 'Alignment', value: 'alignment' },
    { label: 'Other', value: 'other' }
  ];

  // جضافة متغيرات الحالة الجديدة للموقع
  const [showMap, setShowMap] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationResults, setShowLocationResults] = useState(false);

  // جلب المركبات ومزودي الخدمة
  useEffect(() => {
    const loadData = async () => {
      try {
        const vehiclesRes = await api.get(`/vehicles/for-assignment?userId=${userId}`);
        setVehicles(vehiclesRes.data.vehicles);
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load data');
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId]);

  // دوال المعالجة
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowDate(false);
    if (selectedDate) {
      // تحديث تاريخ البداية
      setMaintenanceData(prev => {
        const newData = {
          ...prev,
          scheduled_date: selectedDate
        };
        
        // إذا كان تاريخ النهاية قبل تاريخ البداية الجديد
        if (prev.scheduled_end < selectedDate) {
          // تعيين تاريخ النهاية ليكون بعد ساعة من تاريخ البداية
          const newEndDate = new Date(selectedDate);
          newEndDate.setHours(selectedDate.getHours() + 1);
          newData.scheduled_end = newEndDate;
        }
        
        return newData;
      });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDate(false);
    if (selectedDate) {
      // التحقق من أن التاريخ المحدد بعد تاريخ البداية
      if (selectedDate <= maintenanceData.scheduled_date) {
        // إذا كان التاريخ المحدد قبل أو يساوي تاريخ البداية
        Alert.alert(
          "Invalid Date",
          "End date must be after start date",
          [{ text: "OK" }]
        );
        return;
      }
      
      setMaintenanceData(prev => ({
        ...prev,
        scheduled_end: selectedDate
      }));
    }
  };

  const handleSubmit = async () => {
    if (!maintenanceData.vehicle_id) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }
    if (!maintenanceData.type) {
      Alert.alert('Error', 'Please select maintenance type');
      return;
    }

    try {
      const response = await api.post('/maintenance/schedule', {
        ...maintenanceData,
        vehicle_id: selectedVehicle, // هنا نضيف vehicle_id بشكل صريح
        type: selectedType,
        user_id: userId,
        cost_estimate: parseFloat(maintenanceData.cost_estimate) || 0,
        created_at: new Date(),
        updated_at: new Date(),
        recommendation_id: null,
        assigned_to: null
      });

      if (response.data) {
        Alert.alert(
          'Success',
          'Maintenance scheduled successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      Alert.alert('Error', 'Failed to schedule maintenance');
    }
  };

  // دالة البحث عن المواقع
  const searchLocations = async (text: string) => {
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowLocationResults(true);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  // دالة اختيار الموقع
  const handleLocationSelect = (location: any) => {
    setSelectedLocation({
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
      address: location.display_name
    });
    setMaintenanceData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: [parseFloat(location.lon), parseFloat(location.lat)]
      }
    }));
    setSearchText(location.display_name.split(',')[0]);
    setShowLocationResults(false);
  };

  // مكون الخريطة
  const LocationMap = ({ visible, onClose }) => (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={styles.mapHeader}>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.mapHeaderButton}
            >
              <Text style={styles.mapCloseButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Select Location</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.mapHeaderButton}
            >
              <Text style={styles.mapDoneButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedLocation?.latitude || 24.7136,
                longitude: selectedLocation?.longitude || 46.6753,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => {
                const newLocation = {
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                  address: "Selected from map"
                };
                setSelectedLocation(newLocation);
                setMaintenanceData(prev => ({
                  ...prev,
                  location: {
                    type: 'Point',
                    coordinates: [newLocation.longitude, newLocation.latitude]
                  }
                }));
                onClose();
              }}
            >
              {selectedLocation && (
                <Marker coordinate={selectedLocation} />
              )}
            </MapView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );

  return (
    <KeyboardWrapper>
      <SafeAreaView style={styles.safeArea} edges={['top']}> 
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Maintenance</Text>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
        {/* اختيار المركبة */}
          <View style={[styles.inputGroup, { zIndex: 3000 }]}>
            <Text style={styles.label}>Vehicle *</Text>
            <DropDownPicker
              open={vehicleOpen}
              setOpen={setVehicleOpen}
              items={vehicles.map(v => ({
                label: `${v.name} - ${v.plate_number}`,
                value: v.id,
                icon: () => (
                  <Image 
                    source={{ uri: v.vehicle_image || '' }}
                    style={styles.dropdownItemImage}
                  />
                )
              }))}
              value={selectedVehicle}
              setValue={(value) => {
                setSelectedVehicle(value);
                setMaintenanceData({...maintenanceData, vehicle_id: value});
              }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholder="Select vehicle"
            />
          </View>

          {/* نوع الصيانة */}
          <View style={[styles.inputGroup, { zIndex: 2000 }]}>
            <Text style={styles.label}>Maintenance Type *</Text>
            <DropDownPicker
              open={typeOpen}
              setOpen={setTypeOpen}
              items={maintenanceTypes}
              value={selectedType}
              setValue={(value) => {
                setSelectedType(value);
                setMaintenanceData(prev => ({
                  ...prev,
                  type: value
                }));
              }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholder="Select type"
            />
          </View>

          {/* مزود الخدمة */}
          <View style={[styles.inputGroup, { zIndex: 1000 }]}>
            <Text style={styles.label}>Service Provider</Text>
            <TextInput
              style={styles.input}
              value={customProviderName}
              onChangeText={(text) => {
                setCustomProviderName(text);
                setMaintenanceData({
                  ...maintenanceData,
                  provider_id: null,
                  custom_provider_name: text
                });
              }}
              placeholder="Enter provider name"
            />
          </View>

          {/* التاريخ والمدة */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Scheduled Start *</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDate(true)}
            >
              <Text>{format(maintenanceData.scheduled_date, 'MMM dd, yyyy hh:mm a')}</Text>
            </TouchableOpacity>
            {showDate && (
              <DateTimePicker
                value={maintenanceData.scheduled_date}
                mode="datetime"
                onChange={handleStartDateChange}
                minimumDate={new Date()} // لا يمكن اختيار تاريخ في الماضي
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Scheduled End *</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowEndDate(true)}
            >
              <Text>{format(maintenanceData.scheduled_end, 'MMM dd, yyyy hh:mm a')}</Text>
            </TouchableOpacity>
            {showEndDate && (
              <DateTimePicker
                value={maintenanceData.scheduled_end}
                mode="datetime"
                onChange={handleEndDateChange}
                minimumDate={new Date(maintenanceData.scheduled_date.getTime() + 60000)} // دقيقة واحدة بعد وقت البداية
              />
            )}
          </View>

          {/* الموقع والتكلفة */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search location"
                  value={searchText}
                  onChangeText={(text) => {
                    setSearchText(text);
                    searchLocations(text);
                  }}
                  onFocus={() => setShowLocationResults(true)}
                />
                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={() => setShowMap(true)}
                >
                  <Text>Map</Text>
                </TouchableOpacity>
              </View>
              
              {showLocationResults && searchResults.length > 0 && (
                <View style={styles.resultsContainer}>
                  {searchResults.map((item: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resultItem}
                      onPress={() => handleLocationSelect(item)}
                    >
                      <Text style={styles.resultText}>{item.display_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            {selectedLocation && (
              <Text style={styles.selectedLocation}>
                Selected: {selectedLocation.address}
              </Text>
            )}

            <LocationMap 
              visible={showMap}
              onClose={() => setShowMap(false)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estimated Cost</Text>
            <TextInput
              style={styles.input}
              value={maintenanceData.cost_estimate}
              onChangeText={(text) => setMaintenanceData({...maintenanceData, cost_estimate: text})}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>

          {/* الملاحظات */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={maintenanceData.notes}
              onChangeText={(text) => setMaintenanceData({...maintenanceData, notes: text})}
              placeholder="Enter any additional notes"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* زر الحفظ */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Schedule Maintenance</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </SafeAreaView>
    </KeyboardWrapper>
  );
}

const styles = StyleSheet.create({
  dropdownItemImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  toggleButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  mapButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 14,
  },
  selectedLocation: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  map: {
    flex: 1,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    marginTop: 30,
  },
  mapHeaderButton: {
    minWidth: 60,
  },
  mapCloseButton: {
    color: '#007AFF',
    fontSize: 17,
  },
  mapDoneButton: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  mapTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});