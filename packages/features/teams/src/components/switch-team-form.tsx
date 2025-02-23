import React from 'react';

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSignOut, useUser } from '@kit/supabase';
import {
  Option,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui';

import { useFetchTeams } from '../lib/hooks/use-fetch-teams';
import { useCurrentTeamId, useUpdateTeam } from '../lib/hooks/use-team-store';

export function SwitchTeamForm() {
  const { data: user } = useUser();
  const updateTeam = useUpdateTeam();
  const currentTeamId = useCurrentTeamId();
  const { data: userTeams } = useFetchTeams(user?.id);
  const signOutMutation = useSignOut();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const selectedTeam: Option | undefined = userTeams?.find(
    (team) => team.id === currentTeamId,
  )
    ? {
        value: currentTeamId,
        label: userTeams.find((team) => team.id === currentTeamId)!.name,
      }
    : undefined;

  return (
    <View className="flex flex-col gap-4">
      <Select
        value={selectedTeam}
        onValueChange={(option?: Option) => {
          if (option?.value) {
            if (!(option.value === currentTeamId)) {
              updateTeam(option.value);
              signOutMutation.mutate();
            }
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent insets={contentInsets}>
          {userTeams?.map((team) => (
            <SelectItem key={team.id} label={team.name} value={team.id} />
          ))}
        </SelectContent>
      </Select>
    </View>
  );
}
