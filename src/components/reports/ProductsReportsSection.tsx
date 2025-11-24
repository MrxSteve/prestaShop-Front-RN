import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductoResponse } from '../../types/producto';
import { BestSellersView } from './BestSellersView';
import { PriceSearchView } from './PriceSearchView';
import { ProductStatsView } from './ProductStatsView';

type ProductViewMode = 'stats' | 'price' | 'bestsellers';

interface ProductsReportsSectionProps {
    productos: ProductoResponse[];
    onProductEdit: (producto: ProductoResponse) => void;
    onProductViewDetails: (productId: number) => void;
    refreshTrigger?: boolean;
}

interface SubTab {
    key: ProductViewMode;
    label: string;
    icon: string;
}

const subTabs: SubTab[] = [
    { key: 'stats', label: 'Estadísticas', icon: 'analytics-outline' },
    { key: 'price', label: 'Por Precio', icon: 'pricetag-outline' },
    { key: 'bestsellers', label: 'Más Vendidos', icon: 'trending-up-outline' },
];

export const ProductsReportsSection: React.FC<ProductsReportsSectionProps> = ({
    productos,
    onProductEdit,
    onProductViewDetails,
    refreshTrigger
}) => {
    const [productViewMode, setProductViewMode] = useState<ProductViewMode>('stats');

    const handleViewModeChange = (mode: ProductViewMode) => {
        setProductViewMode(mode);
    };

    return (
        <View style={styles.container}>
            {/* Navegación secundaria para productos */}
            <View style={styles.subTabContainer}>
                {subTabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, productViewMode === tab.key && styles.activeTab]}
                        onPress={() => handleViewModeChange(tab.key)}
                    >
                        <Ionicons 
                            name={tab.icon as any} 
                            size={16} 
                            color={productViewMode === tab.key ? '#fff' : '#666'} 
                        />
                        <Text style={[styles.tabText, productViewMode === tab.key && styles.activeTabText]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Contenido según la vista seleccionada */}
            {productViewMode === 'stats' && (
                <ProductStatsView productos={productos} />
            )}

            {productViewMode === 'price' && (
                <PriceSearchView
                    onProductEdit={onProductEdit}
                    onProductViewDetails={onProductViewDetails}
                />
            )}

            {productViewMode === 'bestsellers' && (
                <BestSellersView
                    onProductEdit={onProductEdit}
                    onProductViewDetails={onProductViewDetails}
                    refreshTrigger={refreshTrigger}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subTabContainer: {
        flexDirection: 'row',
        gap: 8,
        margin: 20,
        marginBottom: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        gap: 6,
    },
    activeTab: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },
});