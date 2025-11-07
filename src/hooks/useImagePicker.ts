// src/hooks/useImagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import { ImagenLocal } from '../types/producto';

function extFromMime(mime?: string) {
  if (!mime) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  return 'jpg';
}

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
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permisos de cámara para tomar fotos.');
        return resolve(null);
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a la galería.');
        return resolve(null);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleImageResult = (
    result: ImagePicker.ImagePickerResult,
    resolve: (image: ImagenLocal | null) => void
  ) => {
    if (result.canceled) return resolve(null);

    const asset = result.assets?.[0];
    if (!asset?.uri) return resolve(null);

    // ¡Clave! Usar mimeType real, no asset.type
    const mime = asset.mimeType || 'image/jpeg';
    const ext = extFromMime(mime);

    // filename con extensión
    const fileName =
      asset.fileName && asset.fileName.includes('.') ? asset.fileName : `image_${Date.now()}.${ext}`;

    const imagen: ImagenLocal = {
      uri: asset.uri,         // p.ej. file:///data/user/0/...
      type: mime,             // p.ej. image/jpeg
      name: fileName,         // p.ej. image_1730700000000.jpg
    };
    resolve(imagen);
  };

  return { showImagePicker };
};
