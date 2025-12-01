export interface Usuario {
  idUsuario?: number;
  primerNombre: string;
  primerApellido: string;
  email: string;
  password?: string;
  pais: string;
  ciudad: string;
  fechaNacimiento: string;
  descripcion?: string;
  fotoPerfil?: string;
  roles?: Role[];
}

export interface Role {
  idRole: number;
  name: string;
  description?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
}

export interface RegisterRequest {
  primerNombre: string;
  primerApellido: string;
  email: string;
  password: string;
  pais: string;
  ciudad: string;
  fechaNacimiento: string;
  descripcion?: string;
}
