import AsyncStorage from '@react-native-async-storage/async-storage';

import { MatchData } from '../lib/hooks/match/use-submit-match-form';

const LOCAL_MATCH_DATA_KEY = '@local_match_data';

export async function getLocalMatchData(): Promise<MatchData[]> {
  try {
    const data = await AsyncStorage.getItem(LOCAL_MATCH_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting local match data:', error);
    return [];
  }
}

export async function saveLocalMatchData(
  matchData: MatchData[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCAL_MATCH_DATA_KEY, JSON.stringify(matchData));
  } catch (error) {
    console.error('Error saving local match data:', error);
  }
}

export async function addLocalMatchData(newMatch: MatchData): Promise<void> {
  try {
    const currentData = await getLocalMatchData();
    const updatedData = [...currentData, newMatch];
    await saveLocalMatchData(updatedData);
  } catch (error) {
    console.error('Error adding local match data:', error);
  }
}

export async function clearLocalMatchData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOCAL_MATCH_DATA_KEY);
  } catch (error) {
    console.error('Error clearing local match data:', error);
  }
}

export async function removeMatchesFromLocalStorage(
  matchesToRemove: MatchData[],
): Promise<void> {
  try {
    const currentData = await getLocalMatchData();

    // Create a unique identifier for each match to compare
    const createMatchId = (match: MatchData) =>
      `${match.teamId}-${match.matchNumber}-${match.teamNumber}-${match.teamLocation}`;

    const matchIdsToRemove = new Set(matchesToRemove.map(createMatchId));

    const filteredData = currentData.filter(
      (match) => !matchIdsToRemove.has(createMatchId(match)),
    );

    await saveLocalMatchData(filteredData);
  } catch (error) {
    console.error('Error removing matches from local storage:', error);
  }
}
