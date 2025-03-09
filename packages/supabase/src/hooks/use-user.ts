import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQuery } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

const queryKey = ['supabase', 'user'];
const USER_STORAGE_KEY = '@supabase_user';

async function saveUserToStorage(user: any) {
  try {
    if (user) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
}

async function getUserFromStorage() {
  try {
    const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
}

export function useUser() {
  const network = useNetInfo();
  const client = useSupabase();

  const queryFn = async () => {
    if (network.isConnected) {
      const response = await client.auth.getUser();

      // this is most likely a session error or the user is not logged in
      if (response.error) {
        return null;
      }

      if (response.data?.user) {
        // save user to local storage for offline use
        await saveUserToStorage(response.data.user);
        return response.data.user;
      }

      return Promise.reject(new Error('Unexpected result format'));
    }

    return await getUserFromStorage();
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: true,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnMount: network.isConnected ?? false,
    refetchOnReconnect: true,
    networkMode: network.isConnected ? 'online' : 'always',
  });
}
