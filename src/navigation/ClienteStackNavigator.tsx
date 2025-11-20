import { createStackNavigator } from '@react-navigation/stack';
import ClienteTabNavigator from './ClienteTabNavigator';
import ClienteProductoDetalleScreen from '../screens/cliente/ProductoDetalleScreen';

export type ClienteStackParamList = {
  ClienteTabs: undefined;
  ProductoDetalleCliente: { id: number };
};

const Stack = createStackNavigator<ClienteStackParamList>();

export default function ClienteStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* Pantallas del cliente (tabs completas) */}
      <Stack.Screen name="ClienteTabs" component={ClienteTabNavigator} />

      {/* Detalle del producto */}
      <Stack.Screen 
        name="ProductoDetalleCliente" 
        component={ClienteProductoDetalleScreen} 
      />

    </Stack.Navigator>
  );
}
