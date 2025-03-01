import React from 'react';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { RenderForm } from '@kit/scouting/src/components/render-form';
import { useFetchMatchFormSchema } from '@kit/scouting/src/lib/hooks/use-fetch-match-form-schema';
import { useSubmitMatchForm } from '@kit/scouting/src/lib/hooks/use-submit-match-form';
import { useFetchTeam } from '@kit/teams/src/lib/hooks/use-fetch-team';
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

export default function FormPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: fields, isLoading } = useFetchMatchFormSchema();
  const currentTeamId = useCurrentTeamId();
  const { data: team } = useFetchTeam(currentTeamId);
  const submitMatchForm = useSubmitMatchForm();

  const teamNumber: string | undefined = id?.toString().split('-')[0];
  const matchNumber = id?.toString().split('-')[1];
  const teamPosition = id?.toString().split('-')[2];

  const form = useForm();

  const getAllianceColor = (teamPosition: number) => {
    if (teamPosition <= 3) {
      return 'red';
    } else {
      return 'blue';
    }
  };

  if (isLoading) {
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
      <Stack.Screen
        options={{
          title: `Scouting Match ${matchNumber}`,
        }}
      />
      <ScrollView>
        <Card className={'m-5'}>
          <CardHeader>
            <CardTitle>Match Scouting Form</CardTitle>
            <CardDescription>
              <Badge
                className={'mr-2'}
                style={{
                  backgroundColor: getAllianceColor(teamPosition),
                }}
              >
                <Text>
                  {Number(teamNumber)
                    ? `Team ${teamNumber}`
                    : `${
                        getAllianceColor(Number(teamPosition || 0))
                          .charAt(0)
                          .toUpperCase() +
                        getAllianceColor(Number(teamPosition || 0)).slice(1)
                      } ${teamPosition}`}
                </Text>
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RenderForm
              fields={JSON.parse(fields).fields}
              form={form}
              handleCustomSubmit={(data: any) => {
                submitMatchForm(
                  data,
                  fields,
                  team?.current_event,
                  currentTeamId,
                  Number(matchNumber),
                  Number(teamNumber),
                  Number(teamPosition),
                );
                router.push('/');
              }}
            />
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
