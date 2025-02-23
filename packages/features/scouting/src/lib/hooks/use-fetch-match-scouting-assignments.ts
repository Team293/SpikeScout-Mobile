import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { useSupabase } from '@kit/supabase';

import { useFetchAllMatchData } from './use-fetch-all-match-data';

export const MatchScoutingAssignmentsSchema = z.array(
  z.object({
    userId: z.string(),
    userName: z.string(),
    teamNumber: z.number(),
    matchNumber: z.number(),
    teamPosition: z.number(),
  }),
);

export function useFetchMatchScoutingAssignments(
  userId: string | null | undefined,
  teamId: string | null | undefined,
) {
  const supabase = useSupabase();
  const queryKey = ['match', 'assignments', userId];
  const { data: matchData } = useFetchAllMatchData(teamId);

  const hasScouted = () => {
    return (matchNumber: number, teamNumber: number) => {
      if (!teamId || !matchData) return false;

      const hasScoutedMatch = matchData.find(
        (match) =>
          match.match_number === matchNumber &&
          match.team_number === teamNumber,
      );

      return !!hasScoutedMatch;
    };
  };

  const queryFn = async () => {
    if (!userId || !teamId) {
      return [];
    }

    const { data, error } = await supabase
      .from('scouting_schedules')
      .select('*')
      .eq('team', teamId)
      .eq('type', 'match');

    if (error) {
      throw error;
    }

    const allAssignments = data.flatMap(
      (row) => row.schedule_json?.assignments ?? [],
    );

    const parsedAssignments =
      MatchScoutingAssignmentsSchema.parse(allAssignments);

    return parsedAssignments.filter(
      (assignment) =>
        assignment.userId === userId &&
        !hasScouted()(assignment.matchNumber, assignment.teamNumber),
    );
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!userId && !!teamId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}
