import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { RoleForm } from '../../components/Roles/RoleForm';
import { RoleList } from '../../components/Roles/RoleList';
import { rolesService } from '../../services/rolServices';
import type { RolRequest, RolResponse } from '../../types/roles';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function RoleManagementScreen() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RolResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigation = useNavigation<any>();

  const handleAddRole = () => {
    setSelectedRole(null);
    setShowForm(true);
  };

  const handleEditRole = (rol: RolResponse) => {
    setSelectedRole(rol);
    setShowForm(true);
  };

  const handleSaveRole = async (rolData: RolRequest) => {
    try {
      setLoading(true);

      if (selectedRole) {
        await rolesService.actualizar(Number(selectedRole.id), rolData);
        Alert.alert('Éxito', 'Rol actualizado correctamente');
      } else {
        await rolesService.crear(rolData);
        Alert.alert('Éxito', 'Rol creado correctamente');
      }

      setShowForm(false);
      setSelectedRole(null);
      setRefreshTrigger((p) => p + 1);
    } catch (error: any) {
      console.error('Error saving role:', error);

      let msg = 'Error al guardar el rol';
      if (error?.response?.status === 409) msg = 'Ya existe un rol con ese nombre';
      else if (error?.response?.status === 400) msg = 'Datos inválidos. Verifica la información';
      else if (error?.code === 'NETWORK_ERROR') msg = 'Error de conexión. Verifica tu internet';

      Alert.alert('Error', msg);
      throw error; // para que el form desactive loading
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedRole(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de Roles</Text>
      </View>

      <View style={styles.content}>
        <RoleList
          onEditRole={handleEditRole}
          onAddRole={handleAddRole}
          refreshTrigger={refreshTrigger}
        />
      </View>

      <Modal visible={showForm} transparent animationType="fade" onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <RoleForm
            rol={selectedRole}
            onSave={handleSaveRole}
            onCancel={handleCancel}
            loading={loading}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center',
  },
   topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 45
  },
   backBtn: {
    padding: 6,
    marginRight: 8,
  },
   title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  }
});
