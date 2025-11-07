import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CustomHeader } from '../../components';
import { useAuth } from '../../context/AuthContext';

export default function AdminPerfilScreen() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleEditProfile = () => {
        // Lógica para editar perfil
        console.log('Editar perfil');
    };

    // Renderizar acciones personalizadas para el header
    const renderRightActions = () => (
        <TouchableOpacity onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <CustomHeader 
                title="Mi Perfil" 
                backgroundColor="#FF9800" 
                rightActions={renderRightActions()}
            />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {user?.nombreCompleto?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.nameText}>{user?.nombreCompleto}</Text>
                    <Text style={styles.emailText}>{user?.email}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>ADMINISTRADOR</Text>
                    </View>
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

            <View style={styles.adminSection}>
                <Text style={styles.sectionTitle}>Información de Administrador</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Roles:</Text>
                        <View style={styles.rolesContainer}>
                            {user?.roles?.map((rol) => (
                                <View key={rol.id} style={styles.adminRoleBadge}>
                                    <Text style={styles.adminRoleText}>{rol.nombre}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Administrador desde:</Text>
                        <Text style={styles.infoValue}>
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Último acceso:</Text>
                        <Text style={styles.infoValue}>
                            {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Estadísticas Rápidas</Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>156</Text>
                        <Text style={styles.statLabel}>Usuarios Gestionados</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>89</Text>
                        <Text style={styles.statLabel}>Ventas Registradas</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Productos Agregados</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Categorías Creadas</Text>
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
                    <Text style={styles.actionIcon}>🛡️</Text>
                    <Text style={styles.actionText}>Configuración de Seguridad</Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>📊</Text>
                    <Text style={styles.actionText}>Ver Reportes Personales</Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>ℹ️</Text>
                    <Text style={styles.actionText}>Acerca del Sistema</Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.logoutSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flex: 1,
    },
    header: {
        backgroundColor: '#FF9800',
        padding: 30,
        paddingTop: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FF9800',
    },
    nameText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    emailText: {
        fontSize: 16,
        color: '#FFF3E0',
        marginBottom: 10,
    },
    roleBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    roleText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
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
        shadowOffset: { width: 0, height: 2 },
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
    adminSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    rolesContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
    },
    adminRoleBadge: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginLeft: 5,
    },
    adminRoleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    statsSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF9800',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
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
        shadowOffset: { width: 0, height: 2 },
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