import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux'; // إضافة هذا السطر
import { setCredentials } from '../../store/slices/authSlice'; // تأكد من مسار الاستيراد الصحيح
import { KeyboardWrapper } from '../../components/KeyboardWrapper';

export default function LoginScreen() {
    const dispatch = useDispatch(); // إضافة هذا السطر
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    ;

    const handleLogin = async () => {
        try {
            const response = await fetch('https://hookworm-primary-nicely.ngrok-free.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': '69420'
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (response.ok) {
                // تخزين الـ token
                await AsyncStorage.setItem('userToken', responseData.token);
                await AsyncStorage.setItem('userData', JSON.stringify(responseData.user));
                
                dispatch(setCredentials({ user: responseData.user, token: responseData.token })); // إضافة هذا السطر

                console.log('تم تسجيل الدخول بنجاح:', responseData);
                router.replace('/(tabs)');
            } else {
                Alert.alert(
                    "خطأ في تسجيل الدخول",
                    responseData.message || "حدث خطأ غير متوقع"
                );
            }
        } catch (error) {
            console.error('خطأ في الاتصال:', error);
            Alert.alert(
                "خطأ",
                "حدث خطأ في الاتصال بالخادم"
            );
        }
    };
    
    return (
        <KeyboardWrapper>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>cPORT</Text>
                    <Text style={styles.subText}>FleetManager</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Email or Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email or Phone Number"
                        autoCapitalize="none"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                    />

                    <TouchableOpacity 
                        style={styles.loginButton} 
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Do not have an account? </Text>
                        <Link href="./sign-up" style={styles.signupLink}>Sign Up</Link>
                    </View>
                </View>
            </View>
        </KeyboardWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 100,
        marginBottom: 50,
    },
    logoText: {
        color: '#001F3F',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'Spantaran',
        marginBottom: 5,
    },
    subText: {
        fontSize: 16,
        color: '#333',
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#fff',
        height: 45,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    loginButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#333',
    },
    signupLink: {
        color: '#0066CC',
        fontWeight: '500',
    }
});