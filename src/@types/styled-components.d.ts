import 'styled-components'
import theme from './theme'

declare module 'styled-components' {
  export interface DefaultTheme {
    color: { [key in theme.color]: string }
    fontSize: { [key in theme.fontSize]: string }
    font: { [key in theme.font]: string }
  }
}
