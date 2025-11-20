// src/services/cuentaService.ts

import { apiService } from './api';
import {
    CuentaResponse,
    CreateCuentaRequest,
    UpdateCuentaRequest,
    SuspenderCuentaRequest,
    ActualizarLimiteCreditoRequest,
    OperacionCuentaResponse,
    CuentasSaldoAltoResponse,
    PuedoComprarResponse,
    SaldoDisponibleResponse,
    BuscarPorLimiteCreditoRequest,
    BuscarPorFechaAperturaRequest,
    BuscarPorEstadoRequest,
    ListCuentasResponse,
} from '../types/cuenta';

class CuentaService {
    private basePath = '/cuentas'; // No repetir /api, ya lo maneja api.ts
    private api = apiService.getAxiosInstance();

    // ======================
    // CRUD BÁSICO
    // ======================

    async crearCuenta(data: CreateCuentaRequest): Promise<CuentaResponse> {
        const res = await this.api.post(`${this.basePath}`, data);
        return res.data;
    }

    async obtenerCuentaPorId(id: number): Promise<CuentaResponse> {
        const res = await this.api.get(`${this.basePath}/${id}`);
        return res.data;
    }

   


    async actualizarCuenta(id: number, data: UpdateCuentaRequest): Promise<CuentaResponse> {
        const res = await this.api.put(`${this.basePath}/${id}`, data);
        return res.data;
    }

    async eliminarCuenta(id: number): Promise<OperacionCuentaResponse> {
        const res = await this.api.delete(`${this.basePath}/${id}`);
        return res.data;
    }


    // OPERACIONES DE ESTADO


    async suspenderCuenta(id: number, data?: SuspenderCuentaRequest): Promise<OperacionCuentaResponse> {
        const res = await this.api.put(`${this.basePath}/${id}/suspender`, data);
        return res.data;
    }

    async cerrarCuenta(id: number): Promise<OperacionCuentaResponse> {
        const res = await this.api.put(`${this.basePath}/${id}/cerrar`);
        return res.data;
    }

    async activarCuenta(id: number): Promise<OperacionCuentaResponse> {
        const res = await this.api.put(`${this.basePath}/${id}/activar`);
        return res.data;
    }

    // ACTUALIZACIONES ESPECÍFICAS


    // src/services/cuentaService.ts
    async actualizarLimiteCredito(id: number, nuevoLimite: number): Promise<CuentaResponse> {
        try {
            const res = await this.api.put(
                `${this.basePath}/${id}/limite-credito`,
                null, // no se envía body
                {
                    params: { nuevoLimite }, // case-sensitive: 'nuevoLimite'
                }
            );
            return res.data;
        } catch (error: any) {
            console.error('Error actualizando límite de crédito:', error.response?.data || error.message);
            throw error;
        }
    }



    // CONSULTAS Y FILTROS


    async cuentasSaldoAlto(): Promise<CuentasSaldoAltoResponse> {
        const res = await this.api.get(`${this.basePath}/saldo-alto`);
        return res.data;
    }

    async puedoComprar(): Promise<PuedoComprarResponse> {
        const res = await this.api.get(`${this.basePath}/puedo-comprar`);
        return res.data;
    }

    async consultarMiSaldoDisponible(): Promise<SaldoDisponibleResponse> {
        const res = await this.api.get(`${this.basePath}/mi-saldo-disponible`);
        return res.data;
    }

    async verMiCuenta(): Promise<CuentaResponse> {
        const res = await this.api.get(`${this.basePath}/mi-cuenta`);
        return res.data;
    }

    async buscarPorLimiteCredito(params: BuscarPorLimiteCreditoRequest): Promise<ListCuentasResponse> {
        const res = await this.api.get(`${this.basePath}/limite-credito`, { params });
        return res.data;
    }

    async buscarPorFechaApertura(params: BuscarPorFechaAperturaRequest): Promise<ListCuentasResponse> {
        const res = await this.api.get(`${this.basePath}/fecha-apertura`, { params });
        return res.data;
    }

  async listarCuentas(): Promise<ListCuentasResponse> {
  const res = await this.api.get(`${this.basePath}`);

 
  const data = res.data;

  // Si viene como PageResponse
  if (data.content) {
    return {
      content: data.content,
      totalElements: data.totalElements ?? data.content.length,
      totalPages: data.totalPages ?? 1,
      number: data.number ?? 0,
      size: data.size ?? data.content.length,
    };
  }

  // Si el backend devuelve directamente un array
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
    };
  }

  // fallback seguro
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 0,
  };
}

async buscarPorEstado(params: BuscarPorEstadoRequest): Promise<ListCuentasResponse> {
  const res = await this.api.get(`${this.basePath}/estado/${params.estado}`);

  const data = res.data;

  if (data.content) {
    return {
      content: data.content,
      totalElements: data.totalElements ?? data.content.length,
      totalPages: data.totalPages ?? 1,
      number: data.number ?? 0,
      size: data.size ?? data.content.length,
    };
  }

  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
    };
  }

  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 0,
  };
}

}

export const cuentaService = new CuentaService();
