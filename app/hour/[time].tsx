import Icon from '@expo/vector-icons/Feather'
import { format, parse } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { Stack, useRouter, useSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AnimatePresence, MotiView } from 'moti'
import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  useState,
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native'
import { TapGestureHandler } from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Separator,
  Spacer,
  Square,
  styled,
  Text,
  useTheme,
  XStack,
  YStack,
  Progress,
} from 'tamagui'
import { useRomanCalendar } from '../../components/calendar'
import { Hour, HourSeason, HourWeekday, useGetHours } from '../../data/Hour'

function Chrome({
  isShown,
  time,
  progress,
}: {
  isShown: boolean
  time: string
  progress: number
}) {
  const router = useRouter()
  const { t } = useTranslation()
  const { currentDay } = useRomanCalendar()
  const { top, bottom } = useSafeAreaInsets()
  const { paper, paperTransparent } = useTheme()
  const colorScheme = useColorScheme()

  return (
    <>
      <StatusBar
        hidden={!isShown}
        animated
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <AnimatePresence>
        {isShown ? (
          <MotiView
            key="chrome"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: '100%',
              top: 0,
              position: 'absolute',
              zIndex: 2,
            }}
          >
            <LinearGradient
              colors={[paper.val, paper.val, paperTransparent.val]}
              locations={[0, 0.8, 1]}
              style={{
                width: '100%',
                height: top + 50,
                top: 0,
              }}
            />
            <View
              style={{
                top: top,
                height: top + 30,
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
              }}
            >
              <Text fontWeight="600" color="$color">
                {format(new Date(), 'EEEE')}
                {', '}
                {t(`time.${time}`)}
                {' － '}
                {t(currentDay?.cycles.psalterWeekName)}
              </Text>
            </View>
          </MotiView>
        ) : null}
        {isShown ? (
          <MotiView
            key="xButton"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.xButton}
          >
            <Pressable onPress={router.back}>
              <Icon name="x" size={16} color="rgba(255,255,255,0.75)" />
            </Pressable>
          </MotiView>
        ) : null}
        {isShown ? (
          <MotiView
            key="progress"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              bottom: 0,
              height: bottom + 20,
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              width: '100%',
            }}
          >
            <LinearGradient
              colors={[paperTransparent.val, paper.val, paper.val]}
              locations={[0, 0.2, 1]}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
            <XStack
              space="$1"
              width="100%"
              paddingHorizontal="$8"
              position="absolute"
              top="$3"
            >
              <Progress
                value={progress}
                size="$1"
                marginTop="$2"
                backgroundColor="$gray8"
              >
                <Progress.Indicator animation="lazy" backgroundColor="$red12" />
              </Progress>
            </XStack>
          </MotiView>
        ) : null}
      </AnimatePresence>
    </>
  )
}

const Hyphen = styled(Text, {
  color: '$red10',
})

const MainTitle = styled(Text, {
  fontFamily: '$serif',
  fontWeight: '$bold',
  color: '$gray12',
  fontSize: '$large',
  textAlign: 'center',
  marginBottom: '$6',
})

const BodyText = styled(Text, {
  fontFamily: '$serif',
  fontWeight: '$regular',
  fontSize: '$body',
  paddingVertical: '$2',
  color: '$color',
})

const SectionTitle = styled(Text, {
  fontSize: '$caption2',
  letterSpacing: '$wide',
  textTransform: 'uppercase',
  textAlign: 'center',
  width: '100%',
  marginVertical: '$4',
  color: '$red10',
  fontFamily: '$serif',
})

const PassageTitle = styled(Text, {
  fontSize: '$caption2',
  textAlign: 'center',
  width: '100%',
  marginVertical: '$4',
  color: '$red10',
  fontFamily: '$serif',
})

const AntiphonLabel = styled(Text, {
  fontFamily: '$serif',
  color: '$red10',
})

function Antiphon({ text, number }: { text: string; number?: number }) {
  const { t } = useTranslation()

  return (
    <XStack marginVertical="$2">
      <Square
        width={3}
        backgroundColor="$red7"
        borderRadius={50}
        marginRight="$2"
      />
      <BodyText paddingVertical={0}>
        <AntiphonLabel>{t('Ant. {{number}}', { number })}</AntiphonLabel>
        {'\t'}
        {text}
      </BodyText>
    </XStack>
  )
}

