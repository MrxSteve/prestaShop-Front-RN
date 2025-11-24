// src/types/usuario.ts
export type UsuarioEstado = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

export interface RolResumen {
  id: number;
  nombre: string;
}

export interface CreateUsuarioRequest {
  nombreCompleto: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  dui: string;
  fechaNacimiento: string;
  estado: UsuarioEstado;
  rolesIds: number[];
}

export interface UpdateUsuarioRequest {
  nombreCompleto?: string;
  email?: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  dui?: string;
  fechaNacimiento?: string;
  estado?: UsuarioEstado;
  rolesIds?: number[];
}

// --- Response: Usuario ---

export interface UsuarioResponse {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  dui: string;
  fechaNacimiento: string;
  estado: UsuarioEstado;
  roles?: { id: number; nombre: string }[]; 
}

// --- Requests auxiliares para endpoints específicos ---

export interface CambiarEstadoUsuarioRequest {
  estado: UsuarioEstado;
}

export interface SuspenderUsuarioRequest {
  motivo?: string;
}

export interface ActivarUsuarioRequest {}

export interface DesactivarUsuarioRequest {
  motivo?: string;
}

export type AsignarRolAUsuarioRequest = Record<string, never>;
export type RemoverRolDeUsuarioRequest = Record<string, never>;

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
