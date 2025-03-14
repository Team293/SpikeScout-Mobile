import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

import { useLocalPitData } from './use-local-pit-data';

const getRemotePitDataKey = (teamId: string) => `@remote_pit_data_${teamId}`;

const saveRemotePitData = async (teamId: string, data: any[]) => {
  try {
    await AsyncStorage.setItem(
      getRemotePitDataKey(teamId),
      JSON.stringify(data),
    );
  } catch (error) {
    console.error('Error caching remote pit data:', error);
  }
};

const getCachedRemotePitData = async (teamId: string): Promise<any[]> => {
  try {
    const cachedData = await AsyncStorage.getItem(getRemotePitDataKey(teamId));
    return cachedData ? JSON.parse(cachedData) : [];
  } catch (error) {
    console.error('Error reading cached remote pit data:', error);
    return [];
  }
};

export function useFetchAllPitData(teamId: string | null | undefined) {
  const supabase = useSupabase();
  const localPitData = useLocalPitData();
  const network = useNetInfo();

  return useQuery({
    queryKey: ['pit', 'all', teamId],
    queryFn: async () => {
      if (!teamId) {
        return [];
      }

      let remoteData: any[] = [];

      if (network.isConnected) {
        try {
          const { data, error } = await supabase
            .from('scouting_responses')
            .select('*')
            .eq('type', 'pit')
            .eq('team', teamId);

          if (error) {
            console.error('Error fetching remote pit data:', error);
            remoteData = await getCachedRemotePitData(teamId);
          } else {
            remoteData = data || [];
            await saveRemotePitData(teamId, remoteData);
          }
        } catch (error) {
          console.error('Failed to fetch remote match data:', error);
          remoteData = await getCachedRemotePitData(teamId);
        }
      } else {
        remoteData = await getCachedRemotePitData(teamId);
      }

      const localData =
        localPitData?.map((entry) => ({
          type: 'pit',
          form_schema: entry.schema,
          scouting_json: entry.data,
          event_code: entry.eventCode,
          team: entry.teamId,
          team_number: entry.teamNumber,
          is_local: true,
        })) || [];

      return [...remoteData, ...localData];
    },
    enabled: !!teamId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: false,
  });
}
