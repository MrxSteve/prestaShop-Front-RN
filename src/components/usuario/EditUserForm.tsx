import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { usuarioService } from "@/src/services/usuarioServices";
import { UsuarioResponse, UpdateUsuarioRequest, UsuarioEstado } from "@/src/types/usuario";

type Props = {
  visible: boolean;
  onClose: () => void;
  userToEdit: UsuarioResponse | null;
  onUpdated?: () => void;
};

type EditFormFields = {
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  dui: string;
  fechaNacimiento: string;
  estado: UsuarioEstado;
};

export default function EditUserForm({ visible, onClose, userToEdit, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditFormFields>({
    defaultValues: {
      nombreCompleto: "",
      email: "",
      telefono: "",
      direccion: "",
      dui: "",
      fechaNacimiento: "",
      estado: "ACTIVO",
    },
  });

  // Cargar los datos actuales del usuario
  useEffect(() => {
    if (visible && userToEdit) {
      reset({
        nombreCompleto: userToEdit.nombreCompleto || "",
        email: userToEdit.email || "",
        telefono: userToEdit.telefono || "",
        direccion: userToEdit.direccion || "",
        dui: userToEdit.dui || "",
        fechaNacimiento: userToEdit.fechaNacimiento || "",
        estado: userToEdit.estado || "ACTIVO",
      });
    }
  }, [visible, userToEdit, reset]);

  const onSubmit = async (data: EditFormFields) => {
    if (!userToEdit) return;

    try {
      setLoading(true);

      // Construir payload dinámico con solo los cambios
      const updatePayload: UpdateUsuarioRequest = {};
      Object.entries(data).forEach(([key, value]) => {
        const prevValue = (userToEdit as any)[key];
        if (value && value !== prevValue) {
          (updatePayload as any)[key] = value.trim();
        }
      });

      if (Object.keys(updatePayload).length === 0) {
        Alert.alert("Sin cambios", "No se realizaron modificaciones.");
        setLoading(false);
        return;
      }

      await usuarioService.actualizar(userToEdit.id, updatePayload);
      Alert.alert("Éxito", "Usuario actualizado correctamente.");
      onUpdated?.();
      onClose();
    } catch (err: any) {
      console.error("Error actualizando usuario:", err);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "No se pudo actualizar el usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Usuario</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {!userToEdit ? (
            <View style={styles.centered}>
              <Text style={{ color: "#999" }}>No se encontró el usuario.</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              <Field label="Nombre completo *" error={errors.nombreCompleto?.message}>
                <Controller
                  control={control}
                  name="nombreCompleto"
                  rules={{ required: "Requerido" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.nombreCompleto && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Nombre completo"
                    />
                  )}
                />
              </Field>

              <Field label="Email *" error={errors.email?.message}>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Requerido",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="correo@dominio.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  )}
                />
              </Field>

              <Field label="Teléfono *" error={errors.telefono?.message}>
                <Controller
                  control={control}
                  name="telefono"
                  rules={{ required: "Requerido" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.telefono && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="0000-0000"
                      keyboardType="phone-pad"
                    />
                  )}
                />
              </Field>

              <Field label="Dirección *" error={errors.direccion?.message}>
                <Controller
                  control={control}
                  name="direccion"
                  rules={{ required: "Requerido" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.direccion && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Dirección"
                    />
                  )}
                />
              </Field>

              <Field label="DUI *" error={errors.dui?.message}>
                <Controller
                  control={control}
                  name="dui"
                  rules={{ required: "Requerido" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.dui && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="00000000-0"
                    />
                  )}
                />
              </Field>

              <Field
                label="Fecha de nacimiento * (YYYY-MM-DD)"
                error={errors.fechaNacimiento?.message}
              >
                <Controller
                  control={control}
                  name="fechaNacimiento"
                  rules={{
                    required: "Requerido",
                    pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "Formato YYYY-MM-DD" },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.fechaNacimiento && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="2000-01-31"
                    />
                  )}
                />
              </Field>

              <Field label="Estado *">
                <Controller
                  control={control}
                  name="estado"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.row}>
                      {(["ACTIVO", "INACTIVO", "SUSPENDIDO"] as UsuarioEstado[]).map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.chip, value === opt && styles.chipActive]}
                          onPress={() => onChange(opt)}
                        >
                          <Text
                            style={[styles.chipText, value === opt && styles.chipTextActive]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              </Field>

              <TouchableOpacity
                style={[styles.btn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={18} color="#fff" />
                    <Text style={styles.btnText}>Guardar Cambios</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    {children}
    {!!error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 16 },
  modal: { backgroundColor: "#fff", borderRadius: 16, padding: 16, maxHeight: 640 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#222" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#F44336" },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  error: { color: "#F44336", fontSize: 12, marginTop: 4 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipActive: { backgroundColor: "#E3F2FD", borderColor: "#2196F3" },
  chipText: { color: "#555", fontWeight: "600" },
  chipTextActive: { color: "#2196F3" },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
  centered: { alignItems: "center", justifyContent: "center", height: 200 },
});
