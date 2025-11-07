import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types/navigation';
import AdminDrawerNavigator from './AdminDrawerNavigator';
import AuthNavigator from './AuthNavigator';
import ClienteDrawerNavigator from './ClienteDrawerNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Pantalla de carga
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Usuario no autenticado - mostrar pantallas de auth
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : userRole === 'ADMIN' ? (
          // Usuario administrador - mostrar drawer y tabs de admin
          <Stack.Screen name="AdminDrawer" component={AdminDrawerNavigator} />
        ) : userRole === 'CLIENTE' ? (
          // Usuario cliente - mostrar drawer y tabs de cliente
          <Stack.Screen name="ClienteDrawer" component={ClienteDrawerNavigator} />
        ) : (
          // Caso por defecto (no debería ocurrir)
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});