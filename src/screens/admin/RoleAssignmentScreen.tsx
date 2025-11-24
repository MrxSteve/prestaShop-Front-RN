// src/screens/admin/RoleAssignmentScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { rolesService } from '@/src/services/rolServices';
import { usuarioService } from '@/src/services/usuarioServices';
import { RolResponse } from '@/src/types/roles';
import { UsuarioResponse } from '@/src/types/usuario';
import { useNavigation } from '@react-navigation/native';

export default function RoleAssignmentScreen() {
    const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
    const [roles, setRoles] = useState<RolResponse[]>([]);
    const [userRoles, setUserRoles] = useState<RolResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<UsuarioResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation<any>();

    useEffect(() => {
        loadUsuarios();
        loadRoles();
    }, []);

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const res = await usuarioService.listar(0, 50);
            setUsuarios(res.content);
        } catch (e) {
            Alert.alert('Error', 'No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const data = await rolesService.listarTodosSinPaginacion();
            setRoles(data || []);
        } catch (e) {
            console.warn('Error cargando roles', e);
        }
    };

    const loadUserRoles = async (u: UsuarioResponse) => {
        try {
            // 🔹 Usamos el endpoint obtenerPorId para traer el usuario completo
            const user = await usuarioService.obtenerPorId(u.id);

            // 🔹 Si el backend devuelve "roles" dentro del usuario:
            if (Array.isArray(user.roles)) {
                setUserRoles(user.roles);
            } else {
                setUserRoles([]);
            }
        } catch (e) {
            console.warn('Error obteniendo roles del usuario', e);
            setUserRoles([]);
        }
    };

    const handleSelectUser = async (u: UsuarioResponse) => {
        setSelectedUser(u);
        await loadUserRoles(u);
    };

    const handleAssignRole = async (rolId: number) => {
        if (!selectedUser) return;
        try {
            await usuarioService.asignarRol(selectedUser.id, rolId);
            await loadUserRoles(selectedUser);
            setModalVisible(false);
            Alert.alert('Éxito', 'Rol asignado correctamente');
        } catch (e) {
            Alert.alert('Error', 'No se pudo asignar el rol (posiblemente ya está asignado)');
        }
    };

    const handleRemoveRole = async (rolId: number) => {
        if (!selectedUser) return;
        if (userRoles.length <= 1) {
            Alert.alert('Aviso', 'No se puede eliminar el único rol del usuario');
            return;
        }
        try {
            await usuarioService.removerRol(selectedUser.id, rolId);
            await loadUserRoles(selectedUser);
            Alert.alert('Éxito', 'Rol eliminado correctamente');
        } catch (e) {
            Alert.alert('Error', 'No se pudo eliminar el rol');
        }
    };

    const availableRoles = roles.filter(
        (r) => !userRoles.some((ur) => ur.id === r.id)
    );

    return (
        <View style={styles.container}>
            {!selectedUser ? (
                <>
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={22} color="#2196F3" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Asignación de Roles</Text>
                    </View>

                    <Text style={styles.subtitle}>Selecciona un usuario</Text>

                    {loading ? (
                        <ActivityIndicator color="#2196F3" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={usuarios}
                            keyExtractor={(i) => String(i.id)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.userCard}
                                    onPress={() => handleSelectUser(item)}
                                >
                                    <Ionicons name="person-circle-outline" size={40} color="#1976D2" />
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text style={styles.userName}>{item.nombreCompleto}</Text>
                                        <Text style={styles.userEmail}>{item.email}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#999" />
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => {
                            setSelectedUser(null);
                            setUserRoles([]);
                        }}
                    >
                        <Ionicons name="arrow-back" size={18} color="#2196F3" />
                        <Text style={styles.backText}>Volver a usuarios</Text>
                    </TouchableOpacity>

                    <Text style={styles.subtitle}>
                        Roles asignados a: <Text style={styles.userHighlight}>{selectedUser.nombreCompleto}</Text>
                    </Text>

                    {userRoles.length === 0 ? (
                        <Text style={styles.noRoles}>Este usuario no tiene roles asignados.</Text>
                    ) : (
                        <FlatList
                            data={userRoles}
                            keyExtractor={(i) => String(i.id)}
                            renderItem={({ item }) => (
                                <View style={styles.roleCard}>
                                    <Text style={styles.roleName}>{item.nombre}</Text>
                                    <TouchableOpacity
                                        disabled={userRoles.length <= 1}
                                        style={[
                                            styles.iconBtn,
                                            {
                                                backgroundColor:
                                                    userRoles.length <= 1 ? '#f0f0f0' : '#FFEBEE',
                                            },
                                        ]}
                                        onPress={() => handleRemoveRole(item.id)}
                                    >
                                        <Ionicons
                                            name="trash"
                                            size={20}
                                            color={userRoles.length <= 1 ? '#bbb' : '#E53935'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}

                    {/* Botón para abrir modal */}
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add-circle-outline" size={22} color="#fff" />
                        <Text style={styles.addText}>Asignar nuevo rol</Text>
                    </TouchableOpacity>

                    {/* Modal para seleccionar nuevo rol */}
                    <Modal
                        visible={modalVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalBackdrop}>
                            <View style={styles.modalBox}>
                                <Text style={styles.modalTitle}>Seleccionar rol</Text>
                                {availableRoles.length === 0 ? (
                                    <Text style={styles.noRoles}>No hay roles disponibles</Text>
                                ) : (
                                    <FlatList
                                        data={availableRoles}
                                        keyExtractor={(i) => String(i.id)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.modalItem}
                                                onPress={() => handleAssignRole(item.id)}
                                            >
                                                <Text style={styles.roleName}>{item.nombre}</Text>
                                                <Ionicons name="add" size={20} color="#4CAF50" />
                                            </TouchableOpacity>
                                        )}
                                    />
                                )}
                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', paddingHorizontal: 14, paddingTop: 45 },
    topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    title: { fontSize: 18, fontWeight: '700', color: '#333', marginLeft: 8 },
    subtitle: { fontSize: 15, fontWeight: '600', marginVertical: 10, color: '#444' },
    userHighlight: { color: '#1976D2', fontWeight: '700' },
    noRoles: { fontSize: 14, color: '#777', marginTop: 10 },

    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    userName: { fontSize: 15, fontWeight: '700', color: '#333' },
    userEmail: { fontSize: 13, color: '#777' },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    backText: { color: '#2196F3', marginLeft: 4, fontWeight: '600' },

    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    roleName: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
    iconBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 12,
    },
    addText: { color: '#fff', fontWeight: '700', marginLeft: 6 },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '85%',
        maxHeight: '70%',
    },
    modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    cancelBtn: {
        marginTop: 12,
        alignSelf: 'center',
    },
    cancelText: { color: '#E53935', fontWeight: '700' },
});
