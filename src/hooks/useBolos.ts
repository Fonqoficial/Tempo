import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useBolos() {
  return useQuery({
    queryKey: ['bolos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bolo')
        .select(`
          *,
          grupo (nombre, color_hex),
          lugar (nombre, ciudad)
        `)
        .order('fecha_bolo', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}