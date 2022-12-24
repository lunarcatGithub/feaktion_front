import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// screens
import MainSettingScreen from '~/Screens/Settings/MainSetting_Screen'
import ModifyPasswordSettingScreen from '~/Screens/Settings/ModifyPassword_SettingScreen'
import LinkAccountsSettingScreen from '~/Screens/Settings/LinkAccounts_SettingScreen'
import WithdrawalSettingScreen from '~/Screens/Settings/Withdrawal_SettingScreen'
import NotificationSetting from '~/Components/Settings/NotificationSetting'
import ModifyProfileSettingScreen from '~/Screens/Settings/ModifyProfile_SettingScreen'

const SettingStack = createNativeStackNavigator()
const SettingStackList = [
  { key: 0, name: 'MainSetting', component: MainSettingScreen },
  {
    key: 1,
    name: 'LinkAccountsSetting',
    component: LinkAccountsSettingScreen,
  },
  {
    key: 2,
    name: 'ModifyPasswordSetting',
    component: ModifyPasswordSettingScreen,
  },
  { key: 3, name: 'WithdrawalSetting', component: WithdrawalSettingScreen },
  { key: 4, name: 'NotificationSetting', component: NotificationSetting },
  {
    key: 5,
    name: 'ModifyProfileSetting',
    component: ModifyProfileSettingScreen,
  },
]

export const SettingRouter = (): JSX.Element => (
  <SettingStack.Navigator>
    {SettingStackList?.map(settingStack => (
      <SettingStack.Screen
        {...settingStack}
        options={{
          headerShown: false,
        }}
      />
    ))}
  </SettingStack.Navigator>
)
