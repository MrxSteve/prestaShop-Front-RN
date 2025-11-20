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
import { ventaService } from '../../services/ventaService';
import { EstadoVenta, TipoVenta, VentaFiltros, VentaResponse } from '../../types/venta';
import { Pagination, PaginationInfo } from '../common/Pagination';
import { VentaCard } from './VentaCard';

const VENTAS_PER_PAGE = 10;

interface VentaListProps {
    onViewDetails?: (ventaId: number) => void;
    onAddVenta?: () => void;
    refreshTrigger?: number;
}

export const VentaList: React.FC<VentaListProps> = ({
    onViewDetails,
    onAddVenta,
    refreshTrigger = 0,
}) => {
    const [ventas, setVentas] = useState<VentaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: VENTAS_PER_PAGE,
    });
    const [error, setError] = useState<string | null>(null);

    // Estados de filtros y búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<VentaFiltros>({});

    const fetchVentas = useCallback(async (pageNum: number = 0, refresh: boolean = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            let response;
            
            // Si hay búsqueda por cliente ocasional
            if (searchQuery.trim()) {
                response = await ventaService.buscarPorClienteOcasional(searchQuery.trim(), pageNum, VENTAS_PER_PAGE);
            }
            // Si hay filtros activos
            else if (Object.keys(filters).length > 0) {
                response = await ventaService.buscarConFiltros(filters, pageNum, VENTAS_PER_PAGE);
            }
            // Listar todas
            else {
                response = await ventaService.listarTodas(pageNum, VENTAS_PER_PAGE);
            }

            setVentas(response.content);

            setPaginationInfo({
                currentPage: response.number,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                pageSize: VENTAS_PER_PAGE,
            });
        } catch (error: any) {
            console.error('Error fetching ventas:', error);
            setError('Error al cargar las ventas');
            setVentas([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [searchQuery, filters]);

    useEffect(() => {
        fetchVentas();
    }, [fetchVentas, refreshTrigger]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            setPaginationInfo(prev => ({ ...prev, currentPage: 0 }));
            fetchVentas(0);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setFilters({});
        fetchVentas(0);
    };

    const handleFilterChange = (key: keyof VentaFiltros, value: any) => {
        const newFilters = { ...filters };
        if (value === '' || value === null || value === undefined) {
            delete newFilters[key];
        } else {
            newFilters[key] = value;
        }
        setFilters(newFilters);
        setPaginationInfo(prev => ({ ...prev, currentPage: 0 }));
        fetchVentas(0);
    };

    const handlePageChange = (page: number) => {
        fetchVentas(page);
    };

    const handleRefresh = () => {
        fetchVentas(paginationInfo.currentPage, true);
    };

    const handleMarcarPagada = async (ventaId: number) => {
        try {
            setLoading(true);
            await ventaService.marcarComoPagada(ventaId);
            Alert.alert('Éxito', 'Venta marcada como pagada');
            fetchVentas(paginationInfo.currentPage);
        } catch (error: any) {
            console.error('Error marking venta as pagada:', error);
            Alert.alert('Error', 'No se pudo marcar la venta como pagada');
        } finally {
            setLoading(false);
        }
    };

    const handleMarcarParcial = async (ventaId: number) => {
        try {
            setLoading(true);
            await ventaService.marcarComoParcial(ventaId);
            Alert.alert('Éxito', 'Venta marcada como pago parcial');
            fetchVentas(paginationInfo.currentPage);
        } catch (error: any) {
            console.error('Error marking venta as parcial:', error);
            Alert.alert('Error', 'No se pudo marcar la venta como pago parcial');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarVenta = async (ventaId: number) => {
        try {
            setLoading(true);
            await ventaService.cancelar(ventaId);
            Alert.alert('Éxito', 'Venta cancelada');
            fetchVentas(paginationInfo.currentPage);
        } catch (error: any) {
            console.error('Error cancelling venta:', error);
            Alert.alert('Error', 'No se pudo cancelar la venta');
        } finally {
            setLoading(false);
        }
    };

    const renderVentaItem = ({ item }: { item: VentaResponse }) => (
        <VentaCard
            venta={item}
            onViewDetails={onViewDetails}
            onMarcarPagada={handleMarcarPagada}
            onMarcarParcial={handleMarcarParcial}
            onCancelar={handleCancelarVenta}
        />
    );

    const renderEmpty = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Cargando ventas...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => fetchVentas(0)}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        const hasSearchOrFilters = searchQuery.trim() || Object.keys(filters).length > 0;

        return (
            <View style={styles.centerContainer}>
                <Ionicons name="receipt-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>
                    {hasSearchOrFilters ? 'No se encontraron ventas' : 'No hay ventas registradas'}
                </Text>
                {hasSearchOrFilters && (
                    <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
                        <Text style={styles.clearButtonText}>Limpiar filtros</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header con botón agregar */}
            <View style={styles.header}>
                <Text style={styles.title}>Gestión de Ventas</Text>
                {onAddVenta && (
                    <TouchableOpacity style={styles.addButton} onPress={onAddVenta}>
                        <Ionicons name="add" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Nueva Venta</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Búsqueda */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por cliente ocasional..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {(searchQuery || isSearching) && (
                        <TouchableOpacity onPress={handleClearSearch}>
                            <Ionicons name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Ionicons 
                        name={showFilters ? "options" : "options-outline"} 
                        size={20} 
                        color={showFilters ? "#4CAF50" : "#666"} 
                    />
                </TouchableOpacity>
            </View>

            {/* Filtros */}
            {showFilters && (
                <View style={styles.filtersContainer}>
                    <View style={styles.filterRow}>
                        <View style={styles.filterItem}>
                            <Text style={styles.filterLabel}>Tipo de Venta:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={filters.tipoVenta || ''}
                                    onValueChange={(value) => handleFilterChange('tipoVenta', value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Todos" value="" />
                                    <Picker.Item label="Crédito" value={TipoVenta.CREDITO} />
                                    <Picker.Item label="Contado" value={TipoVenta.CONTADO} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.filterItem}>
                            <Text style={styles.filterLabel}>Estado:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={filters.estado || ''}
                                    onValueChange={(value) => handleFilterChange('estado', value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Todos" value="" />
                                    <Picker.Item label="Pendiente" value={EstadoVenta.PENDIENTE} />
                                    <Picker.Item label="Pagada" value={EstadoVenta.PAGADA} />
                                    <Picker.Item label="Parcial" value={EstadoVenta.PARCIAL} />
                                    <Picker.Item label="Cancelada" value={EstadoVenta.CANCELADA} />
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Lista de ventas */}
            <FlatList
                data={ventas}
                renderItem={renderVentaItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={ventas.length === 0 ? styles.emptyContainer : undefined}
            />

            {/* Paginación */}
            {ventas.length > 0 && (
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        gap: 12,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    filtersContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 12,
    },
    filterItem: {
        flex: 1,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    picker: {
        height: 45,
        color: '#333',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    clearButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    clearButtonText: {
        color: '#666',
        fontSize: 14,
    },
    emptyContainer: {
        flexGrow: 1,
    },
});