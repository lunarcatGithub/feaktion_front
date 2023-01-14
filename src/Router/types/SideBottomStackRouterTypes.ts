import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NavigationScreenType } from './NavigationType'
import { RouterMoveType } from '@Router/types/RouterType'
import { FictionType } from '~/Components/types/FictionType'

// type ProfileScreenRouteProp = RouteProp<
//   RootStackParamList,
//   'SideBottomStack' | 'Main'
// >;

type SideBottomStackParamList = {
  SideBottomStack: {
    screen: string
    params?: { type: string; fictionData: any }
  }
  SideStack: {
    screen: string
    params: {
      currentType?: FictionType
      fictionId?: number | string
      userId?: number | string
    }
  }
  UserBoard: {}
  // Viewer: { params: { currentType: 'Short'; fictionId: number } };
}
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
  navigation: NativeStackNavigationProp<
    SideBottomStackParamList,
    Exclude<
      NavigationScreenType,
      | 'Viewer'
      | 'OtherBoard'
      | 'FictionIndex'
      | 'GenreSelect'
      | 'OtherFictionList'
      | 'SideStack'
      | 'SideBottomStack'
      | 'UserBoard'
      | 'Bottom'
      | 'Auth'
      | 'Login'
    >
  >
  route: {
    params: {
      type: RouterMoveType
      fictionData: any
      id: number
    }
  }
}
