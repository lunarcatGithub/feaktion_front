import { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";

type returns = {
  imageUri: string | undefined;
  cameraImagePickHandler: any;
};

export default function useImagePick(): returns[] | undefined {
  const [imageUri, setImageUri] = useState<string | undefined>("");
  const [imageSize, setImageSize] = useState<number | undefined>(0);

  const cameraImagePickHandler = (): void => {
    const option: any = {
      title: "Select Avatar",
      customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
      mediaType: "photo",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    launchImageLibrary(option, (imageData) => {
      if (imageData?.assets) {
        setImageUri(imageData.assets[0].uri);
      }
    });
  };

  return [imageUri, cameraImagePickHandler, setImageUri];
}
