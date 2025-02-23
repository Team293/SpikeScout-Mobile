import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

import { useLocalMatchData } from './use-local-match-data';

export function useFetchAllMatchData(teamId: string | null | undefined) {
  const supabase = useSupabase();
  const _localMatchData = useLocalMatchData();

  return useQuery({
    queryKey: ['match', 'all', teamId],
    queryFn: async () => {
      if (!teamId) {
        return [];
      }

      const { data, error } = await supabase
        .from('scouting_responses')
        .select('*')
        .eq('type', 'match')
        .eq('team', teamId);

      if (error) {
        throw error;
      }

      const remoteData = data || [];
      const localData =
        _localMatchData?.map((match) => ({
          type: 'match',
          form_schema: match.schema,
          scouting_json: match.data,
          event_code: match.eventCode,
          team: match.teamId,
          match_number: match.matchNumber,
          team_number: match.teamNumber,
          is_local: true,
        })) || [];

      return [...remoteData, ...localData];
    },
    enabled: !!teamId,
  });
}
