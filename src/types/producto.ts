// Enums
export enum EstadoProducto {
    DISPONIBLE = 'DISPONIBLE',
    NO_DISPONIBLE = 'NO_DISPONIBLE',
    DESCONTINUADO = 'DESCONTINUADO'
}

// Interfaces para requests
export interface ProductoImagenRequest {
    nombre: string;
    descripcion?: string;
    precioUnitario: number;
    estado: EstadoProducto;
    categoriaId: number;
}

export interface UpdateProductoImagen {
    nombre?: string;
    descripcion?: string;
    precioUnitario?: number;
    categoriaId?: number;
    estado?: EstadoProducto;
}

// Response types
export interface ProductoResponse {
    id: number;
    nombre: string;
    descripcion?: string;
    imagenUrl?: string;
    precioUnitario: number;
    estado: EstadoProducto;
    categoria: {
        id: number;
        nombre: string;
        descripcion?: string;
    };
}

// Filtros para búsqueda
export interface ProductoFiltros {
    nombre?: string;
    categoriaId?: number;
    estado?: EstadoProducto;
    precioMin?: number;
    precioMax?: number;
}

// Estadísticas de productos
export interface ProductoStats {
    totalProductos: number;
    productosDisponibles: number;
    productosNoDisponibles: number;
    productosDescontinuados: number;
    promedioPrecios: number;
}

// Imagen local para el form
export interface ImagenLocal {
    uri: string;
    type: string;
    name: string;
}