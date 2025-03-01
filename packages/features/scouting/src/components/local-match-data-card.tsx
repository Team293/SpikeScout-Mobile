import { Stack } from 'expo-router';
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

import { useLocalMatchData } from '../lib/hooks/use-local-match-data';
import {
  MatchData,
  useSubmitMatchForm,
} from '../lib/hooks/use-submit-match-form';

export function LocalMatchDataCard() {
  const localMatchData = useLocalMatchData();

  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Local Match Data',
        }}
      />
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
            await Promise.all(
              localMatches.map((match) =>
                uploadToCloud(
                  match.data,
                  match.schema,
                  match.eventCode,
                  match.teamId,
                  match.matchNumber,
                  match.teamNumber,
                  match.teamLocation,
                ),
              ),
            );
          }}
        >
          <Text>Upload & Clear Matches</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
