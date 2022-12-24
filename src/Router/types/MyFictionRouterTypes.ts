import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationScreenType } from './NavigationType';
import { uploadType } from '~/Store/UploadStore';

type MyFictionStackParamList = {
  SideBottomStack: { screen: string; params?: { type: string } };
  SideStack: {
    screen: string;
    params: {
      type?: string;
      userId?: number;
      navi?: 'Auth';
      selected?: null;
      currentType?: uploadType;
      fictionId?: number;
    };
  };
  UserBoard: {};
  // Viewer: { params: { currentType: 'Short'; fictionId: number } };
};

export type MyFictionNavigationStackProps = {
  navigation: StackNavigationProp<
    MyFictionStackParamList,
    Exclude<
      NavigationScreenType,
      | 'Viewer'
      | 'OtherBoard'
      | 'FictionIndex'
      | 'GenreSelect'
      | 'OtherFictionList'
    >
  >;
};
