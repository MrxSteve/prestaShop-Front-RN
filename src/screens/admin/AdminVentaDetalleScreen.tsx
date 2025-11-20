import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { VentaDetalle } from '../../components/venta';
import { ventaService } from '../../services/ventaService';
import { VentasStackParamList } from '../../types/navigation';
import { VentaResponse } from '../../types/venta';

type VentaDetalleScreenRouteProp = RouteProp<VentasStackParamList, 'VentaDetalle'>;
type VentaDetalleScreenNavigationProp = StackNavigationProp<VentasStackParamList, 'VentaDetalle'>;

const AdminVentaDetalleScreen: React.FC = () => {
    const route = useRoute<VentaDetalleScreenRouteProp>();
    const navigation = useNavigation<VentaDetalleScreenNavigationProp>();
    const { ventaId } = route.params;

    const [venta, setVenta] = useState<VentaResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchVenta();
    }, [ventaId]);

    const fetchVenta = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ventaService.obtenerPorId(ventaId);
            setVenta(response);
        } catch (error: any) {
            console.error('Error fetching venta:', error);
            setError('Error al cargar la venta');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleMarcarPagada = async () => {
        Alert.alert(
            'Confirmar acción',
            '¿Deseas marcar esta venta como pagada?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Confirmar', 
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            await ventaService.marcarComoPagada(ventaId);
                            Alert.alert('Éxito', 'Venta marcada como pagada');
                            fetchVenta(); // Refrescar datos
                        } catch (error: any) {
                            console.error('Error marking venta as pagada:', error);
                            Alert.alert('Error', 'No se pudo marcar la venta como pagada');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                },
            ]
        );
    };

    const handleMarcarParcial = async () => {
        Alert.alert(
            'Confirmar acción',
            '¿Deseas marcar esta venta como pago parcial?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Confirmar', 
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            await ventaService.marcarComoParcial(ventaId);
                            Alert.alert('Éxito', 'Venta marcada como pago parcial');
                            fetchVenta(); // Refrescar datos
                        } catch (error: any) {
                            console.error('Error marking venta as parcial:', error);
                            Alert.alert('Error', 'No se pudo marcar la venta como pago parcial');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                },
            ]
        );
    };

    const handleCancelar = async () => {
        Alert.alert(
            'Cancelar Venta',
            '¿Estás seguro de que deseas cancelar esta venta? Esta acción no se puede deshacer.',
            [
                { text: 'No', style: 'cancel' },
                { 
                    text: 'Sí, cancelar', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            await ventaService.cancelar(ventaId);
                            Alert.alert('Éxito', 'Venta cancelada');
                            fetchVenta(); // Refrescar datos
                        } catch (error: any) {
                            console.error('Error cancelling venta:', error);
                            Alert.alert('Error', 'No se pudo cancelar la venta');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <CustomHeader 
                    title="Detalle de Venta"
                    showBackButton={true}
                    onBackPress={handleGoBack}
                    backgroundColor="#6C5CE7"
                />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#6C5CE7" />
                    <Text style={styles.loadingText}>Cargando venta...</Text>
                </View>
            </View>
        );
    }

    if (error || !venta) {
        return (
            <View style={styles.container}>
                <CustomHeader 
                    title="Detalle de Venta"
                    showBackButton={true}
                    onBackPress={handleGoBack}
                    backgroundColor="#6C5CE7"
                />
                <View style={styles.centerContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
                    <Text style={styles.errorText}>
                        {error || 'Venta no encontrada'}
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchVenta}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <VentaDetalle
            venta={venta}
            onGoBack={handleGoBack}
            onMarcarPagada={handleMarcarPagada}
            onMarcarParcial={handleMarcarParcial}
            onCancelar={handleCancelar}
            actionLoading={actionLoading}
            showActions={true}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
    retryButton: {
        marginTop: 16,
        backgroundColor: '#6C5CE7',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default AdminVentaDetalleScreen;