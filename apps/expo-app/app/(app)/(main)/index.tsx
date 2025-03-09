import { MatchScoutingAssignmentsList } from '@kit/scouting/src/components/match-scouting-assignments-list';
import { useCurrentTeamId } from '@kit/teams/src/lib/hooks/use-team-store';
import { Card, CardContent, CardHeader, CardTitle, Text } from '@kit/ui';

export default function HomePage() {
  const currentTeamId = useCurrentTeamId();

  if (!currentTeamId) {
    return <NoTeam />;
  }

  return <MatchScoutingAssignmentsList />;
}

export function NoTeam() {
  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>No Team Selected</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>
          You have not selected a team. Please select a team in Settings -{'>'}{' '}
          Team. If there is no team available, please request to be added to
          one.
        </Text>
      </CardContent>
    </Card>
  );
}
