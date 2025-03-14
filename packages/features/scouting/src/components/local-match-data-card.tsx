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

import { useLocalMatchData } from '../lib/hooks/match/use-local-match-data';
import {
  MatchData,
  useSubmitMatchForm,
} from '../lib/hooks/match/use-submit-match-form';
import { removeMatchesFromLocalStorage } from '../utils/local-match-storage';

export function LocalMatchDataCard() {
  const localMatchData = useLocalMatchData();

  return (
    <View>
      {!localMatchData || localMatchData.length === 0 ? (
        <NoMatches />
      ) : (
        <StoredMatches localMatches={localMatchData} />
      )}
    </View>
  );
}

function NoMatches() {
  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>No Matches Stored</CardTitle>
        <CardDescription>
          You have not stored any matches! Matches will store locally when you
          submit the form with no wifi. Please check back periodically to ensure
          that you have uploaded the matches you have stored.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function StoredMatches({ localMatches }: { localMatches: MatchData[] }) {
  const uploadToCloud = useSubmitMatchForm();

  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>Matches Stored | {localMatches.length}</CardTitle>
        <CardDescription>
          Once you are on wifi, please upload the matches to the cloud by
          clicking the button below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          onPress={async () => {
            const uploadPromises = localMatches.map((match) => {
              return uploadToCloud(match);
            });

            const results = await Promise.all(uploadPromises);

            const successfulUploads = results
              .filter((result) => result.success && !result.isLocal)
              .map((_, index) => localMatches[index]);

            if (successfulUploads.length > 0) {
              await removeMatchesFromLocalStorage(successfulUploads);
            }
          }}
        >
          <Text>Upload & Clear Matches</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
