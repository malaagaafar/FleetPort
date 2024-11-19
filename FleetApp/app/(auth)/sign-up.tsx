import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    companyName: '',
  });

  const handleSignUp = async () => {
    try {
      console.log('البيانات المرسلة:', formData);

      const response = await fetch('http://919e-156-197-240-209.ngrok-free.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420',
          // إضافة رؤوس CORS
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          first_name: formData.firstName,      // تأكد من تطابق أسماء الحقول
          last_name: formData.lastName,        // مع ما يتوقعه الخادم
          email: formData.email,
          password: formData.password,
          phone_number: formData.phoneNumber,
          company_name: formData.companyName
        }),
      });

      // طباعة حالة الاستجابة
      console.log('حالة الاستجابة:', response.status);
      
      const responseText = await response.text();
      console.log('الاستجابة الخام:', responseText);

      if (responseText) {
        const responseData = JSON.parse(responseText);
        if (response.ok) {
          console.log('تم التسجيل بنجاح:', responseData);
        } else {
          console.error('فشل التسجيل:', responseData);
        }
      }
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
    }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>cPORT</Text>
        <Text style={styles.subTitle}>FleetManager</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputRow}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            />
          </View>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        />

        <Text style={styles.label}>Company Name (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={formData.companyName}
          onChangeText={(text) => setFormData({ ...formData, companyName: text })}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" style={styles.loginLink}>Login</Link>
        </View>
      </View>
    </View>
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
});