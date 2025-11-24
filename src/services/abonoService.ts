import {
    AbonoRequest,
    AbonoResponse,
    AbonoStatsResponse,
    EstadoAbono,
    MetodoPago,
    PaginatedAbonoResponse,
    UpdateAbonoRequest
} from '../types/abono';
import { apiService } from './api';

class AbonoService {
    private basePath = '/abonos';

    /**
     * CRUD BÁSICO - Para AdminAbonosScreen
     */

    /**
     * Crear nuevo abono
     */
    async crear(abonoData: AbonoRequest): Promise<AbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().post<AbonoResponse>(
                this.basePath,
                abonoData
            );
            return response.data;
        } catch (error: any) {
            console.error('Error creating abono:', error);
            throw error;
        }
    }

    /**
     * Listar todos los abonos con paginación
     */
    async listarTodos(page: number = 0, size: number = 10): Promise<PaginatedAbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<PaginatedAbonoResponse>(
                `${this.basePath}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching abonos:', error);
            throw error;
        }
    }

    /**
     * Obtener abono por ID
     */
    async obtenerPorId(id: number): Promise<AbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<AbonoResponse>(
                `${this.basePath}/${id}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching abono:', error);
            throw error;
        }
    }

    /**
     * Actualizar abono
     */
    async actualizar(id: number, abonoData: UpdateAbonoRequest): Promise<AbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().put<AbonoResponse>(
                `${this.basePath}/${id}`,
                abonoData
            );
            return response.data;
        } catch (error: any) {
            console.error('Error updating abono:', error);
            throw error;
        }
    }

    /**
     * Eliminar abono
     */
    async eliminar(id: number): Promise<void> {
        try {
            await apiService.getAxiosInstance().delete(`${this.basePath}/${id}`);
        } catch (error: any) {
            console.error('Error deleting abono:', error);
            throw error;
        }
    }

    /**
     * GESTIÓN DE ESTADO - Para AdminAbonoDetalleScreen
     */

    /**
     * Aplicar abono
     */
    async aplicar(id: number): Promise<AbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().patch<AbonoResponse>(
                `${this.basePath}/${id}/aplicar`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error applying abono:', error);
            throw error;
        }
    }

    /**
     * Rechazar abono
     */
    async rechazar(id: number): Promise<AbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().patch<AbonoResponse>(
                `${this.basePath}/${id}/rechazar`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error rejecting abono:', error);
            throw error;
        }
    }

    /**
     * BÚSQUEDAS Y FILTROS - Para AbonoSearchView
     */

    /**
     * Buscar abonos por estado
     */
    async buscarPorEstado(estado: EstadoAbono, page: number = 0, size: number = 10): Promise<PaginatedAbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<PaginatedAbonoResponse>(
                `${this.basePath}/estado/${estado}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error searching abonos by estado:', error);
            throw error;
        }
    }

    /**
     * Buscar abonos por método de pago
     */
    async buscarPorMetodoPago(metodoPago: MetodoPago, page: number = 0, size: number = 10): Promise<PaginatedAbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<PaginatedAbonoResponse>(
                `${this.basePath}/metodo-pago/${metodoPago}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error searching abonos by método pago:', error);
            throw error;
        }
    }

    /**
     * Buscar abonos por fecha
     */
    async buscarPorFecha(fechaInicio: string, fechaFin: string, page: number = 0, size: number = 10): Promise<PaginatedAbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<PaginatedAbonoResponse>(
                `${this.basePath}/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error searching abonos by fecha:', error);
            throw error;
        }
    }

    /**
     * Buscar abonos por rango de monto
     */
    async buscarPorRangoMonto(montoMin: number, montoMax: number, page: number = 0, size: number = 10): Promise<PaginatedAbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<PaginatedAbonoResponse>(
                `${this.basePath}/monto?min=${montoMin}&max=${montoMax}&page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error searching abonos by monto:', error);
            throw error;
        }
    }

    /**
     * Abonos por cuenta de cliente
     */
    async abonosPorCuentaCliente(cuentaClienteId: number, page: number = 0, size: number = 10): Promise<PaginatedAbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<PaginatedAbonoResponse>(
                `${this.basePath}/cuenta-cliente/${cuentaClienteId}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching abonos by cuenta cliente:', error);
            throw error;
        }
    }

    /**
     * Abonos por cuenta de cliente y estado
     */
    async abonosPorCuentaClienteYEstado(cuentaClienteId: number, estado: EstadoAbono, page: number = 0, size: number = 10): Promise<PaginatedAbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<PaginatedAbonoResponse>(
                `${this.basePath}/cuenta-cliente/${cuentaClienteId}/estado/${estado}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching abonos by cuenta cliente and estado:', error);
            throw error;
        }
    }

    /**
     * ESTADÍSTICAS - Para AbonoReportsSection
     */

    /**
     * Obtener estadísticas de abonos
     */
    async obtenerEstadisticas(): Promise<AbonoStatsResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<AbonoStatsResponse>(
                `${this.basePath}/estadisticas`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching abono stats:', error);
            throw error;
        }
    }

    async verMisAbonos(page: number = 0, size: number = 10): Promise<PaginatedAbonoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get(
                `/abonos/mis-abonos?page=${page}&size=${size}&sort=id`
            );
            return response.data;
        } catch (error: any) {
            console.error("❌ Error obteniendo mis abonos:", error);
            throw error;
        }
    }

    // abonoService.ts
    async verDetalleAbono(id: number): Promise<AbonoResponse> {
        try {
            const res = await apiService
                .getAxiosInstance()
                .get(`/abonos/mi-abono/${id}`);
            return res.data;
        } catch (e) {
            console.error("❌ Error obteniendo detalle del abono:", e);
            throw e;
        }
    }

    async verMisAbonosPendientes(page: number = 0, size: number = 10) {
    try {
        const response = await apiService
            .getAxiosInstance()
            .get(`/abonos/mis-abonos/pendientes?page=${page}&size=${size}&sort=id`);
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener abonos pendientes:", error);
        throw error;
    }
}

async verMisAbonosPorFecha(fechaInicio: string, fechaFin: string, page = 0, size = 20) {
    try {
        const response = await apiService
            .getAxiosInstance()
            .get(`/abonos/mis-abonos/fecha`, {
                params: {
                    fechaInicio,
                    fechaFin,
                    page,
                    size
                }
            });

        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener abonos por fecha:", error);
        throw error;
    }
}


async verMisAbonosPorEstado(
        estado: string,
        page: number = 0,
        size: number = 20
    ) {
        const res = await apiService
            .getAxiosInstance()
            .get(`/abonos/mis-abonos/estado/${estado}`, {
                params: { page, size },
            });

        return res.data;
    }




}

export const abonoService = new AbonoService();