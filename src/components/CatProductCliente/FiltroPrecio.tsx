import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  onAplicar: (min: number, max: number) => void;
}

export default function FiltroPrecio({ onAplicar }: Props) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filtrar por precio</Text>

      <View style={styles.row}>
        <TextInput
          placeholder="Mín"
          keyboardType="numeric"
          style={styles.input}
          value={min}
          onChangeText={setMin}
        />

        <TextInput
          placeholder="Máx"
          keyboardType="numeric"
          style={styles.input}
          value={max}
          onChangeText={setMax}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (min !== "" && max !== "") {
              onAplicar(parseFloat(min), parseFloat(max));
            }
          }}
        >
          <Text style={styles.btnText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  label: {
    fontWeight: "700",
    color: "#4A148C",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1C4E9",
  },
  btn: {
    backgroundColor: "#6A1B9A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
