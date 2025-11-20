import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Asegúrate de que esta ruta de importación sea correcta
import EstadoBadge from './EstadoBadge'; 
import { ProductoResponse } from '@/src/types/producto';
import { ClienteStackParamList } from '@/src/types/navigation';

interface Props {
  producto: ProductoResponse;
}

// Paleta de Colores del Tema Moderno
const PRIMARY_BLUE = '#5D7BEF';
const LIGHT_BLUE = '#DAE6FE'; // Fondo de la tarjeta
const TEXT_DARK_BLUE = '#34495E'; // Color más oscuro para el texto principal
const ACCENT_RED = '#E74C3C'; // Un rojo para el énfasis, si se necesita

export default function ProductoCard({ producto }: Props) {

  const navigation = useNavigation<StackNavigationProp<ClienteStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("ProductoDetalleCliente", { id: producto.id })
      }
      activeOpacity={0.9}
    >
      
      {/* EstadoBadge se posiciona absolutamente sobre la tarjeta */}
      <EstadoBadge estado={producto.estado} /> 

      {/* Contenedor de la Imagen (Ahora Cuadrado) */}
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: producto.imagenUrl
              ? producto.imagenUrl
              : "https://via.placeholder.com/150?text=Sin+Imagen"
          }}
          style={styles.imagen}
        />
      </View>

      {/* Nombre del Producto */}
      <Text style={styles.nombre} numberOfLines={1}>
        {producto.nombre}
      </Text>
      
      {/* Precio y Puntos de detalle */}
      <View style={styles.detailsRow}>
          <Text style={styles.precio}>${producto.precioUnitario.toFixed(2)}</Text>
          {/* Los puntos ahora serán del color principal, no dorados */}
          <Text style={styles.dots}>••••</Text> 
      </View>
      
    </TouchableOpacity>
  );

}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: LIGHT_BLUE, // Fondo azul claro para la tarjeta
    margin: 8,
    borderRadius: 20, // Bordes redondeados
    padding: 14,
    alignItems: "center",
    maxWidth: '45%', 

    // Sombra sutil
    elevation: 8,
    shadowColor: PRIMARY_BLUE,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  
  imageWrapper: {
    // Contenedor CUADRADO de la imagen
    width: 120,
    height: 120,
    borderRadius: 15, // Bordes redondeados para el cuadrado
    backgroundColor: PRIMARY_BLUE, // Fondo azul oscuro
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    
    // Eliminado: borderWidth y borderColor para quitar el borde amarillo
    zIndex: 2, 
  },
  imagen: {
    width: '90%', // La imagen ocupa el 90% del cuadrado
    height: '90%',
    borderRadius: 10, // Bordes un poco menos redondeados que el contenedor
    resizeMode: 'contain', // Ajuste de la imagen
  },
  nombre: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK_BLUE, // Texto más oscuro para mejor contraste
    textAlign: "center",
    marginBottom: 4,
    width: '100%',
  },
  detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 5,
      marginTop: 5, // Un poco más de margen superior para separar
  },
  precio: {
    fontSize: 18,
    fontWeight: "800",
    color: PRIMARY_BLUE, // Precio en el color principal
  },
  dots: {
      fontSize: 18,
      color: PRIMARY_BLUE, // Puntos en el color principal
      fontWeight: 'bold',
      marginTop: -10, 
  }
});