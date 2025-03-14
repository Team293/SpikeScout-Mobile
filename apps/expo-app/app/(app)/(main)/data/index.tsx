import { Stack } from 'expo-router';
import { View } from 'react-native';

import { LocalMatchDataCard } from '@kit/scouting/src/components/local-match-data-card';
import { LocalPitDataCard } from '@kit/scouting/src/components/local-pit-data-card';
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
      <LocalMatchDataCard />
      <LocalPitDataCard />
    </View>
  );
}
