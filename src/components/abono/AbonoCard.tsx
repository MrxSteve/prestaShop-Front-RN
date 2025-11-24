import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AbonoResponse, EstadoAbono, MetodoPago } from '../../types/abono';

interface AbonoCardProps {
    abono: AbonoResponse;
    onPress?: () => void;
    onAplicar?: (abonoId: number) => void;
    onRechazar?: (abonoId: number) => void;
}

export const AbonoCard: React.FC<AbonoCardProps> = ({
    abono,
    onPress,
    onAplicar,
    onRechazar,
}) => {
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

    const getEstadoText = (estado: EstadoAbono) => {
        switch (estado) {
            case EstadoAbono.APLICADO:
                return 'Aplicado';
            case EstadoAbono.PENDIENTE:
                return 'Pendiente';
            case EstadoAbono.RECHAZADO:
                return 'Rechazado';
            default:
                return estado;
        }
    };

    const getMetodoPagoText = (metodoPago: MetodoPago) => {
        switch (metodoPago) {
            case MetodoPago.EFECTIVO:
                return 'Efectivo';
            case MetodoPago.TRANSFERENCIA:
                return 'Transferencia';
            case MetodoPago.CHEQUE:
                return 'Cheque';
            case MetodoPago.OTRO:
                return 'Otro';
            default:
                return metodoPago;
        }
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

    const handleAplicar = () => {
        Alert.alert(
            'Aplicar Abono',
            `¿Está seguro que desea aplicar el abono de ${formatPrice(abono.monto)}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Aplicar',
                    style: 'default',
                    onPress: () => onAplicar?.(abono.id)
                }
            ]
        );
    };

    const handleRechazar = () => {
        Alert.alert(
            'Rechazar Abono',
            `¿Está seguro que desea rechazar el abono de ${formatPrice(abono.monto)}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Rechazar',
                    style: 'destructive',
                    onPress: () => onRechazar?.(abono.id)
                }
            ]
        );
    };

    const showActions = abono.estado === EstadoAbono.PENDIENTE && (onAplicar || onRechazar);

    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.idContainer}>
                            <Text style={styles.idLabel}>ID</Text>
                            <Text style={styles.idText}>{abono.id}</Text>
                        </View>
                        <View style={styles.fechaContainer}>
                            <Ionicons name="calendar-outline" size={14} color="#666" />
                            <Text style={styles.fechaText}>
                                {formatDate(abono.fechaAbono)}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={[
                        styles.estadoBadge,
                        { backgroundColor: getEstadoColor(abono.estado) }
                    ]}>
                        <Ionicons 
                            name={getEstadoIcon(abono.estado) as any} 
                            size={14} 
                            color="#fff" 
                        />
                        <Text style={styles.estadoText}>
                            {getEstadoText(abono.estado)}
                        </Text>
                    </View>
                </View>

                {/* Body */}
                <View style={styles.body}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Cuenta Cliente</Text>
                            <Text style={styles.infoValue}>ID: {abono.cuentaClienteId}</Text>
                        </View>
                        
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Monto</Text>
                            <Text style={[styles.infoValue, styles.montoText]}>
                                {formatPrice(abono.monto)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.metodoPagoContainer}>
                        <Ionicons 
                            name={getMetodoPagoIcon(abono.metodoPago) as any} 
                            size={16} 
                            color={getMetodoPagoColor(abono.metodoPago)} 
                        />
                        <Text style={styles.metodoPagoText}>
                            {getMetodoPagoText(abono.metodoPago)}
                        </Text>
                    </View>

                    {abono.observaciones && (
                        <View style={styles.observacionesContainer}>
                            <Ionicons name="document-text-outline" size={14} color="#666" />
                            <Text style={styles.observacionesText} numberOfLines={2}>
                                {abono.observaciones}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Footer con acciones (solo para abonos pendientes) */}
                {showActions && (
                    <View style={styles.footer}>
                        {onRechazar && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.rechazarButton]}
                                onPress={handleRechazar}
                            >
                                <Ionicons name="close" size={16} color="#F44336" />
                                <Text style={styles.rechazarButtonText}>Rechazar</Text>
                            </TouchableOpacity>
                        )}
                        
                        {onAplicar && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.aplicarButton]}
                                onPress={handleAplicar}
                            >
                                <Ionicons name="checkmark" size={16} color="#4CAF50" />
                                <Text style={styles.aplicarButtonText}>Aplicar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Indicador de vista de detalles */}
                {onPress && (
                    <View style={styles.chevronContainer}>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    idLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8E44AD',
        marginRight: 4,
    },
    idText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    fechaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    fechaText: {
        fontSize: 13,
        color: '#666',
    },
    estadoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    estadoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    body: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    montoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8E44AD',
    },
    metodoPagoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metodoPagoText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    observacionesContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        backgroundColor: '#f8f9fa',
        padding: 8,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#dee2e6',
    },
    observacionesText: {
        flex: 1,
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 4,
    },
    rechazarButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F44336',
    },
    rechazarButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F44336',
    },
    aplicarButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    aplicarButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4CAF50',
    },
    chevronContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
});