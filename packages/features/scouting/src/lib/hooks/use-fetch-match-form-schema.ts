import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

export function useFetchMatchFormSchema() {
  const supabase = useSupabase();
  const queryKey = ['form', 'schema', 'match'];

  const queryFn = async () => {
    const { data, error } = await supabase
      .from('scouting_schemas')
      .select('*')
      .eq('id', 0)
      .eq('scouting_type', 'match')
      .eq('current', true)
      .limit(1);

    console.log(data, error);

    if (error) {
      throw error;
    }

    return data[0]?.schema;
  };

  return useQuery({
    queryKey,
    queryFn,
  });
}
