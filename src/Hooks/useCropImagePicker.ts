import { useState } from 'react'
import { Platform } from 'react-native'
import ImagePicker, { ImageCropPicker } from 'react-native-image-crop-picker'

type imageType =
  | { uri: string | undefined; base64: string | undefined | null; type: string }
  | undefined
export default function useCropImagePicker(): [
  imageUrl: imageType,
  cameraImagePickHandler: () => void,
  imageSize: number | undefined
] {
  const [imageUri, setImageUri] = useState<imageType>({
    uri: undefined,
    base64: undefined,
    type: '',
  })
  const [imageSize, setImageSize] = useState<number | undefined>(0)

  const cameraImagePickHandler = (): void => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(({ data, mime, sourceURL, path, size }) => {
        setImageSize(size)
        setImageUri({
          uri: Platform.OS === 'ios' ? sourceURL : path,
          base64: data,
          type: mime,
        })
      })
      .catch(error => console.log(error))
  }

  return [imageUri, cameraImagePickHandler, imageSize]
}
