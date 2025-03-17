import { useNetInfo } from '@react-native-community/netinfo';
import { QueryClient, UseQueryResult, useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

import { ScoutingType } from '../../types';
import {
  getAssignmentsFromStorage,
  saveAssignmentsToStorage,
} from '../../utils/assignments-storage';

export interface UseScoutingAssignmentsOptions<DataType, AssignmentType> {
  type: ScoutingType;
  useGetAllData: (
    teamId: string | null | undefined,
  ) => UseQueryResult<DataType[]>;
  hasScouted: (data: DataType[] | undefined) => (criteria: any) => boolean;
  processScheduleData: (
    scheduleData: any[],
    userId: string,
  ) => AssignmentType[];
}

export function createFetchScoutingAssignmentsHook<
  DataType extends object,
  AssignmentType extends object,
>(options: UseScoutingAssignmentsOptions<DataType, AssignmentType>) {
  const { type, useGetAllData, hasScouted, processScheduleData } = options;

  return function useFetchScoutingAssignments(
    userId: string | null | undefined,
    teamId: string | null | undefined,
  ): UseQueryResult<AssignmentType[]> {
    const network = useNetInfo();
    const supabase = useSupabase();
    const queryKey = [type, 'assignments', userId, teamId];
    const { data: allData, isSuccess: isDataLoaded } = useGetAllData(teamId);

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
            .eq('type', type);

          if (error) {
            throw error;
          }

          const scheduleData = data.flatMap((row) => {
            if (row.schedule_json && typeof row.schedule_json === 'object') {
              return type === 'match'
                ? (row.schedule_json as any).assignments || []
                : (row.schedule_json as any);
            }
            return [];
          });

          const processedAssignments = processScheduleData(
            scheduleData,
            userId,
          );

          const hasScoutedFn = hasScouted(allData);

          const filteredAssignments =
            type === 'match'
              ? processedAssignments.filter(
                  (assignment: any) =>
                    !hasScoutedFn({
                      matchNumber: assignment.matchNumber,
                      teamNumber: assignment.teamNumber,
                      teamPosition: assignment.teamPosition,
                    }),
                )
              : processedAssignments.filter(
                  (assignment: any) => !hasScoutedFn(assignment.teamNumber),
                );

          await saveAssignmentsToStorage(
            type,
            userId,
            teamId,
            filteredAssignments,
          );

          return filteredAssignments;
        } catch (err) {
          console.error(`Error fetching ${type} assignments:`, err);
          return await getAssignmentsFromStorage<AssignmentType[]>(
            type,
            userId,
            teamId,
          );
        }
      }

      return await getAssignmentsFromStorage<AssignmentType[]>(
        type,
        userId,
        teamId,
      );
    };

    return useQuery({
      queryKey,
      queryFn,
      enabled: !!userId && !!teamId && isDataLoaded,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  };
}

export function createRefetchScoutingAssignments(type: ScoutingType) {
  return async function refetchScoutingAssignments(
    queryClient: QueryClient,
    userId: string | null | undefined,
    teamId: string | null | undefined,
  ): Promise<void> {
    await queryClient.invalidateQueries({ queryKey: [type, 'all', teamId] });
    await queryClient.invalidateQueries({
      queryKey: [type, 'assignments', userId, teamId],
    });

    await Promise.all([
      queryClient.refetchQueries({ queryKey: [type, 'all', teamId] }),
      queryClient.refetchQueries({
        queryKey: [type, 'assignments', userId, teamId],
      }),
    ]);
  };
}
