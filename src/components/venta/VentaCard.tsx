import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EstadoVenta, TipoVenta, VentaResponse } from '../../types/venta';

interface VentaCardProps {
    venta: VentaResponse;
    onViewDetails?: (ventaId: number) => void;
    onMarcarPagada?: (ventaId: number) => void;
    onMarcarParcial?: (ventaId: number) => void;
    onCancelar?: (ventaId: number) => void;
}

export const VentaCard: React.FC<VentaCardProps> = ({
    venta,
    onViewDetails,
    onMarcarPagada,
    onMarcarParcial,
    onCancelar,
}) => {
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

    const getTipoVentaColor = (tipo: TipoVenta) => {
        return tipo === TipoVenta.CREDITO ? '#9C27B0' : '#607D8B';
    };

    const getEstadoText = (estado: EstadoVenta) => {
        switch (estado) {
            case EstadoVenta.PAGADA:
                return 'Pagada';
            case EstadoVenta.PARCIAL:
                return 'Pago Parcial';
            case EstadoVenta.PENDIENTE:
                return 'Pendiente';
            case EstadoVenta.CANCELADA:
                return 'Cancelada';
            default:
                return estado;
        }
    };

    const getTipoVentaText = (tipo: TipoVenta) => {
        return tipo === TipoVenta.CREDITO ? 'Crédito' : 'Contado';
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

    const handleMarcarPagada = () => {
        Alert.alert(
            'Confirmar acción',
            '¿Deseas marcar esta venta como pagada?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => onMarcarPagada?.(venta.id) },
            ]
        );
    };

    const handleMarcarParcial = () => {
        Alert.alert(
            'Confirmar acción',
            '¿Deseas marcar esta venta como pago parcial?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => onMarcarParcial?.(venta.id) },
            ]
        );
    };

    const handleCancelar = () => {
        Alert.alert(
            'Cancelar Venta',
            '¿Estás seguro de que deseas cancelar esta venta? Esta acción no se puede deshacer.',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Sí, cancelar', style: 'destructive', onPress: () => onCancelar?.(venta.id) },
            ]
        );
    };

    const canModifyStatus = venta.estado === EstadoVenta.PENDIENTE || venta.estado === EstadoVenta.PARCIAL;
    const canCancel = venta.estado !== EstadoVenta.CANCELADA && venta.estado !== EstadoVenta.PAGADA;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onViewDetails ? () => onViewDetails(venta.id) : undefined}
            activeOpacity={onViewDetails ? 0.7 : 1}
        >
            <View style={styles.header}>
                <View style={styles.leftHeader}>
                    <Text style={styles.ventaId}>Venta #{venta.id}</Text>
                    <Text style={styles.fechaVenta}>{formatDate(venta.fechaVenta)}</Text>
                </View>
                <View style={styles.rightHeader}>
                    <View style={[styles.tipoVentaBadge, { backgroundColor: getTipoVentaColor(venta.tipoVenta) }]}>
                        <Text style={styles.tipoVentaText}>
                            {getTipoVentaText(venta.tipoVenta)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.clienteInfo}>
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text style={styles.clienteText}>
                    {venta.clienteOcasional || `Cliente ID: ${venta.cuentaClienteId}`}
                </Text>
            </View>

            <View style={styles.productosInfo}>
                <Ionicons name="list-outline" size={16} color="#666" />
                <Text style={styles.productosText}>
                    {venta.detalleVentas.length} producto(s)
                </Text>
                <View style={styles.productosPreview}>
                    {venta.detalleVentas.slice(0, 2).map((detalle, index) => (
                        <Text key={detalle.id} style={styles.productoName} numberOfLines={1}>
                            • {detalle.nombreProducto} x{detalle.cantidad}
                        </Text>
                    ))}
                    {venta.detalleVentas.length > 2 && (
                        <Text style={styles.masProductos}>
                            +{venta.detalleVentas.length - 2} más
                        </Text>
                    )}
                </View>
            </View>

            {venta.observaciones && (
                <View style={styles.observaciones}>
                    <Ionicons name="chatbox-outline" size={16} color="#666" />
                    <Text style={styles.observacionesText} numberOfLines={2}>
                        {venta.observaciones}
                    </Text>
                </View>
            )}

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>{formatPrice(venta.total)}</Text>
                </View>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(venta.estado) }]}>
                    <Text style={styles.estadoText}>
                        {getEstadoText(venta.estado)}
                    </Text>
                </View>
            </View>

            {(canModifyStatus || canCancel) && (
                <View style={styles.actions}>
                    {canModifyStatus && onMarcarPagada && venta.estado !== EstadoVenta.PAGADA && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.pagarButton]}
                            onPress={handleMarcarPagada}
                        >
                            <Ionicons name="checkmark-outline" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>Pagada</Text>
                        </TouchableOpacity>
                    )}
                    
                    {canModifyStatus && onMarcarParcial && venta.estado === EstadoVenta.PENDIENTE && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.parcialButton]}
                            onPress={handleMarcarParcial}
                        >
                            <Ionicons name="time-outline" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>Parcial</Text>
                        </TouchableOpacity>
                    )}
                    
                    {canCancel && onCancelar && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelarButton]}
                            onPress={handleCancelar}
                        >
                            <Ionicons name="close-outline" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    leftHeader: {
        flex: 1,
    },
    rightHeader: {
        alignItems: 'flex-end',
    },
    ventaId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    fechaVenta: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    tipoVentaBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tipoVentaText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    clienteInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    clienteText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 6,
        flex: 1,
    },
    productosInfo: {
        marginBottom: 8,
    },
    productosText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 22,
        marginBottom: 4,
    },
    productosPreview: {
        marginLeft: 22,
    },
    productoName: {
        fontSize: 13,
        color: '#555',
        marginBottom: 2,
    },
    masProductos: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    observaciones: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    observacionesText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
        flex: 1,
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    totalLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 6,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    estadoBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    estadoText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    pagarButton: {
        backgroundColor: '#4CAF50',
    },
    parcialButton: {
        backgroundColor: '#FF9800',
    },
    cancelarButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
});