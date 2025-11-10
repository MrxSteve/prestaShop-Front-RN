import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { productoService } from '../../services/productoService';
import { ProductoResponse } from '../../types/producto';
import { ProductCard } from '../producto/ProductCard';

interface PriceSearchViewProps {
    onProductEdit: (producto: ProductoResponse) => void;
    onProductViewDetails: (productId: number) => void;
}

export const PriceSearchView: React.FC<PriceSearchViewProps> = ({
    onProductEdit,
    onProductViewDetails
}) => {
    const [precioMin, setPrecioMin] = useState<string>('');
    const [precioMax, setPrecioMax] = useState<string>('');
    const [searchingPrice, setSearchingPrice] = useState(false);
    const [productosPorPrecio, setProductosPorPrecio] = useState<ProductoResponse[]>([]);

    const searchByPrice = async () => {
        if (!precioMin.trim() || !precioMax.trim()) {
            Alert.alert('Error', 'Por favor ingresa ambos valores de precio');
            return;
        }

        const min = parseFloat(precioMin);
        const max = parseFloat(precioMax);

        if (isNaN(min) || isNaN(max)) {
            Alert.alert('Error', 'Por favor ingresa valores numéricos válidos');
            return;
        }

        if (min >= max) {
            Alert.alert('Error', 'El precio mínimo debe ser menor al precio máximo');
            return;
        }

        try {
            setSearchingPrice(true);
            const response = await productoService.buscarPorRangoPrecio(min, max, 0, 50);
            setProductosPorPrecio(response.content);
            
            if (response.content.length === 0) {
                Alert.alert('Sin resultados', 'No se encontraron productos en ese rango de precios');
            }
        } catch (error) {
            console.error('Error searching by price:', error);
            Alert.alert('Error', 'No se pudieron buscar productos por precio');
        } finally {
            setSearchingPrice(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar por Rango de Precio</Text>
            
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Precio Mínimo ($)</Text>
                    <TextInput
                        style={styles.input}
                        value={precioMin}
                        onChangeText={setPrecioMin}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                </View>
                
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Precio Máximo ($)</Text>
                    <TextInput
                        style={styles.input}
                        value={precioMax}
                        onChangeText={setPrecioMax}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>
            
            <TouchableOpacity
                style={[styles.searchButton, searchingPrice && styles.disabledButton]}
                onPress={searchByPrice}
                disabled={searchingPrice}
            >
                {searchingPrice ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Ionicons name="search" size={18} color="#fff" />
                )}
                <Text style={styles.searchButtonText}>
                    {searchingPrice ? 'Buscando...' : 'Buscar Productos'}
                </Text>
            </TouchableOpacity>

            {productosPorPrecio.length > 0 && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>
                        Resultados ({productosPorPrecio.length} productos)
                    </Text>
                    <View style={styles.productGrid}>
                        {productosPorPrecio.map((producto) => (
                            <ProductCard
                                key={producto.id}
                                producto={producto}
                                onEdit={onProductEdit}
                                onDelete={(id) => console.log('Delete product:', id)}
                                onViewDetails={onProductViewDetails}
                            />
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    inputWrapper: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    searchButton: {
        backgroundColor: '#007bff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    resultsContainer: {
        marginTop: 20,
    },
    resultsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    productGrid: {
        gap: 10,
    },
});