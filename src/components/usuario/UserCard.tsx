// src/components/usuario/UserCard.tsx
import { UsuarioEstado, UsuarioResponse } from '@/src/types/usuario';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  user: UsuarioResponse;
  onEdit: (u: UsuarioResponse) => void;
  onDelete: (u: UsuarioResponse) => void;
  onToggleEstado: (u: UsuarioResponse) => void; 
  onSuspender: (u: UsuarioResponse) => void;
  onAssignRoles: (u: UsuarioResponse) => void;
  onViewDetails: (u: UsuarioResponse) => void;
};

export default function UserCard({
  user, onEdit, onDelete, onToggleEstado, onSuspender, onAssignRoles, onViewDetails
}: Props) {
  const initials = user.nombreCompleto
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('');

  const estadoColor: Record<UsuarioEstado, string> = {
    ACTIVO: '#E8F5E9',
    INACTIVO: '#FFF3E0',
    SUSPENDIDO: '#FFEBEE',
  };
  const estadoTextColor: Record<UsuarioEstado, string> = {
    ACTIVO: '#2E7D32',
    INACTIVO: '#EF6C00',
    SUSPENDIDO: '#C62828',
  };

  return (
    <View style={styles.card}>
      {/* Izquierda: avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials || 'U'}</Text>
      </View>

      {/* Derecha: contenido */}
      <View style={styles.content}>
        {/* Encabezado: nombre + estado */}
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {user.nombreCompleto}
          </Text>

          <View style={[styles.chip, { backgroundColor: estadoColor[user.estado] }]}>
            <Text style={[styles.chipText, { color: estadoTextColor[user.estado] }]}>
              {user.estado}
            </Text>
          </View>
        </View>

        {/* Metadatos: etiquetas alineadas */}
        <View style={styles.metaBlock}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Email:</Text>
            <Text
              style={styles.metaValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.email}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Teléfono:</Text>
            <Text style={styles.metaValue}>{user.telefono}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>DUI:</Text>
            <Text style={styles.metaValue}>{user.dui}</Text>
          </View>
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.iconBtn, styles.infoBtn]} onPress={() => onAssignRoles(user)} accessibilityLabel="Asignar roles">
            <Ionicons name="people" size={18} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.editBtn]}
            onPress={() => onEdit(user)}
            accessibilityLabel="Editar usuario"
          >
            <Ionicons name="pencil" size={18} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.warnBtn]} onPress={() => onSuspender(user)} accessibilityLabel="Suspender usuario">
            <Ionicons name="pause-circle" size={18} color="#EF6C00" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.stateBtn]} onPress={() => onToggleEstado(user)} accessibilityLabel="Cambiar estado">
            <Ionicons name={user.estado === 'ACTIVO' ? 'remove-circle' : 'checkmark-circle'} size={18} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.deleteBtn]}
            onPress={() => {
              console.log('[DEBUG] Se presionó eliminar', user.id);
              onDelete(user);
            }}
            accessibilityLabel="Eliminar usuario"
          >
            <Ionicons name="trash" size={18} color="#E53935" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.infoBtn]}
            onPress={() => onViewDetails(user)}
            accessibilityLabel="Ver detalles"
          >
            <Ionicons name="information-circle" size={18} color="#1976D2" />
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const LABEL_WIDTH = 74; // ancho fijo para alinear las etiquetas

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    elevation: 1,
  },

  /** Avatar */
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#1976D2', fontWeight: '800' },

  /** Contenido */
  content: { flex: 1 },

  /** Encabezado */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { fontSize: 11, fontWeight: '800' },

  /** Metadatos */
  metaBlock: { marginTop: 4 },            // antes: 6
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,                          // antes: 3
    gap: 4,                                // antes: 6
  },
  metaLabel: {
    width: LABEL_WIDTH,                    // etiqueta más corta
    fontSize: 12,
    color: '#444',                         // un pelín más oscuro para legibilidad
    fontWeight: '600',
  },
  metaValue: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    flexShrink: 1,                         // evita saltos raros en pantallas estrechas
  },
  /** Acciones */
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,                         // antes: 10
    marginTop: 8,                          // antes: 10
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  infoBtn: { borderColor: '#1976D2', backgroundColor: '#E3F2FD' },
  editBtn: { borderColor: '#1976D2', backgroundColor: '#E3F2FD' },
  warnBtn: { borderColor: '#EF6C00', backgroundColor: '#FFF3E0' },
  stateBtn: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  deleteBtn: { borderColor: '#E53935', backgroundColor: '#FFEBEE' },
});
