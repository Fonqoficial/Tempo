import type { Bolo } from '../types';

/**
 * Aplica la fórmula: (StartA < EndB) && (EndA > StartB)
 * para detectar si un nuevo horario choca con uno existente.
 */
export function hayColision(
  nuevaFecha: string,
  nuevaHoraInicio: string,
  nuevaHoraFin: string,
  grupoId: string | number,
  bolosExistentes: any[]
): boolean {
  if (!nuevaFecha || !nuevaHoraInicio || !nuevaHoraFin || !grupoId) return false;

  return bolosExistentes.some((bolo) => {
    // Solo chocan si es la misma fecha Y el mismo grupo
    if (bolo.fecha_bolo !== nuevaFecha || bolo.grupo?.id !== Number(grupoId)) return false;

    const startA = nuevaHoraInicio;
    const endA = nuevaHoraFin;
    const startB = bolo.hora_inicio.slice(0, 5);
    const endB = bolo.hora_fin.slice(0, 5);

    return startA < endB && endA > startB;
  });
}