import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { rolesService } from '../../services/rolServices';
import type { RolResponse, RolRequest } from '../../types/roles';
import { RoleCard } from './RoleCard';

interface RoleListProps {
  onEditRole: (rol: RolResponse) => void;
  onAddRole: () => void;
  refreshTrigger?: number;
}

export const RoleList: React.FC<RoleListProps> = ({ onEditRole, onAddRole, refreshTrigger = 0 }) => {
  const [items, setItems] = useState<RolResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // opción segura: sin sort
      const page = await rolesService.listarTodos(0, 50);
      setItems(page?.content ?? []);
    } catch (err: any) {
      const debug = err?.response
        ? {
            status: err.response.status,
            data: err.response.data,
            url: err.config?.baseURL + err.config?.url,
            method: err.config?.method,
          }
        : { msg: String(err) };
      console.warn('Error al obtener roles:', debug);
      Alert.alert('Error', 'No se pudieron cargar los roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await rolesService.eliminar(id);
      await load();
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar el rol.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: RolResponse }) => (
    <RoleCard rol={item} onEdit={onEditRole} onDelete={handleDelete} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.title}>Roles Ingresados</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddRole}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>No hay roles.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10, // 👈 separa del header
  },
  toolbar: {
    flexDirection: 'row', padding: 12, alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#fff',
    borderBottomColor: '#eee', borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '700' },
  addButton: { backgroundColor: '#2196F3', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  addButtonText: { color: '#fff', fontWeight: '700' },
});
