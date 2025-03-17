import { PitData } from '../../../types';
import { createFetchAllDataHook } from '../use-fetch-all-data';

export const useFetchAllPitData = createFetchAllDataHook({
  type: 'pit',
  transformLocalData: (localData: PitData[]) =>
    localData.map((entry) => ({
      type: 'pit',
      form_schema: entry.schema,
      scouting_json: entry.data,
      event_code: entry.eventCode,
      team: entry.teamId,
      team_number: entry.teamNumber,
      is_local: true,
    })),
});
