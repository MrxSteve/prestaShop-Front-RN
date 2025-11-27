import ClienteMiCuentaScreen from '@/src/screens/cliente/ClienteMiCuentaScreen';
import ClientePerfilScreen from '@/src/screens/cliente/ClientePerfilScreen'; // 👈 IMPORTANTE
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomHeader } from '../components';
import { useAuth } from '../context/AuthContext';
import { ClienteDrawerParamList } from '../types/navigation';
import ClienteStackNavigator from './ClienteStackNavigator';

const Drawer = createDrawerNavigator<ClienteDrawerParamList>();


const COLOR = {
    primary: "#4C8BFF",
    primaryContainer: "#DEE7FF",
    onPrimaryContainer: "#0D1D40",

    background: "#F5F7FF",
    surface: "#FFFFFF",
    surfaceVariant: "#ECEFFA",
    onSurface: "#1A1C1E",
    onSurfaceVariant: "#474A50",

    secondary: "#FFAA33",

    error: "#FF4D4F",
    errorContainer: "#FFE8E8",
};

// ===== PANTALLA DE CONFIGURACIÓN =====
const ConfiguracionScreen = () => (
    <View style={STYLES.container}>
        <CustomHeader title="Configuración" />
        <View style={STYLES.placeholder}>
            <Text style={STYLES.placeholderTitle}>Configuración</Text>
            <Text style={STYLES.placeholderSubtitle}>Panel de configuración del cliente</Text>
        </View>
    </View>
);

