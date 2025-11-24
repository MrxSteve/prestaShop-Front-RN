import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AdminAbonoDetalleScreen } from '../components/abono/AbonoDetalle';
import AdminAbonosScreen from '../screens/admin/AdminAbonosScreen';
import { AbonosStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AbonosStackParamList>();

const AbonosStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="AbonosMain"
                component={AdminAbonosScreen}
            />
            <Stack.Screen
                name="AbonoDetalle"
                component={AdminAbonoDetalleScreen}
            />
        </Stack.Navigator>
    );
};

export default AbonosStackNavigator;