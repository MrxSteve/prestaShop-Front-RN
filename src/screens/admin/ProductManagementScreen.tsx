import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { ProductForm } from '../../components/producto/ProductForm';
import { ProductList } from '../../components/producto/ProductList';
import { productoService } from '../../services/productoService';
import { CatalogStackParamList } from '../../types/navigation';
import { ImagenLocal, ProductoImagenRequest, ProductoResponse } from '../../types/producto';

type ProductManagementScreenNavigationProp = StackNavigationProp<CatalogStackParamList>;

export default function ProductManagementScreen() {
    const navigation = useNavigation<ProductManagementScreenNavigationProp>();
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (producto: ProductoResponse) => {
        setSelectedProduct(producto);
        setShowForm(true);
    };

    const handleSaveProduct = async (productoData: ProductoImagenRequest, imagen?: ImagenLocal) => {
        try {
            setLoading(true);
            
            console.log('🔄 Iniciando proceso de guardado de producto...');
            console.log('Datos del producto:', {
                nombre: productoData.nombre,
                descripcion: productoData.descripcion,
                precioUnitario: productoData.precioUnitario,
                categoriaId: productoData.categoriaId,
                estado: productoData.estado,
                hasImagen: !!imagen,
                isEditing: !!selectedProduct
            });
            
            if (selectedProduct) {
                // Editar producto existente
                console.log('📝 Actualizando producto existente...');
                const updateData = {
                    nombre: productoData.nombre,
                    descripcion: productoData.descripcion,
                    precioUnitario: productoData.precioUnitario,
                    categoriaId: productoData.categoriaId,
                    estado: productoData.estado,
                };
                
                await productoService.actualizarConImagen(selectedProduct.id, updateData, imagen);
                console.log('✅ Producto actualizado exitosamente');
                Alert.alert('Éxito', 'Producto actualizado correctamente');
            } else {
                // Crear nuevo producto
                console.log('➕ Creando nuevo producto...');
                await productoService.crearConImagen(productoData, imagen);
                console.log('✅ Producto creado exitosamente');
                Alert.alert('Éxito', 'Producto creado correctamente');
            }
            
            setShowForm(false);
            setSelectedProduct(null);
            setRefreshTrigger(prev => prev + 1);
            
        } catch (error: any) {
            console.error('Error saving product:', error);
            
            let errorMessage = 'Error al guardar el producto';
            
            if (error.response?.status === 409) {
                errorMessage = 'Ya existe un producto con ese nombre';
            } else if (error.response?.status === 400) {
                errorMessage = 'Datos inválidos. Verifica la información';
            } else if (error.response?.status === 404) {
                errorMessage = 'Categoría no encontrada. Verifica la categoría seleccionada';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Error de conexión. Verifica tu internet';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Error', errorMessage);
            throw error; // Re-throw para que el form maneje el estado de loading
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedProduct(null);
    };

    const handleViewProductDetails = (productId: number) => {
        navigation.navigate('ProductoDetalle', { productId });
    };

    return (
        <View style={styles.container}>
            <CustomHeader 
                title="Gestión de Productos" 
                showBackButton={true}
            />
            <View style={styles.content}>
                <ProductList
                    onEditProduct={handleEditProduct}
                    onViewDetails={handleViewProductDetails}
                    refreshTrigger={refreshTrigger}
                    onAddProduct={handleAddProduct}
                />
            </View>

            <Modal
                visible={showForm}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <ProductForm
                        producto={selectedProduct}
                        onSave={handleSaveProduct}
                        onCancel={handleCancel}
                        loading={loading}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
});