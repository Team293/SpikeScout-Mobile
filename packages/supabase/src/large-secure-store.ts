import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';

// Original encryption-based implementation is commented out
// ... [existing commented code] ...

interface SecureStoreState {
    data: Record<string, string>;
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => string | null;
    removeItem: (key: string) => Promise<void>;
}

// Create the Zustand store with proper persistence configuration
const useSecureStore = create<SecureStoreState>(
    persist(
        (set, get) => ({
          data: {},
          setItem: async (key, value) => {
            set((state) => ({
              data: { ...state.data, [key]: value }
            }));
          },
          getItem: (key) => {
            const state = get();
            return state.data[key] || null;
          },
          removeItem: async (key) => {
            set((state) => {
              const newData = { ...state.data };
              delete newData[key];
              return { data: newData };
            });
          },
        }),
        {
          name: 'large-secure-store',
          storage: createJSONStorage(() => AsyncStorage),
          // Make sure the store is initialized before being accessed
          skipHydration: false,
        }
    )
);

// Initialize the store immediately to ensure hydration
useSecureStore.getState();

export class LargeSecureStore {
    // Make getItem synchronous to match Supabase's expected interface
    async getItem(key: string): Promise<string | null> {
        return useSecureStore.getState().getItem(key);
    }
    
    async setItem(key: string, value: string): Promise<void> {
        await useSecureStore.getState().setItem(key, value);
    }
    
    async removeItem(key: string): Promise<void> {
        await useSecureStore.getState().removeItem(key);
    }
}