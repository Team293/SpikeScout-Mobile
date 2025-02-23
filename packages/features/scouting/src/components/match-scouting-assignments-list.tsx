import React from 'react';

import { Link } from 'expo-router';
import { FlatList, View } from 'react-native';

import { useUser } from '@kit/supabase';
import { useCurrentTeamId } from '@kit/teams/src/lib/hooks/use-team-store';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from '@kit/ui';

import { useFetchMatchScoutingAssignments } from '../lib/hooks/use-fetch-match-scouting-assignments';

export function MatchScoutingAssignmentsList() {
  const { data: user } = useUser();
  const currentTeamId = useCurrentTeamId();

  const { data: matchAssignments } = useFetchMatchScoutingAssignments(
    user?.id,
    currentTeamId,
  );

  const getAllianceColor = (teamPosition: number) => {
    if (teamPosition <= 3) {
      return 'red';
    } else {
      return 'blue';
    }
  };

  if (!matchAssignments || matchAssignments.length === 0) {
    return <NoAssignments />;
  }

  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>Match Assignments</CardTitle>
        <CardDescription>
          You have been assigned {matchAssignments.length}{' '}
          {matchAssignments.length === 1 ? 'match' : 'matches'} to scout. Please
          click on a match to start scouting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FlatList
          data={matchAssignments}
          ItemSeparatorComponent={() => (
            <View className={'bg-border h-px w-full'} />
          )}
          renderItem={({ item }) => (
            <Link href={`/form/${item.teamNumber}-${item.matchNumber}`}>
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
                      <Text>{item.teamNumber}</Text>
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

function NoAssignments() {
  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>No Matches Assigned</CardTitle>
        <CardDescription>
          You have not been assigned any matches to scout. Please check back
          later.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
