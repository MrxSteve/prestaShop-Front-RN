import { ventaService } from "@/src/services/ventaService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  background: "#F7F9FC",
  primary: "#5B72F2",
  primaryContainer: "#E9ECFF",
  cardBackground: "#FAFAFF",
  textPrimary: "#2E2E2E",
  textSecondary: "#6B6B6B",
  separator: "#E6E6E6",
  statusPaid: "#D5F5E3",
  statusPending: "#FFE5C2",
  statusPartial: "#D4E6FF",
  statusCanceled: "#FFD6D6",
  statusPaidText: "#1B5E20",
  statusPendingText: "#E67E22",
  statusPartialText: "#0D47A1",
  statusCanceledText: "#C0392B",
  green: "#27AE60",
};

const getStatus = (estado: string) => {
  const s = estado?.toLowerCase() ?? "";
  if (s.includes("pagada")) return { bg: COLORS.statusPaid, color: COLORS.statusPaidText };
  if (s.includes("pendiente")) return { bg: COLORS.statusPending, color: COLORS.statusPendingText };
  if (s.includes("parcial")) return { bg: COLORS.statusPartial, color: COLORS.statusPartialText };
  return { bg: COLORS.statusCanceled, color: COLORS.statusCanceledText };
};

export default function ClienteCompraDetalleScreen({ route }: any) {
  const { id } = route.params;
  const navigation = useNavigation();

  const [compra, setCompra] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  const loadDetalle = async () => {
    try {
      setLoading(true);
      const result = await ventaService.verDetalleCompra(id);
      setCompra(result);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } catch {
      setCompra(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetalle();
  }, [id]);

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  if (!compra)
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No se encontró esta compra.</Text>
      </View>
    );

  const fechaStr = compra.fechaVenta ?? compra.fecha ?? null;
  const fecha = fechaStr ? new Date(fechaStr).toLocaleDateString("es-ES") : "—";
  const status = getStatus(compra.estado);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="receipt-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Detalle de Compra</Text>
          </View>

          <Text style={styles.purchaseId}>#{compra.id}</Text>

          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha</Text>
              <Text style={styles.value}>{fecha}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Tipo de venta</Text>
              <Text style={styles.value}>{compra.tipoVenta}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Productos</Text>

          {(compra.detalleVentas ?? []).map((p: any) => (
            <View key={p.id} style={styles.productRow}>
              <Text style={styles.prodName}>{p.nombreProducto}</Text>
              <Text style={styles.prodDetail}>x{p.cantidad}</Text>
              <Text style={styles.prodDetail}>${p.precioUnitario}</Text>
              <Text style={styles.prodTotal}>${p.subtotal}</Text>
            </View>
          ))}

          <View style={styles.summaryBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Total pagado</Text>
              <Text style={styles.totalValue}>${compra.total}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Estado</Text>
              <View style={[styles.statusChip, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.color }]}>
                  {compra.estado}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },

  backButtonWrapper: {
    marginTop: 45,
    marginLeft: 16,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00000040",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },

  card: {
    margin: 16,
    padding: 22,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#ECEEFA",
    shadowColor: "#00000030",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: COLORS.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  purchaseId: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    marginBottom: 16,
  },

  infoBlock: {
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: COLORS.separator,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  value: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },

  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.separator,
  },

  prodName: {
    flex: 2,
    color: COLORS.textPrimary,
    fontSize: 15,
  },

  prodDetail: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  prodTotal: {
    flex: 1,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "right",
    fontSize: 15,
  },

  summaryBlock: {
    marginTop: 18,
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.green,
  },

  statusChip: {
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 5,
    minWidth: 80,
    alignItems: "center",
  },

  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
