declare module 'componentTypeModule' {
  enum novelType {
    NOVEL = 'novel',
    SHORT = 'short',
    NOVELMODIFY = 'novelModify',
    SHORTMODIFY = 'shortModify',
    NONE = '',
  }
  export namespace componentType {
    type inputType = {
      secure?: boolean;
      placeholder?: string | undefined;
      removeBtn?: boolean;
      maxLength?: number | undefined;
      onChangeText: (
        text: NativeSyntheticEvent<TextInputChangeEventData>,
      ) => void;
      removeText?: () => void;
      value: string | undefined;
      multiline?: boolean;
      autoFocus?: boolean;
      type: string;
    };
    type _fictionSceneType = {
      index: number;
      title?: string;
      value: string;
      desc: string;
      background: string | undefined;
    };

    type _fictionDataType = {
      type: type;
      index: number;
      episodeTitle: string;
      scene: {
        index: number;
        title: string;
        desc: string;
        background: {
          uri: string | undefined;
          base64: string | undefined;
          type: string;
        };
        size: number;
      }[];
    };
  }
}
