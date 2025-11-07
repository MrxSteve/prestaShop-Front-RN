import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { AuthContextType, LoginRequest, UserRole, UsuarioResponse } from '../types/auth';
import { StorageService } from '../utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UsuarioResponse | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar si hay una sesión guardada al iniciar la app
    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            setIsLoading(true);
            const savedToken = await StorageService.getToken();
            const savedUser = await StorageService.getUserData();

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(savedUser);

                // Verificar si el token sigue siendo válido
                try {
                    const profile = await apiService.getProfile();
                    setUser(profile);
                    await StorageService.saveUserData(profile);
                } catch (error) {
                    // Token inválido, limpiar datos
                    await logout();
                }
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
            await logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            setIsLoading(true);

            // Realizar login
            const authResponse = await apiService.login(credentials);

            // Guardar token
            await StorageService.saveToken(authResponse.token);
            setToken(authResponse.token);

            // Manejar "recordarme"
            if (credentials.rememberMe) {
                await StorageService.setRememberMe(true);
                await StorageService.saveSavedCredentials(credentials.email);
            } else {
                await StorageService.setRememberMe(false);
                await StorageService.clearSavedCredentials();
            }

            // Obtener perfil del usuario
            const userProfile = await apiService.getProfile();
            await StorageService.saveUserData(userProfile);
            setUser(userProfile);

        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (forgetCredentials: boolean = false): Promise<void> => {
        try {
            setIsLoading(true);

            // Llamar al endpoint de logout si hay token
            if (token) {
                try {
                    await apiService.logout();
                } catch (error) {
                    // Ignorar errores del logout en el servidor
                    console.warn('Server logout failed:', error);
                }
            }

            // Limpiar datos locales
            if (forgetCredentials) {
                await StorageService.clearAllData();
            } else {
                await StorageService.clearAuthData();
            }
            setToken(null);
            setUser(null);

        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSavedCredentials = async (): Promise<{ email: string } | null> => {
        try {
            const rememberMe = await StorageService.getRememberMe();
            if (rememberMe) {
                return await StorageService.getSavedCredentials();
            }
            return null;
        } catch (error) {
            console.error('Error getting saved credentials:', error);
            return null;
        }
    };

    const getUserRole = (): 'ADMIN' | 'CLIENTE' | null => {
        if (!user || !user.roles || user.roles.length === 0) {
            return null;
        }

        // Buscar si tiene rol de ADMIN (prioridad)
        const hasAdminRole = user.roles.some(role => role.nombre === UserRole.ADMIN);
        if (hasAdminRole) {
            return UserRole.ADMIN;
        }

        // Si no es admin, verificar si es cliente
        const hasClienteRole = user.roles.some(role => role.nombre === UserRole.CLIENTE);
        if (hasClienteRole) {
            return UserRole.CLIENTE;
        }

        return null;
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        login,
        logout,
        getSavedCredentials,
        isAuthenticated: !!token && !!user,
        userRole: getUserRole(),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};