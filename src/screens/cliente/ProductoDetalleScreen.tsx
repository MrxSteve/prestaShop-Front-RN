import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClienteStackParamList } from '@/src/types/navigation';
import { productoService } from '@/src/services/productoService';
import { ProductoResponse } from '@/src/types/producto';

const { width } = Dimensions.get('window');

type RouteProps = RouteProp<ClienteStackParamList, 'ProductoDetalleCliente'>;
type NavProps = StackNavigationProp<ClienteStackParamList>;

export default function ProductoDetalleScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { id } = route.params;

  const [producto, setProducto] = useState<ProductoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await productoService.obtenerPorId(id);
      setProducto(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !producto) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const estadoEsDisponible = producto.estado === "DISPONIBLE";

  return (
    <View style={styles.container}>
      {/* Fondo azul degradado o sólido */}
      <View style={styles.topBackground} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Botón de retroceso */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Tarjeta de la imagen del producto (Sin el botón de corazón) */}
        <View style={styles.imageCard}>
          <Image
            source={{
              uri: producto.imagenUrl
                ? producto.imagenUrl
                : "https://via.placeholder.com/200?text=Sin+Imagen",
            }}
            style={styles.imagen}
          />
        </View>

        {/* Tarjeta principal de detalles */}
        <View style={styles.detailsCard}>
          <Text style={styles.nombre}>{producto.nombre}</Text>

          {/* Precio - Vuelve a la tarjeta principal */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio</Text>
            <Text style={styles.precio}>${producto.precioUnitario.toFixed(2)}</Text>
          </View>

          {/* Sección de Descripción */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Descripción</Text>
            <Text style={styles.value}>
              {producto.descripcion || "Sin descripción disponible"}
            </Text>
          </View>

          {/* Sección de Categoría */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Categoría</Text>
            <Text style={styles.value}>{producto.categoria?.nombre || "N/A"}</Text>
          </View>

          {/* Sección de Estado como Badge */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Estado</Text>
            <View style={[styles.estadoBadge, estadoEsDisponible ? styles.estadoDisponibleBadge : styles.estadoNoDisponibleBadge]}>
              <Text style={styles.estadoBadgeText}>
                {estadoEsDisponible ? "Disponible" : "No disponible"}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2F7",
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: width * 0.9,
    backgroundColor: "#5C6BC0",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  scrollViewContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 5,
  },
  
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.85,
    height: width * 0.8,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  imagen: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    borderRadius: 15,
  },
  
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.9,
    padding: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  nombre: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: 'center',
  },
  
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  priceLabel: {
    fontSize: 16,
    color: "#777",
    marginBottom: 5,
  },
  precio: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#D81B60", // Un color de acento fuerte para el precio
  },

  detailRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#777",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  
  // Estilos para el estado como un badge
  estadoBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  estadoDisponibleBadge: {
    backgroundColor: '#C8E6C9', // Verde claro
  },
  estadoNoDisponibleBadge: {
    backgroundColor: '#FFCDD2', // Rojo claro
  },
  estadoBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});