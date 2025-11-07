import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ClienteCatalogoScreen from '../screens/cliente/ClienteCatalogoScreen';
import ClienteHomeScreen from '../screens/cliente/ClienteHomeScreen';
import ClienteMisAbonosScreen from '../screens/cliente/ClienteMisAbonosScreen';
import ClienteMisComprasScreen from '../screens/cliente/ClienteMisComprasScreen';
import ClientePerfilScreen from '../screens/cliente/ClientePerfilScreen';
import { ClienteTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<ClienteTabParamList>();

// Header personalizado con botón hamburguesa para Cliente
function CustomHeader({ title }: { title: string }) {
  const navigation = useNavigation();

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
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
const HomeWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Inicio" />
    <ClienteHomeScreen />
  </View>
);

const CatalogoWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Catálogo" />
    <ClienteCatalogoScreen />
  </View>
);

const MisComprasWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Mis Compras" />
    <ClienteMisComprasScreen />
  </View>
);

const MisAbonosWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Mis Abonos" />
    <ClienteMisAbonosScreen />
  </View>
);

const PerfilWithHeader = () => (
  <View style={styles.container}>
    <CustomHeader title="Mi Perfil" />
    <ClientePerfilScreen />
  </View>
);

export default function ClienteTabNavigator() {
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
        name="Home"
        component={HomeWithHeader}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
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
        name="MisCompras"
        component={MisComprasWithHeader}
        options={{
          title: 'Mis Compras',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="MisAbonos"
        component={MisAbonosWithHeader}
        options={{
          title: 'Mis Abonos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Perfil"
        component={PerfilWithHeader}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
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
    backgroundColor: '#4CAF50',
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