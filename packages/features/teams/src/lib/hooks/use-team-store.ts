import { create } from 'zustand';

interface TeamState {
  teamId: string | null;
  setTeamId: (id: string | null | undefined) => void;
}

const useTeamStore = create<TeamState>((set) => ({
  teamId: null,
  setTeamId: (id) => set(() => ({ teamId: id })),
}));

export function useUpdateTeam() {
  const setTeamId = useTeamStore((state) => state.setTeamId);
  return (newId: string | null | undefined) => {
    setTeamId(newId);
  };
}

export function useCurrentTeamId() {
  return useTeamStore((state) => state.teamId);
}
