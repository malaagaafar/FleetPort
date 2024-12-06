   // src/contexts/AuthContext.tsx
   import React, { createContext, useContext, useState, useEffect } from 'react';
   import * as SecureStore from 'expo-secure-store';
   import { router } from 'expo-router';

   type Driver = {
     id: string;
     name: string;
     // ... أي بيانات أخرى للسائق
   };

   type AuthContextType = {
     driver: Driver | null;
     signIn: (driver: Driver) => Promise<void>;
     signOut: () => Promise<void>;
     isLoading: boolean;
   };

   const AuthContext = createContext<AuthContextType>({
     driver: null,
     signIn: async () => {},
     signOut: async () => {},
     isLoading: true,
   });

   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [driver, setDriver] = useState<Driver | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       loadDriver();
     }, []);

     async function loadDriver() {
       try {
         const driverData = await SecureStore.getItemAsync('driver');
         if (driverData) {
           setDriver(JSON.parse(driverData));
         }
       } catch (error) {
         console.error('Error loading driver data:', error);
       } finally {
         setIsLoading(false);
       }
     }

     const signIn = async (driverData: Driver) => {
       try {
         await SecureStore.setItemAsync('driver', JSON.stringify(driverData));
         setDriver(driverData);
       } catch (error) {
         console.error('Error storing driver data:', error);
         throw error;
       }
     };

     const signOut = async () => {
       try {
         await SecureStore.deleteItemAsync('driver');
         setDriver(null);
         router.replace('/(auth)/login');
       } catch (error) {
         console.error('Error removing driver data:', error);
         throw error;
       }
     };

     return (
       <AuthContext.Provider value={{ driver, signIn, signOut, isLoading }}>
         {children}
       </AuthContext.Provider>
     );
   }

   export const useAuth = () => useContext(AuthContext);