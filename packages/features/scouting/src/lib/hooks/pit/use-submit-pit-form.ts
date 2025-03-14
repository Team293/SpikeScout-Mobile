import { useNetInfo } from '@react-native-community/netinfo';

import { useSupabase, useUser } from '@kit/supabase';

import { fuseData } from '../../../utils/data';
import { addLocalPitData } from '../../../utils/local-pit-storage';

export interface PitData {
  data: any;
  schema: any;
  formName: string;
  eventCode: string | null | undefined;
  teamId: string | null | undefined;
  teamNumber: number;
}

export function useSubmitPitForm() {
  const netInfo = useNetInfo();
  const supabase = useSupabase();
  const { data: user } = useUser();

  return async (pitData: PitData) => {
    if (!netInfo.isConnected) {
      await addLocalPitData(pitData);
      return { success: true, isLocal: true };
    }

    try {
      const fusedData = fuseData(pitData.schema, pitData.data);

      const schema = {
        name: pitData.formName,
        schema: {
          fields: pitData.schema,
        },
      };

      await supabase.from('scouting_responses').insert({
        type: 'pit',
        form_schema: schema,
        scouting_json: fusedData,
        event_code: pitData.eventCode || '',
        team: pitData.teamId || '',
        team_number: pitData.teamNumber,
        scouter: user?.id || null,
      });
      return { success: true, isLocal: false };
    } catch (error) {
      await addLocalPitData(pitData);
      return { success: true, isLocal: true, error };
    }
  };
}
