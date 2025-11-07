import { CategoriaRequest, CategoriaResponse, Page } from '../types/catalog';
import { apiService } from './api';

class CategoryService {
    private basePath = '/categorias';

    async crear(categoria: CategoriaRequest): Promise<CategoriaResponse> {
        try {
            const response = await apiService.getAxiosInstance().post<CategoriaResponse>(
                this.basePath,
                categoria
            );
            return response.data;
        } catch (error: any) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    async listarTodas(page: number = 0, size: number = 10): Promise<Page<CategoriaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<CategoriaResponse>>(
                `${this.basePath}?page=${page}&size=${size}&sort=nombre,asc`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    async obtenerPorId(id: number): Promise<CategoriaResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<CategoriaResponse>(
                `${this.basePath}/${id}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching category by ID:', error);
            throw error;
        }
    }

    async obtenerPorNombre(nombre: string): Promise<CategoriaResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<CategoriaResponse>(
                `${this.basePath}/nombre/${encodeURIComponent(nombre)}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching category by name:', error);
            throw error;
        }
    }

    async actualizar(id: number, categoria: CategoriaRequest): Promise<CategoriaResponse> {
        try {
            const response = await apiService.getAxiosInstance().put<CategoriaResponse>(
                `${this.basePath}/${id}`,
                categoria
            );
            return response.data;
        } catch (error: any) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    async eliminar(id: number): Promise<void> {
        try {
            await apiService.getAxiosInstance().delete(`${this.basePath}/${id}`);
        } catch (error: any) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }

    // Método adicional para obtener todas las categorías sin paginación (para dropdowns)
    async listarTodasSinPaginacion(): Promise<CategoriaResponse[]> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<CategoriaResponse>>(
                `${this.basePath}?size=1000&sort=nombre,asc`
            );
            return response.data.content;
        } catch (error: any) {
            console.error('Error fetching all categories:', error);
            throw error;
        }
    }
}

export const categoryService = new CategoryService();