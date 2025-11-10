import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type MainSection = 'productos' | 'ventas' | 'abonos' | 'usuarios' | 'cuentas' | 'movimientos';

interface MainNavigationTabsProps {
    activeSection: MainSection;
    onSectionChange: (section: MainSection) => void;
}

interface TabItem {
    key: MainSection;
    label: string;
    icon: string;
}

const tabs: TabItem[] = [
    { key: 'productos', label: 'Productos', icon: 'cube-outline' },
    { key: 'ventas', label: 'Ventas', icon: 'card-outline' },
    { key: 'abonos', label: 'Abonos', icon: 'wallet-outline' },
    { key: 'usuarios', label: 'Usuarios', icon: 'people-outline' },
    { key: 'cuentas', label: 'Cuentas', icon: 'folder-outline' },
    { key: 'movimientos', label: 'Movimientos', icon: 'swap-horizontal-outline' },
];

export const MainNavigationTabs: React.FC<MainNavigationTabsProps> = ({
    activeSection,
    onSectionChange
}) => {
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.container}
        >
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, activeSection === tab.key && styles.activeTab]}
                    onPress={() => onSectionChange(tab.key)}
                >
                    <Ionicons 
                        name={tab.icon as any} 
                        size={18} 
                        color={activeSection === tab.key ? '#fff' : '#666'} 
                    />
                    <Text style={[styles.tabText, activeSection === tab.key && styles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        gap: 6,
        minWidth: 100,
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },
});