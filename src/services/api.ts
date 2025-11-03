import { API_BASE_URL } from '@env';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, LoginRequest, UsuarioResponse } from '../types/auth';
import { StorageService } from '../utils/storage';

class ApiService {
    private api: AxiosInstance;

    private baseURL = API_BASE_URL;

    constructor() {
        this.api = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor para agregar el token
        this.api.interceptors.request.use(
            async (config) => {
                const token = await StorageService.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor para manejar errores de autenticación
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    // Token expirado o inválido
                    await StorageService.clearAuthData();
                    // Aquí podrías redirigir al login
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await this.api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async getProfile(): Promise<UsuarioResponse> {
        try {
            const response: AxiosResponse<UsuarioResponse> = await this.api.get('/auth/perfil');
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    // Método para cambiar la base URL (útil para desarrollo/producción)
    setBaseURL(url: string): void {
        this.api.defaults.baseURL = url;
    }

    // Método para obtener la instancia de axios (para casos especiales)
    getAxiosInstance(): AxiosInstance {
        return this.api;
    }
}

export const apiService = new ApiService();