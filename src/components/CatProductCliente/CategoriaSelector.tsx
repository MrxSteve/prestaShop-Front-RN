import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { CategoriaResponse } from '@/src/types/catalog';

// Colores basados en el ejemplo
const PRIMARY_BLUE = '#5D7BEF';
const LIGHT_GRAY = '#E0F2F7'; // Color de fondo general
const TEXT_DARK = '#333333';

interface Props {
  categorias: CategoriaResponse[];
  categoriaSeleccionada: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoriaSelector({
  categorias,
  categoriaSeleccionada,
  onSelect
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        
        {/* Opción "Todas" */}
        <TouchableOpacity
          style={[
            styles.chip,
            categoriaSeleccionada === null && styles.chipSelected
          ]}
          onPress={() => onSelect(null)}
        >
          <Text style={[
            styles.chipText,
            categoriaSeleccionada === null && styles.chipTextSelected
          ]}>
            Todas
          </Text>
        </TouchableOpacity>

        {categorias.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.chip,
              categoriaSeleccionada === cat.id && styles.chipSelected
            ]}
            onPress={() => onSelect(cat.id)}
          >
            <Text
              style={[
                styles.chipText,
                categoriaSeleccionada === cat.id && styles.chipTextSelected
              ]}
            >
              {cat.nombre}
            </Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingLeft: 10, // Ajustar el padding para la scrollview
    backgroundColor: 'transparent', // Asumiendo que el fondo de la pantalla lo maneja otro componente
  },
  chip: {
    backgroundColor: LIGHT_GRAY, // Fondo claro para las no seleccionadas
    borderRadius: 12, // Bordes menos agresivos
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10, // Espacio horizontal entre chips
    borderWidth: 1,
    borderColor: 'transparent', // Para evitar que se "mueva" al seleccionar
  },
  chipSelected: {
    backgroundColor: PRIMARY_BLUE, // Fondo azul principal al seleccionar
    borderWidth: 1,
    borderColor: PRIMARY_BLUE, // Borde para destacar
    
    // Sombra sutil para el chip seleccionado
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  chipText: {
    color: TEXT_DARK, // Texto oscuro por defecto
    fontWeight: '500',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff', // Texto blanco al seleccionar
    fontWeight: '700',
  },
});