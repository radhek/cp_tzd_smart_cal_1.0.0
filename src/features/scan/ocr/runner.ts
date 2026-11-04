import * as ImagePicker from 'expo-image-picker';
import { recognizeText } from 'expo-mlkit-ocr';
import { suggestCalculator } from '../parser/engine';
import { ParsedOCRResult } from '../parser/types';

import { Alert } from 'react-native';

export const pickImageAndRecognize = async (useCamera: boolean): Promise<ParsedOCRResult | null> => {
  try {
    let result: ImagePicker.ImagePickerResult;

    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to scan.');
        return null;
      }

      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required to choose an image.');
        return null;
      }

      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      
      // Perform OCR
      const recognized = await recognizeText(uri);
      
      if (!recognized || !recognized.text || recognized.text.trim().length === 0) {
        return {
          confidence: 'LOW',
          detectedInputs: {},
          sourceText: ''
        };
      }

      // Run through parser
      return suggestCalculator(recognized.text);
    }
  } catch (error) {
    console.error('OCR Error:', error);
  }

  return null;
};
