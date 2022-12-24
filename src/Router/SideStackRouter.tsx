import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// screens
import GenreScreen from '~/Screens/Genre/GenreScreen'
import FictionIndexScreen from '~/Screens/FictionIndex/FictionIndexScreen'
import ViewScreen from '~/Screens/View/ViewScreen'
import UserBoardScreen from '~/Screens/UserBoard/UserBoardScreen'

const SideStack = createNativeStackNavigator()
const sideStackList = [
  { key: 0, name: 'GenreSelect', component: GenreScreen },
  { key: 1, name: 'FictionIndex', component: FictionIndexScreen },
  { key: 2, name: 'Viewer', component: ViewScreen },
  { key: 3, name: 'UserBoard', component: UserBoardScreen },
]

export const SideStackRouter = (): JSX.Element => (
  <SideStack.Navigator>
    {sideStackList?.map(sideStack => (
      <SideStack.Screen
        {...sideStack}
        options={{
          headerShown: false,
        }}
      />
    ))}
  </SideStack.Navigator>
)
