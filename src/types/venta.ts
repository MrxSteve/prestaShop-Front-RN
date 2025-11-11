// Enums
export enum EstadoVenta {
    PENDIENTE = 'PENDIENTE',
    PAGADA = 'PAGADA', 
    PARCIAL = 'PARCIAL',
    CANCELADA = 'CANCELADA'
}

export enum TipoVenta {
    CREDITO = 'CREDITO',
    CONTADO = 'CONTADO'
}

// Request types
export interface VentaRequest {
    cuentaClienteId?: number;
    clienteOcasional?: string;
    tipoVenta: TipoVenta;
    estado?: EstadoVenta;
    observaciones?: string;
    detalleVentas: DetalleVentaRequest[];
}

export interface DetalleVentaRequest {
    productoId: number;
    cantidad: number;
}

// Response types
export interface VentaResponse {
    id: number;
    cuentaClienteId?: number;
    clienteOcasional?: string;
    fechaVenta: string; // ISO date string
    subtotal: number;
    total: number;
    tipoVenta: TipoVenta;
    estado: EstadoVenta;
    observaciones?: string;
    detalleVentas: DetalleVentaResponse[];
}

export interface DetalleVentaResponse {
    id: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    imagenUrl?: string; // URL de la imagen del producto
}

// Filtros para búsqueda y reportes
export interface VentaFiltros {
    tipoVenta?: TipoVenta;
    estado?: EstadoVenta;
    fechaInicio?: string; // ISO date string
    fechaFin?: string; // ISO date string
    montoMin?: number;
    montoMax?: number;
    clienteOcasional?: string;
    clienteId?: number;
    cuentaClienteId?: number;
}

// Estadísticas de ventas
export interface VentaStats {
    totalVentas: number;
    ventasCredito: number;
    ventasContado: number;
    ventasPendientes: number;
    ventasPagadas: number;
    ventasParciales: number;
    ventasCanceladas: number;
    montoTotalVentas: number;
    montoPromedioVentas: number;
}

// Para reportes de ventas por período
export interface VentaReporte {
    fecha: string;
    totalVentas: number;
    montoTotal: number;
    ventasCredito: number;
    ventasContado: number;
}

// Para clientes (referencia básica)
export interface ClienteBasico {
    id: number;
    nombre: string;
    email?: string;
    telefono?: string;
}

export interface CuentaClienteBasica {
    id: number;
    clienteId: number;
    nombreCliente: string;
    saldoDisponible: number;
    estado: string;
}