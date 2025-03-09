import React from 'react';

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '@kit/supabase';
import {
  Option,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui';

import { useFetchTeam } from '../lib/hooks/use-fetch-team';
import { useFetchTeams } from '../lib/hooks/use-fetch-teams';
import { useCurrentTeamId, useUpdateTeam } from '../lib/hooks/use-team-store';

function TeamSelectItem({ team }: { team: { account_id: string } }) {
  const { data: teamData } = useFetchTeam(team.account_id);

  return (
    <SelectItem
      key={team.account_id}
      label={teamData?.name ?? 'Loading...'}
      value={team.account_id}
    />
  );
}

export function SwitchTeamForm() {
  const { data: user } = useUser();
  const updateTeam = useUpdateTeam();
  const currentTeamId = useCurrentTeamId();
  const { data: userTeams } = useFetchTeams(user?.id);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const selectedTeamData = useFetchTeam(currentTeamId);

  const selectedTeam: Option | undefined = currentTeamId
    ? {
        value: currentTeamId,
        label: selectedTeamData.data?.name ?? 'Loading...',
      }
    : undefined;

  return (
    <View className="flex flex-col gap-4">
      <Select
        value={selectedTeam}
        onValueChange={(option?: Option) => {
          if (option?.value && option.value !== currentTeamId) {
            updateTeam(option.value);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue
            placeholder="Select a team"
            className={'text-foreground'}
          />
        </SelectTrigger>
        <SelectContent insets={contentInsets}>
          {userTeams?.map((team) => (
            <TeamSelectItem key={team.account_id} team={team} />
          ))}
        </SelectContent>
      </Select>
    </View>
  );
}
