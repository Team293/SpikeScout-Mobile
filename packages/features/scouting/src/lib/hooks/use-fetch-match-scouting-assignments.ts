import { z } from 'zod';

import { useSupabase } from '@kit/supabase';

const assignments = [
  {
    userId: '1',
    userName: 'Alice Johnson',
    matchNumber: 1,
    teamPosition: 1,
    teamNumber: 293,
    hasScouted: false,
  },
];

export const MatchScoutingAssignmentsSchema = z.array(
  z.object({
    userId: z.string(),
    userName: z.string(),
    matchNumber: z.number(),
    teamPosition: z.number(),
    teamNumber: z.number(),
  }),
);

export function useFetchMatchScoutingAssignments(
  userId: string | null | undefined,
  teamId: string | null | undefined,
) {
  const supabase = useSupabase();
  const queryKey = ['match', 'assignments', userId];
  const fetchResponse = useFetchResponse();

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

    const parsedAssignments = MatchScoutingAssignmentsSchema.parse(data);
    return parsedAssignments.filter(
      (assignment) => assignment.userId === userId,
    );
  };

  // return useQuery({
  //   queryKey,
  //   queryFn,
  //   enabled: !!userId && !!teamId,
  // });

  return {
    data: assignments,
    isLoading: false,
    isError: false,
    error: null,
  };
}
