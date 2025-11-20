// src/screens/admin/AdminUsuariosYcuentasScreen.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '@/src/components/CustomHeader';

export default function AdminUsuariosYcuentasScreen() {
  const navigation = useNavigation<any>();

  const goToRoles = () => navigation.navigate('RoleManagement');
  const goToUsers = () => navigation.navigate('UserManagement');
  const goToRoleAssign = () => navigation.navigate('RoleAssignmentScreen');
  const goToCuentas = () => navigation.navigate('CuentasClientesScreen');

  return (
    <View style={styles.container}>
      <CustomHeader title="Usuarios y Cuentas" />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestión del Sistema</Text>

        {/* Card: Gestión de Roles */}
        <TouchableOpacity style={[styles.card, styles.shadow]} onPress={goToRoles} activeOpacity={0.9}>
          <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="shield-checkmark" size={26} color="#1976D2" />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Gestión de Roles</Text>
            <Text style={styles.cardSubtitle}>Crear, editar y eliminar roles del sistema.</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>

        {/* Card: Gestión de Usuarios */}
        <TouchableOpacity style={[styles.card, styles.shadow]} onPress={goToUsers} activeOpacity={0.9}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="people" size={26} color="#2E7D32" />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Gestión de Usuarios</Text>
            <Text style={styles.cardSubtitle}>Listar, crear y administrar usuarios registrados.</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>

        {/* Card: Asignación de Roles */}
        <TouchableOpacity style={[styles.card, styles.shadow]} onPress={goToRoleAssign} activeOpacity={0.9}>
          <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="people-circle-outline" size={26} color="#8E24AA" />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Asignación de Roles</Text>
            <Text style={styles.cardSubtitle}>Asignar o retirar roles a los usuarios registrados.</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>

        {/* Card: Cuentas de Clientes */}
        <TouchableOpacity style={[styles.card, styles.shadow]} onPress={goToCuentas} activeOpacity={0.9}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="wallet-outline" size={26} color="#FB8C00" />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Cuentas de Clientes</Text>
            <Text style={styles.cardSubtitle}>
              Crear, editar y gestionar las cuentas asociadas a clientes.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  section: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 14,
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardBody: { flex: 1, marginHorizontal: 10 },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#263238' },
  cardSubtitle: { fontSize: 13, color: '#607D8B', marginTop: 2 },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
