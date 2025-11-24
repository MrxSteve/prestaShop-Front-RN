import { createStackNavigator } from '@react-navigation/stack';
import ClienteTabNavigator from './ClienteTabNavigator';
import ClienteProductoDetalleScreen from '../screens/cliente/ProductoDetalleScreen';
import ClienteCompraDetalleScreen from '../screens/cliente/ClienteCompraDetalleScreen';

export type ClienteStackParamList = {
  ClienteTabs: undefined;
  ProductoDetalleCliente: { id: number };
  ClienteCompraDetalle: { id: number };   // ⬅ NUEVA RUTA
};

const Stack = createStackNavigator<ClienteStackParamList>();

export default function ClienteStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* Pantallas principales (tabs) */}
      <Stack.Screen name="ClienteTabs" component={ClienteTabNavigator} />

      {/* Detalle del producto */}
      <Stack.Screen 
        name="ProductoDetalleCliente"
        component={ClienteProductoDetalleScreen}
      />

      {/* ⬅ NUEVO: Detalle de compra */}
      <Stack.Screen
        name="ClienteCompraDetalle"
        component={ClienteCompraDetalleScreen}
      />

    </Stack.Navigator>
  );
}
