import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cuentaService } from "@/src/services/cuentaServices";
import { CuentaResponse, CuentaEstado, UpdateCuentaRequest } from "@/src/types/cuenta";
import { Picker } from "@react-native-picker/picker";

interface Props {
  visible: boolean;
  cuenta: CuentaResponse | null;
  onClose: () => void;
  onUpdated: () => void; // Para refrescar la lista
}

export default function EditarCuentaModal({ visible, cuenta, onClose, onUpdated }: Props) {
  const [limiteCredito, setLimiteCredito] = useState("");
  const [estado, setEstado] = useState<CuentaEstado>(CuentaEstado.ACTIVA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cuenta) {
      setLimiteCredito(cuenta.limiteCredito.toString());
      setEstado(cuenta.estado);
    }
  }, [cuenta]);

  const handleGuardar = async () => {
  if (!cuenta) return;

  if (!limiteCredito.trim()) {
    Alert.alert("Error", "El límite de crédito no puede estar vacío.");
    return;
  }

  try {
    setLoading(true);


    const hoy = new Date();
    const fechaActual = hoy.toISOString().split("T")[0];

    const body: UpdateCuentaRequest = {
      limiteCredito: parseFloat(limiteCredito),
      estado,
      fechaApertura: fechaActual, 
    };

    await cuentaService.actualizarCuenta(cuenta.id, body);

    Alert.alert("Éxito", "La cuenta fue actualizada correctamente.");
    onUpdated();
    onClose();
  } catch (e) {
    console.error(e);
    Alert.alert("Error", "No se pudo actualizar la cuenta.");
  } finally {
    setLoading(false);
  }
};


  if (!cuenta) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Editar Cuenta #{cuenta.id}</Text>

          <Text style={styles.label}>Límite de crédito</Text>
          <TextInput
            style={styles.input}
            value={limiteCredito}
            keyboardType="numeric"
            onChangeText={setLimiteCredito}
            placeholder="Ej: 500"
          />

          <Text style={styles.label}>Estado de cuenta</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={estado}
              onValueChange={(value) => setEstado(value)}
              style={{ height: 40 }}
            >
              <Picker.Item label="Activa" value={CuentaEstado.ACTIVA} />
              <Picker.Item label="Suspendida" value={CuentaEstado.SUSPENDIDA} />
              <Picker.Item label="Cerrada" value={CuentaEstado.CERRADA} />
            </Picker>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "#E0E0E0" }]} onPress={onClose}>
              <Text style={{ color: "#333", fontWeight: "700" }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#2196F3" }]}
              onPress={handleGuardar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <Text style={styles.btnText}>Guardar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  label: {
    color: "#555",
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 4,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
});
