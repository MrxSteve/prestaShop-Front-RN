// src/navigation/UsersStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Ajusta estos imports a tu alias/ruta real
import AdminUsuariosYcuentasScreen from '../screens/admin/AdminUsuariosYCuentasScreen';
import RolesManagementScreen from '../screens/admin/RolesManagementScreen';
import UsuariorManagementScreen from '../screens/admin/UsuarioManagmentScreen';

export type UsersStackParamList = {
  AdminUsuariosYcuentas: undefined;
  RoleManagement: undefined;
  UserManagement: undefined;
};

const Stack = createNativeStackNavigator<UsersStackParamList>();

export default function UsersStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminUsuariosYcuentas"
        component={AdminUsuariosYcuentasScreen}
      />
      <Stack.Screen
        name="RoleManagement"
        component={RolesManagementScreen}
      />
      <Stack.Screen
        name="UserManagement"
        component={UsuariorManagementScreen}
      />
    </Stack.Navigator>
  );
}
