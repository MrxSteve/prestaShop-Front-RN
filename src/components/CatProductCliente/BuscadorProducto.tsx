import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}

// Definimos los colores del tema
const PRIMARY_BLUE = '#5D7BEF';
const TEXT_DARK = '#333';
const LIGHT_GRAY = '#F0F0F0'; // Fondo del input

export default function BuscadorProducto({ value, onChange, onSubmit }: Props) {
  return (
    <View style={styles.container}>
      
      <TextInput
        placeholder="Buscar productos..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
        style={styles.input}
        // Agregamos el icono de búsqueda dentro del input para el diseño moderno
        // Esto es solo un placeholder visual; si quieres el icono real, tendrías que usar un View.
      />

      {/* Botón de búsqueda fuera del input (estilo del ejemplo) */}
      <TouchableOpacity onPress={onSubmit} style={styles.btnBuscar}>
        <Ionicons name="search" size={20} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // Quitamos el fondo del contenedor principal para que use el fondo de la pantalla
    // o el color principal de la tarjeta/sección.
    backgroundColor: '#fff', 
    borderRadius: 25, // Más redondeado
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    
    // Sombra para un efecto elevado
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: LIGHT_GRAY,
  },

  input: {
    flex: 1,
    color: TEXT_DARK,
    fontSize: 16,
    paddingVertical: 8, // Aumentamos el padding para hacerlo más alto
    paddingHorizontal: 12,
  },

  btnBuscar: {
    backgroundColor: PRIMARY_BLUE, // Color azul principal del tema
    padding: 10, // Aumentamos el padding
    borderRadius: 20, // Circular
    marginLeft: 8,
    // Sombra sutil para el botón de búsqueda
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});