import { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';

export default function SplashScreen() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // تحريك الشعار
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );

    // التحقق من حالة تسجيل الدخول بعد 3 ثواني
    const timer = setTimeout(checkAuth, 3000);
    return () => clearTimeout(timer);
  }, []);

  const checkAuth = async () => {
    try {
      // تلاشي تدريجي للشعار
      opacity.value = withTiming(0, { duration: 500 });
      
      const driverData = await SecureStore.getItemAsync('driver');
      if (driverData) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/(auth)/login');
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Text style={styles.logo}>cPORT</Text>
        <Text style={styles.subTitle}>Fleet Driver</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 24,
    color: '#666',
  }
}); 