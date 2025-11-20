import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { cuentaService } from '@/src/services/cuentaServices';
import { CuentaResponse, CuentaEstado } from '@/src/types/cuenta';
import { usuarioService } from '@/src/services/usuarioServices';
import { UsuarioResponse } from '@/src/types/usuario';


export default function CuentaDetalleScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { cuentaId } = route.params;

  const [cuenta, setCuenta] = useState<CuentaResponse | null>(null);
  const [loading, setLoading] = useState(false);

 const loadCuenta = async () => {
  try {
    setLoading(true);
    const data = await cuentaService.obtenerCuentaPorId(cuentaId);

    // Intentar obtener el nombre del cliente asociado
    let nombreCliente = `Cliente #${data.usuarioId}`;
    try {
      const usuario = await usuarioService.obtenerPorId(data.usuarioId);
      if (usuario?.nombreCompleto || usuario?.nombreCompleto) {
        nombreCliente = usuario.nombreCompleto || usuario.nombreCompleto;
      }
    } catch (err) {
      console.warn('No se pudo cargar el nombre del cliente:', err);
    }

    // Combinar ambos
    setCuenta({ ...data, nombreCliente });
  } catch (e) {
    console.warn('Error cargando cuenta', e);
    Alert.alert('Error', 'No se pudo cargar la información de la cuenta');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadCuenta();
  }, [cuentaId]);

  const getEstadoColor = (estado: CuentaEstado) => {
    switch (estado) {
      case 'ACTIVA':
        return '#4CAF50';
      case 'SUSPENDIDA':
        return '#FF9800';
      case 'CERRADA':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando cuenta...</Text>
      </View>
    );
  }

  if (!cuenta) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#999' }}>No se encontró información.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔙 Botón volver */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('CuentasClientesScreen')}
      >
        <Ionicons name="arrow-back" size={20} color="#2196F3" />
        <Text style={styles.backText}>Volver a Usuarios y Cuentas</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16 }}>
        {/* Encabezado principal */}
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="card-outline" size={28} color="#2196F3" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {cuenta.nombreCliente || `Cliente #${cuenta.usuarioId}`}
            </Text>
            <Text style={styles.subtitle}>Cuenta ID: {cuenta.id}</Text>
          </View>
          <View
            style={[
              styles.estadoChip,
              { backgroundColor: getEstadoColor(cuenta.estado) + '22' },
            ]}
          >
            <Text
              style={[
                styles.estadoText,
                { color: getEstadoColor(cuenta.estado) },
              ]}
            >
              {cuenta.estado}
            </Text>
          </View>
        </View>

        {/* Datos generales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información general</Text>

          <InfoRow label="Límite de crédito" value={`$${cuenta.limiteCredito}`} icon="cash-outline" />
          <InfoRow label="Saldo actual" value={`$${cuenta.saldoActual}`} icon="wallet-outline" />
          <InfoRow label="Fecha de apertura" value={cuenta.fechaApertura} icon="calendar-outline" />
        </View>

        {/* Datos adicionales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles adicionales</Text>

          <InfoRow label="Usuario asociado" value={`ID: ${cuenta.usuarioId}`} icon="person-outline" />
          <InfoRow
            label="Saldo disponible"
            value={cuenta.saldoActual ? `$${cuenta.saldoActual}` : 'N/D'}
            icon="cash"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const InfoRow = ({ label, value, icon }: { label: string; value: string; icon: any }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color="#2196F3" />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },

  /** 🔙 botón volver */
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 64,
    fontSize:44
  },
  backText: {
    color: '#2196F3',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 20
  },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#222' },
  subtitle: { fontSize: 13, color: '#666' },
  estadoChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  estadoText: { fontWeight: '700', fontSize: 12 },

  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 8 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: { flex: 1, marginLeft: 8, fontSize: 13, color: '#444' },
  value: { fontSize: 13, color: '#222', fontWeight: '600' },
});
