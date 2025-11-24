import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ESTADOS = ["PAGADA", "PENDIENTE", "PARCIAL", "CANCELADA"];

const COLORS = {
    background: '#F0F2F5',
    cardBackground: '#FFFFFF',
    primary: '#007AFF',
    textPrimary: '#1C1C1E',
    textSecondary: '#6C757D',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
};

export default function ComprasEstadoDropdown({
    onApply,
}: {
    onApply: (estado: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [estado, setEstado] = useState("PENDIENTE");
    const rotateAnim = useState(new Animated.Value(0))[0];

    const toggleDropdown = () => {
        setOpen(!open);

        Animated.timing(rotateAnim, {
            toValue: open ? 0 : 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdown}>
                <Text style={[
                    styles.headerText, 
                    !estado && { color: COLORS.textSecondary }
                ]}>
                    {estado || "Seleccionar estado"}
                </Text>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionicons name="chevron-down" size={22} color={COLORS.textPrimary} />
                </Animated.View>
            </TouchableOpacity>

            {open && (
                <View style={styles.dropdownList}>
                    {ESTADOS.map((e) => (
                        <TouchableOpacity
                            key={e}
                            style={styles.option}
                            onPress={() => setEstado(e)}
                        >
                            <Ionicons
                                name={
                                    estado === e ? "radio-button-on" : "radio-button-off"
                                }
                                size={20}
                                color={estado === e ? COLORS.primary : COLORS.textSecondary}
                            />
                            <Text
                                style={[
                                    styles.optionText,
                                    estado === e && styles.optionTextActive,
                                ]}
                            >
                                {e}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => {
                            if (estado) {
                                toggleDropdown();
                                onApply(estado);
                            }
                        }}
                    >
                        <Text style={styles.applyText}>Aplicar Filtro</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 10,
        zIndex: 10,
    },

    dropdownHeader: {
        backgroundColor: COLORS.cardBackground,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    headerText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: "600",
    },

    dropdownList: {
        backgroundColor: COLORS.cardBackground,
        padding: 10,
        marginTop: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
    },

    optionText: {
        color: COLORS.textPrimary,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '500',
    },
    
    optionTextActive: {
        color: COLORS.primary,
        fontWeight: "700",
    },

    applyBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 15,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },

    applyText: {
        color: COLORS.buttonText,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "700",
    },
});