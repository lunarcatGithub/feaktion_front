import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// screen
import MyFictionListScreen from '~/Screens/MyFictionList/MyFictionListScreen'
import ContentCover from '~/Screens/ContentCover/ContentCover'

const FictionListStack = createNativeStackNavigator()

export const FictionListStackRouter = (): JSX.Element => (
  <FictionListStack.Navigator>
    <FictionListStack.Screen
      name="MyFictionList"
      component={MyFictionListScreen}
      options={{
        headerShown: false,
      }}
    />
    <FictionListStack.Screen name="ContentCover" component={ContentCover} />
  </FictionListStack.Navigator>
)
