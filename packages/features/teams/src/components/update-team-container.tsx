import { View } from 'react-native';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui';

import { SwitchTeamForm } from './switch-team-form';

export function UpdateTeamContainer() {
  return (
    <View className={'flex-col justify-center gap-4'}>
      <SwitchTeamContainer />
    </View>
  );
}

function SwitchTeamContainer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Switch your team</CardTitle>

        <CardDescription>
          Switch your currently selected team. This will sign you out.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SwitchTeamForm />
      </CardContent>
    </Card>
  );
}
