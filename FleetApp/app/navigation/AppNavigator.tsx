import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../(screens)/SplashScreen';
import TripsScreen from '../(screens)/TripsScreen';
import AlertsScreen from '../(screens)/AlertsScreen';
import FinancialScreen from '../(screens)/FinancialScreen';
import ActiveVehiclesScreen from '../(screens)/ActiveVehiclesScreen';
import InactiveVehiclesScreen from '../(screens)/InactiveVehiclesScreen';
import EventsScreen from '../(screens)/EventsScreen';
import TripInfo from '../(screens)/TripInfo';
import VehicleInfo from '../(screens)/VehicleInfo';
import DriverInfo from '../(screens)/DriverInfo';
import AddDriver from '../(inputs)/AddDriver'; 
import AddVehicle from '../(inputs)/AddVehicle';
import ScheduleTrip from '../(inputs)/ScheduleTrip';
import ScheduleService from '../(inputs)/ScheduleService';
import AddPartner from '../(inputs)/AddPartner';
import AddExpense from '../(inputs)/AddExpense';

const Stack = createNativeStackNavigator(); 

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Trips" component={TripsScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
      <Stack.Screen name="Financial" component={FinancialScreen} />
      <Stack.Screen name="ActiveVehicles" component={ActiveVehiclesScreen} />
      <Stack.Screen name="InactiveVehicles" component={InactiveVehiclesScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="TripInfo" component={TripInfo} />
      <Stack.Screen name="VehicleInfo" component={VehicleInfo} />
      <Stack.Screen name="DriverInfo" component={DriverInfo} />
      <Stack.Screen name="AddDriver" component={AddDriver} />
      <Stack.Screen name="AddVehicle" component={AddVehicle} />
      <Stack.Screen name="ScheduleTrip" component={ScheduleTrip} />
      <Stack.Screen name="ScheduleService" component={ScheduleService} />
      <Stack.Screen name="AddPartner" component={AddPartner} />
      <Stack.Screen name="AddExpense" component={AddExpense} />
    </Stack.Navigator>
  );
}

export default AppNavigator;