import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomHeader } from '../components';
import { useAuth } from '../context/AuthContext';
import AdminPerfilScreen from '../screens/admin/AdminPerfilScreen';
import { AdminDrawerParamList } from '../types/navigation';
import AdminTabNavigator from './AdminTabNavigator';

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

// Pantalla temporal para configuración
const ConfiguracionScreen = () => (
  <View style={styles.container}>
    <CustomHeader title="Configuración" backgroundColor="#2196F3" />
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>Configuración</Text>
      <Text style={styles.placeholderSubtitle}>Panel de configuración del administrador</Text>
    </View>
  </View>
);

// Custom Drawer Content para Admin
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
        <Text style={styles.userRole}>Administrador</Text>
      </View>

      {/* Items del Drawer */}
      <View style={styles.drawerContent}>
        <DrawerItemList {...props} />
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

export default function AdminDrawerNavigator() {
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
        name="AdminTabs"
        component={AdminTabNavigator}
        options={{
          title: '🏠 Panel Principal',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="Perfil"
        component={AdminPerfilScreen}
        options={{
          title: '👤 Mi Perfil',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person" size={size} color={color} />
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
    backgroundColor: '#2196F3',
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
    color: '#2196F3',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
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