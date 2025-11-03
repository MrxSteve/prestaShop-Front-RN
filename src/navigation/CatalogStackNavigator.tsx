import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AdminCatalogoScreen from '../screens/admin/AdminCatalogoScreen';
import CategoryManagementScreen from '../screens/admin/CategoryManagementScreen';
import { CatalogStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export default function CatalogStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen 
                name="CatalogMain" 
                component={AdminCatalogoScreen}
                options={{ 
                    headerShown: false 
                }}
            />
            <Stack.Screen 
                name="CategoryManagement" 
                component={CategoryManagementScreen}
                options={{ 
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}