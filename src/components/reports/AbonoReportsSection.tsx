import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AbonoStatsResponse } from '../../types/abono';
import { AbonoSearchView } from './AbonoSearchView';
import { abonoService } from '@/src/services/abonoService';

interface AbonoReportsSectionProps {
    refreshTrigger?: number;
}

export const AbonoReportsSection: React.FC<AbonoReportsSectionProps> = ({
    refreshTrigger = 0
}) => {
    const [stats, setStats] = useState<AbonoStatsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<'stats' | 'search'>('stats');

    useEffect(() => {
        if (activeSection === 'stats') {
            loadStats();
        }
    }, [activeSection, refreshTrigger]);

    const loadStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await abonoService.obtenerEstadisticas();
            setStats(response);
        } catch (error: any) {
            console.error('Error loading abono stats:', error);
            setError('Error al cargar estadísticas de abonos');
        } finally {
            setLoading(false);
        }
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const renderStatsCard = (title: string, value: string | number, color: string, icon: string) => (
        <View style={[styles.statsCard, { borderLeftColor: color }]}>
            <View style={styles.statsCardContent}>
                <View style={styles.statsCardHeader}>
                    <Ionicons name={icon as any} size={24} color={color} />
                    <Text style={styles.statsCardTitle}>{title}</Text>
                </View>
                <Text style={[styles.statsCardValue, { color }]}>{value}</Text>
            </View>
        </View>
    );

    const renderStatsSection = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8E44AD" />
                    <Text style={styles.loadingText}>Cargando estadísticas...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={48} color="#F44336" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!stats) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>No hay estadísticas disponibles</Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.statsContainer} showsVerticalScrollIndicator={false}>
                {/* Resumen general */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumen General</Text>
                    <View style={styles.statsGrid}>
                        {renderStatsCard(
                            'Total Abonos',
                            stats.totalAbonos.toString(),
                            '#2196F3',
                            'document-text-outline'
                        )}
                        {renderStatsCard(
                            'Monto Total',
                            formatPrice(stats.montoTotal),
                            '#4CAF50',
                            'cash-outline'
                        )}
                    </View>
                </View>

                {/* Estadísticas por estado */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Por Estado</Text>
                    <View style={styles.statsGrid}>
                        {renderStatsCard(
                            'Pendientes',
                            stats.abonosPorEstado.pendientes?.toString() || '0',
                            '#FF9800',
                            'time-outline'
                        )}
                        {renderStatsCard(
                            'Aplicados',
                            stats.abonosPorEstado.aplicados?.toString() || '0',
                            '#4CAF50',
                            'checkmark-circle-outline'
                        )}
                        {renderStatsCard(
                            'Rechazados',
                            stats.abonosPorEstado.rechazados?.toString() || '0',
                            '#F44336',
                            'close-circle-outline'
                        )}
                    </View>
                </View>

                {/* Montos por estado */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Montos por Estado</Text>
                    <View style={styles.statsGrid}>
                        {renderStatsCard(
                            'Pendientes',
                            formatPrice(stats.montosPorEstado.pendientes || 0),
                            '#FF9800',
                            'hourglass-outline'
                        )}
                        {renderStatsCard(
                            'Aplicados',
                            formatPrice(stats.montosPorEstado.aplicados || 0),
                            '#4CAF50',
                            'checkmark-done-outline'
                        )}
                        {renderStatsCard(
                            'Rechazados',
                            formatPrice(stats.montosPorEstado.rechazados || 0),
                            '#F44336',
                            'close-outline'
                        )}
                    </View>
                </View>

                {/* Estadísticas por método de pago */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Por Método de Pago</Text>
                    <View style={styles.statsGrid}>
                        {renderStatsCard(
                            'Efectivo',
                            stats.abonosPorMetodo.efectivo?.toString() || '0',
                            '#4CAF50',
                            'cash'
                        )}
                        {renderStatsCard(
                            'Transferencia',
                            stats.abonosPorMetodo.transferencia?.toString() || '0',
                            '#2196F3',
                            'swap-horizontal'
                        )}
                        {renderStatsCard(
                            'Cheque',
                            stats.abonosPorMetodo.cheque?.toString() || '0',
                            '#FF9800',
                            'document-text'
                        )}
                        {renderStatsCard(
                            'Otro',
                            stats.abonosPorMetodo.otro?.toString() || '0',
                            '#9C27B0',
                            'wallet'
                        )}
                    </View>
                </View>

                {/* Montos por método de pago */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Montos por Método de Pago</Text>
                    <View style={styles.statsGrid}>
                        {renderStatsCard(
                            'Efectivo',
                            formatPrice(stats.montosPorMetodo.efectivo || 0),
                            '#4CAF50',
                            'cash-outline'
                        )}
                        {renderStatsCard(
                            'Transferencia',
                            formatPrice(stats.montosPorMetodo.transferencia || 0),
                            '#2196F3',
                            'swap-horizontal-outline'
                        )}
                        {renderStatsCard(
                            'Cheque',
                            formatPrice(stats.montosPorMetodo.cheque || 0),
                            '#FF9800',
                            'document-text-outline'
                        )}
                        {renderStatsCard(
                            'Otro',
                            formatPrice(stats.montosPorMetodo.otro || 0),
                            '#9C27B0',
                            'wallet-outline'
                        )}
                    </View>
                </View>

                {/* Promedio de abonos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estadísticas de Monto</Text>
                    <View style={styles.statsGrid}>
                        {renderStatsCard(
                            'Promedio por Abono',
                            formatPrice(stats.promedioAbono),
                            '#673AB7',
                            'analytics-outline'
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            {/* Navegación de secciones */}
            <View style={styles.sectionNav}>
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        activeSection === 'stats' && styles.navButtonActive
                    ]}
                    onPress={() => setActiveSection('stats')}
                >
                    <Ionicons 
                        name="bar-chart-outline" 
                        size={20} 
                        color={activeSection === 'stats' ? '#fff' : '#666'} 
                    />
                    <Text style={[
                        styles.navButtonText,
                        activeSection === 'stats' && styles.navButtonTextActive
                    ]}>
                        Estadísticas
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        activeSection === 'search' && styles.navButtonActive
                    ]}
                    onPress={() => setActiveSection('search')}
                >
                    <Ionicons 
                        name="search-outline" 
                        size={20} 
                        color={activeSection === 'search' ? '#fff' : '#666'} 
                    />
                    <Text style={[
                        styles.navButtonText,
                        activeSection === 'search' && styles.navButtonTextActive
                    ]}>
                        Buscar Abonos
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Contenido de la sección */}
            {activeSection === 'stats' ? (
                renderStatsSection()
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <AbonoSearchView refreshTrigger={refreshTrigger} />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    sectionNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    navButtonActive: {
        backgroundColor: '#8E44AD',
    },
    navButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    navButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
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
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        textAlign: 'center',
    },
    statsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        paddingLeft: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statsCard: {
        flex: 1,
        minWidth: 150,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderLeftWidth: 4,
    },
    statsCardContent: {
        flex: 1,
    },
    statsCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    statsCardTitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    statsCardValue: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});