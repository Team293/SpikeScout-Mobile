import AsyncStorage from '@react-native-async-storage/async-storage';

import { MatchData, PitData, ScoutingType } from '../types';

type ScoutingDataType<T extends ScoutingType> = T extends 'match' ? MatchData : PitData;

const getStorageKey = (type: ScoutingType) => `@local_${type}_data`;

/**
 * Get local data from AsyncStorage
 */
export async function getLocalData<T extends ScoutingType>(
  type: T
): Promise<ScoutingDataType<T>[]> {
  try {
    const data = await AsyncStorage.getItem(getStorageKey(type));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting local ${type} data:`, error);
    return [];
  }
}

/**
 * Save local data to AsyncStorage
 */
export async function saveLocalData<T extends ScoutingType>(
  type: T,
  data: ScoutingDataType<T>[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(getStorageKey(type), JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving local ${type} data:`, error);
  }
}

/**
 * Add a new entry to local data
 */
export async function addLocalData<T extends ScoutingType>(
  type: T,
  newData: ScoutingDataType<T>,
): Promise<void> {
  try {
    const currentData = await getLocalData(type);
    const updatedData = [...currentData, newData];
    await saveLocalData(type, updatedData);
  } catch (error) {
    console.error(`Error adding local ${type} data:`, error);
  }
}

/**
 * Clear all local data
 */
export async function clearLocalData<T extends ScoutingType>(type: T): Promise<void> {
  try {
    await AsyncStorage.removeItem(getStorageKey(type));
  } catch (error) {
    console.error(`Error clearing local ${type} data:`, error);
  }
}

/**
 * Remove specific entries from local data
 */
export async function removeEntriesFromLocalStorage<T extends ScoutingType>(
  type: T,
  entriesToRemove: ScoutingDataType<T>[],
): Promise<void> {
  try {
    const currentData = await getLocalData(type);

    // Create a unique identifier for each entry to compare
    const createEntryId = (entry: ScoutingDataType<T>) => {
      if (type === 'match') {
        const matchData = entry as MatchData;
        return `${matchData.teamId}-${matchData.matchNumber}-${matchData.teamNumber}-${matchData.teamLocation}`;
      } else {
        const pitData = entry as PitData;
        return `${pitData.teamId}-${pitData.teamNumber}`;
      }
    };

    const entryIdsToRemove = new Set(entriesToRemove.map(createEntryId));

    const filteredData = currentData.filter(
      (entry) => !entryIdsToRemove.has(createEntryId(entry)),
    );

    await saveLocalData(type, filteredData);
  } catch (error) {
    console.error(`Error removing entries from local ${type} storage:`, error);
  }
} 