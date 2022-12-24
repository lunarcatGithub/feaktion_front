export enum FictionType {
  SERIES = 'FictionSeries', // 장편 소설
  SHORT = 'FictionShort', // 단편 소설
}

export enum UploadType {
  SERIESUPLOAD = 'novel',
  SHORTUPLOAD = 'short',
  SERIESMODIFY = 'novelModify',
  SHORTMODIFY = 'shortModify',
}

export enum GenreType {
  Male = 'Male',
  FeMale = 'Female',
}

export type ListFictionType = {
  feaktion_id: number;
  feaktion_title: string;
  feaktion_thumb: string;
  feaktion_uploaddate: string;
  feaktion_type: 'novel' | 'short';
  feaktion_user: {
    id: string;
    nickname: string;
    user_id: number;
  };
  episode: {
    episode_uploaddate: string;
  }[];
  favorite_feaktion: [];
  _count: {
    episode: number;
    episode_like: number;
    favorite_feaktion: number;
    comment: number;
    reading_history: number;
  };
};

export type CommonFictionType = {
  feaktion_id: number;
  user_id: number;
  feaktion_thumb: string;
  feaktion_title: string;
  feaktion_description: string;
  feaktion_type: 'short' | 'novel';
  feaktion_pub: 'public' | 'private';
  feaktion_uploaddate: string;
  feaktion_updatedate: string;
  feaktion_tag: [];
  feaktion_user: {
    id: string;
    nickname: string;
    user_id: number;
  };
};

type CommonMergeCount = CommonFictionType & {
  _count: {
    comment: number;
    episode: number;
    episode_like: number;
    favorite_feaktion: number;
    reading_history: number;
  };
};

export type FictionGetDataType = {
  reading_id: number;
  episode_id: number;
  feaktion_id: number;
  user_id: number;
  reading_date: string;
  feaktion: CommonMergeCount;
};

export type MainType = {
  recent: FictionGetDataType[];
  interest_genres: CommonFictionType[];
  novels: ListFictionType[];
  shorts: ListFictionType[];
};
