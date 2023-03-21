import { createFont } from 'tamagui'
import { createMedia } from '@tamagui/react-native-media-driver'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
import { createTamagui } from 'tamagui'
import { createAnimations } from '@tamagui/animations-react-native'

const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },

  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },

  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
})

const serifFont = createFont({
  family: 'New York',
  size: {
    caption1: 11,
    caption2: 13,
    body: 15,
    large: 18,
  },
  lineHeight: {
    caption1: 13,
    caption2: 15,
    body: 18,
    large: 21,
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    normal: 1.15,
    wide: 1.5,
  },
  face: {
    400: { normal: 'New York', italic: 'New York Italic' },
    600: { normal: 'New York SemiBold' },
    700: { normal: 'New York Bold' },
  },
})

const config = createTamagui({
  animations,
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  fonts: {
    serif: serifFont,
  },

  themes: {
    ...themes,
    light: {
      ...themes.light,
      paper: 'hsl(40, 10%, 97%)',
      paperTransparent: 'hsla(40, 10%, 97%, 0)',
    },
    dark: {
      ...themes.dark,
      paper: 'hsl(40, 10%, 13%)',
      paperTransparent: 'hsla(40, 10%, 13%, 0)',
    },
  },

  tokens,

  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
})
export type AppConfig = typeof config
declare module 'tamagui' {
  // overrides TamaguiCustomConfig so your custom types

  // work everywhere you import `tamagui`

  interface TamaguiCustomConfig extends AppConfig {}
}
export default config
