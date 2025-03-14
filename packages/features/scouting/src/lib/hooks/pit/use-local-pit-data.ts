import { useEffect, useState } from 'react';

import { getLocalMatchData } from '../../../utils/local-match-storage';
import { PitData } from './use-submit-pit-form';

export function useLocalPitData() {
  const [localPitData, setLocalPitData] = useState<PitData[]>([]);

  useEffect(() => {
    const fetchLocalData = async () => {
      const data = await getLocalMatchData();
      setLocalPitData(data);
    };

    fetchLocalData().catch(console.error);

    const intervalId = setInterval(() => {
      void fetchLocalData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return localPitData;
}
