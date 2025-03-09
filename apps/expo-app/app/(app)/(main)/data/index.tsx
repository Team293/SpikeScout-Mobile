import { LocalMatchDataCard } from '@kit/scouting/src/components/local-match-data-card';
import { useCurrentTeamId } from '@kit/teams/src/lib/hooks/use-team-store';

import { NoTeam } from '../index';

export default function DataPage() {
  const currentTeamId = useCurrentTeamId();

  if (!currentTeamId) {
    return <NoTeam />;
  }

  return <LocalMatchDataCard />;
}
