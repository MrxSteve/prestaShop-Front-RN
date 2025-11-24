import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    onApply: (fi: string, ff: string) => void;
}

const COLORS = {
    background: '#F0F2F5',
    cardBackground: '#FFFFFF',
    primary: '#007AFF',
    textPrimary: '#1C1C1E',
    textSecondary: '#6C757D',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
};

export default function ComprasFechaFilter({ onApply }: Props) {
    const [inicio, setInicio] = useState<Date | null>(null);
    const [fin, setFin] = useState<Date | null>(null);

    const [showInicioPicker, setShowInicioPicker] = useState(false);
    const [showFinPicker, setShowFinPicker] = useState(false);

    const formatDisplayDate = (date: Date | null) => {
        if (!date) return "Seleccionar";
        return date.toLocaleDateString("es-ES", {
            day: '2-digit',
            month: 'short',
        });
    };

    const formatApiDate = (date: Date) => date.toISOString().split("T")[0];

    return (
        <View style={styles.container}>
            <View style={styles.dateRow}>
                {/* FECHA INICIO */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fecha de Inicio</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowInicioPicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                        <Text style={[
                            styles.dateText, 
                            !inicio && { color: COLORS.textSecondary }
                        ]}>
                            {formatDisplayDate(inicio)}
                        </Text>
                    </TouchableOpacity>

                    {showInicioPicker && (
                        <DateTimePicker
                            value={inicio || new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "inline" : "calendar"}
                            onChange={(e, selected) => {
                                setShowInicioPicker(false);
                                if (selected) setInicio(selected);
                            }}
                            minimumDate={new Date(2000, 0, 1)}
                            maximumDate={new Date()}
                        />
                    )}
                </View>

                {/* FECHA FIN */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fecha de Fin</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowFinPicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                        <Text style={[
                            styles.dateText, 
                            !fin && { color: COLORS.textSecondary }
                        ]}>
                            {formatDisplayDate(fin)}
                        </Text>
                    </TouchableOpacity>

                    {showFinPicker && (
                        <DateTimePicker
                            value={fin || new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "inline" : "calendar"}
                            onChange={(e, selected) => {
                                setShowFinPicker(false);
                                if (selected) setFin(selected);
                            }}
                            minimumDate={inicio || new Date(2000, 0, 1)}
                            maximumDate={new Date(2050, 11, 31)}
                        />
                    )}
                </View>
            </View>

            {/* APLICAR FILTRO */}
            <TouchableOpacity
                style={[
                    styles.applyButton,
                    !(inicio && fin) && styles.applyButtonDisabled
                ]}
                onPress={() => {
                    if (inicio && fin) {
                        onApply(formatApiDate(inicio), formatApiDate(fin));
                    }
                }}
                disabled={!(inicio && fin)}
            >
                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.buttonText} style={{marginRight: 8}} />
                <Text style={styles.applyButtonText}>Aplicar Filtro</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 10,
        backgroundColor: COLORS.background,
        paddingBottom: 20,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    inputGroup: {
        flex: 1, // Permite que ambos grupos compartan el espacio
        marginHorizontal: 5,
    },

    label: {
        color: COLORS.textPrimary,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "600",
    },

    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Centrar contenido dentro del botón
        backgroundColor: COLORS.cardBackground,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },

    dateText: {
        color: COLORS.textPrimary,
        fontSize: 14, // Fuente más pequeña para caber en el espacio
        fontWeight: "600",
        marginLeft: 6,
    },

    applyButton: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 15,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        marginHorizontal: 5, // Alinear con los campos de fecha
    },

    applyButtonDisabled: {
        backgroundColor: COLORS.textSecondary,
        shadowColor: 'transparent',
        elevation: 0,
    },

    applyButtonText: {
        color: COLORS.buttonText,
        fontSize: 17,
        fontWeight: "700",
    },
});