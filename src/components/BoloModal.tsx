import { useState, useEffect } from 'react';
import { X, AlertCircle, Calendar, Clock, Music, MapPin, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { hayColision } from '../lib/utils';
import type { Bolo, Grupo, Lugar } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  existingBolos: Bolo[];
  onSuccess: () => void;
}

export default function BoloModal({ isOpen, onClose, existingBolos, onSuccess }: Props) {
  // Estados para los catálogos dinámicos
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  
  const [formData, setFormData] = useState({
    titulo: '',
    fecha_bolo: '',
    hora_inicio: '',
    hora_fin: '',
    grupo_id: '', 
    lugar_id: '',
    estado_confirmacion: 'Pendiente'
  });

  // Carga de catálogos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const cargarCatalogos = async () => {
        const { data: g } = await supabase.from('grupo').select('*').order('nombre');
        const { data: l } = await supabase.from('lugar').select('*').order('nombre');
        if (g) setGrupos(g);
        if (l) setLugares(l);
      };
      cargarCatalogos();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Lógica de colisión refinada: Solo choca si es el MISMO GRUPO en la MISMA FECHA/HORA
  const colision = hayColision(
    formData.fecha_bolo,
    formData.hora_inicio,
    formData.hora_fin,
    formData.grupo_id, // Pasamos el ID del grupo seleccionado
    existingBolos
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (colision || !formData.grupo_id || !formData.lugar_id) return;

    const { error } = await supabase.from('bolo').insert([
      {
        ...formData,
        grupo_id: Number(formData.grupo_id),
        lugar_id: Number(formData.lugar_id)
      }
    ]);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-staff overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header del Modal */}
        <div className="bg-white p-6 border-b border-staff flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl text-ink">Agendar Evento</h2>
            <p className="text-xs font-mono text-ink3 uppercase">Fase 3: Registro Dinámico</p>
          </div>
          <button onClick={onClose} className="text-ink3 hover:text-accent transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título */}
          <div>
            <label className="flex items-center gap-2 text-xs font-mono uppercase text-ink2 mb-2">
              <Music size={14} /> Nombre del evento
            </label>
            <input 
              required
              placeholder="Ej: Concierto de Gala"
              className="w-full p-3 rounded-xl border border-staff focus:border-accent outline-none transition-all bg-white"
              type="text" 
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          {/* Selectores de Grupo y Lugar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-ink2 mb-2">
                <Users size={14} /> Grupo
              </label>
              <select 
                required
                className="w-full p-3 rounded-xl border border-staff bg-white outline-none focus:border-accent"
                value={formData.grupo_id}
                onChange={(e) => setFormData({...formData, grupo_id: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-ink2 mb-2">
                <MapPin size={14} /> Lugar
              </label>
              <select 
                required
                className="w-full p-3 rounded-xl border border-staff bg-white outline-none focus:border-accent"
                value={formData.lugar_id}
                onChange={(e) => setFormData({...formData, lugar_id: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {lugares.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
              </select>
            </div>
          </div>

          {/* Fecha y Horas */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-ink2 mb-2">
                <Calendar size={14} /> Fecha
              </label>
              <input 
                required
                className="w-full p-3 rounded-xl border border-staff focus:border-accent outline-none bg-white"
                type="date" 
                onChange={(e) => setFormData({...formData, fecha_bolo: e.target.value})}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-xs font-mono uppercase text-ink2 mb-2">
                  <Clock size={14} /> Inicio
                </label>
                <input 
                  required
                  className="w-full p-3 rounded-xl border border-staff focus:border-accent outline-none bg-white"
                  type="time" 
                  onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 text-xs font-mono uppercase text-ink2 mb-2">
                  <Clock size={14} /> Fin
                </label>
                <input 
                  required
                  className="w-full p-3 rounded-xl border border-staff focus:border-accent outline-none bg-white"
                  type="time" 
                  onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Alerta de Colisión */}
          {colision && (
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl flex items-start gap-3 text-accent animate-pulse">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium leading-tight">
                Conflicto: Este grupo ya tiene un evento en este horario.
              </p>
            </div>
          )}

          {/* Botón de Acción */}
          <button 
            type="submit"
            disabled={colision}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg ${
              colision 
              ? 'bg-staff text-ink3 cursor-not-allowed' 
              : 'bg-accent text-white hover:bg-accent2 shadow-accent/20 active:scale-95'
            }`}
          >
            {colision ? 'Horario Ocupado' : 'Confirmar Evento'}
          </button>
        </form>
      </div>
    </div>
  );
}