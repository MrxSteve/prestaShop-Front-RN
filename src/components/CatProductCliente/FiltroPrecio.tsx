import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";

interface Props {
  onAplicar: (min: number, max: number) => void;
}

export default function FiltroPrecio({ onAplicar }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  return (
    <View style={styles.container}>

      {/* BOTÓN QUE ABRE EL MODAL */}
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.openButtonText}>Filtrar por precio</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por Precio</Text>

            {/* INPUTS */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mínimo</Text>
              <TextInput
                placeholder="0.00"
                keyboardType="numeric"
                style={styles.input}
                value={min}
                onChangeText={setMin}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Máximo</Text>
              <TextInput
                placeholder="99.99"
                keyboardType="numeric"
                style={styles.input}
                value={max}
                onChangeText={setMax}
              />
            </View>

            {/* BOTONES */}
            <View style={styles.actionsRow}>

              <Pressable
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.actionTextCancel}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.actionBtn, styles.applyBtn]}
                onPress={() => {
                  if (min !== "" && max !== "") {
                    onAplicar(parseFloat(min), parseFloat(max));
                    setModalVisible(false);
                  }
                }}
              >
                <Text style={styles.actionText}>Aplicar</Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ESTILOS PROFESIONALES
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 10,
  },

  openButton: {
    backgroundColor: "#5D7BEF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  openButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1C1C1E",
    textAlign: "center",
  },

  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F7F9FC",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    fontSize: 15,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelBtn: {
    backgroundColor: "#EFEFEF",
  },
  applyBtn: {
    backgroundColor: "#1f66b1ff",
  },
  actionText: {
    color: "#FFF",
    fontWeight: "600",
  },
  actionTextCancel: {
    color: "#444",
    fontWeight: "600",
  },
});
