import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ClienteCatalogoScreen from "../screens/cliente/ClienteCatalogoScreen";
import ClienteHomeScreen from "../screens/cliente/ClienteHomeScreen";
import ClienteMisAbonosScreen from "../screens/cliente/ClienteMisAbonosScreen";
import ClienteMisComprasScreen from "../screens/cliente/ClienteMisComprasScreen";
import ClientePerfilScreen from "../screens/cliente/ClientePerfilScreen";
import { ClienteTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<ClienteTabParamList>();

function CustomHeader({ title }: { title: string }) {
    const navigation = useNavigation();

    const toggleDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    };

    return (
        <View style={styles.header}>
            <StatusBar barStyle="light-content" backgroundColor="#3448F0" />

            <View style={styles.headerContent}>
                <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
                    <Ionicons name="menu" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{title}</Text>

                <View style={{ width: 40 }} />
            </View>
        </View>
    );
}

const HomeWithHeader = () => (
    <View style={styles.screenContainer}>
        <CustomHeader title="Inicio" />
        <ClienteHomeScreen />
    </View>
);

const CatalogoWithHeader = () => (
    <View style={styles.screenContainer}>
        <CustomHeader title="Catálogo" />
        <ClienteCatalogoScreen />
    </View>
);

const MisComprasWithHeader = () => (
    <View style={styles.screenContainer}>
        <CustomHeader title="Mis Compras" />
        <ClienteMisComprasScreen />
    </View>
);

const MisAbonosWithHeader = () => (
    <View style={styles.screenContainer}>
        <CustomHeader title="Mis Abonos" />
        <ClienteMisAbonosScreen />
    </View>
);

const PerfilWithHeader = () => (
    <View style={styles.screenContainer}>
        <CustomHeader title="Mi Perfil" />
        <ClientePerfilScreen />
    </View>
);

export default function ClienteTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#3448F0",
                tabBarInactiveTintColor: "#777",

                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabItem,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeWithHeader}
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={26} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Catalogo"
                component={CatalogoWithHeader}
                options={{
                    title: "Catálogo",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="storefront-outline" size={26} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="MisCompras"
                component={MisComprasWithHeader}
                options={{
                    title: "Mis Compras",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="receipt" size={26} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="MisAbonos"
                component={MisAbonosWithHeader}
                options={{
                    title: "Mis Abonos",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="card-outline" size={26} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={PerfilWithHeader}
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={26} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: "#F5F7FF",
    },

    header: {
        backgroundColor: "#3448F0",
        paddingBottom: 5,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 7,
        elevation: 10,
    },

    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 45,
        paddingHorizontal: 18,
    },

    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    menuButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#4A5CFF",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },

    tabBar: {
        position: "absolute",
        left: 16,
        right: 16,

        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        height: 70,
        paddingBottom: 10,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,


        borderWidth: 0,
    },

    tabItem: {
        marginTop: 6,
    },

    tabLabel: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 2,
    },
});