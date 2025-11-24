import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AbonoResponse, EstadoAbono, MetodoPago } from '../../types/abono';
import { AbonosStackParamList } from '../../types/navigation';
import CustomHeader from '../CustomHeader';
import { abonoService } from '@/src/services/abonoService';

type AbonoDetalleScreenRouteProp = RouteProp<AbonosStackParamList, 'AbonoDetalle'>;
type AbonoDetalleScreenNavigationProp = StackNavigationProp<AbonosStackParamList>;

export const AdminAbonoDetalleScreen: React.FC = () => {
    const route = useRoute<AbonoDetalleScreenRouteProp>();
    const navigation = useNavigation<AbonoDetalleScreenNavigationProp>();
    const { abonoId } = route.params;

    const [abono, setAbono] = useState<AbonoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAbono();
    }, [abonoId]);

    const fetchAbono = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await abonoService.obtenerPorId(abonoId);
            setAbono(response);
        } catch (error: any) {
            console.error('Error fetching abono:', error);
            setError('Error al cargar el abono');
            Alert.alert('Error', 'No se pudo cargar la información del abono');
        } finally {
            setLoading(false);
        }
    }, [abonoId]);

    const handleAplicarAbono = useCallback(async () => {
        if (!abono || abono.estado !== EstadoAbono.PENDIENTE) return;

        Alert.alert(
            'Confirmar acción',
            '¿Está seguro que desea aplicar este abono?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Aplicar', 
                    style: 'default',
                    onPress: async () => {
                        try {
                            setActionLoading('aplicar');
                            await abonoService.aplicar(abono.id);
                            setAbono(prev => prev ? { ...prev, estado: EstadoAbono.APLICADO } : null);
                            Alert.alert('Éxito', 'El abono ha sido aplicado exitosamente');
                        } catch (error: any) {
                            console.error('Error applying abono:', error);
                            Alert.alert('Error', 'No se pudo aplicar el abono');
                        } finally {
                            setActionLoading(null);
                        }
                    }
                }
            ]
        );
    }, [abono]);

    const handleRechazarAbono = useCallback(async () => {
        if (!abono || abono.estado !== EstadoAbono.PENDIENTE) return;

        Alert.alert(
            'Confirmar acción',
            '¿Está seguro que desea rechazar este abono? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Rechazar', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading('rechazar');
                            await abonoService.rechazar(abono.id);
                            setAbono(prev => prev ? { ...prev, estado: EstadoAbono.RECHAZADO } : null);
                            Alert.alert('Éxito', 'El abono ha sido rechazado');
                        } catch (error: any) {
                            console.error('Error rejecting abono:', error);
                            Alert.alert('Error', 'No se pudo rechazar el abono');
                        } finally {
                            setActionLoading(null);
                        }
                    }
                }
            ]
        );
    }, [abono]);

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

    const getEstadoIcon = (estado: EstadoAbono) => {
        switch (estado) {
            case EstadoAbono.APLICADO:
                return 'checkmark-circle';
            case EstadoAbono.PENDIENTE:
                return 'time';
            case EstadoAbono.RECHAZADO:
                return 'close-circle';
            default:
                return 'help-circle';
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

    const getMetodoPagoColor = (metodoPago: MetodoPago) => {
        switch (metodoPago) {
            case MetodoPago.EFECTIVO:
                return '#4CAF50';
            case MetodoPago.TRANSFERENCIA:
                return '#2196F3';
            case MetodoPago.CHEQUE:
                return '#FF9800';
            case MetodoPago.OTRO:
                return '#9C27B0';
            default:
                return '#757575';
        }
    };

    const renderActionButtons = () => {
        if (!abono || abono.estado !== EstadoAbono.PENDIENTE) {
            return null;
        }

        return (
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.aplicarButton]}
                    onPress={handleAplicarAbono}
                    disabled={actionLoading !== null}
                >
                    {actionLoading === 'aplicar' ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    )}
                    <Text style={styles.actionButtonText}>Aplicar Abono</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.rechazarButton]}
                    onPress={handleRechazarAbono}
                    disabled={actionLoading !== null}
                >
                    {actionLoading === 'rechazar' ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="close-circle-outline" size={20} color="#fff" />
                    )}
                    <Text style={styles.actionButtonText}>Rechazar Abono</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <CustomHeader title="Detalle del Abono" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8E44AD" />
                    <Text style={styles.loadingText}>Cargando información del abono...</Text>
                </View>
            </View>
        );
    }

    if (error || !abono) {
        return (
            <View style={styles.container}>
                <CustomHeader title="Detalle del Abono" />
                <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={48} color="#F44336" />
                    <Text style={styles.errorText}>
                        {error || 'No se pudo cargar la información del abono'}
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchAbono}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomHeader title={`Abono #${abono.id}`} />
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Estado del abono */}
                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <Ionicons 
                            name={getEstadoIcon(abono.estado)} 
                            size={32} 
                            color={getEstadoColor(abono.estado)} 
                        />
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusTitle}>Estado del Abono</Text>
                            <View style={[styles.statusBadge, { backgroundColor: getEstadoColor(abono.estado) }]}>
                                <Text style={styles.statusText}>{abono.estado}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Información básica */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Información del Abono</Text>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ID del Abono:</Text>
                        <Text style={styles.infoValue}>#{abono.id}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Monto:</Text>
                        <Text style={[styles.infoValue, styles.montoText]}>{formatPrice(abono.monto)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Fecha del Abono:</Text>
                        <Text style={styles.infoValue}>{formatDate(abono.fechaAbono)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Método de Pago:</Text>
                        <View style={styles.metodoPagoContainer}>
                            <Ionicons 
                                name={getMetodoPagoIcon(abono.metodoPago)} 
                                size={18} 
                                color={getMetodoPagoColor(abono.metodoPago)} 
                            />
                            <Text style={[styles.metodoPagoText, { color: getMetodoPagoColor(abono.metodoPago) }]}>
                                {abono.metodoPago}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Información del cliente y usuario */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Detalles Adicionales</Text>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cuenta Cliente ID:</Text>
                        <Text style={styles.infoValue}>{abono.cuentaClienteId}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Fecha de Creación:</Text>
                        <Text style={styles.infoValue}>{formatDate(abono.createdAt)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Última Actualización:</Text>
                        <Text style={styles.infoValue}>{formatDate(abono.updatedAt)}</Text>
                    </View>
                </View>

                {/* Botones de acción */}
                {renderActionButtons()}

                {/* Información adicional según el estado */}
                {abono.estado === EstadoAbono.APLICADO && (
                    <View style={[styles.infoCard, styles.successCard]}>
                        <View style={styles.successHeader}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                            <Text style={styles.successTitle}>Abono Aplicado</Text>
                        </View>
                        <Text style={styles.successText}>
                            Este abono ha sido aplicado exitosamente a la cuenta del cliente.
                        </Text>
                    </View>
                )}

                {abono.estado === EstadoAbono.RECHAZADO && (
                    <View style={[styles.infoCard, styles.errorCard]}>
                        <View style={styles.errorHeader}>
                            <Ionicons name="close-circle" size={24} color="#F44336" />
                            <Text style={styles.errorTitle}>Abono Rechazado</Text>
                        </View>
                        <Text style={styles.errorCardText}>
                            Este abono ha sido rechazado y no se aplicará a la cuenta del cliente.
                        </Text>
                    </View>
                )}

                {abono.estado === EstadoAbono.PENDIENTE && (
                    <View style={[styles.infoCard, styles.warningCard]}>
                        <View style={styles.warningHeader}>
                            <Ionicons name="time" size={24} color="#FF9800" />
                            <Text style={styles.warningTitle}>Pendiente de Revisión</Text>
                        </View>
                        <Text style={styles.warningText}>
                            Este abono está pendiente de revisión. Use los botones de acción para aprobar o rechazar.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 60,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
        marginVertical: 16,
    },
    retryButton: {
        backgroundColor: '#8E44AD',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 6,
        marginTop: 16,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statusCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statusInfo: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
    montoText: {
        fontSize: 18,
        color: '#8E44AD',
        fontWeight: 'bold',
    },
    metodoPagoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metodoPagoText: {
        fontSize: 16,
        fontWeight: '600',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    aplicarButton: {
        backgroundColor: '#4CAF50',
    },
    rechazarButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    successCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
        backgroundColor: '#f8fff9',
    },
    successHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    successTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
    },
    successText: {
        fontSize: 14,
        color: '#2e7d32',
        lineHeight: 20,
    },
    errorCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#F44336',
        backgroundColor: '#fff8f8',
    },
    errorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F44336',
    },
    errorCardText: {
        fontSize: 14,
        color: '#c62828',
        lineHeight: 20,
    },
    warningCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
        backgroundColor: '#fffbf3',
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF9800',
    },
    warningText: {
        fontSize: 14,
        color: '#ef6c00',
        lineHeight: 20,
    },
});