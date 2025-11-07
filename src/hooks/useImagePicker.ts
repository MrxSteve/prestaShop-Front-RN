import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { ImagenLocal } from '../types/producto';

export const useImagePicker = () => {
    const showImagePicker = (): Promise<ImagenLocal | null> => {
        return new Promise((resolve) => {
            Alert.alert(
                'Seleccionar imagen',
                'Elige una opción',
                [
                    { text: 'Cancelar', onPress: () => resolve(null), style: 'cancel' },
                    { text: 'Cámara', onPress: () => openCamera(resolve) },
                    { text: 'Galería', onPress: () => openGallery(resolve) },
                ],
                { cancelable: true }
            );
        });
    };

    const openCamera = async (resolve: (image: ImagenLocal | null) => void) => {
        try {
            // Pedir permisos de cámara
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos permisos de cámara para tomar fotos.');
                resolve(null);
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            handleImageResult(result, resolve);
        } catch (error) {
            console.error('Error opening camera:', error);
            Alert.alert('Error', 'No se pudo abrir la cámara');
            resolve(null);
        }
    };

    const openGallery = async (resolve: (image: ImagenLocal | null) => void) => {
        try {
            // Pedir permisos de galería
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a la galería.');
                resolve(null);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            handleImageResult(result, resolve);
        } catch (error) {
            console.error('Error opening gallery:', error);
            Alert.alert('Error', 'No se pudo abrir la galería');
            resolve(null);
        }
    };

    const handleImageResult = (result: ImagePicker.ImagePickerResult, resolve: (image: ImagenLocal | null) => void) => {
        if (result.canceled) {
            resolve(null);
            return;
        }

        if (result.assets && result.assets[0]) {
            const asset = result.assets[0];
            
            if (asset.uri) {
                const uriParts = asset.uri.split('.');
                const extension = uriParts.length > 1 ? uriParts[uriParts.length - 1].toLowerCase() : 'jpg';
                const fileName = asset.fileName || `image_${Date.now()}.${extension}`;
                
                let mimeType: string;
                if (asset.type && asset.type.includes('/')) {
                    mimeType = asset.type;
                } else {
                    switch (extension.toLowerCase()) {
                        case 'png':
                            mimeType = 'image/png';
                            break;
                        case 'gif':
                            mimeType = 'image/gif';
                            break;
                        case 'webp':
                            mimeType = 'image/webp';
                            break;
                        case 'jpg':
                        case 'jpeg':
                            mimeType = 'image/jpeg';
                            break;
                        default:
                            mimeType = 'image/jpeg';
                    }
                }

                const imagen: ImagenLocal = {
                    uri: asset.uri,
                    type: mimeType,
                    name: fileName,
                };
                
                resolve(imagen);
            } else {
                resolve(null);
            }
        } else {
            resolve(null);
        }
    };

    return {
        showImagePicker,
    };
};