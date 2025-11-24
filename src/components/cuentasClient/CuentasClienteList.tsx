import React from 'react';
import { FlatList, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { CuentaResponse } from '@/src/types/cuenta';
import CuentasClienteCard from './CuentasClienteCard';

interface Props {
  cuentas: CuentaResponse[];
  loading: boolean;
  onRefresh: () => void;
}

export default function CuentasClienteList({ cuentas, loading, onRefresh }: Props) {
  if (loading) {
    return <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 40 }} />;
  }

  if (cuentas.length === 0) {
    return <Text style={styles.empty}>No se encontraron cuentas registradas.</Text>;
  }

  return (
    <View style={{ padding: 16, paddingBottom: 80 }}>
      <FlatList
        data={cuentas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CuentasClienteCard cuenta={item} onRefresh={onRefresh} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});
