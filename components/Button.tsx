import { ComponentProps, ForwardedRef, forwardRef } from 'react'
import { Button as RNButton } from 'react-native'
import { LITURGY_COLORS } from '../constants/colors'
import { useRomanCalendar } from './calendar'

export const Button = forwardRef<RNButton>(
  (props: ComponentProps<typeof RNButton>, ref) => {
    const { getLiturgicalDay } = useRomanCalendar()
    const currentDay = getLiturgicalDay()

    return (
      <RNButton
        color={LITURGY_COLORS[currentDay?.colors[0]]}
        ref={ref}
        {...props}
      />
    )
  }
)
