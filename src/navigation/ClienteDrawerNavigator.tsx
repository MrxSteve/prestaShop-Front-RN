import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomHeader } from '../components';
import { useAuth } from '../context/AuthContext';
import { ClienteDrawerParamList } from '../types/navigation';
import ClienteTabNavigator from './ClienteTabNavigator';

const Drawer = createDrawerNavigator<ClienteDrawerParamList>();

// Pantallas temporales con header
const ConfiguracionScreen = () => (
  <View style={styles.container}>
    <CustomHeader title="Configuración" backgroundColor="#4CAF50" />
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>Configuración</Text>
      <Text style={styles.placeholderSubtitle}>Panel de configuración del cliente</Text>
    </View>
  </View>
);

const MiCuentaScreen = () => (
  <View style={styles.container}>
    <CustomHeader title="Mi Cuenta" backgroundColor="#4CAF50" />
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>Mi Cuenta y Saldo</Text>
      <Text style={styles.placeholderSubtitle}>Gestión de cuenta y saldo disponible</Text>
    </View>
  </View>
);

// Custom Drawer Content para Cliente
function CustomDrawerContent(props: any) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Qué tipo de cierre de sesión deseas realizar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              await logout(false); // No olvidar credenciales
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
        {
          text: 'Cerrar y Olvidar',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout(true); // Olvidar credenciales
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      {/* Header del Drawer */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.nombreCompleto?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.nombreCompleto}</Text>
        <Text style={styles.userRole}>Cliente</Text>
        <View style={styles.accountInfo}>
          <Text style={styles.accountText}>Saldo: $1,250.00</Text>
        </View>
      </View>

      {/* Items del Drawer */}
      <View style={styles.drawerContent}>
        <DrawerItemList {...props} />
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity style={styles.quickActionItem}>
          <Ionicons name="card-outline" size={20} color="#2196F3" />
          <Text style={styles.quickActionText}>Realizar Abono</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionItem}>
          <Ionicons name="receipt-outline" size={20} color="#4CAF50" />
          <Text style={styles.quickActionText}>Ver Historial</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionItem}>
          <Ionicons name="help-circle-outline" size={20} color="#FF9800" />
          <Text style={styles.quickActionText}>Ayuda y Soporte</Text>
        </TouchableOpacity>
      </View>

      {/* Footer del Drawer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>ShopMoney v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function ClienteDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 300,
        },
        drawerActiveTintColor: '#2196F3',
        drawerInactiveTintColor: '#757575',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen
        name="ClienteTabs"
        component={ClienteTabNavigator}
        options={{
          title: '🏠 Inicio',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="MiCuenta"
        component={MiCuentaScreen}
        options={{
          title: '💳 Mi Cuenta',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="Configuracion"
        component={ConfiguracionScreen}
        options={{
          title: '⚙️ Configuración',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#C8E6C9',
    marginBottom: 10,
  },
  accountInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  accountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  quickActions: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    marginLeft: 15,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});