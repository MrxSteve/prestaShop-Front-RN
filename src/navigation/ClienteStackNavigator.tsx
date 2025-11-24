import { createStackNavigator } from '@react-navigation/stack';
import ClienteTabNavigator from './ClienteTabNavigator';

import ClienteProductoDetalleScreen from '../screens/cliente/ProductoDetalleScreen';
import ClienteCompraDetalleScreen from '../screens/cliente/ClienteCompraDetalleScreen';
import ClienteAbonoDetalleScreen from '../screens/cliente/ClienteAbonoDetalleScreen'; // ⬅ NUEVO

// 📌 AGREGA LA NUEVA RUTA AL TYPE
export type ClienteStackParamList = {
  ClienteTabs: undefined;
  ProductoDetalleCliente: { id: number };
  ClienteCompraDetalle: { id: number };
  ClienteAbonoDetalle: { id: number };   // ⬅ NUEVA RUTA PARA DETALLE DE ABONO
};

const Stack = createStackNavigator<ClienteStackParamList>();

export default function ClienteStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* Pantallas principales con Tabs */}
      <Stack.Screen name="ClienteTabs" component={ClienteTabNavigator} />

      {/* Detalle del producto */}
      <Stack.Screen 
        name="ProductoDetalleCliente"
        component={ClienteProductoDetalleScreen}
      />

      {/* Detalle de compra */}
      <Stack.Screen
        name="ClienteCompraDetalle"
        component={ClienteCompraDetalleScreen}
      />

      {/* ⬅ NUEVO: Detalle de abono */}
      <Stack.Screen
        name="ClienteAbonoDetalle"
        component={ClienteAbonoDetalleScreen}
      />

    </Stack.Navigator>
  );
}