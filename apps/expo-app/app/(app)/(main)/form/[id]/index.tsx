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
  const { data: schema, isLoading } = useFetchMatchFormSchema();
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

  if (!schema) {
    return (
      <Card className={'m-5'}>
        <CardHeader>
          <CardTitle>Form Not Found</CardTitle>
          <CardDescription>
            The form you are looking for does not exist. Please contact your
            team's scouting lead for more information.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formFields =
    schema && 'schema' in schema ? JSON.parse(schema.schema).fields : [];

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
                  backgroundColor: getAllianceColor(Number(teamPosition || 0)),
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
              fields={formFields}
              form={form}
              handleCustomSubmit={(data: any) => {
                submitMatchForm(
                  data,
                  formFields,
                  schema.name,
                  team?.current_event,
                  currentTeamId,
                  Number(matchNumber),
                  Number(teamNumber) || 0,
                  Number(teamPosition || 0),
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
