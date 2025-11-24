import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Ajusta las rutas según tu estructura real
import AdminUsuariosYcuentasScreen from '../screens/admin/AdminUsuariosYCuentasScreen';
import RolesManagementScreen from '../screens/admin/RolesManagementScreen';
import UsuarioManagementScreen from '../screens/admin/UsuarioManagmentScreen';
import RoleAssignmentScreen from '../screens/admin/RoleAssignmentScreen';
import CuentasClientesScreen from '../screens/admin/CuentasClientesScreen';
import CuentaDetalleScreen from '../screens/admin/CuentaDetalleScreen';
import NuevaCuentaScreen from '../screens/admin/NuevaCuentaScreen';



export type UsersStackParamList = {
  AdminUsuariosYcuentas: undefined;
  RoleManagement: undefined;
  UserManagement: undefined;
  RoleAssignmentScreen: undefined;
  CuentasClientesScreen: undefined;
  CuentaDetalleScreen: { cuentaId: number };
  NuevaCuentaScreen: undefined;
  ActualizarLimiteScreen: { cuentaId: number; limiteActual: number };
};

const Stack = createNativeStackNavigator<UsersStackParamList>();

export default function UsersStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Panel principal de administración */}
      <Stack.Screen
        name="AdminUsuariosYcuentas"
        component={AdminUsuariosYcuentasScreen}
      />

      {/* Gestión de roles */}
      <Stack.Screen
        name="RoleManagement"
        component={RolesManagementScreen}
      />

      {/* Gestión de usuarios */}
      <Stack.Screen
        name="UserManagement"
        component={UsuarioManagementScreen}
      />

      {/* Asignación de roles */}
      <Stack.Screen
        name="RoleAssignmentScreen"
        component={RoleAssignmentScreen}
      />

      {/* Gestión de cuentas */}
      <Stack.Screen
        name="CuentasClientesScreen"
        component={CuentasClientesScreen}
      />

      {/* Detalle de cuenta */}
      <Stack.Screen
        name="CuentaDetalleScreen"
        component={CuentaDetalleScreen}
      />

      {/* Nueva cuenta */}
      <Stack.Screen
        name="NuevaCuentaScreen"
        component={NuevaCuentaScreen}
      />



    </Stack.Navigator>
  );
}
