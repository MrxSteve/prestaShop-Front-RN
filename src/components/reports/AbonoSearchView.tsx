import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { AbonoResponse, EstadoAbono, MetodoPago } from '../../types/abono';
import { Pagination, PaginationInfo } from '../common/Pagination';
import { abonoService } from '@/src/services/abonoService';

const ABONOS_PER_PAGE = 10;

interface AbonoSearchViewProps {
    refreshTrigger?: number;
}

type SearchType = 'fecha' | 'monto' | 'estado' | 'metodoPago' | 'cuentaCliente' | 'cuentaClienteYFecha' | 'cuentaClienteYEstado';

export const AbonoSearchView: React.FC<AbonoSearchViewProps> = ({
    refreshTrigger = 0
}) => {
    const [abonos, setAbonos] = useState<AbonoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: ABONOS_PER_PAGE,
    });

    // Search states
    const [searchType, setSearchType] = useState<SearchType>('fecha');
    const [hasSearched, setHasSearched] = useState(false);

    // Fecha search con DateTimePicker
    const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
    const [fechaFin, setFechaFin] = useState<Date>(new Date());
    const [showFechaInicioPicker, setShowFechaInicioPicker] = useState(false);
    const [showFechaFinPicker, setShowFechaFinPicker] = useState(false);

    // Monto search
    const [montoMin, setMontoMin] = useState('');
    const [montoMax, setMontoMax] = useState('');

    // Estado y método de pago search
    const [estadoAbono, setEstadoAbono] = useState<EstadoAbono | ''>('');
    const [metodoPago, setMetodoPago] = useState<MetodoPago | ''>('');

    // Cuenta cliente search
    const [cuentaClienteId, setCuentaClienteId] = useState('');

    const searchAbonos = useCallback(async (pageNum: number = 0) => {
        if (!canSearch()) return;

        try {
            setLoading(true);
            setError(null);

            let response;
            
            switch (searchType) {
                case 'fecha':
                    const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
                    const fechaFinStr = fechaFin.toISOString().split('T')[0];
                    response = await abonoService.buscarPorFecha(fechaInicioStr, fechaFinStr, pageNum, ABONOS_PER_PAGE);
                    break;
                case 'monto':
                    if (montoMin && montoMax) {
                        response = await abonoService.buscarPorRangoMonto(
                            parseFloat(montoMin), 
                            parseFloat(montoMax), 
                            pageNum, 
                            ABONOS_PER_PAGE
                        );
                    }
                    break;
                case 'estado':
                    if (estadoAbono) {
                        response = await abonoService.buscarPorEstado(estadoAbono, pageNum, ABONOS_PER_PAGE);
                    }
                    break;
                case 'metodoPago':
                    if (metodoPago) {
                        response = await abonoService.buscarPorMetodoPago(metodoPago, pageNum, ABONOS_PER_PAGE);
                    }
                    break;
                case 'cuentaCliente':
                    if (cuentaClienteId) {
                        response = await abonoService.abonosPorCuentaCliente(parseInt(cuentaClienteId), pageNum, ABONOS_PER_PAGE);
                    }
                    break;
                case 'cuentaClienteYFecha':
                    if (cuentaClienteId) {
                        const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
                        const fechaFinStr = fechaFin.toISOString().split('T')[0];
                        // Note: aún no existe este método en el servicio, sería una mejora futura
                        response = await abonoService.abonosPorCuentaCliente(parseInt(cuentaClienteId), pageNum, ABONOS_PER_PAGE);
                    }
                    break;
                case 'cuentaClienteYEstado':
                    if (cuentaClienteId && estadoAbono) {
                        response = await abonoService.abonosPorCuentaClienteYEstado(
                            parseInt(cuentaClienteId), 
                            estadoAbono, 
                            pageNum, 
                            ABONOS_PER_PAGE
                        );
                    }
                    break;
            }

            if (response) {
                setAbonos(response.content);
                setPaginationInfo({
                    currentPage: response.number,
                    totalPages: response.totalPages,
                    totalElements: response.totalElements,
                    pageSize: ABONOS_PER_PAGE,
                });
                setHasSearched(true);
            }
        } catch (error: any) {
            console.error('Error searching abonos:', error);
            setError('Error al buscar abonos');
            setAbonos([]);
        } finally {
            setLoading(false);
        }
    }, [searchType, fechaInicio, fechaFin, montoMin, montoMax, estadoAbono, metodoPago, cuentaClienteId]);

    const canSearch = () => {
        switch (searchType) {
            case 'fecha':
                return true; // fechaInicio y fechaFin siempre tienen valores (Date objects)
            case 'monto':
                return montoMin.trim() && montoMax.trim() && 
                       !isNaN(parseFloat(montoMin)) && !isNaN(parseFloat(montoMax));
            case 'estado':
                return estadoAbono !== '';
            case 'metodoPago':
                return metodoPago !== '';
            case 'cuentaCliente':
                return cuentaClienteId.trim() && !isNaN(parseInt(cuentaClienteId));
            case 'cuentaClienteYFecha':
                return cuentaClienteId.trim() && !isNaN(parseInt(cuentaClienteId));
            case 'cuentaClienteYEstado':
                return cuentaClienteId.trim() && !isNaN(parseInt(cuentaClienteId)) && estadoAbono !== '';
            default:
                return false;
        }
    };

    const handleSearch = () => {
        if (canSearch()) {
            searchAbonos(0);
        }
    };

    const handleClear = () => {
        setFechaInicio(new Date());
        setFechaFin(new Date());
        setMontoMin('');
        setMontoMax('');
        setEstadoAbono('');
        setMetodoPago('');
        setCuentaClienteId('');
        setAbonos([]);
        setHasSearched(false);
        setError(null);
        setPaginationInfo({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            pageSize: ABONOS_PER_PAGE,
        });
    };

    const handlePageChange = (page: number) => {
        searchAbonos(page);
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
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getEstadoColor = (estado: EstadoAbono) => {
        switch (estado) {
            case EstadoAbono.APLICADO:
                return '#4CAF50';
            case EstadoAbono.PENDIENTE:
                return '#FF9800';
            case EstadoAbono.RECHAZADO:
                return '#F44336';
            default:
                return '#757575';
        }
    };

    const getMetodoPagoIcon = (metodoPago: MetodoPago) => {
        switch (metodoPago) {
            case MetodoPago.EFECTIVO:
                return 'cash';
            case MetodoPago.TRANSFERENCIA:
                return 'swap-horizontal';
            case MetodoPago.CHEQUE:
                return 'document-text';
            case MetodoPago.OTRO:
                return 'wallet';
            default:
                return 'wallet';
        }
    };

    const renderAbonoItem = ({ item }: { item: AbonoResponse }) => (
        <View style={styles.abonoItem}>
            <View style={styles.abonoHeader}>
                <Text style={styles.abonoId}>Abono #{item.id}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
                    <Text style={styles.estadoText}>{item.estado}</Text>
                </View>
            </View>
            
            <View style={styles.abonoInfo}>
                <Text style={styles.abonoDate}>{formatDate(item.fechaAbono)}</Text>
                <Text style={styles.abonoCliente}>
                    Cuenta ID: {item.cuentaClienteId}
                </Text>
                <View style={styles.metodoPagoContainer}>
                    <Ionicons name={getMetodoPagoIcon(item.metodoPago)} size={14} color="#666" />
                    <Text style={styles.metodoPagoText}>{item.metodoPago}</Text>
                </View>
            </View>
            
            <View style={styles.abonoFooter}>
                <Text style={styles.abonoUsuario}>
                    Cuenta: {item.cuentaClienteId}
                </Text>
                <Text style={styles.abonoMonto}>{formatPrice(item.monto)}</Text>
            </View>
        </View>
    );

    const renderSearchForm = () => (
        <View style={styles.searchForm}>
            {/* Tipo de búsqueda */}
            <View style={styles.searchTypeContainer}>
                <Text style={styles.label}>Buscar por:</Text>
                <View style={styles.searchTypeButtons}>
                    {[
                        { key: 'fecha', label: 'Fecha' },
                        { key: 'monto', label: 'Monto' },
                        { key: 'estado', label: 'Estado' },
                        { key: 'metodoPago', label: 'Método Pago' },
                        { key: 'cuentaCliente', label: 'Cuenta Cliente' },
                        { key: 'cuentaClienteYEstado', label: 'Cliente + Estado' }
                    ].map((type) => (
                        <TouchableOpacity
                            key={type.key}
                            style={[
                                styles.searchTypeButton,
                                searchType === type.key && styles.searchTypeButtonActive
                            ]}
                            onPress={() => setSearchType(type.key as SearchType)}
                        >
                            <Text style={[
                                styles.searchTypeButtonText,
                                searchType === type.key && styles.searchTypeButtonTextActive
                            ]}>
                                {type.label}
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
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowFechaInicioPicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    {fechaInicio.toLocaleDateString('es-ES')}
                                </Text>
                                <Ionicons name="calendar" size={20} color="#666" />
                            </TouchableOpacity>
                            {showFechaInicioPicker && (
                                <DateTimePicker
                                    value={fechaInicio}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowFechaInicioPicker(false);
                                        if (selectedDate) {
                                            setFechaInicio(selectedDate);
                                        }
                                    }}
                                />
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Fecha Fin:</Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowFechaFinPicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    {fechaFin.toLocaleDateString('es-ES')}
                                </Text>
                                <Ionicons name="calendar" size={20} color="#666" />
                            </TouchableOpacity>
                            {showFechaFinPicker && (
                                <DateTimePicker
                                    value={fechaFin}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowFechaFinPicker(false);
                                        if (selectedDate) {
                                            setFechaFin(selectedDate);
                                        }
                                    }}
                                />
                            )}
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

            {searchType === 'estado' && (
                <View style={styles.formSection}>
                    <Text style={styles.label}>Estado del Abono:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={estadoAbono}
                            onValueChange={setEstadoAbono}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione un estado" value="" />
                            <Picker.Item label="Pendiente" value={EstadoAbono.PENDIENTE} />
                            <Picker.Item label="Aplicado" value={EstadoAbono.APLICADO} />
                            <Picker.Item label="Rechazado" value={EstadoAbono.RECHAZADO} />
                        </Picker>
                    </View>
                </View>
            )}

            {searchType === 'metodoPago' && (
                <View style={styles.formSection}>
                    <Text style={styles.label}>Método de Pago:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={metodoPago}
                            onValueChange={setMetodoPago}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione un método" value="" />
                            <Picker.Item label="Efectivo" value={MetodoPago.EFECTIVO} />
                            <Picker.Item label="Transferencia" value={MetodoPago.TRANSFERENCIA} />
                            <Picker.Item label="Cheque" value={MetodoPago.CHEQUE} />
                            <Picker.Item label="Otro" value={MetodoPago.OTRO} />
                        </Picker>
                    </View>
                </View>
            )}

            {searchType === 'cuentaCliente' && (
                <View style={styles.formSection}>
                    <Text style={styles.label}>ID Cuenta Cliente:</Text>
                    <TextInput
                        style={styles.input}
                        value={cuentaClienteId}
                        onChangeText={setCuentaClienteId}
                        placeholder="Ingrese ID de cuenta cliente"
                        keyboardType="numeric"
                    />
                </View>
            )}

            {searchType === 'cuentaClienteYEstado' && (
                <View style={styles.formSection}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>ID Cuenta Cliente:</Text>
                        <TextInput
                            style={styles.input}
                            value={cuentaClienteId}
                            onChangeText={setCuentaClienteId}
                            placeholder="Ingrese ID de cuenta cliente"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Estado del Abono:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={estadoAbono}
                                onValueChange={setEstadoAbono}
                                style={styles.picker}
                            >
                                <Picker.Item label="Seleccione un estado" value="" />
                                <Picker.Item label="Pendiente" value={EstadoAbono.PENDIENTE} />
                                <Picker.Item label="Aplicado" value={EstadoAbono.APLICADO} />
                                <Picker.Item label="Rechazado" value={EstadoAbono.RECHAZADO} />
                            </Picker>
                        </View>
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
            <Text style={styles.sectionTitle}>Buscar Abonos</Text>
            
            {renderSearchForm()}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {hasSearched && (
                <>
                    {abonos.length > 0 ? (
                        <View style={styles.resultsContainer}>
                            <Text style={styles.resultsTitle}>
                                Resultados ({paginationInfo.totalElements} abonos encontrados)
                            </Text>
                            <FlatList
                                data={abonos}
                                renderItem={renderAbonoItem}
                                keyExtractor={(item) => item.id.toString()}
                                showsVerticalScrollIndicator={false}
                                style={styles.resultsList}
                            />
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={48} color="#ccc" />
                            <Text style={styles.emptyText}>No se encontraron abonos</Text>
                        </View>
                    )}

                    {abonos.length > 0 && paginationInfo.totalPages > 1 && (
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
        backgroundColor: '#8E44AD',
        borderColor: '#8E44AD',
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
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
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
        backgroundColor: '#8E44AD',
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
    abonoItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingVertical: 12,
    },
    abonoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    abonoId: {
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
    abonoInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    abonoDate: {
        fontSize: 14,
        color: '#666',
    },
    abonoCliente: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        textAlign: 'center',
    },
    metodoPagoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metodoPagoText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    abonoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    abonoUsuario: {
        fontSize: 14,
        color: '#999',
    },
    abonoMonto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8E44AD',
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