import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { productoService } from '../../services/productoService';
import { EstadoProducto, ProductoFiltros, ProductoResponse } from '../../types/producto';
import { Pagination, PaginationInfo } from '../common/Pagination';
import { ProductCard } from './ProductCard';

// 🔧 CONFIGURACIÓN: Cambia este número para mostrar más o menos productos por página
const PRODUCTS_PER_PAGE = 8;

interface ProductListProps {
    onEditProduct: (producto: ProductoResponse) => void;
    onAddProduct?: () => void;
    refreshTrigger?: number;
}

export const ProductList: React.FC<ProductListProps> = ({
    onEditProduct,
    onAddProduct,
    refreshTrigger = 0,
}) => {
    const [products, setProducts] = useState<ProductoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: PRODUCTS_PER_PAGE,
    });
    const [error, setError] = useState<string | null>(null);
    
    // Estados de filtros y búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<ProductoFiltros>({});

    const fetchProducts = useCallback(async (pageNum: number = 0, refresh: boolean = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            
            setError(null);

            const response = await productoService.listarTodos(pageNum, PRODUCTS_PER_PAGE);
            
            setProducts(response.content);
            
            setPaginationInfo({
                currentPage: response.number,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                pageSize: response.size,
            });
            
        } catch (error: any) {
            console.error('Error fetching products:', error);
            setError('Error al cargar los productos');
            Alert.alert('Error', 'No se pudieron cargar los productos');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    const searchProductsByName = async (name: string) => {
        if (!name.trim()) {
            // Si no hay búsqueda, volver a cargar todos
            setSearchQuery('');
            setIsSearching(false);
            setFilters({});
            await fetchProducts(0, true);
            return;
        }

        try {
            setIsSearching(true);
            setLoading(true);
            setError(null);

            const response = await productoService.buscarPorNombre(name.trim(), 0, PRODUCTS_PER_PAGE);
            setProducts(response.content);
            setPaginationInfo({
                currentPage: 0,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                pageSize: response.size,
            });
            
        } catch (error: any) {
            console.error('Error searching products:', error);
            setError(`No se encontraron productos con el nombre "${name}"`);
            setProducts([]);
            setPaginationInfo({
                currentPage: 0,
                totalPages: 0,
                totalElements: 0,
                pageSize: PRODUCTS_PER_PAGE,
            });
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    const applyFilters = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;

            if (filters.estado) {
                response = await productoService.obtenerPorEstado(filters.estado, 0, PRODUCTS_PER_PAGE);
            } else if (filters.categoriaId) {
                response = await productoService.obtenerPorCategoria(filters.categoriaId, 0, PRODUCTS_PER_PAGE);
            } else if (filters.precioMin !== undefined && filters.precioMax !== undefined) {
                response = await productoService.buscarPorRangoPrecio(filters.precioMin, filters.precioMax, 0, PRODUCTS_PER_PAGE);
            } else {
                // Si no hay filtros, cargar todos
                response = await productoService.listarTodos(0, PRODUCTS_PER_PAGE);
            }

            setProducts(response.content);
            setPaginationInfo({
                currentPage: 0,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                pageSize: response.size,
            });

        } catch (error: any) {
            console.error('Error applying filters:', error);
            setError('Error al aplicar filtros');
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({});
        setSearchQuery('');
        setShowFilters(false);
        fetchProducts(0, true);
    };

    const handleSearchInput = (text: string) => {
        setSearchQuery(text);
    };

    const handleSearchPress = () => {
        if (searchQuery.trim()) {
            searchProductsByName(searchQuery.trim());
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await productoService.eliminar(id);
            // Refresh the list after deletion
            if (searchQuery.trim()) {
                // Si está buscando, limpiar búsqueda y recargar
                setSearchQuery('');
                setFilters({});
                await fetchProducts(0, true);
            } else {
                await fetchProducts(0, true);
            }
            Alert.alert('Éxito', 'Producto eliminado correctamente');
        } catch (error: any) {
            console.error('Error deleting product:', error);
            Alert.alert('Error', 'No se pudo eliminar el producto');
        }
    };

    const handlePageChange = (page: number) => {
        if (!searchQuery && Object.keys(filters).length === 0) {
            fetchProducts(page);
        }
    };

    const onRefresh = () => {
        setSearchQuery('');
        setFilters({});
        setShowFilters(false);
        fetchProducts(0, true);
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Refresh when trigger changes (after adding/editing)
    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchProducts(0, true);
        }
    }, [refreshTrigger, fetchProducts]);

    const renderProduct = ({ item }: { item: ProductoResponse }) => (
        <ProductCard
            producto={item}
            onEdit={onEditProduct}
            onDelete={handleDelete}
        />
    );

    const renderEmpty = () => {
        if (loading) return null;
        
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>No hay productos</Text>
                <Text style={styles.emptySubtitle}>
                    {searchQuery || Object.keys(filters).length > 0
                        ? 'No se encontraron productos con los criterios de búsqueda'
                        : 'Agrega tu primer producto para comenzar'}
                </Text>
                {(searchQuery || Object.keys(filters).length > 0) && (
                    <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                        <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading && products.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
        );
    }

    const hasActiveFilters = searchQuery.trim() || Object.keys(filters).length > 0;

    return (
        <View style={styles.container}>
            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar producto por nombre..."
                        value={searchQuery}
                        onChangeText={handleSearchInput}
                        returnKeyType="search"
                        onSubmitEditing={handleSearchPress}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                            <Ionicons name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
                
                <TouchableOpacity 
                    onPress={handleSearchPress} 
                    style={[styles.searchButton, !searchQuery.trim() && styles.searchButtonDisabled]}
                    disabled={!searchQuery.trim() || isSearching}
                >
                    {isSearching ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="search" size={20} color="#fff" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setShowFilters(!showFilters)} 
                    style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
                >
                    <Ionicons name="filter" size={20} color={hasActiveFilters ? "#fff" : "#4CAF50"} />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={20} color="#4CAF50" />
                </TouchableOpacity>
            </View>

            {/* Panel de filtros */}
            {showFilters && (
                <View style={styles.filtersPanel}>
                    <Text style={styles.filtersTitle}>Filtros</Text>
                    
                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>Estado:</Text>
                        <View style={styles.filterPickerContainer}>
                            <Picker
                                selectedValue={filters.estado || ''}
                                onValueChange={(value: string) => 
                                    setFilters(prev => ({ 
                                        ...prev, 
                                        estado: value ? value as EstadoProducto : undefined 
                                    }))
                                }
                                style={styles.filterPicker}
                            >
                                <Picker.Item label="Todos los estados" value="" />
                                <Picker.Item label="Disponible" value={EstadoProducto.DISPONIBLE} />
                                <Picker.Item label="No Disponible" value={EstadoProducto.NO_DISPONIBLE} />
                                <Picker.Item label="Descontinuado" value={EstadoProducto.DESCONTINUADO} />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.filterActions}>
                        <TouchableOpacity style={styles.applyFiltersButton} onPress={applyFilters}>
                            <Text style={styles.applyFiltersText}>Aplicar Filtros</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                            <Text style={styles.clearFiltersText}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Header con contador y botón agregar */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    {searchQuery || hasActiveFilters
                        ? `Resultados (${paginationInfo.totalElements})` 
                        : `Productos (${paginationInfo.totalElements})`
                    }
                </Text>
                <View style={styles.headerActions}>
                    {isSearching && (
                        <ActivityIndicator size="small" color="#4CAF50" style={styles.searchingIndicator} />
                    )}
                    {onAddProduct && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={onAddProduct}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Agregar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => fetchProducts(0, true)} style={styles.retryButton}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#4CAF50']}
                    />
                }
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
            />
            
            {/* Componente de paginación */}
            {!hasActiveFilters && paginationInfo.totalPages > 1 && (
                <Pagination
                    paginationInfo={paginationInfo}
                    onPageChange={handlePageChange}
                    loading={loading}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        gap: 8,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 4,
    },
    clearButton: {
        marginLeft: 8,
        padding: 4,
    },
    searchButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 44,
    },
    searchButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    filterButton: {
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 44,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    filterButtonActive: {
        backgroundColor: '#4CAF50',
    },
    refreshButton: {
        padding: 8,
    },
    filtersPanel: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filtersTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    filterRow: {
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    filterPickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    filterPicker: {
        height: 40,
    },
    filterActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    applyFiltersButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    applyFiltersText: {
        color: '#fff',
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    searchingIndicator: {
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    clearFiltersButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    clearFiltersText: {
        color: '#666',
        fontWeight: '600',
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorText: {
        color: '#F44336',
        flex: 1,
    },
    retryButton: {
        marginLeft: 12,
    },
    retryText: {
        color: '#4CAF50',
        fontWeight: '600',
    },
});