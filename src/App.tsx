import { useBolos } from './hooks/useBolos';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Clock, Music } from 'lucide-react';
import type { Bolo } from './types';

function App() {
  const { data: bolos, isLoading, error } = useBolos();

  if (isLoading) return <div className="p-10 font-mono text-accent">Cargando partituras...</div>;
  if (error) return <div className="p-10 text-red-500">Error de conexión</div>;

  return (
    <div className="min-h-screen bg-surface font-outfit">
      {/* Header estilo informe */}
      <header className="bg-ink text-white p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="font-serif text-5xl mb-2">
            🎼 <em className="text-accent2 not-italic">Tempo</em>
          </h1>
          <p className="font-mono text-sm text-ink3 uppercase tracking-tighter">
            Gestión de Eventos / v0.1
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-ink flex items-center gap-2">
            <Calendar className="text-accent" /> Próximos Bolos
          </h2>
          <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-accent/20">
            + Nuevo Bolo
          </button>
        </div>

        <div className="space-y-6">
          {bolos?.map((bolo: Bolo) => (
            <div 
              key={bolo.id} 
              className="bg-white border-l-4 rounded-xl shadow-sm p-5 flex items-start gap-4 transition-transform hover:scale-[1.01]"
              style={{ borderLeftColor: bolo.grupo?.color_hex || '#c8463a' }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-staff text-ink2">
                    {bolo.grupo?.nombre}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    bolo.estado_confirmacion === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {bolo.estado_confirmacion}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-ink mb-2">{bolo.titulo}</h3>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm text-ink2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-accent2" />
                    <span>{bolo.hora_inicio?.slice(0, 5)} - {bolo.hora_fin?.slice(0, 5)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-accent2" />
                    <span>{bolo.lugar?.nombre}, {bolo.lugar?.ciudad}</span>
                  </div>
                </div>
              </div>

              <div className="text-right border-l border-staff pl-4">
                <div className="text-2xl font-serif text-accent">
                  {format(new Date(bolo.fecha_bolo), 'dd')}
                </div>
                <div className="text-xs font-mono uppercase text-ink3">
                  {format(new Date(bolo.fecha_bolo), 'MMM', { locale: es })}
                </div>
              </div>
            </div>
          ))}

          {bolos?.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-staff rounded-2xl">
              <Music className="mx-auto text-staff mb-4" size={48} />
              <p className="text-ink3 font-mono">No hay eventos programados. ¡Añade el primero!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;