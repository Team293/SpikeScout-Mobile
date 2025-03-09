import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

import { useLocalMatchData } from './use-local-match-data';

const getRemoteMatchDataKey = (teamId: string) =>
  `@remote_match_data_${teamId}`;

const saveRemoteMatchData = async (teamId: string, data: any[]) => {
  try {
    await AsyncStorage.setItem(
      getRemoteMatchDataKey(teamId),
      JSON.stringify(data),
    );
  } catch (error) {
    console.error('Error caching remote match data:', error);
  }
};

const getCachedRemoteMatchData = async (teamId: string): Promise<any[]> => {
  try {
    const cachedData = await AsyncStorage.getItem(
      getRemoteMatchDataKey(teamId),
    );
    return cachedData ? JSON.parse(cachedData) : [];
  } catch (error) {
    console.error('Error reading cached remote match data:', error);
    return [];
  }
};

export function useFetchAllMatchData(teamId: string | null | undefined) {
  const supabase = useSupabase();
  const localMatchData = useLocalMatchData();
  const network = useNetInfo();

  return useQuery({
    queryKey: ['match', 'all', teamId],
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
            .eq('type', 'match')
            .eq('team', teamId);

          if (error) {
            console.error('Error fetching remote match data:', error);
            remoteData = await getCachedRemoteMatchData(teamId);
          } else {
            remoteData = data || [];
            await saveRemoteMatchData(teamId, remoteData);
          }
        } catch (error) {
          console.error('Failed to fetch remote match data:', error);
          remoteData = await getCachedRemoteMatchData(teamId);
        }
      } else {
        remoteData = await getCachedRemoteMatchData(teamId);
      }

      const localData =
        localMatchData?.map((match) => ({
          type: 'match',
          form_schema: match.schema,
          scouting_json: match.data,
          event_code: match.eventCode,
          team: match.teamId,
          match_number: match.matchNumber,
          team_number: match.teamNumber,
          team_location: match.teamLocation,
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
