import { useNetInfo } from '@react-native-community/netinfo';

import { useSupabase, useUser } from '@kit/supabase';

import { addLocalMatchData } from '../../utils/local-match-storage';

export interface MatchData {
  data: any;
  schema: any;
  formName: string;
  eventCode: string | null | undefined;
  teamId: string | null | undefined;
  matchNumber: number;
  teamNumber: number;
  teamLocation: number;
}

export function useSubmitMatchForm() {
  const netInfo = useNetInfo();
  const supabase = useSupabase();
  const { data: user } = useUser();

  return async (matchData: MatchData) => {
    if (!netInfo.isConnected) {
      await addLocalMatchData(matchData);
      return { success: true, isLocal: true };
    }

    try {
      const fusedData = fuseData(matchData.schema, matchData.data);

      const schema = {
        name: matchData.formName,
        schema: {
          fields: matchData.schema,
        },
      };

      await supabase.from('scouting_responses').insert({
        type: 'match',
        form_schema: schema,
        scouting_json: fusedData,
        event_code: matchData.eventCode || '',
        team: matchData.teamId || '',
        match_number: matchData.matchNumber,
        team_number: matchData.teamNumber,
        team_location: matchData.teamLocation,
        scouter: user?.id || null,
      });
      return { success: true, isLocal: false };
    } catch (error) {
      await addLocalMatchData(matchData);
      return { success: true, isLocal: true, error };
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
