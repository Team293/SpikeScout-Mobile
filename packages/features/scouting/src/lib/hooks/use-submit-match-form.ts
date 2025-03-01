import { useNetInfo } from '@react-native-community/netinfo';
import { create } from 'zustand';

import { useSupabase, useUser } from '@kit/supabase';

export type MatchData = {
  data: any;
  schema: any;
  formName: string;
  eventCode: string | null | undefined;
  teamId: string | null | undefined;
  matchNumber: number;
  teamNumber: number;
  teamLocation: number;
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
  const { data: user } = useUser();

  const uploadToCloud = async (
    data: any,
    schema: any,
    formName: string,
    eventCode: string,
    teamId: string,
    matchNumber: number,
    teamNumber: number,
    teamLocation: number,
  ) => {
    try {
      const parsedSchema =
        typeof schema === 'string' ? JSON.parse(schema) : schema;

      const fusedData = fuseData(parsedSchema, data);

      const formSchema = {
        name: formName,
        schema: {
          fields: parsedSchema,
        },
      };

      await supabase.from('scouting_responses').insert({
        type: 'match',
        form_schema: formSchema,
        scouting_json: fusedData,
        event_code: eventCode,
        team: teamId,
        match_number: matchNumber,
        team_number: teamNumber,
        team_location: teamLocation,
        scouter: user?.id,
      });
    } catch (error) {
      console.error('Error uploading match data:', error);
      throw error;
    }
  };

  return async (
    data: any,
    schema: any,
    formName: string,
    eventCode: string | null | undefined,
    teamId: string | null | undefined,
    matchNumber: number,
    teamNumber: number,
    teamLocation: number,
  ) => {
    if (!eventCode || !teamId) {
      throw new Error('Event code and team ID are required');
    }

    if (netInfo.isConnected) {
      await uploadToCloud(
        data,
        schema,
        formName,
        eventCode,
        teamId,
        matchNumber,
        teamNumber,
        teamLocation,
      );
    } else {
      setMatchData({
        data,
        schema,
        formName,
        eventCode,
        teamId,
        matchNumber,
        teamNumber,
        teamLocation,
      });
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
    if (match && match[1]) {
      const index = parseInt(match[1], 10);
      if (fields[index] && fields[index].label) {
        result[fields[index].label] = submitted[key]!;
      }
    }
  });

  return result;
}
