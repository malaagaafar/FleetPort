import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useState } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import api from '@/config/api';
import { RootState } from '@/store/store';
import { debounce } from 'lodash';

export default function AddGeofence() {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [radius, setRadius] = useState('100');
  const [center, setCenter] = useState({
    latitude: 43.7184,
    longitude: -79.5181
  });
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleMapPress = (e) => {
    setCenter(e.nativeEvent.coordinate);
  };

  const searchAddress = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching address:', error);
      Alert.alert('Error', 'Failed to search address');
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = debounce(searchAddress, 500);

  const handleAddressChange = (text) => {
    setAddress(text);
    debouncedSearch(text);
  };

  const handleSelectLocation = (item) => {
    const newCenter = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon)
    };
    setCenter(newCenter);
    setAddress(item.display_name);
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    try {
      if (!name || !radius) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      const response = await api.post('/geofences', {
        name,
        description,
        radius: parseFloat(radius),
        center: {
          type: 'Point',
          coordinates: [center.longitude, center.latitude]
        },
        user_id: userId
      });

      if (response.data.success) {
        Alert.alert('Success', 'Geofence created successfully');
        router.back();
      }
    } catch (error) {
      console.error('Error creating geofence:', error);
      Alert.alert('Error', 'Failed to create geofence');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <MapView
        style={styles.map}
        initialRegion={{
          ...center,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        <Marker coordinate={center} />
        <Circle
          center={center}
          radius={parseFloat(radius)}
          fillColor="rgba(0, 0, 255, 0.1)"
          strokeColor="rgba(0, 0, 255, 0.5)"
        />
      </MapView>

      <ScrollView style={styles.formContainer}>
        <View style={styles.form}>
            
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter geofence name"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Search Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Search by address"
              value={address}
              onChangeText={handleAddressChange}
            />
            {isSearching && (
              <ActivityIndicator style={styles.searchingIndicator} />
            )}
            {searchResults.length > 0 && (
              <View style={styles.searchResults}>
                {searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.searchResultItem}
                    onPress={() => handleSelectLocation(result)}
                  >
                    <Text style={styles.searchResultText}>
                      {result.display_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Radius (meters) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter radius in meters"
              value={radius}
              onChangeText={setRadius}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Create Geofence</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: '50%',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchingIndicator: {
    position: 'absolute',
    right: 10,
    top: 45,
  },
  searchResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1000,
    maxHeight: 200,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 14,
    color: '#333',
  },
}); 