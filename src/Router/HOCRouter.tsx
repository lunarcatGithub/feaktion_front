import React, { useContext, useEffect, useState } from 'react'
import { asyncStorageUtil, MethodEnum } from '@Utils/asyncStorageUtil'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

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
import { Bottom } from '@Components/Bottom/Bottom'
import SplashImageScreen from '@Components/SplashScreen'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContext } from '~/App'

// context or Reducer
const HOCStack = createNativeStackNavigator()
const RootStack = createNativeStackNavigator()
const BottomTabs = createBottomTabNavigator()

const HOCRouter = (): JSX.Element => {
  const { userToken, setUserToken } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  /**
   * HOC에 접근하기 전 로딩 스플래시 화면
   * user token이 있는지 먼저 요청
   */
  // const userData = useQuery(
  //   ['myProfile'],
  //   () => useFetch({ url: `/user`, method: 'get' }),
  //   { retry: true, enabled: userToken !== '' && userToken !== null }
  // )
  const loadingPointHandler = async () => {
    setIsLoading(true)
    const resultToken = await asyncStorageUtil({
      method: MethodEnum.GET,
      key: 'token',
    })
    if (resultToken === null) {
      setUserToken('')
      setIsLoading(false)
      return
    }
    setUserToken(resultToken)
    setIsLoading(false)
  }

  const TabsBottom = () => (
    // bottom nav
    <BottomTabs.Navigator tabBar={props => <Bottom {...props} />}>
      {TabsBottomList?.map(tabsBottom => (
        <BottomTabs.Screen
          options={{
            headerShown: false,
          }}
          {...tabsBottom}
        />
      ))}
    </BottomTabs.Navigator>
  )

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

  const authDivideScreen = (): JSX.Element => {
    // 루트 진입할 때 스플래시 이미지 보여주기
    if (isLoading) return <SplashImageScreen />
    return (
      <RootStack.Navigator>
        <RootStack.Screen
          name="Auth"
          component={AuthStackRouter}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    )
    // 메인 or login화면 진입 (토큰 가지고 있는지 여부)
    // return (
    //   <RootStack.Navigator>
    //     {userToken !== '' && (
    //       <RootStack.Screen
    //         name="Main"
    //         component={HOCScreen}
    //         options={{ headerShown: false }}
    //       />
    //     )}

    //     {userToken === '' && (
    //       <RootStack.Screen
    //         name="Auth"
    //         component={AuthStackRouter}
    //         options={{ headerShown: false }}
    //       />
    //     )}
    //   </RootStack.Navigator>
    // )
  }

  useEffect(() => {
    loadingPointHandler()
  }, [])

  return <NavigationContainer>{authDivideScreen()}</NavigationContainer>
}

export default HOCRouter
