import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ventaService } from '../../services/ventaService';
import { EstadoVenta, TipoVenta, VentaResponse } from '../../types/venta';
import { Pagination, PaginationInfo } from '../common/Pagination';

const VENTAS_PER_PAGE = 10;

interface VentaSearchViewProps {
    refreshTrigger?: number;
}

type SearchType = 'fecha' | 'monto' | 'tipo' | 'estado';

export const VentaSearchView: React.FC<VentaSearchViewProps> = ({
    refreshTrigger = 0
}) => {
    const [ventas, setVentas] = useState<VentaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: VENTAS_PER_PAGE,
    });

    // Search states
    const [searchType, setSearchType] = useState<SearchType>('fecha');
    const [hasSearched, setHasSearched] = useState(false);

    // Fecha search
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Monto search
    const [montoMin, setMontoMin] = useState('');
    const [montoMax, setMontoMax] = useState('');

    // Tipo y estado search
    const [tipoVenta, setTipoVenta] = useState<TipoVenta | ''>('');
    const [estadoVenta, setEstadoVenta] = useState<EstadoVenta | ''>('');

    const searchVentas = useCallback(async (pageNum: number = 0) => {
        if (!canSearch()) return;

        try {
            setLoading(true);
            setError(null);

            let response;
            
            switch (searchType) {
                case 'fecha':
                    if (fechaInicio && fechaFin) {
                        response = await ventaService.buscarPorFecha(fechaInicio, fechaFin, pageNum, VENTAS_PER_PAGE);
                    }
                    break;
                case 'monto':
                    if (montoMin && montoMax) {
                        response = await ventaService.buscarPorRangoMonto(
                            parseFloat(montoMin), 
                            parseFloat(montoMax), 
                            pageNum, 
                            VENTAS_PER_PAGE
                        );
                    }
                    break;
                case 'tipo':
                    if (tipoVenta) {
                        response = await ventaService.buscarPorTipo(tipoVenta, pageNum, VENTAS_PER_PAGE);
                    }
                    break;
                case 'estado':
                    if (estadoVenta) {
                        response = await ventaService.buscarPorEstado(estadoVenta, pageNum, VENTAS_PER_PAGE);
                    }
                    break;
            }

            if (response) {
                setVentas(response.content);
                setPaginationInfo({
                    currentPage: response.number,
                    totalPages: response.totalPages,
                    totalElements: response.totalElements,
                    pageSize: VENTAS_PER_PAGE,
                });
                setHasSearched(true);
            }
        } catch (error: any) {
            console.error('Error searching ventas:', error);
            setError('Error al buscar ventas');
            setVentas([]);
        } finally {
            setLoading(false);
        }
    }, [searchType, fechaInicio, fechaFin, montoMin, montoMax, tipoVenta, estadoVenta]);

    const canSearch = () => {
        switch (searchType) {
            case 'fecha':
                return fechaInicio.trim() && fechaFin.trim();
            case 'monto':
                return montoMin.trim() && montoMax.trim() && 
                       !isNaN(parseFloat(montoMin)) && !isNaN(parseFloat(montoMax));
            case 'tipo':
                return tipoVenta !== '';
            case 'estado':
                return estadoVenta !== '';
            default:
                return false;
        }
    };

    const handleSearch = () => {
        if (canSearch()) {
            searchVentas(0);
        }
    };

    const handleClear = () => {
        setFechaInicio('');
        setFechaFin('');
        setMontoMin('');
        setMontoMax('');
        setTipoVenta('');
        setEstadoVenta('');
        setVentas([]);
        setHasSearched(false);
        setError(null);
        setPaginationInfo({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            pageSize: VENTAS_PER_PAGE,
        });
    };

    const handlePageChange = (page: number) => {
        searchVentas(page);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    const getEstadoColor = (estado: EstadoVenta) => {
        switch (estado) {
            case EstadoVenta.PAGADA:
                return '#4CAF50';
            case EstadoVenta.PARCIAL:
                return '#FF9800';
            case EstadoVenta.PENDIENTE:
                return '#2196F3';
            case EstadoVenta.CANCELADA:
                return '#F44336';
            default:
                return '#757575';
        }
    };

    const renderVentaItem = ({ item }: { item: VentaResponse }) => (
        <View style={styles.ventaItem}>
            <View style={styles.ventaHeader}>
                <Text style={styles.ventaId}>Venta #{item.id}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
                    <Text style={styles.estadoText}>{item.estado}</Text>
                </View>
            </View>
            
            <View style={styles.ventaInfo}>
                <Text style={styles.ventaDate}>{formatDate(item.fechaVenta)}</Text>
                <Text style={styles.ventaCliente}>
                    {item.clienteOcasional || `Cliente ID: ${item.cuentaClienteId}`}
                </Text>
                <Text style={styles.ventaTipo}>{item.tipoVenta}</Text>
            </View>
            
            <View style={styles.ventaFooter}>
                <Text style={styles.ventaProductos}>
                    {item.detalleVentas.length} producto(s)
                </Text>
                <Text style={styles.ventaTotal}>{formatPrice(item.total)}</Text>
            </View>
        </View>
    );

    const renderSearchForm = () => (
        <View style={styles.searchForm}>
            {/* Tipo de búsqueda */}
            <View style={styles.searchTypeContainer}>
                <Text style={styles.label}>Buscar por:</Text>
                <View style={styles.searchTypeButtons}>
                    {(['fecha', 'monto', 'tipo', 'estado'] as SearchType[]).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.searchTypeButton,
                                searchType === type && styles.searchTypeButtonActive
                            ]}
                            onPress={() => setSearchType(type)}
                        >
                            <Text style={[
                                styles.searchTypeButtonText,
                                searchType === type && styles.searchTypeButtonTextActive
                            ]}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Formularios específicos */}
            {searchType === 'fecha' && (
                <View style={styles.formSection}>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Fecha Inicio:</Text>
                            <TextInput
                                style={styles.input}
                                value={fechaInicio}
                                onChangeText={setFechaInicio}
                                placeholder="YYYY-MM-DD"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Fecha Fin:</Text>
                            <TextInput
                                style={styles.input}
                                value={fechaFin}
                                onChangeText={setFechaFin}
                                placeholder="YYYY-MM-DD"
                            />
                        </View>
                    </View>
                </View>
            )}

            {searchType === 'monto' && (
                <View style={styles.formSection}>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Monto Mínimo:</Text>
                            <TextInput
                                style={styles.input}
                                value={montoMin}
                                onChangeText={setMontoMin}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Monto Máximo:</Text>
                            <TextInput
                                style={styles.input}
                                value={montoMax}
                                onChangeText={setMontoMax}
                                placeholder="1000.00"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>
            )}

            {searchType === 'tipo' && (
                <View style={styles.formSection}>
                    <Text style={styles.label}>Tipo de Venta:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={tipoVenta}
                            onValueChange={setTipoVenta}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione un tipo" value="" />
                            <Picker.Item label="Crédito" value={TipoVenta.CREDITO} />
                            <Picker.Item label="Contado" value={TipoVenta.CONTADO} />
                        </Picker>
                    </View>
                </View>
            )}

            {searchType === 'estado' && (
                <View style={styles.formSection}>
                    <Text style={styles.label}>Estado de Venta:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={estadoVenta}
                            onValueChange={setEstadoVenta}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione un estado" value="" />
                            <Picker.Item label="Pendiente" value={EstadoVenta.PENDIENTE} />
                            <Picker.Item label="Pagada" value={EstadoVenta.PAGADA} />
                            <Picker.Item label="Parcial" value={EstadoVenta.PARCIAL} />
                            <Picker.Item label="Cancelada" value={EstadoVenta.CANCELADA} />
                        </Picker>
                    </View>
                </View>
            )}

            {/* Botones de acción */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.clearButton]}
                    onPress={handleClear}
                >
                    <Ionicons name="refresh-outline" size={18} color="#666" />
                    <Text style={styles.clearButtonText}>Limpiar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.actionButton, styles.searchButton, !canSearch() && styles.disabledButton]}
                    onPress={handleSearch}
                    disabled={!canSearch() || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="search-outline" size={18} color="#fff" />
                    )}
                    <Text style={styles.searchButtonText}>Buscar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Buscar Ventas</Text>
            
            {renderSearchForm()}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {hasSearched && (
                <>
                    {ventas.length > 0 ? (
                        <View style={styles.resultsContainer}>
                            <Text style={styles.resultsTitle}>
                                Resultados ({paginationInfo.totalElements} ventas encontradas)
                            </Text>
                            <FlatList
                                data={ventas}
                                renderItem={renderVentaItem}
                                keyExtractor={(item) => item.id.toString()}
                                showsVerticalScrollIndicator={false}
                                style={styles.resultsList}
                            />
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={48} color="#ccc" />
                            <Text style={styles.emptyText}>No se encontraron ventas</Text>
                        </View>
                    )}

                    {ventas.length > 0 && paginationInfo.totalPages > 1 && (
                        <Pagination
                            paginationInfo={paginationInfo}
                            onPageChange={handlePageChange}
                            loading={loading}
                            mode="compact"
                        />
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    searchForm: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchTypeContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    searchTypeButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    searchTypeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    searchTypeButtonActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    searchTypeButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    searchTypeButtonTextActive: {
        color: '#fff',
    },
    formSection: {
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 6,
        gap: 8,
    },
    clearButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    clearButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    searchButton: {
        backgroundColor: '#007bff',
    },
    searchButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    errorContainer: {
        backgroundColor: '#ffe6e6',
        borderRadius: 6,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
        textAlign: 'center',
    },
    resultsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    resultsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    resultsList: {
        maxHeight: 400,
    },
    ventaItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingVertical: 12,
    },
    ventaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    ventaId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    estadoBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    estadoText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    ventaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    ventaDate: {
        fontSize: 14,
        color: '#666',
    },
    ventaCliente: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        textAlign: 'center',
    },
    ventaTipo: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    ventaFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ventaProductos: {
        fontSize: 14,
        color: '#999',
    },
    ventaTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        textAlign: 'center',
    },
});