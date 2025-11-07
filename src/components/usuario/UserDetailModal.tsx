import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usuarioService } from '@/src/services/usuarioServices';
import { UsuarioResponse } from '@/src/types/usuario';

type Props = {
  visible: boolean;
  userId?: number | null;
  onClose: () => void;
};

export default function UserDetailModal({ visible, userId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UsuarioResponse | null>(null);

  useEffect(() => {
    if (!userId || !visible) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await usuarioService.obtenerPorId(userId);
        setUser(data);
      } catch (e) {
        console.error('Error al obtener detalles del usuario:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Detalle del Usuario</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 32 }} />
          ) : (
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 24,
                paddingTop: 8, // un poco de aire arriba del contenido
              }}
            >
              {user ? (
                <>
                  <View style={styles.field}>
                    <Text style={styles.label}>Nombre completo</Text>
                    <Text style={styles.value}>{user.nombreCompleto}</Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user.email}</Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Teléfono</Text>
                    <Text style={styles.value}>{user.telefono}</Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>DUI</Text>
                    <Text style={styles.value}>{user.dui}</Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Estado</Text>
                    <Text style={[styles.value, { color: '#1976D2' }]}>{user.estado}</Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Roles</Text>
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((r) => (
                        <Text key={r.id} style={[styles.value, { color: '#444' }]}>
                          • {r.nombre}
                        </Text>
                      ))
                    ) : (
                      <Text style={[styles.value, { color: '#999' }]}>Sin roles asignados</Text>
                    )}
                  </View>
                </>
              ) : (
                <Text style={{ textAlign: 'center', color: '#888' }}>No se encontró información.</Text>
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
    justifyContent: 'center', // 👈 centra verticalmente el modal
    alignItems: 'center',     // 👈 centra horizontalmente
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%', // evita que el modal sobrepase la pantalla
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 15,
    color: '#333',
  },
});
