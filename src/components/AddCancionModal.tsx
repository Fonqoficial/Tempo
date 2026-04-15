import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Search, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  boloId: number;
  ultimoOrden: number;
  onSuccess: () => void;
}

export default function AddCancionModal({ isOpen, onClose, boloId, ultimoOrden, onSuccess }: Props) {
  const [partituras, setPartituras] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchPartituras = async () => {
        const { data } = await supabase.from('partituras').select('*').order('titulo');
        if (data) setPartituras(data);
      };
      fetchPartituras();
    }
  }, [isOpen]);

  const añadirABolo = async (partituraId: number) => {
    const { error } = await supabase.from('item_repertorio').insert([
      {
        bolo_id: boloId,
        partitura_id: partituraId,
        orden: ultimoOrden + 1
      }
    ]);

    if (!error) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  const filtradas = partituras.filter(p => 
    p.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.autor?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-staff">
        <div className="p-4 border-b border-staff flex justify-between items-center bg-surface">
          <h3 className="font-serif text-lg text-ink">Añadir al Repertorio</h3>
          <button onClick={onClose} className="text-ink3 hover:text-accent"><X size={20}/></button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-ink3" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-staff outline-none focus:border-accent"
              placeholder="Buscar canción o autor..."
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filtradas.map(p => (
              <button 
                key={p.id}
                onClick={() => añadirABolo(p.id)}
                className="w-full flex justify-between items-center p-3 rounded-xl border border-staff hover:border-accent hover:bg-accent/5 transition-all text-left group"
              >
                <div>
                  <div className="font-bold text-sm text-ink uppercase">{p.titulo}</div>
                  <div className="text-xs text-ink3">{p.autor}</div>
                </div>
                <Plus size={18} className="text-ink3 group-hover:text-accent" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}