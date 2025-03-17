// This functionality is now in the shared local-storage.ts utility
// This file can be deleted or left as a re-export

import { PitData } from '../types';
import { 
  addLocalData,
  clearLocalData,
  getLocalData,
  removeEntriesFromLocalStorage,
  saveLocalData
} from './local-storage';

export const getLocalPitData = () => getLocalData<'pit'>('pit');
export const saveLocalPitData = (data: PitData[]) => saveLocalData('pit', data);
export const addLocalPitData = (data: PitData) => addLocalData('pit', data);
export const clearLocalPitData = () => clearLocalData('pit');
export const removePitsFromLocalStorage = (pits: PitData[]) => 
  removeEntriesFromLocalStorage('pit', pits);
