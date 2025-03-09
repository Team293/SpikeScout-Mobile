import { useNetInfo } from '@react-native-community/netinfo';
import { Stack } from 'expo-router';
import { View } from 'react-native';

import { UpdateProfileContainer } from '@kit/account';

import { OfflineNotSupported } from '../_components/offline-not-supported';

export default function ProfileSettingsPage() {
  const network = useNetInfo();

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Profile',
          headerBackVisible: true,
          headerBackTitle: 'Settings',
          headerBackButtonMenuEnabled: true,
        }}
      />

      {network.isConnected ? (
        <UpdateProfileContainer />
      ) : (
        <OfflineNotSupported />
      )}
    </View>
  );
}
