import React from 'react';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { RenderForm } from '@kit/scouting/src/components/render-form';
import { useFetchPitFormSchema } from '@kit/scouting/src/lib/hooks/pit/use-fetch-pit-form-schema';
import { useSubmitPitForm } from '@kit/scouting/src/lib/hooks/pit/use-submit-pit-form';
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
  const { data: schema, isLoading } = useFetchPitFormSchema();
  const currentTeamId = useCurrentTeamId();
  const { data: team } = useFetchTeam(currentTeamId);
  const submitPitForm = useSubmitPitForm();

  const teamNumber: string = id?.toString();

  const form = useForm();

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
          title: `Scouting Team ${teamNumber}`,
        }}
      />
      <ScrollView>
        <Card className={'m-5'}>
          <CardHeader>
            <CardTitle>Pit Scouting Form</CardTitle>
            <CardDescription>
              <Badge className={'mr-2'}>
                <Text>{Number(teamNumber)}</Text>
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RenderForm
              fields={formFields}
              form={form}
              handleCustomSubmit={async (data: any) => {
                await submitPitForm({
                  data: data,
                  schema: formFields,
                  formName: schema.name,
                  eventCode: team?.current_event,
                  teamId: team?.id,
                  teamNumber: Number(teamNumber) || 0,
                });

                router.push('/');
              }}
            />
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
