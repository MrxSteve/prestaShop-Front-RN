
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RolRequest, RolResponse } from '../types/roles';
import { apiService } from './api';
import { Page } from '../types/catalog';

class RolesService {
    private basePath = '/admin/roles';

    async crear(rol: RolRequest): Promise<RolResponse> {
        try {
            const response = await apiService.getAxiosInstance().post<RolResponse>(
                this.basePath,
                rol
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al crear rol:', error);
            throw error;
        }
    }

    async listarTodos(page: number = 0, size: number = 10): Promise<Page<RolResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<RolResponse>>(
                `${this.basePath}?page=${page}&size=${size}&sort=nombre,asc`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener roles:', error);
            throw error;
        }
    }

    async obtenerPorId(id: number): Promise<RolResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<RolResponse>(
                `${this.basePath}/${id}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener rol por ID:', error);
            throw error;
        }
    }

    async obtenerPorNombre(nombre: string): Promise<RolResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<RolResponse>(
                `${this.basePath}/nombre/${encodeURIComponent(nombre)}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener rol por nombre:', error);
            throw error;
        }
    }

    async actualizar(id: number, rol: RolRequest): Promise<RolResponse> {
        try {
            const response = await apiService.getAxiosInstance().put<RolResponse>(
                `${this.basePath}/${id}`,
                rol
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al actualizar rol:', error);
            throw error;
        }
    }

    async eliminar(id: number): Promise<void> {
        try {
            await apiService.getAxiosInstance().delete(`${this.basePath}/${id}`);
        } catch (error: any) {
            console.error('Error al eliminar rol:', error);
            throw error;
        }
    }

    // Método para listar todos los roles sin paginación
    async listarTodosSinPaginacion(): Promise<RolResponse[]> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<RolResponse>>(
                `${this.basePath}?size=1000&sort=nombre,asc`
            );
            return response.data.content;
        } catch (error: any) {
            console.error('Error al obtener todos los roles:', error);
            throw error;
        }
    }
}

export const rolesService = new RolesService();