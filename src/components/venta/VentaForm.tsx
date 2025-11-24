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
import { apiService } from '../../services/api';
import { productoService } from '../../services/productoService';
import { ventaService } from '../../services/ventaService';
import { UsuarioResponse } from '../../types/auth';
import { ProductoResponse } from '../../types/producto';
import { DetalleVentaRequest, TipoVenta, VentaRequest } from '../../types/venta';

interface VentaFormProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface DetalleVentaFormItem extends DetalleVentaRequest {
    producto?: ProductoResponse;
    subtotal: number;
}

export const VentaForm: React.FC<VentaFormProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState<ProductoResponse[]>([]);
    const [loadingProductos, setLoadingProductos] = useState(false);
    
    // Form state
    const [cuentaClienteId, setCuentaClienteId] = useState('');
    const [clienteOcasional, setClienteOcasional] = useState('');
    const [tipoVenta, setTipoVenta] = useState<TipoVenta>(TipoVenta.CONTADO);
    const [observaciones, setObservaciones] = useState('');
    const [detalleVentas, setDetalleVentas] = useState<DetalleVentaFormItem[]>([]);

    // Product selection state
    const [showProductSelection, setShowProductSelection] = useState(false);
    const [searchProducto, setSearchProducto] = useState('');

    // User selection state
    const [showUserSelection, setShowUserSelection] = useState(false);
    const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    const [searchUsuario, setSearchUsuario] = useState('');
    const [selectedUser, setSelectedUser] = useState<UsuarioResponse | null>(null);

    useEffect(() => {
        if (visible) {
            resetForm();
            fetchProductos();
            fetchUsuarios();
        }
    }, [visible]);

    const resetForm = () => {
        setCuentaClienteId('');
        setClienteOcasional('');
        setTipoVenta(TipoVenta.CONTADO);
        setObservaciones('');
        setDetalleVentas([]);
        setSelectedUser(null);
        setSearchProducto('');
        setSearchUsuario('');
    };

    const fetchProductos = async () => {
        try {
            setLoadingProductos(true);
            const response = await productoService.listarTodos(0, 100); // Obtener más productos
            setProductos(response.content);
        } catch (error) {
            console.error('Error fetching productos:', error);
            Alert.alert('Error', 'No se pudieron cargar los productos');
        } finally {
            setLoadingProductos(false);
        }
    };

    const fetchUsuarios = async () => {
        try {
            setLoadingUsuarios(true);
            // Simulamos obtener usuarios con cuenta usando el endpoint de usuarios
            const response = await apiService.getAxiosInstance().get('/admin/usuarios?page=0&size=100');
            // Filtrar usuarios que tengan cuentaClienteId
            const usuariosConCuenta = response.data.content.filter((user: UsuarioResponse) => user.cuentaClienteId);
            setUsuarios(usuariosConCuenta);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            Alert.alert('Error', 'No se pudieron cargar los usuarios');
        } finally {
            setLoadingUsuarios(false);
        }
    };

    const filteredProductos = productos.filter(p =>
        p.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.categoria.nombre.toLowerCase().includes(searchProducto.toLowerCase())
    );

    const filteredUsuarios = usuarios.filter(u =>
        u.nombreCompleto.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        u.cuentaClienteId?.toString().includes(searchUsuario) ||
        u.dui.includes(searchUsuario)
    );

    const addProductoToVenta = (producto: ProductoResponse) => {
        const existingIndex = detalleVentas.findIndex(d => d.productoId === producto.id);
        
        if (existingIndex >= 0) {
            // Si ya existe, aumentar cantidad
            const newDetalles = [...detalleVentas];
            newDetalles[existingIndex].cantidad += 1;
            newDetalles[existingIndex].subtotal = newDetalles[existingIndex].cantidad * producto.precioUnitario;
            setDetalleVentas(newDetalles);
        } else {
            // Agregar nuevo detalle
            const newDetalle: DetalleVentaFormItem = {
                productoId: producto.id,
                cantidad: 1,
                producto: producto,
                subtotal: producto.precioUnitario,
            };
            setDetalleVentas([...detalleVentas, newDetalle]);
        }
        
        setShowProductSelection(false);
        setSearchProducto('');
    };

    const selectUser = (usuario: UsuarioResponse) => {
        setSelectedUser(usuario);
        setCuentaClienteId(usuario.cuentaClienteId?.toString() || '');
        setClienteOcasional(''); // Limpiar cliente ocasional
        setShowUserSelection(false);
        setSearchUsuario('');
    };

    const updateCantidad = (index: number, cantidad: number) => {
        if (cantidad <= 0) {
            removeProducto(index);
            return;
        }

        const newDetalles = [...detalleVentas];
        newDetalles[index].cantidad = cantidad;
        newDetalles[index].subtotal = cantidad * (newDetalles[index].producto?.precioUnitario || 0);
        setDetalleVentas(newDetalles);
    };

    const removeProducto = (index: number) => {
        const newDetalles = detalleVentas.filter((_, i) => i !== index);
        setDetalleVentas(newDetalles);
    };

    const calculateTotal = () => {
        return detalleVentas.reduce((sum, detalle) => sum + detalle.subtotal, 0);
    };

    const handleSubmit = async () => {
        // Validaciones
        if (!clienteOcasional.trim() && !cuentaClienteId.trim()) {
            Alert.alert('Error', 'Debe especificar un cliente ocasional o ID de cuenta de cliente');
            return;
        }

        if (detalleVentas.length === 0) {
            Alert.alert('Error', 'Debe agregar al menos un producto');
            return;
        }

        try {
            setLoading(true);

            const ventaRequest: VentaRequest = {
                cuentaClienteId: cuentaClienteId.trim() ? parseInt(cuentaClienteId) : undefined,
                clienteOcasional: clienteOcasional.trim() || undefined,
                tipoVenta,
                observaciones: observaciones.trim() || undefined,
                detalleVentas: detalleVentas.map(d => ({
                    productoId: d.productoId,
                    cantidad: d.cantidad,
                })),
            };

            await ventaService.crear(ventaRequest);
            
            Alert.alert('Éxito', 'Venta creada correctamente', [
                { text: 'OK', onPress: () => {
                    onSuccess();
                    onClose();
                }}
            ]);
        } catch (error: any) {
            console.error('Error creating venta:', error);
            Alert.alert('Error', 'No se pudo crear la venta');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const renderProductoItem = ({ item }: { item: ProductoResponse }) => (
        <TouchableOpacity
            style={styles.productoItem}
            onPress={() => addProductoToVenta(item)}
        >
            <View style={styles.productoInfo}>
                <Text style={styles.productoName}>{item.nombre}</Text>
                <Text style={styles.productoCategoria}>{item.categoria.nombre}</Text>
            </View>
            <Text style={styles.productoPrice}>{formatPrice(item.precioUnitario)}</Text>
        </TouchableOpacity>
    );

    const renderUsuarioItem = ({ item }: { item: UsuarioResponse }) => (
        <TouchableOpacity
            style={styles.usuarioItem}
            onPress={() => selectUser(item)}
        >
            <View style={styles.usuarioInfo}>
                <Text style={styles.usuarioName}>{item.nombreCompleto}</Text>
                <Text style={styles.usuarioEmail}>{item.email}</Text>
                <Text style={styles.usuarioCuenta}>
                    Cuenta ID: {item.cuentaClienteId} • DUI: {item.dui}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderDetalleItem = ({ item, index }: { item: DetalleVentaFormItem; index: number }) => (
        <View style={styles.detalleItem}>
            <View style={styles.detalleInfo}>
                <Text style={styles.detalleNombre}>{item.producto?.nombre}</Text>
                <Text style={styles.detallePrice}>
                    {formatPrice(item.producto?.precioUnitario || 0)} c/u
                </Text>
            </View>
            
            <View style={styles.cantidadContainer}>
                <TouchableOpacity
                    style={styles.cantidadButton}
                    onPress={() => updateCantidad(index, item.cantidad - 1)}
                >
                    <Ionicons name="remove" size={16} color="#666" />
                </TouchableOpacity>
                
                <Text style={styles.cantidadText}>{item.cantidad}</Text>
                
                <TouchableOpacity
                    style={styles.cantidadButton}
                    onPress={() => updateCantidad(index, item.cantidad + 1)}
                >
                    <Ionicons name="add" size={16} color="#666" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.detalleRight}>
                <Text style={styles.subtotalText}>{formatPrice(item.subtotal)}</Text>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeProducto(index)}
                >
                    <Ionicons name="trash-outline" size={16} color="#F44336" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Nueva Venta</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Información del Cliente */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Información del Cliente</Text>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Cliente Ocasional</Text>
                            <TextInput
                                style={styles.input}
                                value={clienteOcasional}
                                onChangeText={(text) => {
                                    setClienteOcasional(text);
                                    if (text.trim()) {
                                        setCuentaClienteId('');
                                        setSelectedUser(null);
                                    }
                                }}
                                placeholder="Nombre del cliente ocasional"
                                editable={!selectedUser && !cuentaClienteId.trim()}
                            />
                        </View>

                        <View style={styles.orDivider}>
                            <View style={styles.orLine} />
                            <Text style={styles.orText}>O</Text>
                            <View style={styles.orLine} />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.labelWithButton}>
                                <Text style={styles.label}>Cuenta de Cliente</Text>
                                <TouchableOpacity
                                    style={styles.selectUserButton}
                                    onPress={() => setShowUserSelection(true)}
                                    disabled={!!clienteOcasional.trim()}
                                >
                                    <Ionicons name="search" size={16} color={clienteOcasional.trim() ? "#ccc" : "#4CAF50"} />
                                    <Text style={[styles.selectUserText, clienteOcasional.trim() && { color: '#ccc' }]}>
                                        Buscar Cliente
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                            {selectedUser ? (
                                <View style={styles.selectedUserContainer}>
                                    <View style={styles.selectedUserInfo}>
                                        <Text style={styles.selectedUserName}>{selectedUser.nombreCompleto}</Text>
                                        <Text style={styles.selectedUserDetails}>
                                            {selectedUser.email} • Cuenta ID: {selectedUser.cuentaClienteId}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.clearSelectionButton}
                                        onPress={() => {
                                            setSelectedUser(null);
                                            setCuentaClienteId('');
                                        }}
                                    >
                                        <Ionicons name="close" size={20} color="#F44336" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TextInput
                                    style={styles.input}
                                    value={cuentaClienteId}
                                    onChangeText={setCuentaClienteId}
                                    placeholder="ID de cuenta existente o busque arriba"
                                    keyboardType="numeric"
                                    editable={!clienteOcasional.trim()}
                                />
                            )}
                        </View>

                        <Text style={styles.helperText}>
                            Especifique un cliente ocasional O seleccione una cuenta existente
                        </Text>
                    </View>

                    {/* Tipo de Venta */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tipo de Venta</Text>
                        <View style={styles.tipoVentaContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tipoVentaButton,
                                    tipoVenta === TipoVenta.CONTADO && styles.tipoVentaActive
                                ]}
                                onPress={() => setTipoVenta(TipoVenta.CONTADO)}
                            >
                                <Text style={[
                                    styles.tipoVentaText,
                                    tipoVenta === TipoVenta.CONTADO && styles.tipoVentaTextActive
                                ]}>
                                    Contado
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[
                                    styles.tipoVentaButton,
                                    tipoVenta === TipoVenta.CREDITO && styles.tipoVentaActive
                                ]}
                                onPress={() => setTipoVenta(TipoVenta.CREDITO)}
                            >
                                <Text style={[
                                    styles.tipoVentaText,
                                    tipoVenta === TipoVenta.CREDITO && styles.tipoVentaTextActive
                                ]}>
                                    Crédito
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Productos */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Productos</Text>
                            <TouchableOpacity
                                style={styles.addProductButton}
                                onPress={() => setShowProductSelection(true)}
                            >
                                <Ionicons name="add" size={20} color="#4CAF50" />
                                <Text style={styles.addProductText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>

                        {detalleVentas.length > 0 ? (
                            <FlatList
                                data={detalleVentas}
                                renderItem={renderDetalleItem}
                                keyExtractor={(item, index) => index.toString()}
                                scrollEnabled={false}
                            />
                        ) : (
                            <View style={styles.emptyProducts}>
                                <Ionicons name="basket-outline" size={48} color="#ccc" />
                                <Text style={styles.emptyProductsText}>
                                    No hay productos agregados
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Observaciones */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Observaciones (Opcional)</Text>
                        <TextInput
                            style={styles.textArea}
                            value={observaciones}
                            onChangeText={setObservaciones}
                            placeholder="Observaciones adicionales..."
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Total */}
                    {detalleVentas.length > 0 && (
                        <View style={styles.totalSection}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalValue}>
                                {formatPrice(calculateTotal())}
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Botones */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading || detalleVentas.length === 0}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark" size={20} color="#fff" />
                                <Text style={styles.submitButtonText}>Crear Venta</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal de selección de productos */}
            <Modal
                visible={showProductSelection}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowProductSelection(false)}
            >
                <View style={styles.productSelectionContainer}>
                    <View style={styles.productSelectionHeader}>
                        <TouchableOpacity onPress={() => setShowProductSelection(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        <Text style={styles.productSelectionTitle}>Seleccionar Producto</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            value={searchProducto}
                            onChangeText={setSearchProducto}
                            placeholder="Buscar productos..."
                        />
                    </View>

                    {loadingProductos ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4CAF50" />
                            <Text style={styles.loadingText}>Cargando productos...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProductos}
                            renderItem={renderProductoItem}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </Modal>

            {/* Modal de selección de usuarios */}
            <Modal
                visible={showUserSelection}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowUserSelection(false)}
            >
                <View style={styles.productSelectionContainer}>
                    <View style={styles.productSelectionHeader}>
                        <TouchableOpacity onPress={() => setShowUserSelection(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        <Text style={styles.productSelectionTitle}>Seleccionar Cliente</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            value={searchUsuario}
                            onChangeText={setSearchUsuario}
                            placeholder="Buscar por nombre, email, cuenta o DUI..."
                        />
                    </View>

                    {loadingUsuarios ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4CAF50" />
                            <Text style={styles.loadingText}>Cargando usuarios...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredUsuarios}
                            renderItem={renderUsuarioItem}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </Modal>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    tipoVentaContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    tipoVentaButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    tipoVentaActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    tipoVentaText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    tipoVentaTextActive: {
        color: '#fff',
    },
    addProductButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addProductText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
    },
    emptyProducts: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyProductsText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    detalleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detalleInfo: {
        flex: 1,
    },
    detalleNombre: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    detallePrice: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    cantidadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    cantidadButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cantidadText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginHorizontal: 16,
        minWidth: 30,
        textAlign: 'center',
    },
    detalleRight: {
        alignItems: 'flex-end',
    },
    subtotalText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    removeButton: {
        padding: 4,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
        height: 80,
        textAlignVertical: 'top',
    },
    totalSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    submitButton: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        gap: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    // Estilos para el modal de selección de productos
    productSelectionContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    productSelectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    productSelectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    productoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    productoInfo: {
        flex: 1,
    },
    productoName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    productoCategoria: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    productoPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    // Nuevos estilos para la selección de usuarios
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    labelWithButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    selectUserButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        gap: 4,
    },
    selectUserText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
    },
    selectedUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    selectedUserInfo: {
        flex: 1,
    },
    selectedUserName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2e7d32',
        marginBottom: 2,
    },
    selectedUserDetails: {
        fontSize: 14,
        color: '#388e3c',
    },
    clearSelectionButton: {
        padding: 4,
    },
    usuarioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    usuarioInfo: {
        flex: 1,
    },
    usuarioName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    usuarioEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    usuarioCuenta: {
        fontSize: 13,
        color: '#888',
    },
});