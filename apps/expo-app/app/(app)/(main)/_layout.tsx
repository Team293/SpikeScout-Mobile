import { useEffect } from 'react';

import { Redirect, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { DatabaseIcon, HomeIcon, SettingsIcon } from 'lucide-react-native';

import {
  AuthProvider,
  AuthProviderLoading,
  AuthProviderSignedIn,
  AuthProviderSignedOut,
} from '@kit/supabase';

void SplashScreen.preventAutoHideAsync();

export default function MainLayout() {
  return (
    <AuthProvider>
      <AuthProviderLoading>
        <SplashScreenLoading />
      </AuthProviderLoading>

      <AuthProviderSignedIn>
        <MainLayoutTabs />
      </AuthProviderSignedIn>

      <AuthProviderSignedOut>
        <Redirect href={'/auth/sign-in'} />
      </AuthProviderSignedOut>
    </AuthProvider>
  );
}

function MainLayoutTabs() {
  return (
    <Tabs initialRouteName={'index'}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: '/',
          tabBarIcon: () => <HomeIcon className={'h-5'} />,
        }}
      />

      <Tabs.Screen
        name="data"
        options={{
          href: '/data',
          title: 'Data',
          headerShown: false,
          tabBarIcon: () => <DatabaseIcon className={'h-5'} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          href: '/settings',
          headerShown: false,
          tabBarIcon: () => <SettingsIcon className={'h-5'} />,
        }}
      />

      <Tabs.Screen
        name="form/[id]/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

function SplashScreenLoading() {
  useEffect(() => {
    return () => {
      void SplashScreen.hideAsync();
    };
  });

  return null;
}
