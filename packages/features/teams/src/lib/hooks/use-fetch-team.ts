import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

const getTeamStorageKey = (teamId: string) => `@team_${teamId}`;

async function saveTeamToStorage(teamId: string, teamData: any) {
  try {
    if (teamData) {
      await AsyncStorage.setItem(
        getTeamStorageKey(teamId),
        JSON.stringify(teamData),
      );
    }
  } catch (error) {
    console.error('Error saving team to storage:', error);
  }
}

async function getTeamFromStorage(teamId: string) {
  try {
    const teamJson = await AsyncStorage.getItem(getTeamStorageKey(teamId));
    return teamJson ? JSON.parse(teamJson) : null;
  } catch (error) {
    console.error('Error getting team from storage:', error);
    return null;
  }
}

export function useFetchTeam(teamId: string | null | undefined) {
  const network = useNetInfo();
  const supabase = useSupabase();
  const queryKey = ['team', teamId];

  const queryFn = async () => {
    if (!teamId) {
      return null;
    }

    if (network.isConnected) {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', teamId)
          .eq('is_personal_account', false)
          .limit(1)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          await saveTeamToStorage(teamId, data);
        }

        return data;
      } catch (err) {
        return await getTeamFromStorage(teamId);
      }
    }

    return await getTeamFromStorage(teamId);
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!teamId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnMount: 'always',
    refetchOnReconnect: true,
    networkMode: network.isConnected ? 'online' : 'always',
  });
}
