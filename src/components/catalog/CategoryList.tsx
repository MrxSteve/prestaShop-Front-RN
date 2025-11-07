import { Ionicons } from '@expo/vector-icons';
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
import { categoryService } from '../../services/categoryService';
import { CategoriaResponse, Page } from '../../types/catalog';
import { Pagination, PaginationInfo } from '../common/Pagination';
import { CategoryCard } from './CategoryCard';

// 🔧 CONFIGURACIÓN: Cambia este número para mostrar más o menos categorías por página
const CATEGORIES_PER_PAGE = 5;

interface CategoryListProps {
    onEditCategory: (categoria: CategoriaResponse) => void;
    onAddCategory?: () => void;
    refreshTrigger?: number;
}

export const CategoryList: React.FC<CategoryListProps> = ({
    onEditCategory,
    onAddCategory,
    refreshTrigger = 0,
}) => {
    const [categories, setCategories] = useState<CategoriaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: CATEGORIES_PER_PAGE,
    });
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const fetchCategories = useCallback(async (pageNum: number = 0, refresh: boolean = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            
            setError(null);

            const response: Page<CategoriaResponse> = await categoryService.listarTodas(pageNum, CATEGORIES_PER_PAGE);
            
            setCategories(response.content);
            
            setPaginationInfo({
                currentPage: response.number,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                pageSize: response.size,
            });
            
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            setError('Error al cargar las categorías');
            Alert.alert('Error', 'No se pudieron cargar las categorías');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    const searchCategoryByName = async (name: string) => {
        if (!name.trim()) {
            // Si no hay búsqueda, volver a cargar todas
            setSearchQuery('');
            setIsSearching(false);
            await fetchCategories(0, true);
            return;
        }

        try {
            setIsSearching(true);
            setLoading(true);
            setError(null);

            const category = await categoryService.obtenerPorNombre(name.trim());
            setCategories([category]);
            setPaginationInfo({
                currentPage: 0,
                totalPages: 1,
                totalElements: 1,
                pageSize: CATEGORIES_PER_PAGE,
            });
            
        } catch (error: any) {
            console.error('Error searching category:', error);
            if (error.response?.status === 404) {
                setCategories([]);
                setError(`No se encontró ninguna categoría con el nombre "${name}"`);
            } else {
                setError('Error al buscar la categoría');
            }
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    const handleSearchInput = (text: string) => {
        setSearchQuery(text);
    };

    const handleSearchPress = () => {
        if (searchQuery.trim()) {
            searchCategoryByName(searchQuery.trim());
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        searchCategoryByName('');
    };

    const handleDelete = async (id: number) => {
        try {
            await categoryService.eliminar(id);
            // Refresh the list after deletion
            if (searchQuery.trim()) {
                // Si está buscando, limpiar búsqueda y recargar
                clearSearch();
            } else {
                await fetchCategories(0, true);
            }
            Alert.alert('Éxito', 'Categoría eliminada correctamente');
        } catch (error: any) {
            console.error('Error deleting category:', error);
            Alert.alert('Error', 'No se pudo eliminar la categoría');
        }
    };

    const handlePageChange = (page: number) => {
        if (!searchQuery) {
            fetchCategories(page);
        }
    };

    const onRefresh = () => {
        fetchCategories(0, true);
    };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Refresh when trigger changes (after adding/editing)
    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchCategories(0, true);
        }
    }, [refreshTrigger, fetchCategories]);

    const renderCategory = ({ item }: { item: CategoriaResponse }) => (
        <CategoryCard
            categoria={item}
            onEdit={onEditCategory}
            onDelete={handleDelete}
        />
    );

    const renderEmpty = () => {
        if (loading) return null;
        
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📁</Text>
                <Text style={styles.emptyTitle}>No hay categorías</Text>
                <Text style={styles.emptySubtitle}>
                    Agrega tu primera categoría para comenzar
                </Text>
            </View>
        );
    };

    if (loading && categories.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando categorías...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar categoría por nombre..."
                        value={searchQuery}
                        onChangeText={handleSearchInput}
                        returnKeyType="search"
                        onSubmitEditing={handleSearchPress}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
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
                
                <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={20} color="#4CAF50" />
                </TouchableOpacity>
            </View>

            {/* Header con contador y botón agregar */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    {searchQuery 
                        ? `Búsqueda: "${searchQuery}"` 
                        : `Categorías (${paginationInfo.totalElements})`
                    }
                </Text>
                <View style={styles.headerActions}>
                    {isSearching && (
                        <ActivityIndicator size="small" color="#4CAF50" style={styles.searchingIndicator} />
                    )}
                    {onAddCategory && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={onAddCategory}
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
                    <TouchableOpacity onPress={() => fetchCategories(0, true)} style={styles.retryButton}>
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={categories}
                renderItem={renderCategory}
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
            {!searchQuery && paginationInfo.totalPages > 1 && (
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
    searchingIndicator: {
        marginLeft: 8,
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
    refreshButton: {
        padding: 8,
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