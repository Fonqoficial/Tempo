import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRepertorio(boloId: number | null) {
  const [canciones, setCanciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRepertorio = async () => {
    if (!boloId) return;
    setLoading(true);
    const { data } = await supabase
      .from('item_repertorio')
      .select(`
        id,
        orden,
        partituras (id, titulo, autor, link_pdf)
      `)
      .eq('bolo_id', boloId)
      .order('orden', { ascending: true });

    if (data) setCanciones(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRepertorio();
  }, [boloId]);

  return { canciones, loading, refetch: fetchRepertorio };
}