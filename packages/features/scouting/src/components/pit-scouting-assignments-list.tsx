import React, { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { RefreshCcw } from 'lucide-react-native';
import { FlatList, View } from 'react-native';

import { useUser } from '@kit/supabase';
import { useCurrentTeamId } from '@kit/teams/src/lib/hooks/use-team-store';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from '@kit/ui';

import {
  refetchPitFormSchema,
  refetchPitScoutingAssignments,
  useFetchPitScoutingAssignments,
} from '../lib/hooks/pit';

export function PitScoutingAssignmentsList() {
  const { data: user } = useUser();
  const currentTeamId = useCurrentTeamId();
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      const refetch = async () => {
        if (user?.id && currentTeamId) {
          await refetchPitScoutingAssignments(
            queryClient,
            user.id,
            currentTeamId,
          );

          await refetchPitFormSchema(queryClient);
        }
      };

      refetch();

      return () => {};
    }, [currentTeamId, queryClient, user?.id]),
  );

  const { data: pitAssignments } = useFetchPitScoutingAssignments(
    user?.id,
    currentTeamId,
  );

  if (!pitAssignments || pitAssignments.length === 0) {
    return <NoAssignments userId={user?.id} teamId={currentTeamId} />;
  }

  return (
    <Card className={'my-3'}>
      <CardHeader>
        <CardTitle>
          Pit Assignments{' '}
          <ReloadButton userId={user?.id} teamId={currentTeamId} />
        </CardTitle>
        <CardDescription>
          You have been assigned {pitAssignments.length}{' '}
          {pitAssignments.length === 1 ? 'team' : 'teams'} to scout. Please
          click on a team to begin scouting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FlatList
          data={pitAssignments}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View className={'mb-3 h-px w-full'} />}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <Link href={`/form/pit/${item.teamNumber}`}>
              <Card className={'w-full'}>
                <CardHeader>
                  <CardTitle>Pit Scout</CardTitle>
                  <CardDescription>
                    <Badge className={'mr-2'}>
                      <Text>{`Team ${item.teamNumber}`}</Text>
                    </Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        />
      </CardContent>
    </Card>
  );
}

function NoAssignments({
  userId,
  teamId,
}: {
  userId?: string;
  teamId?: string | null;
}) {
  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>
          No Teams Assigned <ReloadButton userId={userId} teamId={teamId} />
        </CardTitle>
        <CardDescription>
          You have not been assigned any teams to scout. Please check back
          later.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function ReloadButton({ userId, teamId }: { userId: string; teamId: string }) {
  const queryClient = useQueryClient();

  return (
    <Button
      size={'icon'}
      variant={'ghost'}
      onPress={async () => {
        await refetchPitScoutingAssignments(queryClient, userId, teamId);
      }}
    >
      <RefreshCcw size={18} />
    </Button>
  );
}
