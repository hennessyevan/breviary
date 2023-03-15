import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { PlatformColor, Pressable, StyleSheet, Text } from 'react-native'
import { Hour } from '../data'

type HourTileProps = {
  time: Hour['time']
}

export function HourTile({ time }: HourTileProps) {
  const { t } = useTranslation()
  return (
    <Link
      asChild
      href={`/hour/${time}`}
      style={(state) => ({
        ...styles.container,
        ...(state.pressed && styles.containerPressed),
      })}
    >
      <Pressable>
        <Text style={styles.text}>{t(time)}</Text>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    paddingVertical: 24,
    backgroundColor: PlatformColor('systemGray5'),
  },
  containerPressed: {
    backgroundColor: PlatformColor('systemGray4'),
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: PlatformColor('label'),
  },
})
