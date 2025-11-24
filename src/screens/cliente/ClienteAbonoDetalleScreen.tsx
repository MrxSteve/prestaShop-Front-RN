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
import { Ionicons } from "@expo/vector-icons";
import { abonoService } from "@/src/services/abonoService";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  background: "#F7F9FC",
  primary: "#5B72F2",
  primaryContainer: "#E9ECFF",
  cardBackground: "#FAFAFF",
  textPrimary: "#2E2E2E",
  textSecondary: "#6B6B6B",
  separator: "#E6E6E6",

  // Colores de estado igual que el ejemplo
  statusAppliedBg: "#D5F5E3",
  statusPendingBg: "#FFE5C2",
  statusRejectedBg: "#FFD6D6",

  statusAppliedText: "#1B5E20",
  statusPendingText: "#E67E22",
  statusRejectedText: "#C0392B",

  green: "#27AE60",
};

const getStatus = (estado: string) => {
  const s = estado?.toLowerCase() ?? "";
  if (s.includes("aplicado"))
    return { bg: COLORS.statusAppliedBg, color: COLORS.statusAppliedText };
  if (s.includes("pendiente"))
    return { bg: COLORS.statusPendingBg, color: COLORS.statusPendingText };
  return { bg: COLORS.statusRejectedBg, color: COLORS.statusRejectedText };
};

export default function ClienteAbonoDetalleScreen({ route }: any) {
  const { id } = route.params;
  const navigation = useNavigation();

  const [abono, setAbono] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  const loadDetalle = async () => {
    try {
      setLoading(true);
      const result = await abonoService.verDetalleAbono(id);
      setAbono(result);

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
    } catch (e) {
      console.log("❌ Error cargando detalle:", e);
      setAbono(null);
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

  if (!abono)
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No se encontró este abono.</Text>
      </View>
    );

  const fecha = new Date(abono.fechaAbono).toLocaleDateString("es-ES");
  const status = getStatus(abono.estado);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* 🔙 Botón atrás, igual al ejemplo */}
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.card}>

          {/* HEADER IDÉNTICO AL EJEMPLO */}
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="cash-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Detalle del Abono</Text>
          </View>

          <Text style={styles.abonoId}>#{abono.id}</Text>

          {/* BLOQUE DE INFORMACIÓN */}
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha</Text>
              <Text style={styles.value}>{fecha}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Monto</Text>
              <Text style={styles.totalValue}>${abono.monto}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Método de Pago</Text>
              <Text style={styles.value}>{abono.metodoPago}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Estado</Text>
              <View style={[styles.statusChip, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.color }]}>
                  {abono.estado}
                </Text>
              </View>
            </View>
          </View>

          {/* OBSERVACIONES */}
          <Text style={styles.label}>Observaciones</Text>
          <Text style={styles.value}>
            {abono.observaciones || "Sin observaciones"}
          </Text>

        </View>
      </Animated.View>
    </ScrollView>
  );
}

/* === ESTILOS (100% IGUALES AL EJEMPLO) === */

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

  abonoId: {
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
