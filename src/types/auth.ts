export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthResponse {
    token: string;
    tokenType: string;
}

export interface RolResponse {
    id: number;
    nombre: string;
}

export interface UsuarioResponse {
    id: number;
    nombreCompleto: string;
    email: string;
    telefono: string;
    direccion: string;
    dui: string;
    fechaNacimiento: string;
    estado: string;
    createdAt: string;
    updatedAt: string;
    roles: RolResponse[];
    cuentaClienteId?: number;
}

export interface AuthContextType {
    user: UsuarioResponse | null;
    token: string | null;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: (forgetCredentials?: boolean) => Promise<void>;
    getSavedCredentials: () => Promise<{ email: string } | null>;
    isAuthenticated: boolean;
    userRole: 'ADMIN' | 'CLIENTE' | null;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    CLIENTE = 'CLIENTE'
}