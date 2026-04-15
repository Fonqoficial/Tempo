import { useState } from 'react';
import { useBolos } from './hooks/useBolos';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Clock, Music, Search, Filter, List } from 'lucide-react';
import type { Bolo } from './types';
import BoloModal from './components/BoloModal';
import RepertorioView from './components/RepertorioView';
import CalendarioView from './components/CalendarioView'; // Nuevo componente

function App() {
  // Estados de Filtros y Vista (Fase 5)
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState('Todos');
  const [vista, setVista] = useState<'lista' | 'calendario'>('lista');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBolo, setSelectedBolo] = useState<Bolo | null>(null);
  
  const { data: bolos, isLoading, error, refetch } = useBolos();

  if (isLoading) return <div className="p-10 font-mono text-accent">Cargando agenda de Tempo...</div>;
  if (error) return <div className="p-10 text-red-500 font-mono">Error de conexión con la base de datos</div>;

  // Lógica de filtrado centralizada
  const bolosFiltrados = bolos?.filter(bolo => {
    const coincideTexto = bolo.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                          bolo.lugar?.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideGrupo = filtroGrupo === 'Todos' || bolo.grupo?.nombre === filtroGrupo;
    
    return coincideTexto && coincideGrupo;
  });

  const nombresGrupos = Array.from(new Set(bolos?.map(b => b.grupo?.nombre).filter(Boolean)));

  return (
    <div className="min-h-screen bg-surface font-outfit">
      {/* Header Corporativo */}
      <header className="bg-ink text-white p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="font-serif text-5xl mb-2">
            🎼 <em className="text-accent2 not-italic">Tempo</em>
          </h1>
          <p className="font-mono text-sm text-ink3 uppercase tracking-tighter">
            Sistema de Gestión Musical / v1.0
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-20">
        
        {/* Barra de Acciones Superior */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-ink flex items-center gap-2">
              <Calendar className="text-accent" /> 
              {vista === 'lista' ? 'Próximos Eventos' : 'Planificación Mensual'}
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Switch de Vista */}
            <div className="flex bg-staff/30 p-1 rounded-xl border border-staff">
              <button 
                onClick={() => setVista('lista')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  vista === 'lista' ? 'bg-white text-accent shadow-sm' : 'text-ink3 hover:text-ink2'
                }`}
              >
                <List size={14} /> Lista
              </button>
              <button 
                onClick={() => setVista('calendario')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  vista === 'calendario' ? 'bg-white text-accent shadow-sm' : 'text-ink3 hover:text-ink2'
                }`}
              >
                <Calendar size={14} /> Calendario
              </button>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-accent hover:bg-accent2 text-white px-6 py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-widest transition-all shadow-lg shadow-accent/20 active:scale-95"
            >
              + Nuevo Evento
            </button>
          </div>
        </div>

        {/* Panel de Filtros */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-staff mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-ink3" size={18} />
            <input 
              type="text"
              placeholder="Filtrar por nombre, lugar o ciudad..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-staff outline-none focus:border-accent transition-all bg-surface/30 text-sm"
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-ink3" />
            <select 
              className="px-4 py-2 rounded-xl border border-staff outline-none focus:border-accent bg-white text-ink2 text-sm font-medium cursor-pointer"
              onChange={(e) => setFiltroGrupo(e.target.value)}
            >
              <option value="Todos">Todos los Grupos</option>
              {nombresGrupos.map(nombre => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Renderizado de Vistas (Fase 5) */}
        {vista === 'lista' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {bolosFiltrados?.map((bolo: Bolo) => (
              <div 
                key={bolo.id} 
                onClick={() => setSelectedBolo(bolo)}
                className="bg-white border-l-[6px] rounded-2xl shadow-sm p-6 flex items-start gap-5 transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group border-staff"
                style={{ borderLeftColor: bolo.grupo?.color_hex || '#c8463a' }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-staff text-ink2 tracking-tighter">
                      {bolo.grupo?.nombre}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      bolo.estado_confirmacion === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {bolo.estado_confirmacion}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-ink mb-3 group-hover:text-accent transition-colors leading-tight">
                    {bolo.titulo}
                  </h3>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink2 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-accent" />
                      <span>{bolo.hora_inicio?.slice(0, 5)} - {bolo.hora_fin?.slice(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-accent" />
                      <span>{bolo.lugar?.nombre} · <span className="text-ink3 font-normal">{bolo.lugar?.ciudad}</span></span>
                    </div>
                  </div>
                </div>

                <div className="text-right border-l border-staff pl-6 min-w-[80px]">
                  <div className="text-3xl font-serif text-accent leading-none mb-1">
                    {format(new Date(bolo.fecha_bolo), 'dd')}
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase text-ink3 tracking-widest">
                    {format(new Date(bolo.fecha_bolo), 'MMM', { locale: es })}
                  </div>
                </div>
              </div>
            ))}

            {bolosFiltrados?.length === 0 && (
              <div className="text-center py-24 border-2 border-dashed border-staff rounded-[2rem] bg-white/50">
                <Music className="mx-auto text-staff mb-4 opacity-50" size={64} />
                <p className="text-ink3 font-mono text-sm uppercase tracking-widest">No hay eventos que coincidan</p>
              </div>
            )}
          </div>
        ) : (
          <CalendarioView 
            bolos={bolosFiltrados || []} 
            onSelectBolo={(bolo) => setSelectedBolo(bolo)} 
          />
        )}
      </main>

      {/* Modales y Paneles (Capa superior) */}
      <BoloModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        existingBolos={bolos || []}
        onSuccess={() => refetch()}
      />

      <RepertorioView 
        bolo={selectedBolo} 
        onClose={() => setSelectedBolo(null)} 
      />
    </div>
  );
}

export default App;