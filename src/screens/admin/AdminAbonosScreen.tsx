import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { AbonoForm, AbonoList } from '../../components/abono';
import { AbonosStackScreenProps } from '../../types/navigation';

export default function AdminAbonosScreen() {
    const [showForm, setShowForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigation = useNavigation<AbonosStackScreenProps<'AbonosMain'>['navigation']>();

    const handleAddAbono = () => {
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleViewDetails = (abonoId: number) => {
        navigation.navigate('AbonoDetalle', { abonoId });
    };

    return (
        <View style={styles.container}>
            <CustomHeader title="Gestión de Abonos" />
            <AbonoList
                onViewDetails={handleViewDetails}
                onAddAbono={handleAddAbono}
                refreshTrigger={refreshTrigger}
            />

            <AbonoForm
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