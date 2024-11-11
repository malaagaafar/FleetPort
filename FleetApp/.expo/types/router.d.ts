/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/sign-in` | `/(auth)/sign-up` | `/(tabs)` | `/(tabs)/` | `/(tabs)/live` | `/(tabs)/manage` | `/(tabs)/menu` | `/(tabs)/partner` | `/_sitemap` | `/live` | `/manage` | `/menu` | `/navigation/AppNavigator` | `/partner` | `/screens/SplashScreen` | `/sign-in` | `/sign-up`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
