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

  return (
    <View style={styles.container}>
      <CustomHeader title="Usuarios y Cuentas" />
      {/* Card: Gestión de Roles */}
      <TouchableOpacity style={styles.card} onPress={goToRoles} activeOpacity={0.85}>
        <View style={[styles.iconWrap, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="shield-checkmark" size={22} color="#2196F3" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Gestión de Roles</Text>
          <Text style={styles.cardSubtitle}>Crear, editar y eliminar roles del sistema.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>

      {/* Card: Gestión de Usuarios */}
      <TouchableOpacity style={styles.card} onPress={goToUsers} activeOpacity={0.85}>
        <View style={[styles.iconWrap, { backgroundColor: '#E8F5E9' }]}>
          <Ionicons name="people" size={22} color="#2E7D32" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Gestión de Usuarios</Text>
          <Text style={styles.cardSubtitle}>Listar, crear, editar y administrar usuarios.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>

      {/**Card: Asignacion de roles */}
     <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RoleAssignmentScreen')}>
      <View style={styles.iconWrap}>
        <Ionicons name="people-circle-outline" size={28} color="#673AB7"/>
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.cardTitle}>Asignacion de Roles</Text>
        <Text style={styles.cardSubtitle}>Asinga o retira roles a los usuarios registrados</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#888" />
     </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#f5f5f5' },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#222' },
  cardSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
});