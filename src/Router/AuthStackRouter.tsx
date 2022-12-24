import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// screens
import AuthMainScreen from '~/Screens/Auth/AuthMainScreen'
import LoginScreen from '~/Screens/Auth/LoginScreen'
import SignUpScreen from '~/Screens/Auth/SignUpScreen'
import SignUpSecondScreen from '~/Screens/Auth/SignUpSecondScreen'
import RePasswordScreen from '~/Screens/Auth/RePasswordScreen'
import PolicyTermsScreen from '~/Screens/Policy/PolicyTermsScreen'
import PolicyPrivacyScreen from '~/Screens/Policy/PolicyPrivacyScreen'

const AuthStack = createNativeStackNavigator()
const AuthStackList = [
  { key: 0, name: 'Login', component: AuthMainScreen },
  { key: 1, name: 'DoLogin', component: LoginScreen },
  { key: 2, name: 'SignUp', component: SignUpScreen },
  { key: 3, name: 'SignUpSecond', component: SignUpSecondScreen },
  { key: 4, name: 'RePassword', component: RePasswordScreen },
  { key: 5, name: 'PolicyTerms', component: PolicyTermsScreen },
  { key: 6, name: 'PolicyPrivacy', component: PolicyPrivacyScreen },
]

export const AuthStackRouter = (): JSX.Element => (
  <AuthStack.Navigator>
    {AuthStackList?.map(authStack => (
      <AuthStack.Screen
        {...authStack}
        options={{
          headerShown: false,
        }}
      />
    ))}
  </AuthStack.Navigator>
)