export default function Time() {
  const { paper } = useTheme()
  const { time } = useSearchParams<{ time: Hour['time'] }>()
  const { t } = useTranslation()
  const { currentDay } = useRomanCalendar()
  const [chromeShown, setChromeShown] = useState(false)
  const [progress, setProgress] = useState(0)

  const date = parse(currentDay.date, 'yyyy-MM-dd', new Date())

  const { data, isLoading } = useGetHours({
    time: 'MORNING_PRAYER',
    weekday: format(date, 'EEEE').toLowerCase() as HourWeekday,
    week: currentDay.cycles.psalterWeek.replace('WEEK_', ''),
    season: currentDay.seasons[0] as HourSeason,
    date: format(date, 'MM-dd'),
    martyrology: currentDay.martyrology.map((m) => m.id),
  })

  if (isLoading) return null

  const pagingMethod: ComponentProps<typeof PagingMethod>['method'] = 'scroll'

  const selectedHour = data?.[0]

  return (
    <YStack>
      <Stack.Screen
        options={{
          title: t(time),
          headerLargeTitle: false,
          contentStyle: { backgroundColor: paper.val },
        }}
      />
      <TapGestureHandler onEnded={() => setChromeShown(!chromeShown)}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          onScroll={({
            nativeEvent: {
              contentInset: { top, bottom },
              contentSize: { height },
              contentOffset: { y },
            },
          }) => {
            const progress = Math.round(
              ((y + top) / (height - top - bottom)) * 100
            )
            setProgress(Math.max(progress, 1))
          }}
          scrollEventThrottle={1000}
        >
          <SafeAreaView>
            <YStack
              paddingVertical="$8"
              paddingHorizontal="$7"
              width="100%"
              height="100%"
            >
              <MainTitle>{t(`time.${time}`)}</MainTitle>
              <BodyText
                marginTop="$-5"
                marginBottom="$5"
                textAlign="center"
                color="$red10"
                fontSize="$caption2"
              >
                {t(currentDay?.name)}
              </BodyText>
              <Trans
                parent={BodyText}
                i18nKey={`${time}.begin`}
                components={{ red: <Hyphen /> }}
              />
              {selectedHour?.hymn?.text?.length && (
                <>
                  <SectionTitle>{t('Hymn')}</SectionTitle>
                  <BodyText>{selectedHour?.hymn?.text?.join('\n\n')}</BodyText>
                  <Spacer height="$3" />
                </>
              )}
              {selectedHour?.psalms.length && (
                <>
                  <SectionTitle>{t('Psalmody')}</SectionTitle>
                  {selectedHour?.psalms.map((psalm, i) => (
                    <YStack key={psalm.antiphon} paddingVertical="$5">
                      {i !== 0 && (
                        <Separator
                          marginBottom="$5"
                          marginTop="$-5"
                          borderColor="$gray8"
                        />
                      )}
                      <Antiphon text={psalm.antiphon} number={i + 1} />

                      <PassageTitle>{psalm.passage}</PassageTitle>
                      <BodyText
                        textAlign="center"
                        paddingVertical="$1"
                        marginTop="$-3"
                        marginBottom="$2"
                        color="$red8"
                      >
                        {psalm.description}
                      </BodyText>
                      <BodyText fontStyle="italic">{psalm.note}</BodyText>
                      <BodyText>{psalm.text?.join('\n\n')}</BodyText>
                      {psalm.psalmPrayer && (
                        <>
                          <PassageTitle>{t('Psalm-prayer')}</PassageTitle>
                          <BodyText>{psalm.psalmPrayer}</BodyText>
                        </>
                      )}
                      <Trans
                        parent={BodyText}
                        defaults={psalm.text
                          ?.join('\n\n')
                          .replace('—', '<red>—</red>')}
                        components={{ red: <Hyphen /> }}
                      />
                      <Antiphon text={psalm.antiphon} />
                    </YStack>
                  ))}
                </>
              )}
              {selectedHour?.reading?.text?.length && (
                <>
                  <SectionTitle>{t('Reading')}</SectionTitle>
                  <PassageTitle
                    textAlign="center"
                    paddingVertical="$1"
                    marginTop="$-3"
                    marginBottom="$2"
                  >
                    {selectedHour?.reading?.passage}
                  </PassageTitle>
                  <BodyText>
                    {selectedHour?.reading?.text?.join('\n\n')}
                  </BodyText>
                </>
              )}
              {selectedHour?.responsory.length && (
                <>
                  <SectionTitle>{t('Responsory')}</SectionTitle>
                  {selectedHour?.responsory.map((responsory) => (
                    <YStack key={responsory} space>
                      <Trans
                        parent={BodyText}
                        defaults={responsory.replace('—', '<red>—</red>')}
                        components={{ red: <Hyphen /> }}
                      />
                    </YStack>
                  ))}
                </>
              )}
            </YStack>
          </SafeAreaView>
        </ScrollView>
      </TapGestureHandler>
      <Chrome isShown={chromeShown} time={time} progress={progress} />
    </YStack>
  )
}

type PagingMethodProps =
  | ({
      method: 'page' | never
    } & ComponentProps<typeof PagerView>)
  | ({
      method: 'scroll' | never
    } & ComponentProps<typeof ScrollView>)

const PagingMethod = forwardRef<
  ScrollView | PagerView,
  PropsWithChildren<PagingMethodProps>
>(({ method = 'page', children, ...props }, forwardedRef) => {
  return method === 'page' ? (
    <PagerView
      ref={forwardedRef as ForwardedRef<PagerView>}
      initialPage={0}
      overdrag
      style={styles.pager}
      {...(props as ComponentProps<typeof PagerView>)}
    >
      {children}
    </PagerView>
  ) : (
    <ScrollView ref={forwardedRef as ForwardedRef<ScrollView>} {...props}>
      {children}
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
  xButton: {
    position: 'absolute',
    zIndex: 5,
    top: 52,
    right: 10,
    borderRadius: 100,
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pageContainer: {
    borderRadius: 47.33,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.7,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 25,
    backgroundColor: 'rgba(255, 251, 244, 0.5)',
  },
  scrollContainer: {},
  main: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 32,
    paddingVertical: 40,
    justifyContent: 'flex-start',
  },
  mainTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    width: '100%',
    fontFamily: 'New York bold',
  },
  antiphon: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  labelPill: {
    width: 2,
    backgroundColor: '#c00c0085',
    borderRadius: 50,
  },
  label: {
    color: '#c00',
    fontFamily: 'New York',
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    width: '100%',
    marginVertical: 12,
    color: '#c00',
    fontFamily: 'New York',
  },
  description: {
    fontSize: 15,
    paddingVertical: 8,
  },
  note: {},
  title: {
    fontSize: 12,
    letterSpacing: 1.25,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    textTransform: 'uppercase',
    color: 'hsl(0, 60%, 20%)',
  },
  text: {
    fontSize: 15,
    paddingVertical: 8,
    fontFamily: 'New York',
    color: 'black',
  },
})
