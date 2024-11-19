/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/sign-in` | `/(auth)/sign-up` | `/(inputs)/AddDriver` | `/(inputs)/AddExpense` | `/(inputs)/AddPartner` | `/(inputs)/AddVehicle` | `/(inputs)/ScheduleService` | `/(inputs)/ScheduleTrip` | `/(screens)/ActiveVehiclesScreen` | `/(screens)/AlertsScreen` | `/(screens)/DriverInfo` | `/(screens)/EventsScreen` | `/(screens)/FinancialScreen` | `/(screens)/InactiveVehiclesScreen` | `/(screens)/SplashScreen` | `/(screens)/TripInfo` | `/(screens)/TripsScreen` | `/(screens)/VehicleInfo` | `/(tabs)` | `/(tabs)/` | `/(tabs)/live` | `/(tabs)/manage` | `/(tabs)/menu` | `/(tabs)/partner` | `/ActiveVehiclesScreen` | `/AddDriver` | `/AddExpense` | `/AddPartner` | `/AddVehicle` | `/AlertsScreen` | `/DriverInfo` | `/EventsScreen` | `/FinancialScreen` | `/InactiveVehiclesScreen` | `/ScheduleService` | `/ScheduleTrip` | `/SplashScreen` | `/TripInfo` | `/TripsScreen` | `/VehicleInfo` | `/_sitemap` | `/live` | `/manage` | `/menu` | `/navigation/AppNavigator` | `/partner` | `/sign-in` | `/sign-up`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
