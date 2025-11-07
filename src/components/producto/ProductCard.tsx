import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EstadoProducto, ProductoResponse } from '../../types/producto';

interface ProductCardProps {
    producto: ProductoResponse;
    onEdit: (producto: ProductoResponse) => void;
    onDelete: (id: number) => void;
    onViewDetails?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    producto,
    onEdit,
    onDelete,
    onViewDetails,
}) => {
    const handleDelete = () => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de que deseas eliminar "${producto.nombre}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => onDelete(producto.id),
                },
            ]
        );
    };

    const getEstadoColor = (estado: EstadoProducto) => {
        switch (estado) {
            case EstadoProducto.DISPONIBLE:
                return '#4CAF50';
            case EstadoProducto.NO_DISPONIBLE:
                return '#FF9800';
            case EstadoProducto.DESCONTINUADO:
                return '#F44336';
            default:
                return '#757575';
        }
    };

    const getEstadoText = (estado: EstadoProducto) => {
        switch (estado) {
            case EstadoProducto.DISPONIBLE:
                return 'Disponible';
            case EstadoProducto.NO_DISPONIBLE:
                return 'No Disponible';
            case EstadoProducto.DESCONTINUADO:
                return 'Descontinuado';
            default:
                return estado;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onViewDetails ? () => onViewDetails(producto.id) : undefined}
            activeOpacity={onViewDetails ? 0.7 : 1}
        >
            <View style={styles.imageContainer}>
                {producto.imagenUrl ? (
                    <Image source={{ uri: producto.imagenUrl }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={40} color="#ccc" />
                        <Text style={styles.placeholderText}>Sin imagen</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={2}>
                        {producto.nombre}
                    </Text>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onEdit(producto)}
                        >
                            <Ionicons name="create-outline" size={20} color="#2196F3" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleDelete}
                        >
                            <Ionicons name="trash-outline" size={20} color="#F44336" />
                        </TouchableOpacity>
                    </View>
                </View>

                {producto.descripcion && (
                    <Text style={styles.description} numberOfLines={2}>
                        {producto.descripcion}
                    </Text>
                )}

                <View style={styles.categoryContainer}>
                    <Ionicons name="pricetag-outline" size={16} color="#666" />
                    <Text style={styles.categoryText}>{producto.categoria.nombre}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.price}>
                        {formatPrice(producto.precioUnitario)}
                    </Text>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: getEstadoColor(producto.estado) }
                    ]}>
                        <Text style={styles.statusText}>
                            {getEstadoText(producto.estado)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    imageContainer: {
        width: 100,
        height: 120,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    placeholderText: {
        fontSize: 10,
        color: '#ccc',
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    name: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#f5f5f5',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
});