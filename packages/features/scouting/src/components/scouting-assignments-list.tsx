import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, Text } from '@kit/ui';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@kit/ui/src/components/ui/tabs';

import { MatchScoutingAssignmentsList } from './match-scouting-assignments-list';
import { PitScoutingAssignmentsList } from './pit-scouting-assignments-list';

export function ScoutingAssignmentsList() {
  const [tab, setTab] = useState<'match' | 'pit'>('match');

  return (
    <Card className={'m-5'}>
      <CardHeader>
        <CardTitle>Scouting Assignments</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs
          value={tab}
          onValueChange={(value: string) => setTab(value as 'match' | 'pit')}
          className={'mx-auto w-full flex-col gap-1.5'}
        >
          <TabsList className="w-full flex-row">
            <TabsTrigger value={'match'} className="flex-1 rounded-lg">
              <Text>Match</Text>
            </TabsTrigger>

            <TabsTrigger value={'pit'} className="flex-1 rounded-lg">
              <Text>Pit</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={'match'}>
            <MatchScoutingAssignmentsList />
          </TabsContent>

          <TabsContent value={'pit'}>
            <PitScoutingAssignmentsList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
