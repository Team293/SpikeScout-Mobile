import AsyncStorage from '@react-native-async-storage/async-storage';

import { FormSchema, ScoutingType } from '../types';

const getStorageKey = (type: ScoutingType) => `@${type}_form_schema`;

export async function saveSchemaToStorage(schema: FormSchema, type: ScoutingType): Promise<void> {
  try {
    if (schema) {
      await AsyncStorage.setItem(getStorageKey(type), JSON.stringify(schema));
    }
  } catch (error) {
    console.error(`Error saving ${type} schema to storage:`, error);
  }
}

export async function getSchemaFromStorage(type: ScoutingType): Promise<FormSchema | null> {
  try {
    const schemaJson = await AsyncStorage.getItem(getStorageKey(type));
    return schemaJson ? JSON.parse(schemaJson) : null;
  } catch (error) {
    console.error(`Error getting ${type} schema from storage:`, error);
    return null;
  }
} 