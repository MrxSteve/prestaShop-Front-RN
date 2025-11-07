import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { categoryService } from '../../services/categoryService';
import { productoService } from '../../services/productoService';
import { CategoriaResponse } from '../../types/catalog';
import { ProductoResponse } from '../../types/producto';

import { CatalogStackParamList } from '../../types/navigation';

type AdminReportesScreenNavigationProp = StackNavigationProp<CatalogStackParamList>;

interface StatsCard {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
}

const AdminReportesScreen: React.FC = () => {
    const navigation = useNavigation<AdminReportesScreenNavigationProp>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [productos, setProductos] = useState<ProductoResponse[]>([]);
    const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'stats' | 'category' | 'search'>('stats');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productosRes, categoriasRes] = await Promise.all([
                productoService.listarTodos(0, 1000), // Obtener todos para estadísticas
                categoryService.listarTodasSinPaginacion(),
            ]);
            setProductos(productosRes.content);
            setCategorias(categoriasRes);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'No se pudieron cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    // Calcular estadísticas (temporalmente simplificado)
    const stats = useMemo(() => {
        if (!productos.length) return [];

        const total = productos.length;
        // TODO: Unificar tipos ProductoResponse para calcular estadísticas correctamente
        
        return [
            {
                title: 'Total Productos',
                value: total,
                icon: 'cube-outline',
                color: '#4CAF50',
                subtitle: `${categorias.length} categorías`
            },
            {
                title: 'Categorías',
                value: categorias.length,
                icon: 'folder-outline',
                color: '#2196F3',
                subtitle: 'Total disponibles'
            },
            {
                title: 'En desarrollo',
                value: 'Pronto',
                icon: 'construct-outline',
                color: '#FF9800',
                subtitle: 'Más estadísticas'
            },
        ];
    }, [productos, categorias]);

    const handleEditProduct = (producto: any) => {
        // Implementar navegación a edición
        console.log('Edit product:', producto.id);
    };

    const handleViewProductDetails = (productId: number) => {
        navigation.navigate('ProductoDetalle', { productId });
    };

    const handleCategoryPress = (categoryId: number) => {
        setSelectedCategory(categoryId);
        setViewMode('category');
    };

    const renderStatsCard = (stat: StatsCard, index: number) => (
        <View key={index} style={[styles.statsCard, { borderLeftColor: stat.color }]}>
            <View style={styles.statsHeader}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                <Text style={styles.statsTitle}>{stat.title}</Text>
            </View>
            <Text style={styles.statsValue}>{stat.value}</Text>
            {stat.subtitle && (
                <Text style={styles.statsSubtitle}>{stat.subtitle}</Text>
            )}
        </View>
    );

    const renderCategoryCard = (categoria: CategoriaResponse) => {
        const productosEnCategoria = productos.filter(p => p.categoria.id === categoria.id).length;
        
        return (
            <TouchableOpacity
                key={categoria.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(categoria.id)}
            >
                <View style={styles.categoryHeader}>
                    <Ionicons name="folder-outline" size={20} color="#4CAF50" />
                    <Text style={styles.categoryName}>{categoria.nombre}</Text>
                </View>
                <Text style={styles.categoryCount}>{productosEnCategoria} productos</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando reportes...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header con navegación */}
            <View style={styles.header}>
                <Text style={styles.title}>Reportes y Análisis</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, viewMode === 'stats' && styles.activeTab]}
                        onPress={() => setViewMode('stats')}
                    >
                        <Ionicons 
                            name="analytics-outline" 
                            size={16} 
                            color={viewMode === 'stats' ? '#fff' : '#666'} 
                        />
                        <Text style={[styles.tabText, viewMode === 'stats' && styles.activeTabText]}>
                            Estadísticas
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.tab, viewMode === 'category' && styles.activeTab]}
                        onPress={() => setViewMode('category')}
                    >
                        <Ionicons 
                            name="folder-outline" 
                            size={16} 
                            color={viewMode === 'category' ? '#fff' : '#666'} 
                        />
                        <Text style={[styles.tabText, viewMode === 'category' && styles.activeTabText]}>
                            Por Categoría
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.tab, viewMode === 'search' && styles.activeTab]}
                        onPress={() => setViewMode('search')}
                    >
                        <Ionicons 
                            name="search-outline" 
                            size={16} 
                            color={viewMode === 'search' ? '#fff' : '#666'} 
                        />
                        <Text style={[styles.tabText, viewMode === 'search' && styles.activeTabText]}>
                            Búsqueda Avanzada
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Contenido según el modo */}
            {viewMode === 'stats' && (
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
                    <View style={styles.statsGrid}>
                        {stats.map(renderStatsCard)}
                    </View>

                    <Text style={styles.sectionTitle}>Categorías</Text>
                    <View style={styles.categoriesContainer}>
                        {categorias.map(renderCategoryCard)}
                    </View>
                </View>
            )}

            {viewMode === 'category' && (
                <View style={styles.categoryView}>
                    {selectedCategory ? (
                        <View>
                            <View style={styles.categoryViewHeader}>
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => setSelectedCategory(null)}
                                >
                                    <Ionicons name="arrow-back" size={20} color="#4CAF50" />
                                    <Text style={styles.backButtonText}>Volver</Text>
                                </TouchableOpacity>
                                <Text style={styles.categoryViewTitle}>
                                    {categorias.find(c => c.id === selectedCategory)?.nombre}
                                </Text>
                            </View>
                            
                                            <Text style={styles.sectionTitle}>Productos en esta categoría</Text>
                            {/* TODO: Implementar ProductList filtrado por categoría */}
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.sectionTitle}>Seleccionar Categoría</Text>
                            <View style={styles.categoriesContainer}>
                                {categorias.map(renderCategoryCard)}
                            </View>
                        </View>
                    )}
                </View>
            )}

            {viewMode === 'search' && (
                <View style={styles.searchView}>
                    <Text style={styles.sectionTitle}>Búsqueda Avanzada de Productos</Text>
                    <Text style={styles.sectionTitle}>Búsqueda y filtros avanzados</Text>
                    {/* TODO: Implementar búsqueda avanzada */}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
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
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 2,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 6,
        gap: 4,
    },
    activeTab: {
        backgroundColor: '#4CAF50',
    },
    tabText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        margin: 20,
        marginBottom: 15,
    },
    statsContainer: {
        paddingBottom: 20,
    },
    statsGrid: {
        paddingHorizontal: 20,
        gap: 15,
    },
    statsCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    statsTitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    statsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statsSubtitle: {
        fontSize: 12,
        color: '#999',
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    categoryCount: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    categoryView: {
        flex: 1,
    },
    categoryViewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        gap: 15,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    backButtonText: {
        color: '#4CAF50',
        fontWeight: '500',
    },
    categoryViewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    searchView: {
        flex: 1,
    },
});

export default AdminReportesScreen;