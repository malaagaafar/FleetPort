import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/store/store';
import api from '../../../config/api';
import { KeyboardWrapper } from '../../../components/KeyboardWrapper';

export default function DeviceVehicleAssignment() {
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const [vehicles, setVehicles] = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dropdown states
    const [vehicleOpen, setVehicleOpen] = useState(false);
    const [deviceOpen, setDeviceOpen] = useState(false);

    // Selected values
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [vehiclesRes, devicesRes] = await Promise.all([
                    api.get(`/vehicles/available-for-all-devices?userId=${userId}`),
                    api.get(`/purchase/available-devices?userId=${userId}`)
                ]);
                console.log(vehiclesRes.data.vehicles);
                setVehicles(vehiclesRes.data.vehicles.map(v => ({
                    label: `${v.name} - ${v.plate_number}`,
                    value: v.id,
                    icon: () => (
                        <Image 
                            source={{ uri: v.vehicle_image || '' }}
                            style={styles.dropdownItemImage}
                        />
                    )
                })));

                setDevices(devicesRes.data.devices.map(d => ({
                    label: `${d.name} - ${d.serial_number}`,
                    value: d.serial_number,
                    icon: () => (
                        <Image 
                            source={{ uri: d.image_url || '' }}
                            style={styles.dropdownItemImage}
                        />
                    )
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    const handleSubmit = async () => {
        if (!selectedVehicle || !selectedDevice) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            await api.post('/purchase/assign-device', {
                deviceSerial: selectedDevice,
                vehicleId: selectedVehicle,
                userId
            });
            Alert.alert('Success', 'Device assigned to vehicle successfully');
            router.back();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Assign Device to Vehicle</Text>
            <View style={styles.headerRight} />
        </View>
    );

    return (
        <KeyboardWrapper>
            <SafeAreaView style={styles.safeArea}>
                {renderHeader()}
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.label}>Device</Text>
                    <DropDownPicker
                        open={deviceOpen}
                        value={selectedDevice}
                        items={devices}
                        setOpen={setDeviceOpen}
                        setValue={setSelectedDevice}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        placeholder="Select device"
                        zIndex={3000}
                        ListItemComponent={({ item }) => (
                            <View style={styles.dropdownItem}>
                                {item.icon && item.icon()}
                                <Text style={styles.dropdownItemText}>{item.label}</Text>
                            </View>
                        )}
                    />

                    <Text style={styles.label}>Vehicle</Text>
                    <DropDownPicker
                        open={vehicleOpen}
                        value={selectedVehicle}
                        items={vehicles}
                        setOpen={setVehicleOpen}
                        setValue={setSelectedVehicle}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        placeholder="Select vehicle"
                        zIndex={2000}
                        ListItemComponent={({ item }) => (
                            <View style={styles.dropdownItem}>
                                {item.icon && item.icon()}
                                <Text style={styles.dropdownItemText}>{item.label}</Text>
                            </View>
                        )}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[
                                styles.saveButton,
                                (!selectedVehicle || !selectedDevice || loading) && styles.disabledButton
                            ]}
                            onPress={handleSubmit}
                            disabled={loading || !selectedVehicle || !selectedDevice}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
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
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerRight: {
        width: 40,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    form: {
        gap: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 0,
        color: '#000',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        marginBottom: 16,
        height: 60,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 30,
    },
    cancelButton: {
        flex: 1,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#0066CC',
    },
    saveButton: {
        flex: 1,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#0066CC',
    },
    cancelButtonText: {
        color: '#0066CC',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
    disabledButton: {
        opacity: 0.5,
    }
}); 