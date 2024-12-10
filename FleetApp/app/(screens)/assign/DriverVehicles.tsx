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
export default function DriverVehiclesAssignment() {
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);

    // حالة القوائم المنسدلة
    const [vehicleOpen, setVehicleOpen] = useState(false);
    const [driverOpen, setDriverOpen] = useState(false);
    const [orderOpen, setOrderOpen] = useState(false);

    // القيم المحددة
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [assignmentOrder, setAssignmentOrder] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const vehiclesRes = await api.get(`/vehicles/for-assignment?userId=${userId}`);
                const driversRes = await api.get(`/drivers/for-assignment?userId=${userId}`);

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

                setDrivers(driversRes.data.drivers.map(d => ({
                    label: `${d.first_name} ${d.last_name}`,
                    value: d.id,
                    icon: () => (
                        <Image 
                            source={{ uri: d.profile_image || '' }}
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
        if (!selectedVehicle || !selectedDriver || !assignmentOrder) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            await api.post('/assignments/driver-vehicles', {
                vehicleId: selectedVehicle,
                driverId: selectedDriver,
                assignmentOrder,
                startDate: new Date(),
                endDate: null,
                isPrimary: assignmentOrder === 1
            });
            Alert.alert('Success', 'Assignment created successfully');
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
            <Text style={styles.headerTitle}>Assign Driver to Vehicle</Text>
            <View style={styles.headerRight} />
        </View>
    );

    return (
        <KeyboardWrapper>
            <SafeAreaView style={styles.safeArea}>
                {renderHeader()}
            <View style={styles.container}>
                <View style={styles.form}>
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
                        zIndex={3000}
                        ListItemComponent={({ item }) => (
                            <View style={styles.dropdownItem}>
                                {item.icon && item.icon()}
                                <Text style={styles.dropdownItemText}>{item.label}</Text>
                            </View>
                        )}
                    />

                    <Text style={styles.label}>Driver</Text>
                    <DropDownPicker
                        open={driverOpen}
                        value={selectedDriver}
                        items={drivers}
                        setOpen={setDriverOpen}
                        setValue={setSelectedDriver}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        placeholder="Select driver"
                        zIndex={2000}
                        ListItemComponent={({ item }) => (
                            <View style={styles.dropdownItem}>
                                {item.icon && item.icon()}
                                <Text style={styles.dropdownItemText}>{item.label}</Text>
                            </View>
                        )}
                    />

                    <Text style={styles.label}>Assignment Order</Text>
                    <DropDownPicker
                        open={orderOpen}
                        value={assignmentOrder}
                        items={[
                            { label: "Primary Driver", value: 1 },
                            { label: "First Backup", value: 2 },
                            { label: "Second Backup", value: 3 },
                            { label: "Third Backup", value: 4 }
                        ]}
                        setOpen={setOrderOpen}
                        setValue={setAssignmentOrder}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        placeholder="Select order"
                        zIndex={1000}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.saveButton}
                            onPress={handleSubmit}
                            disabled={loading || !selectedVehicle || !selectedDriver || !assignmentOrder}
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
});