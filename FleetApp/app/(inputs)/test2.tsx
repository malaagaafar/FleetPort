import { View, StyleSheet, TouchableOpacity, Text, TextInput, Button, FlatList } from 'react-native';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker'; // استيراد المكتبة
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const VehicleForm = () => {
    const [open, setOpen] = useState(false); // حالة لفتح القائمة
    const userId = useSelector((state: RootState) => state.auth.user.id);
    const [formData, setFormData] = useState({
        userId: userId,
        type: '',
        plateNumber: '',
        make: '',
        model: '',
        year: '',
        vin: '',
        registrationNumber: '',
        registrationExpiry: '',
        insuranceNumber: '',
        insuranceExpiry: '',
        status: 'active',
        mileage: 0,
        fuelType: '',
        fuelCapacity: 0,
        maxLoadWeight: 0,
        fuelTankCapacity: 0,
        currentOdometer: 0,
        documents: {},
        notes: '',
        specifications: {}
    });

    const [value, setValue] = useState(formData.type); // حالة لتخزين القيمة المحددة

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/vehicles', formData); // إرسال البيانات إلى الخادم
            console.log('Vehicle created:', response.data);
            alert('تم إنشاء السيارة بنجاح!');
        } catch (error) {
            console.error('Error creating vehicle:', error);
            alert('حدث خطأ أثناء إنشاء السيارة. يرجى المحاولة مرة أخرى.');
        }
    };

    return (
        <>
            <Stack.Screen 
                options={{    
                    headerShown: true,
                    title: 'Add Vehicle',
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity 
                            onPress={handleSubmit} // حفظ البيانات عند الضغط
                            style={styles.backButton}
                        >
                            <Text>Save</Text>
                        </TouchableOpacity>
                    ),
                }} 
            />
            <FlatList
                data={[formData]} // تمرير البيانات إلى FlatList
                renderItem={({ item }) => (
                    <View style={styles.container}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Vehicle Type</Text>
                            <DropDownPicker
                                open={open} // استخدام الحالة لفتح القائمة
                                value={value} // استخدام الحالة لتخزين القيمة المحددة
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
                                setOpen={setOpen} // تعيين الحالة لفتح القائمة
                                setValue={setValue} // تعيين الحالة للقيمة المحددة
                                onChangeValue={item => handleChange('type', item)} // تحديث الحالة عند تغيير القيمة
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Make</Text>
                            <TextInput placeholder="Make" onChangeText={(value) => handleChange('make', value)} style={styles.input} />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Model</Text>
                            <TextInput placeholder="Model" onChangeText={(value) => handleChange('model', value)} style={styles.input} />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Year</Text>
                            <TextInput placeholder="Year" keyboardType="numeric" onChangeText={(value) => handleChange('year', value)} style={styles.input} />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>VIN</Text>
                            <TextInput placeholder="VIN" onChangeText={(value) => handleChange('vin', value)} style={styles.input} />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Plate Number</Text>
                            <TextInput placeholder="Plate Number" onChangeText={(value) => handleChange('plateNumber', value)} style={styles.input} />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Registration Number</Text>
                            <TextInput placeholder="Registration Number" onChangeText={(value) => handleChange('registrationNumber', value)} style={styles.input} />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Registration Expiry</Text>
                            <TextInput placeholder="Registration Expiry" onChangeText={(value) => handleChange('registrationExpiry', value)} style={styles.input} />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Insurance Number</Text>
                            <TextInput placeholder="Insurance Number" onChangeText={(value) => handleChange('insuranceNumber', value)} style={styles.input} />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Insurance Expiry</Text>
                            <TextInput placeholder="Insurance Expiry" onChangeText={(value) => handleChange('insuranceExpiry', value)} style={styles.input} />
                        </View>
                        <Button title="Submit" onPress={handleSubmit} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()} // تعيين مفتاح فريد لكل عنصر
            />
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    color: '#001F3F',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Spantaran',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  form: {
    flex: 1,
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
    marginBottom: 16,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
  },
  loginLink: {
    color: '#0066CC',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    flex: 0.48,
  },
  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
    backButton: {
        padding: 8,
        marginLeft: 8,
    },
});

export default VehicleForm;