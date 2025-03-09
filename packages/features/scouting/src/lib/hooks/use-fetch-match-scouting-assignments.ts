import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { useSupabase } from '@kit/supabase';

import { useFetchAllMatchData } from './use-fetch-all-match-data';

export const MatchScoutingAssignmentsSchema = z.array(
  z.object({
    userId: z.string(),
    teamNumber: z.number().optional(),
    matchNumber: z.number(),
    teamPosition: z.number(),
  }),
);

const getAssignmentsStorageKey = (userId: string, teamId: string) =>
  `@match_assignments_${userId}_${teamId}`;

async function saveAssignmentsToStorage(
  userId: string,
  teamId: string,
  assignments: any[],
) {
  try {
    await AsyncStorage.setItem(
      getAssignmentsStorageKey(userId, teamId),
      JSON.stringify(assignments),
    );
  } catch (error) {
    console.error('Error saving assignments to storage:', error);
  }
}

async function getAssignmentsFromStorage(userId: string, teamId: string) {
  try {
    const assignmentsJson = await AsyncStorage.getItem(
      getAssignmentsStorageKey(userId, teamId),
    );
    return assignmentsJson ? JSON.parse(assignmentsJson) : [];
  } catch (error) {
    console.error('Error getting assignments from storage:', error);
    return [];
  }
}

export function useFetchMatchScoutingAssignments(
  userId: string | null | undefined,
  teamId: string | null | undefined,
) {
  const network = useNetInfo();
  const supabase = useSupabase();
  const queryKey = ['match', 'assignments', userId, teamId];
  const { data: matchData, isSuccess: isMatchDataLoaded } =
    useFetchAllMatchData(teamId);

  const hasScouted = () => {
    return (
      matchNumber: number,
      teamNumber: number | null | undefined,
      teamPosition: number,
    ) => {
      if (!teamId || !matchData) return false;

      const hasScoutedMatch = matchData.find(
        (match) =>
          match.match_number === matchNumber &&
          (teamNumber != null ? match.team_number === teamNumber : true) &&
          (match as any).team_location === teamPosition,
      );

      return !!hasScoutedMatch;
    };
  };

  const queryFn = async () => {
    if (!userId || !teamId) {
      return [];
    }

    if (network.isConnected) {
      try {
        const { data, error } = await supabase
          .from('scouting_schedules')
          .select('*')
          .eq('team', teamId)
          .eq('type', 'match');

        if (error) {
          throw error;
        }

        const allAssignments = data.flatMap((row) => {
          if (row.schedule_json && typeof row.schedule_json === 'object') {
            return (row.schedule_json as any).assignments || [];
          }
          return [];
        });

        const parsedAssignments =
          MatchScoutingAssignmentsSchema.parse(allAssignments);

        const filteredAssignments = parsedAssignments.filter(
          (assignment) =>
            assignment.userId === userId &&
            !hasScouted()(
              assignment.matchNumber,
              assignment.teamNumber,
              assignment.teamPosition,
            ),
        );
        console.log('filteredAssignments', filteredAssignments);

        await saveAssignmentsToStorage(userId, teamId, filteredAssignments);

        return filteredAssignments;
      } catch (err) {
        console.error(err);
        return await getAssignmentsFromStorage(userId, teamId);
      }
    }

    return await getAssignmentsFromStorage(userId, teamId);
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!userId && !!teamId && isMatchDataLoaded,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export async function refetchMatchScoutingAssignments(
  queryClient: QueryClient,
  userId: string | null | undefined,
  teamId: string | null | undefined,
): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: ['match', 'all', teamId] });

  await queryClient.invalidateQueries({
    queryKey: ['match', 'assignments', userId, teamId],
  });

  await Promise.all([
    queryClient.refetchQueries({ queryKey: ['match', 'all', teamId] }),
    queryClient.refetchQueries({
      queryKey: ['match', 'assignments', userId, teamId],
    }),
  ]);
}
