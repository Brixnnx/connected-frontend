import { Usuario } from './usuario.model';

export interface Puntuacion {
  idPuntuacion?: number;
  usuario: Usuario;
  puntos: number;
  descripcion: string;
  fechaObtencion: Date;
  puntosPublicaciones?: number;
  puntosConexiones?: number;
  puntosMentorias?: number;
  puntosComentarios?: number;
  totalPuntos?: number;
}

export interface Badge {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  requisito: number;
  obtenido: boolean;
}
