import React, {
  useState,
  createContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import { requestNotifications } from 'react-native-permissions'

import { ThemeProvider } from 'styled-components/native'

import SplashScreen from 'react-native-splash-screen'
import { QueryClient, QueryClientProvider } from 'react-query'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { setCustomText } from 'react-native-global-props'

// hooks
import usePermission from '@Hooks/usePermission'
import useAsyncStorage from '@Hooks/useAsyncStorage'

// router
import { MainRouter } from '@Router/MainRouter'
import { SideStackRouter } from '@Router/SideStackRouter'
import { SettingRouter } from '@Router/SettingRouter'
import { AuthStackRouter } from '@Router/AuthStackRouter'
import { UploadStackRouter } from '@Router/UploadStackRouter'
import { FictionListStackRouter } from '@Router/FictionListStackRouter'
import { ArchiveTopTabRouter } from '@Router/ArchiveTopTabRouter'
import { NotificationTopTabRouter } from '@Router/NotificationTopTabRouter'
import { SearchTopTabRouter } from '@Router/SearchTopTabRouter'
import { SideBottomStackRouter } from '@Router/SideBottomStackRouter'

// components
import UserBoardScreen from '@Screens/UserBoard/UserBoardScreen'
import { KeyboardAvoid } from '@Components/Layout'
import { Bottom } from '@Components/Bottom/Bottom'
import theme from '~/Styles/Theme'
// Store
import AllStores from '@Store/AllStores'
import Config from 'react-native-config'

const queryClient = new QueryClient()

// context or Reducer
const HOCStack = createNativeStackNavigator()
const RootStack = createNativeStackNavigator()
const BottomTabs = createBottomTabNavigator()

// types
type authPatch = {
  setUserToken: Dispatch<SetStateAction<boolean | undefined>>
  userToken: boolean | undefined
}

export const AuthContext = createContext<authPatch | null>(null)

const App = (): JSX.Element => {
  // hooks
  const [asyncHandler, _result] = useAsyncStorage()
  const [userToken, setUserToken] = useState<boolean | undefined>(undefined)
  console.log(Config.MODE)
  /**
   * 하단 탭 NAV 관리
   */
  const TabsBottomList = [
    { key: 0, name: 'Main', component: MainRouter },
    { key: 1, name: 'MyFictionList', component: FictionListStackRouter },
    // { key: 2, name: 'Upload', component: DummyStackScreen },
    { key: 3, name: 'Store', component: ArchiveTopTabRouter },
    { key: 4, name: 'UserBoard', component: UserBoardScreen },
    { key: 5, name: 'SideBottomStack', component: SideBottomStackRouter },
    { key: 6, name: 'Notification', component: NotificationTopTabRouter },
  ]

  const TabsBottom = () => (
    // bottom nav
    <BottomTabs.Navigator tabBar={props => <Bottom {...props} />}>
      {TabsBottomList?.map(tabsBottom => (
        <BottomTabs.Screen {...tabsBottom} />
      ))}
    </BottomTabs.Navigator>
  )

  /**
   * 모든 네비게이션이 통하는 관리 포인트
   */
  const HOCList = [
    { key: 0, name: 'Bottom', component: TabsBottom },
    // { key: 1, name: 'Notification', component: NotificationTopTabsScreen },
    { key: 2, name: 'Search', component: SearchTopTabRouter },
    { key: 3, name: 'Setting', component: SettingRouter },
    { key: 4, name: 'UploadFiction', component: UploadStackRouter },
    { key: 5, name: 'SideStack', component: SideStackRouter },
  ]

  const HOCScreen = () => (
    <HOCStack.Navigator>
      {HOCList?.map(hoc => (
        <HOCStack.Screen
          {...hoc}
          options={{
            headerShown: false,
          }}
        />
      ))}
    </HOCStack.Navigator>
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // token 자동 로그인
    setLoading(true)
    if (!_result?.result) {
      setLoading(false)
      setUserToken(false)
      return
    }
    const parse = JSON.parse(_result?.result)
    setUserToken(parse === 'true')
    setLoading(false)
  }, [_result])

  const AuthDivideScreen = (): JSX.Element => {
    // if (loading || userToken === undefined) {
    //   return <Splash />;
    // }
    return (
      <RootStack.Navigator>
        {userToken ? (
          <RootStack.Screen
            name="Main"
            component={HOCScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <RootStack.Screen
            name="Auth"
            component={AuthStackRouter}
            options={{ headerShown: false }}
          />
        )}
      </RootStack.Navigator>
    )
  }

  // Global styled
  const customTextProps = {
    style: {
      fontSize: 14,
      fontFamily: 'NotoSansCJKkr-Regular',
      lineHeight: 14 * 1.4,
    },
  }

  useEffect(() => {
    SplashScreen.hide()
    setCustomText(customTextProps)

    requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
      usePermission()
    })

    asyncHandler('GET', 'token')
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ setUserToken, userToken }}>
          <AllStores>
            <KeyboardAvoid>
              <NavigationContainer>
                <AuthDivideScreen />
              </NavigationContainer>
            </KeyboardAvoid>
          </AllStores>
        </AuthContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
