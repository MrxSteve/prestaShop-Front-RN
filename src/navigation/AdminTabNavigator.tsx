import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminCatalogoScreen from '../screens/admin/AdminCatalogoScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminReportesScreen from '../screens/admin/AdminReportesScreen';
import AdminUsuariosYCuentasScreen from '../screens/admin/AdminUsuariosYCuentasScreen';
import AdminVentasScreen from '../screens/admin/AdminVentasScreen';
import { AdminTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<AdminTabParamList>();

// Header personalizado con botón hamburguesa
function CustomHeader({ title }: { title: string }) {
  const navigation = useNavigation();

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight}>
          {/* Espacio para futuras acciones */}
        </View>
      </View>
    </View>
  );
}

// Wrappers para las pantallas con header
const DashboardWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Dashboard" />
    <AdminDashboardScreen />
  </View>
);

const UsuariosYCuentasWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Usuarios y Cuentas" />
    <AdminUsuariosYCuentasScreen />
  </View>
);

const VentasWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Gestión de Ventas" />
    <AdminVentasScreen />
  </View>
);

const CatalogoWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Catálogo" />
    <AdminCatalogoScreen />
  </View>
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
  header: {
    backgroundColor: '#2196F3',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 45,
  },
  menuButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 44,
  },
});