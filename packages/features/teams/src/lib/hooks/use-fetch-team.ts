import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

export function useFetchTeam(teamId: string | null | undefined) {
  const supabase = useSupabase();
  const queryKey = ['team', teamId];

  const queryFn = async () => {
    if (!teamId) {
      return null;
    }

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', teamId)
      .eq('is_personal_account', false)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!teamId,
  });
}
