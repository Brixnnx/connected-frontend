import { Usuario } from './usuario.model';

export interface Mensaje {
  idMensaje?: number;
  emisor: Usuario;
  receptor: Usuario;
  contenido: string;
  fechaEnvio: Date;
  leido: boolean;
}

export interface MensajeRequest {
  emisorId: number;
  receptorId: number;
  contenido: string;
}

export interface Conversacion {
  contacto: Usuario;
  ultimoMensaje: Mensaje;
  noLeidos: number;
}
