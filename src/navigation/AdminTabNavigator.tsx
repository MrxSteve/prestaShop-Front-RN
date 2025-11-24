import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminReportesScreen from '../screens/admin/AdminReportesScreen';
import AdminUsuariosYCuentasScreen from '../screens/admin/AdminUsuariosYCuentasScreen';
import { AdminTabParamList } from '../types/navigation';
import CatalogStackNavigator from './CatalogStackNavigator';

import VentasStackNavigator from './VentasStackNavigator';

import UsersStackNavigator from './UsersStackNavigator';


const Tab = createBottomTabNavigator<AdminTabParamList>();

// Wrappers para las pantallas con header
const DashboardWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Dashboard" />
    <AdminDashboardScreen />
  </View>
);


const UsuariosYCuentasWithHeader = () => (
  <View style={styles.container}>
        <UsersStackNavigator />
  </View>
);

const VentasWithHeader = () => (
  <VentasStackNavigator />
);

const CatalogoWithHeader = () => (
  <CatalogStackNavigator />
);

const ReportesWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Reportes y Análisis" />
    <AdminReportesScreen />
  </View>
);

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardWithHeader}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="UsuariosYCuentas"
        component={UsuariosYCuentasWithHeader}
        options={{
          title: 'Usuarios & Cuentas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Ventas"
        component={VentasWithHeader}
        options={{
          title: 'Ventas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Catalogo"
        component={CatalogoWithHeader}
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Reportes"
        component={ReportesWithHeader}
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});