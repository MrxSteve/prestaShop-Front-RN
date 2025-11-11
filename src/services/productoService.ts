import * as FileSystem from 'expo-file-system';
import { Page } from '../types/catalog';
import {
    EstadoProducto,
    ImagenLocal,
    ProductoImagenRequest,
    ProductoResponse,
    ProductoStats,
    UpdateProductoImagen,
} from '../types/producto';
import { apiService } from './api';

/**
 * Helpers
 */
function inferMimeFromUri(uri?: string): string {
  if (!uri) return 'image/jpeg';
  const u = uri.toLowerCase();
  if (u.endsWith('.png')) return 'image/png';
  if (u.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

function ensureFilename(img: ImagenLocal): string {
  if (img.name && img.name.includes('.')) return img.name;
  const mime = img.type || inferMimeFromUri(img.uri);
  const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
  return `image_${Date.now()}.${ext}`;
}

/**
 * Sube multipart con Expo FileSystem (muy estable en Android).
 * - NO fijes manualmente Content-Type.
 * - fieldName debe coincidir con el nombre que espera tu backend (aquí: 'imagen').
 */
async function uploadMultipart({
  fullUrl,
  method = 'POST',
  fieldName = 'imagen',
  image,
  extra = {},
  headers = {},
}: {
  fullUrl: string;
  method?: 'POST' | 'PUT';
  fieldName?: string;
  image: ImagenLocal;
  extra?: Record<string, any>;
  headers?: Record<string, string>;
}) {
  const name = ensureFilename(image);
  const mime = image.type || inferMimeFromUri(image.uri);

  // parámetros extra como strings
  const params = Object.fromEntries(
    Object.entries(extra).map(([k, v]) => [k, String(v ?? '')])
  );

  // Si FileSystem.uploadAsync está disponible, usarlo (recomendado en Android)
  if (FileSystem && typeof FileSystem.uploadAsync === 'function') {
    const res = await FileSystem.uploadAsync(fullUrl, image.uri, {
      httpMethod: method,
      uploadType: (FileSystem as any).FileSystemUploadType?.MULTIPART,
      fieldName,
      parameters: params,
      headers, // Authorization si aplica; NO poner Content-Type
      mimeType: mime,
    });

    if (res.status >= 400) {
      throw new Error(`Upload failed: ${res.status} ${res.body}`);
    }
    try {
      return JSON.parse(res.body);
    } catch {
      return res.body as any;
    }
  }

  // Fallback: usar fetch + FormData (funciona en Expo pero puede ser menos estable en Android para archivos grandes)
  const formData = new FormData();
  // En React Native / Expo se envía el archivo así:
  formData.append(fieldName, {
    uri: image.uri,
    name,
    type: mime,
  } as any);

  for (const [k, v] of Object.entries(params)) {
    formData.append(k, v);
  }

  // NO establecer Content-Type — fetch lo hará con el boundary apropiado
  const resp = await fetch(fullUrl, {
    method,
    body: formData as any,
    headers,
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Upload failed: ${resp.status} ${txt || 'Error desconocido'}`);
  }

  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch {
    return text as any;
  }
}

class ProductoService {
  // IMPORTANTE:
  // Si apiService.baseURL YA termina en /api => basePath sin /api aquí (correcto).
  private basePath = '/productos';

  private getBaseURL() {
    return apiService.getAxiosInstance().defaults.baseURL || '';
  }

  /**
   * LISTADOS / BÚSQUEDAS
   */
  async listarTodos(page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
      `${this.basePath}?page=${page}&size=${size}`
    );
    return res.data;
  }

  async obtenerPorId(id: number): Promise<ProductoResponse> {
    const res = await apiService.getAxiosInstance().get<ProductoResponse>(
      `${this.basePath}/${id}`
    );
    return res.data;
  }

  async buscarPorNombre(nombre: string, page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
      `${this.basePath}/nombre?nombre=${encodeURIComponent(nombre)}&page=${page}&size=${size}`
    );
    return res.data;
  }

  async obtenerPorEstado(estado: EstadoProducto, page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
      `${this.basePath}/estado/${estado}?page=${page}&size=${size}`
    );
    return res.data;
  }

  async obtenerPorCategoria(categoriaId: number, page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
      `${this.basePath}/categoria/${categoriaId}?page=${page}&size=${size}`
    );
    return res.data;
  }

  async buscarPorRangoPrecio(precioMin: number, precioMax: number, page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
      `${this.basePath}/precio?precioMin=${precioMin}&precioMax=${precioMax}&page=${page}&size=${size}`
    );
    return res.data;
  }

  async obtenerMasVendidos(page: number = 0, size: number = 10): Promise<Page<ProductoResponse>> {
    const res = await apiService.getAxiosInstance().get<Page<ProductoResponse>>(
      `${this.basePath}/mas-vendidos?page=${page}&size=${size}`
    );
    return res.data;
  }

  /**
   * CREAR SIN IMAGEN usando el endpoint multipart (enviando sólo campos)
   * Mantengo tu estrategia con fetch y FormData SIN archivo.
   */
  async crearSinImagen(producto: ProductoImagenRequest): Promise<ProductoResponse> {
    const axiosInstance = apiService.getAxiosInstance();
    const baseURL = this.getBaseURL();

    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion || '');
    formData.append('precioUnitario', producto.precioUnitario.toString());
    formData.append('categoriaId', producto.categoriaId.toString());
    formData.append('estado', producto.estado);

    const token = await import('../utils/storage').then((s) => s.StorageService.getToken());
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch(`${baseURL}${this.basePath}/imagen`, {
      method: 'POST',
      body: formData,
      headers, // ¡NO Content-Type!
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Error ${resp.status}: ${txt || 'Error desconocido'}`);
    }
    return (await resp.json()) as ProductoResponse;
  }

  /**
   * CREAR CON IMAGEN (estable y recomendado)
   * Usa FileSystem.uploadAsync para multipart con archivo.
   */
  async crearConImagen(producto: ProductoImagenRequest, imagen?: ImagenLocal): Promise<ProductoResponse> {
    const baseURL = this.getBaseURL();

    // Si no hay imagen, reutiliza la vía multipart sin archivo
    if (!imagen) return this.crearSinImagen(producto);

    const token = await import('../utils/storage').then((s) => s.StorageService.getToken());
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const fullUrl = `${baseURL}${this.basePath}/imagen`; // p.ej. https://.../api/productos/imagen

    const extra = {
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precioUnitario: producto.precioUnitario,
      categoriaId: producto.categoriaId,
      estado: producto.estado,
    };

    const out = await uploadMultipart({
      fullUrl,
      method: 'POST',
      fieldName: 'imagen', // <-- si tu backend espera @RequestParam("imagen")
      image: {
        uri: imagen.uri,
        type: imagen.type || inferMimeFromUri(imagen.uri),
        name: ensureFilename(imagen),
      },
      headers,
      extra,
    });

    return out as ProductoResponse;
  }

  /**
   * ACTUALIZAR CON IMAGEN (PUT multipart)
   * Si no hay imagen, hace PUT JSON normal; si hay imagen, usa uploadAsync.
   */
  async actualizarConImagen(id: number, producto: UpdateProductoImagen, imagen?: ImagenLocal): Promise<ProductoResponse> {
    const axios = apiService.getAxiosInstance();
    const baseURL = this.getBaseURL();

    // Sin imagen -> PUT JSON
    if (!imagen) {
      const res = await axios.put<ProductoResponse>(`${this.basePath}/${id}`, producto);
      return res.data;
    }

    const token = await import('../utils/storage').then((s) => s.StorageService.getToken());
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const fullUrl = `${baseURL}${this.basePath}/${id}/imagen`;
    const extra: Record<string, any> = {};

    if (producto.nombre !== undefined) extra.nombre = producto.nombre;
    if (producto.descripcion !== undefined) extra.descripcion = producto.descripcion ?? '';
    if (producto.precioUnitario !== undefined) extra.precioUnitario = producto.precioUnitario;
    if (producto.categoriaId !== undefined) extra.categoriaId = producto.categoriaId;
    if (producto.estado !== undefined) extra.estado = producto.estado;

    const out = await uploadMultipart({
      fullUrl,
      method: 'PUT',
      fieldName: 'imagen', // <-- ajusta si tu backend usa otro nombre
      image: {
        uri: imagen.uri,
        type: imagen.type || inferMimeFromUri(imagen.uri),
        name: ensureFilename(imagen),
      },
      headers,
      extra,
    });

    return out as ProductoResponse;
  }

  async eliminar(id: number): Promise<void> {
    await apiService.getAxiosInstance().delete(`${this.basePath}/${id}`);
  }

  /**
   * Diagnóstico rápido de conectividad
   */
  async probarConectividad(): Promise<{ success: boolean; message: string }> {
    try {
      const baseURL = this.getBaseURL();
      const r = await this.listarTodos(0, 1);
      return {
        success: true,
        message: `✅ Conectividad OK. Total productos: ${r.totalElements}. URL: ${baseURL}${this.basePath}`,
      };
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'No se pudo conectar al servidor';
      return { success: false, message: `❌ Error: ${msg} (Status: ${error?.response?.status || 'Network'})` };
    }
  }

  /**
   * Estadísticas simples (helper)
   */
  async obtenerEstadisticas(): Promise<ProductoStats> {
    try {
      const response = await this.listarTodos(0, 1000);
      const productos = response.content;
      const totalProductos = response.totalElements;

      const productosDisponibles = productos.filter((p) => p.estado === EstadoProducto.DISPONIBLE).length;
      const productosNoDisponibles = productos.filter((p) => p.estado === EstadoProducto.NO_DISPONIBLE).length;
      const productosDescontinuados = productos.filter((p) => p.estado === EstadoProducto.DESCONTINUADO).length;

      const sumaPrecios = productos.reduce((suma, p) => suma + p.precioUnitario, 0);
      const promedioPrecios = totalProductos > 0 ? sumaPrecios / totalProductos : 0;

      return {
        totalProductos,
        productosDisponibles,
        productosNoDisponibles,
        productosDescontinuados,
        promedioPrecios,
      };
    } catch {
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
