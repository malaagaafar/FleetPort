   // components/ThemedButton.tsx
   import React from 'react';
   import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

   interface ThemedButtonProps {
     title: string;
     onPress: () => void;
     loading?: boolean;
     style?: object;
   }

   export const ThemedButton: React.FC<ThemedButtonProps> = ({ title, onPress, loading, style }) => {
     return (
       <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={loading}>
         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
       </TouchableOpacity>
     );
   };

   const styles = StyleSheet.create({
     button: {
       backgroundColor: '#007AFF',
       padding: 15,
       borderRadius: 5,
       alignItems: 'center',
     },
     buttonText: {
       color: '#fff',
       fontSize: 16,
       fontWeight: 'bold',
     },
   });