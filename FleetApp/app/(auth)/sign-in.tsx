import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
    const handleLogin = () => {
        // الانتقال مباشرة إلى الصفحة الرئيسية
        router.replace('/(tabs)');
        };
    
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>cPORT</Text>
        <Text style={styles.subText}>FleetManager</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Do not have an account? </Text>
          <Link href="./sign-up" style={styles.signupLink}>Sign up</Link>
        </View>
      </View>
    </View>
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