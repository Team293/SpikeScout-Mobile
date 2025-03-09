import { useNetInfo } from '@react-native-community/netinfo';
import { Stack } from 'expo-router';
import { View } from 'react-native';

import { UpdateAccountContainer } from '@kit/account';

import { OfflineNotSupported } from '../_components/offline-not-supported';

export default function AccountSettingsPage() {
  const network = useNetInfo();

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Account',
          headerBackTitle: 'Settings',
          headerBackVisible: true,
          headerBackButtonMenuEnabled: true,
          headerShown: true,
        }}
      />

      {network.isConnected ? (
        <UpdateAccountContainer />
      ) : (
        <OfflineNotSupported />
      )}
    </View>
  );
}
