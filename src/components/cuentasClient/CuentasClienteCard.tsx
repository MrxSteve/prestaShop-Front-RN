import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CuentaResponse, CuentaEstado } from '@/src/types/cuenta';
import { cuentaService } from '@/src/services/cuentaServices';
import { useNavigation } from '@react-navigation/native';

interface Props {
  cuenta: CuentaResponse;
  onRefresh: () => void;
  onEdit: (cuenta: CuentaResponse) => void;
}

export default function CuentasClienteCard({ cuenta, onRefresh, onEdit }: Props) {
  const navigation = useNavigation<any>();

  const getEstadoColor = (estado: CuentaEstado) => {
    switch (estado) {
      case 'ACTIVA':
        return '#4CAF50';
      case 'SUSPENDIDA':
        return '#FFC107';
      case 'CERRADA':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  // 🔒 Cerrar cuenta
  const handleCerrarCuenta = async () => {
    if (cuenta.saldoActual > 0) {
      return Alert.alert(
        'No se puede cerrar',
        'Esta cuenta tiene saldo pendiente. Debe estar en $0.00 para cerrarse.'
      );
    }

    Alert.alert(
      'Confirmar cierre',
      `¿Deseas cerrar la cuenta de ${cuenta.nombreCliente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await cuentaService.cerrarCuenta(cuenta.id);
              Alert.alert('Éxito', 'La cuenta fue cerrada correctamente.');
              onRefresh();
            } catch {
              Alert.alert('Error', 'No se pudo cerrar la cuenta.');
            }
          },
        },
      ]
    );
  };

  // 🔄 Activar cuenta
  const handleActivarCuenta = async () => {
    Alert.alert(
      'Reactivar cuenta',
      `¿Deseas activar nuevamente la cuenta de ${cuenta.nombreCliente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Activar',
          onPress: async () => {
            try {
              await cuentaService.activarCuenta(cuenta.id);
              Alert.alert('Éxito', 'La cuenta fue activada correctamente.');
              onRefresh();
            } catch {
              Alert.alert('Error', 'No se pudo activar la cuenta.');
            }
          },
        },
      ]
    );
  };

  // 🟠 Suspender cuenta
  const handleSuspenderCuenta = async () => {
    Alert.alert(
      'Suspender cuenta',
      `¿Deseas suspender la cuenta de ${cuenta.nombreCliente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Suspender',
          onPress: async () => {
            try {
              await cuentaService.suspenderCuenta(cuenta.id);
              Alert.alert('Éxito', 'La cuenta fue suspendida correctamente.');
              onRefresh();
            } catch {
              Alert.alert('Error', 'No se pudo suspender la cuenta.');
            }
          },
        },
      ]
    );
  };

  // 🗑️ Eliminar cuenta (solo si está CERRADA)
  const handleEliminarCuenta = async () => {
    if (cuenta.estado !== 'CERRADA') {
      return Alert.alert(
        'Acción no permitida',
        'Solo se pueden eliminar las cuentas que estén en estado CERRADA.'
      );
    }

    Alert.alert(
      'Eliminar cuenta',
      `¿Seguro deseas eliminar la cuenta de ${cuenta.nombreCliente}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await cuentaService.eliminarCuenta(cuenta.id);
              Alert.alert('Éxito', 'La cuenta fue eliminada correctamente.');
              onRefresh();
            } catch (e) {
              console.warn('Error eliminando cuenta:', e);
              Alert.alert('Error', 'No se pudo eliminar la cuenta.');
            }
          },
        },
      ]
    );
  };

  // 👉 Navegar al detalle
  const handleVerDetalle = () => {
    navigation.navigate('CuentaDetalleScreen', { cuentaId: cuenta.id });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={handleVerDetalle}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#E8EAF6' }]}>
          <Ionicons name="card-outline" size={26} color="#3F51B5" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.clientName}>{cuenta.nombreCliente}</Text>
          <Text style={styles.clientSub}>Cuenta ID: {cuenta.id}</Text>
        </View>
        <View
          style={[
            styles.statusChip,
            { backgroundColor: getEstadoColor(cuenta.estado) + '22' },
          ]}
        >
          <Text style={[styles.statusText, { color: getEstadoColor(cuenta.estado) }]}>
            {cuenta.estado}
          </Text>
        </View>
      </View>

      {/* Información */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={18} color="#4CAF50" />
          <Text style={styles.infoLabel}>Límite crédito</Text>
          <Text style={styles.infoValue}>${cuenta.limiteCredito.toFixed(2)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="wallet-outline" size={18} color="#2196F3" />
          <Text style={styles.infoLabel}>Saldo actual</Text>
          <Text
            style={[
              styles.infoValue,
              { color: cuenta.saldoActual > 0 ? '#E53935' : '#4CAF50' },
            ]}
          >
            ${cuenta.saldoActual.toFixed(2)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#673AB7" />
          <Text style={styles.infoLabel}>Apertura</Text>
          <Text style={styles.infoValue}>{cuenta.fechaApertura}</Text>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.footer}>
        {cuenta.estado === 'ACTIVA' && (
          <>
            <TouchableOpacity
              style={[styles.actionCard, styles.suspendBtn]}
              onPress={handleSuspenderCuenta}
            >
             <Text style={styles.actionLabel}>Suspender</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.editBtn]}
              onPress={() => onEdit(cuenta)}
            >
              <Text style={styles.actionLabel}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.closeBtn]}
              onPress={handleCerrarCuenta}
            >
              <Text style={styles.actionLabel}>Cerrar</Text>
            </TouchableOpacity>
          </>
        )}

        {(cuenta.estado === 'SUSPENDIDA' || cuenta.estado === 'CERRADA') && (
          <TouchableOpacity
            style={[styles.actionCard, styles.activateBtn]}
            onPress={handleActivarCuenta}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" />
          </TouchableOpacity>
        )}

        {cuenta.estado === 'CERRADA' && (
          <TouchableOpacity
            style={[styles.actionCard, styles.deleteBtn]}
            onPress={handleEliminarCuenta}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  clientName: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
  clientSub: { fontSize: 12, color: '#64748B' },
  statusChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusText: { fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
  infoContainer: {
    marginTop: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  suspendBtn: { backgroundColor: '#F59E0B' },
  editBtn: { backgroundColor: '#EAB308' },
  closeBtn: { backgroundColor: '#EF4444' },
  activateBtn: { backgroundColor: '#10B981' },
  deleteBtn: {
    backgroundColor: '#6B7280',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});
