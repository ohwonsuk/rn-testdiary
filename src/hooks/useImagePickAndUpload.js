import React, { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';

const useImagePickAndUpload = (allowsEditing) => {
  return useCallback(async () => {
    const imagePickResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing,
    })
    // console.log('imagepick', imagePickResult);
    if (imagePickResult.canceled) return;

    const pickPhotoResultArray = imagePickResult.assets.map((item) => {
      const uri = item.uri;
      const fileNameArray = uri.split('/');
      const fileName = fileNameArray[fileNameArray.length - 1];
      console.log(uri, fileName);
      return {
        uri: uri,
        fileName: fileName
      }
    })

    const putResultList = await Promise.all(
      pickPhotoResultArray.map((item) => {
        console.log(item);
        return storage().ref(item.fileName)
          .putFile(Platform.OS === 'ios' ? item.uri.replace('file://', '') : item.uri)
          .then((result) => storage().ref(result.metadata.fullPath).getDownloadURL());
      })
    )
    return putResultList;
  }, []);
}

export default useImagePickAndUpload;
