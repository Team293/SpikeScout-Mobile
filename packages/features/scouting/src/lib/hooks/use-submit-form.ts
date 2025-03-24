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
import { formEvents } from '../../utils/form-events';
import {
  imageStorage,
  storeImagesInDatabase,
  updateImagesWithResponseId,
} from '../../utils/image-storage';
import { addLocalData } from '../../utils/local-storage';

type ScoutingDataType<T extends ScoutingType> = T extends 'match'
  ? MatchData
  : PitData;

/**
 * Extract image UUIDs from form data
 * @param formData The form data to extract image UUIDs from
 * @returns Array of image UUIDs found in the form data
 */
function extractImageUUIDs(formData: any): string[] {
  const uuids: string[] = [];

  if (!formData.data) {
    return uuids;
  }

  Object.entries(formData.data).forEach(([key, value]) => {
    if (key.startsWith('field_') && Array.isArray(value)) {
      uuids.push(...value);
    }
  });

  return uuids;
}

/**
 * Filter out image UUIDs that don't have corresponding images in storage
 */
const filterMissingImages = (formData: any) => {
  const imageUUIDs: string[] = [];

  try {
    Object.entries(formData.data).forEach(([key, value]) => {
      if (key.startsWith('field_') && Array.isArray(value)) {
        (value as string[]).forEach((uuid) => {
          if (uuid && uuid.includes('-')) {
            imageUUIDs.push(uuid);
          }
        });
      }
    });
  } catch (e) {
    console.log('🧹 FILTER IMAGES: Could not get all images from storage', e);
  }

  const availableImages = imageStorage.getImagesByUUIDs(imageUUIDs);
  const validUUIDs = availableImages.map((img: { uuid: string }) => img.uuid);

  if (validUUIDs.length !== imageUUIDs.length) {
    const updatedFormData = { ...formData };

    Object.entries(formData.data).forEach(([key, value]) => {
      if (key.startsWith('field_') && Array.isArray(value)) {
        updatedFormData.data[key] = (value as string[]).filter((uuid) =>
          validUUIDs.includes(uuid),
        );
      }
    });

    return {
      formData: updatedFormData,
      validUUIDs,
    };
  }

  return {
    formData,
    validUUIDs: imageUUIDs,
  };
};

export function createSubmitFormHook<T extends ScoutingType>(type: T) {
  return function useSubmitForm() {
    const netInfo = useNetInfo();
    const supabase = useSupabase();
    const { data: user } = useUser();

    return async (formData: ScoutingDataType<T>): Promise<ScoutingResponse> => {
      const { formData: updatedFormData, validUUIDs } =
        filterMissingImages(formData);
      formData = updatedFormData as ScoutingDataType<T>;

      if (!netInfo.isConnected) {
        await addLocalData(type, formData);

        await updateAssignmentsAfterSubmission(
          type,
          user?.id,
          formData.teamId,
          formData,
        );

        // imageStorage.clearAllImages();

        formEvents.emit('form:submitted');

        return { success: true, isLocal: true };
      }

      try {
        if (validUUIDs.length > 0 && formData.teamId) {
          await storeImagesInDatabase(supabase, formData.teamId, validUUIDs);
        }

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

        let responseId: number | null = null;

        if (type === 'match') {
          const matchData = formData as MatchData;

          const { data, error } = await supabase
            .from('scouting_responses')
            .insert({
              ...basePayload,
              match_number: matchData.matchNumber,
              team_number: matchData.teamNumber,
              team_location: matchData.teamLocation,
            })
            .select('id')
            .single();

          if (data) {
            responseId = data.id;
          } else if (error) {
            console.error('🛢️ DATABASE: Failed to insert match data:', error);
            throw new Error(`Failed to insert match data: ${error.message}`);
          }
        } else {
          const pitData = formData as PitData;

          const { data, error } = await supabase
            .from('scouting_responses')
            .insert({
              ...basePayload,
              team_number: pitData.teamNumber,
            })
            .select('id')
            .single();

          if (data) {
            responseId = data.id;
          } else if (error) {
            console.error('🛢️ DATABASE: Failed to insert pit data:', error);
            throw new Error(`Failed to insert pit data: ${error.message}`);
          }
        }

        if (responseId && validUUIDs.length > 0) {
          try {
            await updateImagesWithResponseId(supabase, validUUIDs, responseId);
          } catch (error) {
            console.error(
              '🛢️ DATABASE: Failed to update images with response ID:',
              error,
            );
            throw new Error(
              `Failed to update images with response ID: ${error.message}`,
            );
          }
        }

        // imageStorage.clearAllImages();

        formEvents.emit('form:submitted');

        return { success: true, isLocal: false };
      } catch (error: unknown) {
        await addLocalData(type, formData);
        await updateAssignmentsAfterSubmission(
          type,
          user?.id,
          formData.teamId,
          formData,
        );

        // imageStorage.clearAllImages();

        formEvents.emit('form:submitted');

        return { success: true, isLocal: true, error };
      }
    };
  };
}
