import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// screens
import OtherFictionListScreen from '~/Screens/OtherFictionList/OtherFictionListScreen'

const SideBottomStack = createNativeStackNavigator()

export const SideBottomStackRouter = (): JSX.Element => (
  <SideBottomStack.Navigator>
    <SideBottomStack.Screen
      name="OtherFictionList"
      component={OtherFictionListScreen}
      options={{
        headerShown: false,
      }}
    />
  </SideBottomStack.Navigator>
)
