import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TestMode from '~/Screens/Test/TestMode'

const TestStack = createNativeStackNavigator()

export const TestRouter = (): JSX.Element => {
    return (
        <TestStack.Navigator>
            <TestStack.Screen
                name="Test"
                component={TestMode}
                options={{
                    headerShown: false,
                }}
            />
        </TestStack.Navigator>
    )
}
