export interface Oportunidad {
  idOportunidad?: number;
  tipo: TipoOportunidad;
  titulo: string;
  descripcion: string;
  empresa: string;
  ubicacion: string;
  fechaInicio: Date;
  fechaPublicacion: Date;
  activo: boolean;
}

export enum TipoOportunidad {
  EMPLEO = 'EMPLEO',
  PASANTIA = 'PASANTIA',
  TALLER = 'TALLER',
  EVENTO = 'EVENTO'
}

export interface OportunidadRequest {
  tipo: TipoOportunidad;
  titulo: string;
  descripcion: string;
  empresa: string;
  fechaInicio: string;
  activo: boolean;
}
