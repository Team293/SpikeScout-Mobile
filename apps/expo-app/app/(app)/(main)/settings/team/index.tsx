import { Stack } from 'expo-router';
import { View } from 'react-native';

import { UpdateTeamContainer } from '@kit/teams';

export default function TeamSettingsPage() {
  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Team',
          headerBackVisible: true,
          headerBackTitle: 'Settings',
          headerBackButtonMenuEnabled: true,
        }}
      />

      <UpdateTeamContainer />
    </View>
  );
}
