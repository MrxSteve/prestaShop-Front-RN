import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSearch: (fechaInicio: string, fechaFin: string) => void;
}

export default function BuscarPorFechaModal({ visible, onClose, onSearch }: Props) {
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  const [showPickerInicio, setShowPickerInicio] = useState(false);
  const [showPickerFin, setShowPickerFin] = useState(false);

  const formatearFecha = (fecha: Date | null) => {
    if (!fecha) return '';
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Buscar por Fecha de Apertura</Text>

          {/* Fecha inicio */}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPickerInicio(true)}
          >
            <Text style={styles.dateLabel}>
              {fechaInicio ? formatearFecha(fechaInicio) : 'Seleccionar fecha inicio'}
            </Text>
          </TouchableOpacity>

          {/* Fecha fin */}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPickerFin(true)}
          >
            <Text style={styles.dateLabel}>
              {fechaFin ? formatearFecha(fechaFin) : 'Seleccionar fecha fin'}
            </Text>
          </TouchableOpacity>

          {/* DatePickers nativos */}
          {showPickerInicio && (
            <DateTimePicker
              value={fechaInicio || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => {
                setShowPickerInicio(false);
                if (date) setFechaInicio(date);
              }}
            />
          )}
          {showPickerFin && (
            <DateTimePicker
              value={fechaFin || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => {
                setShowPickerFin(false);
                if (date) setFechaFin(date);
              }}
            />
          )}

          {/* Botones */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#2196F3' }]}
              onPress={() => {
                if (!fechaInicio || !fechaFin) {
                  return alert('Selecciona ambas fechas');
                }
                onSearch(formatearFecha(fechaInicio), formatearFecha(fechaFin));
              }}
            >
              <Text style={styles.btnText}>Buscar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#9E9E9E' }]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 14 },
  dateBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 15,
    color: '#333',
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
