import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ProductForm } from '../../components/producto/ProductForm';
import { ProductoDetalle } from '../../components/producto/ProductoDetalle';
import { productoService } from '../../services/productoService';
import { CatalogStackParamList } from '../../types/navigation';
import { ImagenLocal, ProductoImagenRequest, ProductoResponse } from '../../types/producto';

type ProductoDetalleScreenRouteProp = RouteProp<CatalogStackParamList, 'ProductoDetalle'>;
type ProductoDetalleScreenNavigationProp = StackNavigationProp<CatalogStackParamList, 'ProductoDetalle'>;

const AdminProductoDetalleScreen: React.FC = () => {
    const route = useRoute<ProductoDetalleScreenRouteProp>();
    const navigation = useNavigation<ProductoDetalleScreenNavigationProp>();
    const { productId } = route.params;

    const [producto, setProducto] = useState<ProductoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        fetchProducto();
    }, [productId]);

    const fetchProducto = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productoService.obtenerPorId(productId);
            setProducto(response);
        } catch (error: any) {
            console.error('Error fetching product:', error);
            setError('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        if (producto) {
            setShowEditForm(true);
        }
    };

    const handleSaveEdit = async (productoData: ProductoImagenRequest, imagen?: ImagenLocal) => {
        if (!producto) return;
        
        try {
            setEditLoading(true);
            
            const updateData = {
                nombre: productoData.nombre,
                descripcion: productoData.descripcion,
                precioUnitario: productoData.precioUnitario,
                categoriaId: productoData.categoriaId,
                estado: productoData.estado,
            };
            
            await productoService.actualizarConImagen(producto.id, updateData, imagen);
            
            // Refrescar los datos del producto
            await fetchProducto();
            
            setShowEditForm(false);
            Alert.alert('Éxito', 'Producto actualizado correctamente');
            
        } catch (error: any) {
            console.error('Error updating product:', error);
            
            let errorMessage = 'Error al actualizar el producto';
            if (error.response?.status === 409) {
                errorMessage = 'Ya existe un producto con ese nombre';
            } else if (error.response?.status === 400) {
                errorMessage = 'Datos inválidos. Verifica la información';
            } else if (error.response?.status === 404) {
                errorMessage = 'Categoría no encontrada';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Error de conexión. Verifica tu internet';
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setEditLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que quieres eliminar este producto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await productoService.eliminar(productId);
                            Alert.alert('Éxito', 'Producto eliminado correctamente');
                            navigation.goBack();
                        } catch (error: any) {
                            Alert.alert('Error', 'No se pudo eliminar el producto');
                        }
                    }
                }
            ]
        );
    };



    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando producto...</Text>
            </View>
        );
    }

    if (error || !producto) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
                <Text style={styles.errorText}>{error || 'Producto no encontrado'}</Text>
                <TouchableOpacity 
                    style={styles.retryButton} 
                    onPress={fetchProducto}
                >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ProductoDetalle
                producto={producto}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onGoBack={handleGoBack}
                showActions={true}
            />
            
            {/* Modal para edición */}
            <Modal
                visible={showEditForm}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancelEdit}
            >
                <View style={styles.modalOverlay}>
                    <ProductForm
                        producto={producto}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        loading={editLoading}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#f44336',
        textAlign: 'center',
        marginTop: 10,
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
});

export default AdminProductoDetalleScreen;