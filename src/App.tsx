import React, {
    useState,
    createContext,
    useEffect,
    Dispatch,
    SetStateAction,
} from 'react'
import { requestNotifications } from 'react-native-permissions'

import { ThemeProvider } from 'styled-components/native'

import SplashScreen from 'react-native-splash-screen'
import { QueryClient, QueryClientProvider } from 'react-query'

import { setCustomText } from 'react-native-global-props'

// hooks
import usePermission from '@Hooks/usePermission'

// components
import { KeyboardAvoid } from '@Components/Layout'

import theme from '~/Styles/Theme'
// Store
import AllStores from '@Store/AllStores'
import HOCRouter from './Router/HOCRouter'

const queryClient = new QueryClient()

// types
type authPatch = {
    setUserToken: Dispatch<SetStateAction<string>>
    userToken: string
}

export const AuthContext = createContext<authPatch>({
    setUserToken: () => {},
    userToken: '',
})

const App = (): JSX.Element => {
    // hooks
    const [userToken, setUserToken] = useState<string>('')

    // Global styled
    const customTextProps = {
        style: {
            fontSize: 14,
            fontFamily: 'NotoSansCJKkr-Regular',
            lineHeight: 14 * 1.4,
        },
    }

    useEffect(() => {
        SplashScreen.hide()
        setCustomText(customTextProps)
        requestNotifications(['alert', 'sound']).then(
            ({ status, settings }) => {
                usePermission()
            }
        )
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <AuthContext.Provider value={{ setUserToken, userToken }}>
                    <AllStores>
                        <KeyboardAvoid>
                            <HOCRouter />
                        </KeyboardAvoid>
                    </AllStores>
                </AuthContext.Provider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App
