import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import UserFormWizard from '@/src/components/usuario/UserFormWizard';
import UserList from '@/src/components/usuario/UserList';
import UserDetailModal from '@/src/components/usuario/UserDetailModal';
import { UsuarioResponse } from '@/src/types/usuario';
import UserRolesModal from '@/src/components/usuario/UserRolesModal';

export default function UsuariorManagementScreen() {
  const [showWizard, setShowWizard] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [editing, setEditing] = useState<UsuarioResponse | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rolesModalVisible, setRolesModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsuarioResponse | null>(null);

  const navigation = useNavigation<any>();

  const onViewDetails = (user: UsuarioResponse) => {
    setSelectedId(user.id);
    setDetailVisible(true);
  };

  const handleAssignRoles = (user: UsuarioResponse) => {
    setSelectedUser(user);
    setRolesModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Barra simple con botón atrás y título */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de Usuarios</Text>
      </View>

      <UserList
        onCreate={() => { setEditing(null); setShowWizard(true); }}
        onEditUser={(u) => { setEditing(u); setShowWizard(true); }}
        onViewDetails={onViewDetails}
        refreshTrigger={refresh}
        onAssignRoles={handleAssignRoles} // 👈 nuevo
      />


      {/* Modal crear/editar */}
      <UserFormWizard
        visible={showWizard}
        onClose={() => setShowWizard(false)}
        onCreated={() => {
          setShowWizard(false);
          setRefresh((x) => x + 1);
        }}
        userToEdit={editing}
      />

      {/* Modal detalle */}
      <UserDetailModal
        visible={detailVisible}
        userId={selectedId}
        onClose={() => setDetailVisible(false)}
      />

       <UserRolesModal
        visible={rolesModalVisible}
        user={selectedUser}
        onClose={() => setRolesModalVisible(false)}
        onUpdated={() => setRefresh((x) => x + 1)} // refresca la lista al guardar
      />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 45,
  },
  backBtn: { padding: 6, marginRight: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#222' },
});
