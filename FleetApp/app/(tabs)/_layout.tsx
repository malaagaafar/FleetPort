import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, View, TouchableOpacity, StatusBar } from 'react-native';

function HeaderRight() {
  return (
    <View style={{ 
      flexDirection: 'row', 
      gap: 15,
      marginRight: 15,
      alignItems: 'center',
    }}>
      <TouchableOpacity>
        <Image 
          source={require('../../assets/icons/search.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('../(screens)/FinancialScreen')}>
        <Image 
          source={require('../../assets/icons/coin.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('../(screens)/AlertsScreen')}>
        <Image 
          source={require('../../assets/icons/bell.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
function LiveHeader() {
  return (
    <View style={{ 
      flexDirection: 'row', 
      gap: 15,
      marginRight: 15,
      alignItems: 'center',
    }}>
      <TouchableOpacity onPress={() => router.push('../(inputs)/ScheduleTrip')}>
        <Image 
          source={require('../../assets/icons/plus.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image 
          source={require('../../assets/icons/loupe.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

function MenuHeader() {
  return (
    <View style={{ 
      flexDirection: 'row', 
      gap: 15,
      marginRight: 15,
      alignItems: 'center',
    }}>
      <TouchableOpacity>
        <Image 
          source={require('../../assets/icons/setting.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image 
          source={require('../../assets/icons/search.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
function DevicesHeader() {
  return (
    <View style={{ 
      flexDirection: 'row', 
      gap: 16,
      marginRight: 15,
      alignItems: 'center',
    }}>
      <TouchableOpacity>
        <Image 
          source={require('../../assets/icons/belld.png')}
          style={{
            width: 18,
            height: 20,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('../(screens)/cart')}>
        <Image 
          source={require('../../assets/icons/shopping-cart.png')}
          style={{
            width: 22,
            height: 21,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('../(screens)/orders/orders')}>
        <Image 
          source={require('../../assets/icons/menud.png')}
          style={{
            width: 22,
            height: 16,
          }}
        />
      </TouchableOpacity>
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
          title: 'cPORT',  // يمكنك استخدام صورة الشعار بدلاً من النص
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
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live',
          headerTitleStyle: {
            fontFamily: 'Spantaran',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000033',
            marginLeft: 0,
            paddingLeft: 2,
          },
          headerRight: () => <LiveHeader />,
          headerTransparent: true,
          headerBackground: () => (
            <View style={{ 
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.0)'
            }} />
          ),
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/icons/gps-aa.png')
                : require('../../assets/icons/gps-o.png')
              }
              style={{
                width: 24,
                height: 24,
              }}
            />
          ),
          tabBarLabel: 'Live',
          tabBarActiveTintColor: '#08DF5E',
          tabBarLabelStyle: {
            fontWeight: 'bold'
          },
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Manage',  // يمكنك استخدام صورة الشعار بدلاً من النص
          headerTitleStyle: {
            fontFamily: 'Spantaran',  // تأكد من تحميل الخط الصحيح
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000033',
            marginLeft: 0,  // إضافة هذا السطر
            paddingLeft: 2, // إضافة هذا السطر
          },
          headerRight: () => <LiveHeader />,
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/icons/manage-a.png')
                : require('../../assets/icons/manage-o.png')
              }
              style={{
                width: 24,
                height: 24,
                //tintColor: focused ? '#000' : '#666'
              }}
            />
          ),
          tabBarLabel: 'Manage',
        }}
      />
      <Tabs.Screen
        name="partner"
        options={{
          title: 'Partner',  // يمكنك استخدام صورة الشعار بدلاً من النص
          headerTitleStyle: {
            fontFamily: 'Spantaran',  // تأكد من تحميل الخط الصحيح
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000033',
            marginLeft: 0,  // إضافة هذا السطر
            paddingLeft: 2, // إضافة هذا السطر
          },
          headerRight: () => <LiveHeader />,
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/icons/partners-a.png')
                : require('../../assets/icons/partners-o.png')
              }
              style={{
                width: 24,
                height: 24,
              }}
            />
          ),
          tabBarLabel: 'Partner',
          }}
        />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Devices',  // يمكنك استخدام صورة الشعار بدلاً من النص
          headerTitleStyle: {
            fontFamily: 'Spantaran',  // تأكد من تحميل الخط الصحيح
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000033',
            marginLeft: 0,  // إضافة هذا السطر
            paddingLeft: 2, // إضافة هذا السطر
          },
          headerRight: () => <DevicesHeader />,
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/icons/device1.png')
                : require('../../assets/icons/device0.png')
              }
              style={{
                width: 24,
                height: 24,
                //tintColor: focused ? '#000' : '#666'
              }}
            />
          ),
          tabBarLabel: 'Devices',
        }}
      />
    </Tabs>
    </>
  );
}