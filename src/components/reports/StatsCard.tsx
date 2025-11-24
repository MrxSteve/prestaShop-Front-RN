import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    color,
    subtitle
}) => {
    return (
        <View style={[styles.statsCard, { borderLeftColor: color }]}>
            <View style={styles.statsHeader}>
                <Ionicons name={icon as any} size={24} color={color} />
                <Text style={styles.statsTitle}>{title}</Text>
            </View>
            <Text style={styles.statsValue}>{value}</Text>
            {subtitle && (
                <Text style={styles.statsSubtitle}>{subtitle}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    statsCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
        minHeight: 120,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    statsTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        flex: 1,
    },
    statsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statsSubtitle: {
        fontSize: 12,
        color: '#999',
    },
});