import { Page } from '../types/catalog';
import {
    EstadoVenta,
    TipoVenta,
    VentaFiltros,
    VentaRequest,
    VentaResponse,
    VentaStats
} from '../types/venta';
import { apiService } from './api';

class VentaService {
    private basePath = '/ventas';

    /**
     * CRUD BÁSICO - Para AdminVentasScreen
     */

    /**
     * Crear nueva venta
     */
    async crear(ventaData: VentaRequest): Promise<VentaResponse> {
        try {
            const response = await apiService.getAxiosInstance().post<VentaResponse>(
                this.basePath,
                ventaData
            );
            return response.data;
        } catch (error: any) {
            console.error('Error creating venta:', error);
            throw error;
        }
    }

    /**
     * Listar todas las ventas con paginación
     */
    async listarTodas(page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas:', error);
            throw error;
        }
    }

    /**
     * Obtener venta por ID
     */
    async obtenerPorId(id: number): Promise<VentaResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<VentaResponse>(
                `${this.basePath}/${id}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching venta:', error);
            throw error;
        }
    }

    /**
     * Marcar venta como pagada
     */
    async marcarComoPagada(id: number): Promise<VentaResponse> {
        try {
            const response = await apiService.getAxiosInstance().put<VentaResponse>(
                `${this.basePath}/${id}/marcar-pagada`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error marking venta as pagada:', error);
            throw error;
        }
    }

    /**
     * Marcar venta como pago parcial
     */
    async marcarComoParcial(id: number): Promise<VentaResponse> {
        try {
            const response = await apiService.getAxiosInstance().put<VentaResponse>(
                `${this.basePath}/${id}/marcar-parcial`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error marking venta as parcial:', error);
            throw error;
        }
    }

    /**
     * Cancelar venta
     */
    async cancelar(id: number): Promise<VentaResponse> {
        try {
            const response = await apiService.getAxiosInstance().put<VentaResponse>(
                `${this.basePath}/${id}/cancelar`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error cancelling venta:', error);
            throw error;
        }
    }

    /**
     * FILTROS Y BÚSQUEDAS - Para AdminReportesScreen
     */

    /**
     * Buscar ventas por tipo (CREDITO/CONTADO)
     */
    async buscarPorTipo(tipoVenta: TipoVenta, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/tipo/${tipoVenta}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by tipo:', error);
            throw error;
        }
    }

    /**
     * Buscar ventas por estado
     */
    async buscarPorEstado(estado: EstadoVenta, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/estado/${estado}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by estado:', error);
            throw error;
        }
    }

    /**
     * Buscar ventas por rango de fecha
     */
    async buscarPorFecha(fechaInicio: string, fechaFin: string, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by fecha:', error);
            throw error;
        }
    }

    /**
     * Buscar ventas por rango de monto
     */
    async buscarPorRangoMonto(montoMin: number, montoMax: number, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/monto?montoMin=${montoMin}&montoMax=${montoMax}&page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by monto:', error);
            throw error;
        }
    }

    /**
     * Buscar ventas por cliente ocasional
     */
    async buscarPorClienteOcasional(nombre: string, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/cliente-ocasional?nombre=${encodeURIComponent(nombre)}&page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by cliente ocasional:', error);
            throw error;
        }
    }

    /**
     * Ventas por cliente
     */
    async ventasPorCliente(clienteId: number, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/cliente/${clienteId}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by cliente:', error);
            throw error;
        }
    }

    /**
     * Ventas por cuenta de cliente
     */
    async ventasPorCuentaCliente(cuentaClienteId: number, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/cuenta-cliente/${cuentaClienteId}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by cuenta cliente:', error);
            throw error;
        }
    }

    /**
     * Ventas por cuenta de cliente y estado
     */
    async ventasPorCuentaClienteYEstado(cuentaClienteId: number, estado: EstadoVenta, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/cuenta-cliente/${cuentaClienteId}/estado/${estado}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by cuenta cliente and estado:', error);
            throw error;
        }
    }

    /**
     * Ventas por cuenta de cliente y fecha
     */
    async ventasPorCuentaClienteYFecha(cuentaClienteId: number, fechaInicio: string, fechaFin: string, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<VentaResponse>>(
                `${this.basePath}/cuenta-cliente/${cuentaClienteId}/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ventas by cuenta cliente and fecha:', error);
            throw error;
        }
    }

    /**
     * MÉTODOS DE UTILIDAD
     */

    /**
     * Buscar con filtros múltiples (helper para UI)
     */
    async buscarConFiltros(filtros: VentaFiltros, page: number = 0, size: number = 10): Promise<Page<VentaResponse>> {
        try {
            // Si tiene filtros específicos, usar los endpoints correspondientes
            if (filtros.tipoVenta && !filtros.estado && !filtros.fechaInicio) {
                return this.buscarPorTipo(filtros.tipoVenta, page, size);
            }
            
            if (filtros.estado && !filtros.tipoVenta && !filtros.fechaInicio) {
                return this.buscarPorEstado(filtros.estado, page, size);
            }

            if (filtros.fechaInicio && filtros.fechaFin) {
                return this.buscarPorFecha(filtros.fechaInicio, filtros.fechaFin, page, size);
            }

            if (filtros.montoMin !== undefined && filtros.montoMax !== undefined) {
                return this.buscarPorRangoMonto(filtros.montoMin, filtros.montoMax, page, size);
            }

            if (filtros.clienteOcasional) {
                return this.buscarPorClienteOcasional(filtros.clienteOcasional, page, size);
            }

            if (filtros.clienteId) {
                return this.ventasPorCliente(filtros.clienteId, page, size);
            }

            if (filtros.cuentaClienteId) {
                return this.ventasPorCuentaCliente(filtros.cuentaClienteId, page, size);
            }

            // Si no hay filtros específicos, listar todas
            return this.listarTodas(page, size);
        } catch (error: any) {
            console.error('Error searching ventas with filters:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de ventas (helper)
     */
    async obtenerEstadisticas(): Promise<VentaStats> {
        try {
            // Obtener todas las ventas para calcular estadísticas
            const response = await this.listarTodas(0, 1000);
            const ventas = response.content;
            const totalVentas = response.totalElements;

            const ventasCredito = ventas.filter(v => v.tipoVenta === TipoVenta.CREDITO).length;
            const ventasContado = ventas.filter(v => v.tipoVenta === TipoVenta.CONTADO).length;
            
            const ventasPendientes = ventas.filter(v => v.estado === EstadoVenta.PENDIENTE).length;
            const ventasPagadas = ventas.filter(v => v.estado === EstadoVenta.PAGADA).length;
            const ventasParciales = ventas.filter(v => v.estado === EstadoVenta.PARCIAL).length;
            const ventasCanceladas = ventas.filter(v => v.estado === EstadoVenta.CANCELADA).length;

            const montoTotalVentas = ventas.reduce((suma, v) => suma + v.total, 0);
            const montoPromedioVentas = totalVentas > 0 ? montoTotalVentas / totalVentas : 0;

            return {
                totalVentas,
                ventasCredito,
                ventasContado,
                ventasPendientes,
                ventasPagadas,
                ventasParciales,
                ventasCanceladas,
                montoTotalVentas,
                montoPromedioVentas
            };
        } catch (error: any) {
            console.error('Error getting venta stats:', error);
            throw error;
        }
    }

    /**
     * Diagnóstico de conectividad
     */
    async probarConectividad(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await this.listarTodas(0, 1);
            return {
                success: true,
                message: `✅ Conectividad OK. Total ventas: ${response.totalElements}`
            };
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'No se pudo conectar al servidor';
            return { 
                success: false, 
                message: `❌ Error: ${msg} (Status: ${error?.response?.status || 'Network'})` 
            };
        }
    }
}

export const ventaService = new VentaService();