import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppSelector } from '../store/hooks';

export function useAuth() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/sign-in');
    }
  }, [isAuthenticated]);

  return { isAuthenticated, user };
}