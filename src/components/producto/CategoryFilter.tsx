import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { categoryService } from '../../services/categoryService';
import { CategoriaResponse } from '../../types/catalog';

interface CategoryFilterProps {
    selectedCategoryId: number | null;
    onCategorySelect: (categoryId: number | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    selectedCategoryId,
    onCategorySelect,
}) => {
    const [categories, setCategories] = useState<CategoriaResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Obtenemos todas las categorías (sin paginación para el filtro)
            const response = await categoryService.listarTodas(0, 100);
            setCategories(response.content);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderCategoryItem = ({ item }: { item: CategoriaResponse }) => {
        const isSelected = selectedCategoryId === item.id;
        
        return (
            <TouchableOpacity
                style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected
                ]}
                onPress={() => onCategorySelect(item.id)}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected
                ]}>
                    {item.nombre}
                </Text>
            </TouchableOpacity>
        );
    };

    const handleShowAll = () => {
        onCategorySelect(null);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#666" />
                <Text style={styles.loadingText}>Cargando categorías...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categorías</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[{ id: null, nombre: 'All' }, ...categories]}
                keyExtractor={(item) => item.id?.toString() || 'all'}
                renderItem={({ item }) => {
                    if (item.id === null) {
                        // Botón "All" especial
                        const isSelected = selectedCategoryId === null;
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.categoryChip,
                                    styles.allCategoryChip,
                                    isSelected && styles.allCategoryChipSelected
                                ]}
                                onPress={handleShowAll}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    styles.allCategoryText,
                                    isSelected && styles.allCategoryTextSelected
                                ]}>
                                    Todos
                                </Text>
                            </TouchableOpacity>
                        );
                    }
                    
                    return renderCategoryItem({ item });
                }}
                contentContainerStyle={styles.categoriesContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    categoriesContainer: {
        paddingHorizontal: 16,
    },
    separator: {
        width: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryChipSelected: {
        backgroundColor: '#00d30bff',
        borderColor: '#000',
    },
    allCategoryChip: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
    },
    allCategoryChipSelected: {
        backgroundColor: '#00d30bff',
        borderColor: '#000',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    categoryTextSelected: {
        color: '#fff',
    },
    allCategoryText: {
        color: '#666',
    },
    allCategoryTextSelected: {
        color: '#fff',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
});