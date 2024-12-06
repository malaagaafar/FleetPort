import { StyleSheet, Text, View, Platform, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

export default function SplashScreen() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'Spantaran': require('../assets/fonts/Spantaran.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      const readyTimer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      const navigationTimer = setTimeout(() => {
        // تغيير مسار التوجيه إلى صفحة تسجيل الدخول
        router.replace("./(auth)/login");
      }, 3000);

      return () => {
        clearTimeout(navigationTimer);
        clearTimeout(readyTimer);
      };
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#001F3F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>cPORT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        opacity: 1, // تأكيد الشفافية الكاملة
        color: '#001F3F',
        fontSize: 48,
        fontWeight: Platform.OS === 'ios' ? '500' : 'regular',
        letterSpacing: -1,
        fontFamily: 'Spantaran',
    }
});