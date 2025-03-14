import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { useSupabase } from '@kit/supabase';

import { useFetchAllPitData } from './use-fetch-all-pit-data';

// Update the schema to match the new structure - an array of assignments
// Each assignment has multiple teams and multiple scouts
const PitAssignmentSchema = z.array(
  z.object({
    teams: z.array(z.number()),
    scouts: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  }),
);

const getAssignmentsStorageKey = (userId: string, teamId: string) =>
  `@pit_assignments_${userId}_${teamId}`;

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

export function useFetchPitScoutingAssignments(
  userId: string | null | undefined,
  teamId: string | null | undefined,
) {
  const network = useNetInfo();
  const supabase = useSupabase();
  const queryKey = ['pit', 'assignments', userId, teamId];
  const { data: pitData, isSuccess: isPitDataLoaded } =
    useFetchAllPitData(teamId);

  const hasScouted = () => {
    return (teamNumber: number | null | undefined) => {
      if (!teamId || !pitData) return false;

      const hasScoutedPit = pitData.find(
        (entry) => entry.team_number === teamNumber,
      );

      return !!hasScoutedPit;
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
          .eq('type', 'pit');

        if (error) {
          throw error;
        }

        // Get the schedule data from the response
        const allSchedules = data.flatMap((row) => {
          if (row.schedule_json && typeof row.schedule_json === 'object') {
            return row.schedule_json as any;
          }
          return [];
        });

        // Parse the schedules against our schema
        const parsedAssignments = PitAssignmentSchema.parse(allSchedules);

        // Find assignments that:
        // 1. Have the current user as a scout
        // 2. Filter to only teams that haven't been scouted yet
        const userAssignments = parsedAssignments
          .filter((assignment) =>
            assignment.scouts.some((scout) => scout.id === userId),
          )
          .map((assignment) => ({
            ...assignment,
            teams: assignment.teams.filter((team) => !hasScouted()(team)),
          }))
          .filter((assignment) => assignment.teams.length > 0);

        // Transform to flat array of team assignments
        const flattenedTeamAssignments = userAssignments.flatMap((assignment) =>
          assignment.teams.map((teamNumber) => ({
            teamNumber,
            scouts: assignment.scouts,
          })),
        );

        await saveAssignmentsToStorage(
          userId,
          teamId,
          flattenedTeamAssignments,
        );

        return flattenedTeamAssignments;
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
    enabled: !!userId && !!teamId && isPitDataLoaded,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export async function refetchPitScoutingAssignments(
  queryClient: QueryClient,
  userId: string | null | undefined,
  teamId: string | null | undefined,
): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: ['pit', 'all', teamId] });

  await queryClient.invalidateQueries({
    queryKey: ['pit', 'assignments', userId, teamId],
  });

  await Promise.all([
    queryClient.refetchQueries({ queryKey: ['pit', 'all', teamId] }),
    queryClient.refetchQueries({
      queryKey: ['pit', 'assignments', userId, teamId],
    }),
  ]);
}
