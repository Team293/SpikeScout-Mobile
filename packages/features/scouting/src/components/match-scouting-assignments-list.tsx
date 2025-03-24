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
  refetchMatchFormSchema,
  refetchMatchScoutingAssignments,
  useFetchMatchScoutingAssignments,
} from '../lib/hooks/match';

export function MatchScoutingAssignmentsList() {
  const { data: user } = useUser();
  const currentTeamId = useCurrentTeamId();
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      const refetch = async () => {
        if (user?.id && currentTeamId) {
          await refetchMatchScoutingAssignments(
            queryClient,
            user.id,
            currentTeamId,
          );

          await refetchMatchFormSchema(queryClient);
        }
      };

      refetch();

      return () => {};
    }, [currentTeamId, queryClient, user?.id]),
  );

  const { data: matchAssignments } = useFetchMatchScoutingAssignments(
    user?.id,
    currentTeamId,
  );

  const getAllianceColor = (teamPosition: number) => {
    if (teamPosition <= 3) {
      return '#f54542';
    } else {
      return '#4272f5';
    }
  };

  if (!matchAssignments || matchAssignments.length === 0) {
    return <NoAssignments userId={user?.id} teamId={currentTeamId} />;
  }

  return (
    <Card className={'my-3 h-[89%]'}>
      <CardHeader>
        <CardTitle>
          Match Assignments{' '}
          <ReloadButton userId={user?.id} teamId={currentTeamId} />
        </CardTitle>
        <CardDescription>
          You have been assigned {matchAssignments.length}{' '}
          {matchAssignments.length === 1 ? 'match' : 'matches'} to scout. Please
          click on a match to start scouting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FlatList
          className={'max-h-[90%]'}
          data={matchAssignments}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View className={'mb-3 h-px w-full'} />}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <Link
              href={`/form/match/${item.teamNumber}-${item.matchNumber}-${item.teamPosition}`}
            >
              <Card className={'w-full'}>
                <CardHeader>
                  <CardTitle>Match {item.matchNumber}</CardTitle>
                  <CardDescription>
                    <Badge
                      className={'mr-2'}
                      style={{
                        backgroundColor: getAllianceColor(item.teamPosition),
                      }}
                    >
                      <Text>
                        {item.teamNumber
                          ? `Team ${item.teamNumber}`
                          : `${getAllianceColor(item.teamPosition).charAt(0).toUpperCase() + getAllianceColor(item.teamPosition).slice(1)} ${item.teamPosition}`}
                      </Text>
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
  teamId?: string;
}) {
  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>
          No Matches Assigned <ReloadButton userId={userId} teamId={teamId} />
        </CardTitle>
        <CardDescription>
          You have not been assigned any matches to scout. Please check back
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
        await refetchMatchScoutingAssignments(queryClient, userId, teamId);
      }}
    >
      <RefreshCcw size={18} />
    </Button>
  );
}
