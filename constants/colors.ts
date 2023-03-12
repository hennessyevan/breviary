import { OpaqueColorValue, PlatformColor } from 'react-native'
import { Color } from 'romcal'

export const LITURGY_COLORS: Record<Color, string | OpaqueColorValue> = {
  RED: PlatformColor('systemRed') || '#c00',
  ROSE: '#f00',
  WHITE: '#fff',
  GREEN: '#0c0',
  BLACK: '#000',
  GOLD: '#ff0',
  PURPLE: PlatformColor('systemPurple') || '#800080',
}
