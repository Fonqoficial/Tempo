import { useState } from 'react'; // Añade useState
import { X, Music, ExternalLink, Plus } from 'lucide-react';
import { useRepertorio } from '../hooks/useRepertorio';
import AddCancionModal from './AddCancionModal'; // Importa el nuevo modal

interface Props {
  bolo: any | null;
  onClose: () => void;
}

export default function RepertorioView({ bolo, onClose }: Props) {
  const { canciones, loading, refetch } = useRepertorio(bolo?.id);
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (!bolo) return null;

  // Calculamos el orden más alto para la siguiente canción
  const ultimoOrden = canciones.length > 0 
    ? Math.max(...canciones.map(c => c.orden)) 
    : 0;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 border-l border-staff animate-in slide-in-from-right duration-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-staff bg-surface">
          <div className="flex justify-between items-start mb-4">
            <button onClick={onClose} className="text-ink3 hover:text-accent transition-colors">
              <X size={24} />
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-3 py-1 rounded bg-accent text-white hover:bg-accent2 transition-colors"
              >
                <Plus size={12} /> Añadir
              </button>
            </div>
          </div>
          <h2 className="font-serif text-2xl text-ink leading-tight">{bolo.titulo}</h2>
          <p className="text-ink3 text-sm mt-1">{bolo.grupo?.nombre}</p>
        </div>

        {/* Lista de Canciones */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {loading ? (
            <div className="text-center py-10 font-mono text-accent">Cargando setlist...</div>
          ) : canciones.length > 0 ? (
            <div className="space-y-3">
              {canciones.map((item) => (
                <div key={item.id} className="group flex items-center gap-4 p-3 rounded-xl border border-staff hover:border-accent/30 hover:bg-surface transition-all">
                  <div className="bg-staff text-ink2 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm group-hover:bg-accent group-hover:text-white transition-colors">
                    {item.orden}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-ink text-[13px] uppercase tracking-wide">{item.partituras?.titulo}</h4>
                    <p className="text-[11px] text-ink3 font-mono">{item.partituras?.autor}</p>
                  </div>
                  {item.partituras?.link_pdf && (
                    <a href={item.partituras.link_pdf} target="_blank" rel="noreferrer" className="text-ink3 hover:text-accent p-2">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Music className="mx-auto text-staff mb-4" size={40} />
              <p className="text-ink3 font-mono text-sm">Sin canciones.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para añadir canciones */}
      <AddCancionModal 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        boloId={bolo.id}
        ultimoOrden={ultimoOrden}
        onSuccess={() => refetch()}
      />
    </div>
  );
}