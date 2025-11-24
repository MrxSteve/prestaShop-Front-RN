import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ComprasFechaFilter from "@/src/components/compras/ComprasFechaFilter";
import ComprasFilterBar from "@/src/components/compras/ComprasFilterBar";
import ComprasEstadoDropdown from "@/src/components/compras/ComprasEstadoDropdown";

import { ClienteStackParamList } from "@/src/navigation/ClienteStackNavigator";
import { ventaService } from "@/src/services/ventaService";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const COLORS = {
    background: "#F7F9FC",
    primary: "#5B72F2",
    primaryContainer: "#E8ECFF",
    cardBackground: "#FFFFFF",
    textPrimary: "#2E2E2E",
    textSecondary: "#6B6B6B",
    accent: "#FF9F43",
    green: "#2ECC71",
};

export default function ClienteMisComprasScreen() {
    const [selectedFilter, setSelectedFilter] = useState("todas");
    const [loading, setLoading] = useState(true);
    const [compras, setCompras] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const normalizeItems = (res: any): any[] => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.content)) return res.content;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.content)) return res.data.content;
        return [];
    };

    const loadComprasPorFecha = async (fi: string, ff: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await ventaService.verMisComprasPorFecha(fi, ff);
            setCompras(normalizeItems(result));
        } catch {
            setError("No se pudo cargar por fecha");
        } finally {
            setLoading(false);
        }
    };

    const loadComprasPorEstado = async (estado: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await ventaService.verMisComprasPorEstado(estado, 0, 20);
            setCompras(normalizeItems(result));
        } catch {
            setError("No se pudo cargar por estado");
        } finally {
            setLoading(false);
        }
    };

    const loadCompras = async () => {
        try {
            setLoading(true);
            setError(null);

            if (selectedFilter === "todas") {
                const result = await ventaService.verMisCompras(0, 20);
                setCompras(normalizeItems(result));
                return;
            }

            if (selectedFilter === "pendientes") {
                const result = await ventaService.verMisComprasPendientes(0, 20);
                setCompras(normalizeItems(result));
                return;
            }

        } catch {
            setError("No se pudo cargar información");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompras();
    }, [selectedFilter]);

    return (
        <View style={styles.container}>

            <ComprasFilterBar
                selected={selectedFilter}
                onChange={(v) => setSelectedFilter(v)}
            />

            {selectedFilter === "fecha" && (
                <ComprasFechaFilter onApply={loadComprasPorFecha} />
            )}

            {selectedFilter === "estado" && (
                <ComprasEstadoDropdown onApply={loadComprasPorEstado} />
            )}

            {loading ? (
                <View style={styles.loaderBox}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : compras.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Ionicons name="file-tray-outline" size={60} color={COLORS.textSecondary} />
                    <Text style={styles.emptyText}>
                        Sin resultados para este filtro
                    </Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 140,
                    }}
                    data={compras}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CompraCard item={item} />}
                />
            )}
        </View>
    );
}

function CompraCard({ item }: any) {
    const navigation = useNavigation<StackNavigationProp<ClienteStackParamList>>();
    const fecha = new Date(item.fechaVenta).toLocaleDateString("es-ES");

    const estadoColor =
        item.estado === "PAGADA" ? "#1B5E20"
            : item.estado === "PENDIENTE" ? "#FF8C00"
                : item.estado === "PARCIAL" ? "#0D47A1"
                    : "#B71C1C";

    const estadoBg =
        item.estado === "PAGADA" ? "#D9F2E0"
            : item.estado === "PENDIENTE" ? "#FFE5C2"
                : item.estado === "PARCIAL" ? "#D4E6FF"
                    : "#FFD6D6";

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("ClienteCompraDetalle", { id: item.id })}
            style={cardStyles.cardContainer}
        >
            <View style={cardStyles.cardInner}>

                <View style={cardStyles.headerRow}>
                    <View style={cardStyles.iconCircle}>
                        <Ionicons name="receipt-outline" size={22} color={COLORS.primary} />
                    </View>
                    <Text style={cardStyles.title}>Compra #{item.id}</Text>
                </View>

                <View style={cardStyles.row}>
                    <Text style={cardStyles.label}>Fecha</Text>
                    <Text style={cardStyles.value}>{fecha}</Text>
                </View>

                <View style={cardStyles.row}>
                    <Text style={cardStyles.label}>Total</Text>
                    <Text style={cardStyles.total}>${item.total}</Text>
                </View>

                <View style={cardStyles.row}>
                    <Text style={cardStyles.label}>Estado</Text>
                    <View style={[cardStyles.estadoBox, { backgroundColor: estadoBg }]}>
                        <Text style={[cardStyles.estadoText, { color: estadoColor }]}>
                            {item.estado}
                        </Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
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
    },

    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 16,
        marginTop: 10
    },
});

const cardStyles = StyleSheet.create({
    cardContainer: {
        marginBottom: 20,
    },

    cardInner: {
        backgroundColor: "#ececec69",
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
        borderBottomColor: "#EFEFEF",
    },

    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 50,
        backgroundColor: COLORS.primaryContainer,
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
        alignItems: "center",
        marginVertical: 6,
    },

    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: "500",
    },

    value: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textPrimary,
    },

    total: {
        fontSize: 18,
        fontWeight: "700",
        color: "#27AE60",
    },

    estadoBox: {
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 50,
    },

    estadoText: {
        fontSize: 14,
        fontWeight: "700",
    },
});
