import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRepertorio(boloId: number | null) {
  const [canciones, setCanciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRepertorio = async () => {
    if (!boloId) return;
    setLoading(true);

    // 1. Primero buscamos el ID del repertorio asociado a este bolo
    const { data: repertorioData } = await supabase
      .from('repertorio')
      .select('id')
      .eq('bolo_id', boloId)
      .single();

    if (repertorioData) {
      // 2. Ahora traemos los items usando los nombres de columna reales de tu SQL
      const { data, error } = await supabase
        .from('item_repertorio')
        .select(`
          id,
          posicion,
          partituras (
            id, 
            titulo, 
            compositor
          )
        `)
        .eq('repertorio_id', repertorioData.id)
        .order('posicion', { ascending: true });

      if (error) {
        console.error("Error cargando temas:", error);
      } else {
        // Mapeamos los datos para que el resto de tu App no explote 
        // (convertimos 'posicion' en 'orden' y 'compositor' en 'autor')
        const formateadas = data.map(item => ({
          id: item.id,
          orden: item.posicion,
          partituras: {
            ...item.partituras,
            autor: item.partituras.compositor // Adaptamos para el componente
          }
        }));
        setCanciones(formateadas);
      }
    } else {
      setCanciones([]); // Si el bolo no tiene repertorio creado aún
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRepertorio();
  }, [boloId]);

  return { canciones, loading, refetch: fetchRepertorio };
}