import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AdminVentasScreen from '../screens/admin/AdminVentasScreen';
import { VentasStackParamList } from '../types/navigation';
import AdminVentaDetalleScreen from '../screens/admin/AdminVentaDetalleScreen';

const Stack = createNativeStackNavigator<VentasStackParamList>();

export default function VentasStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen 
                name="VentasMain" 
                component={AdminVentasScreen}
                options={{ 
                    headerShown: false 
                }}
            />
            <Stack.Screen 
                name="VentaDetalle" 
                component={AdminVentaDetalleScreen}
                options={{ 
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}