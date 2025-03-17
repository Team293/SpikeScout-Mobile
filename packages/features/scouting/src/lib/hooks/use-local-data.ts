import { useCallback, useEffect, useState } from 'react';

import { MatchData, PitData, ScoutingType } from '../../types';
import { getLocalData } from '../../utils/local-storage';

type ScoutingDataType<T extends ScoutingType> = T extends 'match' ? MatchData : PitData;

export function createLocalDataHook<T extends ScoutingType>(type: T) {
  return function useLocalData() {
    const [localData, setLocalData] = useState<ScoutingDataType<T>[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLocalData = useCallback(async () => {
      setLoading(true);
      try {
        const data = await getLocalData<T>(type);
        setLocalData(data);
      } catch (error) {
        console.error(`Error fetching local ${type} data:`, error);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchLocalData();
    }, [fetchLocalData]);

    return {
      data: localData,
      loading,
      refresh: fetchLocalData,
    };
  };
} 