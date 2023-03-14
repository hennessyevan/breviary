import { forwardRef } from 'react'
import { PlatformColor, Text as RNText, TextProps } from 'react-native'

export const Text = forwardRef<RNText, TextProps>((props, ref) => {
  return (
    <RNText
      {...props}
      ref={ref}
      style={{ color: PlatformColor('label'), ...(props.style as any) }}
    />
  )
})
