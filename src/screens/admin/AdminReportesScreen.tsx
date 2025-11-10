import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { MainNavigationTabs } from '../../components/reports/MainNavigationTabs';
import { PlaceholderSection } from '../../components/reports/PlaceholderSection';
import { ProductsReportsSection } from '../../components/reports/ProductsReportsSection';
import { productoService } from '../../services/productoService';
import { CatalogStackParamList } from '../../types/navigation';
import { ProductoResponse } from '../../types/producto';

type AdminReportesScreenNavigationProp = StackNavigationProp<CatalogStackParamList>;
type MainSection = 'productos' | 'ventas' | 'abonos' | 'usuarios' | 'cuentas' | 'movimientos';

const AdminReportesScreen: React.FC = () => {
    const navigation = useNavigation<AdminReportesScreenNavigationProp>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [productos, setProductos] = useState<ProductoResponse[]>([]);
    const [mainSection, setMainSection] = useState<MainSection>('productos');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const productosRes = await productoService.listarTodos(0, 1000);
            setProductos(productosRes.content);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'No se pudieron cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleMainSectionChange = (section: MainSection) => {
        setMainSection(section);
    };

    const handleEditProduct = (producto: ProductoResponse) => {
        console.log('Edit product:', producto.id);
    };

    const handleViewProductDetails = (productId: number) => {
        navigation.navigate('ProductoDetalle', { productId });
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Cargando reportes...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header principal */}
            <View style={styles.header}>
                <Text style={styles.title}>Reportes y Análisis</Text>
                
                {/* Navegación principal por secciones */}
                <MainNavigationTabs
                    activeSection={mainSection}
                    onSectionChange={handleMainSectionChange}
                />
            </View>

            {/* Contenido según la sección principal */}
            {mainSection === 'productos' && (
                <ProductsReportsSection
                    productos={productos}
                    onProductEdit={handleEditProduct}
                    onProductViewDetails={handleViewProductDetails}
                    refreshTrigger={refreshing}
                />
            )}

            {/* Secciones placeholders para futuras implementaciones */}
            {mainSection === 'ventas' && (
                <PlaceholderSection
                    icon="card-outline"
                    title="Reportes de Ventas"
                    description="Próximamente: Análisis de ventas, tendencias, gráficos de ingresos y más."
                />
            )}

            {mainSection === 'abonos' && (
                <PlaceholderSection
                    icon="wallet-outline"
                    title="Reportes de Abonos"
                    description="Próximamente: Seguimiento de abonos, estados de pago y análisis financiero."
                />
            )}

            {mainSection === 'usuarios' && (
                <PlaceholderSection
                    icon="people-outline"
                    title="Reportes de Usuarios"
                    description="Próximamente: Actividad de usuarios, registros y análisis demográfico."
                />
            )}

            {mainSection === 'cuentas' && (
                <PlaceholderSection
                    icon="folder-outline"
                    title="Reportes de Cuentas"
                    description="Próximamente: Estados de cuenta, balances y resúmenes financieros."
                />
            )}

            {mainSection === 'movimientos' && (
                <PlaceholderSection
                    icon="swap-horizontal-outline"
                    title="Reportes de Movimientos"
                    description="Próximamente: Historial de transacciones, flujos de dinero y auditoría."
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
});

export default AdminReportesScreen;