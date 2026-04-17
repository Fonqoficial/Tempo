// Definimos la interfaz localmente para evitar errores de importación circular
interface EventoTime {
  fecha_bolo: string;
  hora_inicio: string;
  hora_fin: string;
}

export function hayColision(nuevoBolo: EventoTime, bolosExistentes: EventoTime[]): boolean {
  return bolosExistentes.some(existente => {
    // Solo comparar si son el mismo día
    if (nuevoBolo.fecha_bolo !== existente.fecha_bolo) return false;

    const inicioNuevo = nuevoBolo.hora_inicio;
    const finNuevo = nuevoBolo.hora_fin;
    const inicioExistente = existente.hora_inicio;
    const finExistente = existente.hora_fin;

    // Lógica matemática: (StartA < EndB) AND (EndA > StartB)
    return (inicioNuevo < finExistente) && (finNuevo > inicioExistente);
  });
}

// Mantén aquí también tus funciones de ayuda de Tailwind (si las usas)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}