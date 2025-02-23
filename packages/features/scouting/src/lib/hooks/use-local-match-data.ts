import { MatchData, matchDataStore } from './use-submit-match-form';





export function useLocalMatchData(): MatchData[] | null {
  return matchDataStore.getState().matchData;
}
