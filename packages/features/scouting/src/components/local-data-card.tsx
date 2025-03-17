import { useState } from 'react';

import { useNetInfo } from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react-native';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@kit/ui/src/components/ui/tabs';

import {
  refetchMatchScoutingAssignments,
  useLocalMatchData,
  useSubmitMatchForm,
} from '../lib/hooks/match';
import {
  refetchPitScoutingAssignments,
  useLocalPitData,
  useSubmitPitForm,
} from '../lib/hooks/pit';
import { MatchData, PitData } from '../types';
import { removeMatchesFromLocalStorage } from '../utils/local-match-storage';
import { removePitsFromLocalStorage } from '../utils/local-pit-storage';

export function LocalDataCard() {
  const [activeTab, setActiveTab] = useState<'match' | 'pit'>('match');

  const {
    data: localMatchData,
    loading: matchLoading,
    refresh: refreshMatchData,
  } = useLocalMatchData();

  const {
    data: localPitData,
    loading: pitLoading,
    refresh: refreshPitData,
  } = useLocalPitData();

  const refreshAllData = () => {
    refreshMatchData();
    refreshPitData();
  };

  if (matchLoading || pitLoading) {
    return (
      <Card className={'m-5'}>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const totalLocalData =
    (localMatchData?.length || 0) + (localPitData?.length || 0);

  return (
    <Card className={'m-5'}>
      <CardHeader className="flex-row items-center">
        <View className="flex-1 mr-2">
          <CardTitle>Local Data | {totalLocalData}</CardTitle>
          <CardDescription>
            Data stored locally when offline will appear here
          </CardDescription>
        </View>
        <Button variant="ghost" size="icon" onPress={refreshAllData}>
          <RefreshCw className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'match' | 'pit')}
          className={'mx-auto w-full max-w-[400px] flex-col gap-1.5'}
        >
          <TabsList className="w-full flex-row">
            <TabsTrigger value="match" className="flex-1 rounded-lg">
              <Text>
                Matches{' '}
                {localMatchData?.length ? `(${localMatchData.length})` : ''}
              </Text>
            </TabsTrigger>
            <TabsTrigger value="pit" className="flex-1 rounded-lg">
              <Text>
                Pit Scouting{' '}
                {localPitData?.length ? `(${localPitData.length})` : ''}
              </Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="match">
            {!localMatchData || localMatchData.length === 0 ? (
              <NoItems type="match" />
            ) : (
              <StoredMatches
                localMatches={localMatchData}
                onUploadComplete={refreshAllData}
              />
            )}
          </TabsContent>

          <TabsContent value="pit">
            {!localPitData || localPitData.length === 0 ? (
              <NoItems type="pit" />
            ) : (
              <StoredPitEntries
                localEntries={localPitData}
                onUploadComplete={refreshAllData}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function NoItems({ type }: { type: 'match' | 'pit' }) {
  const label = type === 'match' ? 'matches' : 'pit entries';

  return (
    <View className="py-2">
      <Text className="text-muted-foreground text-center">
        No {label} stored locally.{' '}
        {label.charAt(0).toUpperCase() + label.slice(1)} will be stored here
        when you submit forms while offline.
      </Text>
    </View>
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
    <View>
      <Text className="mb-4">
        You have {localMatches.length} match
        {localMatches.length !== 1 ? 'es' : ''} stored offline. When connected
        to the internet, you can upload them to the cloud.
      </Text>

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
    </View>
  );
}

function StoredPitEntries({
  localEntries,
  onUploadComplete,
}: {
  localEntries: PitData[];
  onUploadComplete: () => void;
}) {
  const uploadToCloud = useSubmitPitForm();
  const netInfo = useNetInfo();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const currentTeamId = useCurrentTeamId();

  return (
    <View>
      <Text className="mb-4">
        You have {localEntries.length} pit entr
        {localEntries.length !== 1 ? 'ies' : 'y'} stored offline. When connected
        to the internet, you can upload them to the cloud.
      </Text>

      <Button
        onPress={async () => {
          if (!netInfo.isConnected) {
            alert(
              'You are not connected to the internet. Please connect to the internet and try again.',
            );
            return;
          }

          const uploadPromises = localEntries.map((entry) => {
            return uploadToCloud(entry);
          });

          const results = await Promise.all(uploadPromises);

          const successfulUploads: PitData[] = [];

          results.forEach((result, index) => {
            if (result.success && !result.isLocal && localEntries[index]) {
              successfulUploads.push(localEntries[index]!);
            }
          });

          if (successfulUploads.length > 0) {
            await removePitsFromLocalStorage(successfulUploads);
          }

          await refetchPitScoutingAssignments(
            queryClient,
            user?.id,
            currentTeamId,
          );

          onUploadComplete();
        }}
      >
        <Text>Upload & Clear Entries</Text>
      </Button>
    </View>
  );
}
