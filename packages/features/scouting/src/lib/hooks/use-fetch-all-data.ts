import { useNetInfo } from '@react-native-community/netinfo';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

import { MatchData, PitData, ScoutingType } from '../../types';
import { getLocalData } from '../../utils/local-storage';
import { getCachedRemoteData, saveRemoteData } from '../../utils/remote-cache';

type ScoutingDataType<T extends ScoutingType> = T extends 'match'
  ? MatchData
  : PitData;

export interface TransformLocalDataOptions<T extends ScoutingType> {
  type: T;
  transformLocalData: (localData: ScoutingDataType<T>[]) => any[];
}

export function createFetchAllDataHook<T extends ScoutingType>(
  options: TransformLocalDataOptions<T>,
) {
  const { type, transformLocalData } = options;

  return function useFetchAllData(
    teamId: string | null | undefined,
  ): UseQueryResult<any[]> {
    const supabase = useSupabase();
    const network = useNetInfo();

    return useQuery({
      queryKey: [type, 'all', teamId],
      queryFn: async () => {
        if (!teamId) {
          return [];
        }

        const localData = await getLocalData<T>(type);

        let remoteData: any[] = [];

        if (network.isConnected) {
          try {
            const { data, error } = await supabase
              .from('scouting_responses')
              .select('*')
              .eq('type', type)
              .eq('team', teamId);

            if (error) {
              console.error(`Error fetching remote ${type} data:`, error);
              remoteData = await getCachedRemoteData(type, teamId);
            } else {
              remoteData = data || [];
              await saveRemoteData(type, teamId, remoteData);
            }
          } catch (error) {
            console.error(`Failed to fetch remote ${type} data:`, error);
            remoteData = await getCachedRemoteData(type, teamId);
          }
        } else {
          remoteData = await getCachedRemoteData(type, teamId);
        }

        const transformedLocalData = transformLocalData(localData);

        return [...remoteData, ...transformedLocalData];
      },
      enabled: !!teamId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: false,
    });
  };
}
