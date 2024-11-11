import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '@/app/screens/SplashScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;