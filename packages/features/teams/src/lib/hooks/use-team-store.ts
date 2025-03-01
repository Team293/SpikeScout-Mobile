import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TeamState {
  teamId: string | null;
  setTeamId: (id: string | null | undefined) => void;
}

const useTeamStore = create<TeamState, [['zustand/persist', TeamState]]>(
  persist(
    (set) => ({
      teamId: null,
      setTeamId: (id) => set(() => ({ teamId: id })),
    }),
    {
      name: 'team-store',
      getStorage: () => AsyncStorage,
    },
  ),
);

export function useUpdateTeam() {
  const setTeamId = useTeamStore((state) => state.setTeamId);
  return (newId: string | null | undefined) => {
    setTeamId(newId);
  };
}

export function useCurrentTeamId() {
  return useTeamStore((state) => state.teamId);
}
