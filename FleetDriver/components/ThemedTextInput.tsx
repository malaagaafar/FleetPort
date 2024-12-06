   // components/ThemedTextInput.tsx
   import React from 'react';
   import { TextInput, TextInputProps, StyleSheet } from 'react-native';

   export function ThemedTextInput(props: TextInputProps) {
     return <TextInput style={styles.input} {...props} />;
   }

   const styles = StyleSheet.create({
     input: {
       height: 40,
       borderColor: '#ccc',
       borderWidth: 1,
       borderRadius: 5,
       paddingHorizontal: 10,
       marginBottom: 10,
     },
   });