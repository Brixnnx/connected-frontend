import { Usuario } from './usuario.model';

export interface Mentor {
  idMentor?: number;
  usuario: Usuario;
  areasExperiencia: string;
  anosExperiencia: number;
  tarifaHora: number;
  disponible: boolean;
  rating?: number;
  reviews?: ResenaMentor[];
}

export interface SesionMentoria {
  idSesionMentoria?: number;
  mentor: Mentor;
  mentee: Usuario;
  fechaInicio: Date;
  fechaFin: Date;
  estado: EstadoSesion;
  tema: string;
  notas?: string;
}

export enum EstadoSesion {
  AGENDADA = 'AGENDADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}

export interface ResenaMentor {
  idResena?: number;
  mentor: Mentor;
  autor: Usuario;
  puntuacion: number;
  comentario: string;
  fechaResena: Date;
}

export interface SolicitarMentoriaRequest {
  idUsuario: number;
  idMentor: number;
  fechaInicio: string;
  canal: string;
  estado: string;
  notas: string;
}

export interface ResenaRequest {
  mentorId: number;
  autorId: number;
  puntuacion: number;
  comentario: string;
}

export interface AgregarHabilidadRequest {
  idHabilidad: number;
  desde: string; // Fecha en formato ISO
}
