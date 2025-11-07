import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ClientePerfilScreen() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {user?.nombreCompleto?.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.nameText}>{user?.nombreCompleto}</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Información Personal</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nombre Completo:</Text>
                        <Text style={styles.infoValue}>{user?.nombreCompleto}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{user?.email}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Teléfono:</Text>
                        <Text style={styles.infoValue}>{user?.telefono || 'No registrado'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>DUI:</Text>
                        <Text style={styles.infoValue}>{user?.dui || 'No registrado'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Dirección:</Text>
                        <Text style={styles.infoValue}>{user?.direccion || 'No registrada'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Fecha de Nacimiento:</Text>
                        <Text style={styles.infoValue}>
                            {user?.fechaNacimiento || 'No registrada'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Estado:</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: user?.estado === 'ACTIVO' ? '#4CAF50' : '#F44336' }
                        ]}>
                            <Text style={styles.statusText}>{user?.estado}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.accountSection}>
                <Text style={styles.sectionTitle}>Información de Cuenta</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ID de Cuenta:</Text>
                        <Text style={styles.infoValue}>
                            {user?.cuentaClienteId || 'No asignada'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Roles:</Text>
                        <View style={styles.rolesContainer}>
                            {user?.roles?.map((rol) => (
                                <View key={rol.id} style={styles.roleBadge}>
                                    <Text style={styles.roleText}>{rol.nombre}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Miembro desde:</Text>
                        <Text style={styles.infoValue}>
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Acciones de Cuenta</Text>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>🔒</Text>
                    <Text style={styles.actionText}>Cambiar Contraseña</Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>📄</Text>
                    <Text style={styles.actionText}>Términos y Condiciones</Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>🔐</Text>
                    <Text style={styles.actionText}>Política de Privacidad</Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>ℹ️</Text>
                    <Text style={styles.actionText}>Acerca de la App</Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.logoutSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#2196F3',
        padding: 30,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    emailText: {
        fontSize: 16,
        color: '#E3F2FD',
    },
    infoSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
        flex: 1,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    accountSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    rolesContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
    },
    roleBadge: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginLeft: 5,
    },
    roleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    actionsSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    actionButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    actionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    actionArrow: {
        fontSize: 20,
        color: '#ccc',
    },
    logoutSection: {
        padding: 20,
        paddingBottom: 40,
    },
    logoutButton: {
        backgroundColor: '#F44336',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});