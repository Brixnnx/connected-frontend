import { Usuario } from './usuario.model';

export interface Publicacion {
  idPublicacion?: number;
  autor: Usuario;
  contenido: string;
  imagen?: string;
  fechaPublicacion: Date;
  comentarios?: Comentario[];
  reacciones?: Reaccion[];
}

export interface Comentario {
  idComentario?: number;
  idPublicacion: number;
  autor: Usuario;
  contenido: string;
  fechaComentario: Date;
}

export interface Reaccion {
  idReaccion?: number;
  idPublicacion: number;
  usuario: Usuario;
  tipo: string;
  fechaReaccion: Date;
}

export enum TipoReaccion {
  ME_GUSTA = 'ME_GUSTA'
}

export interface PublicacionRequest {
  autorId: number;
  contenido: string;
  imagen?: string;
}

export interface ComentarioRequest {
  autorId: number;
  contenido: string;
}

export interface ReaccionRequest {
  publicacionId: number;
  usuarioId: number;
  tipo: string;
}
