import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import EstadoBadge from './EstadoBadge';
import { ProductoResponse } from '@/src/types/producto';
import { ClienteStackParamList } from '@/src/types/navigation';

interface Props {
  producto: ProductoResponse;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

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
      <EstadoBadge estado={producto.estado} />

      {/* Imagen a la izquierda */}
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

      {/* Contenido */}
      <View style={styles.infoSection}>
        <View style={styles.topRow}>
          <Text style={styles.nombre} numberOfLines={1}>
            {producto.nombre}
          </Text>
          <Text style={styles.precio}>${producto.precioUnitario.toFixed(2)}</Text>
        </View>

        <Text style={styles.description} numberOfLines={1}>
          {producto.descripcion ?? "Producto disponible"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const CARD_WIDTH = SCREEN_WIDTH * 0.92;
const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",

    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    marginVertical: 10,

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 14,
  },

  imagen: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  infoSection: {
    flex: 1,
    justifyContent: "center",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  nombre: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginRight: 6,
  },

  precio: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
  },

  subtitle: {
    fontSize: 13,
    color: "#6C757D",
    marginBottom: 2,
  },

  description: {
    fontSize: 13,
    color: "#6C757D",
  },
});
