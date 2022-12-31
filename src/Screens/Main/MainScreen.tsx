import React from 'react'

// components
import Main from '~/Components/Main/Main'
import { MainNavigationStackProps } from '~/Router/types/MainRouterTypes'

export default function MainScreen({
  isFirstSignin,
  navigation,
}: MainNavigationStackProps): JSX.Element {
  return <Main navigation={navigation} isFirstSignin={isFirstSignin} />
}
