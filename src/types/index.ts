export interface Grupo {
  id: number;
  nombre: string;
  color_hex: string;
}

export interface Lugar {
  id: number;
  nombre: string;
  ciudad: string | null;
  direccion: string | null; // Añadido según tu SQL
}

export interface Partitura {
  id: number;
  titulo: string;
  compositor: string | null; // Cambiado de 'autor' a 'compositor'
}

export interface ItemRepertorio {
  id: number;
  repertorio_id: number;
  partitura_id: number;
  posicion: number; // Cambiado de 'orden' a 'posicion'
  partituras?: Partitura; // Para cuando hagas el join
}

export interface Repertorio {
  id: number;
  bolo_id: number;
  nombre: string;
  indice_orden: number;
}

export interface Bolo {
  id: number;
  titulo: string;
  fecha_bolo: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  estado_confirmacion: string;
  estado_pago: string; // Añadido según tu SQL
  full_dia: boolean;   // Añadido según tu SQL
  grupo?: Grupo;       // Opcional si haces join
  lugar?: Lugar;       // Opcional si haces join
  grupo_id: number;    // El ID real en la tabla
  lugar_id: number;    // El ID real en la tabla
}