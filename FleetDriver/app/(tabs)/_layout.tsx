// app/(tabs)/_layout.tsx
import { router, Tabs } from 'expo-router';
import { Image, View, TouchableOpacity, StatusBar } from 'react-native';


function HeaderRight() {
  return (
    <View style={{ 
      flexDirection: 'row', 
      gap: 15,
      marginRight: 15,
      alignItems: 'center',
    }}>
    </View>
  );
}
export default function TabsLayout() {
  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
          height: 80,
          //elevation: 0,          // لإزالة الظل في Android
          //shadowOpacity: 0,      // لإزالة الظل في iOS
          //borderBottomWidth: 0,  // لإزالة الخط السفلي
        },
        headerTitleStyle: {
          fontFamily: 'Spantaran',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#000033',
        },
        headerTitleAlign: 'left',  // إضافة هذا السطر
        headerLeftContainerStyle: {
          paddingLeft: 5,  // إضافة مسافة من اليسار
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        tabBarActiveTintColor: '#000',  // لون النص عندما يكون نشطاً
        tabBarInactiveTintColor: '#666', // لون النص عندما يكون غير نشط
        tabBarLabelStyle: {
          fontWeight: '600',  // سيتم تطبيقه على جميع التسميات
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'cPORT Driver',  // يمكنك استخدام صورة الشعار بدلاً من النص
          headerTitleStyle: {
            fontFamily: 'Spantaran',  // تأكد من تحميل الخط الصحيح
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000033',
            marginLeft: 0,  // إضافة هذا السطر
            paddingLeft: 2, // إضافة هذا السطر
          },
          headerRight: () => <HeaderRight />,
          tabBarIcon: ({ focused }) => (
            <Image 
            source={focused 
              ? require('../../assets/icons/home-button-a.png')
              : require('../../assets/icons/home-button-o.png')
            }
            style={{
              width: 24,
              height: 24,
            }}
          />
          ),
            tabBarLabel: 'Home',
          }}
        />
    </Tabs>
    </>
  );
}