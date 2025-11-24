import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { VentaSearchView } from './VentaSearchView';
import { VentaStatsView } from './VentaStatsView';

type VentaSubView = 'stats' | 'search';

interface VentaReportsSectionProps {
    refreshTrigger?: number;
}

interface SubTab {
    key: VentaSubView;
    label: string;
}

const subTabs: SubTab[] = [
    { key: 'stats', label: 'Estadísticas' },
    { key: 'search', label: 'Búsqueda Avanzada' },
];

export const VentaReportsSection: React.FC<VentaReportsSectionProps> = ({
    refreshTrigger = 0
}) => {
    const [activeSubView, setActiveSubView] = useState<VentaSubView>('stats');

    const renderContent = () => {
        switch (activeSubView) {
            case 'stats':
                return <VentaStatsView refreshTrigger={refreshTrigger} />;
            case 'search':
                return <VentaSearchView refreshTrigger={refreshTrigger} />;
            default:
                return <VentaStatsView refreshTrigger={refreshTrigger} />;
        }
    };

    return (
        <View style={styles.container}>
            {/* Sub-navigation */}
            <View style={styles.subNavContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.subNavContent}
                >
                    {subTabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.subTab,
                                activeSubView === tab.key && styles.activeSubTab
                            ]}
                            onPress={() => setActiveSubView(tab.key)}
                        >
                            <Text style={[
                                styles.subTabText,
                                activeSubView === tab.key && styles.activeSubTabText
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    subNavContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        paddingVertical: 8,
    },
    subNavContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    subTab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    activeSubTab: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    subTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6c757d',
    },
    activeSubTabText: {
        color: '#fff',
    },
    content: {
        flex: 1,
    },
});