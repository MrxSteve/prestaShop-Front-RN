import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { abonoService } from '../../services/abonoService';
import { apiService } from '../../services/api';
import { AbonoRequest, MetodoPago } from '../../types/abono';
import { UsuarioResponse } from '../../types/auth';

interface AbonoFormProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AbonoForm: React.FC<AbonoFormProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    
    // Form state
    const [selectedUser, setSelectedUser] = useState<UsuarioResponse | null>(null);
    const [monto, setMonto] = useState('');
    const [metodoPago, setMetodoPago] = useState<MetodoPago>(MetodoPago.EFECTIVO);
    const [observaciones, setObservaciones] = useState('');

    // User selection state
    const [showUserSelection, setShowUserSelection] = useState(false);
    const [searchUsuario, setSearchUsuario] = useState('');

    const filteredUsuarios = usuarios.filter(user =>
        user.nombreCompleto?.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        user.dui?.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        user.cuentaClienteId?.toString().includes(searchUsuario)
    );

    useEffect(() => {
        if (visible) {
            loadUsuarios();
        }
    }, [visible]);

    const loadUsuarios = async () => {
        try {
            setLoadingUsuarios(true);
            // Obtener usuarios con cuenta usando el endpoint de usuarios
            const response = await apiService.getAxiosInstance().get('/admin/usuarios?page=0&size=100');
            // Filtrar usuarios que tengan cuentaClienteId
            const usuariosConCuenta = response.data.content.filter((user: UsuarioResponse) => user.cuentaClienteId);
            setUsuarios(usuariosConCuenta);
        } catch (error) {
            console.error('Error loading usuarios:', error);
            Alert.alert('Error', 'Error al cargar los usuarios');
        } finally {
            setLoadingUsuarios(false);
        }
    };

    const selectUser = (user: UsuarioResponse) => {
        setSelectedUser(user);
        setShowUserSelection(false);
        setSearchUsuario('');
    };

    const clearForm = () => {
        setSelectedUser(null);
        setMonto('');
        setMetodoPago(MetodoPago.EFECTIVO);
        setObservaciones('');
        setSearchUsuario('');
    };

    const validateForm = (): boolean => {
        if (!selectedUser?.cuentaClienteId) {
            Alert.alert('Error', 'Por favor selecciona un cliente');
            return false;
        }
        
        if (!monto.trim() || isNaN(parseFloat(monto)) || parseFloat(monto) <= 0) {
            Alert.alert('Error', 'Por favor ingresa un monto válido');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const abonoData: AbonoRequest = {
                cuentaClienteId: selectedUser!.cuentaClienteId!,
                monto: parseFloat(monto),
                metodoPago,
                observaciones: observaciones.trim() || undefined,
            };

            await abonoService.crear(abonoData);
            
            Alert.alert(
                'Éxito',
                'Abono registrado exitosamente',
                [{ text: 'OK', onPress: () => {
                    onSuccess();
                    clearForm();
                    onClose();
                }}]
            );

        } catch (error: any) {
            console.error('Error creating abono:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Error al registrar el abono'
            );
        } finally {
            setLoading(false);
        }
    };

    const renderUsuarioItem = ({ item }: { item: UsuarioResponse }) => (
        <TouchableOpacity
            style={styles.usuarioItem}
            onPress={() => selectUser(item)}
        >
            <View style={styles.usuarioIconContainer}>
                <Ionicons name="person-circle" size={32} color="#8E44AD" />
            </View>
            <View style={styles.usuarioInfo}>
                <Text style={styles.usuarioName}>{item.nombreCompleto}</Text>
                <Text style={styles.usuarioEmail}>{item.email}</Text>
                <Text style={styles.usuarioPhone}>{item.telefono}</Text>
                <Text style={styles.usuarioCuenta}>
                    Cuenta ID: {item.cuentaClienteId} • DUI: {item.dui}
                </Text>
            </View>
            <View style={styles.usuarioArrow}>
                <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            {/* Modal de selección de usuario */}
            <Modal
                visible={showUserSelection}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.userSelectionContainer}>
                    <View style={styles.userSelectionHeader}>
                        <Text style={styles.userSelectionTitle}>Seleccionar Cliente</Text>
                        <TouchableOpacity onPress={() => setShowUserSelection(false)}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar cliente..."
                            value={searchUsuario}
                            onChangeText={setSearchUsuario}
                        />
                    </View>

                    {loadingUsuarios ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#8E44AD" />
                            <Text style={styles.loadingText}>Cargando clientes...</Text>
                        </View>
                    ) : (
                        <FlatList
                            style={styles.userList}
                            data={filteredUsuarios}
                            keyExtractor={(item) => item.id!.toString()}
                            renderItem={renderUsuarioItem}
                        />
                    )}
                </View>
            </Modal>

            {/* Formulario principal */}
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Nuevo Abono</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Selección de Cliente */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Cliente</Text>
                            <View style={styles.inputGroup}>
                                <View style={styles.labelWithButton}>
                                    <Text style={styles.label}>Seleccionar Cliente</Text>
                                    <TouchableOpacity
                                        style={styles.selectUserButton}
                                        onPress={() => setShowUserSelection(true)}
                                    >
                                        <Ionicons name="person-add" size={16} color="#8E44AD" />
                                        <Text style={styles.selectUserText}>Buscar</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                {selectedUser ? (
                                    <View style={styles.selectedUserContainer}>
                                        <View style={styles.selectedUserInfo}>
                                            <Text style={styles.selectedUserName}>{selectedUser.nombreCompleto}</Text>
                                            <Text style={styles.selectedUserDetails}>
                                                {selectedUser.email} • {selectedUser.telefono} • Cuenta: {selectedUser.cuentaClienteId}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.clearSelectionButton}
                                            onPress={() => setSelectedUser(null)}
                                        >
                                            <Ionicons name="close-circle" size={20} color="#ff6b6b" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text style={styles.helperText}>
                                        Selecciona un cliente para continuar
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Método de Pago */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Método de Pago</Text>
                            <View style={styles.metodoPagoContainer}>
                                {['EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'OTRO'].map((metodo) => (
                                    <TouchableOpacity
                                        key={metodo}
                                        style={[
                                            styles.metodoPagoButton,
                                            metodoPago === metodo && styles.metodoPagoActive
                                        ]}
                                        onPress={() => setMetodoPago(metodo as MetodoPago)}
                                    >
                                        <Ionicons
                                            name={
                                                metodo === 'EFECTIVO' ? 'cash' :
                                                metodo === 'TRANSFERENCIA' ? 'card' :
                                                metodo === 'CHEQUE' ? 'receipt' : 'ellipsis-horizontal'
                                            }
                                            size={16}
                                            color={metodoPago === metodo ? '#fff' : '#8E44AD'}
                                        />
                                        <Text style={[
                                            styles.metodoPagoText,
                                            metodoPago === metodo && styles.metodoPagoTextActive
                                        ]}>
                                            {metodo}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Monto */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Monto del Abono</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Cantidad</Text>
                                <View style={styles.montoContainer}>
                                    <Text style={styles.montoSymbol}>$</Text>
                                    <TextInput
                                        style={styles.montoInput}
                                        value={monto}
                                        onChangeText={setMonto}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Observaciones */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Observaciones</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Comentarios (Opcional)</Text>
                                <TextInput
                                    style={styles.textArea}
                                    value={observaciones}
                                    onChangeText={setObservaciones}
                                    placeholder="Agregar observaciones sobre el abono..."
                                    multiline={true}
                                    numberOfLines={3}
                                />
                            </View>
                        </View>

                        {/* Resumen */}
                        {selectedUser && monto && (
                            <View style={styles.section}>
                                <View style={styles.totalSection}>
                                    <Text style={styles.totalLabel}>Total del Abono</Text>
                                    <Text style={styles.totalValue}>${parseFloat(monto || '0').toFixed(2)}</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (!selectedUser || !monto || loading) && styles.submitButtonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={!selectedUser || !monto || loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            )}
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Procesando...' : 'Registrar Abono'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 16,
    },
    labelWithButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    selectUserButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#8E44AD',
        gap: 6,
    },
    selectUserText: {
        fontSize: 14,
        color: '#8E44AD',
        fontWeight: '500',
    },
    selectedUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3e8ff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#8E44AD',
    },
    selectedUserInfo: {
        flex: 1,
    },
    selectedUserName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    selectedUserDetails: {
        fontSize: 14,
        color: '#666',
    },
    clearSelectionButton: {
        padding: 4,
    },
    helperText: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
    },
    metodoPagoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metodoPagoButton: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#8E44AD',
        backgroundColor: '#fff',
        gap: 8,
    },
    metodoPagoActive: {
        backgroundColor: '#8E44AD',
    },
    metodoPagoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E44AD',
    },
    metodoPagoTextActive: {
        color: '#fff',
    },
    montoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    montoSymbol: {
        fontSize: 18,
        fontWeight: '600',
        color: '#8E44AD',
        paddingLeft: 16,
    },
    montoInput: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 12,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        height: 80,
        textAlignVertical: 'top',
    },
    totalSection: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#8E44AD',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    submitButton: {
        flex: 2,
        flexDirection: 'row',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#8E44AD',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    // Estilos para el modal de selección de usuarios
    userSelectionContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    userSelectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    userSelectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        margin: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#dee2e6',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    userList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    usuarioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        gap: 12,
    },
    usuarioIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    usuarioInfo: {
        flex: 1,
    },
    usuarioName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    usuarioEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    usuarioPhone: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    usuarioCuenta: {
        fontSize: 13,
        color: '#8E44AD',
        fontWeight: '500',
    },
    usuarioArrow: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
});