import { z } from 'zod';

import {
  createFetchScoutingAssignmentsHook,
  createRefetchScoutingAssignments,
} from '../use-fetch-scouting-assignments';
import { useFetchAllMatchData } from './use-fetch-all-match-data';

export const MatchScoutingAssignmentsSchema = z.array(
  z.object({
    userId: z.string(),
    teamNumber: z.number().optional(),
    matchNumber: z.number(),
    teamPosition: z.number(),
  }),
);

export const useFetchMatchScoutingAssignments =
  createFetchScoutingAssignmentsHook({
    type: 'match',
    useGetAllData: useFetchAllMatchData,

    hasScouted: (matchData) => {
      return (criteria: {
        matchNumber: number;
        teamNumber?: number;
        teamPosition: number;
      }) => {
        if (!matchData) return false;

        const hasScoutedMatch = matchData.find(
          (match) =>
            match.match_number === criteria.matchNumber &&
            (criteria.teamNumber != null
              ? match.team_number === criteria.teamNumber
              : true) &&
            (match as any).team_location === criteria.teamPosition,
        );

        return !!hasScoutedMatch;
      };
    },

    processScheduleData: (scheduleData, userId) => {
      const parsedAssignments =
        MatchScoutingAssignmentsSchema.parse(scheduleData);

      return parsedAssignments.filter(
        (assignment) => assignment.userId === userId,
      );
    },
  });

export const refetchMatchScoutingAssignments =
  createRefetchScoutingAssignments('match');
