import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoriaResponse } from '../../types/catalog';

interface CategoryCardProps {
    categoria: CategoriaResponse;
    onEdit: (categoria: CategoriaResponse) => void;
    onDelete: (id: number) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
    categoria,
    onEdit,
    onDelete,
}) => {
    const handleDelete = () => {
        Alert.alert(
            'Eliminar Categoría',
            `¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => onDelete(categoria.id),
                },
            ]
        );
    };

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>🏷️</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.name}>{categoria.nombre}</Text>
                <Text style={styles.id}>ID: {categoria.id}</Text>
            </View>
            
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => onEdit(categoria)}
                >
                    <Ionicons name="pencil" size={16} color="#2196F3" />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                >
                    <Ionicons name="trash" size={16} color="#F44336" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E8F5E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    id: {
        fontSize: 12,
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    editButton: {
        backgroundColor: '#E3F2FD',
        borderColor: '#2196F3',
    },
    deleteButton: {
        backgroundColor: '#FFEBEE',
        borderColor: '#F44336',
    },
});