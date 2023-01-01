import React from 'react'
// screens - main
import MainScreen from '~/Screens/Main/MainScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const MainStack = createNativeStackNavigator()

export const MainRouter = (): JSX.Element => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  )
}
