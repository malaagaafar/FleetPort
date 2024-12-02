import { View, StyleSheet, TouchableOpacity, Text, TextInput, Button, ScrollView, Alert, Image, Modal } from 'react-native';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/config/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';

const DriverForm = () => {
    const userId = useSelector((state: RootState) => state.auth.user.id);
    const [imageUri, setImageUri] = useState('');
    
    const [formData, setFormData] = useState({
        userId: userId,
        firstName: '',
        lastName: '',
        idNumber: '',
        birthDate: new Date(),
        phone: '',
        email: '',
        address: '',
        licenseNumber: '',
        licenseType: '',
        licenseExpiry: new Date(),
        licenseIssueDate: new Date(),
        experienceYears: '',
        profile_image: '',
        status: 'inactive',
        username: '',
        password: '',
    });

    const [open, setOpen] = useState(false);
    const [licenseType, setLicenseType] = useState('');

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
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
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImageUri(imageUri);
            handleChange('profile_image', imageUri);
        }
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.idNumber || !formData.phone) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        try {
            const formDataWithLicenseType = { ...formData, licenseType };
            const response = await api.post('/drivers/company', formDataWithLicenseType);
            Alert.alert('Success', 'Driver has been created successfully!');
            router.back();
        } catch (error: any) {
            console.error('Error creating driver:', error);
            Alert.alert('Error', 'An error occurred while creating the driver.');
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Add Driver',
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
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Profile Image (Optional)</Text>
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

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            placeholder="Enter First Name"
                            onChangeText={(value) => handleChange('firstName', value)}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            placeholder="Enter Last Name"
                            onChangeText={(value) => handleChange('lastName', value)}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>ID Number</Text>
                        <TextInput
                            placeholder="Enter ID Number"
                            onChangeText={(value) => handleChange('idNumber', value)}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            placeholder="Enter Phone Number"
                            onChangeText={(value) => handleChange('phone', value)}
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Email (Optional)</Text>
                        <TextInput
                            placeholder="Enter Email"
                            onChangeText={(value) => handleChange('email', value)}
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    </View>

                    
                    <View style={[styles.halfInput, { zIndex: 1000 }]}>
                        <Text style={styles.label}>License Type</Text>
                        <DropDownPicker
                            open={open}
                            value={licenseType}
                            items={[
                                { label: 'Choose License Type', value: '' },
                                { label: 'Light', value: 'light' },
                                { label: 'Medium', value: 'medium' },
                                { label: 'Heavy', value: 'heavy' },
                                { label: 'Hazmat', value: 'hazmat' },
                                { label: 'Special', value: 'special' },
                            ]}
                            setOpen={setOpen}
                            setValue={setLicenseType}
                            dropDownDirection="BOTTOM"
                            style={styles.dropDownPicker}
                            containerStyle={styles.dropDownContainer}
                            listMode="SCROLLVIEW"
                            zIndex={1000}
                            zIndexInverse={3000}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>License Number</Text>
                        <TextInput
                            placeholder="Enter License Number"
                            onChangeText={(value) => handleChange('licenseNumber', value)}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Experience Years</Text>
                        <TextInput
                            placeholder="Enter Experience Years"
                            onChangeText={(value) => handleChange('experienceYears', value)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            placeholder="Enter Username"
                            onChangeText={(value) => handleChange('username', value)}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            placeholder="Enter Password"
                            onChangeText={(value) => handleChange('password', value)}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>
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
        borderRadius: 50,
        marginTop: 10,
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
});

export default DriverForm;