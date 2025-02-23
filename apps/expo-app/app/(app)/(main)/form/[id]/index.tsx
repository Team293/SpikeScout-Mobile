import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { RenderForm } from '@kit/scouting/src/components/render-form';
import { useFetchMatchFormSchema } from '@kit/scouting/src/lib/hooks/use-fetch-match-form-schema';
import { useSubmitMatchForm } from '@kit/scouting/src/lib/hooks/use-submit-match-form';
import { useFetchTeam } from '@kit/teams/src/lib/hooks/use-fetch-team';
import { useCurrentTeamId } from '@kit/teams/src/lib/hooks/use-team-store';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui';

export default function FormPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: fields, isLoading } = useFetchMatchFormSchema();
  const currentTeamId = useCurrentTeamId();
  const { data: team } = useFetchTeam(currentTeamId);
  const submitMatchForm = useSubmitMatchForm();

  const teamNumber = id?.toString().split('-')[0];
  const matchNumber = id?.toString().split('-')[1];

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

  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Match Form | ' + id,
        }}
      />
      <Card className={'m-5'}>
        <CardHeader>
          <CardTitle>Match Form | {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollView>
            <RenderForm
              fields={fields}
              form={form}
              handleCustomSubmit={(data: any) => {
                submitMatchForm(
                  data,
                  fields,
                  team?.current_event,
                  currentTeamId,
                  Number(matchNumber),
                  Number(teamNumber),
                );
                router.push('/');
              }}
            />
          </ScrollView>
        </CardContent>
      </Card>
    </View>
  );
}
