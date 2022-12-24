import { componentType } from 'componentTypeModule';
import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';

type fictionCoverType = {
  title: string;
  desc: string;
  tag: string[];
  isPrivate: boolean;
  image: {
    index: number;
    uri: string | undefined;
    base64: string | undefined;
    type: string | undefined;
  }[];
  genre: string[];
};

type GenreArr = { index: number; title: string; value: string }[];

type imagePromise = {
  index: number;
  name: string;
  buff: ArrayBufferLike | any;
  type: string;
}[];

export enum uploadType {
  FICTION = 'Fiction',
  SHORT = 'Short',
  FICTIONMODIFY = 'FictionModify',
  SHORTMODIFY = 'ShortModify',
  EPISODE = 'Episode',
  EPISODEMODIFY = 'EpisodeModify',
  SAVED = 'Saved',
  NONE = '',
}
export type appType = {
  newFictionCover: fictionCoverType;
  setNewFictionCover: Dispatch<SetStateAction<fictionCoverType>>;
  fictionData: componentType._fictionDataType;
  setFictionData: Dispatch<SetStateAction<componentType._fictionDataType>>;
  currentScene: number;
  setCurrentScene: Dispatch<SetStateAction<number>>;
  bodyInputDetect: boolean;
  setBodyInputDetect: Dispatch<SetStateAction<boolean>>;
  partialOn: boolean;
  setPartialOn: Dispatch<SetStateAction<boolean>>;
  speechOn: boolean;
  setSpeechOn: Dispatch<SetStateAction<boolean>>;
  uploadFictionId: number | string | null;
  setUploadFictionId: Dispatch<SetStateAction<number | string | null>>;
  saveGenre: { id: number; genre: string }[] | [];
  setSaveGenre: Dispatch<SetStateAction<{ id: number; genre: string }[] | []>>;
  saveTags: { id: number; tag: string }[] | [];
  setSaveTags: Dispatch<SetStateAction<{ id: number; tag: string }[] | []>>;
  selectGenre: GenreArr;
  setSelectGenre: Dispatch<SetStateAction<GenreArr>>;
  bufferResult: imagePromise;
  setBufferResult: Dispatch<SetStateAction<imagePromise>>;
  removeTagsList: number[] | null;
  setRemoveTagsList: Dispatch<SetStateAction<number[] | null>>;
  currentType: uploadType;
  setCurrentType: Dispatch<SetStateAction<uploadType>>;
  modifyUploadData: any | null;
  setModifyUploadData: Dispatch<SetStateAction<any>>;
  initFictionData: fictionCoverType;
  currentEpisodeId: number | null;
  setCurrentEpisodeId: Dispatch<SetStateAction<number | null>>;
};

export const UploadContext = createContext<appType | null>(null);

export default function UploadStore({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  // upload value
  const initFictionData = {
    //  init 전용
    title: '',
    desc: '',
    tag: [],
    image:
      [
        {
          index: 0,
          uri: undefined,
          base64: '',
          type: '',
        },
      ] || undefined,
    genre: [],
    isPrivate: false,
  };
  const [newFictionCover, setNewFictionCover] =
    useState<fictionCoverType>(initFictionData);

  const [currentScene, setCurrentScene] = useState(0);
  const [bufferResult, setBufferResult] = useState<imagePromise>([
    { index: 0, name: '', buff: {}, type: '' },
  ]);

  // upload modify
  const [saveGenre, setSaveGenre] = useState<{ id: number; genre: string }[]>(
    [],
  );
  const [saveTags, setSaveTags] = useState<{ id: number; tag: string }[]>([]);
  const [selectGenre, setSelectGenre] = useState<GenreArr>([]);
  const [removeTagsList, setRemoveTagsList] = useState<number[] | null>([]);
  const [modifyUploadData, setModifyUploadData] = useState(null);

  // editor value
  const [fictionData, setFictionData] =
    useState<componentType._fictionDataType>({
      type: '',
      index: 0,
      episodeTitle: '',
      scene: [
        {
          index: 0,
          title: '',
          desc: '',
          background: { uri: undefined, base64: undefined, type: '' },
          size: 0,
        },
      ],
    });

  // upload current Id
  const [uploadFictionId, setUploadFictionId] = useState<
    number | string | null
  >(null);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<number | null>(null);

  // upload current type
  const [currentType, setCurrentType] = useState<uploadType>(uploadType.NONE);
  // input focus
  const [bodyInputDetect, setBodyInputDetect] = useState(false);
  const [partialOn, setPartialOn] = useState(false);

  const [speechOn, setSpeechOn] = useState(false);

  return (
    <UploadContext.Provider
      value={{
        // data
        newFictionCover,
        setNewFictionCover,

        // editor
        fictionData,
        setFictionData,
        bodyInputDetect,
        setBodyInputDetect,
        partialOn,
        setPartialOn,
        speechOn,
        setSpeechOn,

        // scene
        currentScene,
        setCurrentScene,
        // upload
        uploadFictionId,
        setUploadFictionId,
        // save data genre and tags
        saveGenre,
        setSaveGenre,
        saveTags,
        setSaveTags,
        selectGenre,
        setSelectGenre,
        bufferResult,
        setBufferResult,
        removeTagsList,
        setRemoveTagsList,
        modifyUploadData,
        setModifyUploadData,
        // type
        currentType,
        setCurrentType,
        initFictionData,
        // episodeId
        currentEpisodeId,
        setCurrentEpisodeId,
      }}>
      {children}
    </UploadContext.Provider>
  );
}
