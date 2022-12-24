import uuid from "react-native-uuid";
import { Buffer } from "buffer";

// type
type imageType = {
  index: number;
  uri: string | undefined;
  base64: string | undefined;
  type: string | undefined;
}[];

type imagePromise = {
  index: number;
  name: string;
  buff: ArrayBufferLike;
  type: string;
}[];

export default async function bufferHandler(
  image: imageType
): Promise<imagePromise> {
  return new Promise((res, rej) => {
    const result: any = image?.map(({ index, base64, type }) => {
      if (!base64) return "";
      const uid = uuid.v4();
      const buff = Buffer.from(base64, "base64");
      return { index, name: uid, buff: buff?.buffer, type };
    });

    res(result);
  });
}
