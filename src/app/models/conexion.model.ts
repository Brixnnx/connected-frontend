import { Usuario } from './usuario.model';

export interface Conexion {
  idConexion?: number;
  solicitante: Usuario;
  receptor: Usuario;
  estado: EstadoConexion;
  fechaSolicitud: Date;
  fechaRespuesta?: Date;
}

export enum EstadoConexion {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA'
}

export interface ConexionRequest {
  solicitanteId: number;
  receptorId: number;
}
