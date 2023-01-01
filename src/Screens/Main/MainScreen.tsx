import React, { useContext, useEffect, useState } from 'react'
import { getUserAgent } from '~/Agent/UserAgent'

// components
import Main from '~/Components/Main/Main'
import { MainNavigationStackProps } from '~/Router/types/MainRouterTypes'
import { NavigationScreenType } from '~/Router/types/NavigationType'
import SplashImageScreen from '@Components/SplashScreen'
import { AuthContext } from '~/App'

export default function MainScreen({
  navigation,
}: MainNavigationStackProps): JSX.Element {
  const { userToken, setUserToken } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [userInterest, setUserInterest] = useState<null | []>(null)

  const userGetData = getUserAgent({
    key: ['userProfile'],
    url: `/user`,
    option: { retry: false },
  })

  const checkIsFirstSignin = () => {
    const userData = userGetData?.data?.user_interest
    setUserInterest(userData)
  }

  useEffect(() => {
    if (!userInterest) {
      checkIsFirstSignin()
    }
  }, [userGetData])

  useEffect(() => {
    // 토큰 요청에 없으면 로그인 화면으로 보내기
    if (userGetData?.isAuth === false) {
      setUserToken('')
      setIsLoading(false)
      return
    }

    if (!userInterest) return
    if (userInterest?.length <= 0) {
      setIsLoading(false)
      navigation.navigate(NavigationScreenType.SIDESTACK, {
        screen: NavigationScreenType.GENRESELECT,
        params: {
          navi: 'Auth',
          selected: null,
        },
      })
    }
    setIsLoading(false)
  }, [userInterest])

  if (isLoading) {
    return <SplashImageScreen />
  } else {
    return <Main navigation={navigation} />
  }
}
