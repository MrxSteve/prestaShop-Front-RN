import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/src/context/AuthContext";
import { cuentaService } from "@/src/services/cuentaServices";
import { CuentaResponse } from "@/src/types/cuenta";

export default function ClienteMiCuentaScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [cuenta, setCuenta] = useState<CuentaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await cuentaService.verMiCuenta();
      setCuenta(data ?? null);
    } catch {
      setError("No tienes una cuenta asignada.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.avatarLetterCircle}>
          <Text style={styles.avatarLetterText}>
            {user?.nombreCompleto?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.userName}>{user?.nombreCompleto}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.sectionTitle}>Detalles de Cuenta</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {loading && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#4C8BFF" />
              <Text style={styles.loadingText}>Cargando…</Text>
            </View>
          )}

          {!loading && !cuenta && (
            <View style={styles.centerBox}>
              <Ionicons name="alert-circle-outline" size={60} color="#D9534F" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && cuenta && (
            <>
              <Item icon="card-outline" label="ID de Cuenta" value={String(cuenta.id)} />
              <Item icon="cash-outline" label="Límite Crédito" value={`$${cuenta.limiteCredito}`} />
              <Item icon="trending-down-outline" label="Préstamo" value={`$${cuenta.saldoActual}`} />
              <Item icon="calendar-outline" label="Fecha de Apertura" value={cuenta.fechaApertura} />
              <Item icon="shield-checkmark-outline" label="Estado" value={cuenta.estado} />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function Item({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={itemStyles.itemBox}>
      <View style={itemStyles.itemLeft}>
        <View style={itemStyles.itemIconCircle}>
          <Ionicons name={icon} size={20} color="#4C8BFF" />
        </View>
        <Text style={itemStyles.itemLabel}>{label}</Text>
      </View>
      <Text style={itemStyles.itemValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FF" },

  headerGradient: {
    width: "100%",
    height: 280,
    backgroundColor: "#4C8BFF",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    backgroundColor: "#FFFFFF",
    width: 42,
    height: 42,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#00000055",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },

  avatarLetterCircle: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#00000055",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    marginBottom: 10,
  },

  avatarLetterText: {
    fontSize: 44,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 25,
  },

  cardContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 22,
    paddingTop: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
    color: "#1A1A1A",
  },

  centerBox: {
    marginTop: 40,
    alignItems: "center",
  },

  loadingText: { marginTop: 10, color: "#666" },
  errorText: { marginTop: 10, color: "#666" },
});

const itemStyles = StyleSheet.create({
  itemBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: "#DEE7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  itemLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  itemValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#455A64",
  },
});
