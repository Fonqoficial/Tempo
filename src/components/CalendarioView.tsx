import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Bolo } from '../types';

interface Props {
  bolos: Bolo[];
  onSelectBolo: (bolo: Bolo) => void;
}

export default function CalendarioView({ bolos, onSelectBolo }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Lógica de fechas
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-staff overflow-hidden animate-in fade-in duration-500">
      {/* Header del Calendario */}
      <div className="p-6 flex justify-between items-center border-b border-staff bg-surface/30">
        <h3 className="font-serif text-xl text-ink capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white rounded-lg border border-staff transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white rounded-lg border border-staff transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b border-staff bg-surface/10">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="py-2 text-center text-[10px] font-mono uppercase text-ink3 tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const bolosDelDia = bolos.filter(b => isSameDay(new Date(b.fecha_bolo), day));
          
          return (
            <div 
              key={day.toString()} 
              className={`min-h-[100px] p-2 border-r border-b border-staff transition-all ${
                !isSameMonth(day, firstDayOfMonth) ? 'bg-surface/20' : 'bg-white'
              }`}
            >
              <span className={`text-xs font-mono ${
                isSameDay(day, new Date()) ? 'bg-accent text-white px-2 py-0.5 rounded-full' : 'text-ink3'
              }`}>
                {format(day, 'd')}
              </span>

              <div className="mt-2 space-y-1">
                {bolosDelDia.map(bolo => (
                  <button
                    key={bolo.id}
                    onClick={() => onSelectBolo(bolo)}
                    className="w-full text-left p-1 rounded text-[9px] font-bold uppercase truncate border-l-2 hover:brightness-90 transition-all shadow-sm"
                    style={{ 
                      backgroundColor: `${bolo.grupo?.color_hex}15`, 
                      borderLeftColor: bolo.grupo?.color_hex,
                      color: bolo.grupo?.color_hex 
                    }}
                  >
                    {bolo.titulo}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}