export enum EstadoAbono {
    APLICADO = 'APLICADO',
    PENDIENTE = 'PENDIENTE',
    RECHAZADO = 'RECHAZADO'
}

export enum MetodoPago {
    EFECTIVO = 'EFECTIVO',
    TRANSFERENCIA = 'TRANSFERENCIA',
    CHEQUE = 'CHEQUE',
    OTRO = 'OTRO'
}

export interface AbonoRequest {
    cuentaClienteId: number;
    monto: number;
    metodoPago: MetodoPago;
    observaciones?: string;
    estado?: EstadoAbono;
}

export interface UpdateAbonoRequest {
    monto?: number;
    metodoPago?: MetodoPago;
    observaciones?: string;
    estado?: EstadoAbono;
}

export interface AbonoResponse {
    id: number;
    cuentaClienteId: number;
    monto: number;
    fechaAbono: string;
    metodoPago: MetodoPago;
    observaciones?: string;
    estado: EstadoAbono;
    createdAt: string;
    updatedAt: string;
}

export interface AbonoFiltros {
    estado?: EstadoAbono;
    metodoPago?: MetodoPago;
    fechaInicio?: string;
    fechaFin?: string;
    montoMin?: number;
    montoMax?: number;
    cuentaClienteId?: number;
    usuarioId?: number;
}

export interface AbonoStatsResponse {
    totalAbonos: number;
    montoTotal: number;
    promedioAbono: number;
    abonosPorEstado: {
        pendientes: number;
        aplicados: number;
        rechazados: number;
    };
    montosPorEstado: {
        pendientes: number;
        aplicados: number;
        rechazados: number;
    };
    abonosPorMetodo: {
        efectivo: number;
        transferencia: number;
        cheque: number;
        otro: number;
    };
    montosPorMetodo: {
        efectivo: number;
        transferencia: number;
        cheque: number;
        otro: number;
    };
}

export interface PaginatedAbonoResponse {
    content: AbonoResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}