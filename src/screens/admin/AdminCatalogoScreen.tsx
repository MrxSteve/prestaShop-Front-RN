import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { categoryService } from '../../services/categoryService';
import { productoService } from '../../services/productoService';
import { CatalogStats } from '../../types/catalog';

const { width } = Dimensions.get('window');

export default function AdminCatalogoScreen() {
    const navigation = useNavigation();
    const [stats, setStats] = useState<CatalogStats>({
        totalProductos: 0,
        totalCategorias: 0,
        productosActivos: 0,
        productosSinStock: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadStats = useCallback(async () => {
        try {
            // Cargar estadísticas reales de categorías y productos
            const [categoriesResponse, productStats] = await Promise.all([
                categoryService.listarTodas(0, 1), // Solo necesitamos el conteo
                productoService.obtenerEstadisticas(),
            ]);
            
            setStats({
                totalProductos: productStats.totalProductos,
                totalCategorias: categoriesResponse.totalElements,
                productosActivos: productStats.productosDisponibles,
                productosSinStock: productStats.productosNoDisponibles + productStats.productosDescontinuados,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
            // Usar datos mock en caso de error
            setStats({
                totalProductos: 0,
                totalCategorias: 0,
                productosActivos: 0,
                productosSinStock: 0,
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const onRefresh = () => {
        setRefreshing(true);
        loadStats();
    };

    const navigateToCategories = () => {
        // @ts-ignore
        navigation.navigate('CategoryManagement');
    };

    const navigateToProducts = () => {
        // @ts-ignore
        navigation.navigate('ProductManagement');
    };

    const handleComingSoon = (feature: string) => {
        Alert.alert('Próximamente', `${feature} estará disponible en la próxima versión`);
    };

    const estadisticas = [
        { titulo: 'Total Productos', valor: stats.totalProductos.toString(), icono: '📦', color: '#2196F3' },
        { titulo: 'Categorías', valor: stats.totalCategorias.toString(), icono: '🏷️', color: '#4CAF50' },
        { titulo: 'Productos Activos', valor: stats.productosActivos.toString(), icono: '✅', color: '#FF9800' }
    ];

    const gestionOpciones = [
        {
            titulo: 'Gestión de Productos',
            descripcion: 'Crear, editar y eliminar productos',
            icono: '📦',
            color: '#2196F3',
            acciones: ['Agregar Producto', 'Ver Lista', 'Editar', 'Eliminar'],
            onPress: navigateToProducts
        },
        {
            titulo: 'Gestión de Categorías',
            descripcion: 'Administrar categorías de productos',
            icono: '🏷️',
            color: '#4CAF50',
            acciones: ['Nueva Categoría', 'Ver Categorías', 'Editar', 'Eliminar'],
            onPress: navigateToCategories
        },
    ];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando catálogo...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomHeader title="Catálogo" />
            <ScrollView 
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Administra productos y categorías</Text>
                </View>

            {/* Estadísticas rápidas */}
            <View style={styles.statsContainer}>
                {estadisticas.map((stat, index) => (
                    <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
                        <Text style={styles.statIcon}>{stat.icono}</Text>
                        <View style={styles.statInfo}>
                            <Text style={[styles.statValue, { color: stat.color }]}>{stat.valor}</Text>
                            <Text style={styles.statTitle}>{stat.titulo}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Acciones rápidas */}
            <View style={styles.quickActionsSection}>
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={navigateToProducts}
                    >
                        <Text style={styles.quickActionIcon}>➕</Text>
                        <Text style={styles.quickActionText}>Nuevo Producto</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={navigateToCategories}
                    >
                        <Text style={styles.quickActionIcon}>🏷️</Text>
                        <Text style={styles.quickActionText}>Nueva Categoría</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={navigateToCategories}
                    >
                        <Text style={styles.quickActionIcon}>👁️</Text>
                        <Text style={styles.quickActionText}>Ver Categorías</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={navigateToProducts}
                    >
                        <Text style={styles.quickActionIcon}>📋</Text>
                        <Text style={styles.quickActionText}>Ver Productos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={navigateToProducts}
                    >
                        <Text style={styles.quickActionIcon}>🔍</Text>
                        <Text style={styles.quickActionText}>Buscar Productos</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Opciones de gestión */}
            <View style={styles.gestionSection}>
                <Text style={styles.sectionTitle}>Opciones de Gestión</Text>
                {gestionOpciones.map((opcion, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.gestionCard}
                        onPress={opcion.onPress}
                    >
                        <View style={styles.gestionHeader}>
                            <View style={styles.gestionIconContainer}>
                                <Text style={styles.gestionIcon}>{opcion.icono}</Text>
                            </View>
                            <View style={styles.gestionInfo}>
                                <Text style={styles.gestionTitulo}>{opcion.titulo}</Text>
                                <Text style={styles.gestionDescripcion}>{opcion.descripcion}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.accionesContainer}>
                            {opcion.acciones.map((accion, accionIndex) => (
                                <View
                                    key={accionIndex}
                                    style={[styles.accionBadge, { borderColor: opcion.color }]}
                                >
                                    <Text style={[styles.accionText, { color: opcion.color }]}>
                                        {accion}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Productos recientes */}
            <View style={styles.recentSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Productos Recientes</Text>
                    <TouchableOpacity onPress={() => handleComingSoon('Ver todos los productos')}>
                        <Text style={styles.viewAllText}>Ver todos</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Reportes y análisis */}
            <View style={styles.reportsSection}>
                <Text style={styles.sectionTitle}>Reportes y Análisis</Text>
                
                <TouchableOpacity 
                    style={styles.reportButton}
                    onPress={() => handleComingSoon('Reportes')}
                >
                    <Text style={styles.reportIcon}>📈</Text>
                    <View style={styles.reportInfo}>
                        <Text style={styles.reportTitle}>Productos Más Vendidos</Text>
                        <Text style={styles.reportDescription}>Ver ranking de productos</Text>
                    </View>
                    <Text style={styles.reportArrow}>›</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        padding: 20,
        paddingTop: 10,
    },
    subtitle: {
        fontSize: 20,
        color: '#666',
        textAlign: 'center',
    },
    statsContainer: {
        padding: 15,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderLeftWidth: 4,
        elevation: 2,
    },
    statIcon: {
        fontSize: 32,
        marginRight: 15,
    },
    statInfo: {
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statTitle: {
        fontSize: 14,
        color: '#666',
    },
    quickActionsSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    quickAction: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        width: (width - 60) / 3,
        elevation: 2,
    },
    quickActionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    gestionSection: {
        padding: 15,
    },
    gestionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
    },
    gestionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    gestionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    gestionIcon: {
        fontSize: 24,
    },
    gestionInfo: {
        flex: 1,
    },
    gestionTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    gestionDescripcion: {
        fontSize: 14,
        color: '#666',
    },
    accionesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    accionBadge: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    accionText: {
        fontSize: 12,
        fontWeight: '600',
    },
    recentSection: {
        padding: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    viewAllText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 2,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    productCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    productDate: {
        fontSize: 12,
        color: '#999',
    },
    productDetails: {
        alignItems: 'flex-end',
        marginRight: 10,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 5,
    },
    stockBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    stockText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    editButton: {
        padding: 10,
    },
    editButtonText: {
        fontSize: 18,
    },
    reportsSection: {
        padding: 15,
        paddingBottom: 30,
    },
    reportButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 2,
    },
    reportIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    reportInfo: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    reportDescription: {
        fontSize: 14,
        color: '#666',
    },
    reportArrow: {
        fontSize: 24,
        color: '#ccc',
    },
});