import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProductoResponse } from '../../types/producto';
import { StatsCard } from './StatsCard';

interface ProductStatsViewProps {
    productos: ProductoResponse[];
}

interface StatsCardData {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
}

export const ProductStatsView: React.FC<ProductStatsViewProps> = ({ productos }) => {
    const stats: StatsCardData[] = React.useMemo(() => {
        if (!productos.length) return [];

        const total = productos.length;
        const disponibles = productos.filter(p => {
            // Verificar diferentes tipos de ProductoResponse
            if ('stock' in p && typeof p.stock === 'number') {
                return p.stock > 0;
            }
            if ('estado' in p && typeof p.estado === 'string') {
                return p.estado === 'DISPONIBLE';
            }
            return true;
        }).length;

        const agotados = total - disponibles;
        
        // Calcular promedio de precios
        const precios = productos.map(p => {
            if ('precioUnitario' in p && typeof p.precioUnitario === 'number') return p.precioUnitario;
            if ('precio' in p && typeof p.precio === 'number') return p.precio;
            return 0;
        }).filter(price => price > 0);
        
        const precioPromedio = precios.length > 0 ? precios.reduce((a, b) => a + b, 0) / precios.length : 0;
        
        return [
            {
                title: 'Total Productos',
                value: total,
                icon: 'cube-outline',
                color: '#4CAF50',
                subtitle: 'En el catálogo'
            },
            {
                title: 'Disponibles',
                value: disponibles,
                icon: 'checkmark-circle-outline',
                color: '#2196F3',
                subtitle: 'En stock'
            },
            {
                title: 'Precio Promedio',
                value: `$${precioPromedio.toFixed(2)}`,
                icon: 'pricetag-outline',
                color: '#FF9800',
                subtitle: 'Precio medio'
            },
            {
                title: 'Productos Agotados',
                value: agotados,
                icon: 'alert-circle-outline',
                color: '#f44336',
                subtitle: 'Requieren atención'
            },
        ];
    }, [productos]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Estadísticas de Productos</Text>
            <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <View key={index} style={styles.statsCardWrapper}>
                        <StatsCard
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            subtitle={stat.subtitle}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    statsCardWrapper: {
        width: '48%', // Aproximadamente la mitad del ancho menos el gap
        marginBottom: 5,
    },
});