import { useNetInfo } from '@react-native-community/netinfo';

import { useSupabase, useUser } from '@kit/supabase';

import {
  MatchData,
  PitData,
  ScoutingResponse,
  ScoutingType,
} from '../../types';
import { updateAssignmentsAfterSubmission } from '../../utils/assignments-storage';
import { mapFormData } from '../../utils/field-render';
import { addLocalData } from '../../utils/local-storage';

type ScoutingDataType<T extends ScoutingType> = T extends 'match'
  ? MatchData
  : PitData;

export function createSubmitFormHook<T extends ScoutingType>(type: T) {
  return function useSubmitForm() {
    const netInfo = useNetInfo();
    const supabase = useSupabase();
    const { data: user } = useUser();

    return async (formData: ScoutingDataType<T>): Promise<ScoutingResponse> => {
      console.log(formData);
      if (!netInfo.isConnected) {
        await addLocalData(type, formData);

        await updateAssignmentsAfterSubmission(
          type,
          user?.id,
          formData.teamId,
          formData,
        );

        return { success: true, isLocal: true };
      }

      try {
        const mappedData = mapFormData(formData.schema, formData.data);

        const schema = {
          name: formData.formName,
          schema: {
            fields: formData.schema,
          },
        };

        const basePayload = {
          type,
          form_schema: schema,
          scouting_json: mappedData,
          event_code: formData.eventCode || '',
          team: formData.teamId || '',
          scouter: user?.id || null,
        };

        if (type === 'match') {
          const matchData = formData as MatchData;
          const { data, error } = await supabase
            .from('scouting_responses')
            .insert({
              ...basePayload,
              match_number: matchData.matchNumber,
              team_number: matchData.teamNumber,
              team_location: matchData.teamLocation,
            });

          console.log('data', data, 'error', error);
        } else {
          const pitData = formData as PitData;
          await supabase.from('scouting_responses').insert({
            ...basePayload,
            team_number: pitData.teamNumber,
          });
        }

        return { success: true, isLocal: false };
      } catch (error) {
        console.error(error);
        await addLocalData(type, formData);

        await updateAssignmentsAfterSubmission(
          type,
          user?.id,
          formData.teamId,
          formData,
        );

        return { success: true, isLocal: true, error };
      }
    };
  };
}
