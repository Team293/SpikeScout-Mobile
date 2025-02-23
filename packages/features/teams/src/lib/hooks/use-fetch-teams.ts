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
      .from('accounts')
      .select('*')
      .eq('primary_owner_user_id', userId)
      .eq('is_personal_account', false);

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
