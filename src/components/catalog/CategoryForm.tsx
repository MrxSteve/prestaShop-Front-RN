import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CategoriaRequest, CategoriaResponse } from '../../types/catalog';

interface CategoryFormProps {
    categoria?: CategoriaResponse | null;
    onSave: (categoria: CategoriaRequest) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

interface FormData {
    nombre: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    categoria,
    onSave,
    onCancel,
    loading = false,
}) => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            nombre: categoria?.nombre || '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await onSave(data);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al guardar la categoría');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
                </Text>
                <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Nombre de la categoría</Text>
                <Controller
                    control={control}
                    name="nombre"
                    rules={{
                        required: 'El nombre es requerido',
                        minLength: {
                            value: 2,
                            message: 'El nombre debe tener al menos 2 caracteres'
                        },
                        maxLength: {
                            value: 50,
                            message: 'El nombre no puede exceder 50 caracteres'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                errors.nombre && styles.inputError
                            ]}
                            placeholder="Ingresa el nombre de la categoría"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            editable={!loading}
                        />
                    )}
                />
                {errors.nombre && (
                    <Text style={styles.errorText}>{errors.nombre.message}</Text>
                )}
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    <Ionicons 
                        name="checkmark" 
                        size={18} 
                        color="#fff" 
                        style={styles.buttonIcon}
                    />
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    form: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#F44336',
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});