import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Stack Navigation Types
export type AuthStackParamList = {
    Login: undefined;
};

export type CatalogStackParamList = {
    CatalogMain: undefined;
    CategoryManagement: undefined;
};

export type AdminTabParamList = {
    Dashboard: undefined;
    UsuariosYCuentas: undefined;
    Ventas: undefined;
    Catalogo: NavigatorScreenParams<CatalogStackParamList>;
    Reportes: undefined;
};

export type ClienteTabParamList = {
    Home: undefined;
    Catalogo: undefined;
    MisCompras: undefined;
    MisAbonos: undefined;
    Perfil: undefined;
};

export type AdminDrawerParamList = {
    AdminTabs: NavigatorScreenParams<AdminTabParamList>;
    Perfil: undefined;
    Configuracion: undefined;
};

export type ClienteDrawerParamList = {
    ClienteTabs: NavigatorScreenParams<ClienteTabParamList>;
    MiCuenta: undefined;
    Configuracion: undefined;
};

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    AdminDrawer: NavigatorScreenParams<AdminDrawerParamList>;
    ClienteDrawer: NavigatorScreenParams<ClienteDrawerParamList>;
};

// Screen Props Types
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
    AuthStackParamList,
    T
>;

export type CatalogStackScreenProps<T extends keyof CatalogStackParamList> = NativeStackScreenProps<
    CatalogStackParamList,
    T
>;

export type AdminTabScreenProps<T extends keyof AdminTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<AdminTabParamList, T>,
    DrawerScreenProps<AdminDrawerParamList>
>;

export type ClienteTabScreenProps<T extends keyof ClienteTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<ClienteTabParamList, T>,
    DrawerScreenProps<ClienteDrawerParamList>
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    T
>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}