import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { CategoryForm } from '../../components/catalog/CategoryForm';
import { CategoryList } from '../../components/catalog/CategoryList';
import { categoryService } from '../../services/categoryService';
import { CategoriaRequest, CategoriaResponse } from '../../types/catalog';

export default function CategoryManagementScreen() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoriaResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setShowForm(true);
    };

    const handleEditCategory = (categoria: CategoriaResponse) => {
        setSelectedCategory(categoria);
        setShowForm(true);
    };

    const handleSaveCategory = async (categoriaData: CategoriaRequest) => {
        try {
            setLoading(true);
            
            if (selectedCategory) {
                // Editar categoría existente
                await categoryService.actualizar(selectedCategory.id, categoriaData);
                Alert.alert('Éxito', 'Categoría actualizada correctamente');
            } else {
                // Crear nueva categoría
                await categoryService.crear(categoriaData);
                Alert.alert('Éxito', 'Categoría creada correctamente');
            }
            
            setShowForm(false);
            setSelectedCategory(null);
            setRefreshTrigger(prev => prev + 1);
            
        } catch (error: any) {
            console.error('Error saving category:', error);
            
            let errorMessage = 'Error al guardar la categoría';
            
            if (error.response?.status === 409) {
                errorMessage = 'Ya existe una categoría con ese nombre';
            } else if (error.response?.status === 400) {
                errorMessage = 'Datos inválidos. Verifica la información';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Error de conexión. Verifica tu internet';
            }
            
            Alert.alert('Error', errorMessage);
            throw error; // Re-throw para que el form maneje el estado de loading
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedCategory(null);
    };

    return (
        <View style={styles.container}>
            <CustomHeader 
                title="Gestión de Categorías" 
                showBackButton={true}
            />
            <View style={styles.content}>
                <CategoryList
                    onEditCategory={handleEditCategory}
                    refreshTrigger={refreshTrigger}
                    onAddCategory={handleAddCategory}
                />
            </View>

            <Modal
                visible={showForm}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <CategoryForm
                        categoria={selectedCategory}
                        onSave={handleSaveCategory}
                        onCancel={handleCancel}
                        loading={loading}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
});