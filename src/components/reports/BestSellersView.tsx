import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { productoService } from '../../services/productoService';
import { ProductoResponse } from '../../types/producto';
import { ProductCard } from '../producto/ProductCard';

interface BestSellersViewProps {
    onProductEdit: (producto: ProductoResponse) => void;
    onProductViewDetails: (productId: number) => void;
    refreshTrigger?: boolean; // Para refrescar desde padre
}

export const BestSellersView: React.FC<BestSellersViewProps> = ({
    onProductEdit,
    onProductViewDetails,
    refreshTrigger
}) => {
    const [masVendidos, setMasVendidos] = useState<ProductoResponse[]>([]);
    const [loadingBestSellers, setLoadingBestSellers] = useState(false);

    const fetchMasVendidos = async () => {
        try {
            setLoadingBestSellers(true);
            const response = await productoService.obtenerMasVendidos(0, 20); // Top 20 productos
            setMasVendidos(response.content);
        } catch (error) {
            console.error('Error fetching best sellers:', error);
            Alert.alert('Error', 'No se pudieron cargar los productos más vendidos');
        } finally {
            setLoadingBestSellers(false);
        }
    };

    useEffect(() => {
        fetchMasVendidos();
    }, [refreshTrigger]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Productos Más Vendidos</Text>
            
            {loadingBestSellers ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Cargando productos más vendidos...</Text>
                </View>
            ) : masVendidos.length > 0 ? (
                <View style={styles.grid}>
                    {masVendidos.map((producto, index) => (
                        <View key={producto.id} style={styles.bestSellerItem}>
                            <View style={styles.rankBadge}>
                                <Text style={styles.rankText}>#{index + 1}</Text>
                            </View>
                            <ProductCard
                                producto={producto}
                                onEdit={onProductEdit}
                                onDelete={(id) => console.log('Delete product:', id)}
                                onViewDetails={onProductViewDetails}
                            />
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="trending-down-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>
                        No hay datos de productos más vendidos disponibles
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    grid: {
        gap: 15,
    },
    bestSellerItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    rankBadge: {
        backgroundColor: '#ffd700',
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    rankText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        gap: 10,
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
    },
});