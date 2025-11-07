import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const REMEMBER_ME_KEY = 'remember_me';
const SAVED_CREDENTIALS_KEY = 'saved_credentials';

export const StorageService = {
    // Token methods
    async saveToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving token:', error);
            throw error;
        }
    },

    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    async removeToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing token:', error);
            throw error;
        }
    },

    // User data methods
    async saveUserData(userData: any): Promise<void> {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    },

    async getUserData(): Promise<any | null> {
        try {
            const userData = await AsyncStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    async removeUserData(): Promise<void> {
        try {
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error('Error removing user data:', error);
            throw error;
        }
    },

    // Remember me preferences
    async setRememberMe(remember: boolean): Promise<void> {
        try {
            await AsyncStorage.setItem(REMEMBER_ME_KEY, remember.toString());
        } catch (error) {
            console.error('Error saving remember me preference:', error);
            throw error;
        }
    },

    async getRememberMe(): Promise<boolean> {
        try {
            const value = await AsyncStorage.getItem(REMEMBER_ME_KEY);
            return value === 'true';
        } catch (error) {
            console.error('Error getting remember me preference:', error);
            return false;
        }
    },

    // Saved credentials (only email for UX)
    async saveSavedCredentials(email: string): Promise<void> {
        try {
            const credentials = { email };
            await AsyncStorage.setItem(SAVED_CREDENTIALS_KEY, JSON.stringify(credentials));
        } catch (error) {
            console.error('Error saving credentials:', error);
            throw error;
        }
    },

    async getSavedCredentials(): Promise<{ email: string } | null> {
        try {
            const credentials = await AsyncStorage.getItem(SAVED_CREDENTIALS_KEY);
            return credentials ? JSON.parse(credentials) : null;
        } catch (error) {
            console.error('Error getting saved credentials:', error);
            return null;
        }
    },

    async clearSavedCredentials(): Promise<void> {
        try {
            await AsyncStorage.removeItem(SAVED_CREDENTIALS_KEY);
        } catch (error) {
            console.error('Error clearing saved credentials:', error);
            throw error;
        }
    },

    // Clear all auth data
    async clearAuthData(): Promise<void> {
        try {
            const rememberMe = await this.getRememberMe();

            if (rememberMe) {
                // Si "recordarme" está activado, solo limpiar token y user data, pero mantener credenciales
                await Promise.all([
                    AsyncStorage.removeItem(TOKEN_KEY),
                    AsyncStorage.removeItem(USER_KEY)
                ]);
            } else {
                // Si no hay "recordarme", limpiar todo
                await Promise.all([
                    AsyncStorage.removeItem(TOKEN_KEY),
                    AsyncStorage.removeItem(USER_KEY),
                    AsyncStorage.removeItem(REMEMBER_ME_KEY),
                    AsyncStorage.removeItem(SAVED_CREDENTIALS_KEY)
                ]);
            }
        } catch (error) {
            console.error('Error clearing auth data:', error);
            throw error;
        }
    },

    // Clear everything (for complete logout)
    async clearAllData(): Promise<void> {
        try {
            await Promise.all([
                AsyncStorage.removeItem(TOKEN_KEY),
                AsyncStorage.removeItem(USER_KEY),
                AsyncStorage.removeItem(REMEMBER_ME_KEY),
                AsyncStorage.removeItem(SAVED_CREDENTIALS_KEY)
            ]);
        } catch (error) {
            console.error('Error clearing all data:', error);
            throw error;
        }
    }
};