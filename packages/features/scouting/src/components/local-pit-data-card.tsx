import { View } from 'react-native';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from '@kit/ui';

import { useLocalPitData } from '../lib/hooks/pit/use-local-pit-data';
import {
  PitData,
  useSubmitPitForm,
} from '../lib/hooks/pit/use-submit-pit-form';
import { removePitScoutsFromLocalStorage } from '../utils/local-pit-storage';

export function LocalPitDataCard() {
  const localPitData = useLocalPitData();

  return (
    <View>
      {!localPitData || localPitData.length === 0 ? (
        <NoMatches />
      ) : (
        <StoredPitEntries localEntries={localPitData} />
      )}
    </View>
  );
}

function NoMatches() {
  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>No Pit Entries Stored</CardTitle>
        <CardDescription>
          You have not stored any entries! Pit entries will store locally when
          you submit the form with no wifi. Please check back periodically to
          ensure that you have uploaded the entries you have stored.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function StoredPitEntries({ localEntries }: { localEntries: PitData[] }) {
  const uploadToCloud = useSubmitPitForm();

  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>Pit Entries Stored | {localEntries.length}</CardTitle>
        <CardDescription>
          Once you are on wifi, please upload the entries to the cloud by
          clicking the button below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          onPress={async () => {
            const uploadPromises = localEntries.map((entry) => {
              return uploadToCloud(entry);
            });

            const results = await Promise.all(uploadPromises);

            const successfulUploads = results
              .filter((result) => result.success && !result.isLocal)
              .map((_, index) => localEntries[index]);

            if (successfulUploads.length > 0) {
              await removePitScoutsFromLocalStorage(successfulUploads);
            }
          }}
        >
          <Text>Upload & Clear Matches</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
