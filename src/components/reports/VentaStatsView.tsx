import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ventaService } from '../../services/ventaService';
import { VentaStats } from '../../types/venta';
import { StatsCard } from './StatsCard';

interface VentaStatsViewProps {
    refreshTrigger?: number;
}

export const VentaStatsView: React.FC<VentaStatsViewProps> = ({
    refreshTrigger = 0
}) => {
    const [stats, setStats] = useState<VentaStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, [refreshTrigger]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const statsData = await ventaService.obtenerEstadisticas();
            setStats(statsData);
        } catch (error: any) {
            console.error('Error fetching venta stats:', error);
            setError('Error al cargar estadísticas');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const statsCards = useMemo(() => {
        if (!stats) return [];

        return [
            {
                title: 'Total Ventas',
                value: stats.totalVentas.toLocaleString(),
                icon: 'receipt-outline' as const,
                color: '#2196F3',
                subtitle: `${stats.ventasCredito} crédito, ${stats.ventasContado} contado`
            },
            {
                title: 'Monto Total',
                value: formatCurrency(stats.montoTotalVentas),
                icon: 'cash-outline' as const,
                color: '#4CAF50',
                subtitle: `Promedio: ${formatCurrency(stats.montoPromedioVentas)}`
            },
            {
                title: 'Ventas Pagadas',
                value: stats.ventasPagadas.toLocaleString(),
                icon: 'checkmark-circle-outline' as const,
                color: '#4CAF50',
                subtitle: `${((stats.ventasPagadas / stats.totalVentas) * 100).toFixed(1)}% del total`
            },
            {
                title: 'Ventas Pendientes',
                value: (stats.ventasPendientes + stats.ventasParciales).toLocaleString(),
                icon: 'time-outline' as const,
                color: '#FF9800',
                subtitle: `${stats.ventasPendientes} pendientes, ${stats.ventasParciales} parciales`
            }
        ];
    }, [stats]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando estadísticas...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Estadísticas de Ventas</Text>
            <View style={styles.statsGrid}>
                {statsCards.map((card, index) => (
                    <View key={index} style={styles.statsCardWrapper}>
                        <StatsCard
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            subtitle={card.subtitle}
                        />
                    </View>
                ))}
            </View>
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statsCardWrapper: {
        width: '48%',
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
    },
});