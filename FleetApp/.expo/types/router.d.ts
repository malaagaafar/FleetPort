/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/sign-in` | `/(auth)/sign-up` | `/(inputs)/AddDriver` | `/(inputs)/AddExpense` | `/(inputs)/AddPartner` | `/(inputs)/AddVehicle` | `/(inputs)/ScheduleService` | `/(inputs)/ScheduleTrip` | `/(screens)/ActiveVehiclesScreen` | `/(screens)/AlertsScreen` | `/(screens)/DriverInfo` | `/(screens)/EventsScreen` | `/(screens)/FinancialScreen` | `/(screens)/InactiveVehiclesScreen` | `/(screens)/SplashScreen` | `/(screens)/TripInfo` | `/(screens)/TripsScreen` | `/(screens)/VehicleInfo` | `/(screens)/cart` | `/(screens)/checkout` | `/(screens)/checkouttest` | `/(screens)/order-confirmation` | `/(screens)/orders/orders` | `/(tabs)` | `/(tabs)/` | `/(tabs)/devices` | `/(tabs)/live` | `/(tabs)/manage` | `/(tabs)/partner` | `/ActiveVehiclesScreen` | `/AddDriver` | `/AddExpense` | `/AddPartner` | `/AddVehicle` | `/AlertsScreen` | `/DriverInfo` | `/EventsScreen` | `/FinancialScreen` | `/InactiveVehiclesScreen` | `/ScheduleService` | `/ScheduleTrip` | `/SplashScreen` | `/TripInfo` | `/TripsScreen` | `/VehicleInfo` | `/_sitemap` | `/cart` | `/checkout` | `/checkouttest` | `/devices` | `/live` | `/manage` | `/navigation/AppNavigator` | `/order-confirmation` | `/orders/orders` | `/partner` | `/services/checkoutService` | `/sign-in` | `/sign-up`;
      DynamicRoutes: `/(screens)/devices/${Router.SingleRoutePart<T>}` | `/(screens)/orders/${Router.SingleRoutePart<T>}` | `/devices/${Router.SingleRoutePart<T>}` | `/orders/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(screens)/devices/[id]` | `/(screens)/orders/[id]` | `/devices/[id]` | `/orders/[id]`;
    }
  }
}
