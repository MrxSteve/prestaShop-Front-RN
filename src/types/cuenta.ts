// src/types/cuenta.ts

// Estado posible de la cuenta
export enum CuentaEstado {
  ACTIVA = "ACTIVA",
  SUSPENDIDA = "SUSPENDIDA",
  CERRADA = "CERRADA",
}

// Base con todos los campos comunes de una cuenta
export interface CuentaBase {
  usuarioId: number;
  limiteCredito: number;
  saldoActual: number;
  fechaApertura: string;
  estado: CuentaEstado;
}


// REQUESTS

// Crear una nueva cuenta
export interface CreateCuentaRequest {
  usuarioId: number;
  limiteCredito: number;
  saldoActual?: number; 
  fechaApertura?: string; 
  estado?: CuentaEstado; 
}

export interface UpdateCuentaRequest {
  limiteCredito?: number;
  saldoActual?: number;
  estado?: CuentaEstado;
  fechaApertura?: string; 
}


// Suspender cuenta
export interface SuspenderCuentaRequest {
  motivo?: string;
}

// Actualizar límite de crédito
export interface ActualizarLimiteCreditoRequest {
  limiteCredito: number;
}


// RESPONSES


// Respuesta base de cuenta
export interface CuentaResponse extends CuentaBase {
  id: number;
  nombreCliente?: string; 
}

// Lista de cuentas
export interface ListCuentasResponse {
  content: CuentaResponse[];  // ✅ antes decía 'cuentas'
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}


// Respuesta de operaciones simples (activar, cerrar, suspender, eliminar)
export interface OperacionCuentaResponse {
  mensaje: string;
  cuenta?: CuentaResponse;
}



// GET /api/cuentas/saldo-alto
export interface CuentasSaldoAltoResponse {
  cuentas: CuentaResponse[];
}

// GET /api/cuentas/puedo-comprar
export interface PuedoComprarResponse {
  disponible: boolean;
  saldoDisponible: number;
}

// GET /api/cuentas/mi-saldo-disponible
export interface SaldoDisponibleResponse {
  saldoDisponible: number;
}

// GET /api/cuentas/limite-credito
// src/types/cuenta.ts
export interface BuscarPorLimiteCreditoRequest {
  min: number;
  max: number;
  pageable?: {
    page: number;
    size: number;
    sort: string[];
  };
}


export interface BuscarPorFechaAperturaRequest {
  fechaInicio: string;
  fechaFin: string;
  pageable?: {
    page: number;
    size: number;
    sort: string[];
  };
}


// GET /api/cuentas/estado/{estado}
export interface BuscarPorEstadoRequest {
  estado: CuentaEstado;
}

