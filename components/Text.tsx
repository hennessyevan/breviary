import { Text as TamaguiText, TextProps } from '@tamagui/core'
import { ComponentProps, forwardRef } from 'react'
import { Text as RNText } from 'react-native'

export const Text = forwardRef<RNText, ComponentProps<typeof TamaguiText>>(
  (props, ref) => {
    return <TamaguiText ref={ref} color="$gray1" {...props} />
  }
)
