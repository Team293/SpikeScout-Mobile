import { z } from 'zod';

import {
  createFetchScoutingAssignmentsHook,
  createRefetchScoutingAssignments,
} from '../use-fetch-scouting-assignments';
import { useFetchAllPitData } from './use-fetch-all-pit-data';

const PitAssignmentSchema = z.array(
  z.object({
    teams: z.array(z.number()),
    scouts: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  }),
);

export interface PitTeamAssignment {
  teamNumber: number;
  scouts: Array<{ id: string; name: string }>;
}

export const useFetchPitScoutingAssignments =
  createFetchScoutingAssignmentsHook<any, PitTeamAssignment>({
    type: 'pit',
    useGetAllData: useFetchAllPitData,

    hasScouted: (pitData) => {
      return (teamNumber: number) => {
        if (!pitData) return false;

        const hasScoutedPit = pitData.find(
          (entry) => entry.team_number === teamNumber,
        );

        return !!hasScoutedPit;
      };
    },

    processScheduleData: (scheduleData, userId) => {
      const parsedAssignments = PitAssignmentSchema.parse(scheduleData);

      const userAssignments = parsedAssignments.filter((assignment) =>
        assignment.scouts.some((scout) => scout.id === userId),
      );

      const flattenedTeamAssignments = userAssignments.flatMap((assignment) =>
        assignment.teams.map((teamNumber) => ({
          teamNumber,
          scouts: assignment.scouts,
        })),
      );

      return flattenedTeamAssignments;
    },
  });

export const refetchPitScoutingAssignments =
  createRefetchScoutingAssignments('pit');
