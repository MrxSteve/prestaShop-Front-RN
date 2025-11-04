import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEffect, useState } from 'react'
import { rolesService } from '../../services/rolServices';
import { CreateRolRequest, UpdateRolRequest } from '../../types/roles';
import { Ionicons } from '@expo/vector-icons';


type RolItem = {
    id: number | string;
    nombre: string;
    descripcion?: string;
};

interface RolesCrudScreenProps {
    onClose?: () => void;
}

export default function RolesCrudScreeen({ onClose }: RolesCrudScreenProps) {

    const [roles, setRoles] = useState<RolItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<RolItem | null>(null);
    const [nombre, setNombre] = useState('');

    const normalizeList = (data: any): RolItem[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        return data.roles ?? data.data ?? [];
    };

    const loadRoles = async () => {
        setLoading(true);
        try {
            const res: any = await rolesService.list();
            setRoles(normalizeList(res));
        } catch (err) {
            console.warn('Error cargando roles', err);
            Alert.alert('Error', 'No se pudieron cargar los roles.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setNombre('');
        setModalVisible(true);
    };

    const openEdit = (item: RolItem) => {
        setEditing(item);
        setNombre(item.nombre ?? '');
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            Alert.alert('Validación', 'El nombre es obligatorio.');
            return;
        }

        setLoading(true);
        try {
            if (editing) {
                const payload: UpdateRolRequest = {
                    nombre: nombre.trim(),

                } as any;
                await rolesService.update({ id: editing.id as any }, payload);
                Alert.alert('Éxito', 'Rol actualizado.');
            } else {
                const payload: CreateRolRequest = {
                    nombre: nombre.trim(),
                } as any;
                await rolesService.create(payload);
                Alert.alert('Éxito', 'Rol creado.');
            }
            setModalVisible(false);
            await loadRoles();
        } catch (err) {
            console.warn('Error guardando rol', err);
            Alert.alert('Error', 'No se pudo guardar el rol.');
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = (item: RolItem) => {
        Alert.alert('Confirmar', `¿Eliminar rol "${item.nombre}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    setLoading(true);
                    try {
                        await rolesService.remove({ id: item.id as any });
                        Alert.alert('Éxito', 'Rol eliminado.');
                        await loadRoles();
                    } catch (err) {
                        console.warn('Error eliminando rol', err);
                        Alert.alert('Error', 'No se pudo eliminar el rol.');
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    const renderItem = ({ item }: { item: RolItem }) => (
        <View style={styles.item}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.nombre}</Text>
                {item.descripcion ? <Text style={styles.itemSubtitle}>{item.descripcion}</Text> : null}
            </View>
            <View style={styles.itemActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => openEdit(item)}>
                    <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteBtn]} onPress={() => handleDelete(item)}>
                    <Text style={[styles.actionText, { color: '#fff' }]}>Borrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {onClose && (
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="arrow-back" size={24} color="#2196F3" />
                </TouchableOpacity>
            )}

            <View style={styles.toolbar}>
                <Text style={styles.title}>Gestión de Roles</Text>
                <TouchableOpacity style={styles.addButton} onPress={openCreate}>
                    <Text style={styles.addButtonText}>+ Nuevo</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 24 }} />
            ) : (
                <FlatList
                    data={roles}
                    keyExtractor={(i) => String((i as any).id ?? i.nombre)}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 12 }}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>No hay roles.</Text>}
                />
            )}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalWrap}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>{editing ? 'Editar Rol' : 'Nuevo Rol'}</Text>

                        <TextInput
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={setNombre}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                        

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
                                <Text style={styles.saveText}>{editing ? 'Actualizar' : 'Crear'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f5f5f5'
        },
        closeButton: {
            padding: 16,
            backgroundColor: '#fff',
        },
        toolbar: {
            flexDirection: 'row',
            padding: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            borderBottomColor: '#eee',
            borderBottomWidth: 1,
        },
        title: {
            fontSize: 18,
            fontWeight: '700'
        },
        addButton: {
            backgroundColor: '#2196F3',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 6
        },
        addButtonText: {
            color: '#fff',
            fontWeight: '700'
        },
        item: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            alignItems: 'center',
        },
        itemTitle: {
            fontSize: 16,
            fontWeight: '700'
        },
        itemSubtitle: {
            color: '#666',
            marginTop: 4
        },
        itemActions: {
            flexDirection: 'row',
            marginLeft: 12
        },
        actionButton: {
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 6,
            marginLeft: 8,
            borderWidth: 1,
            borderColor: '#2196F3'
        },
        deleteBtn: {
            backgroundColor: '#e53935',
            borderColor: '#e53935'
        },
        actionText: {
            color: '#2196F3',
            fontWeight: '700'
        },
        modalWrap: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
            padding: 20
        },
        modal: {
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: 16
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '700',
            marginBottom: 12
        },
        input: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 6,
            padding: 10,
            marginBottom: 12,
            backgroundColor: '#fff'
        },
        modalActions: {
            flexDirection: 'row',
            justifyContent: 'flex-end'
        },
        btn: {
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 6,
            marginLeft: 8
        },
        cancelBtn: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ddd'
        },
        saveBtn: {
            backgroundColor: '#2196F3'
        },
        cancelText: {
            color: '#333',
            fontWeight: '700'
        },
        saveText: {
            color: '#fff',
            fontWeight: '700'
        },
    });
