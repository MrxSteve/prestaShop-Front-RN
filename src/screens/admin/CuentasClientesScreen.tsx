import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cuentaService } from '@/src/services/cuentaServices';
import { usuarioService } from '@/src/services/usuarioServices';
import { CuentaResponse, CuentaEstado } from '@/src/types/cuenta';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import CuentasClienteCard from '@/src/components/cuentasClient/CuentasClienteCard';
import EditarCuentaModal from '@/src/components/cuentasClient/EditarCuentaModal';
import BuscarPorFechaModal from '@/src/components/cuentasClient/BuscarPorFechaModal';
import BuscarPorCreditoModal from '@/src/components/cuentasClient/BuscarPorCreditoModal';

export default function CuentasClientesScreen() {
  const navigation = useNavigation<any>();
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<CuentaEstado | 'TODAS'>('TODAS');
  const [total, setTotal] = useState<number>(0);

  // Modal edición
  const [editVisible, setEditVisible] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaResponse | null>(null);

  // Modales de búsqueda
  const [modalFechaVisible, setModalFechaVisible] = useState(false);
  const [modalCreditoVisible, setModalCreditoVisible] = useState(false);

  // ======================
  // CARGA DE CUENTAS
  // ======================
  const loadCuentas = async () => {
    try {
      setLoading(true);
      let cuentasData: CuentaResponse[] = [];

      if (filtroEstado === 'TODAS') {
        const res = await cuentaService.listarCuentas();
        cuentasData = res.content || [];
        setTotal(res.totalElements || cuentasData.length);
      } else {
        const res = await cuentaService.buscarPorEstado({ estado: filtroEstado });
        cuentasData = res.content || [];
        setTotal(res.totalElements || cuentasData.length);
      }

      // Asignar nombre del usuario
      const resUsuarios = await usuarioService.listar();
      const cuentasConNombre = cuentasData.map((cuenta) => {
        const usuario = resUsuarios.content?.find((u) => u.id === cuenta.usuarioId);
        return {
          ...cuenta,
          nombreCliente: usuario?.nombreCompleto || `Cliente #${cuenta.usuarioId}`,
        };
      });

      setCuentas(cuentasConNombre);
    } catch (e) {
      console.warn('Error cargando cuentas', e);
      Alert.alert('Error', 'No se pudieron cargar las cuentas');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCuentas();
    }, [filtroEstado])
  );

  // ======================
  // BUSCAR POR FECHAS
  // ======================
  const handleBuscarPorFechas = async (fechaInicio: string, fechaFin: string) => {
    if (!fechaInicio || !fechaFin) {
      return Alert.alert('Campos requeridos', 'Debes ingresar ambas fechas.');
    }

    try {
      setLoading(true);
      const res = await cuentaService.buscarPorFechaApertura({
        fechaInicio,
        fechaFin,
        pageable: { page: 0, size: 10, sort: ['id'] },
      });

      const cuentasData = res.content || [];
      const resUsuarios = await usuarioService.listar();

      const cuentasConNombre = cuentasData.map((cuenta: CuentaResponse) => {
        const usuario = resUsuarios.content?.find((u) => u.id === cuenta.usuarioId);
        return {
          ...cuenta,
          nombreCliente: usuario?.nombreCompleto || `Cliente #${cuenta.usuarioId}`,
        };
      });

      setCuentas(cuentasConNombre);
      setTotal(cuentasConNombre.length);
      setModalFechaVisible(false);
    } catch (e) {
      console.warn('Error buscando por fechas', e);
      Alert.alert('Error', 'No se encontraron cuentas en ese rango de fechas.');
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // BUSCAR POR CRÉDITO
  // ======================
  const handleBuscarPorCredito = async (min: number, max: number) => {
    if (!min || !max) {
      return Alert.alert('Campos requeridos', 'Debes ingresar ambos límites.');
    }

    try {
      setLoading(true);
      const res = await cuentaService.buscarPorLimiteCredito({
        min,
        max,
        pageable: { page: 0, size: 10, sort: ['saldoActual'] },
      });

      const cuentasData = res.content || [];
      const resUsuarios = await usuarioService.listar();

      const cuentasConNombre = cuentasData.map((cuenta: CuentaResponse) => {
        const usuario = resUsuarios.content?.find((u) => u.id === cuenta.usuarioId);
        return {
          ...cuenta,
          nombreCliente: usuario?.nombreCompleto || `Cliente #${cuenta.usuarioId}`,
        };
      });

      setCuentas(cuentasConNombre);
      setTotal(cuentasConNombre.length);
      setModalCreditoVisible(false);
    } catch (e) {
      console.warn('Error buscando por crédito', e);
      Alert.alert('Error', 'No se encontraron cuentas en ese rango de crédito.');
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <View style={styles.container}>
      {/* Botón volver */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('AdminUsuariosYcuentas')}
      >
        <Ionicons name="arrow-back" size={20} color="#2196F3" />
        <Text style={styles.backText}>Usuarios y Cuentas</Text>
      </TouchableOpacity>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <Ionicons name="filter-outline" size={18} color="#2196F3" />
        <Picker
          selectedValue={filtroEstado}
          onValueChange={(value) => setFiltroEstado(value)}
          style={styles.picker}
          dropdownIconColor="#2196F3"
        >
          <Picker.Item label="Todas las cuentas" value="TODAS" />
          <Picker.Item label="Activas" value="ACTIVA" />
          <Picker.Item label="Suspendidas" value="SUSPENDIDA" />
          <Picker.Item label="Cerradas" value="CERRADA" />
        </Picker>

        {/* Botones de búsqueda */}
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setModalFechaVisible(true)}
          >
            <Ionicons name="calendar-outline" size={22} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setModalCreditoVisible(true)}
          >
            <Ionicons name="cash-outline" size={22} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contador */}
      {!loading && (
        <Text style={styles.counter}>
          Mostrando <Text style={{ fontWeight: '700' }}>{total}</Text> cuentas.
        </Text>
      )}

      {/* Lista */}
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={cuentas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CuentasClienteCard
              cuenta={item}
              onRefresh={loadCuentas}
              onEdit={(c) => {
                setCuentaSeleccionada(c);
                setEditVisible(true);
              }}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No se encontraron cuentas.</Text>
          }
        />
      )}

      {/* Modales */}
      <BuscarPorFechaModal
        visible={modalFechaVisible}
        onClose={() => setModalFechaVisible(false)}
        onSearch={handleBuscarPorFechas}
      />

      <BuscarPorCreditoModal
        visible={modalCreditoVisible}
        onClose={() => setModalCreditoVisible(false)}
        onSearch={handleBuscarPorCredito}
      />

      {/* Modal editar */}
      <EditarCuentaModal
        visible={editVisible}
        cuenta={cuentaSeleccionada}
        onClose={() => setEditVisible(false)}
        onUpdated={loadCuentas}
      />

      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NuevaCuentaScreen')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 64,
  },
  backText: { color: '#2196F3', fontWeight: '700', marginLeft: 6, fontSize: 18 },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
  },
  picker: { flex: 1, height: 42, color: '#111' },
  iconButton: { paddingHorizontal: 6 },
  counter: { textAlign: 'center', color: '#374151', fontSize: 14, marginVertical: 10 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});
