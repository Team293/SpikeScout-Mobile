import { useNetInfo } from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { View } from 'react-native';

import { useUser } from '@kit/supabase';
import { useCurrentTeamId } from '@kit/teams/src/lib/hooks/use-team-store';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from '@kit/ui';

import {
  refetchMatchScoutingAssignments,
  useLocalMatchData,
  useSubmitMatchForm,
} from '../lib/hooks/match';
import { MatchData } from '../types';
import { removeMatchesFromLocalStorage } from '../utils/local-match-storage';

export function LocalMatchDataCard() {
  const { data: localMatchData, loading, refresh } = useLocalMatchData();

  if (loading) {
    return (
      <Card className={'m-5'}>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <View>
      {!localMatchData || localMatchData.length === 0 ? (
        <NoMatches />
      ) : (
        <StoredMatches
          localMatches={localMatchData}
          onUploadComplete={refresh}
        />
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

function StoredMatches({
  localMatches,
  onUploadComplete,
}: {
  localMatches: MatchData[];
  onUploadComplete: () => void;
}) {
  const uploadToCloud = useSubmitMatchForm();
  const netInfo = useNetInfo();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const currentTeamId = useCurrentTeamId();

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
            if (!netInfo.isConnected) {
              alert(
                'You are not connected to the internet. Please connect to the internet and try again.',
              );
              return;
            }

            const uploadPromises = localMatches.map((match) => {
              return uploadToCloud(match);
            });

            const results = await Promise.all(uploadPromises);

            const successfulUploads: MatchData[] = [];

            results.forEach((result, index) => {
              if (result.success && !result.isLocal && localMatches[index]) {
                successfulUploads.push(localMatches[index]!);
              }
            });

            if (successfulUploads.length > 0) {
              await removeMatchesFromLocalStorage(successfulUploads);
            }

            await refetchMatchScoutingAssignments(
              queryClient,
              user?.id,
              currentTeamId,
            );

            onUploadComplete();
          }}
        >
          <Text>Upload & Clear Matches</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
