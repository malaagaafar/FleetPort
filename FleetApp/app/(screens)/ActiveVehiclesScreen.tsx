import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { Stack, router } from 'expo-router';

export default function ActiveVehiclesScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Active Vehicles',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Image 
                source={require('../../assets/icons/prev.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        <Text>Active Vehicles Screen Content</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
});