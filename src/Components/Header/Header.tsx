import React from 'react'

// components
import MainHeader from './MainHeader'
import AuthHeader from './AuthHeader'
import GoBackHeader from './GoBackHeader'

export function Header({ route, navigation, onPress, onChangeText }: any) {
  const AuthNavi: string[] = [
    'Login',
    'DoLogin',
    'SignUp',
    'SignUpSecond',
    'GenreSelect',
    'RePassword',
  ]

  const { params, name } = route

  if (AuthNavi.includes(route.name)) {
    return (
      <AuthHeader navigation={navigation} name={route.name} title={params} />
    )
  } else if (route.name === 'Main') {
    return (
      <MainHeader navigation={navigation} name={route.name} title={params} />
    )
  } else {
    return (
      <GoBackHeader
        navigation={navigation}
        name={name}
        title={params}
        onPress={onPress}
        onChangeText={onChangeText}
      />
    )
  }
}
