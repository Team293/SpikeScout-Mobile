import { useNetInfo } from '@react-native-community/netinfo';
import { Stack } from 'expo-router';
import { View } from 'react-native';

import { UpdateTeamContainer } from '@kit/teams';

import { OfflineNotSupported } from '../_components/offline-not-supported';

export default function TeamSettingsPage() {
  const network = useNetInfo();

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

      {network.isConnected ? <UpdateTeamContainer /> : <OfflineNotSupported />}
    </View>
  );
}
