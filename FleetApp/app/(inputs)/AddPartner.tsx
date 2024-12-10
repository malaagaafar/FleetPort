import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { Stack, router } from 'expo-router';
import { KeyboardWrapper } from '../../components/KeyboardWrapper'; 

export default function AddPartner() {
  return (
    <KeyboardWrapper>
      <Stack.Screen 
        options={{    
          headerShown: true,
          title: 'Add Partner',
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
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text>Save</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        <Text>Add Partner Screen Content</Text>
      </View>
    </KeyboardWrapper>
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