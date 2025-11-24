import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
    primary: "#5B72F2",
    background: "#FFFFFF",
    textPrimary: "#333",
    button: "#5B72F2",
    buttonText: "#FFF",
    inputBg: "#F2F3F7",
};

export default function FilterFechaBar({
    onFilter,
}: {
    onFilter: (inicio: string, fin: string) => void;
}) {
    const [inicio, setInicio] = useState<Date | null>(null);
    const [fin, setFin] = useState<Date | null>(null);

    const [showInicio, setShowInicio] = useState(false);
    const [showFin, setShowFin] = useState(false);

    const formatDate = (d: Date) =>
        d.toISOString().split("T")[0]; // yyyy-MM-dd

    return (
        <View style={styles.container}>
            {/* FILA DE INPUTS */}
            <View style={styles.row}>
                {/* Fecha inicio */}
                <TouchableOpacity
                    style={styles.inputBox}
                    onPress={() => setShowInicio(true)}
                >
                    <Ionicons name="calendar-outline" size={18} color="#555" />
                    <Text style={styles.inputText}>
                        {inicio ? formatDate(inicio) : "Seleccionar"}
                    </Text>
                </TouchableOpacity>

                {/* Picker Inicio */}
                {showInicio && (
                    <DateTimePicker
                        value={inicio || new Date()}
                        mode="date"
                        onChange={(e, date) => {
                            setShowInicio(false);
                            if (date) setInicio(date);
                        }}
                    />
                )}

                {/* Fecha Fin */}
                <TouchableOpacity
                    style={styles.inputBox}
                    onPress={() => setShowFin(true)}
                >
                    <Ionicons name="calendar-outline" size={18} color="#555" />
                    <Text style={styles.inputText}>
                        {fin ? formatDate(fin) : "Seleccionar"}
                    </Text>
                </TouchableOpacity>

                {/* Picker Fin */}
                {showFin && (
                    <DateTimePicker
                        value={fin || new Date()}
                        mode="date"
                        onChange={(e, date) => {
                            setShowFin(false);
                            if (date) setFin(date);
                        }}
                    />
                )}
            </View>

            {/* BOTÓN APLICAR */}
            <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                    if (!inicio || !fin) return;
                    onFilter(formatDate(inicio), formatDate(fin));
                }}
            >
                <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
                <Text style={styles.btnText}>Aplicar Filtro</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#DDD",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.inputBg,
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    inputText: {
        marginLeft: 6,
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    btn: {
        marginTop: 18,
        backgroundColor: COLORS.button,
        paddingVertical: 12,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    btnText: {
        color: COLORS.buttonText,
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
});
