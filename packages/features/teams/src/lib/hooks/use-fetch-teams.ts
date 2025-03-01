import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

export function useFetchTeams(userId: string | null | undefined) {
  const supabase = useSupabase();
  const queryKey = ['teams', userId];

  const queryFn = async () => {
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('accounts_memberships')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!userId,
  });
}
