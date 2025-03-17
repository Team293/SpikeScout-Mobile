// This functionality is now in the shared local-storage.ts utility
// This file can be deleted or left as a re-export

import { MatchData } from '../types';
import { 
  addLocalData,
  clearLocalData,
  getLocalData,
  removeEntriesFromLocalStorage,
  saveLocalData
} from './local-storage';

export const getLocalMatchData = () => getLocalData<'match'>('match');
export const saveLocalMatchData = (data: MatchData[]) => saveLocalData('match', data);
export const addLocalMatchData = (data: MatchData) => addLocalData('match', data);
export const clearLocalMatchData = () => clearLocalData('match');
export const removeMatchesFromLocalStorage = (matches: MatchData[]) => 
  removeEntriesFromLocalStorage('match', matches);
