import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScoutingType } from '../types';

/**
 * Get the storage key for remote data cache
 */
export const getRemoteDataKey = (type: ScoutingType, teamId: string) => 
  `@remote_${type}_data_${teamId}`;

/**
 * Save remote data to cache
 */
export async function saveRemoteData<T extends any[]>(
  type: ScoutingType, 
  teamId: string, 
  data: T
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      getRemoteDataKey(type, teamId),
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(`Error caching remote ${type} data:`, error);
  }
}

/**
 * Get cached remote data
 */
export async function getCachedRemoteData<T extends any[]>(
  type: ScoutingType, 
  teamId: string,
  defaultValue: T = [] as unknown as T
): Promise<T> {
  try {
    const cachedData = await AsyncStorage.getItem(getRemoteDataKey(type, teamId));
    return cachedData ? JSON.parse(cachedData) : defaultValue;
  } catch (error) {
    console.error(`Error reading cached remote ${type} data:`, error);
    return defaultValue;
  }
} 