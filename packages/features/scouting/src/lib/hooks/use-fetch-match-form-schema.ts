import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

interface MatchFormSchema {
  schema: any;
  name: string;
}

export function useFetchMatchFormSchema() {
  const supabase = useSupabase();
  const queryKey = ['form', 'schema', 'match'];

  const queryFn = async (): Promise<MatchFormSchema | null> => {
    try {
      const { data, error } = await supabase
        .from('scouting_schemas')
        .select('*')
        .eq('scouting_type', 'match')
        .eq('current', true)
        .limit(1);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0 || !data[0]) {
        return null;
      }

      return {
        schema: data[0].schema || {},
        name: data[0].name || 'Untitled Form',
      };
    } catch (err) {
      console.error('Error fetching form schema:', err);
      throw err;
    }
  };

  return useQuery({
    queryKey,
    queryFn,
  });
}
