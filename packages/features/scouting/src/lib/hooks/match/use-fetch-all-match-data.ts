import { MatchData } from '../../../types';
import { createFetchAllDataHook } from '../use-fetch-all-data';

export const useFetchAllMatchData = createFetchAllDataHook({
  type: 'match',
  transformLocalData: (localData: MatchData[]) =>
    localData.map((match) => ({
      type: 'match',
      form_schema: match.schema,
      scouting_json: match.data,
      event_code: match.eventCode,
      team: match.teamId,
      match_number: match.matchNumber,
      team_number: match.teamNumber,
      team_location: match.teamLocation,
      is_local: true,
    })),
});
