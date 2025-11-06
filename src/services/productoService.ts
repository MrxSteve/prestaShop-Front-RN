import { Page } from '../types/catalog';
import {
    EstadoProducto,
    ImagenLocal,
    ProductoImagenRequest,
    ProductoResponse,
    ProductoStats,
    UpdateProductoImagen
} from '../types/producto';
import { apiService } from './api';

class ProductoService {
    private basePath = '/productos';
    
    /**
     * Listar todos los productos con paginación
     */
    async listarTodos(page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
                `${this.basePath}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching productos:', error);
            throw error;
        }
    }

    /**
     * Obtener producto por ID
     */
    async obtenerPorId(id: number): Promise<ProductoResponse> {
        try {
            const response = await apiService.getAxiosInstance().get<ProductoResponse>(
                `${this.basePath}/${id}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching producto:', error);
            throw error;
        }
    }

    /**
     * Buscar productos por nombre
     */
    async buscarPorNombre(nombre: string, page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
                `${this.basePath}/nombre?nombre=${encodeURIComponent(nombre)}&page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error searching productos:', error);
            throw error;
        }
    }

    /**
     * Obtener productos por estado
     */
    async obtenerPorEstado(estado: EstadoProducto, page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
                `${this.basePath}/estado/${estado}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching productos by estado:', error);
            throw error;
        }
    }

    /**
     * Obtener productos por categoría
     */
    async obtenerPorCategoria(categoriaId: number, page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
                `${this.basePath}/categoria/${categoriaId}?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching productos by categoria:', error);
            throw error;
        }
    }

    /**
     * Buscar productos por rango de precio
     */
    async buscarPorRangoPrecio(precioMin: number, precioMax: number, page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
                `${this.basePath}/precio?precioMin=${precioMin}&precioMax=${precioMax}&page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching productos by precio:', error);
            throw error;
        }
    }

    /**
     * Obtener productos más vendidos
     */
    async obtenerMasVendidos(page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
        try {
            const response = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
                `${this.basePath}/mas-vendidos?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching productos mas vendidos:', error);
            throw error;
        }
    }

    /**
     * Crear producto sin imagen usando el endpoint multipart
     * El backend solo tiene endpoint multipart, así que enviamos FormData sin imagen
     */
    async crearSinImagen(producto: ProductoImagenRequest): Promise<ProductoResponse> {
        try {
            console.log('📝 Creando producto sin imagen usando endpoint multipart...');
            
            const axiosInstance = apiService.getAxiosInstance();
            const baseURL = axiosInstance.defaults.baseURL;
            
            const formData = new FormData();
            formData.append('nombre', producto.nombre);
            formData.append('descripcion', producto.descripcion || '');
            formData.append('precioUnitario', producto.precioUnitario.toString());
            formData.append('categoriaId', producto.categoriaId.toString());
            formData.append('estado', producto.estado);
            // No agregamos imagen
            
            // Obtener token de autorización
            const token = await import('../utils/storage').then(s => s.StorageService.getToken());
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${baseURL}${this.basePath}/imagen`, {
                method: 'POST',
                body: formData,
                headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error creating producto without image:', error);
            throw error;
        }
    }

    /**
     * Crear producto con imagen
     */
    async crearConImagen(producto: ProductoImagenRequest, imagen?: ImagenLocal): Promise<ProductoResponse> {
        try {
            // Si no hay imagen, usar el endpoint simple
            if (!imagen) {
                console.log('Creando producto sin imagen...');
                return await this.crearSinImagen(producto);
            }

            console.log('Creando producto con imagen...');
            const axiosInstance = apiService.getAxiosInstance();
            const baseURL = axiosInstance.defaults.baseURL;
            
            const formData = new FormData();
            
            // Agregar campos del producto
            formData.append('nombre', producto.nombre);
            if (producto.descripcion) {
                formData.append('descripcion', producto.descripcion);
            }
            formData.append('precioUnitario', producto.precioUnitario.toString());
            formData.append('categoriaId', producto.categoriaId.toString());
            formData.append('estado', producto.estado);

            // Agregar imagen
            formData.append('imagen', {
                uri: imagen.uri,
                type: imagen.type,
                name: imagen.name,
            } as any);

            console.log('Enviando producto con imagen a:', `${baseURL}${this.basePath}/imagen`);
            console.log('Producto data:', {
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precioUnitario: producto.precioUnitario,
                categoriaId: producto.categoriaId,
                estado: producto.estado,
                imagen: {
                    name: imagen.name,
                    type: imagen.type,
                    uri: imagen.uri.substring(0, 50) + '...'
                }
            });

            // Obtener token de autorización
            const token = await import('../utils/storage').then(s => s.StorageService.getToken());
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${baseURL}${this.basePath}/imagen`, {
                method: 'POST',
                body: formData,
                headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                
                if (response.status === 409) {
                    throw new Error('Ya existe un producto con ese nombre');
                }
                if (response.status === 400) {
                    throw new Error('Datos del producto inválidos');
                }
                throw new Error(`Error ${response.status}: ${errorText || 'Error desconocido'}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating producto:', error);
            throw error;
        }
    }

    /**
     * Actualizar producto con imagen
     */
    async actualizarConImagen(id: number, producto: UpdateProductoImagen, imagen?: ImagenLocal): Promise<ProductoResponse> {
        try {
            const axiosInstance = apiService.getAxiosInstance();
            const baseURL = axiosInstance.defaults.baseURL;
            
            const formData = new FormData();
            
            // Agregar campos del producto (solo los que no son undefined)
            if (producto.nombre !== undefined) {
                formData.append('nombre', producto.nombre);
            }
            if (producto.descripcion !== undefined) {
                formData.append('descripcion', producto.descripcion);
            }
            if (producto.precioUnitario !== undefined) {
                formData.append('precioUnitario', producto.precioUnitario.toString());
            }
            if (producto.categoriaId !== undefined) {
                formData.append('categoriaId', producto.categoriaId.toString());
            }
            if (producto.estado !== undefined) {
                formData.append('estado', producto.estado);
            }

            // Agregar imagen si existe
            if (imagen) {
                formData.append('imagen', {
                    uri: imagen.uri,
                    type: imagen.type,
                    name: imagen.name,
                } as any);
            }

            // Obtener token de autorización
            const token = await import('../utils/storage').then(s => s.StorageService.getToken());
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${baseURL}${this.basePath}/${id}/imagen`, {
                method: 'PUT',
                body: formData,
                headers,
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Producto no encontrado');
                }
                if (response.status === 409) {
                    throw new Error('Ya existe un producto con ese nombre');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating producto:', error);
            throw error;
        }
    }

    /**
     * Eliminar producto
     */
    async eliminar(id: number): Promise<void> {
        try {
            const response = await apiService.getAxiosInstance().delete(
                `${this.basePath}/${id}`
            );
        } catch (error: any) {
            console.error('Error deleting producto:', error);
            throw error;
        }
    }

    /**
     * Probar conectividad con el servidor
     */
    async probarConectividad(): Promise<{ success: boolean; message: string }> {
        try {
            console.log('🔄 Probando conectividad con el servidor...');
            const axiosInstance = apiService.getAxiosInstance();
            console.log('Base URL:', axiosInstance.defaults.baseURL);
            console.log('Endpoint completo:', `${axiosInstance.defaults.baseURL}${this.basePath}`);
            
            const response = await this.listarTodos(0, 1);
            
            return {
                success: true,
                message: `✅ Conectividad exitosa. Total productos: ${response.totalElements}. URL: ${axiosInstance.defaults.baseURL}${this.basePath}`
            };
        } catch (error: any) {
            console.error('❌ Error de conectividad:', error);
            const errorMessage = error.response?.data?.message || error.message || 'No se pudo conectar al servidor';
            return {
                success: false,
                message: `❌ Error: ${errorMessage} (Status: ${error.response?.status || 'Network'})`
            };
        }
    }

    /**
     * Obtener estadísticas de productos (método helper)
     */
    async obtenerEstadisticas(): Promise<ProductoStats> {
        try {
            // Obtener todos los productos para calcular estadísticas
            const response = await this.listarTodos(0, 1000); // Límite alto para obtener todos
            
            const productos = response.content;
            const totalProductos = response.totalElements;
            
            const productosDisponibles = productos.filter(p => p.estado === EstadoProducto.DISPONIBLE).length;
            const productosNoDisponibles = productos.filter(p => p.estado === EstadoProducto.NO_DISPONIBLE).length;
            const productosDescontinuados = productos.filter(p => p.estado === EstadoProducto.DESCONTINUADO).length;
            
            const sumaPrecios = productos.reduce((suma, p) => suma + p.precioUnitario, 0);
            const promedioPrecios = totalProductos > 0 ? sumaPrecios / totalProductos : 0;

            return {
                totalProductos,
                productosDisponibles,
                productosNoDisponibles,
                productosDescontinuados,
                promedioPrecios,
            };
        } catch (error) {
            console.error('Error getting estadisticas:', error);
            // Retornar estadísticas vacías en caso de error
            return {
                totalProductos: 0,
                productosDisponibles: 0,
                productosNoDisponibles: 0,
                productosDescontinuados: 0,
                promedioPrecios: 0,
            };
        }
    }
}

export const productoService = new ProductoService();