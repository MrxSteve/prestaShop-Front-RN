import ClienteMiCuentaScreen from '@/src/screens/cliente/ClienteMiCuentaScreen';
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
    onErrorContainer: "#8C0000",
};

const ConfiguracionScreen = () => (
    <View style={STYLES.container}>
        <CustomHeader title="Configuración" />
        <View style={STYLES.placeholder}>
            <Text style={STYLES.placeholderTitle}>Configuración</Text>
            <Text style={STYLES.placeholderSubtitle}>Panel de configuración del cliente</Text>
        </View>
    </View>
);

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
        <DrawerContentScrollView {...props} contentContainerStyle={STYLES.drawerScroll}>
            
            <View style={STYLES.drawerHeader}>
                <View style={STYLES.avatar}>
                    <Text style={STYLES.avatarText}>
                        {user?.nombreCompleto?.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <Text style={STYLES.userName}>{user?.nombreCompleto}</Text>
                <Text style={STYLES.userRole}>Cliente</Text>

                <View style={STYLES.balanceCard}>
                    <Ionicons name="wallet" size={20} color={COLOR.primary} />
                    <Text style={STYLES.balanceText}>Saldo: $0.00</Text>
                </View>
            </View>

            <View style={STYLES.drawerItemContainer}>
                <DrawerItemList {...props} />
            </View>

            <Text style={STYLES.sectionTitle}>Acciones rápidas</Text>

            <TouchableOpacity style={STYLES.cardAction}>
                <Ionicons name="card-outline" size={22} color={COLOR.primary} />
                <Text style={STYLES.cardActionText}>Realizar Abono</Text>
            </TouchableOpacity>

            <TouchableOpacity style={STYLES.cardAction}>
                <Ionicons name="receipt-outline" size={22} color={COLOR.primary} />
                <Text style={STYLES.cardActionText}>Ver Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity style={STYLES.cardAction}>
                <Ionicons name="help-circle-outline" size={22} color={COLOR.primary} />
                <Text style={STYLES.cardActionText}>Ayuda y Soporte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={STYLES.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color={COLOR.error} />
                <Text style={STYLES.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <Text style={STYLES.version}>ShopMoney v1.0.0</Text>
        </DrawerContentScrollView>
    );
}

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
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
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

    userRole: {
        color: "#FFFFFFDD",
        fontSize: 13,
        marginBottom: 10,
    },

    balanceCard: {
        marginTop: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        backgroundColor: COLOR.surface,
        borderRadius: 14,
        
    },

    balanceText: {
        fontSize: 15,
        fontWeight: "700",
        color: COLOR.primary,
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
        marginTop: 15,
        marginBottom: 5,
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: "700",
        color: COLOR.onSurfaceVariant,
    },

    cardAction: {
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