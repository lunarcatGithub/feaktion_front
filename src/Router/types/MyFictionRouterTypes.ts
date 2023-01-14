import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NavigationScreenType } from './NavigationType'
import { uploadType } from '~/Store/UploadStore'
import { FictionType } from '~/Components/types/FictionType'

type MyFictionStackParamList = {
  SideBottomStack: { screen: string; params?: { type: string } }
  SideStack: {
    screen: string
    params: {
      type?: string
      userId?: number
      navi?: 'Auth'
      selected?: null
      currentType?: FictionType
      fictionId?: number
    }
  }
  UserBoard: {}
  // Viewer: { params: { currentType: 'Short'; fictionId: number } };
}

export type MyFictionNavigationStackProps = {
  navigation: NativeStackNavigationProp<
    MyFictionStackParamList,
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
  route: any
}
