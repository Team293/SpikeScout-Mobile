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

      console.log(fusedData);

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
  fields: any[],
  submitted: { [key: string]: any } = {},
): { [key: string]: any } {
  const result: { [key: string]: any } = {};

  fields.forEach((field, index) => {
    if (field.type === 'header') return;

    if (field.type === 'matrix') {
      result[field.label] = JSON.stringify(
        field.matrixRows.map((row: any) => {
          const key = `field_${index}_${row.id}`;
          const value = key in submitted ? submitted[key] : row.value;
          return {
            id: row.id,
            label: row.label,
            value,
          };
        }),
      );
    } else if (field.type === 'boolean') {
      const key = `field_${index}`;
      if (!submitted[key] || submitted[key] === 'false') {
        result[field.label] = false;
      }

      if (submitted[key] === 'true' || submitted[key] === true) {
        result[field.label] = true;
      }
    } else {
      const key = `field_${index}`;
      result[field.label] = key in submitted ? submitted[key] : null;
    }
  });

  return result;
}
