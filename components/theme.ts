import { Theme } from '@react-navigation/native'
import { PlatformColor } from 'react-native'

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: 'white',
    card: 'white',
    text: 'black',
    border: PlatformColor('systemGray5'),
    notification: PlatformColor('systemRed'),
    primary: PlatformColor('systemBlue'),
  },
}

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: 'black',
    card: 'black',
    text: 'white',
    border: PlatformColor('systemGray5'),
    notification: PlatformColor('systemRed'),
    primary: PlatformColor('systemBlue'),
  },
}
