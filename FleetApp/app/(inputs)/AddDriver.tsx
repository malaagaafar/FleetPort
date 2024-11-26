import { View, StyleSheet, TouchableOpacity, Text, TextInput, Button, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import api from '@/config/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const DriverForm = () => {
  const [open, setOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user.id);
    const [formData, setFormData] = useState({
        userId: userId,
        accountId: null,
        driverType: 'company',
        firstName: '',
        lastName: '',
        idNumber: '',
        birthDate: new Date(),
        phone: '',
        email: '',
        address: '',
        profileImage: '',
        emergencyContact: {},
        currentLocation: null,
        licenseNumber: '',
        licenseType: 'light',
        licenseExpiry: new Date(),
        licenseIssueDate: new Date(),
        hazmatCertified: false,
        experienceYears: 0,
        hireDate: new Date(),
        status: 'inactive',
        currentVehicleId: null,
        totalTrips: 0,
        totalDistance: 0,
        rating: 0,
        employmentStatus: '',
        preferences: {},
        skills: [],
        documents: [],
        certifications: [],
        notes: '',
    });

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('/drivers', formData);
            console.log('Driver created:', response.data);
            alert('تم إنشاء السائق بنجاح!');
        } catch (error) {
            console.error('Error creating driver:', error);
            alert('حدث خطأ أثناء إنشاء السائق. يرجى المحاولة مرة أخرى.');
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
                        <Text style={styles.label}>First Name</Text>
                        <TextInput placeholder="First Name" onChangeText={(value) => handleChange('firstName', value)} style={styles.input} />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput placeholder="Last Name" onChangeText={(value) => handleChange('lastName', value)} style={styles.input} />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>ID Number</Text>
                        <TextInput placeholder="ID Number" onChangeText={(value) => handleChange('idNumber', value)} style={styles.input} />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput placeholder="Phone" onChangeText={(value) => handleChange('phone', value)} style={styles.input} />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput placeholder="Email" onChangeText={(value) => handleChange('email', value)} style={styles.input} />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>License Number</Text>
                        <TextInput placeholder="License Number" onChangeText={(value) => handleChange('licenseNumber', value)} style={styles.input} />
                    </View>
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
    halfInput: {
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: 8,
    },
});

export default DriverForm;