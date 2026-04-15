export interface Grupo {
  id: number;
  nombre: string;
  color_hex: string;
}

export interface Lugar {
  id: number;
  nombre: string;
  ciudad: string;
}

export interface Bolo {
  id: number;
  titulo: string;
  fecha_bolo: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  estado_confirmacion: string;
  grupo: Grupo;
  lugar: Lugar;
}