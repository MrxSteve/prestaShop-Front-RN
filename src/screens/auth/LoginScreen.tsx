import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LoginRequest } from '../../types/auth';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
    const [credentials, setCredentials] = useState<LoginRequest>({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const { login, getSavedCredentials } = useAuth();

    useEffect(() => {
        loadSavedCredentials();
    }, []);

    const loadSavedCredentials = async () => {
        try {
            const saved = await getSavedCredentials();
            if (saved) {
                setCredentials(prev => ({
                    ...prev,
                    email: saved.email,
                    rememberMe: true,
                }));
            }
        } catch (e) {
            console.error('Error loading saved credentials:', e);
        }
    };

    const handleLogin = async () => {
        if (!credentials.email || !credentials.password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (!isValidEmail(credentials.email)) {
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return;
        }

        try {
            setLoading(true);
            await login(credentials);
        } catch (error: any) {
            let message = 'Error al iniciar sesión. Intenta nuevamente.';
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        message = 'Credenciales incorrectas.';
                        break;
                    case 400:
                        message = 'Datos inválidos.';
                        break;
                    case 500:
                        message = 'Error del servidor.';
                        break;
                }
            } else if (error.code === 'NETWORK_ERROR') {
                message = 'Sin conexión a internet.';
            }
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0284c7" translucent />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.innerContainer}>
                        {/* Logo y título */}
                        <View style={styles.logoContainer}>
                            <Ionicons name="diamond" size={70} color="#0284c7" />
                            <Text style={styles.appTitle}>ShopMoney</Text>
                            <Text style={styles.subtitle}>Gestión de Ventas Inteligente</Text>
                        </View>

                        {/* Formulario */}
                        <View style={styles.formContainer}>
                            <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
                            <Text style={styles.instructionText}>Inicia sesión en tu cuenta</Text>

                            {/* Campo de email */}
                            <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
                                <Ionicons
                                    name="mail"
                                    size={22}
                                    color={emailFocused ? "#0284c7" : "#6b7280"}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Correo electrónico"
                                    placeholderTextColor="#9ca3af"
                                    value={credentials.email}
                                    onChangeText={(text) =>
                                        setCredentials(prev => ({ ...prev, email: text }))
                                    }
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                            </View>

                            {/* Campo de contraseña */}
                            <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
                                <Ionicons
                                    name="lock-closed"
                                    size={22}
                                    color={passwordFocused ? "#0284c7" : "#6b7280"}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contraseña"
                                    placeholderTextColor="#9ca3af"
                                    value={credentials.password}
                                    onChangeText={(text) =>
                                        setCredentials(prev => ({ ...prev, password: text }))
                                    }
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#6b7280"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Recordarme */}
                            <TouchableOpacity
                                style={styles.rememberContainer}
                                onPress={() =>
                                    setCredentials(prev => ({ ...prev, rememberMe: !prev.rememberMe }))
                                }
                                disabled={loading}
                            >
                                <View style={[styles.checkbox, credentials.rememberMe && styles.checkboxChecked]}>
                                    {credentials.rememberMe && (
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    )}
                                </View>
                                <Text style={styles.rememberText}>Recordar mis datos</Text>
                            </TouchableOpacity>

                            {/* Botón de login */}
                            <TouchableOpacity
                                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="log-in" size={20} color="#fff" />
                                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            {/* Info */}
                            <View style={styles.infoContainer}>
                                <Ionicons name="people" size={14} color="#0284c7" />
                                <Text style={styles.infoText}>
                                    Usuarios son gestionados por el administrador.
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    keyboardView: { flex: 1 },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center', // <-- centra todo verticalmente
        alignItems: 'center', // <-- centra horizontalmente
        paddingHorizontal: 20,
    },
    innerContainer: {
        width: '100%',
        maxWidth: 400, // mantiene proporciones en pantallas grandes
    },
    logoContainer: { alignItems: 'center', marginBottom: 25 },
    appTitle: { fontSize: 32, fontWeight: '700', color: '#0284c7', marginTop: 10 },
    subtitle: { color: '#475569', fontSize: 15 },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5,
        alignItems: 'center', // centra los elementos internos
    },
    welcomeText: {
        color: '#0f172a',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 5,
    },
    instructionText: {
        color: '#475569',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        marginBottom: 15,
        paddingHorizontal: 10,
        height: 50,
        width: '100%',
    },
    inputFocused: {
        borderColor: '#0284c7',
        backgroundColor: '#f0f9ff',
    },
    inputIcon: { marginRight: 8 },
    input: { flex: 1, color: '#0f172a', fontSize: 16 },
    eyeButton: { padding: 5 },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#0284c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: '#0284c7',
    },
    rememberText: {
        color: '#334155',
        fontSize: 14,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0284c7',
        borderRadius: 10,
        height: 50,
        marginBottom: 20,
        gap: 8,
        width: '100%',
    },
    loginButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', 
        marginTop: 10,
    },
    infoText: {
        color: '#475569',
        marginLeft: 6,
        fontSize: 13,
        textAlign: 'center', 
    },
});
