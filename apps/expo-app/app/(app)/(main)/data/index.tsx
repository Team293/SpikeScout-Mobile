import { Stack } from 'expo-router';
import { View } from 'react-native';

import { LocalDataCard } from '@kit/scouting/src/components/local-data-card';
import { useCurrentTeamId } from '@kit/teams/src/lib/hooks/use-team-store';

import { NoTeam } from '../index';

export default function DataPage() {
  const currentTeamId = useCurrentTeamId();

  if (!currentTeamId) {
    return <NoTeam />;
  }

  return (
    <View>
      <Stack.Screen options={{ title: 'Local Data' }} />
      <LocalDataCard />
    </View>
  );
}
