import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Alert, ActivityIndicator, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import api from '@/config/api';
import { RootState } from '@/store/store';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardWrapper } from '../../components/KeyboardWrapper';

const LocationSearch = ({ 
  placeholder, 
  onLocationSelect,
  onMapSelect,
  position
}: { 
  placeholder: string, 
  onLocationSelect: (location: any) => void,
  onMapSelect: () => void,
  position: number
}) => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchLocations = async (text: string) => {
    if (text.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`
      );
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            searchLocations(text);
          }}
          onFocus={() => setShowResults(true)}
        />
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={onMapSelect}
        >
          <Text>Map</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && (
        <ActivityIndicator style={styles.loader} />
      )}

      {showResults && results.length > 0 && (
        <View style={[styles.resultsContainer, { top: 55 }]}>
          {results.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.resultItem}
              onPress={() => {
                onLocationSelect({
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.lon),
                  address: item.display_name
                });
                setSearchText(item.display_name.split(',')[0]);
                setShowResults(false);
              }}
            >
              <Text style={styles.resultText}>{item.display_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      </View>
  );
};

export default function ScheduleTrip() {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [open, setOpen] = useState(false);


  // حالة القوائم المنسدلة
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [driverOpen, setDriverOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const [tripData, setTripData] = useState({
    reference_number: '',
    type: 'delivery',
    status: 'scheduled',
    title: '',
    description: '',
    vehicle_id: null,
    driver_id: null,
    scheduled_start: new Date(),
    scheduled_end: new Date(),
    start_location: null,
    end_location: null,
    waypoints: [],
    planned_route: null,
    estimated_distance: '',
    estimated_duration: '',
    cargo_details: {},
    requirements: {},
    priority: 0,
    recurring: false,
    cost: '',
    revenue: '',
    notes: '',
    metadata: {}
  });

  const [value, setValue] = useState(tripData.priority);
  const [startLocation, setStartLocation] = useState<any>(null);
  const [endLocation, setEndLocation] = useState<any>(null);

  // إضافة state منفصل للقيم المحددة
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // تحديث tripData عند تغيير القيم المحددة
  useEffect(() => {
    setTripData(prev => ({
        ...prev,
        vehicle_id: selectedVehicle,
        driver_id: selectedDriver
    }));
  }, [selectedVehicle, selectedDriver]);

  // تحويل البيانات إلى تنسيق DropDownPicker مع إضافة الصور
  const vehicleItems = vehicles.map(v => ({
    label: `${v.name} - ${v.plate_number}`,
    value: v.id,
    icon: () => (
      <Image 
        source={{ uri: v.vehicle_image || '' }}
        style={styles.dropdownItemImage}
      />
    )
  }));

  const driverItems = drivers.map(d => ({
    label: `${d.first_name} ${d.last_name}`,
    value: d.id,
    icon: () => (
      <Image 
        source={{ uri: d.profile_image || '' }}
        style={styles.dropdownItemImage}
      />
    )
  }));

  const priorityItems = [
    { label: 'Low', value: 0 },
    { label: 'Medium', value: 1 },
    { label: 'High', value: 2 }
  ];

  const handleSubmit = async () => {
    // التحقق من الحقول المطلوبة
    console.log('Sending trip data:', tripData); // للتأكد من البيانات قبل الإرسال

    if (!tripData.title) {
      Alert.alert('Error', 'Please enter trip title');
      return;
    }
    if (!tripData.vehicle_id) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }
    if (!tripData.driver_id) {
      Alert.alert('Error', 'Please select a driver');
      return;
    }
    if (!tripData.start_location) {
      Alert.alert('Error', 'Please select start location');
      return;
    }
    if (!tripData.end_location) {
      Alert.alert('Error', 'Please select end location');
      return;
    }

    try {
      const response = await api.post('/trips', {
        ...tripData,
        user_id: userId,
        cost: parseFloat(tripData.cost) || 0,
        revenue: parseFloat(tripData.revenue) || 0,
        status: 'draft',
        created_at: new Date(),
        updated_at: new Date()
      });

      if (response.data) {
        Alert.alert(
          'Success',
          'Trip scheduled successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert(
        'Error',
        'Failed to schedule trip. Please try again.'
      );
    }
  };

  // إضافة دالة fetchVehicles
  const fetchVehicles = async () => {
    try {
      const response = await api.get(`/vehicles/for-assignment?userId=${userId}`);
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      Alert.alert('Error', 'Failed to load vehicles');
    }
  };

  // إضافة دالة fetchDrivers
  const fetchDrivers = async () => {
    try {
      const response = await api.get(`/drivers/for-assignment?userId=${userId}`);
      setDrivers(response.data.drivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      Alert.alert('Error', 'Failed to load drivers');
    }
  };

  // تعديل useEffect لاستدعاء الدوال الجديدة
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchVehicles(),
        fetchDrivers()
      ]);
    };

    if (userId) {
      loadData();
    }
  }, [userId]);

  // إضافة دوال معالجة التواريخ
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDate(false);
    if (selectedDate) {
      setTripData({...tripData, scheduled_start: selectedDate});
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDate(false);
    if (selectedDate) {
      setTripData({...tripData, scheduled_end: selectedDate});
    }
  };

  // دالة لتنسيق التاريخ والوقت
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // إضافة الدوال الجديدة بعد تعريف الحالات
  const handleStartDatePress = () => {
    setShowEndDate(false);
    setShowStartDate(true);
  };

  const handleEndDatePress = () => {
    setShowStartDate(false);
    setShowEndDate(true);
  };

  const handleStartLocationSelect = (location: any) => {
    setStartLocation(location);
    setTripData({
      ...tripData,
      start_location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      }
    });
  };

  const handleEndLocationSelect = (location: any) => {
    setEndLocation(location);
    setTripData({
      ...tripData,
      end_location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      }
    });
  };

  const [showStartMap, setShowStartMap] = useState(false);
  const [showEndMap, setShowEndMap] = useState(false);

  // إضافة مكون الخريطة
  const LocationMap = ({ 
    visible, 
    onClose, 
    onSelect,
    initialLocation
  }) => (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mapHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.mapCloseButton}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.mapTitle}>Select Location</Text>
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: initialLocation?.latitude || 24.7136,
            longitude: initialLocation?.longitude || 46.6753,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => {
            onSelect({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              address: "Selected from map"
            });
            onClose();
          }}
        >
          {initialLocation && (
            <Marker coordinate={initialLocation} />
          )}
        </MapView>
      </SafeAreaView>
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
        <Text style={styles.headerTitle}>Schedule Trip</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {/* المعرف المرجعي */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference Number</Text>
            <TextInput
              style={styles.input}
              value={tripData.reference_number}
              onChangeText={(text) => setTripData({...tripData, reference_number: text})}
              placeholder="Enter reference number"
            />
          </View>

          {/* العنوان والوصف */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={tripData.title}
              onChangeText={(text) => setTripData({...tripData, title: text})}
              placeholder="Enter trip title"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={tripData.description}
              onChangeText={(text) => setTripData({...tripData, description: text})}
              placeholder="Enter description"
              multiline
              numberOfLines={3}
            />
          </View>

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
              setValue={setSelectedVehicle}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholder="Select vehicle"
              listMode="SCROLLVIEW"
              ListItemComponent={({ item }) => (
                <View style={styles.dropdownItem}>
                  {item.icon && item.icon()}
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </View>
              )}
            />
          </View>

          {/* اختيار السائق */}
          <View style={[styles.inputGroup, { zIndex: 2000 }]}>
            <Text style={styles.label}>Driver *</Text>
            <DropDownPicker
              open={driverOpen}
              setOpen={setDriverOpen}
              items={drivers.map(d => ({
                label: `${d.first_name} ${d.last_name}`,
                value: d.id,
                icon: () => (
                  <Image 
                    source={{ uri: d.profile_image || '' }}
                    style={styles.dropdownItemImage}
                  />
                )
              }))}
              value={selectedDriver}
              setValue={setSelectedDriver}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholder="Select driver"
              listMode="SCROLLVIEW"
              ListItemComponent={({ item }) => (
                <View style={styles.dropdownItem}>
                  {item.icon && item.icon()}
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </View>
              )}
            />
          </View>

          {/* التواريخ */}
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={handleStartDatePress}
              >
                <Text style={styles.dateButtonText}>{formatDateTime(tripData.scheduled_start)}</Text>
              </TouchableOpacity>
              {showStartDate && (
                <DateTimePicker
                  value={tripData.scheduled_start}
                  mode="datetime"
                  is24Hour={true}
                  onChange={onStartDateChange}
                  locale="en-US"
                  themeVariant="light"
                  textColor="#000000"
                  display="default"
                />
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>End Date *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={handleEndDatePress}
              >
                <Text style={styles.dateButtonText}>{formatDateTime(tripData.scheduled_end)}</Text>
              </TouchableOpacity>
              {showEndDate && (
                <DateTimePicker
                  value={tripData.scheduled_end}
                  mode="datetime"
                  is24Hour={true}
                  onChange={onEndDateChange}
                  minimumDate={tripData.scheduled_start}
                  locale="en-US"
                  themeVariant="light"
                  textColor="#000000"
                  display="default"
                />
              )}
            </View>
          </View>

          {/* المواقع */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Location *</Text>
            <LocationSearch 
              placeholder="Search for start location"
              onLocationSelect={handleStartLocationSelect}
              onMapSelect={() => setShowStartMap(true)}
              position={0}
            />
            {startLocation && (
              <Text style={styles.selectedLocation}>
                Selected: {startLocation.address}
              </Text>
            )}
            <LocationMap
              visible={showStartMap}
              onClose={() => setShowStartMap(false)}
              onSelect={handleStartLocationSelect}
              initialLocation={startLocation}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>End Location *</Text>
            <LocationSearch 
              placeholder="Search for end location"
              onLocationSelect={handleEndLocationSelect}
              onMapSelect={() => setShowEndMap(true)}
              position={1}
            />
            {endLocation && (
              <Text style={styles.selectedLocation}>
                Selected: {endLocation.address}
              </Text>
            )}
            <LocationMap
              visible={showEndMap}
              onClose={() => setShowEndMap(false)}
              onSelect={handleEndLocationSelect}
              initialLocation={endLocation}
            />
          </View>

          {/* التكلفة والعائد */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Cost</Text>
              <TextInput
                style={styles.input}
                value={tripData.cost}
                onChangeText={(text) => setTripData({...tripData, cost: text})}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Revenue</Text>
              <TextInput
                style={styles.input}
                value={tripData.revenue}
                onChangeText={(text) => setTripData({...tripData, revenue: text})}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* الأولوية 
          <View style={[styles.halfInput, { zIndex: 1000 }]}>
            <Text style={styles.label}>Priority</Text>
            <DropDownPicker
              open={open}
              value={tripData.priority}
              items={[
                { label: 'Low', value: 0 },
                { label: 'Medium', value: 1 },
                { label: 'High', value: 2 },
              ]}
              setOpen={setOpen}
              setValue={(value) => {
                setTripData({...tripData, priority: value as unknown as number});
              }}
              dropDownDirection="BOTTOM"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholder="Select priority"
              listMode="SCROLLVIEW"
              zIndex={1000}
              zIndexInverse={3000}
            />
          </View>*/}

          {/* التكرار 
          <View style={styles.rowContainer}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Recurring</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  tripData.recurring && styles.toggleButtonActive
                ]}
                onPress={() => setTripData({...tripData, recurring: !tripData.recurring})}
              >
                <Text style={styles.toggleButtonText}>
                  {tripData.recurring ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>*/}

          {/* زر الحفظ */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Schedule Trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    </KeyboardWrapper>
  );
};


const styles = StyleSheet.create({
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
  resultsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 600,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 3000,
  },
  resultItem: {
    padding: 10,
  },
  resultText: {
    fontSize: 14,
  },
  loader: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  selectedLocation: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  mapButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    flex: 1,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mapCloseButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  mapTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownItemImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});