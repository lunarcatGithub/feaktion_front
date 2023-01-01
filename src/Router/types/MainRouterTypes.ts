import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { uploadType } from '~/Store/UploadStore'
import { NavigationScreenType } from './NavigationType'

type MainStackParamList = {
  SideBottomStack?: { screen: string; params?: { type: string } }
  Auth?: { screen: string; params?: { type: string } }
  SideStack: {
    screen: string
    params?: {
      type?: string
      userId?: number
      navi?: 'Auth'
      selected?: null
      currentType?: uploadType
      fictionId?: number
    }
  }
  UserBoard: {}
  // Viewer: { params: { currentType: 'Short'; fictionId: number } };
}

export type MainNavigationStackProps = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    Exclude<
      NavigationScreenType,
      | 'Viewer'
      | 'OtherBoard'
      | 'FictionIndex'
      | 'GenreSelect'
      | 'OtherFictionList'
      | 'Bottom'
      | 'Auth'
      | 'Login'
    >
  >
}
