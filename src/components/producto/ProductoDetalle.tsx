import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductoResponse as ProductoResponseCatalog } from '../../types/catalog';
import { ProductoResponse as ProductoResponseProducto } from '../../types/producto';

const { width } = Dimensions.get('window');

// Tipo unión para manejar ambos tipos de ProductoResponse
type ProductoUnion = ProductoResponseProducto | ProductoResponseCatalog;

interface ProductoDetalleProps {
    producto: ProductoUnion;
    onEdit?: () => void;
    onDelete?: () => void;
    onGoBack?: () => void;
    showActions?: boolean;
}

// Type guards para determinar qué tipo de producto es
const hasStock = (producto: ProductoUnion): producto is ProductoResponseCatalog => {
    return 'stock' in producto;
};

const hasPrecioUnitario = (producto: ProductoUnion): producto is ProductoResponseProducto => {
    return 'precioUnitario' in producto;
};

const hasFechas = (producto: ProductoUnion): producto is ProductoResponseCatalog => {
    return 'fechaCreacion' in producto;
};

export const ProductoDetalle: React.FC<ProductoDetalleProps> = ({
    producto,
    onEdit,
    onDelete,
    onGoBack,
    showActions = false,
}) => {
    // Obtener precio según el tipo de producto
    const getPrecio = () => {
        if (hasPrecioUnitario(producto)) {
            return producto.precioUnitario;
        }
        if (hasStock(producto)) {
            return producto.precio;
        }
        return 0;
    };

    // Obtener stock si está disponible
    const getStock = () => {
        if (hasStock(producto)) {
            return producto.stock;
        }
        return null;
    };

    // Obtener estado del producto
    const getEstado = () => {
        if (hasPrecioUnitario(producto)) {
            return producto.estado;
        }
        // Para productos del catálogo, determinar estado basado en stock
        if (hasStock(producto)) {
            return producto.stock > 0 ? 'DISPONIBLE' : 'AGOTADO';
        }
        return 'DISPONIBLE';
    };

    // Obtener color del estado
    const getEstadoColor = () => {
        const estado = getEstado();
        switch (estado) {
            case 'DISPONIBLE':
                return '#4CAF50';
            case 'AGOTADO':
            case 'NO_DISPONIBLE':
                return '#f44336';
            case 'DESCONTINUADO':
                return '#FF9800';
            default:
                return '#9E9E9E';
        }
    };

    // Obtener fechas si están disponibles
    const getFechaCreacion = () => {
        if (hasFechas(producto)) {
            return new Date(producto.fechaCreacion).toLocaleDateString('es-ES');
        }
        return null;
    };

    const getFechaModificacion = () => {
        if (hasFechas(producto)) {
            return new Date(producto.fechaModificacion).toLocaleDateString('es-ES');
        }
        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header con imagen y botón de retroceso */}
                <View style={styles.imageContainer}>
                    {/* Header superpuesto */}
                    <View style={styles.headerOverlay}>
                        {onGoBack && (
                            <TouchableOpacity 
                                style={styles.backButton} 
                                onPress={onGoBack}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {producto.imagenUrl ? (
                        <Image 
                            source={{ uri: producto.imagenUrl }} 
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <LinearGradient
                            colors={['#6C5CE7', '#74b9ff']}
                            style={styles.placeholderImage}
                        >
                            <Ionicons name="image-outline" size={80} color="#fff" />
                            <Text style={styles.placeholderText}>Sin imagen</Text>
                        </LinearGradient>
                    )}
                    
                    {/* Estado badge */}
                    <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor() }]}>
                        <Text style={styles.estadoText}>{getEstado()}</Text>
                    </View>
                </View>

                {/* Información del producto - Estilo Netflix/Temu */}
                <View style={styles.contentContainer}>
                    {/* Título y precio principal */}
                    <View style={styles.productHeader}>
                        <Text style={styles.productName}>{producto.nombre}</Text>
                        <Text style={styles.productPrice}>${getPrecio().toFixed(2)}</Text>
                    </View>

                    {/* Categoría */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryText}>{producto.categoria?.nombre || 'Sin categoría'}</Text>
                    </View>

                    {/* Descripción */}
                    {producto.descripcion && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Descripción</Text>
                            <Text style={styles.descripcionText}>{producto.descripcion}</Text>
                        </View>
                    )}

                    {/* Información en lista limpia */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Detalles del producto</Text>
                        
                        <View style={styles.infoList}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>ID del producto</Text>
                                <Text style={styles.infoValue}>#{producto.id}</Text>
                            </View>
                            
                            {getStock() !== null && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Disponibilidad</Text>
                                    <Text style={[styles.infoValue, { color: getStock()! > 0 ? '#00C851' : '#FF4444' }]}>
                                        {getStock()! > 0 ? `${getStock()} en stock` : 'Agotado'}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Estado</Text>
                                <Text style={[styles.infoValue, { color: getEstadoColor() }]}>
                                    {getEstado()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Fechas en lista limpia - solo si están disponibles */}
                    {hasFechas(producto) && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Información adicional</Text>
                            
                            <View style={styles.infoList}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Fecha de creación</Text>
                                    <Text style={styles.infoValue}>{getFechaCreacion()}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Última modificación</Text>
                                    <Text style={styles.infoValue}>{getFechaModificacion()}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Botones de acción estilo Netflix/Temu */}
                    {showActions && (onEdit || onDelete) && (
                        <View style={styles.actionsSection}>
                            {onEdit && (
                                <TouchableOpacity style={styles.editButton} onPress={onEdit} activeOpacity={0.8}>
                                    <Text style={styles.editButtonText}>✏️  Editar producto</Text>
                                </TouchableOpacity>
                            )}
                            
                            {onDelete && (
                                <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.8}>
                                    <Text style={styles.deleteButtonText}>🗑️  Eliminar producto</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: '#fff',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: width,
        height: width * 0.8,
    },
    placeholderImage: {
        width: width,
        height: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 12,
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    estadoBadge: {
        position: 'absolute',
        top: 30,
        right: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    estadoText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    contentContainer: {
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    productHeader: {
        marginBottom: 16,
    },
    productName: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        lineHeight: 30,
    },
    productPrice: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
        color: '#007506ff',
    },
    categoryContainer: {
        marginBottom: 24,
        alignSelf: 'center',
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    descripcionText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    infoList: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        marginBottom: 1,
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        textAlign: 'right',
    },
    actionsSection: {
        marginTop: 32,
        gap: 12,
    },
    editButton: {
        backgroundColor: '#0536d8ff',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#e00000ff',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#ffffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProductoDetalle;