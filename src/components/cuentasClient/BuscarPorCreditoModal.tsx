// src/components/cuentasClient/BuscarPorCreditoModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSearch: (min: number, max: number) => void;
}

export default function BuscarPorCreditoModal({ visible, onClose, onSearch }: Props) {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Buscar por Límite de Crédito</Text>

          <TextInput
            style={styles.input}
            placeholder="Mínimo"
            keyboardType="numeric"
            value={min}
            onChangeText={setMin}
          />
          <TextInput
            style={styles.input}
            placeholder="Máximo"
            keyboardType="numeric"
            value={max}
            onChangeText={setMax}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#2196F3' }]}
              onPress={() => onSearch(Number(min), Number(max))}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
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
