import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, View, TouchableOpacity } from 'react-native';

function HeaderRight() {
  return (
    <View style={{ 
      flexDirection: 'row', 
      gap: 15,
      marginRight: 15,
    }}>
      <TouchableOpacity>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="cash-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontFamily: 'Spantaran',
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
          title: 'cPORT',
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
          tabBarIcon: ({ focused }) => (
            <Image 
            source={focused 
              ? require('../../assets/icons/gps-a.png')
              : require('../../assets/icons/gps-o.png')
            }
            style={{
              width: 24,
              height: 24,
            }}
          />
          ),
          tabBarLabel: 'Live',
          tabBarActiveTintColor: '#08DF5E',  // لون أخضر عند التنشيط
          tabBarLabelStyle: {
            fontWeight: 'bold'
          },
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
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
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/icons/partners-a.png')
                : require('../../assets/icons/partners-o.png')
              }
              style={{
                width: 24,
                height: 24,
                //tintColor: focused ? '#000' : ''
              }}
            />
          ),
          tabBarLabel: 'Partner',
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/icons/menu-a.png')
                : require('../../assets/icons/menu-o.png')
              }
              style={{
                width: 24,
                height: 24,
                //tintColor: focused ? '#000' : '#666'
              }}
            />
          ),
          tabBarLabel: 'Menu',
        }}
      />
    </Tabs>
  );
}