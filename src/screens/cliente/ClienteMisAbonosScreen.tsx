import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { ClienteStackParamList } from "@/src/navigation/ClienteStackNavigator";
import { abonoService } from "@/src/services/abonoService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import FilterAbonoEstado from "@/src/components/abonosCliente/AbonoEstadoDropdown";
import FilterAbonoBar from "@/src/components/abonosCliente/FilterAbonoBar";
import FilterFechaBar from "@/src/components/abonosCliente/FilterFechaBar";


const COLORS = {
    background: "#F7F9FC",
    primary: "#5B72F2",
    textPrimary: "#2E2E2E",
    textSecondary: "#6B6B6B",
    green: "#2ECC71",
    cardBackground: "#FFFFFF",
};

export default function ClienteMisAbonosScreen() {
    const [loading, setLoading] = useState(true);
    const [abonos, setAbonos] = useState<any[]>([]);
    const [selectedFilter, setSelectedFilter] = useState("todas");

    const loadAbonos = async () => {
        setLoading(true);
        const result = await abonoService.verMisAbonos(0, 20);
        setAbonos(result?.content ?? []);
        setLoading(false);
    };

    const loadPendientes = async () => {
        setLoading(true);
        const result = await abonoService.verMisAbonosPendientes(0, 20);
        setAbonos(result?.content ?? []);
        setLoading(false);
    };

    const loadPorFecha = async (inicio: string, fin: string) => {
        setLoading(true);
        const result = await abonoService.verMisAbonosPorFecha(inicio, fin, 0, 20);
        setAbonos(result?.content ?? []);
        setLoading(false);
    };

    useEffect(() => {
        loadAbonos(); // default
    }, []);

    // CAMBIOS POR FILTRO
    useEffect(() => {
        if (selectedFilter === "todas") loadAbonos();
        else if (selectedFilter === "pendientes") loadPendientes();
    }, [selectedFilter]);

    return (
        <View style={styles.container}>
            {/* BAR DE FILTROS */}
            <FilterAbonoBar
                selected={selectedFilter}
                onChange={(f) => setSelectedFilter(f)}
            />

            {/* SI ELIGE FECHA → MOSTRAR FORM */}
            {selectedFilter === "fecha" && (
                <FilterFechaBar
                    onFilter={(inicio, fin) => loadPorFecha(inicio, fin)}
                />
            )}

            {/* SI ELIGE ESTADO → MOSTRAR DROPDOWN */}
            {selectedFilter === "estado" && (
                <FilterAbonoEstado
                    onApply={async (estado) => {
                        setLoading(true);
                        const result = await abonoService.verMisAbonosPorEstado(estado, 0, 20);
                        setAbonos(result?.content ?? []);
                        setLoading(false);
                    }}
                />
            )}

            {/* LISTA */}
            {loading ? (
                <View style={styles.loaderBox}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : abonos.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Ionicons name="wallet-outline" size={60} color={COLORS.textSecondary} />
                    <Text style={styles.emptyText}>No se encontraron abonos</Text>
                </View>
            ) : (
                <FlatList
                    data={abonos}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 140,
                    }}
                    renderItem={({ item, index }) => (
                        <AbonoCard item={item} index={index} />
                    )}
                />
            )}
        </View>
    );
}

/* ============= TARJETA ============= */

function AbonoCard({ item, index }: any) {
    const navigation =
        useNavigation<StackNavigationProp<ClienteStackParamList>>();

    const fecha = new Date(item.fechaAbono).toLocaleDateString("es-ES");

    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(20);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 350,
                delay: index * 120,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 350,
                delay: index * 120,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity
                style={cardStyles.cardContainer}
                onPress={() =>
                    navigation.navigate("ClienteAbonoDetalle", { id: item.id })
                }
            >
                <View style={cardStyles.cardInner}>
                    <View style={cardStyles.headerRow}>
                        <View style={cardStyles.iconCircle}>
                            <Ionicons name="cash-outline" size={22} color={COLORS.green} />
                        </View>
                        <Text style={cardStyles.title}>Abono #{item.id}</Text>
                    </View>

                    <View style={cardStyles.row}>
                        <Text style={cardStyles.label}>Fecha</Text>
                        <Text style={cardStyles.value}>{fecha}</Text>
                    </View>

                    <View style={cardStyles.row}>
                        <Text style={cardStyles.label}>Monto</Text>
                        <Text style={cardStyles.value}>${item.monto}</Text>
                    </View>

                    <View style={cardStyles.row}>
                        <Text style={cardStyles.label}>Método de pago</Text>
                        <Text style={cardStyles.value}>{item.metodoPago}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

/* ============= ESTILOS ============= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    loaderBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
});

const cardStyles = StyleSheet.create({
    cardContainer: {
        marginBottom: 20,
    },
    cardInner: {
        backgroundColor: COLORS.cardBackground,
        padding: 18,
        borderRadius: 22,
        shadowColor: "#00000030",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E8FFE5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
});