// ===== CONTENIDO PERSONALIZADO DEL DRAWER =====
function CustomDrawerContent(props: any) {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Qué tipo de cierre deseas realizar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar Sesión', onPress: async () => await logout(false) },
                { text: 'Cerrar y Olvidar', style: 'destructive', onPress: async () => await logout(true) },
            ]
        );
    };

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={STYLES.drawerScroll}
        >
            {/* ==== HEADER DEL DRAWER (TOCA PARA IR AL PERFIL) ==== */}
            <TouchableOpacity
                style={STYLES.drawerHeader}
                onPress={() => props.navigation.navigate("Perfil")}
                activeOpacity={0.9}
            >
                <View style={STYLES.avatar}>
                    <Text style={STYLES.avatarText}>
                        {user?.nombreCompleto?.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <Text style={STYLES.userName}>{user?.nombreCompleto}</Text>
            </TouchableOpacity>

            {/* ==== ITEMS DEL DRAWER ==== */}
            <View style={STYLES.drawerItemContainer}>
                <DrawerItemList {...props} />
            </View>

            {/* ==== SECCIÓN ACCIONES DE CUENTA ==== */}
            <Text style={STYLES.sectionTitle}>Acciones de Cuenta</Text>

            <TouchableOpacity style={STYLES.cardOption} onPress={() => props.navigation.navigate("Perfil")}>
                <Ionicons name="lock-closed-outline" size={22} color={COLOR.primary} />
                <Text style={STYLES.cardActionText}>Cambiar Contraseña</Text>
                <Ionicons name="chevron-forward" size={18} color={COLOR.onSurfaceVariant} style={{ marginLeft: "auto" }} />
            </TouchableOpacity>

            <TouchableOpacity style={STYLES.cardOption}>
                <Ionicons name="document-text-outline" size={22} color={COLOR.primary} />
                <Text style={STYLES.cardActionText}>Términos y Condiciones</Text>
                <Ionicons name="chevron-forward" size={18} color={COLOR.onSurfaceVariant} style={{ marginLeft: "auto" }} />
            </TouchableOpacity>

            <TouchableOpacity style={STYLES.cardOption}>
                <Ionicons name="shield-checkmark-outline" size={22} color={COLOR.primary} />
                <Text style={STYLES.cardActionText}>Política de Privacidad</Text>
                <Ionicons name="chevron-forward" size={18} color={COLOR.onSurfaceVariant} style={{ marginLeft: "auto" }} />
            </TouchableOpacity>

            <TouchableOpacity style={STYLES.cardOption}>
                <Ionicons name="information-circle-outline" size={22} color={COLOR.primary} />
                <Text style={STYLES.cardActionText}>Acerca de la App</Text>
                <Ionicons name="chevron-forward" size={18} color={COLOR.onSurfaceVariant} style={{ marginLeft: "auto" }} />
            </TouchableOpacity>

            {/* ==== BOTÓN LOGOUT ==== */}
            <TouchableOpacity style={STYLES.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color={COLOR.error} />
                <Text style={STYLES.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            {/* ==== VERSIÓN ==== */}
            <Text style={STYLES.version}>ShopMoney v1.0.0</Text>
        </DrawerContentScrollView>
    );
}

// ===== DRAWER PRINCIPAL =====
export default function ClienteDrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={CustomDrawerContent}
            screenOptions={{
                headerShown: false,
                drawerStyle: STYLES.drawerStyle,
                drawerActiveTintColor: COLOR.primary,
                drawerInactiveTintColor: COLOR.onSurfaceVariant,
                drawerLabelStyle: STYLES.drawerLabel,
                drawerActiveBackgroundColor: "#DEE7FF90",
            }}
        >
            <Drawer.Screen
                name="ClienteTabs"
                component={ClienteStackNavigator}
                options={{
                    title: 'Inicio',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="MiCuenta"
                component={ClienteMiCuentaScreen}
                options={{
                    title: 'Mi Cuenta',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* ===== PERFIL (OCULTO EN EL DRAWER PERO ACCESIBLE DESDE EL AVATAR) ===== */}
            <Drawer.Screen
                name="Perfil"
                component={ClientePerfilScreen}
                options={{
                    drawerItemStyle: { height: 0 }, // 👈 OCULTAR DEL DRAWER
                }}
            />

            <Drawer.Screen
                name="Configuracion"
                component={ConfiguracionScreen}
                options={{
                    title: 'Configuración',
                    drawerIcon: ({ color, size }) =>
                        <Ionicons name="settings-outline" size={size} color={color} />,
                }}
            />
        </Drawer.Navigator>
    );
}

// ===== ESTILOS =====
const STYLES = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.background,
    },

    drawerScroll: {
        paddingBottom: 20,
        backgroundColor: COLOR.surface,
    },

    drawerStyle: {
        width: 300,
        backgroundColor: COLOR.surface,
        borderTopRightRadius: 35,
        borderBottomRightRadius: 35,
        elevation: 20,
    },

    drawerHeader: {
        paddingVertical: 40,
        alignItems: "center",
        backgroundColor: COLOR.primary,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 10,
        elevation: 10,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: COLOR.primaryContainer,
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        fontSize: 38,
        fontWeight: "bold",
        color: COLOR.onPrimaryContainer,
    },

    userName: {
        marginTop: 12,
        fontSize: 20,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    drawerLabel: {
        fontSize: 15,
        marginLeft: -10,
        fontWeight: "600",
    },

    drawerItemContainer: {
        marginBottom: 10,
    },

    sectionTitle: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 8,
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: "700",
        color: COLOR.onSurfaceVariant,
    },

    cardOption: {
        marginHorizontal: 16,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        backgroundColor: COLOR.surfaceVariant,
    },

    cardActionText: {
        marginLeft: 12,
        fontSize: 15,
        fontWeight: "600",
        color: COLOR.onSurface,
    },

    logoutButton: {
        marginTop: 30,
        marginHorizontal: 16,
        padding: 14,
        borderRadius: 12,
        backgroundColor: COLOR.errorContainer,
        flexDirection: "row",
        alignItems: "center",
    },

    logoutText: {
        marginLeft: 12,
        fontSize: 15,
        fontWeight: "700",
        color: COLOR.error,
    },

    version: {
        textAlign: "center",
        marginTop: 25,
        fontSize: 12,
        color: COLOR.onSurfaceVariant,
    },

    placeholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    placeholderTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: COLOR.onSurface,
    },

    placeholderSubtitle: {
        fontSize: 14,
        color: COLOR.onSurfaceVariant,
        marginTop: 8,
    },
});
