import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { rolesService } from '@/src/services/rolServices';
import { usuarioService } from '@/src/services/usuarioServices';
import type { RolResponse } from '@/src/types/roles';
import type { UsuarioResponse } from '@/src/types/usuario';

type Props = {
  visible: boolean;
  user: UsuarioResponse | null;
  onClose: () => void;
  onUpdated?: () => void; // para refrescar la lista de usuarios si se actualizan roles
};

export default function UserRolesModal({ visible, user, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [assignedIds, setAssignedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!visible || !user) return;

    const loadRoles = async () => {
      setLoading(true);
      try {
        const allRoles = await rolesService.listarTodos(0, 50);
        setRoles(allRoles.content ?? []);

        // Marcar roles asignados al usuario
        setAssignedIds(user.roles?.map(r => r.id) ?? []);
      } catch (e) {
        console.error('Error al cargar roles:', e);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [visible, user]);

  const toggleRole = async (rolId: number) => {
    if (!user) return;

    try {
      if (assignedIds.includes(rolId)) {
        await usuarioService.removerRol(user.id, rolId);
        setAssignedIds(prev => prev.filter(id => id !== rolId));
      } else {
        await usuarioService.asignarRol(user.id, rolId);
        setAssignedIds(prev => [...prev, rolId]);
      }
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error('Error al cambiar rol:', e);
    }
  };

  if (!visible || !user) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Asignar Roles a {user.nombreCompleto}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 32 }} />
          ) : (
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
              {roles.map(r => {
                const assigned = assignedIds.includes(r.id);
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.roleItem, assigned && styles.roleItemActive]}
                    onPress={() => toggleRole(r.id)}
                  >
                    <Ionicons
                      name={assigned ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={assigned ? '#2196F3' : '#888'}
                    />
                    <Text
                      style={[styles.roleName, assigned && { color: '#2196F3', fontWeight: '700' }]}
                    >
                      {r.nombre}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {roles.length === 0 && (
                <Text style={{ textAlign: 'center', color: '#999' }}>No hay roles disponibles</Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modal: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    paddingBottom: 6,
    marginBottom: 10,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#333' },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    gap: 10,
  },
  roleItemActive: { backgroundColor: '#E3F2FD' },
  roleName: { fontSize: 15, color: '#444' },
});
