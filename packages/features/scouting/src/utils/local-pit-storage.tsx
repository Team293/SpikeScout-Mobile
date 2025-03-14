import AsyncStorage from '@react-native-async-storage/async-storage';

import { PitData } from '../lib/hooks/pit/use-submit-pit-form';

const LOCAL_PIT_DATA_KEY = '@local_pit_data';

export async function getLocalPitData(): Promise<PitData[]> {
  try {
    const data = await AsyncStorage.getItem(LOCAL_PIT_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting local pit data:', error);
    return [];
  }
}

export async function saveLocalPitData(pitData: PitData[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCAL_PIT_DATA_KEY, JSON.stringify(pitData));
  } catch (error) {
    console.error('Error saving local pit data:', error);
  }
}

export async function addLocalPitData(newMatch: PitData): Promise<void> {
  try {
    const currentData = await getLocalPitData();
    const updatedData = [...currentData, newMatch];
    await saveLocalPitData(updatedData);
  } catch (error) {
    console.error('Error adding local pit data:', error);
  }
}

export async function clearLocalPitData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOCAL_PIT_DATA_KEY);
  } catch (error) {
    console.error('Error clearing local pit data:', error);
  }
}

export async function removePitScoutsFromLocalStorage(
  pitScoutsToRemove: PitData[],
): Promise<void> {
  try {
    const currentData = await getLocalPitData();

    // Create a unique identifier for each match to compare
    const createMatchId = (entry: PitData) =>
      `${entry.teamId}-${entry.teamNumber}`;

    const matchIdsToRemove = new Set(pitScoutsToRemove.map(createMatchId));

    const filteredData = currentData.filter(
      (match) => !matchIdsToRemove.has(createMatchId(match)),
    );

    await saveLocalPitData(filteredData);
  } catch (error) {
    console.error('Error removing pit scout from local storage:', error);
  }
}
