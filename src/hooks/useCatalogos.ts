import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Grupo, Lugar } from '../types';

export function useCatalogos() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [lugares, setLugares] = useState<Lugar[]>([]);

  useEffect(() => {
    async function cargarDatos() {
      const { data: g } = await supabase.from('grupo').select('*').order('nombre');
      const { data: l } = await supabase.from('lugar').select('*').order('nombre');
      if (g) setGrupos(g);
      if (l) setLugares(l);
    }
    cargarDatos();
  }, []);

  return { grupos, lugares };
}