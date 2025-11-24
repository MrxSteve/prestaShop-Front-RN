import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EstadoProducto } from '@/src/types/producto';

interface Props {
  estado: EstadoProducto;
}

// Definimos los colores del tema
const DISPONIBLE_COLOR = '#388E3C'; // Verde oscuro
const NO_DISPONIBLE_COLOR = '#D32F2F'; // Rojo oscuro

export default function EstadoBadge({ estado }: Props) {
  // Asegúrate de que `EstadoProducto` esté correctamente importado y definido
  const esDisponible = estado === 'DISPONIBLE'; // Asumiendo que `EstadoProducto` es un string enum

  return (
    <View style={[styles.badge, esDisponible ? styles.disponible : styles.noDisponible]}>
      <Text style={styles.text}>
        {esDisponible ? "DISPONIBLE" : "AGOTADO"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    // Posicionamiento absoluto para que flote sobre la tarjeta
    position: 'absolute',
    top: 10, // Un poco más adentro del borde
    right: 10,
    
    
    // Estilo de etiqueta
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15, // Más redondeado (pastilla)
    zIndex: 10,
    
    // Sombra para darle un efecto elevado
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    
  },
  disponible: {
    backgroundColor: DISPONIBLE_COLOR,
  },
  noDisponible: {
    backgroundColor: NO_DISPONIBLE_COLOR,
  },
  text: {
    color: '#fff',
    fontSize: 10, // Fuente pequeña y en mayúsculas para destacar
    fontWeight: '800', // Muy negrita
    letterSpacing: 0.5,
  },
});