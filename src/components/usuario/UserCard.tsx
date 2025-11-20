import { UsuarioEstado, UsuarioResponse } from "@/src/types/usuario";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { usuarioService } from "@/src/services/usuarioServices";
import EditUserForm from "@/src/components/usuario/EditUserForm";

type Props = {
  user: UsuarioResponse;
  onRefresh: () => void;
  onViewDetails: (u: UsuarioResponse) => void;
  index?: number;
};

export default function UserCard({ user, onRefresh, onViewDetails, index = 0 }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [loadingSuspender, setLoadingSuspender] = useState(false);

  // Animaciones
  const scale = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  // Iniciales del usuario
  const initials = user.nombreCompleto
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const estadoColor: Record<UsuarioEstado, string> = {
    ACTIVO: "#E8F5E9",
    INACTIVO: "#FFF3E0",
    SUSPENDIDO: "#FFEBEE",
  };
  const estadoText: Record<UsuarioEstado, string> = {
    ACTIVO: "#2E7D32",
    INACTIVO: "#EF6C00",
    SUSPENDIDO: "#C62828",
  };

  // 🔄 Cambiar estado (activar/inactivar)
  const handleToggleEstado = async () => {
    const nuevoEstado: UsuarioEstado =
      user.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    try {
      setLoadingEstado(true);
      await usuarioService.cambiarEstado(user.id, nuevoEstado);
      Alert.alert("Éxito", `Usuario ${nuevoEstado.toLowerCase()}`);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", "No se pudo cambiar el estado del usuario");
    } finally {
      setLoadingEstado(false);
    }
  };

  // ⏸️ Suspender usuario
  const handleSuspender = async () => {
    Alert.alert(
      "Suspender usuario",
      `¿Deseas suspender a ${user.nombreCompleto}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Suspender",
          style: "destructive",
          onPress: async () => {
            try {
              setLoadingSuspender(true);
              await usuarioService.suspender(user.id);
              Alert.alert("Éxito", "Usuario suspendido correctamente");
              onRefresh();
            } catch (err: any) {
              console.error("Error suspendiendo usuario:", err);
              Alert.alert("Error", "No se pudo suspender el usuario");
            } finally {
              setLoadingSuspender(false);
            }
          },
        },
      ]
    );
  };

  // 🗑️ Eliminar usuario
  const handleDelete = async () => {
    Alert.alert(
      "Eliminar usuario",
      `¿Deseas eliminar a ${user.nombreCompleto}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoadingDelete(true);
              await usuarioService.eliminar(user.id);
              Alert.alert("Éxito", "Usuario eliminado correctamente");
              onRefresh();
            } catch (err: any) {
              console.error("Error eliminando usuario:", err);
              Alert.alert(
                "Error",
                err?.response?.data?.message || "No se pudo eliminar el usuario"
              );
            } finally {
              setLoadingDelete(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY: slide }, { scale }],
        }}
      >
        {/* 🔹 Card con click para ver detalles */}
        <Pressable
          onPressIn={pressIn}
          onPressOut={pressOut}
          onPress={() => onViewDetails(user)}
          style={styles.cardTouchable}
        >
          <View style={styles.card}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || "U"}</Text>
            </View>

            {/* Contenido */}
            <View style={{ flex: 1 }}>
              <View style={styles.headerRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {user.nombreCompleto}
                </Text>

                <View
                  style={[
                    styles.chip,
                    { backgroundColor: estadoColor[user.estado] },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: estadoText[user.estado] },
                    ]}
                  >
                    {user.estado}
                  </Text>
                </View>
              </View>

              {/* Metadatos */}
              <View style={styles.metaBlock}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Email:</Text>
                  <Text style={styles.metaValue} numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Teléfono:</Text>
                  <Text style={styles.metaValue}>{user.telefono}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>DUI:</Text>
                  <Text style={styles.metaValue}>{user.dui}</Text>
                </View>
              </View>

              {/* Acciones */}
              <View style={styles.actions}>
                {/* ✏️ Editar */}
                <TouchableOpacity
                  style={[styles.iconBtn, styles.editBtn]}
                  onPress={() => setShowEditModal(true)}
                >
                  <Ionicons name="pencil" size={18} color="#1976D2" />
                </TouchableOpacity>

                {/* ⏸️ Suspender */}
                <TouchableOpacity
                  style={[styles.iconBtn, styles.warnBtn]}
                  onPress={handleSuspender}
                  disabled={loadingSuspender}
                >
                  {loadingSuspender ? (
                    <ActivityIndicator color="#EF6C00" size="small" />
                  ) : (
                    <Ionicons name="pause-circle" size={18} color="#EF6C00" />
                  )}
                </TouchableOpacity>

                {/* 🔄 Activar/Inactivar */}
                <TouchableOpacity
                  style={[styles.iconBtn, styles.stateBtn]}
                  onPress={handleToggleEstado}
                  disabled={loadingEstado}
                >
                  {loadingEstado ? (
                    <ActivityIndicator color="#4CAF50" size="small" />
                  ) : (
                    <Ionicons
                      name={
                        user.estado === "ACTIVO"
                          ? "remove-circle"
                          : "checkmark-circle"
                      }
                      size={18}
                      color="#4CAF50"
                    />
                  )}
                </TouchableOpacity>

                {/* 🗑️ Eliminar */}
                <TouchableOpacity
                  style={[styles.iconBtn, styles.deleteBtn]}
                  onPress={handleDelete}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? (
                    <ActivityIndicator color="#E53935" size="small" />
                  ) : (
                    <Ionicons name="trash" size={18} color="#E53935" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>

      {/* Modal para editar usuario */}
      {showEditModal && (
        <EditUserForm
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          userToEdit={user}
          onUpdated={onRefresh}
        />
      )}
    </>
  );
}

const LABEL_WIDTH = 76;

const styles = StyleSheet.create({
  cardTouchable: { marginBottom: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    gap: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 5,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#1976D2", fontWeight: "800", fontSize: 18 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: { fontSize: 17, fontWeight: "700", flex: 1, color: "#222" },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  chipText: { fontSize: 11, fontWeight: "800" },
  metaBlock: { marginTop: 6 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 6,
  },
  metaLabel: {
    width: LABEL_WIDTH,
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  metaValue: { flex: 1, fontSize: 13, color: "#666" },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: { backgroundColor: "#E3F2FD", borderColor: "#1976D2" },
  warnBtn: { backgroundColor: "#FFF3E0", borderColor: "#EF6C00" },
  stateBtn: { backgroundColor: "#E8F5E9", borderColor: "#4CAF50" },
  deleteBtn: { backgroundColor: "#FFEBEE", borderColor: "#E53935" },
});
