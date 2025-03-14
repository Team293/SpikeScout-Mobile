import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

interface MatchFormSchema {
  schema: any;
  name: string;
}

const SCHEMA_STORAGE_KEY = '@match_form_schema';

async function saveSchemaToStorage(schema: MatchFormSchema) {
  try {
    if (schema) {
      await AsyncStorage.setItem(SCHEMA_STORAGE_KEY, JSON.stringify(schema));
    }
  } catch (error) {
    console.error('Error saving schema to storage:', error);
  }
}

async function getSchemaFromStorage() {
  try {
    const schemaJson = await AsyncStorage.getItem(SCHEMA_STORAGE_KEY);
    return schemaJson ? JSON.parse(schemaJson) : null;
  } catch (error) {
    console.error('Error getting schema from storage:', error);
    return null;
  }
}

export function useFetchMatchFormSchema() {
  const network = useNetInfo();
  const supabase = useSupabase();
  const queryKey = ['form', 'schema', 'match'];

  const queryFn = async () => {
    if (network.isConnected) {
      try {
        const { data, error } = await supabase
          .from('scouting_schemas')
          .select('*')
          .eq('scouting_type', 'match')
          .eq('current', true)
          .limit(1);

        if (error) {
          throw error;
        }

        if (!data || data.length === 0 || !data[0]) {
          return null;
        }

        if (data[0].schema) {
          await saveSchemaToStorage({
            schema: data[0].schema,
            name: data[0].name || 'Untitled Form',
          });
        }

        return {
          schema: data[0].schema || {},
          name: data[0].name || 'Untitled Form',
        };
      } catch (err) {
        console.error('Error fetching form schema:', err);
        throw err;
      }
    }

    return await getSchemaFromStorage();
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

export async function refetchMatchFormSchema(queryClient: any) {
  await queryClient.invalidateQueries(['form', 'schema', 'match']);
}
