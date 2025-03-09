import { useEffect, useState } from 'react';

import { getLocalMatchData } from '../../utils/local-match-storage';
import { MatchData } from './use-submit-match-form';

export function useLocalMatchData() {
  const [localMatchData, setLocalMatchData] = useState<MatchData[]>([]);

  useEffect(() => {
    const fetchLocalData = async () => {
      const data = await getLocalMatchData();
      setLocalMatchData(data);
    };

    fetchLocalData().catch(console.error);

    const intervalId = setInterval(() => {
      void fetchLocalData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return localMatchData;
}
