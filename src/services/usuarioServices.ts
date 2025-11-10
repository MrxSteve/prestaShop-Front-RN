// src/services/usuarioService.ts
import { apiService } from './api';
import { Page } from '../types/catalog';
import { RolResponse } from '../types/roles';
import {
  ActivarUsuarioRequest,
  AsignarRolAUsuarioRequest,
  CambiarEstadoUsuarioRequest,
  CreateUsuarioRequest,
  DesactivarUsuarioRequest,
  RemoverRolDeUsuarioRequest,
  SuspenderUsuarioRequest,
  UpdateUsuarioRequest,
  UsuarioEstado,
  UsuarioResponse,
} from '../types/usuario';

class UsuarioService {
  private basePath = '/admin/usuarios';

  async crear(data: CreateUsuarioRequest): Promise<UsuarioResponse> {
    const res = await apiService.getAxiosInstance().post<UsuarioResponse>(this.basePath, data);
    return res.data;
  }

  async listar(page = 0, size = 10): Promise<Page<UsuarioResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<UsuarioResponse>>(
      `${this.basePath}?page=${page}&size=${size}`
    );
    return res.data;
  }

  async obtenerPorId(id: number): Promise<UsuarioResponse> {
    const res = await apiService.getAxiosInstance().get<UsuarioResponse>(`${this.basePath}/${id}`);
    return res.data;
  }

  async buscarPorNombre(nombre: string, page = 0, size = 10): Promise<Page<UsuarioResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<UsuarioResponse>>(
      `${this.basePath}/nombre?nombre=${encodeURIComponent(nombre)}&page=${page}&size=${size}`
    );
    return res.data;
  }

  async buscarPorRol(nombreRol: string, page = 0, size = 10): Promise<Page<UsuarioResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<UsuarioResponse>>(
      `${this.basePath}/rol/${encodeURIComponent(nombreRol)}?page=${page}&size=${size}`
    );
    return res.data;
  }

  async buscarPorEstado(estado: UsuarioEstado, page = 0, size = 10): Promise<Page<UsuarioResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<UsuarioResponse>>(
      `${this.basePath}/estado/${estado}?page=${page}&size=${size}`
    );
    return res.data;
  }

  async buscarPorEmail(email: string): Promise<UsuarioResponse> {
    const res = await apiService.getAxiosInstance().get<UsuarioResponse>(
      `${this.basePath}/email/${encodeURIComponent(email)}`
    );
    return res.data;
  }

  async buscarPorDui(dui: string): Promise<UsuarioResponse> {
    const res = await apiService.getAxiosInstance().get<UsuarioResponse>(
      `${this.basePath}/dui/${encodeURIComponent(dui)}`
    );
    return res.data;
  }

  async listarSinCuenta(page = 0, size = 10): Promise<Page<UsuarioResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<UsuarioResponse>>(
      `${this.basePath}/sin-cuenta?page=${page}&size=${size}`
    );
    return res.data;
  }

  async listarConCuenta(page = 0, size = 10): Promise<Page<UsuarioResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<UsuarioResponse>>(
      `${this.basePath}/con-cuenta?page=${page}&size=${size}`
    );
    return res.data;
  }

 async actualizar(id: number, data: UpdateUsuarioRequest): Promise<UsuarioResponse> {
  console.log('PUT /admin/usuarios/' + id, data);
  const res = await apiService.getAxiosInstance().put<UsuarioResponse>(
    `${this.basePath}/${id}`,
    data
  );
  return res.data;
}

  async cambiarEstado(id: number, estado: UsuarioEstado): Promise<UsuarioResponse> {
  // importante: sin body, solo query
  const res = await apiService.getAxiosInstance().put<UsuarioResponse>(
    `/admin/usuarios/${id}/estado?estado=${estado}`
  );
  return res.data;
}



  async suspender(id: number, motivo?: string): Promise<UsuarioResponse> {
    const body: SuspenderUsuarioRequest = motivo ? { motivo } : {};
    const res = await apiService.getAxiosInstance().put<UsuarioResponse>(
      `${this.basePath}/${id}/suspender`,
      body
    );
    return res.data;
  }

 async activar(id: number): Promise<UsuarioResponse> {
  return this.cambiarEstado(id, 'ACTIVO');
}

async desactivar(id: number): Promise<UsuarioResponse> {
  return this.cambiarEstado(id, 'INACTIVO');
}

  async asignarRol(usuarioId: number, rolId: number): Promise<UsuarioResponse> {
    const body: AsignarRolAUsuarioRequest = {};
    const res = await apiService.getAxiosInstance().post<UsuarioResponse>(
      `${this.basePath}/${usuarioId}/roles/${rolId}`,
      body
    );
    return res.data;
  }

  async removerRol(usuarioId: number, rolId: number): Promise<UsuarioResponse> {
    const res = await apiService.getAxiosInstance().delete<UsuarioResponse>(
      `${this.basePath}/${usuarioId}/roles/${rolId}`
    );
    return res.data;
  }
   async obtenerRolesUsuario(usuarioId: number): Promise<RolResponse[]> {
    const res = await apiService.getAxiosInstance().get<RolResponse[]>(
      `${this.basePath}/${usuarioId}/roles`
    );
    return res.data;
  }

  async eliminar(id: number): Promise<void> {
    await apiService.getAxiosInstance().delete(`${this.basePath}/${id}`);
  }
}

export const usuarioService = new UsuarioService();
