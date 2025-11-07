import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UsuarioEstado, UsuarioResponse } from '@/src/types/usuario';
import { usuarioService } from '@/src/services/usuarioServices';
import UserCard from './UserCard';

type Props = {
  onCreate?: () => void;               
  onEditUser: (u: UsuarioResponse) => void;
  onViewDetails: (u: UsuarioResponse) => void;
  refreshTrigger?: number;     
   onAssignRoles: (u: UsuarioResponse) => void;         
};

export default function UserList({
  onCreate,
  onEditUser,
  onViewDetails,
  onAssignRoles,
  refreshTrigger = 0,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UsuarioResponse[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState<UsuarioEstado | 'TODOS'>('TODOS');

  const load = async (reset = false) => {
  try {
    setLoading(true);
    const p = reset ? 0 : page;
    let res;

    const query = q.trim();

    if (query.length > 0) {
      if (query.includes('@')) {
        // 🔍 Buscar por email
        const user = await usuarioService.buscarPorEmail(query);
        res = { content: user ? [user] : [], last: true };
      } else if (/^\d{8}-\d$/.test(query)) {
        // 🔍 Buscar por DUI (formato 12345678-9)
        const user = await usuarioService.buscarPorDui(query);
        res = { content: user ? [user] : [], last: true };
      } else {
        // 🔍 Buscar por nombre
        res = await usuarioService.buscarPorNombre(query, p, 10);
      }
    } else if (estado !== 'TODOS') {
      res = await usuarioService.buscarPorEstado(estado as UsuarioEstado, p, 10);
    } else {
      res = await usuarioService.listar(p, 10);
    }

    setItems(prev => (reset ? res.content : [...prev, ...res.content]));
    setPage(p + 1);
    setLastPage(res.last);
  } catch (e) {
    console.warn('Error loading users', e);
    Alert.alert('Error', 'No se pudieron cargar los usuarios');
  } finally {
    setLoading(false);
  }
};


// 🔹 Ejecuta búsqueda automática al cambiar q o estado
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    setItems([]);
    setPage(0);
    setLastPage(false);
    load(true);
  }, 500); // medio segundo de espera (evita llamar en cada tecla)

  return () => clearTimeout(delayDebounce);
}, [estado, q, refreshTrigger]);

  const onEnd = () => {
    if (loading || lastPage) return;
    load(false);
  };

  const handleDelete = async (u: UsuarioResponse) => {
    Alert.alert('Confirmar', `¿Eliminar usuario "${u.nombreCompleto}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await usuarioService.eliminar(u.id);
            setItems(prev => prev.filter(x => x.id !== u.id));
          } catch (e) {
            Alert.alert('Error', 'No se pudo eliminar el usuario');
          }
        },
      },
    ]);
  };

  const handleToggleEstado = async (u: UsuarioResponse) => {
    try {
      const nuevoEstado: UsuarioEstado = u.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
      await usuarioService.cambiarEstado(u.id, nuevoEstado);
      await load(true);
    } catch (e) {
      Alert.alert('Error', 'No se pudo cambiar el estado');
    }
  };

  const handleSuspender = async (u: UsuarioResponse) => {
    try {
      const updated = await usuarioService.suspender(u.id);
      setItems(prev => prev.map(x => (x.id === u.id ? updated : x)));
    } catch (e) {
      Alert.alert('Error', 'No se pudo suspender');
    }
  };



 const Header = (
  <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6 }}>
    {/* 🔹 Toolbar principal: buscador + botón Nuevo */}
    <View style={styles.toolbarRow}>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#777" />
        <TextInput
          style={styles.search}
          placeholder="Buscar por nombre, email o DUI..."
          placeholderTextColor="#9E9E9E"
          value={q}
          onChangeText={setQ}
          onSubmitEditing={() => load(true)} // 👈 dispara la búsqueda manual
        />
        {q.length > 0 && (
          <TouchableOpacity onPress={() => { setQ(''); load(true); }}>
            <Ionicons name="close" size={16} color="#777" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={onCreate}>
        <Ionicons name="person-add" size={16} color="#fff" />
        <Text style={styles.addText}>Nuevo</Text>
      </TouchableOpacity>
    </View>

    {/* 🔹 Filtros */}
    <View style={styles.filtersWrap}>
      {(['TODOS', 'ACTIVO', 'INACTIVO', 'SUSPENDIDO'] as const).map(opt => (
        <TouchableOpacity
          key={opt}
          onPress={() => setEstado(opt)}
          style={[styles.filterChip, estado === opt && styles.filterActive]}
        >
          <Text style={[styles.filterText, estado === opt && styles.filterTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);


  return (
    <FlatList
      data={items}
      ListHeaderComponent={Header}
      keyExtractor={(i) => String(i.id)}
      renderItem={({ item }) => (
        <UserCard
          user={item}
          onEdit={onEditUser}
          onDelete={handleDelete}
          onToggleEstado={handleToggleEstado}
          onSuspender={handleSuspender}
          onAssignRoles={onAssignRoles}
          onViewDetails={onViewDetails} 
        />
      )}
      onEndReached={onEnd}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loading ? <ActivityIndicator style={{ margin: 16 }} /> : <View style={{ height: 8 }} />
      }
      contentContainerStyle={{
        paddingTop: 10,         
        paddingBottom: 24,
        paddingHorizontal: 12,
        backgroundColor: '#f5f5f5',
      }}
    />
    
  );
}

const styles = StyleSheet.create({
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 8,
  },
  search: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    color: '#333',
    marginHorizontal: 6,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  addText: { color: '#fff', fontWeight: '700', marginLeft: 6, fontSize: 13 },
  filtersWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  filterActive: { backgroundColor: '#E3F2FD', borderColor: '#2196F3' },
  filterText: { color: '#666', fontWeight: '700', fontSize: 12 },
  filterTextActive: { color: '#2196F3' },
});
