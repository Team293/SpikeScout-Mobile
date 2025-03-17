import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScoutingType } from '../types';

/**
 * Get the storage key for assignments
 */
export const getAssignmentsStorageKey = (type: ScoutingType, userId: string, teamId: string) =>
  `@${type}_assignments_${userId}_${teamId}`;

/**
 * Save assignments to AsyncStorage
 */
export async function saveAssignmentsToStorage<T extends any[]>(
  type: ScoutingType,
  userId: string,
  teamId: string,
  assignments: T
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      getAssignmentsStorageKey(type, userId, teamId),
      JSON.stringify(assignments)
    );
  } catch (error) {
    console.error(`Error saving ${type} assignments to storage:`, error);
  }
}

/**
 * Get assignments from AsyncStorage
 */
export async function getAssignmentsFromStorage<T extends any[]>(
  type: ScoutingType,
  userId: string,
  teamId: string,
  defaultValue: T = [] as unknown as T
): Promise<T> {
  try {
    const assignmentsJson = await AsyncStorage.getItem(
      getAssignmentsStorageKey(type, userId, teamId)
    );
    return assignmentsJson ? JSON.parse(assignmentsJson) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${type} assignments from storage:`, error);
    return defaultValue;
  }
}

/**
 * Update assignments in AsyncStorage by removing scouted matches/pits
 */
export async function updateAssignmentsAfterSubmission(
  type: ScoutingType,
  userId: string | null | undefined,
  teamId: string | null | undefined,
  submissionData: any
): Promise<void> {
  if (!userId || !teamId) return;

  try {
    const storedAssignments = await getAssignmentsFromStorage(type, userId, teamId);
    
    if (storedAssignments.length === 0) return;

    let filteredAssignments: any[];
    
    if (type === 'match') {
      filteredAssignments = storedAssignments.filter((assignment: any) => 
        !(assignment.matchNumber === submissionData.matchNumber && 
          assignment.teamPosition === submissionData.teamLocation &&
          (assignment.teamNumber === undefined || 
           assignment.teamNumber === submissionData.teamNumber))
      );
    } else {
      filteredAssignments = storedAssignments.filter((assignment: any) => 
        assignment.teamNumber !== submissionData.teamNumber
      );
    }

    await saveAssignmentsToStorage(type, userId, teamId, filteredAssignments);
  } catch (error) {
    console.error(`Error updating ${type} assignments after submission:`, error);
  }
} 