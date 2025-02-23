import { useNetInfo } from '@react-native-community/netinfo';
import { create } from 'zustand';

import { useSupabase } from '@kit/supabase';

export type MatchData = {
  data: any;
  schema: any;
  eventCode: string | null | undefined;
  teamId: string | null | undefined;
  matchNumber: number;
};

interface LocalMatchDataStore {
  matchData: MatchData[] | null;
  setMatchData: (data: MatchData) => void;
}

export const matchDataStore = create<LocalMatchDataStore>((set) => ({
  matchData: null,
  setMatchData: (data) =>
    set((state) => ({
      matchData: state.matchData ? [...state.matchData, data] : [data],
    })),
}));

export function useSubmitMatchForm() {
  const netInfo = useNetInfo();
  const supabase = useSupabase();
  const setMatchData = matchDataStore((state) => state.setMatchData);

  const uploadToCloud = async (
    data: any,
    schema: any,
    eventCode: string,
    teamId: string,
    matchNumber: number,
  ) => {
    const fusedData = fuseData(schema, data);

    await supabase.from('scouting_responses').insert({
      type: 'match',
      form_schema: schema,
      scouting_json: fusedData,
      event_code: eventCode,
      team: teamId,
      match_number: matchNumber,
    });
  };

  return async (
    data: any,
    schema: any,
    eventCode: string | null | undefined,
    teamId: string | null | undefined,
    matchNumber: number,
  ) => {
    if (!eventCode || !teamId) {
      throw new Error('Event code and team ID are required');
    }

    if (netInfo.isConnected) {
      await uploadToCloud(data, schema, eventCode, teamId, matchNumber);
    } else {
      setMatchData({ data, schema, eventCode, teamId, matchNumber });
    }
  };
}

function fuseData(
  fields: { label: string }[],
  submitted: { [key: string]: string } = {},
): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  Object.keys(submitted).forEach((key) => {
    const match = key.match(/field_(\d+)/);
    if (match) {
      const index = parseInt(match[1], 10);
      if (fields[index] && fields[index].label) {
        result[fields[index].label] = submitted[key]!;
      }
    }
  });

  return result;
}
