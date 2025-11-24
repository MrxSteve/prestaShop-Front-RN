import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cuentaService } from '@/src/services/cuentaServices';
import { usuarioService } from '@/src/services/usuarioServices';
import { CuentaEstado, CreateCuentaRequest } from '@/src/types/cuenta';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NuevaCuentaScreen() {
  const navigation = useNavigation<any>();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [limiteCredito, setLimiteCredito] = useState('');
  const [saldoActual, setSaldoActual] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        setLoading(true);
        const res = await usuarioService.listar();
        const todos = res.content || [];

        const soloClientes = todos.filter((u: any) =>
          u.roles?.some((r: any) => r.nombre?.toUpperCase() === 'CLIENTE')
        );

        setUsuarios(soloClientes);
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'No se pudieron cargar los clientes.');
      } finally {
        setLoading(false);
      }
    };
    loadUsuarios();
  }, []);

  const handleCrearCuenta = async () => {
    if (!usuarioId || !limiteCredito) {
      Alert.alert('Campos requeridos', 'Selecciona un cliente y asigna un límite de crédito.');
      return;
    }

    const nuevaCuenta: CreateCuentaRequest = {
      usuarioId,
      limiteCredito: parseFloat(limiteCredito),
      saldoActual: saldoActual ? parseFloat(saldoActual) : 0,
      fechaApertura: new Date().toISOString().split('T')[0],
      estado: CuentaEstado.ACTIVA,
    };

    try {
      setLoading(true);
      await cuentaService.crearCuenta(nuevaCuenta);
      Alert.alert('Éxito', 'Cuenta creada correctamente.');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#F9FAFB']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón Volver */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#2196F3" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {/* Card principal */}
        <View style={styles.card}>
          <Text style={styles.title}>Registrar Nueva Cuenta</Text>

          {/* Cliente */}
          <Text style={styles.label}>Cliente</Text>
          <View style={styles.pickerContainer}>
            {loading ? (
              <ActivityIndicator color="#2196F3" style={{ marginVertical: 10 }} />
            ) : (
              <Picker
                selectedValue={usuarioId}
                onValueChange={(value) => setUsuarioId(value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un cliente" value={null} style={{fontSize: 15}} />
                {usuarios.map((u) => (
                  <Picker.Item
                    key={u.id}
                    label={u.nombreCompleto || u.nombre || `Cliente #${u.id}`}
                    value={u.id}
                  />
                ))}
              </Picker>
            )}
          </View>

          {/* Límite de crédito */}
          <Text style={styles.label}>Límite de crédito</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ej: 500"
            placeholderTextColor="#aaa"
            value={limiteCredito}
            onChangeText={setLimiteCredito}
          />

          {/* Saldo actual */}
          <Text style={styles.label}>Saldo actual (opcional)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ej: 0"
            placeholderTextColor="#aaa"
            value={saldoActual}
            onChangeText={setSaldoActual}
          />

          {/* Botón Guardar */}
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleCrearCuenta}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.btnText}>Guardar Cuenta</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 70,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#2196F3',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  picker: {
    height: 44,
    backgroundColor: '#F9FAFB',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    color: '#111',
    marginBottom: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
});
