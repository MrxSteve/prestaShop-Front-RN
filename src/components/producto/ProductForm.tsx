import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useImagePicker } from '../../hooks/useImagePicker';
import { categoryService } from '../../services/categoryService';
import { CategoriaResponse } from '../../types/catalog';
import { EstadoProducto, ImagenLocal, ProductoImagenRequest, ProductoResponse } from '../../types/producto';

interface ProductFormProps {
    producto?: ProductoResponse | null;
    onSave: (producto: ProductoImagenRequest, imagen?: ImagenLocal) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    producto,
    onSave,
    onCancel,
    loading = false,
}) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [estado, setEstado] = useState<EstadoProducto>(EstadoProducto.DISPONIBLE);
    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
    const [imagen, setImagen] = useState<ImagenLocal | null>(null);
    const [loadingCategorias, setLoadingCategorias] = useState(false);
    
    const { showImagePicker } = useImagePicker();

    // Cargar categorías al inicializar
    useEffect(() => {
        loadCategorias();
    }, []);

    // Llenar form si es edición
    useEffect(() => {
        if (producto) {
            setNombre(producto.nombre);
            setDescripcion(producto.descripcion || '');
            setPrecioUnitario(producto.precioUnitario.toString());
            setEstado(producto.estado);
            setCategoriaId(producto.categoria.id);
        }
    }, [producto]);

    const loadCategorias = async () => {
        try {
            setLoadingCategorias(true);
            const response = await categoryService.listarTodas(0, 100); // Cargar todas las categorías
            setCategorias(response.content);
        } catch (error) {
            console.error('Error loading categorias:', error);
            Alert.alert('Error', 'No se pudieron cargar las categorías');
        } finally {
            setLoadingCategorias(false);
        }
    };

    const handleSelectImage = async () => {
        try {
            const selectedImage = await showImagePicker();
            if (selectedImage) {
                setImagen(selectedImage);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const handleRemoveImage = () => {
        Alert.alert(
            'Quitar imagen',
            '¿Estás seguro de que deseas quitar la imagen?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Quitar', onPress: () => setImagen(null) },
            ]
        );
    };

    const validateForm = (): string | null => {
        if (!nombre.trim()) {
            return 'El nombre del producto es requerido';
        }
        if (nombre.length > 255) {
            return 'El nombre no debe exceder 255 caracteres';
        }
        if (!precioUnitario.trim()) {
            return 'El precio es requerido';
        }
        const precio = parseFloat(precioUnitario);
        if (isNaN(precio) || precio <= 0) {
            return 'El precio debe ser un valor válido mayor a 0';
        }
        if (!categoriaId) {
            return 'Debe seleccionar una categoría';
        }
        return null;
    };

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            Alert.alert('Error de validación', validationError);
            return;
        }

        try {
            const productoData: ProductoImagenRequest = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || undefined,
                precioUnitario: parseFloat(precioUnitario),
                estado,
                categoriaId: categoriaId!,
            };

            await onSave(productoData, imagen || undefined);
        } catch (error) {
            // El error se maneja en el componente padre
            console.error('Error in form:', error);
        }
    };

    const getEstadoOptions = () => [
        { label: 'Disponible', value: EstadoProducto.DISPONIBLE },
        { label: 'No Disponible', value: EstadoProducto.NO_DISPONIBLE },
        { label: 'Descontinuado', value: EstadoProducto.DESCONTINUADO },
    ];

    const isEditing = !!producto;
    const title = isEditing ? 'Editar Producto' : 'Nuevo Producto';

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                {/* Campo Nombre */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Ingresa el nombre del producto"
                        maxLength={255}
                        editable={!loading}
                    />
                </View>

                {/* Campo Descripción */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={descripcion}
                        onChangeText={setDescripcion}
                        placeholder="Describe el producto (opcional)"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        editable={!loading}
                    />
                </View>

                {/* Campo Precio */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Precio Unitario *</Text>
                    <TextInput
                        style={styles.input}
                        value={precioUnitario}
                        onChangeText={setPrecioUnitario}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        editable={!loading}
                    />
                </View>

                {/* Campo Categoría */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Categoría *</Text>
                    {loadingCategorias ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#4CAF50" />
                            <Text style={styles.loadingText}>Cargando categorías...</Text>
                        </View>
                    ) : (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={categoriaId}
                                onValueChange={(value: number | null) => setCategoriaId(value)}
                                enabled={!loading}
                                style={styles.picker}
                            >
                                <Picker.Item label="Selecciona una categoría" value={null} />
                                {categorias.map((categoria) => (
                                    <Picker.Item
                                        key={categoria.id}
                                        label={categoria.nombre}
                                        value={categoria.id}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                </View>

                {/* Campo Estado */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Estado *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={estado}
                            onValueChange={(value: EstadoProducto) => setEstado(value)}
                            enabled={!loading}
                            style={styles.picker}
                        >
                            {getEstadoOptions().map((option) => (
                                <Picker.Item
                                    key={option.value}
                                    label={option.label}
                                    value={option.value}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Campo Imagen */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Imagen del Producto</Text>
                    
                    {imagen || producto?.imagenUrl ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image
                                source={{ uri: imagen?.uri || producto?.imagenUrl }}
                                style={styles.imagePreview}
                            />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={handleRemoveImage}
                                disabled={loading}
                            >
                                <Ionicons name="close-circle" size={24} color="#F44336" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.imagePlaceholder}
                            onPress={handleSelectImage}
                            disabled={loading}
                        >
                            <Ionicons name="camera" size={40} color="#ccc" />
                            <Text style={styles.imagePlaceholderText}>
                                Toca para agregar imagen
                            </Text>
                        </TouchableOpacity>
                    )}
                    
                    {(imagen || producto?.imagenUrl) && (
                        <TouchableOpacity
                            style={styles.changeImageButton}
                            onPress={handleSelectImage}
                            disabled={loading}
                        >
                            <Ionicons name="camera" size={16} color="#4CAF50" />
                            <Text style={styles.changeImageText}>Cambiar imagen</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>
                            {isEditing ? 'Actualizar' : 'Crear Producto'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
        flex: 1,
        padding: 20,
    },
    fieldContainer: {
        marginBottom: 20,
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
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    loadingText: {
        marginLeft: 8,
        color: '#666',
    },
    imagePreviewContainer: {
        position: 'relative',
        alignSelf: 'flex-start',
    },
    imagePreview: {
        width: 120,
        height: 120,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    imagePlaceholderText: {
        marginTop: 8,
        fontSize: 12,
        color: '#ccc',
        textAlign: 'center',
    },
    changeImageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        padding: 8,
    },
    changeImageText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    saveButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});