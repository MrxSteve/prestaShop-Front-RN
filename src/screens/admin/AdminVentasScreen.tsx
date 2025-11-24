import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { VentaForm, VentaList } from '../../components/venta';
import { VentasStackScreenProps } from '../../types/navigation';

export default function AdminVentasScreen() {
    const [showForm, setShowForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigation = useNavigation<VentasStackScreenProps<'VentasMain'>['navigation']>();

    const handleAddVenta = () => {
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleViewDetails = (ventaId: number) => {
        navigation.navigate('VentaDetalle', { ventaId });
    };

    return (
        <View style={styles.container}>
            <CustomHeader title="Gestión de Ventas" />
            <VentaList
                onViewDetails={handleViewDetails}
                onAddVenta={handleAddVenta}
                refreshTrigger={refreshTrigger}
            />

            <VentaForm
                visible={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={handleFormSuccess}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});