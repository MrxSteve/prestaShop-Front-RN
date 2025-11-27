import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

export default function ClientePerfilScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  // Formateo de fecha
  const formatDate = (date: string | undefined) => {
    if (!date) return "No registrada";
    return new Date(date).toLocaleDateString("es-ES");
  };

  return (
    <ScrollView style={styles.container}>
      {/* ==== BOTÓN DE REGRESO ==== */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("ClienteTabs" as never)}
      >
        <Ionicons name="arrow-back" size={26} color="#1A1C1E" />
      </TouchableOpacity>

      {/* ===== HEADER REDISEÑADO ===== */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.nombreCompleto?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.nameText}>{user?.nombreCompleto}</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      {/* ===== INFORMACIÓN PERSONAL ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <View style={styles.card}>
          <InfoRow label="Nombre Completo" value={user?.nombreCompleto} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Teléfono" value={user?.telefono || "No registrado"} />
          <InfoRow label="DUI" value={user?.dui || "No registrado"} />
          <InfoRow
            label="Dirección"
            value={user?.direccion || "No registrada"}
          />
          <InfoRow
            label="Fecha de Nacimiento"
            value={formatDate(user?.fechaNacimiento)}
          />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    user?.estado === "ACTIVO" ? "#4CAF50" : "#F44336",
                },
              ]}
            >
              <Text style={styles.statusText}>{user?.estado}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ===== INFORMACIÓN DE CUENTA ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Cuenta</Text>

        <View style={styles.card}>
          <InfoRow
            label="ID de Cuenta"
            value={user?.cuentaClienteId || "No asignada"}
          />

          {/* ROLES */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Roles:</Text>
            <View style={styles.rolesContainer}>
              {user?.roles?.map((rol) => (
                <View key={rol.id} style={styles.roleBadge}>
                  <Text style={styles.roleText}>{rol.nombre}</Text>
                </View>
              ))}
            </View>
          </View>

          <InfoRow
            label="Miembro desde"
            value={formatDate(user?.createdAt)}
          />
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

/* ==== COMPONENTE REUTILIZABLE ==== */
const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const PRIMARY = "#4C8BFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },

  /* === BOTÓN DE REGRESO === */
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 20,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
  },

  /* === HEADER === */
  header: {
    paddingTop: 90,
    paddingBottom: 30,
    backgroundColor: PRIMARY,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
  },

  avatarContainer: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 5,
  },

  avatarText: {
    fontSize: 42,
    fontWeight: "bold",
    color: PRIMARY,
  },

  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  emailText: {
    fontSize: 15,
    color: "#E8EDFF",
    marginTop: 4,
  },

  /* === SECCIONES === */
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1A1C1E",
    marginBottom: 10,
  },

  /* === TARJETAS === */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF5",
  },

  infoLabel: {
    flex: 1,
    fontSize: 15,
    color: "#555",
    fontWeight: "600",
  },

  infoValue: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    textAlign: "right",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 6,
  },

  roleBadge: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  roleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
