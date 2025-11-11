import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { EstadoVenta, TipoVenta, VentaResponse } from '../../types/venta';
import CustomHeader from '../CustomHeader';

interface VentaDetalleProps {
    venta: VentaResponse;
    onGoBack?: () => void;
    onMarcarPagada?: () => void;
    onMarcarParcial?: () => void;
    onCancelar?: () => void;
    actionLoading?: boolean;
    showActions?: boolean;
}

export const VentaDetalle: React.FC<VentaDetalleProps> = ({
    venta,
    onGoBack,
    onMarcarPagada,
    onMarcarParcial,
    onCancelar,
    actionLoading = false,
    showActions = true,
}) => {
    const [imageLoadingStates, setImageLoadingStates] = useState<{[key: number]: boolean}>({});
    const [imageErrorStates, setImageErrorStates] = useState<{[key: number]: boolean}>({});

    const handleImageLoadStart = (detalleId: number) => {
        setImageLoadingStates(prev => ({...prev, [detalleId]: true}));
    };

    const handleImageLoadEnd = (detalleId: number) => {
        setImageLoadingStates(prev => ({...prev, [detalleId]: false}));
    };

    const handleImageError = (detalleId: number) => {
        setImageLoadingStates(prev => ({...prev, [detalleId]: false}));
        setImageErrorStates(prev => ({...prev, [detalleId]: true}));
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

    const getEstadoIcon = (estado: EstadoVenta) => {
        switch (estado) {
            case EstadoVenta.PAGADA:
                return 'checkmark-circle';
            case EstadoVenta.PARCIAL:
                return 'time';
            case EstadoVenta.PENDIENTE:
                return 'hourglass';
            case EstadoVenta.CANCELADA:
                return 'close-circle';
            default:
                return 'help-circle';
        }
    };

    const canModifyStatus = venta.estado === EstadoVenta.PENDIENTE || venta.estado === EstadoVenta.PARCIAL;
    const canCancel = venta.estado !== EstadoVenta.CANCELADA && venta.estado !== EstadoVenta.PAGADA;

    return (
        <View style={styles.container}>
            <CustomHeader 
                title="Detalle de Venta"
                showBackButton={true}
                onBackPress={onGoBack}
                backgroundColor="#6C5CE7"
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header de la venta con gradiente */}
                <View style={styles.ventaHeader}>
                    <View style={styles.headerTopRow}>
                        <View style={styles.ventaIdContainer}>
                            <Text style={styles.ventaIdLabel}>Venta</Text>
                            <Text style={styles.ventaId}>#{venta.id}</Text>
                        </View>
                        <View style={styles.badgesContainer}>
                            <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(venta.estado) }]}>
                                <Ionicons 
                                    name={getEstadoIcon(venta.estado)} 
                                    size={14} 
                                    color="#fff" 
                                />
                                <Text style={styles.estadoText}>{getEstadoText(venta.estado)}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.headerBottomRow}>
                        <View style={styles.fechaContainer}>
                            <Ionicons name="calendar" size={16} color="#666" />
                            <Text style={styles.fechaVenta}>{formatDate(venta.fechaVenta)}</Text>
                        </View>
                        <View style={[styles.tipoVentaBadge, { backgroundColor: getTipoVentaColor(venta.tipoVenta) }]}>
                            <Text style={styles.tipoVentaText}>{getTipoVentaText(venta.tipoVenta)}</Text>
                        </View>
                    </View>
                </View>

                {/* Información del cliente mejorada */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person" size={20} color="#6C5CE7" />
                        <Text style={styles.sectionTitle}>Cliente</Text>
                    </View>
                    <View style={styles.clienteCard}>
                        <View style={styles.clienteIcon}>
                            <Ionicons name="person-outline" size={24} color="#6C5CE7" />
                        </View>
                        <View style={styles.clienteInfo}>
                            <Text style={styles.clienteLabel}>
                                {venta.clienteOcasional ? 'Cliente Ocasional' : 'Cliente Registrado'}
                            </Text>
                            <Text style={styles.clienteValue}>
                                {venta.clienteOcasional || `Cuenta ID: ${venta.cuentaClienteId}`}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Productos mejorados con imágenes */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="basket" size={20} color="#6C5CE7" />
                        <Text style={styles.sectionTitle}>
                            Productos ({venta.detalleVentas.length})
                        </Text>
                    </View>
                    <View style={styles.productosContainer}>
                        {venta.detalleVentas.map((detalle, index) => (
                            <View key={detalle.id} style={styles.productoCard}>
                                <View style={styles.productoImageContainer}>
                                    {detalle.imagenUrl ? (
                                        <>
                                            {imageLoadingStates[detalle.id] && (
                                                <View style={styles.imageLoadingOverlay}>
                                                    <ActivityIndicator size="small" color="#6C5CE7" />
                                                </View>
                                            )}
                                            {!imageErrorStates[detalle.id] ? (
                                                <Image 
                                                    source={{ uri: detalle.imagenUrl }} 
                                                    style={styles.productoImage}
                                                    resizeMode="cover"
                                                    onLoadStart={() => handleImageLoadStart(detalle.id)}
                                                    onLoadEnd={() => handleImageLoadEnd(detalle.id)}
                                                    onError={() => handleImageError(detalle.id)}
                                                />
                                            ) : (
                                                <View style={styles.productoImagePlaceholder}>
                                                    <Ionicons name="image-outline" size={20} color="#ccc" />
                                                    <Text style={styles.errorImageText}>Error</Text>
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <View style={styles.productoImagePlaceholder}>
                                            <Ionicons name="cube" size={20} color="#999" />
                                            <Text style={styles.noImageText}>Sin imagen</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.productoInfo}>
                                    <Text style={styles.productoNombre} numberOfLines={2}>
                                        {detalle.nombreProducto}
                                    </Text>
                                    <View style={styles.productoDetails}>
                                        <Text style={styles.productoPrecio}>
                                            {formatPrice(detalle.precioUnitario)}
                                        </Text>
                                        <View style={styles.cantidadBadge}>
                                            <Text style={styles.cantidadText}>×{detalle.cantidad}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.productoSubtotalContainer}>
                                    <Text style={styles.productoSubtotal}>
                                        {formatPrice(detalle.subtotal)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Resumen mejorado */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calculator" size={20} color="#6C5CE7" />
                        <Text style={styles.sectionTitle}>Resumen</Text>
                    </View>
                    <View style={styles.resumenCard}>
                        <View style={styles.resumenRow}>
                            <Text style={styles.resumenLabel}>Subtotal</Text>
                            <Text style={styles.resumenValue}>{formatPrice(venta.subtotal)}</Text>
                        </View>
                        <View style={styles.resumenDivider} />
                        <View style={styles.resumenRowTotal}>
                            <View style={styles.totalLabelContainer}>
                                <Ionicons name="cash" size={18} color="#4CAF50" />
                                <Text style={styles.resumenTotalLabel}>Total</Text>
                            </View>
                            <Text style={styles.resumenTotalValue}>{formatPrice(venta.total)}</Text>
                        </View>
                    </View>
                </View>

                {/* Observaciones mejoradas */}
                {venta.observaciones && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="chatbox-ellipses" size={20} color="#6C5CE7" />
                            <Text style={styles.sectionTitle}>Observaciones</Text>
                        </View>
                        <View style={styles.observacionesCard}>
                            <Text style={styles.observacionesText}>{venta.observaciones}</Text>
                        </View>
                    </View>
                )}

                {/* Acciones mejoradas */}
                {showActions && (canModifyStatus || canCancel) && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="settings" size={20} color="#6C5CE7" />
                            <Text style={styles.sectionTitle}>Acciones</Text>
                        </View>
                        <View style={styles.actionsContainer}>
                            {canModifyStatus && venta.estado !== EstadoVenta.PAGADA && onMarcarPagada && (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.pagarButton]}
                                    onPress={onMarcarPagada}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                    )}
                                    <Text style={styles.actionButtonText}>Marcar como Pagada</Text>
                                </TouchableOpacity>
                            )}
                            
                            {canModifyStatus && venta.estado === EstadoVenta.PENDIENTE && onMarcarParcial && (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.parcialButton]}
                                    onPress={onMarcarParcial}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="time" size={20} color="#fff" />
                                    )}
                                    <Text style={styles.actionButtonText}>Marcar como Parcial</Text>
                                </TouchableOpacity>
                            )}
                            
                            {canCancel && onCancelar && (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelarButton]}
                                    onPress={onCancelar}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="close-circle" size={20} color="#fff" />
                                    )}
                                    <Text style={styles.actionButtonText}>Cancelar Venta</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    ventaHeader: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    ventaIdContainer: {
        alignItems: 'flex-start',
    },
    ventaIdLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    ventaId: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    badgesContainer: {
        alignItems: 'flex-end',
    },
    estadoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    estadoText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    headerBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fechaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    fechaVenta: {
        fontSize: 16,
        color: '#666',
    },
    tipoVentaBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tipoVentaText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    clienteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9ff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e8e9ff',
    },
    clienteIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        elevation: 1,
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    clienteInfo: {
        flex: 1,
    },
    clienteLabel: {
        fontSize: 14,
        color: '#6C5CE7',
        fontWeight: '600',
        marginBottom: 4,
    },
    clienteValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    productosContainer: {
        gap: 12,
    },
    productoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    productoImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    productoImage: {
        width: '100%',
        height: '100%',
    },
    productoImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageLoadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    errorImageText: {
        fontSize: 10,
        color: '#ccc',
        marginTop: 2,
    },
    noImageText: {
        fontSize: 9,
        color: '#999',
        marginTop: 2,
        textAlign: 'center',
    },
    productoInfo: {
        flex: 1,
    },
    productoNombre: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    productoDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    productoPrecio: {
        fontSize: 14,
        color: '#666',
    },
    cantidadBadge: {
        backgroundColor: '#6C5CE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    cantidadText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    productoSubtotalContainer: {
        alignItems: 'flex-end',
    },
    productoSubtotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    resumenCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    resumenLabel: {
        fontSize: 16,
        color: '#666',
    },
    resumenValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    resumenDivider: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 8,
    },
    resumenRowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    totalLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    resumenTotalLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    resumenTotalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    observacionesCard: {
        backgroundColor: '#f8f9ff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#6C5CE7',
    },
    observacionesText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
        fontStyle: 'italic',
    },
    actionsContainer: {
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    bottomSpacer: {
        height: 20,
    },
});