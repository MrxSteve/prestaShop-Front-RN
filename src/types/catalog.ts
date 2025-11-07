export interface CategoriaRequest {
    nombre: string;
}

export interface CategoriaResponse {
    id: number;
    nombre: string;
}

export interface ProductoRequest {
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    categoriaId: number;
    imagenUrl?: string;
}

export interface ProductoResponse {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    categoria: CategoriaResponse;
    imagenUrl?: string;
    fechaCreacion: string;
    fechaModificacion: string;
}

// Para paginación
export interface Page<T> {
    content: T[];
    pageable: {
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    number: number;
    size: number;
    numberOfElements: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    empty: boolean;
}

// Para estadísticas del catálogo
export interface CatalogStats {
    totalProductos: number;
    totalCategorias: number;
    productosActivos: number;
    productosSinStock: number;
}