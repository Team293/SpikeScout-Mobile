import { useNetInfo } from '@react-native-community/netinfo';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

import { FormSchema, ScoutingType } from '../../types';
import { getSchemaFromStorage, saveSchemaToStorage } from '../../utils/schema-storage';

export function createFormSchemaHook(type: ScoutingType) {
  return function useFormSchema(): UseQueryResult<FormSchema | null> {
    const network = useNetInfo();
    const supabase = useSupabase();
    const queryKey = ['form', 'schema', type];

    const queryFn = async () => {
      if (network.isConnected) {
        try {
          const { data, error } = await supabase
            .from('scouting_schemas')
            .select('*')
            .eq('scouting_type', type)
            .eq('current', true)
            .limit(1);

          if (error) {
            throw error;
          }

          if (!data || data.length === 0 || !data[0]) {
            return null;
          }

          if (data[0].schema) {
            const formSchema: FormSchema = {
              schema: data[0].schema,
              name: data[0].name || 'Untitled Form',
            };
            
            await saveSchemaToStorage(formSchema, type);
            return formSchema;
          }

          return null;
        } catch (err) {
          console.error(`Error fetching ${type} form schema:`, err);
          throw err;
        }
      }

      return await getSchemaFromStorage(type);
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
  };
}

export function createRefetchFormSchema(type: ScoutingType) {
  return async function refetchFormSchema(queryClient: any) {
    await queryClient.invalidateQueries(['form', 'schema', type]);
  };
} 