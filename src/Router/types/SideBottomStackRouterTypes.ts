import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationScreenType } from './NavigationType';
import { RouterMoveType } from '@Router/types/RouterType';
import { FictionType } from '~/Components/types/FictionType';

// type ProfileScreenRouteProp = RouteProp<
//   RootStackParamList,
//   'SideBottomStack' | 'Main'
// >;

type SideBottomStackParamList = {
  SideBottomStack: { screen: string; params?: { type: string } };
  SideStack: {
    screen: string;
    params: {
      currentType?: FictionType;
      fictionId?: number | string;
      userId?: number | string;
    };
  };
  UserBoard: {};
  // Viewer: { params: { currentType: 'Short'; fictionId: number } };
};
// SIDESTACK = 'SideStack',
// SIDEBOTTOMSTACK = 'SideBottomStack',
// USERBOARD = 'UserBoard',
// OTHERBOARD = 'OtherBoard',
// FICTIONINDEX = 'FictionIndex',
// VIEWER = 'Viewer',
// GENRESELECT = 'GenreSelect',
// OTHERFICTIONLIST = 'OtherFictionList',
// RECENTVIEW = 'RecentView',
// GENREFICTION = 'GenreFiction',
// SHORTUPLOADED = 'short',
// RECENTUPLOADED = 'RecentUploaded',
// USERLIST = 'UserList',
// TAGLIST = 'TagList',
export type SideBottomNavigationStackProps = {
  navigation: StackNavigationProp<
    SideBottomStackParamList,
    Exclude<
      NavigationScreenType,
      | 'Viewer'
      | 'OtherBoard'
      | 'FictionIndex'
      | 'GenreSelect'
      | 'OtherFictionList'
    >
  >;
  route: {
    params: {
      type: RouterMoveType;
      id: number;
      fictionData: [];
    };
  };
};
