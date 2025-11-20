import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UsuarioEstado, UsuarioResponse } from "@/src/types/usuario";
import { usuarioService } from "@/src/services/usuarioServices";
import UserCard from "./UserCard";
import UserDetailModal from "@/src/components/usuario/UserDetailModal"; // 👈 importa tu modal

type Props = {
  onCreate?: () => void;
  refreshTrigger?: number;
};

export default function UserList({ onCreate, refreshTrigger = 0 }: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UsuarioResponse[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState<
    "NOMBRE" | "EMAIL" | "DUI" | "ROL"
  >("NOMBRE");
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<UsuarioEstado | "TODOS">("TODOS");

  // 👇 para el modal
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const load = async (reset = false) => {
    try {
      setLoading(true);
      const p = reset ? 0 : page;
      let res: { content: UsuarioResponse[]; last: boolean };

      const query = q.trim();
      if (query.length > 0) {
        setItems([]);
        switch (tipoBusqueda) {
          case "EMAIL": {
            const user = await usuarioService.buscarPorEmail(query);
            res = { content: user ? [user] : [], last: true };
            break;
          }
          case "DUI": {
            const user = await usuarioService.buscarPorDui(query);
            res = { content: user ? [user] : [], last: true };
            break;
          }
          case "ROL": {
            const list = await usuarioService.buscarPorRol(query, p, 10);
            res = { content: list?.content || [], last: list?.last ?? true };
            break;
          }
          default: {
            res = await usuarioService.buscarPorNombre(query, p, 10);
            break;
          }
        }
        setItems(res.content);
      } else if (estado !== "TODOS") {
        res = await usuarioService.buscarPorEstado(estado as UsuarioEstado, p, 10);
        setItems((prev) => (reset ? res.content : [...prev, ...res.content]));
      } else {
        res = await usuarioService.listar(p, 10);
        setItems((prev) => (reset ? res.content : [...prev, ...res.content]));
      }

      setPage(p + 1);
      setLastPage(res?.last ?? true);
    } catch (e) {
      console.warn("Error cargando usuarios", e);
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setItems([]);
      setPage(0);
      setLastPage(false);
      load(true);
    }, 500);
    return () => clearTimeout(delay);
  }, [estado, q, refreshTrigger]);

  const onEnd = () => {
    if (!loading && !lastPage) load(false);
  };

  const openUserDetails = (user: UsuarioResponse) => {
    setSelectedUserId(user.id);
    setModalVisible(true);
  };

  const Header = (
    <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6 }}>
      <View style={styles.toolbarRow}>
        <View style={[styles.searchWrap, { flex: 1 }]}>
          <Ionicons name="search" size={16} color="#777" />
          <TextInput
            style={styles.search}
            placeholder={`Buscar por ${tipoBusqueda.toLowerCase()}...`}
            value={q}
            onChangeText={setQ}
            onSubmitEditing={() => load(true)}
          />

          {q.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQ("");
                load(true);
              }}
            >
              <Ionicons name="close" size={16} color="#777" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={onCreate}>
          <Ionicons name="person-add" size={16} color="#fff" />
          <Text style={styles.addText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.filtersWrap, { marginTop: 8 }]}>
        {(["NOMBRE", "EMAIL", "DUI", "ROL"] as const).map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setTipoBusqueda(opt)}
            style={[
              styles.filterChip,
              tipoBusqueda === opt && styles.filterActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                tipoBusqueda === opt && styles.filterTextActive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filtersWrap}>
        {(["TODOS", "ACTIVO", "INACTIVO", "SUSPENDIDO"] as const).map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setEstado(opt)}
            style={[styles.filterChip, estado === opt && styles.filterActive]}
          >
            <Text
              style={[
                styles.filterText,
                estado === opt && styles.filterTextActive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={items}
        ListHeaderComponent={Header}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item, index }) => (
          <UserCard
            user={item}
            index={index}
            onRefresh={() => load(true)}
            onViewDetails={openUserDetails}
          />
        )}
        onEndReached={onEnd}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator style={{ margin: 16 }} />
          ) : (
            <View style={{ height: 8 }} />
          )
        }
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 24,
          paddingHorizontal: 12,
          backgroundColor: "#f5f5f5",
        }}
      />

      {/* 👇 Modal de detalle */}
      <UserDetailModal
        visible={modalVisible}
        userId={selectedUserId}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 8,
  },
  search: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    color: "#333",
    marginHorizontal: 6,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "700", marginLeft: 6, fontSize: 13 },
  filtersWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  filterActive: { backgroundColor: "#E3F2FD", borderColor: "#2196F3" },
  filterText: { color: "#666", fontWeight: "700", fontSize: 12 },
  filterTextActive: { color: "#2196F3" },
});
