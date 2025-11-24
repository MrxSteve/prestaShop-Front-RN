import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const COLORS = {
    background: '#FFFFFF',
    primary: '#e75e30c5',
    inactiveButton: '#F0F2F5',
    inactiveText: '#6C757D',
    activeText: '#FFFFFF',
};

export default function FilterAbonoBar({
    selected,
    onChange,
}: {
    selected: string;
    onChange: (value: string) => void;
}) {
    const filtros = ["todas", "pendientes", "fecha", "estado"];

    return (
        <View style={styles.container}>
            {filtros.map((f) => (
                <TouchableOpacity
                    key={f}
                    style={[
                        styles.btn,
                        selected === f ? styles.btnActive : styles.btnInactive
                    ]}
                    onPress={() => onChange(f)}
                >
                    <Text
                        style={[
                            styles.text,
                            selected === f ? styles.textActive : styles.textInactive
                        ]}
                    >
                        {f === "todas"
                            ? "TODAS"
                            : f === "pendientes"
                            ? "PENDIENTES"
                            : f === "fecha"
                            ? "FECHA"
                            : "ESTADO"}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 1,
    },
    btn: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
    },
    btnInactive: {
        backgroundColor: COLORS.inactiveButton,
    },
    btnActive: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    text: {
        fontSize: 14,
        fontWeight: "600",
    },
    textInactive: {
        color: COLORS.inactiveText,
    },
    textActive: {
        color: COLORS.activeText,
        fontWeight: "700",
    },
});
