import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function HomeTab() {
  return (
    <View style={styles.container}>
            <StatusBar barStyle='default' backgroundColor="#000" />
      <Text style={styles.text}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});