import { View, StyleSheet, TouchableOpacity, Text, TextInput, Button, ScrollView, Alert, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/config/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const VehicleForm = () => {
    const [open, setOpen] = useState(false);
    const userId = useSelector((state: RootState) => state.auth.user.id);
    const [formData, setFormData] = useState({
        userId: userId,
        name: '',
        type: '',
        plateNumber: '',
        make: '',
        model: '',
        year: '',
        vin: '',
        registrationNumber: '',
        registrationExpiry: new Date(),
        insuranceNumber: '',
        insuranceExpiry: new Date(),
        status: 'active',
        mileage: 0,
        fuelType: 'petrol',
        fuelCapacity: 0,
        maxLoadWeight: 0,
        fuelTankCapacity: 0,
        currentOdometer: 0,
        documents: {},
        notes: '',
        specifications: {},
        vehicleImage: '',
    });

    const [value, setValue] = useState(formData.type);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [imageUri, setImageUri] = useState('');

    const handleChange = (name: string, value: string) => {
        if (formData[name] !== value) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'You need to grant camera roll permissions to upload images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImageUri(imageUri);
            handleChange('vehicleImage', imageUri);
        }
    };

    const handleSubmit = async () => {
        if (formData.name.trim() === '') {
            Alert.alert('Error', 'Please enter the vehicle name.');
            return;
        }

        try {
            const response = await api.post('/vehicles', formData);
            console.log('Vehicle created:', response.data);
            Alert.alert('Success', 'Vehicle has been created successfully!');
            router.back();
        } catch (error: any) {
            console.log(formData);
            console.error('Error creating vehicle:', error);
            if (error.response && error.response.status === 409) {
                Alert.alert('Error', 'The vehicle name already exists. Please choose another name.');
            } else {
                Alert.alert('Error', 'An error occurred while creating the vehicle. Please try again.');
            }
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Add Vehicle',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSubmit} style={styles.backButton}>
                            <Text>Save</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView>
                <View style={styles.container}>
                    {/* Vehicle Name Field */}
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Vehicle Name</Text>
                        <TextInput
                            placeholder="Enter Vehicle Name"
                            onChangeText={(value) => handleChange('name', value)}
                            style={styles.input}
                        />
                    </View>

                    {/* Image Picker */}
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Vehicle Image (Optional)</Text>
                        <TouchableOpacity 
                            onPress={handleImagePicker} 
                            style={styles.imagePickerButton}
                        >
                            <Text style={styles.imagePickerText}>Choose Image</Text>
                        </TouchableOpacity>
                        {imageUri ? (
                            <Image 
                                source={{ uri: imageUri }} 
                                style={styles.imagePreview} 
                            />
                        ) : null}
                    </View>

                    <View style={[styles.halfInput, { zIndex: 1000 }]}>
                        <Text style={styles.label}>Vehicle Type</Text>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={[
                                { label: 'Select Type', value: '' },
                                { label: 'Truck', value: 'truck' },
                                { label: 'Van', value: 'van' },
                                { label: 'Pickup', value: 'pickup' },
                                { label: 'Refrigerated', value: 'refrigerated' },
                                { label: 'Tanker', value: 'tanker' },
                                { label: 'Trailer', value: 'trailer' },
                                { label: 'Car', value: 'car' },
                                { label: 'Bus', value: 'bus' },
                                { label: 'Trailer Head', value: 'trailer_head' },
                            ]}
                            setOpen={setOpen}
                            setValue={setValue}
                            onChangeValue={(item) => handleChange('type', item)}
                            dropDownDirection="BOTTOM"
                            style={styles.dropDownPicker}
                            containerStyle={styles.dropDownContainer}
                            listMode="SCROLLVIEW"
                            zIndex={1000}
                            zIndexInverse={3000}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Make</Text>
                        <TextInput
                            placeholder="Make"
                            onChangeText={(value) => handleChange('make', value)}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Model</Text>
                        <TextInput
                            placeholder="Model"
                            onChangeText={(value) => handleChange('model', value)}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Year</Text>
                        <TextInput
                            placeholder="Year"
                            keyboardType="numeric"
                            onChangeText={(value) => handleChange('year', value)}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>VIN</Text>
                        <TextInput
                            placeholder="VIN"
                            onChangeText={(value) => handleChange('vin', value)}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Plate Number</Text>
                        <TextInput
                            placeholder="Plate Number"
                            onChangeText={(value) => handleChange('plateNumber', value)}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Registration Number</Text>
                        <TextInput
                            placeholder="Registration Number"
                            onChangeText={(value) => handleChange('registrationNumber', value)}
                            style={styles.input}
                        />
                    </View>
                    {/*<View style={styles.halfInput}>
                        <Text style={styles.label}>Registration Expiry</Text>
                        <TextInput placeholder="Registration Expiry" onChangeText={(value) => handleChange('registrationExpiry', value)} style={styles.input} />
                    </View>*/}
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Insurance Number</Text>
                        <TextInput
                            placeholder="Insurance Number"
                            onChangeText={(value) => handleChange('insuranceNumber', value)}
                            style={styles.input}
                        />
                    </View>
                    {/*<View style={styles.halfInput}>
                        <Text style={styles.label}>Insurance Expiry</Text>
                        <TextInput placeholder="Insurance Expiry" onChangeText={(value) => handleChange('insuranceExpiry', value)} style={styles.input} />
                    </View>*/}
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginTop: 0,
    },
    dropDownPicker: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    dropDownContainer: {
        zIndex: 1000,
        elevation: 10,
        overflow: 'visible',
    },
    halfInput: {
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: 8,
    },
    imagePickerButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 10,
    },
});

    export default VehicleForm;