import { useEffect } from 'react';

import { Redirect, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { DatabaseIcon, HomeIcon, SettingsIcon } from 'lucide-react-native';

import {
  useFetchAllMatchData,
  useFetchMatchFormSchema,
  useFetchMatchScoutingAssignments,
  useFetchPitFormSchema,
} from '@kit/scouting';
import {
  AuthProvider,
  AuthProviderLoading,
  AuthProviderSignedIn,
  AuthProviderSignedOut,
  useUser,
} from '@kit/supabase';
import { useFetchTeam } from '@kit/teams/src/lib/hooks/use-fetch-team';
import { useFetchTeams } from '@kit/teams/src/lib/hooks/use-fetch-teams';
import {
  useCurrentTeamId,
  useUpdateTeam,
} from '@kit/teams/src/lib/hooks/use-team-store';

void SplashScreen.preventAutoHideAsync();

export default function MainLayout() {
  const currentTeam = useCurrentTeamId();
  const updateTeam = useUpdateTeam();
  const { data: user } = useUser();
  const { data: teams } = useFetchTeams(user?.id);

  if (currentTeam == null && teams && teams[0]) {
    updateTeam(teams[0].account_id);
  }

  useFetchTeam(currentTeam);
  useFetchMatchFormSchema();
  useFetchMatchScoutingAssignments(user?.id, currentTeam);
  useFetchAllMatchData(currentTeam);

  useFetchPitFormSchema();
  useFetchMatchScoutingAssignments(user?.id, currentTeam);
  useFetchAllMatchData(currentTeam);

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
        name="form/match/[id]/index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="form/pit/[id]/index"
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
