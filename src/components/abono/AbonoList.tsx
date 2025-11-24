import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { abonoService } from '../../services/abonoService';
import { AbonoResponse, EstadoAbono } from '../../types/abono';
import { Pagination, PaginationInfo } from '../common/Pagination';
import { AbonoCard } from './AbonoCard';

const ABONOS_PER_PAGE = 10;

interface AbonoListProps {
    onViewDetails?: (abonoId: number) => void;
    onAddAbono?: () => void;
    refreshTrigger?: number;
}

export const AbonoList: React.FC<AbonoListProps> = ({
    onViewDetails,
    onAddAbono,
    refreshTrigger = 0,
}) => {
    const [abonos, setAbonos] = useState<AbonoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: ABONOS_PER_PAGE,
    });
    const [error, setError] = useState<string | null>(null);

    // Estados de filtros y búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState<EstadoAbono | ''>('');

    const fetchAbonos = useCallback(async (pageNum: number = 0, refresh: boolean = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            let response;

            // Búsqueda por ID de cuenta cliente
            if (searchQuery.trim()) {
                const cuentaId = parseInt(searchQuery.trim());
                if (!isNaN(cuentaId)) {
                    if (estadoFiltro) {
                        response = await abonoService.abonosPorCuentaClienteYEstado(
                            cuentaId,
                            estadoFiltro,
                            pageNum,
                            ABONOS_PER_PAGE
                        );
                    } else {
                        response = await abonoService.abonosPorCuentaCliente(
                            cuentaId,
                            pageNum,
                            ABONOS_PER_PAGE
                        );
                    }
                } else {
                    throw new Error('ID de cuenta inválido');
                }
            } else if (estadoFiltro) {
                response = await abonoService.buscarPorEstado(
                    estadoFiltro,
                    pageNum,
                    ABONOS_PER_PAGE
                );
            } else {
                response = await abonoService.listarTodos(pageNum, ABONOS_PER_PAGE);
            }

            setAbonos(response.content);
            setPaginationInfo({
                currentPage: response.number,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                pageSize: ABONOS_PER_PAGE,
            });

        } catch (error: any) {
            console.error('Error fetching abonos:', error);
            setError('Error al cargar abonos');
            setAbonos([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setIsSearching(false);
        }
    }, [searchQuery, estadoFiltro]);

    useEffect(() => {
        fetchAbonos(0);
    }, [fetchAbonos, refreshTrigger]);

    const handleRefresh = () => {
        fetchAbonos(0, true);
    };

    const handlePageChange = (page: number) => {
        fetchAbonos(page);
    };

    const handleSearch = async () => {
        setIsSearching(true);
        await fetchAbonos(0);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setEstadoFiltro('');
        fetchAbonos(0);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No hay abonos</Text>
            <Text style={styles.emptySubtitle}>
                {searchQuery || estadoFiltro 
                    ? 'No se encontraron abonos con los filtros aplicados'
                    : 'Aún no se han registrado abonos'
                }
            </Text>
            {(searchQuery || estadoFiltro) && (
                <TouchableOpacity
                    style={styles.clearFiltersButton}
                    onPress={clearSearch}
                >
                    <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderError = () => (
        <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={80} color="#F44336" />
            <Text style={styles.errorTitle}>Error al cargar</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchAbonos(0)}
            >
                <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <View style={styles.titleContainer}>
                    <Text style={styles.listTitle}>Lista de Abonos</Text>
                    <Text style={styles.countText}>
                        {paginationInfo.totalElements} abono{paginationInfo.totalElements !== 1 ? 's' : ''}
                    </Text>
                </View>
                
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={toggleFilters}
                    >
                        <Ionicons 
                            name={showFilters ? "close" : "filter"} 
                            size={20} 
                            color="#8E44AD" 
                        />
                    </TouchableOpacity>
                    
                    {onAddAbono && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={onAddAbono}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Nuevo</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {showFilters && (
                <View style={styles.filtersContainer}>
                    {/* Búsqueda por ID de cuenta cliente */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar por ID de cuenta cliente..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
                            onPress={handleSearch}
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="search" size={18} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Filtro por Estado */}
                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>Estado:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={estadoFiltro}
                                onValueChange={(value) => {
                                    setEstadoFiltro(value);
                                    if (value !== estadoFiltro) {
                                        fetchAbonos(0);
                                    }
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="Todos" value="" />
                                <Picker.Item label="Pendiente" value={EstadoAbono.PENDIENTE} />
                                <Picker.Item label="Aplicado" value={EstadoAbono.APLICADO} />
                                <Picker.Item label="Rechazado" value={EstadoAbono.RECHAZADO} />
                            </Picker>
                        </View>
                    </View>

                    {/* Botones de acción */}
                    <View style={styles.filterActions}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearSearch}
                        >
                            <Ionicons name="refresh" size={16} color="#666" />
                            <Text style={styles.clearButtonText}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );

    if (error) {
        return (
            <View style={styles.container}>
                {renderHeader()}
                {renderError()}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={renderHeader}
                data={abonos}
                renderItem={({ item }) => (
                    <AbonoCard
                        abono={item}
                        onPress={() => onViewDetails?.(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[
                    styles.listContent,
                    abonos.length === 0 && !loading && styles.emptyContent
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#8E44AD']}
                        tintColor="#8E44AD"
                    />
                }
                ListEmptyComponent={!loading ? renderEmptyState : null}
                ListFooterComponent={() => {
                    if (loading && !refreshing) {
                        return (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#8E44AD" />
                                <Text style={styles.loadingText}>Cargando abonos...</Text>
                            </View>
                        );
                    }

                    if (paginationInfo.totalPages > 1) {
                        return (
                            <View style={styles.paginationContainer}>
                                <Pagination
                                    paginationInfo={paginationInfo}
                                    onPageChange={handlePageChange}
                                />
                            </View>
                        );
                    }

                    return null;
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    countText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#8E44AD',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8E44AD',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    filtersContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    searchButton: {
        backgroundColor: '#8E44AD',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonDisabled: {
        opacity: 0.7,
    },
    filterRow: {
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 4,
    },
    clearButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    listContent: {
        paddingBottom: 16,
    },
    emptyContent: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    clearFiltersButton: {
        backgroundColor: '#8E44AD',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    clearFiltersText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#8E44AD',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    paginationContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
});